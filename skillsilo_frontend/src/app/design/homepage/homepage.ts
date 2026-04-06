import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Navbar } from "../navbar/navbar";
import { Footer } from "../footer/footer";
import { ApiService } from '../../core/services/api.service';
import { Silo } from '../../shared/models';

// Unsplash image map — keyword matched against silo skill name
const SKILL_IMAGES: Record<string, string> = {
  default:        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80',
  web:            'https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&q=80',
  frontend:       'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80',
  backend:        'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80',
  fullstack:      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80',
  react:          'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80',
  angular:        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80',
  node:           'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80',
  nestjs:         'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80',
  python:         'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&q=80',
  ai:             'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80',
  machine:        'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80',
  data:           'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
  design:         'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80',
  ui:             'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80',
  ux:             'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=600&q=80',
  figma:          'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&q=80',
  mobile:         'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80',
  flutter:        'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80',
  devops:         'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=600&q=80',
  cloud:          'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&q=80',
  security:       'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&q=80',
  blockchain:     'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&q=80',
  business:       'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
  marketing:      'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=600&q=80',
  writing:        'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&q=80',
  photography:    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&q=80',
  video:          'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&q=80',
  game:           'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=600&q=80',
  database:       'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&q=80',
};

@Component({
  selector: 'app-homepage',
  imports: [Navbar, Footer, CommonModule, RouterLink],
  encapsulation: ViewEncapsulation.None,
  template: `
    <app-navbar></app-navbar>

    <div id="page-home" class="page active">

      <!-- ══ HERO ══ -->
      <section class="hero">
        <div class="hero-bg"></div>
        <div class="hero-grid"></div>
        <div class="container">
          <div class="hero-inner">

            <div class="hero-content">
              <div class="hero-badge">
                <span class="badge-dot"></span>
                Now with Cross-Silo Collaboration
              </div>
              <h1 class="display-font">
                Master Skills.<br>
                Build Your <span class="yellow">Silo.</span><br>
                Grow Together.
              </h1>
              <p>SkillSilo is the ultimate platform for skill seekers and experts alike. Create silos, share knowledge, tackle challenges and consult with the best — all in one place.</p>
              <div class="hero-actions">
                <a routerLink="/manysilos" class="btn btn-primary btn-lg">Explore Silos →</a>
                <a routerLink="/about" class="btn btn-dark btn-lg">How It Works</a>
              </div>
              <div class="hero-stats">
                <div class="stat"><span class="stat-num">{{ totalMembers }}+</span><span class="stat-label">Active Members</span></div>
                <div class="stat"><span class="stat-num">{{ silos.length }}+</span><span class="stat-label">Skill Silos</span></div>
                <div class="stat"><span class="stat-num">98%</span><span class="stat-label">Satisfaction</span></div>
              </div>
            </div>

            <!-- Hero card — live silos with images -->
            <div class="hero-visual">
              <div class="hero-card-main">
                <div class="hero-card-label">🔥 Active Silos</div>

                <div *ngIf="loadingSilos" class="silo-preview">
                  <div class="silo-item" *ngFor="let i of [1,2,3]">
                    <div class="silo-thumb skeleton-box"></div>
                    <div style="flex:1">
                      <div class="skeleton-line"></div>
                      <div class="skeleton-line short"></div>
                    </div>
                  </div>
                </div>

                <div *ngIf="!loadingSilos" class="silo-preview">
                  <a *ngFor="let s of heroSilos" routerLink="/manysilos"
                     class="silo-item" style="text-decoration:none;color:inherit">
                    <div class="silo-thumb">
                      <img [src]="getSkillImage(s.skill)" [alt]="s.skill"
                           loading="lazy"
                           onerror="this.src='https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80'" />
                      <span class="level-dot" [class]="'lvl-' + s.level?.toLowerCase()"></span>
                    </div>
                    <div class="silo-info">
                      <h4>{{ s.skill }}</h4>
                      <p>{{ s.level | titlecase }} · {{ s._count?.members ?? 0 }} members</p>
                    </div>
                    <span class="silo-arrow">→</span>
                  </a>
                  <div *ngIf="heroSilos.length === 0" class="empty-hero-silos">
                    No silos yet — <a routerLink="/manysilos">create the first one</a>
                  </div>
                </div>
              </div>

              <!-- Floating cards with images -->
              <div class="floating-card card-1">
                <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=80&q=80"
                     alt="challenge" class="fc-img" />
                <div class="fc-text"><strong>Challenge Live!</strong>Build a REST API</div>
              </div>
              <div class="floating-card card-2">
                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=80&q=80"
                     alt="collab" class="fc-img" />
                <div class="fc-text"><strong>Cross-Silo Request</strong>UI + Backend collab</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- ══ FEATURES STRIP — images ══ -->
      <div class="features-strip">
        <div class="container">
          <div class="features-strip-inner">
            <a routerLink="/manysilos" class="feature-pill" style="text-decoration:none;color:inherit">
              <div class="feature-pill-icon">
                <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=96&q=80" alt="silos" />
              </div>
              <div class="fp-text"><h4>Skill Silos</h4><p>Focused communities per skill domain</p></div>
            </a>
            <a routerLink="/silos" class="feature-pill" style="text-decoration:none;color:inherit">
              <div class="feature-pill-icon">
                <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=96&q=80" alt="challenges" />
              </div>
              <div class="fp-text"><h4>Challenges</h4><p>Real-world tasks with submissions</p></div>
            </a>
            <a routerLink="/cross-silo" class="feature-pill" style="text-decoration:none;color:inherit">
              <div class="feature-pill-icon">
                <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=96&q=80" alt="cross-silo" />
              </div>
              <div class="fp-text"><h4>Cross-Silo Sync</h4><p>Collaborate across skill domains</p></div>
            </a>
            <a routerLink="/consultations" class="feature-pill" style="text-decoration:none;color:inherit">
              <div class="feature-pill-icon">
                <img src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=96&q=80" alt="consultations" />
              </div>
              <div class="fp-text"><h4>Consultations</h4><p>Expert sessions & peer help</p></div>
            </a>
          </div>
        </div>
      </div>

      <!-- ══ ABOUT — real photos ══ -->
      <section class="section">
        <div class="container">
          <div class="about-grid">
            <div class="about-images">
              <div class="about-img-main">
                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80"
                     alt="People learning together" />
              </div>
              <div class="about-img-secondary">
                <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&q=80"
                     alt="Team collaboration" />
              </div>
              <div class="about-xp-badge">
                <div><div class="xp-num">5+</div><div class="xp-text">Years of<br>Community Building</div></div>
              </div>
            </div>

            <div>
              <div class="tag">● About Us</div>
              <h2 class="section-title">What Is <span class="yellow">SkillSilo</span> and Why It Matters</h2>
              <p class="section-sub">SkillSilo is your ultimate destination for knowledge seekers and skill builders. We're committed to transforming how communities form around shared expertise — with tools that actually work.</p>
              <ul class="check-list">
                <li><span class="check-icon">✓</span> Create or join skill-specific Silos with dedicated challenges</li>
                <li><span class="check-icon">✓</span> Request Cross-Silo collaboration for interdisciplinary projects</li>
                <li><span class="check-icon">✓</span> Book consultations with verified domain experts</li>
                <li><span class="check-icon">✓</span> Real-time chat and live challenge submissions</li>
              </ul>
              <div class="contact-box">
                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&q=80"
                     alt="contact" class="contact-avatar" />
                <div class="contact-box-text">
                  <p>Talk to our team</p>
                  <strong>+254 700 000 000</strong>
                </div>
                <div class="contact-box-quote">
                  <em>"Trusted by {{ silos.length }}+ silos"</em><br>
                  <small style="color:var(--text-muted)">— SkillSilo Community</small>
                </div>
              </div>
              <a routerLink="/about" class="btn btn-primary btn-lg" style="margin-top:24px;display:inline-flex">More About Us →</a>
            </div>
          </div>
        </div>
      </section>

      <!-- ══ LIVE SILO CARDS — with images ══ -->
      <section class="section" style="background:var(--dark2);border-top:1px solid var(--border);border-bottom:1px solid var(--border)">
        <div class="container">
          <div style="text-align:center;margin-bottom:48px">
            <div class="tag" style="margin:0 auto 16px">● Skill Categories</div>
            <h2 class="section-title">Browse Our <span class="yellow">Top Silos</span></h2>
            <p class="section-sub" style="margin:0 auto">{{ silos.length }} skill communities waiting for you — from code to creativity.</p>
          </div>

          <!-- Skeleton -->
          <div *ngIf="loadingSilos" class="grid-3">
            <div *ngFor="let i of [1,2,3]" class="skill-card">
              <div style="height:180px;background:var(--gray);animation:shimmer 1.5s infinite"></div>
              <div style="padding:20px">
                <div class="skeleton-line" style="margin-bottom:8px"></div>
                <div class="skeleton-line short"></div>
              </div>
            </div>
          </div>

          <!-- Live cards -->
          <div *ngIf="!loadingSilos" class="grid-3">
            <a *ngFor="let s of previewSilos" routerLink="/manysilos"
               class="skill-card" style="text-decoration:none;color:inherit">
              <div class="skill-card-img">
                <img [src]="getSkillImage(s.skill)" [alt]="s.skill"
                     class="card-cover-img" loading="lazy"
                     onerror="this.src='https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80'" />
                <div class="card-overlay"></div>
                <span class="skill-badge">{{ s.level | titlecase }}</span>
                <span class="card-title-overlay">{{ s.skill }}</span>
              </div>
              <div class="skill-card-body">
                <h3>{{ s.skill }}</h3>
                <p>{{ s._count?.members ?? 0 }} members · {{ s._count?.challenges ?? 0 }} challenges</p>
                <div class="skill-meta">
                  <div class="skill-rating">★★★★★ <span>({{ s._count?.members ?? 0 }})</span></div>
                  <div class="skill-price free">Join Free</div>
                </div>
              </div>
            </a>
            <div *ngIf="previewSilos.length === 0"
                 style="grid-column:1/-1;text-align:center;padding:48px;color:var(--text-muted)">
              No silos yet. <a routerLink="/manysilos" style="color:var(--yellow);margin-left:4px">Be the first to create one →</a>
            </div>
          </div>

          <div style="text-align:center;margin-top:40px">
            <a routerLink="/manysilos" class="btn btn-outline btn-lg">View All Silos →</a>
          </div>
        </div>
      </section>

      <!-- ══ EVENTS + TESTIMONIALS ══ -->
      <section class="section">
        <div class="container">
          <div class="grid-2" style="gap:60px;align-items:start">
            <div>
              <div class="tag">● Challenges Events</div>
              <h2 class="section-title" style="font-size:36px">Upcoming <span class="yellow">Meetups</span> &amp; Challenges</h2>
              <div style="display:flex;flex-direction:column;gap:14px;margin-top:28px">
                <div class="event-card">
                  <div class="event-date"><div class="event-day">16</div><div class="event-month">Mar</div></div>
                  <div class="event-info"><h4>Web Dev Challenge Sprint</h4><p>Build & deploy a full app in 48hrs · All levels welcome</p></div>
                </div>
                <div class="event-card">
                  <div class="event-date" style="background:var(--gray);color:var(--text)"><div class="event-day">21</div><div class="event-month">Mar</div></div>
                  <div class="event-info"><h4>Cross-Silo Design + Dev Collab</h4><p>UI designers meet backend engineers to ship something great</p></div>
                </div>
                <div class="event-card">
                  <div class="event-date" style="background:var(--gray);color:var(--text)"><div class="event-day">29</div><div class="event-month">Mar</div></div>
                  <div class="event-info"><h4>AI Innovation Showcase 2026</h4><p>Present your ML project to the community and get feedback</p></div>
                </div>
              </div>
            </div>

            <div>
              <div class="tag">● Community Voices</div>
              <h2 class="section-title" style="font-size:36px">What Our <span class="yellow">Members</span> Say</h2>
              <div style="display:flex;flex-direction:column;gap:16px;margin-top:28px">
                <div class="testimonial-card">
                  <div class="testimonial-quote">SkillSilo completely changed how I learn. The challenges inside my silo pushed me further than any course could.</div>
                  <div class="testimonial-author">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=88&q=80" alt="Kevin" class="author-photo" />
                    <div><div class="author-name">Kevin Otieno</div><div class="author-role">Full-Stack Developer · Nairobi</div></div>
                    <div class="author-stars">★★★★★</div>
                  </div>
                </div>
                <div class="testimonial-card">
                  <div class="testimonial-quote">The Cross-Silo feature is genius. I found a designer from a different silo and we shipped a product together in a week.</div>
                  <div class="testimonial-author">
                    <img src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=88&q=80" alt="Amina" class="author-photo" />
                    <div><div class="author-name">Amina Wanjiru</div><div class="author-role">AI Engineer · Lagos</div></div>
                    <div class="author-stars">★★★★★</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ══ PARTNERS ══ -->
      <section class="section-sm" style="background:var(--dark2);border-top:1px solid var(--border)">
        <div class="container">
          <p style="text-align:center;font-size:13px;color:var(--text-muted);margin-bottom:32px;text-transform:uppercase;letter-spacing:0.1em;font-weight:600">Trusted by learners from teams at</p>
          <div class="partners-strip">
            <div class="partner-logo">IBM Kenya</div>
            <div class="partner-logo">Safaricom</div>
            <div class="partner-logo">Google Kenya</div>
            <div class="partner-logo">Chuka Uni</div>
            <div class="partner-logo">Ushahidi</div>
            <div class="partner-logo">Cellulant</div>
          </div>
        </div>
      </section>

      <!-- ══ CTA BANNER ══ -->
      <section class="section">
        <div class="container">
          <div class="cta-banner">
            <div>
              <h2>Your Learning Journey Starts Here — Explore All Silos Today</h2>
              <p>Join thousands of learners building real skills inside focused communities.</p>
            </div>
            <div style="display:flex;gap:12px;flex-shrink:0;flex-wrap:wrap">
              <a routerLink="/manysilos" class="btn btn-cta-dark btn-lg">Explore Silos</a>
              <a routerLink="/dashboard" class="btn btn-lg" style="background:rgba(0,0,0,0.15);color:var(--dark);border:2px solid var(--dark)">Go to Dashboard</a>
            </div>
          </div>
        </div>
      </section>

    </div>
    <app-footer></app-footer>
  `,
  styles: `
    :root {
      --yellow:#F5C518;--yellow-light:#FFE066;--yellow-dark:#D4A800;
      --dark:#0D0D0D;--dark2:#141414;--dark3:#1E1E1E;
      --gray:#2A2A2A;--gray2:#3A3A3A;--text:#F0F0F0;
      --text-muted:#8A8A8A;--text-sub:#B0B0B0;--white:#FFFFFF;
      --card-bg:#181818;--border:rgba(255,255,255,0.07);
      --yellow-glow:0 0 40px rgba(245,197,24,0.25);
      --radius:16px;--radius-sm:8px;
    }
    *{margin:0;padding:0;box-sizing:border-box}
    html{scroll-behavior:smooth}
    body{font-family:'DM Sans',sans-serif;background:var(--dark);color:var(--text);overflow-x:hidden;line-height:1.6}
    h1,h2,h3,h4,h5{font-family:'Syne',sans-serif;line-height:1.15}
    .display-font{font-family:'Clash Display',sans-serif}

    /* Buttons */
    .btn{padding:10px 24px;border-radius:10px;font-weight:600;font-size:14px;cursor:pointer;transition:all 0.2s;border:none;font-family:'DM Sans',sans-serif;text-decoration:none;display:inline-flex;align-items:center;gap:8px}
    .btn-primary{background:var(--yellow);color:var(--dark)}
    .btn-primary:hover{background:var(--yellow-light);box-shadow:var(--yellow-glow);transform:translateY(-1px)}
    .btn-dark{background:var(--gray);color:var(--text);border:1px solid var(--border)}
    .btn-dark:hover{background:var(--gray2)}
    .btn-outline{background:transparent;color:var(--yellow);border:2px solid var(--yellow)}
    .btn-outline:hover{background:var(--yellow);color:var(--dark)}
    .btn-lg{padding:14px 32px;font-size:16px;border-radius:12px}
    .btn-cta-dark{background:var(--dark);color:var(--white)}
    .btn-cta-dark:hover{background:#111}
    .btn-ghost{background:transparent;color:var(--text-sub);border:1px solid var(--border)}

    /* Layout */
    .page{display:none}.page.active{display:block}
    .section{padding:100px 0}.section-sm{padding:60px 0}
    .container{max-width:1200px;margin:0 auto;padding:0 48px}
    .grid-2{display:grid;grid-template-columns:repeat(2,1fr);gap:28px}
    .grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:28px}
    .yellow{color:var(--yellow)}
    .tag{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:100px;font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;background:rgba(245,197,24,0.12);color:var(--yellow);border:1px solid rgba(245,197,24,0.25);margin-bottom:20px}
    .section-title{font-size:clamp(32px,4vw,52px);font-weight:700;margin-bottom:16px}
    .section-sub{font-size:17px;color:var(--text-sub);max-width:560px;line-height:1.7}

    /* Hero */
    .hero{min-height:90vh;display:flex;align-items:center;position:relative;overflow:hidden;background:var(--dark);padding:80px 0}
    .hero-bg{position:absolute;inset:0;background:radial-gradient(ellipse 60% 60% at 70% 50%,rgba(245,197,24,0.08) 0%,transparent 70%),radial-gradient(ellipse 40% 40% at 20% 80%,rgba(245,197,24,0.05) 0%,transparent 70%)}
    .hero-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px);background-size:60px 60px}
    .hero-inner{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;position:relative;z-index:1}
    .hero-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(245,197,24,0.1);border:1px solid rgba(245,197,24,0.3);border-radius:100px;padding:8px 16px;font-size:13px;font-weight:600;color:var(--yellow);margin-bottom:28px;animation:fadeSlideUp 0.6s ease both}
    .badge-dot{width:6px;height:6px;background:var(--yellow);border-radius:50%;animation:blink 1.5s infinite}
    @keyframes blink{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(1.3)}}
    .hero h1{font-size:clamp(44px,5.5vw,76px);font-weight:800;line-height:1.05;margin-bottom:24px;animation:fadeSlideUp 0.7s 0.1s ease both}
    .hero p{font-size:18px;color:var(--text-sub);line-height:1.75;margin-bottom:40px;max-width:480px;animation:fadeSlideUp 0.7s 0.2s ease both}
    .hero-actions{display:flex;gap:14px;flex-wrap:wrap;animation:fadeSlideUp 0.7s 0.3s ease both}
    .hero-stats{display:flex;gap:40px;margin-top:56px;animation:fadeSlideUp 0.7s 0.4s ease both}
    .stat{display:flex;flex-direction:column;gap:4px}
    .stat-num{font-family:'Syne',sans-serif;font-size:32px;font-weight:800;color:var(--yellow)}
    .stat-label{font-size:13px;color:var(--text-muted);font-weight:500}
    @keyframes fadeSlideUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}

    /* Hero card */
    .hero-visual{position:relative;animation:fadeSlideUp 0.8s 0.2s ease both}
    .hero-card-main{background:var(--card-bg);border:1px solid var(--border);border-radius:20px;padding:28px;position:relative}
    .hero-card-main::before{content:'';position:absolute;inset:-1px;border-radius:21px;background:linear-gradient(135deg,rgba(245,197,24,0.3),transparent 50%);z-index:-1}
    .hero-card-label{font-size:13px;color:var(--text-muted);margin-bottom:16px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em}
    .silo-preview{display:flex;flex-direction:column;gap:12px}
    .silo-item{display:flex;align-items:center;gap:14px;padding:12px 14px;background:var(--dark3);border-radius:12px;border:1px solid var(--border);transition:all 0.3s;cursor:pointer}
    .silo-item:hover{border-color:rgba(245,197,24,0.4);background:rgba(245,197,24,0.04)}
    .silo-thumb{position:relative;width:44px;height:44px;border-radius:10px;overflow:hidden;flex-shrink:0}
    .silo-thumb img{width:100%;height:100%;object-fit:cover}
    .level-dot{position:absolute;bottom:2px;right:2px;width:9px;height:9px;border-radius:50%;border:2px solid var(--dark3)}
    .lvl-beginner{background:#4ade80}.lvl-intermediate{background:var(--yellow)}.lvl-advanced{background:#f87171}
    .silo-info h4{font-size:13px;font-weight:600;margin-bottom:2px}
    .silo-info p{font-size:11px;color:var(--text-muted)}
    .silo-arrow{margin-left:auto;color:var(--text-muted);font-size:14px}
    .empty-hero-silos{text-align:center;padding:16px;font-size:13px;color:var(--text-muted)}
    .empty-hero-silos a{color:var(--yellow)}

    /* Floating cards */
    .floating-card{position:absolute;background:var(--card-bg);border:1px solid var(--border);border-radius:14px;padding:12px 16px;box-shadow:0 20px 60px rgba(0,0,0,0.5);display:flex;align-items:center;gap:10px;animation:float 4s ease-in-out infinite}
    .floating-card.card-1{top:-20px;right:-20px;animation-delay:0s}
    .floating-card.card-2{bottom:-20px;left:-20px;animation-delay:2s}
    @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
    .fc-img{width:36px;height:36px;border-radius:8px;object-fit:cover;flex-shrink:0}
    .fc-text{font-size:12px;color:var(--text-sub)}
    .fc-text strong{display:block;font-size:13px;font-weight:700;color:var(--white);margin-bottom:1px}

    /* Features strip */
    .features-strip{background:var(--dark2);border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:40px 0}
    .features-strip-inner{display:flex}
    .feature-pill{display:flex;align-items:center;gap:16px;padding:0 40px;border-right:1px solid var(--border);flex:1;transition:background 0.2s}
    .feature-pill:last-child{border-right:none}
    .feature-pill:hover{background:rgba(245,197,24,0.03)}
    .feature-pill-icon{width:52px;height:52px;border-radius:12px;overflow:hidden;flex-shrink:0;border:1px solid var(--border)}
    .feature-pill-icon img{width:100%;height:100%;object-fit:cover}
    .fp-text h4{font-size:15px;font-weight:600;margin-bottom:3px}
    .fp-text p{font-size:13px;color:var(--text-muted)}

    /* About */
    .about-grid{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center}
    .about-images{position:relative;height:500px}
    .about-img-main{width:65%;height:380px;border-radius:20px;position:absolute;left:0;top:0;overflow:hidden}
    .about-img-main img{width:100%;height:100%;object-fit:cover}
    .about-img-secondary{width:55%;height:260px;border-radius:16px;position:absolute;right:0;bottom:0;overflow:hidden}
    .about-img-secondary img{width:100%;height:100%;object-fit:cover}
    .about-xp-badge{position:absolute;bottom:30px;left:10px;background:var(--dark);border:1px solid var(--border);border-radius:14px;padding:16px 20px;z-index:2;display:flex;align-items:center;gap:12px;box-shadow:0 8px 32px rgba(0,0,0,0.6)}
    .xp-num{font-family:'Syne',sans-serif;font-size:36px;font-weight:800;color:var(--yellow)}
    .xp-text{font-size:13px;color:var(--text-muted);line-height:1.4}
    .check-list{list-style:none;display:flex;flex-direction:column;gap:14px;margin:28px 0}
    .check-list li{display:flex;align-items:flex-start;gap:12px;font-size:15px;color:var(--text-sub)}
    .check-icon{width:22px;height:22px;border-radius:50%;background:rgba(245,197,24,0.15);border:1px solid rgba(245,197,24,0.4);display:flex;align-items:center;justify-content:center;font-size:12px;color:var(--yellow);flex-shrink:0;margin-top:2px}
    .contact-box{display:flex;align-items:center;gap:16px;background:var(--dark3);border:1px solid var(--border);border-radius:14px;padding:20px 24px;margin-top:32px}
    .contact-avatar{width:52px;height:52px;border-radius:50%;object-fit:cover;flex-shrink:0}
    .contact-box-text p{font-size:12px;color:var(--text-muted)}
    .contact-box-text strong{font-size:18px;font-weight:700;color:var(--white)}
    .contact-box-quote{margin-left:auto;font-style:italic;color:var(--text-muted);font-size:13px;text-align:right}

    /* Skill cards */
    .skill-card{background:var(--card-bg);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;transition:all 0.3s;cursor:pointer}
    .skill-card:hover{border-color:rgba(245,197,24,0.3);transform:translateY(-6px);box-shadow:0 20px 40px rgba(0,0,0,0.4)}
    .skill-card-img{height:180px;position:relative;overflow:hidden}
    .card-cover-img{width:100%;height:100%;object-fit:cover;transition:transform 0.4s}
    .skill-card:hover .card-cover-img{transform:scale(1.06)}
    .card-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.65) 0%,transparent 55%)}
    .skill-badge{position:absolute;top:14px;left:14px;background:var(--yellow);color:var(--dark);font-size:11px;font-weight:700;padding:4px 10px;border-radius:6px;letter-spacing:0.05em;text-transform:uppercase;z-index:1}
    .card-title-overlay{position:absolute;bottom:12px;left:14px;font-size:13px;font-weight:700;color:var(--white);z-index:1;text-shadow:0 1px 4px rgba(0,0,0,0.8)}
    .skill-card-body{padding:20px}
    .skill-card-body h3{font-size:17px;font-weight:700;margin-bottom:6px}
    .skill-card-body p{font-size:13px;color:var(--text-muted);margin-bottom:14px}
    .skill-meta{display:flex;align-items:center;justify-content:space-between}
    .skill-rating{color:var(--yellow);font-size:13px}
    .skill-rating span{color:var(--text-muted);margin-left:4px}
    .skill-price{font-family:'Syne',sans-serif;font-size:16px;font-weight:700;color:var(--yellow)}
    .skill-price.free{color:#4ade80}

    /* Skeleton */
    .skeleton-box{background:var(--gray);animation:shimmer 1.5s infinite;border-radius:10px}
    .skeleton-line{height:13px;border-radius:6px;background:var(--gray);animation:shimmer 1.5s infinite;margin-bottom:6px}
    .skeleton-line.short{width:55%}
    @keyframes shimmer{0%,100%{opacity:0.4}50%{opacity:0.8}}

    /* Testimonials */
    .testimonial-card{background:var(--card-bg);border:1px solid var(--border);border-radius:var(--radius);padding:32px}
    .testimonial-quote{font-size:15px;color:var(--text-sub);line-height:1.75;margin-bottom:24px}
    .testimonial-quote::before{content:'"';font-size:48px;color:var(--yellow);line-height:0;vertical-align:-20px;margin-right:4px;font-family:serif}
    .testimonial-author{display:flex;align-items:center;gap:12px}
    .author-photo{width:44px;height:44px;border-radius:50%;object-fit:cover;flex-shrink:0;border:2px solid var(--border)}
    .author-name{font-size:15px;font-weight:600}
    .author-role{font-size:13px;color:var(--text-muted)}
    .author-stars{margin-left:auto;color:var(--yellow);font-size:13px}

    /* CTA */
    .cta-banner{background:linear-gradient(135deg,var(--yellow) 0%,#FFD60A 100%);border-radius:24px;padding:64px;display:flex;align-items:center;justify-content:space-between;gap:40px;position:relative;overflow:hidden}
    .cta-banner::before{content:'⚡';position:absolute;font-size:200px;right:-20px;top:-40px;opacity:0.07;line-height:1}
    .cta-banner h2{font-size:40px;color:var(--dark);font-weight:800;max-width:480px}
    .cta-banner p{color:rgba(0,0,0,0.6);margin-top:10px;font-size:16px}

    /* Partners */
    .partners-strip{display:flex;gap:48px;justify-content:center;align-items:center;flex-wrap:wrap}
    .partner-logo{font-family:'Syne',sans-serif;font-weight:800;font-size:18px;color:var(--text-muted);letter-spacing:-0.5px;transition:color 0.2s;cursor:pointer}
    .partner-logo:hover{color:var(--yellow)}

    /* Events */
    .event-card{display:flex;gap:20px;align-items:flex-start;padding:20px;background:var(--card-bg);border:1px solid var(--border);border-radius:var(--radius-sm);transition:all 0.2s}
    .event-card:hover{border-color:rgba(245,197,24,0.3)}
    .event-date{background:var(--yellow);color:var(--dark);border-radius:10px;padding:10px 14px;text-align:center;min-width:54px;flex-shrink:0}
    .event-day{font-size:24px;font-weight:800;font-family:'Syne',sans-serif;line-height:1}
    .event-month{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em}
    .event-info h4{font-size:15px;font-weight:600;margin-bottom:4px}
    .event-info p{font-size:13px;color:var(--text-muted)}

    /* Responsive */
    @media(max-width:900px){
      .container{padding:0 20px}
      .hero-inner{grid-template-columns:1fr;gap:40px}
      .hero-visual{display:none}
      .about-grid{grid-template-columns:1fr}
      .about-images{height:300px}
      .grid-2,.grid-3{grid-template-columns:1fr}
      .features-strip-inner{flex-direction:column}
      .feature-pill{border-right:none;border-bottom:1px solid var(--border);padding:16px 0}
      .feature-pill:last-child{border-bottom:none}
      .cta-banner{flex-direction:column;text-align:center;padding:40px}
    }
  `
})
export class Homepage implements OnInit {

  silos: Silo[] = [];
  loadingSilos = true;

  get heroSilos(): Silo[] { return this.silos.slice(0, 3); }
  get previewSilos(): Silo[] { return this.silos.slice(0, 3); }

  get totalMembers(): string {
    const total = this.silos.reduce((sum, s) => sum + (s._count?.members ?? 0), 0);
    if (total > 1000) return `${(total / 1000).toFixed(1)}K`;
    return total > 0 ? String(total) : '12K';
  }

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getSilosWithoutAuth().subscribe({
      next: (s) => { this.silos = s; this.loadingSilos = false; },
      error: () => { this.loadingSilos = false; }
    });
  }

  /** Match silo skill name keywords to Unsplash images */
  getSkillImage(skill: string): string {
    const s = skill.toLowerCase();
    for (const [keyword, url] of Object.entries(SKILL_IMAGES)) {
      if (keyword !== 'default' && s.includes(keyword)) return url;
    }
    return SKILL_IMAGES['default'];
  }
}