from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field


class IssuePriority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"


class IssueStatus(str, Enum):
    open = "open"
    in_progress = "in_progress"
    closed = "closed"


class IssueCreate(BaseModel):
    title: str = Field(min_length=3, max_length=100)
    description: str = Field(min_length=5, max_length=2000)
    priority: IssuePriority = IssuePriority.medium


class IssueUpdate(BaseModel):
    title: Optional[str] = Field(default=None, max_length=100)
    description: Optional[str] = Field(
        default=None, min_length=5, max_length=2000)
    priority: Optional[IssuePriority] = None
    status: Optional[IssueStatus] = None


class IssueOut(BaseModel):
    id: str
    title: str
    description: str
    priority: IssuePriority
    status: IssueStatus
