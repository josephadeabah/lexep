from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.models.enums import AssessmentAttemptStatus


class AssessmentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    category: Optional[str] = None
    level: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    duration_minutes: int
    featured: bool
    question_count: int = 0


class QuestionOption(BaseModel):
    id: str
    text: str


class QuestionCreate(BaseModel):
    topic: Optional[str] = None
    title: Optional[str] = None
    prompt: str
    options: list[QuestionOption]
    correct_option_id: str
    explanation: Optional[str] = None


class AssessmentCreate(BaseModel):
    title: str
    category: Optional[str] = None
    level: Optional[str] = None
    description: Optional[str] = None
    duration_minutes: int = 45
    featured: bool = False
    questions: list[QuestionCreate] = []


class LeaderboardEntry(BaseModel):
    rank: int
    candidate_name: str
    candidate_avatar: Optional[str] = None
    assessment_title: str
    score: float
    completed_at: Optional[datetime] = None


class QuestionOut(BaseModel):
    """Question shape sent to the client — never includes the correct answer."""

    id: int
    order: int
    topic: Optional[str] = None
    title: Optional[str] = None
    prompt: str
    image_url: Optional[str] = None
    options: list[QuestionOption]


class AnswerSubmit(BaseModel):
    question_id: int
    option_id: str


class AttemptProgressOut(BaseModel):
    attempt_id: int
    assessment_title: str
    total_questions: int
    current_index: int
    is_complete: bool
    question: Optional[QuestionOut] = None


class TopicScore(BaseModel):
    topic: str
    percent: float


class AttemptResultsOut(BaseModel):
    attempt_id: int
    assessment_title: str
    score: float
    mastery_label: str
    topic_breakdown: list[TopicScore]
    completed_at: Optional[datetime] = None


class AttemptSummaryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    assessment_id: int
    assessment_title: Optional[str] = None
    status: AssessmentAttemptStatus
    score: Optional[float] = None
    current_index: int
    total_questions: int = 0
    started_at: datetime
