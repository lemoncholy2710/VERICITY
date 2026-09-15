from sqlalchemy.orm import Session

from ..models import Complaint
from ..schemas import ComplaintCreate


def create_complaint(
    db: Session,
    complaint_data: ComplaintCreate,
) -> Complaint:
    complaint = Complaint(
        title=complaint_data.title,
        description=complaint_data.description,
        location=complaint_data.location,
    )

    db.add(complaint)
    db.commit()
    db.refresh(complaint)

    return complaint


def get_all_complaints(
    db: Session,
) -> list[Complaint]:
    return db.query(Complaint).all()


def get_complaint_by_id(
    db: Session,
    complaint_id: str,
) -> Complaint | None:
    return (
        db.query(Complaint)
        .filter(Complaint.complaint_id == complaint_id)
        .first()
    )