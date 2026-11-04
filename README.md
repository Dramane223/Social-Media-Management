# Full-Stack Integration (Social Media Management)

**Name:** Dramane Traore
**UID:** 24BCY70270

## Aim
To design and integrate frontend and backend components into a complete full-stack application.

## Objectives
- Understand full-stack system integration
- Connect the frontend with backend APIs
- Implement complete user workflows
- Enable seamless data exchange between components

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React (Vite), Redux Toolkit, React Router, Axios, Recharts |
| Backend | Java 17, Spring Boot 3, Spring Security, Spring Data JPA |
| Authentication | JWT (jjwt), BCrypt password hashing |
| Database | PostgreSQL 16 (Docker) |

## Features
- **Authentication:** register, login, logout with JWT; protected routes; session persistence
- **Post composer:** create drafts or scheduled posts, with a character counter
- **Scheduling:** schedule a draft, publish now (simulated), delete
- **Calendar:** monthly grid fed by the backend calendar endpoint
- **Analytics:** stat cards, charts per platform and status, top posts table
- **Error handling:** global Axios interceptor, toast notifications, error boundary, 404 page, loading spinners

## Project Structure
```
fullstack-integration/
├── backend/    Spring Boot REST API
└── frontend/   React application
```

## Prerequisites
- Java 17+ and Maven
- Node.js 18+ and npm
- Docker

## How to Run

### 1. Start PostgreSQL
```bash
docker run --name social-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=socialdb -p 5432:5432 -d postgres:16
```

### 2. Start the backend (http://localhost:8080)
```bash
cd backend
mvn spring-boot:run
```

### 3. Start the frontend (http://localhost:5173)
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Create an account, returns JWT | No |
| POST | `/api/auth/login` | Login, returns JWT | No |
| GET | `/api/auth/me` | Current user | Yes |
| POST | `/api/posts` | Create a post (draft or scheduled) | Yes |
| GET | `/api/posts` | List my posts | Yes |
| GET | `/api/posts/{id}` | Get one post | Yes |
| PUT | `/api/posts/{id}` | Update a post | Yes |
| DELETE | `/api/posts/{id}` | Delete a post | Yes |
| PUT | `/api/posts/{id}/schedule` | Schedule a post | Yes |
| POST | `/api/posts/{id}/publish` | Publish a post (simulated, generates metrics) | Yes |
| GET | `/api/posts/calendar?from=&to=` | Posts in a date range | Yes |
| GET | `/api/analytics/summary` | Totals and per-platform stats | Yes |
| GET | `/api/analytics/top-posts?limit=5` | Best published posts | Yes |

## Authentication Flow
1. The user registers or logs in; the backend returns a JWT.
2. The frontend stores the token in Redux and `localStorage`.
3. An Axios interceptor adds `Authorization: Bearer <token>` to every request.
4. A Spring Security filter validates the token on each request.
5. On `401`, the frontend clears the session and redirects to the login page.

## Notes
- Publishing is simulated: it marks the post as `PUBLISHED` and generates random likes, shares and reach.
- The JWT secret in `application.properties` is for development only; override it in production with the `APP_JWT_SECRET` environment variable.