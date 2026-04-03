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
        <div>
          <h1>Profile</h1>
          <p>Manage your account details.</p>
        </div>
      </div>

      <div class="profile-layout">

        <!-- ── Avatar card ── -->
        <div class="card avatar-card">
          <div class="big-avatar">{{ initials }}</div>
          <h2>{{ user?.name }}</h2>
          <p class="user-email">{{ user?.email }}</p>
          <p *ngIf="user?.bio" class="bio">{{ user?.bio }}</p>

          <div *ngIf="user?.experience" class="info-chip">
            🏆 {{ user?.experience | titlecase }}
          </div>

          <div *ngIf="user?.skills?.length" class="skills-row">
            <span *ngFor="let s of user?.skills" class="skill-chip">{{ s }}</span>
          </div>

          <button
            class="btn btn--danger"
            style="margin-top:20px;width:100%;justify-content:center"
            (click)="logout()">
            Sign Out
          </button>
        </div>

        <!-- ── Edit form ── -->
        <div class="card edit-card">
          <h2 style="margin-bottom:20px;font-size:17px">Edit Profile</h2>

          <form [formGroup]="form" (ngSubmit)="save()">
            <div style="display:flex;flex-direction:column;gap:16px">

              <div class="form-field">
                <label>Full Name</label>
                <input type="text" formControlName="name" placeholder="Your full name" />
                <div *ngIf="form.get('name')?.touched && form.get('name')?.invalid"
                     class="field-error">Name is required.</div>
              </div>

              <div class="form-field">
                <label>Phone</label>
                <input type="tel" formControlName="phone" placeholder="+254 700 000 000" />
              </div>

              <div class="form-field">
                <label>Bio</label>
                <textarea
                  formControlName="bio"
                  placeholder="Tell the community about yourself…"></textarea>
              </div>

              <!-- Experience — dropdown matching ExperienceLevel enum -->
              <div class="form-field">
                <label>Experience Level</label>
                <select formControlName="experience">
                  <option *ngFor="let lvl of experienceLevels" [value]="lvl.value">
                    {{ lvl.label }}
                  </option>
                </select>
              </div>

              <!-- Skills — comma-separated input -->
              <div class="form-field">
                <label>
                  Skills
                  <span class="label-hint">(comma-separated)</span>
                </label>
                <input
                  type="text"
                  formControlName="skillsInput"
                  placeholder="e.g. Angular, NestJS, Prisma" />
              </div>

              <div *ngIf="error" class="error-msg">{{ error }}</div>
              <div *ngIf="success" class="success-msg">✓ Profile updated successfully!</div>

              <div>
                <button
                  type="submit"
                  class="btn btn--primary"
                  [disabled]="saving || form.invalid">
                  {{ saving ? 'Saving…' : 'Save Changes' }}
                </button>
              </div>

            </div>
          </form>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 28px; }
    .page-header h1 { font-size: 24px; font-weight: 700; margin-bottom: 4px; }
    .page-header p { font-size: 14px; color: var(--text-secondary); }

    .profile-layout {
      display: grid;
      grid-template-columns: 260px 1fr;
      gap: 24px;
      align-items: start;
    }

    /* ── Avatar card ── */
    .avatar-card {
      display: flex; flex-direction: column;
      align-items: center; text-align: center;
    }
    .big-avatar {
      width: 80px; height: 80px; border-radius: 50%;
      background: var(--accent-dim); color: var(--accent);
      display: flex; align-items: center; justify-content: center;
      font-family: var(--font-display); font-weight: 800; font-size: 30px;
      margin-bottom: 14px;
      border: 3px solid var(--accent);
    }
    .avatar-card h2 { font-size: 18px; font-weight: 700; margin-bottom: 4px; }
    .user-email { font-size: 13px; color: var(--text-secondary); margin-bottom: 8px; }
    .bio {
      font-size: 13px; color: var(--text-muted);
      font-style: italic; line-height: 1.5; margin-bottom: 8px;
    }
    .info-chip {
      font-size: 12px; color: var(--text-secondary);
      background: var(--bg-elevated); border: 1px solid var(--border);
      border-radius: 100px; padding: 4px 12px; margin-top: 8px;
    }
    .skills-row {
      display: flex; flex-wrap: wrap; gap: 6px;
      justify-content: center; margin-top: 10px;
    }
    .skill-chip {
      font-size: 11px; font-weight: 600;
      background: var(--accent-dim); color: var(--accent);
      border: 1px solid rgba(245,166,35,0.2);
      border-radius: 100px; padding: 3px 10px;
    }

    /* ── Card base ── */
    .card {
      background: var(--bg-elevated); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 28px;
    }

    /* ── Form fields ── */
    .form-field { display: flex; flex-direction: column; gap: 6px; }
    .form-field label {
      font-size: 12px; font-weight: 600; color: var(--text-secondary);
      text-transform: uppercase; letter-spacing: 0.03em;
    }
    .label-hint {
      font-size: 11px; color: var(--text-muted);
      text-transform: none; font-weight: 400; margin-left: 4px;
    }
    .form-field input,
    .form-field textarea,
    .form-field select {
      background: var(--bg-surface); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 10px 14px;
      color: var(--text-primary); font-family: var(--font-body);
      font-size: 14px; outline: none; transition: border-color 0.2s;
      width: 100%; box-sizing: border-box;
    }
    .form-field input:focus,
    .form-field textarea:focus,
    .form-field select:focus { border-color: var(--accent); }
    .form-field textarea { resize: vertical; min-height: 90px; }
    .form-field select { appearance: none; cursor: pointer; }

    .field-error { font-size: 12px; color: #f87171; margin-top: 2px; }

    /* ── Status messages ── */
    .error-msg {
      font-size: 13px; color: #f87171;
      background: rgba(248,113,113,0.08);
      border: 1px solid rgba(248,113,113,0.2);
      border-radius: 8px; padding: 10px 14px;
    }
    .success-msg {
      font-size: 13px; color: #4ade80;
      background: rgba(74,222,128,0.08);
      border: 1px solid rgba(74,222,128,0.2);
      border-radius: 8px; padding: 10px 14px;
    }

    /* ── Buttons ── */
    .btn {
      padding: 10px 20px; border-radius: var(--radius);
      font-size: 14px; font-weight: 600; cursor: pointer;
      border: none; font-family: var(--font-body);
      transition: all 0.2s; display: inline-flex; align-items: center; gap: 6px;
    }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn--primary { background: var(--accent); color: var(--bg-primary); }
    .btn--primary:not(:disabled):hover { opacity: 0.9; transform: translateY(-1px); }
    .btn--danger {
      background: rgba(248,113,113,0.1); color: #f87171;
      border: 1px solid rgba(248,113,113,0.25);
    }
    .btn--danger:hover { background: rgba(248,113,113,0.2); }

    @media (max-width: 700px) {
      .profile-layout { grid-template-columns: 1fr; }
    }
  `]
})
export class ProfileComponent implements OnInit {

  user: User | null = null;
  saving = false;
  error = '';
  success = false;
  form!: FormGroup;

  // Exact values matching your Prisma ExperienceLevel enum
  readonly experienceLevels = [
    { value: '',             label: 'Not specified' },
    { value: 'BEGINNER',     label: 'Beginner'     },
    { value: 'INTERMEDIATE', label: 'Intermediate' },
    { value: 'ADVANCED',     label: 'Advanced'     },
  ];

  constructor(
    private auth: AuthService,
    private api: ApiService,
    private fb: FormBuilder,
    private toast: ToastService
  ) {}

  get initials(): string {
    return this.user?.name
      ?.split(' ')
      .map(w => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  }

  ngOnInit() {
    this.form = this.fb.group({
      name:        ['', Validators.required],
      phone:       [''],
      bio:         [''],
      experience:  [''],        // empty string = "Not specified"
      skillsInput: ['']         // comma-separated string → array on save
    });

    // Load from auth service (reads localStorage on init)
    this.user = this.auth.currentUser;
    this.patchForm(this.user);

    // Stay in sync if currentUser$ emits a new value
    this.auth.currentUser$.subscribe(u => {
      this.user = u;
      this.patchForm(u);
    });
  }

  private patchForm(u: User | null) {
    if (!u) return;
    this.form.patchValue({
      name:        u.name                  ?? '',
      phone:       u.phone                 ?? '',
      bio:         u.bio                   ?? '',
      experience:  u.experience            ?? '',
      skillsInput: u.skills?.join(', ')    ?? ''
    });
  }

  save() {
    if (this.form.invalid || !this.user) return;

    this.saving = true;
    this.error  = '';
    this.success = false;

    const raw = this.form.value;

    // Convert comma-separated skills string → clean array
    const skills: string[] = raw.skillsInput
      ? raw.skillsInput.split(',').map((s: string) => s.trim()).filter(Boolean)
      : [];

    // Send undefined for empty strings so Prisma ignores those fields
    // Critically: experience must be a valid enum value or undefined — never ""
    const payload: Partial<User> = {
      name:       raw.name,
      phone:      raw.phone      || undefined,
      bio:        raw.bio        || undefined,
      experience: (raw.experience || undefined) as User['experience'],
      skills:     skills.length ? skills : undefined,
    };

    this.api.updateUser(this.user.id, payload).subscribe({
      next: (updatedUser) => {
        this.saving  = false;
        this.success = true;

        // ✅ Write updated user back to localStorage + BehaviorSubject
        // so a page refresh still shows the new data
        this.auth.updateCurrentUser(updatedUser);

        this.toast.success('Profile updated!');
        setTimeout(() => this.success = false, 3000);
      },
      error: (e) => {
        this.saving = false;
        this.error  = e?.error?.message || 'Update failed. Please try again.';
      }
    });
  }

  logout() {
    this.auth.logout();
  }
}