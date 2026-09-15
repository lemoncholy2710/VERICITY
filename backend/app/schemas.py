from datetime import datetime

from pydantic import BaseModel, Field

from .models import ComplaintStatus


class ComplaintCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str = Field(min_length=1)
    location: str = Field(min_length=1, max_length=500)


class ComplaintResponse(BaseModel):
    complaint_id: str
    title: str
    description: str
    location: str
    status: ComplaintStatus
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True,
    }