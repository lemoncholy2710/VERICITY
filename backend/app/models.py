from datetime import datetime
from enum import Enum
from uuid import uuid4

from sqlalchemy import DateTime, Enum as SQLEnum, String, Text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class ComplaintStatus(str, Enum):
    SUBMITTED = "SUBMITTED"
    IN_PROGRESS = "IN_PROGRESS"
    PROPOSED_RESOLVED = "PROPOSED_RESOLVED"
    REOPENED = "REOPENED"
    FINAL_RESOLVED = "FINAL_RESOLVED"


class Complaint(Base):
    __tablename__ = "complaints"

    complaint_id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid4()),
    )

    title: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    location: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )

    status: Mapped[ComplaintStatus] = mapped_column(
        SQLEnum(ComplaintStatus),
        nullable=False,
        default=ComplaintStatus.SUBMITTED,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )