import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { ChatService } from '../../../core/services/chat.service';
import { ToastService } from '../../../core/services/toast.service';

import {
  Silo,
  Challenge,
  Message,
  Resource,
  Feedback,
  Member
} from '../../../shared/models';

type Tab = 'challenges' | 'chat' | 'resources' | 'members' | 'feedback';

@Component({
  selector: 'app-silo-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="animate-fade-in">

<!-- Loading -->
<div *ngIf="loading" class="loading-row">
  <span class="spinner"></span> Loading silo…
</div>

<!-- Content -->
<div *ngIf="!loading && silo">

  <!-- Header -->
  <div class="silo-header">
    <div class="silo-header-left">
      <div class="big-avatar">
        {{ silo.skill?.[0]?.toUpperCase() }}
      </div>
      <div>
        <h1>{{ silo.skill }}</h1>
        <div class="silo-meta">
          <span class="badge badge--accent">{{ silo.level }}</span>
          <span class="meta-item">👥 {{ members.length }} members</span>
        </div>
      </div>
    </div>

    <button class="btn btn--ghost" (click)="joinOrLeave()">
      {{ isMember ? 'Leave Silo' : 'Join Silo' }}
    </button>
  </div>

  <!-- Tabs -->
  <div class="tabs">
    <button
      *ngFor="let tab of tabs; trackBy: trackById"
      class="tab"
      [class.active]="activeTab === tab.key"
      (click)="loadTab(tab.key)"
    >
      {{ tab.icon }} {{ tab.label }}
    </button>
  </div>

  <!-- TAB CONTENT -->
  <div class="tab-content">

    <!-- CHALLENGES -->
    <div *ngIf="activeTab === 'challenges'" class="tab-panel">

      <div class="panel-header">
        <h2>Challenges</h2>
      </div>

      <div *ngIf="challenges.length === 0" class="empty-state">
        <div class="icon">⚡</div>
        <h3>No challenges yet</h3>
      </div>

      <div *ngIf="challenges.length > 0" class="grid-2">
        <div
          *ngFor="let c of challenges; trackBy: trackById"
          class="challenge-card"
        >
          <div class="challenge-card-header">
            <span class="badge badge--muted">
              {{ c._count?.submissions ?? 0 }} submissions
            </span>
            <span *ngIf="c.dueDate" class="due-date">
              Due {{ c.dueDate | date:'mediumDate' }}
            </span>
          </div>

          <h3>{{ c.title }}</h3>
          <p>{{ c.description }}</p>
        </div>
      </div>
    </div>

    <!-- CHAT -->
    <div *ngIf="activeTab === 'chat'" class="chat-panel">

      <div class="messages">
        <div *ngIf="visibleMessages.length === 0" class="empty-state">
          <div class="icon">💬</div>
          <h3>Start the conversation!</h3>
        </div>

        <div
          *ngFor="let m of visibleMessages; trackBy: trackById"
          class="msg"
          [class.own]="m.userId === currentUserId"
        >
          <div class="msg-avatar">
            {{ (m.user?.name ?? 'U')[0] }}
          </div>

          <div class="msg-body">
            <div class="msg-author">
              {{ m.user?.name ?? 'Unknown' }}
              <span class="msg-time">
                {{ m.createdAt | date:'shortTime' }}
              </span>
            </div>

            <div class="msg-text">
              {{ m.content }}
            </div>
          </div>
        </div>
      </div>

      <div class="chat-input-row">
        <input
          type="text"
          [(ngModel)]="chatMessage"
          (keyup.enter)="sendMessage()"
          placeholder="Message..."
          class="chat-input"
        />

        <button
          class="btn btn--primary"
          (click)="sendMessage()"
          [disabled]="!chatMessage.trim()"
        >
          Send
        </button>
      </div>
    </div>

    <!-- RESOURCES -->
    <div *ngIf="activeTab === 'resources'" class="tab-panel">

      <div class="panel-header">
        <h2>Resources</h2>
      </div>

      <div *ngIf="resources.length === 0" class="empty-state">
        <div class="icon">📁</div>
        <h3>No resources yet</h3>
      </div>

      <div *ngIf="resources.length > 0" class="resource-list">
        <a
          *ngFor="let r of resources; trackBy: trackById"
          [href]="r.fileUrl"
          target="_blank"
          class="resource-row"
        >
          <span class="resource-icon">
            {{ r.fileType === 'image' ? '🖼️' : '📄' }}
          </span>

          <div>
            <div class="resource-title">{{ r.title }}</div>
            <div class="resource-meta">
              {{ r.createdAt | date:'mediumDate' }}
            </div>
          </div>

          <span class="resource-link">↗</span>
        </a>
      </div>
    </div>

    <!-- MEMBERS -->
    <div *ngIf="activeTab === 'members'" class="tab-panel">

      <h2>Members ({{ members.length }})</h2>

      <div *ngIf="members.length === 0" class="empty-state">
        <div class="icon">👥</div>
        <h3>No members yet</h3>
      </div>

      <div *ngIf="members.length > 0" class="member-list">
        <div
          *ngFor="let m of members; trackBy: trackById"
          class="member-row"
        >
          <div class="member-avatar">
            {{ (m.user?.name ?? 'U')[0] }}
          </div>

          <div>
            <div class="member-name">
              {{ m.user?.name }}
            </div>
            <div class="member-since">
              {{ m.joinedAt | date:'mediumDate' }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- FEEDBACK -->
    <div *ngIf="activeTab === 'feedback'" class="tab-panel">

      <div class="panel-header">
        <h2>Feedback</h2>
      </div>

      <div *ngIf="feedbacks.length === 0" class="empty-state">
        <div class="icon">⭐</div>
        <h3>No feedback yet</h3>
      </div>

      <div *ngIf="feedbacks.length > 0" class="feedback-list">
        <div
          *ngFor="let f of feedbacks; trackBy: trackById"
          class="feedback-card"
        >
          <div class="feedback-header">
            <span class="feedback-author">
              {{ f.user?.name }}
            </span>

            <span *ngIf="f.rating" class="stars">
              {{ '★'.repeat(f.rating) }}
              {{ '☆'.repeat(5 - f.rating) }}
            </span>
          </div>

          <p>{{ f.message }}</p>
        </div>
      </div>
    </div>

  </div>
</div>

<!-- Error -->
<div *ngIf="!loading && !silo" class="empty-state">
  <div class="icon">❌</div>
  <h3>Failed to load silo</h3>
</div>

</div>
  `,
  styles: [`
    .loading-row { display: flex; align-items: center; gap: 10px; color: var(--text-secondary); font-size: 14px; padding: 48px 0; }
    .silo-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 28px; flex-wrap: wrap; gap: 16px; }
    .silo-header-left { display: flex; align-items: center; gap: 20px; }
    .big-avatar {
      width: 56px; height: 56px; border-radius: 14px;
      background: var(--accent-dim); color: var(--accent);
      display: flex; align-items: center; justify-content: center;
      font-family: var(--font-display); font-weight: 800; font-size: 26px;
    }
    h1 { font-size: 26px; margin-bottom: 6px; }
    .silo-meta { display: flex; align-items: center; gap: 12px; }
    .meta-item { font-size: 13px; color: var(--text-secondary); }
    .tabs { display: flex; gap: 2px; border-bottom: 1px solid var(--border); margin-bottom: 24px; overflow-x: auto; }
    .tab {
      background: none; border: none; padding: 10px 18px;
      color: var(--text-secondary); font-size: 14px; font-weight: 500;
      cursor: pointer; border-bottom: 2px solid transparent;
      transition: all var(--transition); white-space: nowrap;
    }
    .tab:hover { color: var(--text-primary); }
    .tab.active { color: var(--accent); border-bottom-color: var(--accent); }
    .panel-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
    .panel-header h2 { font-size: 17px; }
    .challenge-card {
      background: var(--bg-elevated); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 20px; display: block;
      transition: all var(--transition);
    }
    .challenge-card:hover { border-color: var(--accent); transform: translateY(-1px); }
    .challenge-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
    .challenge-card h3 { font-size: 15px; margin-bottom: 6px; }
    .challenge-card p { font-size: 13px; color: var(--text-secondary); line-height: 1.5; }
    .due-date { font-size: 11px; color: var(--text-muted); }
    /* Chat */
    .chat-panel { display: flex; flex-direction: column; height: 500px; background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; }
    .messages { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 12px; }
    .msg { display: flex; gap: 10px; }
    .msg.own { flex-direction: row-reverse; }
    .msg-avatar {
      width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0;
      background: var(--bg-elevated); border: 1px solid var(--border);
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 600; color: var(--accent);
    }
    .msg-body { max-width: 70%; }
    .msg-author { font-size: 11px; color: var(--text-muted); margin-bottom: 4px; }
    .msg-time { margin-left: 6px; }
    .msg-text { background: var(--bg-elevated); border: 1px solid var(--border); border-radius: 12px; padding: 8px 12px; font-size: 14px; }
    .own .msg-text { background: var(--accent-dim); border-color: rgba(245,166,35,0.2); }
    .chat-input-row { display: flex; gap: 10px; padding: 14px; border-top: 1px solid var(--border); }
    .chat-input {
      flex: 1; background: var(--bg-elevated); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 9px 14px; color: var(--text-primary);
      font-family: var(--font-body); font-size: 14px; outline: none;
    }
    .chat-input:focus { border-color: var(--accent); }
    /* Resources */
    .resource-list { display: flex; flex-direction: column; gap: 8px; }
    .resource-row {
      display: flex; align-items: center; gap: 14px;
      padding: 14px 16px; background: var(--bg-elevated); border: 1px solid var(--border);
      border-radius: var(--radius); transition: border-color var(--transition);
    }
    .resource-row:hover { border-color: var(--accent); }
    .resource-icon { font-size: 22px; }
    .resource-title { font-size: 14px; font-weight: 500; }
    .resource-meta { font-size: 12px; color: var(--text-muted); }
    .resource-link { margin-left: auto; color: var(--accent); font-size: 16px; }
    .file-input { color: var(--text-secondary); font-size: 13px; }
    /* Members */
    .member-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }
    .member-row { display: flex; align-items: center; gap: 12px; padding: 14px; background: var(--bg-elevated); border: 1px solid var(--border); border-radius: var(--radius); }
    .member-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: var(--accent-dim); color: var(--accent);
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 14px;
    }
    .member-name { font-size: 14px; font-weight: 500; }
    .member-since { font-size: 11px; color: var(--text-muted); }
    /* Feedback */
    .feedback-list { display: flex; flex-direction: column; gap: 12px; }
    .feedback-card { background: var(--bg-elevated); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 16px; }
    .feedback-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
    .feedback-author { font-weight: 600; font-size: 14px; }
    .stars { color: var(--accent); letter-spacing: 2px; font-size: 14px; }
    .feedback-card p { font-size: 14px; color: var(--text-secondary); }
    .star-row { display: flex; gap: 4px; }
    .star-btn { background: none; border: none; cursor: pointer; font-size: 24px; color: var(--border); transition: color var(--transition); }
    .star-btn.active { color: var(--accent); }
    `]
})
export class SiloDetailComponent implements OnInit, OnDestroy {

  silo: Silo | null = null;
  loading = true;
  activeTab: Tab = 'challenges';
  siloId = '';

  challenges: Challenge[] = [];
  messages: Message[] = [];
  visibleMessages: Message[] = [];
  resources: Resource[] = [];
  members: Member[] = [];
  feedbacks: Feedback[] = [];

  chatMessage = '';
  isMember = false;

  challengeForm!: FormGroup;
  feedbackForm!: FormGroup;

  private chatSub: any;

  readonly tabs = [
    { key: 'challenges' as Tab, label: 'Challenges', icon: '⚡' },
    { key: 'chat' as Tab, label: 'Chat', icon: '💬' },
    { key: 'resources' as Tab, label: 'Resources', icon: '📁' },
    { key: 'members' as Tab, label: 'Members', icon: '👥' },
    { key: 'feedback' as Tab, label: 'Feedback', icon: '⭐' },
  ];

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private auth: AuthService,
    private chat: ChatService,
    private fb: FormBuilder,
    private toast: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.initForms();

    this.siloId = this.route.snapshot.paramMap.get('id') || '';

    if (!this.siloId) {
      this.loading = false;
      this.toast.error('Invalid silo ID');
      return;
    }

    this.loadSilo();

    // 🔥 FIX: Ensure socket connects AFTER siloId is ready
    this.initChat();
  }

  ngOnDestroy() {
    this.chat.disconnect();
    this.chatSub?.unsubscribe();
  }

  // =========================
  // INIT METHODS
  // =========================

  private initForms() {
    this.challengeForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      dueDate: ['']
    });

    this.feedbackForm = this.fb.group({
      message: ['', Validators.required],
      rating: [null]
    });
  }

  private loadSilo() {
    this.loading = true;

    this.api.getSilo(this.siloId).subscribe({
      next: (s) => {
        this.silo = s;
        this.loading = false;

        this.loadTab(this.activeTab);

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.toast.error('Failed to load silo');
        this.cdr.detectChanges();
      }
    });
  }

  private initChat() {
    this.chat.connect();

    // 🔥 FIX: join AFTER connection (important for rooms)
    this.chat.joinSilo(this.siloId);

    // 🔥 FIX: listen to SINGLE messages, not array
    // ❌ OLD: messagesArray
    // this.chatSub = this.chat.messages$.subscribe(messagesArray => {
    //   this.messages = messagesArray;
    // });

    // ✅ NEW:
    this.chatSub = this.chat.onMessage().subscribe((msg: Message) => {
      this.messages = [...this.messages, msg]; // append instead of overwrite
      this.updateVisibleMessages();
      this.cdr.detectChanges();
    });
  }

  get currentUserId() {
    return this.auth.currentUser?.id;
  }

  private updateVisibleMessages() {
    this.visibleMessages = this.messages.slice(-50);
  }

  // =========================
  // TAB LOADING
  // =========================

  loadTab(tab: Tab) {
    if (!this.siloId) return;

    this.activeTab = tab;

    switch (tab) {

      case 'challenges':
        this.api.getSiloChallenges(this.siloId).subscribe({
          next: (c) => {
            this.challenges = c ?? [];
            this.cdr.detectChanges();
          },
          error: () => this.toast.error('Failed to load challenges')
        });
        break;

      case 'chat':
        this.api.getSiloMessages(this.siloId).subscribe({
          next: (m) => {
            this.messages = m ?? [];

            // 🔥 FIX: ensure UI updates correctly after reload
            this.updateVisibleMessages();

            this.cdr.detectChanges();
          },
          error: () => this.toast.error('Failed to load messages')
        });
        break;

      case 'resources':
        this.api.getSiloResources(this.siloId).subscribe({
          next: (r) => {
            this.resources = r ?? [];
            this.cdr.detectChanges();
          },
          error: () => this.toast.error('Failed to load resources')
        });
        break;

      case 'members':
        this.api.getSiloMembers(this.siloId).subscribe({
          next: (m) => {
            this.members = m ?? [];
            this.isMember = this.members.some(
              x => x.userId === this.currentUserId
            );
            this.cdr.detectChanges();
          },
          error: () => this.toast.error('Failed to load members')
        });
        break;

      case 'feedback':
        this.api.getSiloFeedback(this.siloId).subscribe({
          next: (f) => {
            this.feedbacks = f ?? [];
            this.cdr.detectChanges();
          },
          error: () => this.toast.error('Failed to load feedback')
        });
        break;
    }
  }

  // =========================
  // CHAT
  // =========================

  sendMessage() {
    const content = this.chatMessage.trim();
    if (!content) return;

    // 🔥 FIX: Only do optimistic update if user exists
    if (!this.currentUserId) {
      console.warn('User not logged in');
      return;
    }

    const msg: Message = {
      id: crypto.randomUUID(),
      siloId: this.siloId,
      content,
      userId: this.currentUserId,
      createdAt: new Date().toISOString(),
      user: this.auth.currentUser ?? undefined
    };

    // 🔥 FIX: optimistic update (safe now)
    this.messages = [...this.messages, msg];
    this.updateVisibleMessages();
    this.cdr.detectChanges();

    // 🔥 FIX: backend will send REAL message via socket
    this.chat.sendMessage(this.siloId, content);

    this.chatMessage = '';
  }

  // =========================
  // MEMBERSHIP
  // =========================

  joinOrLeave() {
    const action = this.isMember
      ? this.api.leaveSilo(this.siloId)
      : this.api.joinSilo(this.siloId);

    action.subscribe({
      next: () => {
        this.isMember = !this.isMember;
        this.loadTab('members');
        this.cdr.detectChanges();
      },
      error: () => this.toast.error('Action failed')
    });
  }

  // =========================
  // PERFORMANCE
  // =========================

  trackById(index: number, item: any) {
    return item?.id ?? index;
  }
}













// template: `
// <div class="animate-fade-in">
//   @if (loading) {
//     <div class="loading-row"><span class="spinner"></span> Loading silo…</div>
//   } @else if (silo) {
//     <!-- Header -->
//     <div class="silo-header">
//       <div class="silo-header-left">
//         <div class="big-avatar">{{ silo.skill[0].toUpperCase() }}</div>
//         <div>
//           <h1>{{ silo.skill }}</h1>
//           <div class="silo-meta">
//             <span class="badge badge--accent">{{ silo.level }}</span>
//             <span class="meta-item">👥 {{ members.length }} members</span>
//           </div>
//         </div>
//       </div>
//       <div class="header-actions">
//         <button class="btn btn--ghost" (click)="joinOrLeave()">
//           {{ isMember ? 'Leave Silo' : 'Join Silo' }}
//         </button>
//       </div>
//     </div>

//     <!-- Tabs -->
//     <div class="tabs">
//       @for (tab of tabs; track tab.key) {
//         <button class="tab" [class.active]="activeTab === tab.key" (click)="activeTab = tab.key; loadTab(tab.key)">
//           {{ tab.icon }} {{ tab.label }}
//         </button>
//       }
//     </div>

//     <!-- Tab Content -->
//     <div class="tab-content">

//       <!-- CHALLENGES -->
//       @if (activeTab === 'challenges') {
//         <div class="tab-panel animate-fade-in">
//           <div class="panel-header">
//             <h2>Challenges</h2>
//             <button class="btn btn--primary" (click)="showChallengeModal = true">+ Add Challenge</button>
//           </div>
//           @if (challenges.length === 0) {
//             <div class="empty-state"><div class="icon">⚡</div><h3>No challenges yet</h3></div>
//           } @else {
//             <div class="grid-2">
//               @for (c of challenges; track c.id) {
//                 <a [routerLink]="['/silos', silo.id, 'challenges', c.id]" class="challenge-card">
//                   <div class="challenge-card-header">
//                     <span class="badge badge--muted">{{ c._count?.submissions ?? 0 }} submissions</span>
//                     @if (c.dueDate) { <span class="due-date">Due {{ c.dueDate | date:'mediumDate' }}</span> }
//                   </div>
//                   <h3>{{ c.title }}</h3>
//                   <p>{{ c.description }}</p>
//                 </a>
//               }
//             </div>
//           }
//         </div>
//       }

//       <!-- CHAT -->
//       @if (activeTab === 'chat') {
//         <div class="chat-panel animate-fade-in">
//           <div class="messages" #messagesEl>
//             @if (messages.length === 0) {
//               <div class="empty-state"><div class="icon">💬</div><h3>Start the conversation!</h3></div>
//             }
//             @for (m of messages; track m.id) {
//               <div class="msg" [class.own]="m.userId === currentUserId">
//                 <div class="msg-avatar">{{ (m.user?.name ?? 'U')[0] }}</div>
//                 <div class="msg-body">
//                   <div class="msg-author">{{ m.user?.name ?? 'Unknown' }} <span class="msg-time">{{ m.createdAt | date:'shortTime' }}</span></div>
//                   <div class="msg-text">{{ m.content }}</div>
//                 </div>
//               </div>
//             }
//           </div>
//           <div class="chat-input-row">
//             <input type="text" [(ngModel)]="chatMessage" placeholder="Message this silo…"
//               (keyup.enter)="sendMessage()" class="chat-input" />
//             <button class="btn btn--primary" (click)="sendMessage()" [disabled]="!chatMessage.trim()">Send</button>
//           </div>
//         </div>
//       }

//       <!-- RESOURCES -->
//       @if (activeTab === 'resources') {
//         <div class="tab-panel animate-fade-in">
//           <div class="panel-header">
//             <h2>Resources</h2>
//             <button class="btn btn--primary" (click)="showResourceModal = true">+ Upload</button>
//           </div>
//           @if (resources.length === 0) {
//             <div class="empty-state"><div class="icon">📁</div><h3>No resources yet</h3></div>
//           } @else {
//             <div class="resource-list">
//               @for (r of resources; track r.id) {
//                 <a [href]="r.fileUrl" target="_blank" class="resource-row">
//                   <span class="resource-icon">{{ r.fileType === 'image' ? '🖼️' : '📄' }}</span>
//                   <div>
//                     <div class="resource-title">{{ r.title }}</div>
//                     <div class="resource-meta">Uploaded {{ r.createdAt | date:'mediumDate' }}</div>
//                   </div>
//                   <span class="resource-link">↗</span>
//                 </a>
//               }
//             </div>
//           }
//         </div>
//       }

//       <!-- MEMBERS -->
//       @if (activeTab === 'members') {
//         <div class="tab-panel animate-fade-in">
//           <h2 style="margin-bottom:16px">Members ({{ members.length }})</h2>
//           @if (members.length === 0) {
//             <div class="empty-state"><div class="icon">👥</div><h3>No members yet</h3></div>
//           } @else {
//             <div class="member-list">
//               @for (m of members; track m.id) {
//                 <div class="member-row">
//                   <div class="member-avatar">{{ (m.user?.name ?? 'U')[0].toUpperCase() }}</div>
//                   <div>
//                     <div class="member-name">{{ m.user?.name }}</div>
//                     <div class="member-since">Joined {{ m.joinedAt | date:'mediumDate' }}</div>
//                   </div>
//                 </div>
//               }
//             </div>
//           }
//         </div>
//       }

//       <!-- FEEDBACK -->
//       @if (activeTab === 'feedback') {
//         <div class="tab-panel animate-fade-in">
//           <div class="panel-header">
//             <h2>Feedback</h2>
//             <button class="btn btn--primary" (click)="showFeedbackModal = true">+ Give Feedback</button>
//           </div>
//           @if (feedbacks.length === 0) {
//             <div class="empty-state"><div class="icon">⭐</div><h3>No feedback yet</h3></div>
//           } @else {
//             <div class="feedback-list">
//               @for (f of feedbacks; track f.id) {
//                 <div class="feedback-card">
//                   <div class="feedback-header">
//                     <span class="feedback-author">{{ f.user?.name }}</span>
//                     @if (f.rating) { <span class="stars">{{ '★'.repeat(f.rating) }}{{ '☆'.repeat(5-f.rating) }}</span> }
//                   </div>
//                   <p>{{ f.message }}</p>
//                 </div>
//               }
//             </div>
//           }
//         </div>
//       }
//     </div>
//   }

//   <!-- Challenge Modal -->
//   @if (showChallengeModal) {
//     <div class="modal-overlay" (click)="showChallengeModal = false">
//       <div class="modal" (click)="$event.stopPropagation()">
//         <div class="modal-header">
//           <h2>New Challenge</h2>
//           <button class="modal-close" (click)="showChallengeModal = false">✕</button>
//         </div>
//         <form [formGroup]="challengeForm" (ngSubmit)="createChallenge()">
//           <div style="display:flex;flex-direction:column;gap:14px">
//             <div class="form-field"><label>Title</label><input type="text" formControlName="title" placeholder="Challenge title" /></div>
//             <div class="form-field"><label>Description</label><textarea formControlName="description" placeholder="What should members do?"></textarea></div>
//             <div class="form-field"><label>Due Date (optional)</label><input type="date" formControlName="dueDate" /></div>
//             @if (challengeError) { <div class="error-msg">{{ challengeError }}</div> }
//             <div style="display:flex;gap:10px;justify-content:flex-end">
//               <button type="button" class="btn btn--ghost" (click)="showChallengeModal = false">Cancel</button>
//               <button type="submit" class="btn btn--primary" [disabled]="challengeLoading">Create</button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   }

//   <!-- Resource Upload Modal -->
//   @if (showResourceModal) {
//     <div class="modal-overlay" (click)="showResourceModal = false">
//       <div class="modal" (click)="$event.stopPropagation()">
//         <div class="modal-header">
//           <h2>Upload Resource</h2>
//           <button class="modal-close" (click)="showResourceModal = false">✕</button>
//         </div>
//         <div style="display:flex;flex-direction:column;gap:14px">
//           <div class="form-field"><label>Title</label><input type="text" [(ngModel)]="resourceTitle" placeholder="Resource title" /></div>
//           <div class="form-field"><label>File</label><input type="file" (change)="onFileSelect($event)" class="file-input" /></div>
//           @if (resourceError) { <div class="error-msg">{{ resourceError }}</div> }
//           <div style="display:flex;gap:10px;justify-content:flex-end">
//             <button class="btn btn--ghost" (click)="showResourceModal = false">Cancel</button>
//             <button class="btn btn--primary" (click)="uploadResource()" [disabled]="resourceLoading">Upload</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   }

//   <!-- Feedback Modal -->
//   @if (showFeedbackModal) {
//     <div class="modal-overlay" (click)="showFeedbackModal = false">
//       <div class="modal" (click)="$event.stopPropagation()">
//         <div class="modal-header">
//           <h2>Give Feedback</h2>
//           <button class="modal-close" (click)="showFeedbackModal = false">✕</button>
//         </div>
//         <form [formGroup]="feedbackForm" (ngSubmit)="submitFeedback()">
//           <div style="display:flex;flex-direction:column;gap:14px">
//             <div class="form-field"><label>Message</label><textarea formControlName="message" placeholder="Share your thoughts…"></textarea></div>
//             <div class="form-field">
//               <label>Rating (optional)</label>
//               <div class="star-row">
//                 @for (star of [1,2,3,4,5]; track star) {
//                   <button type="button" class="star-btn" [class.active]="(feedbackForm.get('rating')?.value ?? 0) >= star" (click)="feedbackForm.patchValue({rating: star})">★</button>
//                 }
//               </div>
//             </div>
//             <div style="display:flex;gap:10px;justify-content:flex-end">
//               <button type="button" class="btn btn--ghost" (click)="showFeedbackModal = false">Cancel</button>
//               <button type="submit" class="btn btn--primary" [disabled]="feedbackLoading">Submit</button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   }
// </div>
// `,
// styles: [`
// .loading-row { display: flex; align-items: center; gap: 10px; color: var(--text-secondary); font-size: 14px; padding: 48px 0; }
// .silo-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 28px; flex-wrap: wrap; gap: 16px; }
// .silo-header-left { display: flex; align-items: center; gap: 20px; }
// .big-avatar {
//   width: 56px; height: 56px; border-radius: 14px;
//   background: var(--accent-dim); color: var(--accent);
//   display: flex; align-items: center; justify-content: center;
//   font-family: var(--font-display); font-weight: 800; font-size: 26px;
// }
// h1 { font-size: 26px; margin-bottom: 6px; }
// .silo-meta { display: flex; align-items: center; gap: 12px; }
// .meta-item { font-size: 13px; color: var(--text-secondary); }
// .tabs { display: flex; gap: 2px; border-bottom: 1px solid var(--border); margin-bottom: 24px; overflow-x: auto; }
// .tab {
//   background: none; border: none; padding: 10px 18px;
//   color: var(--text-secondary); font-size: 14px; font-weight: 500;
//   cursor: pointer; border-bottom: 2px solid transparent;
//   transition: all var(--transition); white-space: nowrap;
// }
// .tab:hover { color: var(--text-primary); }
// .tab.active { color: var(--accent); border-bottom-color: var(--accent); }
// .panel-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
// .panel-header h2 { font-size: 17px; }
// .challenge-card {
//   background: var(--bg-elevated); border: 1px solid var(--border);
//   border-radius: var(--radius-lg); padding: 20px; display: block;
//   transition: all var(--transition);
// }
// .challenge-card:hover { border-color: var(--accent); transform: translateY(-1px); }
// .challenge-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
// .challenge-card h3 { font-size: 15px; margin-bottom: 6px; }
// .challenge-card p { font-size: 13px; color: var(--text-secondary); line-height: 1.5; }
// .due-date { font-size: 11px; color: var(--text-muted); }
// /* Chat */
// .chat-panel { display: flex; flex-direction: column; height: 500px; background: var(--bg-surface); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; }
// .messages { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 12px; }
// .msg { display: flex; gap: 10px; }
// .msg.own { flex-direction: row-reverse; }
// .msg-avatar {
//   width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0;
//   background: var(--bg-elevated); border: 1px solid var(--border);
//   display: flex; align-items: center; justify-content: center;
//   font-size: 12px; font-weight: 600; color: var(--accent);
// }
// .msg-body { max-width: 70%; }
// .msg-author { font-size: 11px; color: var(--text-muted); margin-bottom: 4px; }
// .msg-time { margin-left: 6px; }
// .msg-text { background: var(--bg-elevated); border: 1px solid var(--border); border-radius: 12px; padding: 8px 12px; font-size: 14px; }
// .own .msg-text { background: var(--accent-dim); border-color: rgba(245,166,35,0.2); }
// .chat-input-row { display: flex; gap: 10px; padding: 14px; border-top: 1px solid var(--border); }
// .chat-input {
//   flex: 1; background: var(--bg-elevated); border: 1px solid var(--border);
//   border-radius: var(--radius); padding: 9px 14px; color: var(--text-primary);
//   font-family: var(--font-body); font-size: 14px; outline: none;
// }
// .chat-input:focus { border-color: var(--accent); }
// /* Resources */
// .resource-list { display: flex; flex-direction: column; gap: 8px; }
// .resource-row {
//   display: flex; align-items: center; gap: 14px;
//   padding: 14px 16px; background: var(--bg-elevated); border: 1px solid var(--border);
//   border-radius: var(--radius); transition: border-color var(--transition);
// }
// .resource-row:hover { border-color: var(--accent); }
// .resource-icon { font-size: 22px; }
// .resource-title { font-size: 14px; font-weight: 500; }
// .resource-meta { font-size: 12px; color: var(--text-muted); }
// .resource-link { margin-left: auto; color: var(--accent); font-size: 16px; }
// .file-input { color: var(--text-secondary); font-size: 13px; }
// /* Members */
// .member-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }
// .member-row { display: flex; align-items: center; gap: 12px; padding: 14px; background: var(--bg-elevated); border: 1px solid var(--border); border-radius: var(--radius); }
// .member-avatar {
//   width: 36px; height: 36px; border-radius: 50%;
//   background: var(--accent-dim); color: var(--accent);
//   display: flex; align-items: center; justify-content: center;
//   font-weight: 700; font-size: 14px;
// }
// .member-name { font-size: 14px; font-weight: 500; }
// .member-since { font-size: 11px; color: var(--text-muted); }
// /* Feedback */
// .feedback-list { display: flex; flex-direction: column; gap: 12px; }
// .feedback-card { background: var(--bg-elevated); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 16px; }
// .feedback-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
// .feedback-author { font-weight: 600; font-size: 14px; }
// .stars { color: var(--accent); letter-spacing: 2px; font-size: 14px; }
// .feedback-card p { font-size: 14px; color: var(--text-secondary); }
// .star-row { display: flex; gap: 4px; }
// .star-btn { background: none; border: none; cursor: pointer; font-size: 24px; color: var(--border); transition: color var(--transition); }
// .star-btn.active { color: var(--accent); }
// `]