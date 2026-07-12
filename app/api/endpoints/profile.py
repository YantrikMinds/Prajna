from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.submission import Submission
from app.models.problem import Problem
from app.schemas.user import UserResponse

router = APIRouter()

@router.get("/dashboard-stats")
def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Solved problems count by difficulty
    # First, get distinct problem IDs solved by user
    subquery = db.query(Submission.problem_id).filter(
        Submission.user_id == current_user.id,
        Submission.status == "Accepted"
    ).distinct().subquery()
    
    solved_problems = db.query(Problem.difficulty, func.count(Problem.id)).filter(
        Problem.id.in_(subquery)
    ).group_by(Problem.difficulty).all()
    
    solved_counts = {"Easy": 0, "Medium": 0, "Hard": 0}
    for diff, count in solved_problems:
        solved_counts[diff] = count
        
    total_solved = sum(solved_counts.values())

    # Get leaderboard rank
    total_users_count = db.query(User).count()
    rank = db.query(User).filter(User.xp > current_user.xp).count() + 1

    # Heatmap activity: submissions grouped by date in the last year
    one_year_ago = datetime.now() - timedelta(days=365)
    heatmap_query = db.query(
        func.date(Submission.created_at).label("date"),
        func.count(Submission.id).label("count")
    ).filter(
        Submission.user_id == current_user.id,
        Submission.created_at >= one_year_ago
    ).group_by(
        func.date(Submission.created_at)
    ).all()
    
    heatmap_data = {date_str: count for date_str, count in heatmap_query if date_str}

    # Recent submissions (last 10)
    recent_subs = db.query(Submission).filter(
        Submission.user_id == current_user.id
    ).order_by(
        Submission.created_at.desc()
    ).limit(10).all()
    
    formatted_recent = []
    for sub in recent_subs:
        formatted_recent.append({
            "id": sub.id,
            "problem_id": sub.problem_id,
            "problem_title": sub.problem.title if sub.problem else "Unknown",
            "status": sub.status,
            "language": sub.language,
            "created_at": sub.created_at
        })

    # Weekly solve statistics for Chart.js
    seven_days_ago = datetime.now() - timedelta(days=7)
    weekly_query = db.query(
        func.date(Submission.created_at).label("date"),
        func.count(Submission.id).label("count")
    ).filter(
        Submission.user_id == current_user.id,
        Submission.status == "Accepted",
        Submission.created_at >= seven_days_ago
    ).group_by(
        func.date(Submission.created_at)
    ).all()
    
    weekly_chart_data = {date_str: count for date_str, count in weekly_query if date_str}

    return {
        "solved_counts": solved_counts,
        "total_solved": total_solved,
        "rank": rank,
        "total_users": total_users_count,
        "streak": current_user.streak,
        "xp": current_user.xp,
        "coins": current_user.coins,
        "badges": current_user.badges,
        "heatmap": heatmap_data,
        "recent_submissions": formatted_recent,
        "weekly_chart": weekly_chart_data
    }

@router.get("/leaderboard")
def get_global_leaderboard(
    limit: int = 50,
    db: Session = Depends(get_db)
):
    users = db.query(User).order_by(User.xp.desc()).limit(limit).all()
    leaderboard = []
    for idx, u in enumerate(users):
        leaderboard.append({
            "rank": idx + 1,
            "id": u.id,
            "full_name": u.full_name,
            "xp": u.xp,
            "streak": u.streak,
            "badges": u.badges
        })
    return leaderboard
