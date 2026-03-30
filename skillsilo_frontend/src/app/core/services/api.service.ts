import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  Silo, CreateSiloDto, Challenge, CreateChallengeDto,
  Submission, CreateSubmissionDto, PeerReview, CreatePeerReviewDto,
  Consultation, CreateConsultationDto, CrossSiloRequest, CreateRequestDto,
  Message, Notification, Feedback, CreateFeedbackDto, Resource,
  User, Member
} from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = environment.apiUrl;
  constructor(private http: HttpClient) {}

  // ── Users ────────────────────────────────────────────────────
  getUser(id: string) { return this.http.get<User>(`${this.base}/users/${id}`); }
  getAllUsers() { return this.http.get<User[]>(`${this.base}/users`); }
  updateUser(id: string, dto: Partial<User>) { return this.http.patch<User>(`${this.base}/users/${id}`, dto); }
  deleteUser(id: string) { return this.http.delete(`${this.base}/users/${id}`); }

  // ── Silos ─────────────────────────────────────────────────────
  createSilo(dto: CreateSiloDto) { return this.http.post<Silo>(`${this.base}/silos`, dto); }
  getSilos(skill?: string, level?: string) {
    let params = new HttpParams();
    if (skill) params = params.set('skill', skill);
    if (level) params = params.set('level', level);
    return this.http.get<Silo[]>(`${this.base}/silos`, { params });
  }
  getSilo(id: string) { return this.http.get<Silo>(`${this.base}/silos/${id}`); }

  // ── Membership ────────────────────────────────────────────────
  joinSilo(id: string) { return this.http.post(`${this.base}/silos/${id}/join`, {}); }
  leaveSilo(id: string) { return this.http.patch(`${this.base}/silos/${id}/leave`, {}); }
  getSiloMembers(id: string) { return this.http.get<Member[]>(`${this.base}/silos/${id}/members`); }

  // ── Challenges ────────────────────────────────────────────────
  createChallenge(siloId: string, dto: CreateChallengeDto) {
    return this.http.post<Challenge>(`${this.base}/silos/${siloId}/challenges`, dto);
  }
  getSiloChallenges(siloId: string) {
    return this.http.get<Challenge[]>(`${this.base}/silos/${siloId}/challenges`);
  }
  getChallenge(siloId: string, id: string) {
    return this.http.get<Challenge>(`${this.base}/silos/${siloId}/challenges/${id}`);
  }

  // ── Submissions ───────────────────────────────────────────────
  submitChallenge(challengeId: string, dto: CreateSubmissionDto) {
    return this.http.post<Submission>(`${this.base}/challenges/${challengeId}/submissions`, dto);
  }
  getChallengeSubmissions(challengeId: string) {
    return this.http.get<Submission[]>(`${this.base}/challenges/${challengeId}/submissions`);
  }

  // ── Peer Reviews ──────────────────────────────────────────────
  reviewSubmission(submissionId: string, dto: CreatePeerReviewDto) {
    return this.http.post<PeerReview>(`${this.base}/submissions/${submissionId}/reviews`, dto);
  }

  // ── Consultations ─────────────────────────────────────────────
  createConsultation(dto: CreateConsultationDto) {
    return this.http.post<Consultation>(`${this.base}/consultations`, dto);
  }
  getIncomingConsultations(siloId: string) {
    return this.http.get<Consultation[]>(`${this.base}/consultations/incoming/${siloId}`);
  }
  getOutgoingConsultations(siloId: string) {
    return this.http.get<Consultation[]>(`${this.base}/consultations/outgoing/${siloId}`);
  }
  respondConsultation(id: string, responseMessage: string) {
    return this.http.patch(`${this.base}/consultations/${id}/respond`, { responseMessage });
  }

  // ── Cross-Silo ────────────────────────────────────────────────
  createCrossSiloRequest(dto: CreateRequestDto) {
    return this.http.post<CrossSiloRequest>(`${this.base}/cross-silo/request`, dto);
  }
  getAllCrossSiloRequests() {
    return this.http.get<CrossSiloRequest[]>(`${this.base}/cross-silo/requests`);
  }
  replyCrossSilo(requestId: string, message: string) {
    return this.http.post(`${this.base}/cross-silo/${requestId}/reply`, { message });
  }

  // ── Messages ──────────────────────────────────────────────────
  sendMessage(siloId: string, content: string) {
    return this.http.post<Message>(`${this.base}/silos/${siloId}/messages`, { content });
  }
  getSiloMessages(siloId: string) {
    return this.http.get<Message[]>(`${this.base}/silos/${siloId}/messages`);
  }
  updateMessage(messageId: string, content: string) {
    return this.http.patch<Message>(`${this.base}/messages/${messageId}`, { content });
  }
  deleteMessage(messageId: string) {
    return this.http.delete(`${this.base}/messages/${messageId}`);
  }

  // ── Notifications ─────────────────────────────────────────────
  getNotifications() { return this.http.get<Notification[]>(`${this.base}/notifications`); }
  markNotificationRead(id: string) { return this.http.patch(`${this.base}/notifications/${id}/read`, {}); }
  deleteNotification(id: string) { return this.http.delete(`${this.base}/notifications/${id}`); }

  // ── Feedback ──────────────────────────────────────────────────
  createFeedback(siloId: string, dto: CreateFeedbackDto) {
    return this.http.post<Feedback>(`${this.base}/silos/${siloId}/feedback`, dto);
  }
  getSiloFeedback(siloId: string) {
    return this.http.get<Feedback[]>(`${this.base}/silos/${siloId}/feedback`);
  }

  // ── Resources ─────────────────────────────────────────────────
  uploadResource(siloId: string, title: string, file: File) {
    const form = new FormData();
    form.append('title', title);
    form.append('file', file);
    return this.http.post<Resource>(`${this.base}/silos/${siloId}/resources`, form);
  }
  getSiloResources(siloId: string) {
    return this.http.get<Resource[]>(`${this.base}/silos/${siloId}/resources`);
  }
  // getSilosWithoutAuth() {
  //   // Don't include Authorization header
  //   return this.http.get<Silo[]>('/silos');
  // }
  isLoggedIn(): boolean {
    return !!localStorage.getItem('ss_token'); // or whatever key you use
  }
  // Get silos the current user has already joined
// getMyMemberships() {
//   return this.http.get<{ siloId: string }[]>(`${this.base}/memberships/me`);
// }

// getMyMemberships() {
//   return this.http.get<{ siloId: string; role: string }[]>(`${this.base}/silos/my-memberships`);
// }

// Fix the base URL — was missing this.base
getSilosWithoutAuth() {
  return this.http.get<Silo[]>(`${this.base}/silos`);
}

// Fix the base URL
getMyMemberships() {
  return this.http.get<{ siloId: string; role: string }[]>(`${this.base}/silos/my-memberships`);
}
}
