import type {
  Applicant,
  Assessment,
  AssessmentQuestion,
  AttemptProgress,
  AttemptResults,
  AttemptSummary,
  AdminMentorApplicationRow,
  AdminStats,
  AdminLearnersResponse,
  AdminSubscriptionsResponse,
  AdminCompaniesResponse,
  AuthResponse,
  CheckoutResponse,
  Contribution,
  Grant,
  GrantGroup,
  Interview,
  MentorDashboardStats,
  MentorPackage,
  MentorProfile,
  MentorshipRequestItem,
  MyApplication,
  MySubscription,
  Opportunity,
  PricingPlan,
  PublicConfig,
  User,
  VerifyPaymentResponse,
} from "./types";
import { addToOutbox } from "./offline/db";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const TOKEN_KEY = "lexep_token";
const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/** Thrown instead of resolving when a mutating request is made while
 * offline. The request has already been queued (see lib/offline/db.ts) and
 * will be replayed automatically once connectivity returns — callers can
 * catch this to show an optimistic "saved — will sync" message instead of
 * a hard error. */
export class OfflineQueuedError extends Error {
  constructor(description: string) {
    super(`You're offline. "${description}" has been queued and will sync automatically.`);
  }
}

function genKey(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `key_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

async function request<T>(
  path: string,
  options: RequestInit & { auth?: boolean; offlineDescription?: string } = {}
): Promise<T> {
  const { auth = true, headers, offlineDescription, ...rest } = options;
  const method = (rest.method || "GET").toUpperCase();
  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };

  if (auth) {
    const token = getToken();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  const isMutating = MUTATING_METHODS.has(method);
  const idempotencyKey = isMutating ? genKey() : null;
  if (idempotencyKey) finalHeaders["Idempotency-Key"] = idempotencyKey;

  // Offline + mutating: queue instead of attempting the request.
  if (isMutating && typeof navigator !== "undefined" && !navigator.onLine) {
    await addToOutbox({
      id: idempotencyKey!,
      url: path,
      method,
      body: (rest.body as string) ?? null,
      headers: finalHeaders,
      createdAt: Date.now(),
      description: offlineDescription || `${method} ${path}`,
    });
    throw new OfflineQueuedError(offlineDescription || path);
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, { ...rest, headers: finalHeaders });
  } catch (networkErr) {
    // fetch itself failed (e.g. connection dropped mid-request) — queue mutations,
    // let GETs fail normally (callers fall back to cached data where relevant).
    if (isMutating) {
      await addToOutbox({
        id: idempotencyKey!,
        url: path,
        method,
        body: (rest.body as string) ?? null,
        headers: finalHeaders,
        createdAt: Date.now(),
        description: offlineDescription || `${method} ${path}`,
      });
      throw new OfflineQueuedError(offlineDescription || path);
    }
    throw networkErr;
  }

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body.detail || detail;
    } catch {
      /* no-op */
    }
    throw new ApiError(res.status, detail);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  // --- Auth ------------------------------------------------------
  register: (data: { email: string; full_name: string; password: string }) =>
    request<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
      auth: false,
    }),

  login: (data: { email: string; password: string }) =>
    request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
      auth: false,
    }),

  me: () => request<User>("/api/auth/me"),

  // --- Onboarding / users -----------------------------------------
  chooseRole: (role: string) =>
    request<User>("/api/users/me/role", { method: "POST", body: JSON.stringify({ role }) }),

  onboardLearner: (data: Record<string, unknown>) =>
    request<User>("/api/users/me/onboarding/learner", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  onboardMentor: (data: Record<string, unknown>) =>
    request<User>("/api/users/me/onboarding/mentor", { method: "PUT", body: JSON.stringify(data) }),

  onboardCompany: (data: Record<string, unknown>) =>
    request<User>("/api/users/me/onboarding/company", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  updateAccount: (data: Record<string, unknown>) =>
    request<User>("/api/users/me/account", { method: "PUT", body: JSON.stringify(data) }),

  updateNotifications: (preferences: Record<string, unknown>) =>
    request<User>("/api/users/me/notifications", {
      method: "PUT",
      body: JSON.stringify({ preferences }),
    }),

  updatePrivacy: (settings: Record<string, unknown>) =>
    request<User>("/api/users/me/privacy", { method: "PUT", body: JSON.stringify({ settings }) }),

  // --- Opportunities ------------------------------------------------
  listOpportunities: (mineOnly = false, publishedOnly = false) => {
    const params = new URLSearchParams();
    if (mineOnly) params.set("company_only_mine", "true");
    if (publishedOnly) params.set("published_only", "true");
    const qs = params.toString();
    return request<Opportunity[]>(`/api/opportunities${qs ? `?${qs}` : ""}`, { auth: mineOnly });
  },

  getOpportunity: (id: number) => request<Opportunity>(`/api/opportunities/${id}`),

  createOpportunity: (data: Record<string, unknown>) =>
    request<Opportunity>("/api/opportunities", { method: "POST", body: JSON.stringify(data) }),

  listApplicants: (opportunityId: number, sortBy = "match_score") =>
    request<Applicant[]>(`/api/opportunities/${opportunityId}/applicants?sort_by=${sortBy}`),

  applyToOpportunity: (opportunityId: number, data: Record<string, unknown> = {}) =>
    request<MyApplication>("/api/opportunities/apply", {
      method: "POST",
      body: JSON.stringify({ opportunity_id: opportunityId, ...data }),
    }),

  myApplications: () => request<MyApplication[]>("/api/opportunities/applications/mine"),

  updateApplicationStatus: (applicationId: number, status: string) =>
    request<Applicant>(`/api/opportunities/applications/${applicationId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  // --- Interviews ------------------------------------------------
  scheduleInterview: (data: Record<string, unknown>) =>
    request<Interview>("/api/interviews", { method: "POST", body: JSON.stringify(data) }),

  proposeInterview: (data: Record<string, unknown>) =>
    request<Interview>("/api/interviews/propose", { method: "POST", body: JSON.stringify(data) }),

  getInterview: (id: number) => request<Interview>(`/api/interviews/${id}`, { auth: false }),

  selectInterviewTime: (id: number, selectedTime: string) =>
    request<Interview>(`/api/interviews/${id}/select-time`, {
      method: "POST",
      body: JSON.stringify({ selected_time: selectedTime }),
    }),

  upcomingInterviews: () => request<Interview[]>("/api/interviews/upcoming"),

  pendingInterviews: () => request<Interview[]>("/api/interviews/pending/mine"),

  // --- Mentors ------------------------------------------------
  findMentors: (params: { q?: string; skill?: string } = {}) => {
    const qs = new URLSearchParams(params as Record<string, string>).toString();
    return request<MentorProfile[]>(`/api/mentors${qs ? `?${qs}` : ""}`);
  },

  getMentor: (userId: number) => request<MentorProfile>(`/api/mentors/${userId}`),

  requestMentorship: (data: Record<string, unknown>) =>
    request("/api/mentors/requests", { method: "POST", body: JSON.stringify(data) }),

  mentorApplicationStep1: (data: Record<string, unknown>) =>
    request<MentorProfile>("/api/mentors/application/step1", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  mentorApplicationStep2: (data: Record<string, unknown>) =>
    request<MentorProfile>("/api/mentors/application/step2", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  mentorApplicationStep3: (data: Record<string, unknown>) =>
    request<MentorProfile>("/api/mentors/application/step3", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // --- Mentor packages ------------------------------------------------
  myPackages: () => request<MentorPackage[]>("/api/mentors/me/packages"),

  mentorPackages: (mentorUserId: number) =>
    request<MentorPackage[]>(`/api/mentors/${mentorUserId}/packages`, { auth: false }),

  createPackage: (data: Record<string, unknown>) =>
    request<MentorPackage>("/api/mentors/me/packages", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updatePackage: (id: number, data: Record<string, unknown>) =>
    request<MentorPackage>(`/api/mentors/me/packages/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  togglePackage: (id: number) =>
    request<MentorPackage>(`/api/mentors/me/packages/${id}/toggle`, { method: "PATCH" }),

  // --- Mentor requests / students / dashboard ------------------------------------------------
  myMentorRequests: () => request<MentorshipRequestItem[]>("/api/mentors/me/requests"),

  acceptMentorshipRequest: (id: number) =>
    request<MentorshipRequestItem>(`/api/mentors/me/requests/${id}/accept`, { method: "POST" }),

  declineMentorshipRequest: (id: number) =>
    request<MentorshipRequestItem>(`/api/mentors/me/requests/${id}/decline`, { method: "POST" }),

  myStudents: () => request<MentorshipRequestItem[]>("/api/mentors/me/students"),

  mentorDashboardStats: () => request<MentorDashboardStats>("/api/mentors/me/dashboard"),

  // --- Admin ------------------------------------------------
  adminMentorApplications: (statusFilter?: string) =>
    request<AdminMentorApplicationRow[]>(
      `/api/admin/mentor-applications${statusFilter ? `?status_filter=${statusFilter}` : ""}`
    ),

  adminMentorApplicationStats: () => request<AdminStats>("/api/admin/mentor-applications/stats"),

  adminGetMentorApplication: (userId: number) =>
    request<MentorProfile>(`/api/admin/mentor-applications/${userId}`),

  adminUpdateChecklist: (userId: number, data: Record<string, unknown>) =>
    request<MentorProfile>(`/api/admin/mentor-applications/${userId}/checklist`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  adminSaveNote: (userId: number, notes: string) =>
    request<MentorProfile>(`/api/admin/mentor-applications/${userId}/notes`, {
      method: "PUT",
      body: JSON.stringify({ admin_notes: notes }),
    }),

  adminApprove: (userId: number, reason?: string) =>
    request<MentorProfile>(`/api/admin/mentor-applications/${userId}/approve`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    }),

  adminDecline: (userId: number, reason?: string) =>
    request<MentorProfile>(`/api/admin/mentor-applications/${userId}/decline`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    }),

  adminRequestInfo: (userId: number, reason?: string) =>
    request<MentorProfile>(`/api/admin/mentor-applications/${userId}/request-info`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    }),

  // --- Assessments ------------------------------------------------
  listAssessments: () => request<Assessment[]>("/api/assessments"),

  myAttempts: () => request<AttemptSummary[]>("/api/assessments/attempts/mine"),

  startAttempt: (assessmentId: number) =>
    request<AttemptProgress>(`/api/assessments/${assessmentId}/attempts`, { method: "POST" }),

  getAttemptProgress: (attemptId: number) =>
    request<AttemptProgress>(`/api/assessments/attempts/${attemptId}`),

  submitAnswer: (attemptId: number, questionId: number, optionId: string) =>
    request<AttemptProgress>(`/api/assessments/attempts/${attemptId}/answer`, {
      method: "POST",
      body: JSON.stringify({ question_id: questionId, option_id: optionId }),
    }),

  getAttemptResults: (attemptId: number) =>
    request<AttemptResults>(`/api/assessments/attempts/${attemptId}/results`),

  // --- Grants ------------------------------------------------
  applyForGrant: (data: Record<string, unknown>) =>
    request<Grant>("/api/grants", { method: "POST", body: JSON.stringify(data) }),

  myGrants: () => request<Grant[]>("/api/grants/mine"),

  createGrantGroup: (data: Record<string, unknown>) =>
    request<GrantGroup>("/api/grants/groups", { method: "POST", body: JSON.stringify(data) }),

  listGrantGroups: () => request<GrantGroup[]>("/api/grants/groups", { auth: false }),

  getGrantGroup: (id: number) => request<GrantGroup>(`/api/grants/groups/${id}`, { auth: false }),

  topContributors: (groupId: number) =>
    request<Contribution[]>(`/api/grants/groups/${groupId}/contributors`, { auth: false }),

  contribute: (groupId: number, amount: number, contributorName?: string) =>
    request<Contribution>(`/api/grants/groups/${groupId}/contribute`, {
      method: "POST",
      body: JSON.stringify({ amount, contributor_name: contributorName }),
    }),

  // --- Billing / premium ------------------------------------------------
  getConfig: () => request<PublicConfig>("/api/config", { auth: false }),

  listPlans: () => request<PricingPlan[]>("/api/plans", { auth: false }),

  checkoutSubscription: (plan: string, billingCycle: string) =>
    request<CheckoutResponse>("/api/checkout/subscription", {
      method: "POST",
      body: JSON.stringify({ plan, billing_cycle: billingCycle }),
      offlineDescription: "Upgrade subscription",
    }),

  checkoutContribution: (groupId: number, amount: number, contributorName?: string) =>
    request<CheckoutResponse>("/api/checkout/contribution", {
      method: "POST",
      body: JSON.stringify({ group_id: groupId, amount, contributor_name: contributorName }),
      offlineDescription: "Contribute to grant group",
    }),

  verifyPayment: (reference: string) =>
    request<VerifyPaymentResponse>(`/api/checkout/verify/${reference}`, { method: "POST" }),

  mySubscription: () => request<MySubscription | null>("/api/subscriptions/me"),

  // --- Uploads ------------------------------------------------
  uploadFile: async (file: File): Promise<{ filename: string; url: string }> => {
    const token = getToken();
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`${API_URL}/api/uploads`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: form,
    });
    if (!res.ok) throw new ApiError(res.status, "Upload failed");
    return res.json();
  },

  // --- Admin: learners / subscriptions / companies ------------------------
  adminListLearners: (params: { q?: string; status_filter?: string; page?: number } = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined) as [string, string][]
    ).toString();
    return request<AdminLearnersResponse>(`/api/admin/users/learners${qs ? `?${qs}` : ""}`);
  },

  adminInviteLearner: (email: string) =>
    request(`/api/admin/users/learners/invite?email=${encodeURIComponent(email)}`, {
      method: "POST",
    }),

  adminSubscriptions: () => request<AdminSubscriptionsResponse>("/api/admin/subscriptions"),

  adminCompanies: (params: { tier?: string; status_filter?: string } = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined) as [string, string][]
    ).toString();
    return request<AdminCompaniesResponse>(`/api/admin/companies${qs ? `?${qs}` : ""}`);
  },

  adminInviteCompany: (email: string) =>
    request(`/api/admin/companies/invite?email=${encodeURIComponent(email)}`, { method: "POST" }),

  adminReviewCompany: (userId: number, approve: boolean) =>
    request(`/api/admin/companies/${userId}/review?approve=${approve}`, { method: "POST" }),
};

export { ApiError };
