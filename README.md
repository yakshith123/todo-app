# Todo Application

A full-stack todo application built with modern web technologies.

## Features
- User authentication (registration and login)
- Todo management (create, read, update, delete)
- Due date tracking
- Search and filter functionality
- Responsive design

## Tech Stack
- **Frontend**: React, TypeScript, Redux Toolkit, CSS
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL


## Project Structure
```
.
├── backend-fastapi     # FastAPI backend
│   ├── app             # API endpoints and models
│   ├── requirements.txt # Python dependencies
│   └── .env            # Environment variables
├── src                 # React frontend
│   ├── components      # Reusable UI components
│   ├── features        # Feature-specific code
│   ├── hooks           # Custom React hooks
│   ├── schemas         # Validation schemas
│   ├── services        # API service layer
│   ├── store           # Redux store configuration
│   └── App.tsx         # Main application component
├── package.json        # Frontend dependencies
└── README.md           # This file
```

## Setup Instructions

### Frontend
1. Install dependencies: `npm install`
2. Run development server: `npm run dev`
3. Access at: http://localhost:5173

### Backend
1. Navigate to backend directory: `cd backend-fastapi`
2. Create virtual environment: `python -m venv .venv`
3. Activate virtual environment: `source .venv/bin/activate` (macOS/Linux) or `.venv\Scripts\activate` (Windows)
4. Install dependencies: `pip install -r requirements.txt`
5. Set up environment variables in `.env` file
6. Run server: `uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`
7. Access at: http://localhost:8000

## API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info
- `GET /api/health` - Health check

## Local Storage
The application uses local storage to persist:
- User authentication tokens
- Todo items (separated by user)

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request