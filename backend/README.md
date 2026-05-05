# Califitoga Backend

Node.js/Express backend for the Califitoga habit tracking app.

## Setup

### Prerequisites

- Node.js 16+
- MongoDB 4.0+
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create `.env` file from `.env.example`:

```bash
cp .env.example .env
```

3. Update `.env` with your configuration:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/califitoga
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

### Development

Run the development server:

```bash
npm run dev
```

The server will start at `http://localhost:5000`

### Build for Production

```bash
npm run build
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Habits (Protected Routes)

- `GET /api/habits` - Get all habits for user
- `POST /api/habits` - Create a new habit
- `GET /api/habits/:id` - Get specific habit
- `PUT /api/habits/:id` - Update habit
- `DELETE /api/habits/:id` - Delete habit

### Health Check

- `GET /api/health` - API health status

## Authentication

Include JWT token in Authorization header:

```
Authorization: Bearer <token>
```

## Project Structure

```
src/
├── index.ts           # Main server file
├── models/            # Database models
├── routes/            # API routes
├── middleware/        # Custom middleware
└── ...
```
