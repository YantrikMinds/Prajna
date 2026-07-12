from fastapi import APIRouter

from app.api.endpoints import auth, problems, submissions, ai, contests, profile, admin

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(problems.router, prefix="/problems", tags=["problems"])
api_router.include_router(submissions.router, prefix="/submissions", tags=["submissions"])
api_router.include_router(ai.router, prefix="/ai", tags=["ai"])
api_router.include_router(contests.router, prefix="/contests", tags=["contests"])
api_router.include_router(profile.router, prefix="/profile", tags=["profile"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
