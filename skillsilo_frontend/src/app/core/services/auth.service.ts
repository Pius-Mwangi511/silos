import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import {
  LoginDto,
  RegisterDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyEmailDto,
  AuthResponse,
  User,
} from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = `${environment.apiUrl}/auth`;

  // BehaviorSubject to hold the current logged-in user
  private _currentUser = new BehaviorSubject<User | null>(this.loadUser());
  currentUser$ = this._currentUser.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  // Getters
  get currentUser(): User | null {
    return this._currentUser.value;
  }

  get token(): string | null {
    return localStorage.getItem('ss_token');
  }

  get isLoggedIn(): boolean {
    return !!this.token;
  }

  // =========================
  // AUTH METHODS
  // =========================

  register(dto: RegisterDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/register`, dto).pipe(
      tap((res) => this.setSession(res))
    );
  }

  login(dto: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/login`, dto).pipe(
      tap((res) => this.setSession(res))
    );
  }

  forgotPassword(dto: ForgotPasswordDto) {
    return this.http.post(`${this.api}/forgot-password`, dto);
  }

  resetPassword(dto: ResetPasswordDto) {
    return this.http.post(`${this.api}/reset-password`, dto);
  }

  verifyEmail(dto: VerifyEmailDto) {
    return this.http.post(`${this.api}/verify-email`, dto);
  }

  logout() {
    localStorage.removeItem('ss_token');
    localStorage.removeItem('ss_user');
    this._currentUser.next(null);
    this.router.navigate(['/auth/login']);
  }

  // =========================
  // PRIVATE HELPERS
  // =========================

  private setSession(res: AuthResponse) {
    if (!res.access_token || !res.user) {
      console.warn('AuthService: invalid login/register response', res);
      return;
    }

    try {
      localStorage.setItem('ss_token', res.access_token);
      localStorage.setItem('ss_user', JSON.stringify(res.user));
      this._currentUser.next(res.user);
    } catch (err) {
      console.error('AuthService: failed to save user to localStorage', err);
    }
  }

  private loadUser(): User | null {
    const raw = localStorage.getItem('ss_user');

    // Guard against 'undefined' or 'null' strings
    if (!raw || raw === 'undefined' || raw === 'null') {
      localStorage.removeItem('ss_user'); // clean bad data
      return null;
    }

    try {
      return JSON.parse(raw);
    } catch (err) {
      console.error('AuthService: invalid JSON in localStorage ss_user', err);
      localStorage.removeItem('ss_user'); // clean bad data
      return null;
    }
  }
}