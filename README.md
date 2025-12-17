# APEER - AI-Powered Peer Evaluation System

<div align="center">

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-6DB33F?style=for-the-badge&logo=spring-boot)
![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql)

**Fair. Efficient. Intelligent.**

A comprehensive peer evaluation platform with AI-powered feedback analysis, bias detection, and intelligent summarization.

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Components](#components)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## 🎯 Overview

APEER is a modern, full-stack peer evaluation system designed for educational institutions. It combines a beautiful React frontend, a robust Spring Boot backend, and an intelligent Python AI service to provide fair, efficient, and intelligent peer assessment.

### Key Features

- 🎨 **Modern UI** - Framer-style design with glassmorphism and fluid animations
- 🤖 **AI Analysis** - NLP-powered comment classification and sentiment analysis
- 📊 **Bias Detection** - Statistical analysis to identify anomalous grading patterns
- 📝 **Smart Summaries** - AI-generated feedback summaries with theme extraction
- 🔐 **Secure** - OAuth2 authentication with JWT-based sessions
- 👥 **Multi-Role** - Separate dashboards for Students, Teachers, and Admins

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                    │
│  Port: 5173 | Vite + Tailwind + Framer Motion         │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP/REST
┌──────────────────────▼──────────────────────────────────┐
│              Backend (Spring Boot)                      │
│  Port: 8080 | REST API + JWT + PostgreSQL              │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP
┌──────────────────────▼──────────────────────────────────┐
│            AI Service (Flask + Python)                  │
│  Port: 5000 | BERT + T5 + VADER + TextBlob            │
└─────────────────────────────────────────────────────────┘
```

### Technology Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion |
| **Backend** | Spring Boot 3.2, Java 17, PostgreSQL 16 |
| **AI Service** | Flask 3.0, Python 3.11, PyTorch, Transformers |
| **Database** | PostgreSQL 16 |
| **Authentication** | OAuth2 (Google), JWT |

---

## 📁 Project Structure

```
APEER/
├── frontend/                 # React frontend application
│   ├── src/                 # Source code
│   ├── public/              # Static assets
│   ├── package.json         # Dependencies
│   └── README.md            # Frontend documentation
│
├── backend/                  # Spring Boot backend API
│   ├── src/                 # Java source code
│   ├── pom.xml              # Maven dependencies
│   └── README.md            # Backend documentation
│
├── ai-service/              # Python AI microservice
│   ├── app/                 # Flask application
│   ├── models/              # ML model weights
│   ├── requirements.txt     # Python dependencies
│   └── README.md            # AI service documentation
│
├── docs/                    # Project documentation
│   ├── PROJECT_PROPOSAL.docx
│   ├── SRS.docx
│   └── SDD.docx
│
└── README.md                # This file
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ (for frontend)
- **Java** 17+ (for backend)
- **Python** 3.11+ (for AI service)
- **PostgreSQL** 16+ (for database)
- **Maven** 3.9+ (for backend)

### 1. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at **http://localhost:5173**

### 2. Backend Setup

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend will be available at **http://localhost:8080**

### 3. AI Service Setup

```bash
cd ai-service
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m flask run
```

AI Service will be available at **http://localhost:5000**

### 4. Database Setup

```sql
CREATE DATABASE apeer_db;
-- Backend will auto-create tables via Hibernate
```

---

## 🧩 Components

### Frontend (`/frontend`)

Modern React application with:
- **Landing Page** - Animated hero with authentication
- **Student Dashboard** - Performance metrics and evaluation forms
- **Teacher Dashboard** - Class analytics and activity management
- **Admin Dashboard** - User management and system configuration

**Tech Stack**: React 18, Vite, Tailwind CSS, Framer Motion, Recharts

📖 [Frontend Documentation](./frontend/README.md)

### Backend (`/backend`)

Spring Boot REST API providing:
- **Authentication** - OAuth2 + JWT token management
- **Evaluation Management** - CRUD operations for peer evaluations
- **Analytics** - Real-time class metrics and statistics
- **AI Integration** - HTTP bridge to Python AI service

**Tech Stack**: Spring Boot 3.2, Java 17, PostgreSQL, JPA/Hibernate

📖 [Backend Documentation](./backend/README.md)

### AI Service (`/ai-service`)

Python microservice for NLP processing:
- **Comment Classification** - BERT-based tagging (Constructive, Vague, etc.)
- **Sentiment Analysis** - VADER + TextBlob polarity scoring
- **Usefulness Scoring** - Custom algorithm for feedback quality
- **Summarization** - T5-based abstractive summaries

**Tech Stack**: Flask 3.0, PyTorch, Transformers, spaCy

📖 [AI Service Documentation](./ai-service/README.md)

---

## 💻 Development

### Running All Services

#### Option 1: Manual (Recommended for Development)

```bash
# Terminal 1: Frontend
cd frontend && npm run dev

# Terminal 2: Backend
cd backend && mvn spring-boot:run

# Terminal 3: AI Service
cd ai-service && python -m flask run
```

#### Option 2: Docker Compose (Coming Soon)

```bash
docker-compose up
```

### Environment Variables

Each component requires its own `.env` file:

**Frontend** (`frontend/.env`):
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_AI_SERVICE_URL=http://localhost:5000
VITE_USE_MOCK_DATA=false
```

**Backend** (`backend/application-dev.properties`):
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/apeer_db
jwt.secret=your-secret-key
ai.service.url=http://localhost:5000
```

**AI Service** (`ai-service/.env`):
```env
FLASK_APP=app
PORT=5000
USE_GPU=False
```

---

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
npm test
```

### Backend Tests
```bash
cd backend
mvn test
```

### AI Service Tests
```bash
cd ai-service
pytest tests/
```

---

## 🚀 Deployment

### Production Build

```bash
# Frontend
cd frontend
npm run build
# Output: frontend/dist/

# Backend
cd backend
mvn clean package
# Output: backend/target/apeer-backend-1.0.0.jar

# AI Service
cd ai-service
gunicorn -c gunicorn_config.py app:create_app()
```

### Deployment Options

- **Frontend**: Vercel, Netlify, or any static hosting
- **Backend**: AWS EC2, Google Cloud Run, Azure App Service
- **AI Service**: AWS Lambda, Google Cloud Functions, or containerized
- **Database**: AWS RDS, Google Cloud SQL, or self-hosted PostgreSQL

---

## 📊 API Endpoints

### Backend API (Port 8080)

- `POST /api/auth/login` - User authentication
- `POST /api/evaluations/submit` - Submit peer evaluation
- `GET /api/student/dashboard` - Student metrics
- `GET /api/teacher/analytics` - Class analytics
- `GET /api/admin/users` - User management

📖 Full API docs: http://localhost:8080/swagger-ui.html

### AI Service API (Port 5000)

- `POST /api/classify` - Classify comment tags
- `POST /api/analyze_sentiment` - Analyze sentiment & usefulness
- `POST /api/summarize` - Generate feedback summary

---

## 🤝 Contributing

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Style

- **Frontend**: Follow Airbnb React Style Guide
- **Backend**: Follow Google Java Style Guide
- **AI Service**: Follow PEP 8 Python Style Guide

### Component Checklist

- [ ] Code follows style guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No linting errors
- [ ] Responsive design (frontend)
- [ ] Error handling implemented

---

## 📚 Documentation

- [Frontend README](./frontend/README.md) - React app documentation
- [Backend README](./backend/README.md) - Spring Boot API documentation
- [AI Service README](./ai-service/README.md) - Python microservice documentation

---

## 🐛 Troubleshooting

### Common Issues

**Port conflicts**: Ensure ports 5173, 8080, and 5000 are available

**Database connection**: Verify PostgreSQL is running and credentials are correct

**CORS errors**: Check backend CORS configuration allows frontend origin

**AI service timeout**: Increase timeout in backend `application.properties`

---

## 📄 License

Part of the APEER academic project © 2025

---

## 👥 Team

Built by:
- Bajamunde, Louie V.
- Magpatoc, Mark Andrew G.
- Queddeng, James Adriane S.
- Rigodon, Keith Yancy A.
- Tabungar, Steven Jan M.

---

<div align="center">

**Built with ❤️ by the APEER Development Team**

[Frontend](./frontend/README.md) • [Backend](./backend/README.md) • [AI Service](./ai-service/README.md)

</div>
