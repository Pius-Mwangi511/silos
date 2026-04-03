// ── Auth ──────────────────────────────────────────────────────
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  phone: string;
  bio?: string;
}

export interface ForgotPasswordDto { email: string; }
export interface ResetPasswordDto  { token: string; newPassword: string; }
export interface VerifyEmailDto    { token: string; }

export interface AuthResponse {
  access_token: string;
  user: User;
}

// ── User ──────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  experience?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'; // ← was string
  skills?: string[];
  role?: string;
  isVerified?: boolean;
  createdAt?: string;
}

// ── Silos ─────────────────────────────────────────────────────
export type ExperienceLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export interface CreateSiloDto {
  skill: string;
  level: ExperienceLevel;
}

export interface Silo {
  id: string;
  skill: string;
  level: ExperienceLevel;
  createdBy: string;
  createdAt: string;
  _count?: { members: number; challenges: number };
  creator?: User;
}

// ── Membership ────────────────────────────────────────────────
export interface Member {
  id: string;
  userId: string;
  siloId: string;
  joinedAt: string;
  user?: User;
}

// ── Challenges ────────────────────────────────────────────────
export interface CreateChallengeDto {
  title: string;
  description: string;
  dueDate?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  dueDate?: string;
  siloId: string;
  createdBy: string;
  createdAt: string;
  creator?: User;
  _count?: { submissions: number };
}

// ── Submissions ───────────────────────────────────────────────
export interface CreateSubmissionDto {
  content: string;
  resourceUrl?: string;
}

export interface Submission {
  id: string;
  content: string;
  resourceUrl?: string;
  challengeId: string;
  userId: string;
  createdAt: string;
  user?: User;
  reviews?: PeerReview[];
}

// ── Peer Reviews ──────────────────────────────────────────────
export interface CreatePeerReviewDto {
  score: number;
  comment?: string;
}

export interface PeerReview {
  id: string;
  score: number;
  comment?: string;
  submissionId: string;
  reviewerId: string;
  createdAt: string;
  reviewer?: User;
}

// ── Consultations ─────────────────────────────────────────────
export interface CreateConsultationDto {
  fromSiloId: string;
  toSiloId: string;
  description: string;
}

export interface Consultation {
  id: string;
  fromSiloId: string;
  toSiloId: string;
  description: string;
  responseMessage?: string;
  status: 'OPEN' | 'PENDING' | 'RESPONDED'; // ← added 'OPEN'
  respondedAt?: string;                       // ← added
  createdAt: string;
  fromSilo?: Silo;
  toSilo?: Silo;
}

// ── Cross-Silo ────────────────────────────────────────────────
export interface CreateRequestDto {
  title: string;
  content: string;
}

export interface CrossSiloRequest {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  fromUserId?: string;
  fromUser?: { id: string; name: string; email: string };
  user?: { id: string; name: string; email: string };   // fallback
  replies?: CrossSiloReply[];
}

export interface CrossSiloReply {
  id: string;
  message: string;
  createdAt: string;
  userId: string;
  user?: { id: string; name: string; email: string };
}

// ── Messages ──────────────────────────────────────────────────
export interface Message {
  id: string;
  content: string;
  siloId: string;
  userId: string;
  createdAt: string;
  user?: User;
}

// ── Notifications ─────────────────────────────────────────────
export interface Notification {
  id: string;
  message: string;
  isRead: boolean;
  userId: string;
  createdAt: string;
}

// ── Feedback ──────────────────────────────────────────────────
export interface CreateFeedbackDto {
  message: string;
  rating?: number;
}

export interface Feedback {
  id: string;
  message: string;
  rating?: number;
  siloId: string;
  userId: string;
  createdAt: string;
  user?: User;
}

// ── Resources ─────────────────────────────────────────────────
export interface Resource {
  id: string;
  title: string;
  fileUrl: string;
  fileType: string;
  siloId: string;
  userId: string;
  createdAt: string;
  user?: User;
}
