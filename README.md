# Scholarship Finder

A comprehensive scholarship matching platform that helps students find relevant educational funding opportunities based on their academic profile, interests, and eligibility criteria.

## 🚀 Live Demo

Visit our deployed application:  [https://scholarshipfinderfrontend.onrender.com](https://scholarshipfinderfrontend.onrender.com) ( hosted on render )

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
- **Web Scraping:** BeautifulSoup
- **Containerization:** Docker
- **Deployment:** Render.com

---

## 📋 Prerequisites

- Docker and Docker Compose 
- MongoDB Atlas account (if using your own database)

---

## 📁 Project Structure

ScholarshipFinder/   
├── backend/   
│ ├── src/  
│ │ ├── dal.py                
│ │ ├── recommendation.py     # Matching algorithm logic  
│ │ └── server.py  
| |  
│ ├── scrapers/   
| |  
├── frontend/  
│ ├── React App  
| |  
├── compose.yaml              # Docker Compose orchestration file   

---

## 🛠️ Installation & Setup

### Using Docker 

1. **Clone the repository**

git clone https://github.com/Persive07/ScholarshipFinder.git  
cd ScholarshipFinder

2. **( Optional: Not required when using our database ) Environment Variables**

Create `backend/.env`:

MONGODB_URI=   
DATABASE_NAME=

( Or you could user our cluster for already scrapped data, but with very minimal database access )

Create `frontend/.env`:

REACT_APP_API_URL=  

> **Note:** .env files corresponding to our deployment have already been provided in the repository.

3. **Build and start the application**

docker compose build  
docker compose up -d

> **Note:** Make sure Docker Desktop is running on ur pc.

4. **Access the application**
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:8000](http://localhost:8000)
- API Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)

5. **Stopping the application**

docker compose down

---

## 🤖 Matching Algorithm

Our intelligent matching system evaluates scholarships based on multiple criteria:

1. **Eligibility Check:** Verifies if the user meets basic requirements (GPA, major, age, SAT score, etc.)
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
2. Follow the existing pattern in `scholarships.py`
3. Ensure data consistency with the scholarship schema
4. Run the python script while in the backend

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
