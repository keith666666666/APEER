# APEER Backend

<div align="center">

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-6DB33F?style=for-the-badge&logo=spring-boot)
![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql)

**RESTful API with JWT Security & Microservice Integration**

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Security](#security)
- [Testing](#testing)

---

## 🎯 Overview

The APEER backend is a robust Spring Boot application that serves as the core business logic layer, handling authentication, evaluation management, analytics, and integration with the AI microservice.

### Key Features

- 🔐 **OAuth2 Authentication** - Google Workspace integration
- 🛡️ **JWT Security** - Stateless session management
- 📊 **RESTful API** - Clean, versioned endpoints
- 🤖 **AI Integration** - HTTP bridge to Python microservice
- 💾 **PostgreSQL** - Relational data persistence
- 📈 **Analytics Engine** - Real-time class metrics

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Spring Boot Backend                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │              Controllers Layer                   │  │
│  │  (REST Endpoints with @RestController)          │  │
│  └──────────────────┬───────────────────────────────┘  │
│                     │                                   │
│  ┌──────────────────▼───────────────────────────────┐  │
│  │              Service Layer                       │  │
│  │  (Business Logic, AI Integration)                │  │
│  └──────────────────┬───────────────────────────────┘  │
│                     │                                   │
│  ┌──────────────────▼───────────────────────────────┐  │
│  │              Repository Layer                    │  │
│  │  (JPA Repositories)                              │  │
│  └──────────────────┬───────────────────────────────┘  │
│                     │                                   │
│                     ▼                                   │
│              ┌──────────────┐                          │
│              │  PostgreSQL  │                          │
│              └──────────────┘                          │
│                                                         │
│  External Integration:                                 │
│  ┌──────────────────────────────────────────────────┐  │
│  │  AIServiceIntegration.java                       │  │
│  │  └──► HTTP POST → Flask AI Service (Port 5000)  │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Component         | Technology                      |
|-------------------|---------------------------------|
| Framework         | Spring Boot 3.2.0              |
| Language          | Java 17 (LTS)                  |
| Security          | Spring Security + OAuth2       |
| Database          | PostgreSQL 16                  |
| ORM               | Hibernate (JPA)                |
| Build Tool        | Maven 3.9                      |
| API Documentation | SpringDoc OpenAPI (Swagger)    |
| Testing           | JUnit 5 + Mockito              |
| HTTP Client       | RestTemplate / WebClient       |

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/apeer/
│   │   │   ├── ApeerApplication.java          # Main entry point
│   │   │   │
│   │   │   ├── controller/                    # REST Controllers
│   │   │   │   ├── AuthController.java
│   │   │   │   ├── EvaluationController.java
│   │   │   │   ├── StudentDashboardController.java
│   │   │   │   ├── TeacherAnalyticsController.java
│   │   │   │   ├── ActivityController.java
│   │   │   │   └── AdminController.java
│   │   │   │
│   │   │   ├── service/                       # Business Logic
│   │   │   │   ├── AuthService.java
│   │   │   │   ├── EvaluationService.java
│   │   │   │   ├── SentimentAnalysisService.java
│   │   │   │   ├── SummarizationService.java
│   │   │   │   ├── BiasDetectionService.java
│   │   │   │   ├── AnalyticsService.java
│   │   │   │   ├── ActivityService.java
│   │   │   │   ├── AdminService.java
│   │   │   │   └── AIServiceIntegration.java
│   │   │   │
│   │   │   ├── repository/                    # JPA Repositories
│   │   │   │   ├── UserRepository.java
│   │   │   │   ├── EvaluationRepository.java
│   │   │   │   ├── CommentRepository.java
│   │   │   │   ├── AnalyticsRepository.java
│   │   │   │   ├── ActivityRepository.java
│   │   │   │   └── RubricRepository.java
│   │   │   │
│   │   │   ├── model/                         # JPA Entities
│   │   │   │   ├── User.java
│   │   │   │   ├── Evaluation.java
│   │   │   │   ├── Comment.java
│   │   │   │   ├── Analytics.java
│   │   │   │   ├── EvaluationActivity.java
│   │   │   │   ├── Rubric.java
│   │   │   │   └── Tag.java
│   │   │   │
│   │   │   ├── dto/                           # Data Transfer Objects
│   │   │   │   ├── UserDTO.java
│   │   │   │   ├── EvaluationSubmissionDTO.java
│   │   │   │   ├── CommentAnalyticsDTO.java
│   │   │   │   ├── SummaryReportDTO.java
│   │   │   │   ├── DashboardMetricsDTO.java
│   │   │   │   ├── ClassAnalyticsDTO.java
│   │   │   │   └── UserSummaryDTO.java
│   │   │   │
│   │   │   ├── config/                        # Configuration
│   │   │   │   ├── SecurityConfig.java
│   │   │   │   ├── JwtConfig.java
│   │   │   │   ├── CorsConfig.java
│   │   │   │   └── SwaggerConfig.java
│   │   │   │
│   │   │   ├── security/                      # Security Components
│   │   │   │   ├── JwtUtil.java
│   │   │   │   ├── JwtAuthenticationFilter.java
│   │   │   │   └── OAuth2SuccessHandler.java
│   │   │   │
│   │   │   └── exception/                     # Exception Handling
│   │   │       ├── GlobalExceptionHandler.java
│   │   │       ├── ResourceNotFoundException.java
│   │   │       └── UnauthorizedException.java
│   │   │
│   │   └── resources/
│   │       ├── application.properties          # Main config
│   │       ├── application-dev.properties      # Dev config
│   │       ├── application-prod.properties     # Prod config
│   │       └── schema.sql                      # Database schema
│   │
│   └── test/
│       └── java/com/apeer/
│           ├── controller/                     # Controller tests
│           ├── service/                        # Service tests
│           └── integration/                    # Integration tests
│
├── pom.xml                                     # Maven dependencies
├── Dockerfile                                  # Container definition
└── README.md                                   # This file
```

---

## 🚀 Installation

### Prerequisites

- **Java 17** (OpenJDK or Oracle JDK)
- **Maven 3.9+**
- **PostgreSQL 16+**

### Clone and Build

```bash
# Navigate to backend directory
cd backend

# Clean and compile
mvn clean install

# Skip tests (for quick build)
mvn clean install -DskipTests
```

---

## ⚙️ Configuration

### Application Properties

Create `src/main/resources/application-dev.properties`:

```properties
# Server Configuration
server.port=8080
spring.application.name=apeer-backend

# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/apeer_db
spring.datasource.username=postgres
spring.datasource.password=your_password
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.properties.hibernate.format_sql=true

# JWT Configuration
jwt.secret=your-secret-key-min-256-bits-change-in-production
jwt.expiration=86400000

# Google OAuth2
spring.security.oauth2.client.registration.google.client-id=${GOOGLE_CLIENT_ID}
spring.security.oauth2.client.registration.google.client-secret=${GOOGLE_CLIENT_SECRET}
spring.security.oauth2.client.registration.google.scope=profile,email
spring.security.oauth2.client.registration.google.redirect-uri={baseUrl}/oauth2/callback/google

# AI Service Configuration
ai.service.url=http://localhost:5000
ai.service.timeout=30000

# CORS Configuration
cors.allowed.origins=http://localhost:5173,http://localhost:3000
cors.allowed.methods=GET,POST,PUT,DELETE,OPTIONS
cors.allowed.headers=*
cors.allow.credentials=true

# Logging
logging.level.com.apeer=DEBUG
logging.level.org.springframework.security=DEBUG
logging.level.org.hibernate.SQL=DEBUG
```

### Environment Variables

Set these in your shell or IDE:

```bash
export GOOGLE_CLIENT_ID="your-google-oauth-client-id"
export GOOGLE_CLIENT_SECRET="your-google-oauth-secret"
export DATABASE_URL="jdbc:postgresql://localhost:5432/apeer_db"
export JWT_SECRET="your-super-secret-jwt-key-min-256-bits"
```

---

## 🗄️ Database Schema

### Create Database

```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE apeer_db;

-- Connect to database
\c apeer_db;
```

### Schema (Auto-generated by Hibernate)

Key tables:

```sql
-- Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    account_status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Evaluations
CREATE TABLE evaluations (
    id SERIAL PRIMARY KEY,
    evaluator_id INT REFERENCES users(id),
    target_id INT REFERENCES users(id),
    activity_id INT REFERENCES evaluation_activities(id),
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comments
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    evaluation_id INT REFERENCES evaluations(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tags
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    comment_id INT REFERENCES comments(id),
    tag_name VARCHAR(100) NOT NULL
);

-- Analytics
CREATE TABLE analytics (
    id SERIAL PRIMARY KEY,
    comment_id INT REFERENCES comments(id),
    polarity_score FLOAT,
    usefulness_score INT,
    flagged BOOLEAN DEFAULT FALSE
);
```

---

## 📡 API Documentation

### Base URL

```
http://localhost:8080/api
```

### Authentication Endpoints

#### POST /api/auth/login
**Description**: Authenticate user with email

**Request Body**:
```json
{
  "email": "student@cit.edu"
}
```

**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "student@cit.edu",
  "role": "STUDENT",
  "name": "Juan Dela Cruz"
}
```

#### POST /api/auth/register
**Description**: Register new user

**Request Body**:
```json
{
  "email": "newuser@cit.edu",
  "name": "New User",
  "role": "STUDENT"
}
```

### Evaluation Endpoints

#### POST /api/evaluations/submit
**Description**: Submit peer evaluation

**Headers**: `Authorization: Bearer <JWT>`

**Request Body**:
```json
{
  "targetStudentId": 2,
  "activityId": 1,
  "rubricScores": {
    "communication": 4,
    "collaboration": 5,
    "reliability": 3
  },
  "commentContent": "Great team player with excellent communication skills."
}
```

**Response**:
```json
{
  "evaluationId": 123,
  "status": "SUCCESS",
  "aiTags": ["Constructive", "Specific", "Polite"]
}
```

### Dashboard Endpoints

#### GET /api/student/dashboard
**Description**: Get student dashboard metrics

**Headers**: `Authorization: Bearer <JWT>`

**Response**:
```json
{
  "overallScore": 87,
  "participationRate": 92,
  "sentimentTrend": [65, 72, 78, 85, 87],
  "feedbackSummary": {
    "strengths": "Exceptional leadership skills",
    "weaknesses": "Time management needs improvement",
    "themes": ["Collaborative", "Creative"]
  },
  "pendingReviews": 2
}
```

#### GET /api/teacher/analytics
**Description**: Get class analytics

**Headers**: `Authorization: Bearer <JWT>`

**Response**:
```json
{
  "classAverage": 82,
  "totalStudents": 24,
  "submissionRate": 88,
  "flaggedStudents": [
    {
      "id": 3,
      "name": "Pedro Garcia",
      "reason": "Score deviation > 2.5σ",
      "severity": "HIGH"
    }
  ]
}
```

### Full API Documentation

Access interactive Swagger UI at:
```
http://localhost:8080/swagger-ui.html
```

---

## 🔐 Security

### JWT Token Structure

```json
{
  "sub": "student@cit.edu",
  "role": "STUDENT",
  "iat": 1699564800,
  "exp": 1699651200
}
```

### Role-Based Access Control

| Role     | Permissions                                      |
|----------|--------------------------------------------------|
| STUDENT  | Submit evaluations, view own dashboard          |
| TEACHER  | Create activities, view class analytics         |
| ADMIN    | Manage users, system configuration              |

### Security Features

- ✅ **Password-less Authentication** (OAuth2)
- ✅ **JWT Stateless Sessions**
- ✅ **CORS Protection**
- ✅ **SQL Injection Prevention** (Parameterized Queries)
- ✅ **XSS Protection** (Content Security Policy)
- ✅ **HTTPS Enforcement** (Production)

---

## 🧪 Testing

### Run All Tests

```bash
mvn test
```

### Run Specific Test Class

```bash
mvn test -Dtest=EvaluationServiceTest
```

### Integration Tests

```bash
mvn verify -P integration-tests
```

### Test Coverage

```bash
mvn jacoco:report
# Report available at target/site/jacoco/index.html
```

---

## 🚀 Running the Application

### Development Mode

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Production Mode

```bash
# Build JAR
mvn clean package -DskipTests

# Run JAR
java -jar target/apeer-backend-1.0.0.jar --spring.profiles.active=prod
```

### Docker

```bash
# Build image
docker build -t apeer-backend .

# Run container
docker run -p 8080:8080 \
  -e DATABASE_URL=jdbc:postgresql://host.docker.internal:5432/apeer_db \
  -e JWT_SECRET=your-secret-key \
  apeer-backend
```

---

## 🐛 Troubleshooting

### Common Issues

**Issue**: Port 8080 already in use
```bash
# Find process using port
lsof -i :8080

# Kill process
kill -9 <PID>
```

**Issue**: Database connection failed
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Verify connection
psql -U postgres -h localhost -d apeer_db
```

**Issue**: Maven build fails
```bash
# Clean Maven cache
mvn dependency:purge-local-repository

# Rebuild
mvn clean install -U
```

---

## 📚 Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Security OAuth2](https://spring.io/guides/tutorials/spring-boot-oauth2/)
- [JPA/Hibernate Guide](https://hibernate.org/orm/documentation/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

## 📄 License

Part of the APEER academic project © 2025

---

<div align="center">

**Built with ☕ by the APEER Backend Team**

</div>

