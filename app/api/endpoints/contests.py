from datetime import datetime
from typing import List
import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user, get_current_active_admin
from app.models.contest import Contest, ContestParticipation
from app.models.problem import Problem
from app.models.user import User
from app.models.submission import Submission
from app.schemas.contest import ContestResponse, ContestCreate, LeaderboardEntry, ContestParticipationResponse
from app.schemas.submission import SubmissionCreate
from app.api.endpoints.submissions import submit_problem_code

router = APIRouter()

@router.get("/", response_model=List[ContestResponse])
def get_contests(
    active_only: bool = False,
    db: Session = Depends(get_db)
):
    query = db.query(Contest)
    if active_only:
        now = datetime.now()
        query = query.filter(Contest.start_time <= now, Contest.end_time >= now)
    return query.all()

@router.get("/{contest_id}", response_model=ContestResponse)
def get_contest(contest_id: int, db: Session = Depends(get_db)):
    contest = db.query(Contest).filter(Contest.id == contest_id).first()
    if not contest:
        raise HTTPException(status_code=404, detail="Contest not found")
    return contest

@router.get("/{contest_id}/problems", response_model=List[dict])
def get_contest_problems(
    contest_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    contest = db.query(Contest).filter(Contest.id == contest_id).first()
    if not contest:
        raise HTTPException(status_code=404, detail="Contest not found")
        
    # Check registration
    reg = db.query(ContestParticipation).filter(
        ContestParticipation.contest_id == contest_id,
        ContestParticipation.user_id == current_user.id
    ).first()
    
    if not reg:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You must register for the contest to view its problems"
        )
        
    problem_ids = [int(pid) for pid in contest.problem_ids.split(",") if pid.strip()]
    problems = db.query(Problem).filter(Problem.id.in_(problem_ids)).all()
    
    # Format list with only description details hidden (or keep visible)
    # Since it's a coding contest, we show problems as simple list
    return [
        {
            "id": p.id,
            "title": p.title,
            "difficulty": p.difficulty,
            "tags": p.tags,
            "description": p.description,
            "starter_code": p.starter_code
        }
        for p in problems
    ]

@router.post("/{contest_id}/register", response_model=ContestParticipationResponse)
def register_for_contest(
    contest_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    contest = db.query(Contest).filter(Contest.id == contest_id).first()
    if not contest:
        raise HTTPException(status_code=404, detail="Contest not found")
        
    # Check existing registration
    existing = db.query(ContestParticipation).filter(
        ContestParticipation.contest_id == contest_id,
        ContestParticipation.user_id == current_user.id
    ).first()
    
    if existing:
        return existing
        
    reg = ContestParticipation(
        contest_id=contest_id,
        user_id=current_user.id,
        score=0,
        details="{}"
    )
    db.add(reg)
    db.commit()
    db.refresh(reg)
    return reg

@router.post("/{contest_id}/submit-problem", response_model=dict)
async def submit_contest_problem(
    contest_id: int,
    payload: SubmissionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    contest = db.query(Contest).filter(Contest.id == contest_id).first()
    if not contest:
        raise HTTPException(status_code=404, detail="Contest not found")
        
    # Check if contest is active
    now = datetime.now()
    if now < contest.start_time:
        raise HTTPException(status_code=400, detail="Contest has not started yet")
    if now > contest.end_time:
        raise HTTPException(status_code=400, detail="Contest has already ended")

    # Check registration
    participation = db.query(ContestParticipation).filter(
        ContestParticipation.contest_id == contest_id,
        ContestParticipation.user_id == current_user.id
    ).first()
    
    if not participation:
        raise HTTPException(status_code=403, detail="You are not registered for this contest")

    # Verify problem belongs to this contest
    c_prob_ids = [pid.strip() for pid in contest.problem_ids.split(",") if pid.strip()]
    if str(payload.problem_id) not in c_prob_ids:
        raise HTTPException(status_code=400, detail="This problem does not belong to the contest")

    # Run the core submission logic
    sub = await submit_problem_code(payload=payload, current_user=current_user, db=db)
    
    # If accepted, update contest participation score
    if sub.status == "Accepted":
        details = json.loads(participation.details)
        prob_key = str(payload.problem_id)
        
        # Check if already solved to prevent repeat scoring
        if not details.get(prob_key, {}).get("solved", False):
            # Calculate points based on difficulty
            problem = db.query(Problem).filter(Problem.id == payload.problem_id).first()
            pts = 100
            if problem:
                if problem.difficulty.lower() == "medium":
                    pts = 200
                elif problem.difficulty.lower() == "hard":
                    pts = 300
                    
            details[prob_key] = {
                "solved": True,
                "time": (now - contest.start_time).total_seconds() // 60,
                "points": pts
            }
            participation.score += pts
            participation.finished_time = now
            participation.details = json.dumps(details)
            db.commit()
            db.refresh(participation)
            
    return {
        "submission": {
            "id": sub.id,
            "status": sub.status,
            "passed_test_cases": sub.passed_test_cases,
            "total_test_cases": sub.total_test_cases,
            "error_message": sub.error_message
        },
        "contest_score": participation.score
    }

@router.get("/{contest_id}/leaderboard", response_model=List[LeaderboardEntry])
def get_contest_leaderboard(
    contest_id: int,
    db: Session = Depends(get_db)
):
    participations = db.query(ContestParticipation).filter(
        ContestParticipation.contest_id == contest_id
    ).order_by(
        ContestParticipation.score.desc(),
        ContestParticipation.finished_time.asc()
    ).all()
    
    leaderboard = []
    for idx, p in enumerate(participations):
        leaderboard.append({
            "rank": idx + 1,
            "user_id": p.user_id,
            "full_name": p.user.full_name,
            "score": p.score,
            "finished_time": p.finished_time
        })
    return leaderboard

@router.post("/", response_model=ContestResponse, status_code=status.HTTP_201_CREATED)
def create_contest(
    contest_in: ContestCreate,
    current_admin: User = Depends(get_current_active_admin),
    db: Session = Depends(get_db)
):
    contest = Contest(
        title=contest_in.title,
        description=contest_in.description,
        start_time=contest_in.start_time,
        end_time=contest_in.end_time,
        duration_minutes=contest_in.duration_minutes,
        problem_ids=contest_in.problem_ids
    )
    db.add(contest)
    db.commit()
    db.refresh(contest)
    return contest
