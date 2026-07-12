from datetime import date, timedelta
import json
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.core.security import get_password_hash, verify_password, create_access_token
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, Token

router = APIRouter()

@router.post("/register", response_model=UserResponse)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="A user with this email already exists."
        )
    
    # Hash password and create user
    hashed_password = get_password_hash(user_in.password)
    db_user = User(
        email=user_in.email,
        hashed_password=hashed_password,
        full_name=user_in.full_name,
        role="user",
        xp=100,  # Starting bonus XP!
        coins=50,  # Starting bonus Coins!
        streak=1,
        last_active_date=date.today(),
        badges=json.dumps(["Welcome Member"])
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    # Retrieve user
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password"
        )
    
    # Update streak
    today = date.today()
    if user.last_active_date:
        delta = today - user.last_active_date
        if delta.days == 1:
            user.streak += 1
            user.xp += 10  # Reward for daily streak!
        elif delta.days > 1:
            user.streak = 1
    else:
        user.streak = 1
        
    user.last_active_date = today
    db.commit()
    db.refresh(user)

    # Generate token
    access_token = create_access_token(subject=user.email)
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login-json", response_model=Token)
def login_json(
    credentials: dict,
    db: Session = Depends(get_db)
):
    username = credentials.get("email")
    password = credentials.get("password")
    if not username or not password:
        raise HTTPException(status_code=400, detail="Email and password required")
        
    user = db.query(User).filter(User.email == username).first()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password"
        )
    
    today = date.today()
    if user.last_active_date:
        delta = today - user.last_active_date
        if delta.days == 1:
            user.streak += 1
            user.xp += 10
        elif delta.days > 1:
            user.streak = 1
    else:
        user.streak = 1
        
    user.last_active_date = today
    db.commit()
    db.refresh(user)

    access_token = create_access_token(subject=user.email)
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
def read_user_me(current_user: User = Depends(get_current_user)):
    return current_user
