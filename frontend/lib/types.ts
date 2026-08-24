export type UserRole = "learner" | "mentor" | "company" | "admin";

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole | null;
  avatar_url: string | null;
  onboarding_completed: boolean;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export type WorkMode = "remote" | "hybrid" | "onsite";
export type OpportunityStatus = "draft" | "published" | "closed";

export interface Opportunity {
  id: number;
  company_id: number;
  title: string;
  category: string | null;
  work_mode: WorkMode;
  location: string | null;
  duration: string | null;
  stipend_provided: boolean;
  stipend_amount: number | null;
  stipend_currency: string;
  description: string | null;
  responsibilities: string | null;
  required_skills: string[];
  application_deadline: string | null;
  status: OpportunityStatus;
  created_at: string;
  company_name: string | null;
}

export type ApplicationStatus =
  | "applied"
  | "under_review"
  | "interview_scheduled"
  | "accepted"
  | "declined";

export interface Applicant {
  id: number;
  applicant_name: string;
  applicant_avatar: string | null;
  institution: string | null;
  education: string | null;
  skills: string[];
  match_score: number | null;
  status: ApplicationStatus;
}

export interface MyApplication {
  id: number;
  opportunity_title: string;
  company_name: string;
  location: string | null;
  status: ApplicationStatus;
  applied_at: string;
}

export type InterviewStatus = "awaiting_candidate" | "scheduled" | "completed" | "cancelled";

export interface Interview {
  id: number;
  application_id: number;
  scheduled_at: string | null;
  proposed_times: string[];
  selected_time: string | null;
  duration_minutes: number;
  interview_type: string | null;
  meeting_service: string | null;
  meeting_link: string | null;
  message_to_candidate: string | null;
  status: InterviewStatus;
  candidate_name: string | null;
  opportunity_title: string | null;
}

export interface MentorPackage {
  id: number;
  mentor_id: number;
  title: string;
  description: string | null;
  price: number;
  currency: string;
  duration_minutes: number;
  session_count: number;
  tags: string[];
  is_active: boolean;
  is_popular: boolean;
}

export type MentorshipRequestStatus = "pending" | "accepted" | "declined";

export interface MentorshipRequestItem {
  id: number;
  mentor_id: number;
  learner_id: number;
  package_id: number | null;
  session_type: string | null;
  message: string | null;
  proposed_times: string[];
  confirmed_time: string | null;
  status: MentorshipRequestStatus;
  created_at: string;
  learner_name: string | null;
  mentor_name: string | null;
}

export interface MentorDashboardStats {
  total_earnings: number;
  students_mentored: number;
  average_rating: number;
  todays_schedule: { id: number; time: string; title: string; with_name: string }[];
}

export interface AdminMentorApplicationRow {
  user_id: number;
  applicant_name: string;
  applicant_avatar: string | null;
  location: string | null;
  professional_title: string | null;
  application_date: string | null;
  credential_status: "verified" | "awaiting_verification";
  status: string;
}

export interface AdminStats {
  total_pending: number;
  avg_review_days: number;
  new_today: number;
}

export interface Assessment {
  id: number;
  title: string;
  category: string | null;
  level: string | null;
  description: string | null;
  image_url: string | null;
  duration_minutes: number;
  featured: boolean;
  question_count: number;
}

export interface QuestionOption {
  id: string;
  text: string;
}

export interface AssessmentQuestion {
  id: number;
  order: number;
  topic: string | null;
  title: string | null;
  prompt: string;
  image_url: string | null;
  options: QuestionOption[];
}

export interface AttemptProgress {
  attempt_id: number;
  assessment_title: string;
  total_questions: number;
  current_index: number;
  is_complete: boolean;
  question: AssessmentQuestion | null;
}

export interface TopicScore {
  topic: string;
  percent: number;
}

export interface AttemptResults {
  attempt_id: number;
  assessment_title: string;
  score: number;
  mastery_label: string;
  topic_breakdown: TopicScore[];
  completed_at: string | null;
}

export interface AttemptSummary {
  id: number;
  assessment_id: number;
  assessment_title: string | null;
  status: "in_progress" | "completed";
  score: number | null;
  current_index: number;
  total_questions: number;
  started_at: string;
}

export interface MentorProfile {
  id: number;
  title: string | null;
  company: string | null;
  bio: string | null;
  years_experience: string | null;
  linkedin_url: string | null;
  location: string | null;
  focus_area: string | null;
  education: { degree: string; institution: string; year: string }[];
  credentials: { label: string; document_url?: string }[];
  credential_checklist: Record<string, boolean>;
  admin_notes: string | null;
  application_status: string;
  application_submitted_at: string | null;
  skills: string[];
  languages: string[];
  rating: number;
  accepting_mentees: boolean;
  hours_per_week: string | null;
  user: User;
}

export type GrantStatus = "draft" | "submitted" | "under_review" | "approved" | "rejected";

export interface Grant {
  id: number;
  amount_requested: number;
  purpose: string | null;
  status: GrantStatus;
  created_at: string;
}

export interface GrantGroup {
  id: number;
  name: string;
  tagline: string | null;
  description: string | null;
  category: string | null;
  goal_amount: number;
  raised_amount: number;
  youth_sponsored: number;
  organizer_id: number;
  percent_funded: number;
}

export interface Contribution {
  id: number;
  contributor_name: string;
  amount: number;
  created_at: string;
}

// --- Billing / premium -----------------------------------------------

export type SubscriptionPlanId = "learner_plus" | "mentor_pro" | "enterprise";
export type BillingCycle = "monthly" | "annual";

export interface PricingPlan {
  id: SubscriptionPlanId;
  name: string;
  audience: string;
  monthly_price: number | null;
  annual_price: number | null;
  is_custom: boolean;
  is_popular: boolean;
  features: string[];
}

export interface PublicConfig {
  premium_features_enabled: boolean;
  payments_enabled: boolean;
  paystack_public_key: string;
}

export interface CheckoutResponse {
  reference: string;
  authorization_url: string | null;
  provider: string;
  amount: number;
  currency: string;
}

export interface VerifyPaymentResponse {
  reference: string;
  status: "pending" | "success" | "failed";
  purpose: "subscription" | "grant_contribution";
  amount: number;
}

export interface MySubscription {
  id: number;
  plan: SubscriptionPlanId;
  billing_cycle: BillingCycle;
  status: string;
  amount: number;
  currency: string;
  renews_at: string | null;
  created_at: string;
}

// --- Admin: learners / subscriptions / companies ------------------------

export interface AdminLearnerRow {
  user_id: number;
  full_name: string;
  email: string;
  avatar_url: string | null;
  location: string | null;
  primary_track: string | null;
  progress_percent: number;
  status: string;
}

export interface AdminLearnersResponse {
  total: number;
  page: number;
  page_size: number;
  results: AdminLearnerRow[];
}

export interface AdminSubscriptionRow {
  id: number;
  user_name: string;
  user_email: string | null;
  plan: SubscriptionPlanId;
  amount: number;
  billing_cycle: BillingCycle;
  renews_at: string | null;
  status: string;
}

export interface AdminSubscriptionsResponse {
  monthly_recurring_revenue: number;
  active_premium_users: number;
  avg_churn_rate: number;
  recent_subscriptions: AdminSubscriptionRow[];
}

export interface AdminCompanyRow {
  user_id: number;
  company_name: string;
  industry: string | null;
  location: string | null;
  subscription_tier: string;
  onboarding_status: string;
  active_internships: number;
  total_hires: number;
}

export interface AdminCompaniesResponse {
  total_active_firms: number;
  pending_onboarding: number;
  total_interns_placed: number;
  companies: AdminCompanyRow[];
}
