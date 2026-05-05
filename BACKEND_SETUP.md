# Backend Setup Instructions

## Quick Start

### 1. Navigate to backend folder

```bash
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment

```bash
cp .env.example .env
```

### 4. Configure MongoDB

Update `.env` with your MongoDB connection string. For local development:

```
MONGODB_URI=mongodb://localhost:27017/califitoga
```

You can also use MongoDB Atlas (cloud):

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/califitoga?retryWrites=true&w=majority
```

### 5. Run development server

```bash
npm run dev
```

The backend will start at `http://localhost:5000`

---

## Frontend Configuration

The frontend is already configured to use `http://localhost:5000` for development.

To change the API URL, update `.env.local`:

```
EXPO_PUBLIC_API_URL=http://localhost:5000  # or your production URL
```

---

## Deployment

### Backend Deployment (Render, Railway, Heroku, etc.)

1. Push the `backend` folder to your repo
2. Deploy from the backend directory
3. Set environment variables in your platform:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
   - `PORT=5000`

### Frontend Deployment

Update `.env.local` with your deployed backend URL and rebuild/redeploy your Expo app.

---

## Features

✓ User Registration & Login
✓ JWT Authentication
✓ Habit CRUD operations
✓ MongoDB Integration
✓ TypeScript Support
✓ Error Handling
✓ CORS Support
