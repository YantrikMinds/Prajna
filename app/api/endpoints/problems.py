from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user, get_current_active_admin
from app.models.problem import Problem
from app.models.user import User
from app.schemas.problem import ProblemBrief, ProblemResponse, ProblemCreate

router = APIRouter()

@router.get("/", response_model=List[ProblemBrief])
def read_problems(
    difficulty: Optional[str] = None,
    tag: Optional[str] = None,
    company: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Problem)
    
    if difficulty:
        query = query.filter(Problem.difficulty.iexact(difficulty))
    
    if tag:
        query = query.filter(Problem.tags.ilike(f"%{tag}%"))
        
    if company:
        query = query.filter(Problem.company_tags.ilike(f"%{company}%"))
        
    if search:
        query = query.filter(
            (Problem.title.ilike(f"%{search}%")) | 
            (Problem.description.ilike(f"%{search}%"))
        )
        
    return query.all()

@router.get("/{problem_id}", response_model=ProblemResponse)
def read_problem(problem_id: int, db: Session = Depends(get_db)):
    problem = db.query(Problem).filter(Problem.id == problem_id).first()
    if not problem:
        raise HTTPException(
            status_code=404,
            detail="Problem not found"
        )
    return problem

@router.post("/", response_model=ProblemResponse, status_code=status.HTTP_201_CREATED)
def create_problem(
    problem_in: ProblemCreate,
    current_admin: User = Depends(get_current_active_admin),
    db: Session = Depends(get_db)
):
    db_problem = Problem(
        title=problem_in.title,
        description=problem_in.description,
        difficulty=problem_in.difficulty,
        tags=problem_in.tags,
        test_cases=problem_in.test_cases,
        time_limit=problem_in.time_limit,
        memory_limit=problem_in.memory_limit,
        company_tags=problem_in.company_tags,
        starter_code=problem_in.starter_code,
        editorial=problem_in.editorial
    )
    db.add(db_problem)
    db.commit()
    db.refresh(db_problem)
    return db_problem

@router.put("/{problem_id}", response_model=ProblemResponse)
def update_problem(
    problem_id: int,
    problem_in: ProblemCreate,
    current_admin: User = Depends(get_current_active_admin),
    db: Session = Depends(get_db)
):
    problem = db.query(Problem).filter(Problem.id == problem_id).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
        
    problem.title = problem_in.title
    problem.description = problem_in.description
    problem.difficulty = problem_in.difficulty
    problem.tags = problem_in.tags
    problem.test_cases = problem_in.test_cases
    problem.time_limit = problem_in.time_limit
    problem.memory_limit = problem_in.memory_limit
    problem.company_tags = problem_in.company_tags
    problem.starter_code = problem_in.starter_code
    problem.editorial = problem_in.editorial
    
    db.commit()
    db.refresh(problem)
    return problem

@router.delete("/{problem_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_problem(
    problem_id: int,
    current_admin: User = Depends(get_current_active_admin),
    db: Session = Depends(get_db)
):
    problem = db.query(Problem).filter(Problem.id == problem_id).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    db.delete(problem)
    db.commit()
    return None
