<<<<<<< HEAD
# Seminex 2 - Authentication System

A complete authentication system with login and registration functionality, built with React frontend and Node.js backend.

## Features

- ✅ User registration with email and password
- ✅ Password hashing using bcryptjs
- ✅ JWT token authentication
- ✅ Login functionality
- ✅ Protected dashboard route
- ✅ Modern and responsive UI
- ✅ MongoDB database integration
- ✅ Form validation
- ✅ Error handling

## Tech Stack

### Frontend
- React 19
- React Router DOM
- Axios for API calls
- Vite for build tooling

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- bcryptjs for password hashing
- jsonwebtoken for JWT authentication
- CORS for cross-origin requests

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB installed and running locally
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following content:
   ```
   MONGODB_URI=mongodb://localhost:27017/Seminex_2
   JWT_SECRET=your_jwt_secret_key_here
   PORT=5000
   ```

4. Start the backend server:
   ```bash
   npm start
   ```
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Request/Response Examples

#### Register
```json
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com"
  }
}
```

#### Login
```json
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com"
  }
}
```

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required),
  createdAt: Date,
  updatedAt: Date
}
```

## Features

### Security
- Passwords are hashed using bcryptjs with salt rounds of 10
- JWT tokens for authentication
- Protected routes with middleware
- Input validation and sanitization

### User Experience
- Modern, responsive design
- Form validation with error messages
- Loading states during API calls
- Automatic redirect after successful login/registration
- Persistent authentication state

### Error Handling
- Comprehensive error messages
- Network error handling
- Validation errors
- Authentication error handling

## File Structure

```
├── backend/
│   ├── controller/
│   │   └── authController.js
│   ├── model/
│   │   └── User.js
│   ├── middleware/
│   │   └── auth.js
│   ├── index.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── login.jsx
│   │   │   ├── reg.jsx
│   │   │   └── dashboard.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── index.html
└── README.md
```

## Usage

1. Start both backend and frontend servers
2. Navigate to `http://localhost:5173` (or the port shown by Vite)
3. Register a new account or login with existing credentials
4. After successful authentication, you'll be redirected to the dashboard
5. Use the logout button to sign out

## Development

- Backend runs on `http://localhost:5000`
- Frontend runs on `http://localhost:5173` (Vite default)
- MongoDB should be running on `localhost:27017`
- Database name: `Seminex_2`
- Collection name: `users`

## Notes

- Make sure MongoDB is running before starting the backend
- Update the JWT_SECRET in the .env file for production
- The frontend automatically handles token storage in localStorage
- All API calls include proper error handling
- The UI is fully responsive and works on mobile devices 
=======
# SemiNex
Seminar Portal - Emphasizes insightful gatherings
>>>>>>> f2fbb76ebacefcdba57410a9ad92744f12598129
