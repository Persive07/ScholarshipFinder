from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorCollection
from pymongo import ReturnDocument
from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Dict, Any
from enum import Enum

# ======================== ENUMS ========================
class AcademicMajor(str, Enum):
    AEROSPACE = "Aerospace Technologies and Engineering"
    ART = "Art"
    BUSINESS = "Business Management"
    CHEMICAL_ENG = "Chemical Engineering"
    CIVIL_ENG = "Civil Engineering"
    COMMUNICATIONS = "Communications"
    CHEMISTRY = "Chemistry"
    BIOCHEMISTRY = "Biochemistry"
    COMPUTER_SCIENCE = "Computer Science"
    CYBERSECURITY = "Cybersecurity"
    DENTISTRY = "Dentistry"
    DESIGN = "Design"
    ELECTRICAL_ENG = "Electrical Engineering"
    ELECTRONICS = "Electronics"
    FINANCE = "Finance"
    HUMANITIES = "Humanities"
    MECHANICAL_ENG = "Mechanical Engineering"
    MATHEMATICS = "Mathematics"
    MEDICINE = "Medicine"
    STATISTICS = "Statistics"

class AgeRange(str, Enum):
    AGE_13 = "13"
    AGE_14 = "14"
    AGE_15 = "15"
    AGE_16 = "16"
    AGE_17 = "17"
    AGE_18 = "18"
    AGE_19 = "19"
    AGE_20 = "20"
    AGE_21 = "21"
    AGE_22 = "22"
    AGE_23 = "23"
    AGE_24 = "24"
    AGE_25 = "25"
    AGE_26 = "26"
    AGE_27 = "27"
    AGE_28 = "28"
    AGE_29 = "29"
    AGE_30 = "30"
    AGE_OVER_30 = "Age Greater than 30"

class Gender(str, Enum):
    MALE = "Male"
    FEMALE = "Female"
    OTHER = "Other"

class FinancialNeed(str, Enum):
    REQUIRED = "Financial Need Required"
    NOT_REQUIRED = "Financial Need not Required"

class GradePointAverageRange(str, Enum):
    GPA_1_2 = "Minimum Grade Point Average From 1.0 To 2.0"
    GPA_2_1_2_5 = "Minimum Grade Point Average From 2.1 To 2.5"
    GPA_2_6_3_0 = "Minimum Grade Point Average From 2.6 To 3.0"
    GPA_3_1_3_5 = "Minimum Grade Point Average From 3.1 To 3.5"
    GPA_3_6_4_0 = "Minimum Grade Point Average From 3.6 To 4.0"

class SATScoreRange(str, Enum):
    SAT_400_1000 = "SAT Scores From 400 To 1,000"
    SAT_1001_1200 = "SAT Scores From 1,001 To 1,200"
    SAT_1201_1400 = "SAT Scores From 1,201 To 1,400"
    SAT_1401_1600 = "SAT Scores From 1,401 To 1,600"

# ======================== MODELS ========================

class Scholarship(BaseModel):
    id: str = Field(alias="_id")
    title: str
    link: str
    amount: Optional[str] = None
    due_date: Optional[str] = None
    description: Optional[str] = None
    details: Optional[List[str]] = None
    eligibility_criteria: Optional[List[str]] = None
    qualified_based_on: Optional[List[str]] = None
    academic_major: Optional[List[AcademicMajor]] = None
    age: Optional[List[AgeRange]] = None
    financial_need: Optional[List[FinancialNeed]] = None
    gender: Optional[List[Gender]] = None
    grade_point_average: Optional[List[GradePointAverageRange]] = None
    sat_score: Optional[List[SATScoreRange]] = None

    class Config:
        populate_by_name = True

class UserProfile(BaseModel):
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
    recommend: Optional[List[Scholarship]] = None

    class Config:
        populate_by_name = True

class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    password: Optional[str] = None
    academic_major: Optional[AcademicMajor] = None
    age: Optional[AgeRange] = None
    gender: Optional[Gender] = None
    financial_need: Optional[FinancialNeed] = None
    grade_point_average: Optional[float] = Field(default=None, ge=0, le=4)
    sat_score: Optional[int] = Field(default=None, ge=0, le=1600)
    interests: Optional[List[str]] = None  
    recommend: Optional[List[Scholarship]] = None

    class Config:
        populate_by_name = True

class UserProfileResponse(BaseModel):
    id: str = Field(alias="_id")
    name: str
    email: EmailStr
    academic_major: Optional[AcademicMajor] = None
    age: Optional[AgeRange] = None
    gender: Optional[Gender] = None
    financial_need: Optional[FinancialNeed] = None
    grade_point_average: Optional[float] = None
    sat_score: Optional[int] = None
    interests: Optional[List[str]] = None  
    recommend: Optional[List[Scholarship]] = None

    class Config:
        populate_by_name = True

# ================== DATA ACCESS LAYER ==================
class ScholarshipDAL:
    def __init__(self, user_collection: AsyncIOMotorCollection, scholarship_collection: AsyncIOMotorCollection):
        self.user_collection = user_collection
        self.scholarship_collection = scholarship_collection

    # User Operations
    async def add_profile(self, user_data: UserProfile) -> str:
        user_dict = user_data.model_dump(by_alias=True)
        result = await self.user_collection.insert_one(user_dict)
        return str(result.inserted_id)

    async def fetch_profile(self, user_id: str) -> Optional[Dict[str, Any]]:
        user = await self.user_collection.find_one({"_id": ObjectId(user_id)})
        if user:
            # Convert _id to string
            user["_id"] = str(user["_id"])
            # Convert recommend scholarships' _id to strings
            if "recommend" in user and isinstance(user["recommend"], list):
                for sch in user["recommend"]:
                    if "_id" in sch:
                        sch["_id"] = str(sch["_id"])
            user.pop("password", None)
        return user

    async def modify_profile(self, user_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        # Remove empty strings for optional fields
        for field in ['academic_major', 'age', 'gender', 'financial_need', 'grade_point_average', 'sat_score']:
            if field in update_data and update_data[field] == "":
                update_data[field] = None

        result = await self.user_collection.find_one_and_update(
            {"_id": ObjectId(user_id)},
            {"$set": update_data},
            return_document=ReturnDocument.AFTER
        )
        if result:
            result["_id"] = str(result["_id"])
            result.pop("password", None)
        return result

    async def delete_profile(self, user_id: str) -> bool:
        result = await self.user_collection.delete_one({"_id": ObjectId(user_id)})
        return result.deleted_count > 0

    # Scholarship Operations
    async def add_scholarship(self, scholarship_data: Scholarship) -> str:
        scholarship_dict = scholarship_data.model_dump(by_alias=True)
        result = await self.scholarship_collection.insert_one(scholarship_dict)
        return str(result.inserted_id)

    async def fetch_scholarship(self, link: str) -> Optional[Dict[str, Any]]:
        sch = await self.scholarship_collection.find_one({"link": link})
        if sch:
            sch["_id"] = str(sch["_id"])
        return sch

    async def fetch_all_scholarships(self, skip: int = 0, limit: int = 100) -> List[Dict[str, Any]]:
        cursor = self.scholarship_collection.find({}).skip(skip).limit(limit)
        scholarships = await cursor.to_list(length=limit)
        for sch in scholarships:
            sch["_id"] = str(sch["_id"])
        return scholarships

    async def search_scholarships(self, filters: Dict[str, Any]) -> List[Dict[str, Any]]:
        cursor = self.scholarship_collection.find(filters)
        scholarships = await cursor.to_list(length=1000)
        for sch in scholarships:
            sch["_id"] = str(sch["_id"])
        return scholarships

    # Index Management
    async def create_indexes(self):
        await self.scholarship_collection.create_index("link", unique=True)
        await self.scholarship_collection.create_index("academic_major")
        await self.scholarship_collection.create_index("age")
        await self.scholarship_collection.create_index("gender")
        await self.scholarship_collection.create_index("financial_need")
        await self.scholarship_collection.create_index("grade_point_average")
        await self.scholarship_collection.create_index("sat_score")
