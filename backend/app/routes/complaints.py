from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from ..database import SessionLocal
from ..schemas import ComplaintCreate, ComplaintResponse

from ..services.complaint_service import (
    create_complaint,
    get_all_complaints,
    get_complaint_by_id,
)


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

@router.get(
    "",
    response_model=list[ComplaintResponse],
)
def get_complaints(
    db: Session = Depends(get_db),
):
    return get_all_complaints(db)

@router.get(
    "/{complaint_id}",
    response_model=ComplaintResponse,
)
def get_complaint(
    complaint_id: str,
    db: Session = Depends(get_db),
):
    complaint = get_complaint_by_id(db, complaint_id)

    if complaint is None:
        from fastapi import HTTPException

        raise HTTPException(
            status_code=404,
            detail="Complaint not found",
        )

    return complaint