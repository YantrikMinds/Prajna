from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from app.api.deps import get_db, get_current_active_admin
from app.models.user import User
from app.models.problem import Problem
from app.models.submission import Submission
from app.schemas.user import UserResponse

router = APIRouter()

@router.get("/users", response_model=List[UserResponse])
def get_all_users(
    current_admin: User = Depends(get_current_active_admin),
    db: Session = Depends(get_db)
):
    return db.query(User).all()

@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: int,
    current_admin: User = Depends(get_current_active_admin),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.id == current_admin.id:
        raise HTTPException(status_code=400, detail="Cannot delete your own admin account")
    db.delete(user)
    db.commit()
    return None

@router.get("/platform-analytics")
def get_platform_analytics(
    current_admin: User = Depends(get_current_active_admin),
    db: Session = Depends(get_db)
):
    total_users = db.query(User).count()
    total_problems = db.query(Problem).count()
    total_submissions = db.query(Submission).count()
    
    # Submissions by status count
    status_query = db.query(
        Submission.status, func.count(Submission.id)
    ).group_by(Submission.status).all()
    
    status_stats = {status_name: count for status_name, count in status_query}
    
    # Difficulties breakdown
    difficulty_query = db.query(
        Problem.difficulty, func.count(Problem.id)
    ).group_by(Problem.difficulty).all()
    
    difficulty_stats = {diff: count for diff, count in difficulty_query}

    return {
        "total_users": total_users,
        "total_problems": total_problems,
        "total_submissions": total_submissions,
        "status_stats": status_stats,
        "difficulty_stats": difficulty_stats
    }
