from datetime import datetime, timezone
from collections import defaultdict

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api_deps import get_current_user
from app.core.database import get_db
from app.models.assessment import Assessment, AssessmentAttempt, AssessmentQuestion
from app.models.enums import AssessmentAttemptStatus
from app.models.user import User
from app.schemas.assessment import (
    AnswerSubmit,
    AssessmentOut,
    AttemptProgressOut,
    AttemptResultsOut,
    AttemptSummaryOut,
    QuestionOut,
    TopicScore,
)

router = APIRouter(prefix="/api/assessments", tags=["assessments"])


def _mastery_label(score: float) -> str:
    if score >= 90:
        return "Outstanding Mastery"
    if score >= 75:
        return "Strong Understanding"
    if score >= 50:
        return "Developing Proficiency"
    return "Needs Review"


def _question_out(q: AssessmentQuestion) -> QuestionOut:
    return QuestionOut(
        id=q.id, order=q.order, topic=q.topic, title=q.title, prompt=q.prompt, image_url=q.image_url, options=q.options
    )


@router.get("", response_model=list[AssessmentOut])
def list_assessments(db: Session = Depends(get_db)):
    """Powers the Skill Assessment Hub."""
    assessments = db.query(Assessment).all()
    out = []
    for a in assessments:
        data = AssessmentOut.model_validate(a)
        data.question_count = len(a.questions)
        out.append(data)
    return out


@router.get("/attempts/mine", response_model=list[AttemptSummaryOut])
def my_attempts(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Powers the 'In Progress' list on the hub."""
    attempts = db.query(AssessmentAttempt).filter(AssessmentAttempt.user_id == user.id).all()
    out = []
    for attempt in attempts:
        assessment = db.get(Assessment, attempt.assessment_id)
        data = AttemptSummaryOut.model_validate(attempt)
        data.assessment_title = assessment.title if assessment else None
        data.total_questions = len(assessment.questions) if assessment else 0
        out.append(data)
    return out


@router.post("/{assessment_id}/attempts", response_model=AttemptProgressOut, status_code=201)
def start_attempt(assessment_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Powers 'Start Assessment' / 'New Assessment'."""
    assessment = db.get(Assessment, assessment_id)
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found.")

    attempt = AssessmentAttempt(assessment_id=assessment_id, user_id=user.id)
    db.add(attempt)
    db.commit()
    db.refresh(attempt)

    first_question = assessment.questions[0] if assessment.questions else None
    return AttemptProgressOut(
        attempt_id=attempt.id,
        assessment_title=assessment.title,
        total_questions=len(assessment.questions),
        current_index=0,
        is_complete=False,
        question=_question_out(first_question) if first_question else None,
    )


@router.get("/attempts/{attempt_id}", response_model=AttemptProgressOut)
def get_attempt_progress(attempt_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Powers resuming the quiz-taking screen (question map + current question)."""
    attempt = db.get(AssessmentAttempt, attempt_id)
    if not attempt or attempt.user_id != user.id:
        raise HTTPException(status_code=404, detail="Attempt not found.")

    assessment = db.get(Assessment, attempt.assessment_id)
    questions = assessment.questions
    is_complete = attempt.status == AssessmentAttemptStatus.COMPLETED or attempt.current_index >= len(questions)
    question = questions[attempt.current_index] if not is_complete else None

    return AttemptProgressOut(
        attempt_id=attempt.id,
        assessment_title=assessment.title,
        total_questions=len(questions),
        current_index=attempt.current_index,
        is_complete=is_complete,
        question=_question_out(question) if question else None,
    )


@router.post("/attempts/{attempt_id}/answer", response_model=AttemptProgressOut)
def submit_answer(
    attempt_id: int, payload: AnswerSubmit, db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    """Powers 'Next Question' — records the answer and advances the quiz."""
    attempt = db.get(AssessmentAttempt, attempt_id)
    if not attempt or attempt.user_id != user.id:
        raise HTTPException(status_code=404, detail="Attempt not found.")

    answers = dict(attempt.answers or {})
    answers[str(payload.question_id)] = payload.option_id
    attempt.answers = answers
    attempt.current_index += 1

    assessment = db.get(Assessment, attempt.assessment_id)
    questions = assessment.questions
    is_complete = attempt.current_index >= len(questions)

    if is_complete:
        _finalize_attempt(attempt, assessment, db)

    db.add(attempt)
    db.commit()
    db.refresh(attempt)

    question = questions[attempt.current_index] if not is_complete else None
    return AttemptProgressOut(
        attempt_id=attempt.id,
        assessment_title=assessment.title,
        total_questions=len(questions),
        current_index=attempt.current_index,
        is_complete=is_complete,
        question=_question_out(question) if question else None,
    )


def _finalize_attempt(attempt: AssessmentAttempt, assessment: Assessment, db: Session) -> None:
    correct = 0
    topic_correct: dict[str, int] = defaultdict(int)
    topic_total: dict[str, int] = defaultdict(int)

    for q in assessment.questions:
        topic = q.topic or "General"
        topic_total[topic] += 1
        if attempt.answers.get(str(q.id)) == q.correct_option_id:
            correct += 1
            topic_correct[topic] += 1

    total = len(assessment.questions) or 1
    attempt.score = round((correct / total) * 100, 1)
    attempt.topic_breakdown = {
        topic: round((topic_correct[topic] / topic_total[topic]) * 100, 1) for topic in topic_total
    }
    attempt.status = AssessmentAttemptStatus.COMPLETED
    attempt.completed_at = datetime.now(timezone.utc)


@router.get("/attempts/{attempt_id}/results", response_model=AttemptResultsOut)
def get_results(attempt_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Powers the 'Assessment Complete' results screen."""
    attempt = db.get(AssessmentAttempt, attempt_id)
    if not attempt or attempt.user_id != user.id:
        raise HTTPException(status_code=404, detail="Attempt not found.")
    if attempt.status != AssessmentAttemptStatus.COMPLETED:
        raise HTTPException(status_code=400, detail="Assessment is not complete yet.")

    assessment = db.get(Assessment, attempt.assessment_id)
    return AttemptResultsOut(
        attempt_id=attempt.id,
        assessment_title=assessment.title,
        score=attempt.score or 0,
        mastery_label=_mastery_label(attempt.score or 0),
        topic_breakdown=[TopicScore(topic=k, percent=v) for k, v in attempt.topic_breakdown.items()],
        completed_at=attempt.completed_at,
    )
