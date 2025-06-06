# Scholarship Finder

A comprehensive scholarship matching platform that helps students find relevant educational funding opportunities based on their academic profile, interests, and eligibility criteria.

## 🚀 Live Demo

Visit our application:  [https://scholarshipfinderfrontend.onrender.com](https://scholarshipfinderfrontend.onrender.com) ( deployed on render )

---

## 👥 Developed By

- Mahaswin
- Cherish
- Srivardhan
- Pranav Deshmukh

---

## 🌟 Features

- **Student Profile System**: Comprehensive input fields for course of study, GPA/grades, SAT score, interests, etc.
- **Intelligent Matching Algorithm**: Multi-factor matching system considering:
  - Eligibility requirements
  - Deadline urgency
  - Grant amount relevance scoring
  - Interest alignment
  - Sentiment analysis on scholarship descriptions
- **Web Scraping**: Automated collection of scholarship data from major platforms (currently Scholarships.com; more coming soon)
- **User Authentication**: Secure login and profile management

---

## 🏗️ Architecture

### Frontend
- **Framework:** React.js (HTML, CSS, JavaScript)
- **Deployment:** Dockerized container

### Backend
- **Framework:** FastAPI (Python)

### Database
- **Database:** MongoDB Atlas (Cloud)

### Additional Technologies
- **Sentiment Analysis:** VADER sentiment analyzer
- **Web Scraping:** BeautifulSoup for scholarship platforms
- **Containerization:** Docker
- **Deployment:** Render.com

---

## 📋 Prerequisites

- Docker and Docker Compose (**if using Docker**)
- Python 3.8+ (if running backend without Docker)
- MongoDB Atlas account (if using your own database)

---

## 📁 Project Structure

scholarship-finder/   
├── backend/   
│ ├── src/  
│ │ ├── dal.py                # Data access layer and DB logic  
│ │ ├── recommendation.py     # Matching algorithm logic  
│ │ └── server.py              
│ ├── scrapers/  
│ │ └── scholarships_com.py   
│ ├── requirements.txt    
│ └── Dockerfile   
├── frontend/  
│ ├── src/  
│ │ ├── pages/                # React components  
│ │ ├── App.js   
│ ├── package.json   
│ └── Dockerfile  
├── compose.yaml              # Docker Compose orchestration file  
├── README.md  
└── .gitignore  

---

## 🛠️ Installation & Setup

### Option 1: Using Docker (Recommended)

1. **Clone the repository**

git clone https://github.com/Persive07/ScholarshipFindergit
cd ScholarshipFinder

2. **Create environment files**

Create `backend/.env`:

MONGODB_URI=your_mongodb_connection_string
DATABASE_NAME=your_database_name

( Or you could user our cluster for already scrapped data, but with very minimal database access )

MONGODB_URI=mongodb+srv://developer:developer@cluster0.so1qg5r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
DATABASE_NAME=scholarship_db

Create `frontend/.env`:

REACT_APP_API_URL=http://localhost:8000

3. **Build and start the application**

docker compose build
docker compose up -d

4. **Access the application**
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:8000](http://localhost:8000)
- API Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### Option 2: Without Docker

#### Frontend Setup

1. Navigate to the frontend directory:

cd frontend

2. Install dependencies:

npm install

3. Create `.env` file:

4. Start the development server:

npm start


#### Backend Setup

1. Navigate to the backend directory:

cd backend

2. Create and activate a virtual environment:

python -m venv venv
source venv/bin/activate # On Windows: venv\Scripts\activate

3. Install Python dependencies:

pip install -r requirements.txt 

4. Create `.env` file:

5. Start the FastAPI server:

python src/server.py

---

## 🤖 Matching Algorithm

Our intelligent matching system evaluates scholarships based on multiple criteria:

1. **Eligibility Check:** Verifies if the user meets basic requirements (GPA, major, location, etc.)
2. **Deadline Validation:** Filters out expired scholarships and prioritizes urgent deadlines
3. **Relevance Scoring:** Assigns scores based on grant amount and scholarship type
4. **Interest Matching:** Compares user interests with scholarship focus areas
5. **Sentiment Analysis:** Uses VADER to analyze scholarship descriptions for positive sentiment indicators

---

## 📊 Current Data Sources

- **Scholarships.com**: Primary source for scholarship data  
_Credit to Scholarships.com for allowing us to use their data for educational purposes._
- *Future expansions planned for additional platforms*

⚠️ **Note:** Currently tailored for American universities and students.

---

## 🔧 Development

### Adding New Scrapers

To add new scholarship sources:

1. Create a new scraper file in `backend/scrapers/`
2. Follow the existing pattern in `scholarships_com.py`
3. Ensure data consistency with the scholarship schema
4. Test thoroughly before deployment

### API Endpoints

- `POST /register` - User registration
- `POST /login` - User authentication
- `GET /users/{user_id}` - Get user profile
- `PUT /users/{user_id}` - Update user profile
- `GET /scholarships` - Get all scholarships
- `GET /scholarships/search` - Search scholarships with filters

---

## 🐳 Docker Commands

Build containers

docker compose build
Start services

docker compose up -d
View logs

docker compose logs backend
docker compose logs frontend
Stop services

docker compose down
Rebuild with no cache

docker compose build --no-cache


---

## 🚀 Deployment

The application is containerized and can be deployed on various platforms:
- Render.com (current deployment)
- Heroku
- AWS ECS
- Google Cloud Run
- Any Docker-compatible platform

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🙏 Acknowledgments

- **Scholarships.com** for providing scholarship data and allowing us to use their platform for educational purposes
- VADER Sentiment Analysis tool for text analysis capabilities
- MongoDB Atlas for cloud database services
- The open-source community for the amazing tools and libraries

---

## 📄 License

This project is for educational purposes. Please respect the terms of service of scraped websites.

---

**Disclaimer:** This tool is designed for educational purposes. Users should verify scholarship information independently before applying. The scraping functionality should be used responsibly and in accordance with website terms of service.
