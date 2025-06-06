import certifi
from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from typing import List, Optional
import os
from datetime import datetime
import hashlib
from pydantic import BaseModel, EmailStr, Field
from dotenv import load_dotenv
from contextlib import asynccontextmanager
from src.dal import (
    ScholarshipDAL, 
    UserProfile,
    UserProfileUpdate,
    UserProfileResponse,
    Scholarship,
    AcademicMajor,
    AgeRange,
    Gender,
    FinancialNeed,
    GradePointAverageRange,
    SATScoreRange
)
from bson import ObjectId
from src.recommendation import generate_recommendations



# Load environment variables
load_dotenv()

# Environment variables
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "scholarship_db")

# Auth models
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    academic_major: Optional[AcademicMajor] = None
    age: Optional[AgeRange] = None
    gender: Optional[Gender] = None
    financial_need: Optional[FinancialNeed] = None
    grade_point_average: Optional[float] = Field(default=None, ge=0, le=4)
    sat_score: Optional[int] = Field(default=None, ge=0, le=1600)
    interests: Optional[List[str]] = None

# Database connection
client: AsyncIOMotorClient = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global client
    try:
        # Check if connecting to Atlas (mongodb+srv://)
        if MONGODB_URI.startswith("mongodb+srv://"):
            client = AsyncIOMotorClient(
                MONGODB_URI,
                tls=True,
                tlsCAFile=certifi.where()
            )
        else:
            # Local MongoDB (no SSL)
            client = AsyncIOMotorClient(MONGODB_URI,)
        
        await client.server_info()
        print("✅ Connected to MongoDB!")
        # Initialize indexes
        #dal = ScholarshipDAL(client[DATABASE_NAME]["users"], client[DATABASE_NAME]["scholarships"])
        #await dal.create_indexes()
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")
        raise
    yield
    if client:
        client.close()

app = FastAPI(
    title="Scholarship Finder API",
    description="API for managing scholarships and user profiles",
    version="1.0.0",
    lifespan=lifespan
)

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://frontend:3000",  # If using Docker Compose service names
]

app.add_middleware(
    CORSMiddleware,
   allow_origins=origins,  # ← Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Helper functions
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def get_dal() -> ScholarshipDAL:
    return ScholarshipDAL(
        user_collection=client[DATABASE_NAME]["users"],
        scholarship_collection=client[DATABASE_NAME]["scholarships"]
    )

# Authentication endpoints
@app.post("/register", response_model=UserProfileResponse)
async def register_user(user_data: UserRegister, dal: ScholarshipDAL = Depends(get_dal)):
    existing_user = await dal.user_collection.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(400, "Email already registered")
    
    user_dict = user_data.model_dump(exclude={"password"})
    user_profile = UserProfile(
        **user_dict,
        password=hash_password(user_data.password)
    )
    
    # Insert user
    result = await dal.user_collection.insert_one(user_profile.model_dump(by_alias=True))
    
    # Generate recommendations
    try:
        user = await dal.fetch_profile(str(result.inserted_id))
        recommended_scholarships = await generate_recommendations(user, dal)
        
        # Update with recommendations
        await dal.user_collection.update_one(
            {"_id": result.inserted_id},
            {"$set": {"recommend": recommended_scholarships}}
        )
        user = await dal.fetch_profile(str(result.inserted_id))
    except Exception as e:
        ohh=1
    
    return user


@app.post("/login", response_model=UserProfileResponse)
async def login_user(user_data: UserLogin, dal: ScholarshipDAL = Depends(get_dal)):
    user = await dal.user_collection.find_one({"email": user_data.email})
    if not user or user["password"] != hash_password(user_data.password):
        raise HTTPException(401, "Invalid credentials")
    
    user["_id"] = str(user["_id"])
    user.pop("password", None)
    return UserProfileResponse(**user)

# User endpoints
@app.get("/users/{user_id}", response_model=UserProfileResponse)
async def get_user(user_id: str, dal: ScholarshipDAL = Depends(get_dal)):
    user = await dal.fetch_profile(user_id)
    if not user:
        raise HTTPException(404, "User not found")
    return user

@app.put("/users/{user_id}", response_model=UserProfileResponse)
async def update_user(
    user_id: str, 
    update_data: UserProfileUpdate, 
    dal: ScholarshipDAL = Depends(get_dal)
):
    # Convert update data to dict
    update_dict = update_data.model_dump(exclude_unset=True)
    
    if 'password' in update_dict:
        update_dict['password'] = hash_password(update_dict['password'])
    
    # Update user
    updated_user = await dal.modify_profile(user_id, update_dict)
    
    # Generate new recommendations
    try:
        recommended_scholarships = await generate_recommendations(updated_user, dal)
        await dal.modify_profile(user_id, {"recommend": recommended_scholarships})
        updated_user = await dal.fetch_profile(user_id)
    except Exception as e:
        #print(f"Recommendation update error: {str(e)}")
        ohh=1
    
    return updated_user


@app.delete("/users/{user_id}")
async def delete_user(user_id: str, dal: ScholarshipDAL = Depends(get_dal)):
    success = await dal.delete_profile(user_id)
    if not success:
        raise HTTPException(404, "User not found")
    return {"message": "User deleted successfully"}

# Scholarship endpoints
@app.post("/scholarships", response_model=Scholarship)
async def create_scholarship(scholarship: Scholarship, dal: ScholarshipDAL = Depends(get_dal)):
    await dal.add_scholarship(scholarship)
    return scholarship

@app.get("/scholarships", response_model=List[Scholarship])
async def get_scholarships(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=1000),
    dal: ScholarshipDAL = Depends(get_dal)
):
    return await dal.fetch_all_scholarships(skip=skip, limit=limit)

@app.get("/scholarships/search", response_model=List[Scholarship])
async def search_scholarships(
    academic_majors: Optional[List[AcademicMajor]] = Query(None),
    age_ranges: Optional[List[AgeRange]] = Query(None),
    genders: Optional[List[Gender]] = Query(None),
    financial_needs: Optional[List[FinancialNeed]] = Query(None),
    dal: ScholarshipDAL = Depends(get_dal)
):
    filters = {}
    if academic_majors:
        filters["academic_major"] = {"$in": academic_majors}
    if age_ranges:
        filters["age"] = {"$in": age_ranges}
    if genders:
        filters["gender"] = {"$in": genders}
    if financial_needs:
        filters["financial_need"] = {"$in": financial_needs}
    
    return await dal.search_scholarships(filters)

@app.delete("/scholarships/{scholarship_id}")
async def delete_scholarship(scholarship_id: str, dal: ScholarshipDAL = Depends(get_dal)):
    success = await dal.delete_scholarship(scholarship_id)
    if not success:
        raise HTTPException(404, "Scholarship not found")
    return {"message": "Scholarship deleted"}

# Health check
@app.get("/health")
async def health_check():
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}

@app.get("/")
async def root():
    return {"message": "Scholarship Finder API is running."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
