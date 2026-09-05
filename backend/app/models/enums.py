import enum


class UserRole(str, enum.Enum):
    LEARNER = "learner"
    MENTOR = "mentor"
    COMPANY = "company"
    ADMIN = "admin"


class WorkMode(str, enum.Enum):
    REMOTE = "remote"
    HYBRID = "hybrid"
    ONSITE = "onsite"


class OpportunityStatus(str, enum.Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    CLOSED = "closed"


class ApplicationStatus(str, enum.Enum):
    APPLIED = "applied"
    UNDER_REVIEW = "under_review"
    INTERVIEW_SCHEDULED = "interview_scheduled"
    ACCEPTED = "accepted"
    DECLINED = "declined"


class InterviewStatus(str, enum.Enum):
    AWAITING_CANDIDATE = "awaiting_candidate"
    SCHEDULED = "scheduled"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class MentorshipRequestStatus(str, enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    DECLINED = "declined"


class MentorApplicationStatus(str, enum.Enum):
    PENDING = "pending"
    IN_REVIEW = "in_review"
    APPROVED = "approved"
    REJECTED = "rejected"


class GrantStatus(str, enum.Enum):
    DRAFT = "draft"
    SUBMITTED = "submitted"
    UNDER_REVIEW = "under_review"
    APPROVED = "approved"
    REJECTED = "rejected"


class AssessmentAttemptStatus(str, enum.Enum):
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"


class SubscriptionPlan(str, enum.Enum):
    LEARNER_PLUS = "learner_plus"
    MENTOR_PRO = "mentor_pro"
    ENTERPRISE = "enterprise"


class BillingCycle(str, enum.Enum):
    MONTHLY = "monthly"
    ANNUAL = "annual"


class SubscriptionStatus(str, enum.Enum):
    PENDING = "pending"
    ACTIVE = "active"
    PAST_DUE = "past_due"
    CANCELLED = "cancelled"


class TransactionType(str, enum.Enum):
    SUBSCRIPTION = "subscription"
    GRANT_CONTRIBUTION = "grant_contribution"


class TransactionStatus(str, enum.Enum):
    PENDING = "pending"
    SUCCESS = "success"
    FAILED = "failed"


class CourseStatus(str, enum.Enum):
    DRAFT = "draft"
    PUBLISHED = "published"


class CourseContentType(str, enum.Enum):
    COURSE_MODULE = "course_module"
    ASSESSMENT = "assessment"


class NotificationType(str, enum.Enum):
    NEW_COURSE = "new_course"
    INTERVIEW_SCHEDULED = "interview_scheduled"
    INTERVIEW_CONFIRMED = "interview_confirmed"
    MENTORSHIP_ACCEPTED = "mentorship_accepted"
    MENTORSHIP_DECLINED = "mentorship_declined"
    MENTOR_APPLICATION_DECISION = "mentor_application_decision"
    ASSESSMENT_GRADED = "assessment_graded"
    GRANT_CONTRIBUTION = "grant_contribution"
    APPLICATION_STATUS = "application_status"
    GENERAL = "general"
