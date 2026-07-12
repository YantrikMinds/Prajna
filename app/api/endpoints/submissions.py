from typing import List, Dict, Any
import json
from datetime import date
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.models.problem import Problem
from app.models.submission import Submission
from app.models.user import User
from app.schemas.submission import SubmissionCreate, SubmissionResponse, SubmissionRun, RunResponse
from app.services.execution import execute_code

router = APIRouter()

@router.post("/run", response_model=RunResponse)
async def run_custom_code(
    payload: SubmissionRun,
    current_user: User = Depends(get_current_user)
):
    result = await execute_code(
        language=payload.language,
        code=payload.code,
        stdin=payload.custom_input
    )
    return {
        "status": result["status"],
        "stdout": result["stdout"],
        "stderr": result["stderr"],
        "execution_time": result["execution_time"],
        "memory": result["memory"]
    }

@router.post("/submit", response_model=SubmissionResponse)
async def submit_problem_code(
    payload: SubmissionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    problem = db.query(Problem).filter(Problem.id == payload.problem_id).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    # Parse test cases
    try:
        test_cases = json.loads(problem.test_cases)
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Failed to parse test cases for this problem."
        )

    if not test_cases:
        raise HTTPException(
            status_code=400,
            detail="No test cases set for this problem."
        )

    passed_count = 0
    total_count = len(test_cases)
    overall_status = "Accepted"
    first_error_msg = None
    max_execution_time = 0.0
    
    # Run test cases
    for idx, tc in enumerate(test_cases):
        tc_input = tc.get("input", "")
        tc_expected = tc.get("output", "").strip()
        
        exec_res = await execute_code(
            language=payload.language,
            code=payload.code,
            stdin=tc_input
        )
        
        max_execution_time = max(max_execution_time, exec_res["execution_time"])
        
        if exec_res["status"] != "Accepted":
            overall_status = exec_res["status"]
            first_error_msg = exec_res["stderr"] or exec_res["stdout"]
            break
            
        tc_actual = exec_res["stdout"].strip()
        
        # Compare actual and expected outputs
        if tc_actual != tc_expected:
            overall_status = "Wrong Answer"
            first_error_msg = f"Testcase {idx+1} Failed.\nInput: {tc_input}\nExpected: {tc_expected}\nGot: {tc_actual}"
            break
            
        passed_count += 1

    # Check if user already solved it before to determine XP/Coins award
    already_solved = db.query(Submission).filter(
        Submission.user_id == current_user.id,
        Submission.problem_id == problem.id,
        Submission.status == "Accepted"
    ).first() is not None

    # Gamification Rewards logic
    xp_gained = 0
    coins_gained = 0
    
    if overall_status == "Accepted" and not already_solved:
        diff = problem.difficulty.lower()
        if diff == "easy":
            xp_gained = 20
            coins_gained = 10
        elif diff == "medium":
            xp_gained = 50
            coins_gained = 25
        elif diff == "hard":
            xp_gained = 100
            coins_gained = 50

        # Update User
        current_user.xp += xp_gained
        current_user.coins += coins_gained
        
        # Check and award badges
        user_badges = json.loads(current_user.badges)
        if "First Solve" not in user_badges:
            user_badges.append("First Solve")
            current_user.xp += 30  # badge bonus
        
        # Total solved count checks for advanced badges
        accepted_submissions_count = db.query(Submission).filter(
            Submission.user_id == current_user.id,
            Submission.status == "Accepted"
        ).group_by(Submission.problem_id).count()
        
        if accepted_submissions_count >= 4 and "DSA Novice" not in user_badges:
            user_badges.append("DSA Novice")
            current_user.xp += 100
        if accepted_submissions_count >= 10 and "DSA Expert" not in user_badges:
            user_badges.append("DSA Expert")
            current_user.xp += 200

        current_user.badges = json.dumps(user_badges)

    # Maintain streak
    today = date.today()
    if current_user.last_active_date:
        delta = today - current_user.last_active_date
        if delta.days == 1:
            current_user.streak += 1
            current_user.xp += 10
        elif delta.days > 1:
            current_user.streak = 1
    else:
        current_user.streak = 1
        
    current_user.last_active_date = today

    # Record Submission
    db_submission = Submission(
        user_id=current_user.id,
        problem_id=problem.id,
        code=payload.code,
        language=payload.language,
        status=overall_status,
        execution_time=max_execution_time,
        memory=1024,
        error_message=first_error_msg,
        passed_test_cases=passed_count,
        total_test_cases=total_count
    )
    
    db.add(db_submission)
    db.commit()
    db.refresh(db_submission)
    
    # Commit user changes
    db.commit()
    db.refresh(current_user)

    return db_submission

@router.get("/", response_model=List[SubmissionResponse])
def get_user_submissions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Submission).filter(Submission.user_id == current_user.id).order_by(Submission.created_at.desc()).all()

@router.get("/problem/{problem_id}", response_model=List[SubmissionResponse])
def get_user_problem_submissions(
    problem_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Submission).filter(
        Submission.user_id == current_user.id,
        Submission.problem_id == problem_id
    ).order_by(Submission.created_at.desc()).all()

@router.get("/{submission_id}", response_model=SubmissionResponse)
def get_submission_detail(
    submission_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    sub = db.query(Submission).filter(Submission.id == submission_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Submission not found")
    if sub.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to view this submission")
    return sub
