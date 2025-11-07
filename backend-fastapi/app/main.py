import os
import jwt
from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from dotenv import load_dotenv

from .database import Base, engine, SessionLocal
from .models import User
from .schemas import RegisterRequest, LoginRequest, TokenResponse, UserResponse
from .auth import hash_password, verify_password, create_access_token, decode_token

load_dotenv()

app = FastAPI(title="Todo App API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
Base.metadata.create_all(bind=engine)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/api/health")
def health():
    return {"status": "OK", "message": "FastAPI backend server is running"}

@app.post("/api/auth/register", response_model=TokenResponse)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    # Check if user exists
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User already exists with this email")

    # Create new user
    user = User(
        name=payload.name,
        email=payload.email,
        password_hash=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Generate token
    token = create_access_token(user_id=user.id, email=user.email)

    return TokenResponse(
        message="User registered successfully",
        token=token,
        user=UserResponse(id=user.id, name=user.name, email=user.email),
    )

@app.post("/api/auth/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    # Find user
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Generate token
    token = create_access_token(user_id=user.id, email=user.email)

    return TokenResponse(
        message="Login successful",
        token=token,
        user=UserResponse(id=user.id, name=user.name, email=user.email),
    )

@app.get("/api/auth/me")
def get_current_user(request: Request, db: Session = Depends(get_db)):
    # Get token from Authorization header
    auth = request.headers.get("Authorization")
    if not auth or not auth.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Access token required")
    
    token = auth.split(" ")[1]

    try:
        # Decode token
        decoded = decode_token(token)
        user_id = decoded.get("userId")
        
        # Get user from database
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email
            }
        }
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=403, detail="Token has expired")
    except Exception as e:
        raise HTTPException(status_code=403, detail="Invalid or expired token")