import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { Silo, CreateSiloDto, ExperienceLevel } from '../../../shared/models';

@Component({
  selector: 'app-silos-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  template: `
    <div class="animate-fade-in">
      <div class="page-header">
        <div>
          <h1>Silos</h1>
          <p>Join skill-focused communities and start learning together.</p>
        </div>
        <button class="btn btn--primary" (click)="showCreate = true">+ New Silo</button>
      </div>

      <!-- Filters -->
      <div class="filters">
        <input type="text" [(ngModel)]="skillFilter" placeholder="Filter by skill…" class="filter-input" (input)="loadSilos()" />
        <select [(ngModel)]="levelFilter" (change)="loadSilos()" class="filter-select">
          <option value="">All levels</option>
          <option value="BEGINNER">Beginner</option>
          <option value="INTERMEDIATE">Intermediate</option>
          <option value="ADVANCED">Advanced</option>
          <option value="EXPERT">Expert</option>
        </select>
      </div>

      <!-- Loading / Empty / List -->
      <div *ngIf="loading" class="loading-row">
        <span class="spinner"></span> Loading silos…
      </div>

      <div *ngIf="!loading && silos.length === 0" class="empty-state">
        <div class="icon">🏛️</div>
        <h3>No silos found</h3>
        <p>Try different filters or create the first one!</p>
      </div>

      <div *ngIf="!loading && silos.length > 0" class="grid-2">
        <a *ngFor="let silo of silos" [routerLink]="['/silos', silo.id]" class="silo-card">
          <div class="silo-card-header">
            <div class="silo-avatar">{{ silo.skill[0].toUpperCase() }}</div>
            <span class="badge badge--accent">{{ silo.level }}</span>
          </div>
          <h3>{{ silo.skill }}</h3>
          <div class="silo-card-stats">
            <span>👥 {{ silo._count?.members ?? 0 }} members</span>
            <span>⚡ {{ silo._count?.challenges ?? 0 }} challenges</span>
          </div>
        </a>
      </div>

      <!-- Create Silo Modal -->
      <div *ngIf="showCreate" class="modal-overlay" (click)="showCreate = false">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Create a Silo</h2>
            <button class="modal-close" (click)="showCreate = false">✕</button>
          </div>
          <form [formGroup]="createForm" (ngSubmit)="createSilo()">
            <div style="display:flex;flex-direction:column;gap:16px">
              <div class="form-field">
                <label>Skill</label>
                <input type="text" formControlName="skill" placeholder="e.g. TypeScript, UX Design…" />
              </div>
              <div class="form-field">
                <label>Experience Level</label>
                <select formControlName="level">
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                  <option value="EXPERT">Expert</option>
                </select>
              </div>
              <div *ngIf="createError" class="error-msg">{{ createError }}</div>
              <div style="display:flex;gap:10px;justify-content:flex-end">
                <button type="button" class="btn btn--ghost" (click)="showCreate = false">Cancel</button>
                <button type="submit" class="btn btn--primary" [disabled]="createLoading">
                  <span *ngIf="createLoading" class="spinner" style="width:14px;height:14px"></span>
                  Create
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .filters { display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; }
    .filter-input {
      background: var(--bg-elevated); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 9px 14px;
      color: var(--text-primary); font-family: var(--font-body); font-size: 14px;
      outline: none; min-width: 220px; transition: border-color var(--transition);
    }
    .filter-input:focus { border-color: var(--accent); }
    .filter-input::placeholder { color: var(--text-muted); }
    .filter-select {
      background: var(--bg-elevated); border: 1px solid var(--border);
      border-radius: var(--radius); padding: 9px 14px;
      color: var(--text-primary); font-family: var(--font-body); font-size: 14px;
      outline: none; cursor: pointer;
    }
    .silo-card {
      background: var(--bg-surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 22px;
      transition: all var(--transition); display: block;
    }
    .silo-card:hover { border-color: var(--accent); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(245,166,35,0.08); }
    .silo-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
    .silo-avatar {
      width: 44px; height: 44px; border-radius: 10px;
      background: var(--accent-dim); color: var(--accent);
      display: flex; align-items: center; justify-content: center;
      font-family: var(--font-display); font-weight: 800; font-size: 20px;
    }
    h3 { font-size: 17px; margin-bottom: 10px; }
    .silo-card-stats { display: flex; gap: 16px; font-size: 13px; color: var(--text-secondary); }
    .loading-row { display: flex; align-items: center; gap: 10px; color: var(--text-secondary); font-size: 14px; padding: 32px 0; }
  `]
})
export class SilosListComponent implements OnInit {
  silos: Silo[] = [];
  loading = false;
  skillFilter = '';
  levelFilter = '';
  showCreate = false;
  createLoading = false;
  createError = '';

  createForm: FormGroup;

  constructor(private api: ApiService, private fb: FormBuilder, private toast: ToastService) {
    this.createForm = this.fb.group({
      skill: ['', Validators.required],
      level: ['BEGINNER' as ExperienceLevel, Validators.required]
    });
  }

  ngOnInit() { this.loadSilos(); }

  loadSilos() {
    this.loading = true;
    this.api.getSilos(this.skillFilter || undefined, this.levelFilter || undefined).subscribe({
      next: s => { this.silos = s; this.loading = false; },
      error: () => this.loading = false
    });
  }

  createSilo() {
    if (this.createForm.invalid) return;
    this.createLoading = true;
    this.createError = '';
    this.api.createSilo(this.createForm.value as CreateSiloDto).subscribe({
      next: s => {
        this.silos = [s, ...this.silos];
        this.showCreate = false;
        this.createLoading = false;
        this.createForm.reset({ skill: '', level: 'BEGINNER' });
        this.toast.success('Silo created!');
      },
      error: e => {
        this.createError = e.error?.message || 'Failed to create silo';
        this.createLoading = false;
      }
    });
  }
}