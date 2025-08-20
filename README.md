# FitLogger - Fitness Tracking Platform

A comprehensive fitness tracking platform with a React frontend and Node.js/Express backend API.

## Table of Contents
1. [Project Overview](#project-overview)
2. [Backend API](#backend-api)
3. [Frontend Application](#frontend-application)
4. [Getting Started](#getting-started)
5. [API Endpoints](#api-endpoints)
6. [Database Schema](#database-schema)
7. [Development](#development)
8. [Deployment](#deployment)

## Project Overview

FitLogger is a fitness tracking platform that allows users to:
- Track their workouts and exercises
- Manage exercise library
- View workout history
- User authentication and profile management

The project consists of:
- **Backend**: Node.js/Express API with MongoDB database
- **Frontend**: React TypeScript application

## Backend API

The backend provides a RESTful API for fitness tracking functionality.

### Features
- User management (CRUD operations)
- Exercise library management
- Workout logging
- Data validation and error handling
- MongoDB Atlas integration

### Technology Stack
- Node.js
- Express.js
- Mongoose (MongoDB ODM)
- MongoDB Atlas

## Frontend Application

The frontend is built with React and TypeScript, providing a modern user interface for the fitness tracking platform.

### Features
- User authentication (login/signup)
- Exercise library browsing
- Workout logging interface
- History and analytics views
- User profile management

### Technology Stack
- React 18
- TypeScript
- CSS for styling
- Create React App

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account
- Python 3 (for database scripts)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure your MongoDB connection in `server.js`

4. Start the development server:
```bash
npm start
```
or
```bash
nodemon --exec node server.js
```

The API will be available at `http://localhost:4000`

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
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000)

## API Endpoints

The API provides the following endpoints:

| Endpoints | Actions | Description |
|-----------|---------|-------------|
| users | GET | Get list of users |
| | POST | Create a new user |
| users/:id | GET | Get specific user details |
| | PUT | Update user |
| | DELETE | Delete user |
| exercises | GET | Get list of exercises |
| | POST | Create a new exercise |
| exercises/:id | GET | Get specific exercise details |
| | PUT | Update exercise |
| | DELETE | Delete exercise |
| logs | GET | Get workout logs |
| | POST | Create a new workout log |
| logs/:id | GET | Get specific log details |
| | PUT | Update log |
| | DELETE | Delete log |

### Query Parameters

The API supports the following query parameters for GET requests:

| Parameter | Description |
|-----------|-------------|
| where | Filter results based on JSON query |
| sort | Sort results (1: ascending, -1: descending) |
| select | Include/exclude fields (1: include, 0: exclude) |
| skip | Number of results to skip |
| limit | Number of results to return |
| count | Return count instead of documents |

## Database Schema

### User Schema
- `name` - String (required)
- `email` - String (required, unique)
- `pendingTasks` - [String] - Array of pending task IDs
- `dateCreated` - Date (auto-generated)

### Exercise Schema
- `name` - String (required)
- `description` - String
- `category` - String
- `muscleGroups` - [String]
- `dateCreated` - Date (auto-generated)

### Log Schema
- `userId` - String (required)
- `exerciseId` - String (required)
- `sets` - Number
- `reps` - Number
- `weight` - Number
- `duration` - Number
- `date` - Date (auto-generated)

## Development

### Database Scripts

The backend includes Python scripts for database management:

**Clean Database:**
```bash
python3 backend/database_scripts/dbClean.py -u "localhost" -p 4000
```

**Populate Database:**
```bash
python3 backend/database_scripts/dbFill.py -u "localhost" -p 4000 -n 20 -t 100
```

### Available Scripts

#### Backend
- `npm start` - Start the development server
- `nodemon --exec node server.js` - Start with auto-restart

#### Frontend
- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Deployment

### Backend Deployment
1. Set up environment variables for production
2. Configure MongoDB Atlas with proper security settings
3. Deploy to your preferred hosting platform (Heroku, AWS, etc.)

### Frontend Deployment
1. Run `npm run build` to create production build
2. Deploy the `build` folder to your hosting platform
3. Configure environment variables for API endpoints

## Learn More

- [React documentation](https://reactjs.org/)
- [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [Express.js documentation](https://expressjs.com/)
- [Mongoose documentation](https://mongoosejs.com/)
