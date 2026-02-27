# TODO Application Backend

## 1. Project overview
This project is a Node.js + Express backend for a Todo application with JWT-based authentication and role-based authorization.

Main capabilities:
- User registration and login
- Access token + refresh token flow
- Protected CRUD APIs for user-specific todos
- Admin-only API to list todos across users
- Swagger API documentation

## 2. Tech stack used & reasoning
- Node.js + Express: Lightweight and fast for building REST APIs.
- MongoDB + Mongoose: Flexible schema model, good fit for user/todo documents.
- JWT (`jsonwebtoken`): Stateless authentication using short-lived access tokens and longer-lived refresh tokens.
- `bcryptjs`: Secure password hashing before storing user credentials.
- `helmet`: Adds common HTTP security headers.
- `express-rate-limit`: Basic API abuse protection.
- `cors` + `cookie-parser`: Cross-origin support and cookie handling.
- Swagger (`swagger-jsdoc`, `swagger-ui-express`): Easy, self-serve API docs at runtime.
- Jest + Supertest: API/integration testing.

## 3. Setup instructions
### Environment variables
Create a `.env` file in the project root:

```env
MONGO_URI=<your-mongodb-connection-string>
PORT=3000
JWT_ACCESS_SECRET=<strong-random-secret>
JWT_REFRESH_SECRET=<different-strong-random-secret>
```

### Database configuration
Database connection is handled in `config/db.js` using `mongoose.connect(process.env.MONGO_URI)`.

### How to run the project locally

1. Clone the repo:
```bash
git clone https://github.com/Jeelgor/todo-application.git
```

2. Install dependencies:
```bash
npm install
```

3. Add your `.env` file.

4. Start the server:
```bash
npm start
```

Server starts on `http://localhost:<PORT>` (default in env is `3000`).

5. Open Swagger docs:
- `http://localhost:<PORT>/api/docs`

6. Run tests:
```bash
npm test
```

## Running with Docker

1. Start the application:
```bash
docker-compose up --build
```
2. Access the application

- API Base URL:
- `http://localhost:3000`

- Swagger documentation:
- `http://localhost:3000/api/docs`

## 4. Authentication flow explanation
1. Register
- `POST /api/auth/register` with email and password.
- Password is hashed with bcrypt before saving.

2. Login
- `POST /api/auth/login` validates credentials.
- Returns:
  - `accessToken` (JWT, expires in 15 minutes)
  - `refreshToken` (JWT, expires in 7 days)
- Refresh token is stored in the user document.

3. Access protected APIs
- Send header: `Authorization: Bearer <accessToken>`.
- `auth.middleware` verifies token and sets `req.user`.

4. Refresh access token
- `POST /api/auth/refresh` with `refreshToken`.
- Server verifies token, matches it with stored token, and issues a new access token.

5. Logout
- `POST /api/auth/logout` (protected route).
- Stored refresh token is cleared, invalidating future refresh attempts.

## 5. API endpoint list (brief description)
### Auth
- `POST /api/auth/register` - Register a new user.
- `POST /api/auth/login` - Login and receive access + refresh tokens.
- `POST /api/auth/refresh` - Exchange refresh token for a new access token.
- `POST /api/auth/logout` - Logout and clear stored refresh token.

### Todos (authenticated user)
- `POST /todos` - Create a todo for the logged-in user.
- `GET /todos` - List logged-in user todos (supports `page`, `limit`, `status`).
- `GET /todos/:id` - Get one todo owned by logged-in user.
- `PUT /todos/:id` - Update one owned todo.
- `DELETE /todos/:id` - Delete one owned todo.

### Admin
- `GET /admin/todos` - Admin-only endpoint to list todos across users.

### Utility
- `GET /health` - Health check endpoint.
- `GET /api/protected` - Example protected route returning decoded user payload.
- `GET /api/docs` - Swagger UI docs.

## 6. Assumptions & design decisions
- Access tokens are short-lived (15m) to reduce risk if leaked.
- Refresh tokens are long-lived (7d) and persisted per user for session continuation.
- Authorization model is role-based (`user`, `admin`) with middleware enforcement.
- Todo ownership is enforced at query level using `userId` filters.
- Input sanitization is applied in todo creation (`validator.escape`) to reduce basic injection/XSS vectors.
- Rate limiting and security headers are enabled globally for baseline API hardening.
- Tests are integration-style and rely on an active MongoDB connection configured through `.env`.
