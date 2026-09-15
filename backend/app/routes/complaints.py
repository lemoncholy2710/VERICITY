from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from ..database import SessionLocal
from ..schemas import ComplaintCreate, ComplaintResponse
from ..services.complaint_service import create_complaint


router = APIRouter(
    prefix="/complaints",
    tags=["Complaints"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post(
    "",
    response_model=ComplaintResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_complaint(
    complaint_data: ComplaintCreate,
    db: Session = Depends(get_db),
):
    return create_complaint(db, complaint_data)