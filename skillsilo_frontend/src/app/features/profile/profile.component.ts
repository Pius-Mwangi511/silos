import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { User } from '../../shared/models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="animate-fade-in">
      <div class="page-header">
        <div><h1>Profile</h1><p>Manage your account details.</p></div>
      </div>

      <div class="profile-layout">
        <!-- Avatar section -->
        <div class="card avatar-card">
          <div class="big-avatar">{{ initials }}</div>
          <h2>{{ user?.name }}</h2>
          <p>{{ user?.email }}</p>
          @if (user?.bio) { <p class="bio">{{ user?.bio }}</p> }
          <button class="btn btn--danger" style="margin-top:16px;width:100%;justify-content:center" (click)="logout()">
            Sign Out
          </button>
        </div>

        <!-- Edit form -->
        <div class="card edit-card">
          <h2 style="margin-bottom:20px;font-size:17px">Edit Profile</h2>
          <form [formGroup]="form" (ngSubmit)="save()">
            <div style="display:flex;flex-direction:column;gap:16px">
              <div class="form-field"><label>Full Name</label><input type="text" formControlName="name" /></div>
              <div class="form-field"><label>Phone</label><input type="tel" formControlName="phone" /></div>
              <div class="form-field"><label>Bio</label><textarea formControlName="bio" placeholder="Tell the community about yourself…"></textarea></div>
              @if (error)   { <div class="error-msg">{{ error }}</div> }
              @if (success) { <div class="success-msg">✓ Profile updated!</div> }
              <div>
                <button type="submit" class="btn btn--primary" [disabled]="saving">
                  @if (saving) { <span class="spinner" style="width:14px;height:14px"></span> }
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-layout { display: grid; grid-template-columns: 240px 1fr; gap: 24px; align-items: start; }
    .avatar-card { display: flex; flex-direction: column; align-items: center; text-align: center; }
    .big-avatar {
      width: 72px; height: 72px; border-radius: 50%;
      background: var(--accent-dim); color: var(--accent);
      display: flex; align-items: center; justify-content: center;
      font-family: var(--font-display); font-weight: 800; font-size: 28px;
      margin-bottom: 14px;
    }
    .avatar-card h2 { font-size: 17px; margin-bottom: 4px; }
    .avatar-card p { font-size: 13px; color: var(--text-secondary); }
    .bio { font-size: 12px; color: var(--text-muted); margin-top: 6px; font-style: italic; }
    .success-msg {
      color: var(--success); font-size: 13px; padding: 10px 14px;
      background: rgba(76,175,125,0.08); border-radius: var(--radius);
      border: 1px solid rgba(76,175,125,0.2);
    }
    @media (max-width: 700px) { .profile-layout { grid-template-columns: 1fr; } }
  `]
})
export class ProfileComponent implements OnInit {

  user: User | null = null;
  saving = false;
  error = '';
  success = false;

  form!: FormGroup;

  constructor(
    private auth: AuthService,
    private api: ApiService,
    private fb: FormBuilder,
    private toast: ToastService
  ) {}

  get initials() {
    return this.user?.name?.split(' ')
      .map(w => w[0])
      .join('')
      .toUpperCase()
      .slice(0,2) || 'U';
  }

  ngOnInit() {

    this.form = this.fb.group({
      name: ['', Validators.required],
      phone: [''],
      bio: ['']
    });

    this.user = this.auth.currentUser;

    if (this.user) {
      this.form.patchValue({
        name: this.user.name,
        phone: this.user.phone ?? '',
        bio: this.user.bio ?? ''
      });
    }
  }

  save() {
    if (this.form.invalid || !this.user) return;

    this.saving = true;
    this.error = '';
    this.success = false;

    this.api.updateUser(this.user.id, this.form.value as any).subscribe({
      next: (u) => {
        this.user = u;
        this.saving = false;
        this.success = true;
        this.toast.success('Profile updated!');
        setTimeout(() => this.success = false, 3000);
      },
      error: (e) => {
        this.error = e.error?.message || 'Update failed';
        this.saving = false;
      }
    });
  }

  logout() {
    this.auth.logout();
  }
}