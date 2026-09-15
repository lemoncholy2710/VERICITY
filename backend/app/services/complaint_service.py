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