import { Component } from '@angular/core';
import { Navbar } from "../navbar/navbar";
import { Footer } from "../footer/footer";

@Component({
  selector: 'app-about',
  standalone:true,
  imports: [Navbar, Footer],
  template: `
   <app-navbar></app-navbar>
<div id="page-about" class="page active">

<div class="page-hero">
  <div class="container">
    <div class="tag" style="margin: 0 auto 16px;">● Our Story</div>
    <h1>We're Building the <span class="yellow">Future</span> of Skill Communities</h1>
    <p>SkillSilo was born from a simple belief: learning is better together. Meet the team and mission behind the platform.</p>
  </div>
</div>

<!-- MISSION -->
<section class="section">
  <div class="container">
    <div class="mission-box">
      <h2>Democratizing Access to Skill-Building Communities Across Africa and Beyond</h2>
      <p>We believe every learner deserves a focused, supportive community. SkillSilo makes that possible — for free.</p>
    </div>
  </div>
</section>

<!-- VALUES -->
<section class="section" style="padding-top: 0;">
  <div class="container">
    <div style="text-align: center; margin-bottom: 48px;">
      <div class="tag" style="margin: 0 auto 16px;">● What We Stand For</div>
      <h2 class="section-title">Our <span class="yellow">Core Values</span></h2>
    </div>
    <div class="grid-3">
      <div class="value-card">
        <span class="value-icon">🤝</span>
        <h3>Community First</h3>
        <p>Every feature we build starts with a community need. Our silos are spaces where belonging and growth go hand-in-hand.</p>
      </div>
      <div class="value-card">
        <span class="value-icon">⚡</span>
        <h3>Action Over Theory</h3>
        <p>Challenges, submissions, and cross-silo projects ensure that learning on SkillSilo always translates to real-world output.</p>
      </div>
      <div class="value-card">
        <span class="value-icon">🔓</span>
        <h3>Open Access</h3>
        <p>Knowledge shouldn't be gated. Most silos on our platform are open to all, because we believe in equal access to growth.</p>
      </div>
      <div class="value-card">
        <span class="value-icon">🌍</span>
        <h3>Pan-African Vision</h3>
        <p>Built in Africa, for the world. We center African talent and innovation while building for a truly global audience.</p>
      </div>
      <div class="value-card">
        <span class="value-icon">🔗</span>
        <h3>Cross-Domain Thinking</h3>
        <p>The best solutions emerge when skills combine. Our Cross-Silo system makes interdisciplinary collaboration effortless.</p>
      </div>
      <div class="value-card">
        <span class="value-icon">📈</span>
        <h3>Measurable Growth</h3>
        <p>Challenges, consultations and community feedback give you real signals of your progress — not just vanity metrics.</p>
      </div>
    </div>
  </div>
</section>

<!-- TEAM -->
<section class="section" style="background: var(--dark2); border-top: 1px solid var(--border);">
  <div class="container">
    <div style="text-align: center; margin-bottom: 48px;">
      <div class="tag" style="margin: 0 auto 16px;">● The People</div>
      <h2 class="section-title">Meet the <span class="yellow">SkillSilo</span> Team</h2>
      <p class="section-sub" style="margin: 0 auto;">Passionate builders, educators and community organizers on a shared mission.</p>
    </div>
    <div class="grid-4">
      <div class="team-card">
        <div class="team-avatar">JO</div>
        <div class="team-name">James Omondi</div>
        <div class="team-role">Founder & CEO</div>
        <div class="team-bio">Full-stack engineer turned community builder. Passionate about African tech ecosystems.</div>
      </div>
      <div class="team-card">
        <div class="team-avatar" style="background: #a78bfa; color: var(--dark);">AW</div>
        <div class="team-name">Aisha Wambui</div>
        <div class="team-role">Head of Design</div>
        <div class="team-bio">Former Figma community lead. Believes great design is invisible and unforgettable.</div>
      </div>
      <div class="team-card">
        <div class="team-avatar" style="background: #4ade80; color: var(--dark);">KM</div>
        <div class="team-name">Kofi Mensah</div>
        <div class="team-role">Lead Engineer</div>
        <div class="team-bio">NestJS & Prisma wizard. Built the entire SkillSilo backend from scratch in record time.</div>
      </div>
      <div class="team-card">
        <div class="team-avatar" style="background: #38bdf8; color: var(--dark);">PN</div>
        <div class="team-name">Priya Ndiaye</div>
        <div class="team-role">Community Lead</div>
        <div class="team-bio">Ex-Google Developer Expert. Grows communities that actually retain and energize members.</div>
      </div>
    </div>
  </div>
</section>

<!-- NUMBERS -->
<section class="section">
  <div class="container">
    <div class="grid-4" style="gap: 0;">
      <div style="text-align: center; padding: 40px; border-right: 1px solid var(--border);">
        <div style="font-family: 'Syne', sans-serif; font-size: 56px; font-weight: 800; color: var(--yellow);">12K+</div>
        <div style="font-size: 15px; color: var(--text-muted); margin-top: 8px;">Active Learners</div>
      </div>
      <div style="text-align: center; padding: 40px; border-right: 1px solid var(--border);">
        <div style="font-family: 'Syne', sans-serif; font-size: 56px; font-weight: 800; color: var(--yellow);">340+</div>
        <div style="font-size: 15px; color: var(--text-muted); margin-top: 8px;">Skill Silos</div>
      </div>
      <div style="text-align: center; padding: 40px; border-right: 1px solid var(--border);">
        <div style="font-family: 'Syne', sans-serif; font-size: 56px; font-weight: 800; color: var(--yellow);">1.8K</div>
        <div style="font-size: 15px; color: var(--text-muted); margin-top: 8px;">Challenges Completed</div>
      </div>
      <div style="text-align: center; padding: 40px;">
        <div style="font-family: 'Syne', sans-serif; font-size: 56px; font-weight: 800; color: var(--yellow);">98%</div>
        <div style="font-size: 15px; color: var(--text-muted); margin-top: 8px;">Member Satisfaction</div>
      </div>
    </div>
  </div>
</section>

</div>
<app-footer></app-footer>
  `,
  styles: `
     :root {
    --yellow: #F5C518;
    --yellow-light: #FFE066;
    --yellow-dark: #D4A800;
    --dark: #0D0D0D;
    --dark2: #141414;
    --dark3: #1E1E1E;
    --gray: #2A2A2A;
    --gray2: #3A3A3A;
    --text: #F0F0F0;
    --text-muted: #8A8A8A;
    --text-sub: #B0B0B0;
    --white: #FFFFFF;
    --card-bg: #181818;
    --border: rgba(255,255,255,0.07);
    --yellow-glow: 0 0 40px rgba(245,197,24,0.25);
    --radius: 16px;
    --radius-sm: 8px;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  html { scroll-behavior: smooth; }

  // body {
  //   font-family: 'DM Sans', sans-serif;
  //   background: var(--dark);
  //   color: var(--text);
  //   overflow-x: hidden;
  //   line-height: 1.6;
  // }

  h1, h2, h3, h4, h5 {
    font-family: 'Syne', sans-serif;
    line-height: 1.15;
  }

  .display-font { font-family: 'Clash Display', sans-serif; }

  /* ─── TOP BAR ─── */
  .top-bar {
    background: var(--yellow);
    color: var(--dark);
    text-align: center;
    padding: 8px 20px;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.02em;
  }

  .top-bar a { color: var(--dark); font-weight: 700; text-decoration: underline; }

  /* ─── NAVBAR ─── */
  nav {
    position: sticky;
    top: 0;
    z-index: 1000;
    background: rgba(13,13,13,0.95);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
    padding: 0 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 72px;
    transition: box-shadow 0.3s;
  }

  nav.scrolled { box-shadow: 0 4px 40px rgba(0,0,0,0.5); }

  .nav-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    text-decoration: none;
  }

  .logo-icon {
    width: 38px; height: 38px;
    background: var(--yellow);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    color: var(--dark);
  }

  .logo-text {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 22px;
    color: var(--white);
    letter-spacing: -0.5px;
  }

  .logo-text span { color: var(--yellow); }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 4px;
    list-style: none;
  }

  .nav-links li a {
    padding: 8px 16px;
    border-radius: 8px;
    color: var(--text-sub);
    text-decoration: none;
    font-size: 15px;
    font-weight: 500;
    transition: all 0.2s;
    cursor: pointer;
    display: block;
  }

  .nav-links li a:hover, .nav-links li a.active {
    color: var(--white);
    background: var(--gray);
  }

  .nav-links li a.active { color: var(--yellow); background: rgba(245,197,24,0.1); }

  .nav-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .btn {
    padding: 10px 24px;
    border-radius: 10px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
    font-family: 'DM Sans', sans-serif;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .btn-ghost {
    background: transparent;
    color: var(--text-sub);
    border: 1px solid var(--border);
  }

  .btn-ghost:hover { color: var(--white); border-color: var(--gray2); background: var(--gray); }

  .btn-primary {
    background: var(--yellow);
    color: var(--dark);
  }

  .btn-primary:hover {
    background: var(--yellow-light);
    box-shadow: var(--yellow-glow);
    transform: translateY(-1px);
  }

  .btn-outline {
    background: transparent;
    color: var(--yellow);
    border: 2px solid var(--yellow);
  }

  .btn-outline:hover { background: var(--yellow); color: var(--dark); }

  .btn-lg { padding: 14px 32px; font-size: 16px; border-radius: 12px; }

  .btn-dark {
    background: var(--gray);
    color: var(--text);
    border: 1px solid var(--border);
  }

  .btn-dark:hover { background: var(--gray2); }

  /* ─── PAGES ─── */
  .page { display: none; }
  .page.active { display: block; }

  /* ─── SECTION HELPERS ─── */
  .section { padding: 100px 0; }
  .section-sm { padding: 60px 0; }
  .container { max-width: 1200px; margin: 0 auto; padding: 0 48px; }
  .container-wide { max-width: 1400px; margin: 0 auto; padding: 0 48px; }

  .tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: 100px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    background: rgba(245,197,24,0.12);
    color: var(--yellow);
    border: 1px solid rgba(245,197,24,0.25);
    margin-bottom: 20px;
  }

  .section-title { font-size: clamp(32px, 4vw, 52px); font-weight: 700; margin-bottom: 16px; }
  .section-sub { font-size: 17px; color: var(--text-sub); max-width: 560px; line-height: 1.7; }

  .yellow { color: var(--yellow); }

  /* ─── CARDS ─── */
  .card {
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 28px;
    transition: all 0.3s;
  }

  .card:hover {
    border-color: rgba(245,197,24,0.3);
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(0,0,0,0.4), var(--yellow-glow);
  }

  /* ─── GRID ─── */
  .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 28px; }
  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
  .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }

  /* ═══════════════════════════════════════
     HOME PAGE
  ═══════════════════════════════════════ */

  /* HERO */
  .hero {
    min-height: 90vh;
    display: flex;
    align-items: center;
    position: relative;
    overflow: hidden;
    background: var(--dark);
    padding: 80px 0;
  }

  .hero-bg {
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 60% 60% at 70% 50%, rgba(245,197,24,0.08) 0%, transparent 70%),
      radial-gradient(ellipse 40% 40% at 20% 80%, rgba(245,197,24,0.05) 0%, transparent 70%);
  }

  .hero-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 60px 60px;
  }

  .hero-inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
    position: relative;
    z-index: 1;
  }

  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(245,197,24,0.1);
    border: 1px solid rgba(245,197,24,0.3);
    border-radius: 100px;
    padding: 8px 16px;
    font-size: 13px;
    font-weight: 600;
    color: var(--yellow);
    margin-bottom: 28px;
    animation: fadeSlideUp 0.6s ease both;
  }

  .badge-dot {
    width: 6px; height: 6px;
    background: var(--yellow);
    border-radius: 50%;
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.3); }
  }

  .hero h1 {
    font-size: clamp(44px, 5.5vw, 76px);
    font-weight: 800;
    line-height: 1.05;
    margin-bottom: 24px;
    animation: fadeSlideUp 0.7s 0.1s ease both;
  }

  .hero p {
    font-size: 18px;
    color: var(--text-sub);
    line-height: 1.75;
    margin-bottom: 40px;
    max-width: 480px;
    animation: fadeSlideUp 0.7s 0.2s ease both;
  }

  .hero-actions {
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
    animation: fadeSlideUp 0.7s 0.3s ease both;
  }

  .hero-stats {
    display: flex;
    gap: 40px;
    margin-top: 56px;
    animation: fadeSlideUp 0.7s 0.4s ease both;
  }

  .stat { display: flex; flex-direction: column; gap: 4px; }
  .stat-num { font-family: 'Syne', sans-serif; font-size: 32px; font-weight: 800; color: var(--yellow); }
  .stat-label { font-size: 13px; color: var(--text-muted); font-weight: 500; }

  .hero-visual {
    position: relative;
    animation: fadeSlideUp 0.8s 0.2s ease both;
  }

  .hero-card-main {
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 32px;
    position: relative;
  }

  .hero-card-main::before {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: 21px;
    background: linear-gradient(135deg, rgba(245,197,24,0.3), transparent 50%);
    z-index: -1;
  }

  .silo-preview {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .silo-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 16px;
    background: var(--dark3);
    border-radius: 12px;
    border: 1px solid var(--border);
    transition: all 0.3s;
    cursor: pointer;
  }

  .silo-item:hover { border-color: rgba(245,197,24,0.4); background: rgba(245,197,24,0.04); }

  .silo-icon {
    width: 42px; height: 42px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
  }

  .silo-info h4 { font-size: 14px; font-weight: 600; margin-bottom: 2px; }
  .silo-info p { font-size: 12px; color: var(--text-muted); }

  .silo-members {
    margin-left: auto;
    display: flex;
    align-items: center;
  }

  .avatar-stack { display: flex; }
  .avatar-mini {
    width: 26px; height: 26px;
    border-radius: 50%;
    border: 2px solid var(--card-bg);
    margin-left: -8px;
    font-size: 11px;
    display: flex; align-items: center; justify-content: center;
    font-weight: 700;
    color: var(--dark);
  }

  .avatar-mini:first-child { margin-left: 0; }

  .floating-card {
    position: absolute;
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 14px 18px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    gap: 10px;
    animation: float 4s ease-in-out infinite;
  }

  .floating-card.card-1 { top: -20px; right: -20px; animation-delay: 0s; }
  .floating-card.card-2 { bottom: -20px; left: -20px; animation-delay: 2s; }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }

  .fc-icon { font-size: 24px; }
  .fc-text { font-size: 12px; }
  .fc-text strong { display: block; font-size: 14px; font-weight: 700; }

  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* FEATURES STRIP */
  .features-strip {
    background: var(--dark2);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    padding: 40px 0;
  }

  .features-strip-inner {
    display: flex;
    gap: 0;
    justify-content: space-between;
  }

  .feature-pill {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 0 40px;
    border-right: 1px solid var(--border);
    flex: 1;
  }

  .feature-pill:last-child { border-right: none; }

  .feature-pill-icon {
    width: 48px; height: 48px;
    background: rgba(245,197,24,0.1);
    border: 1px solid rgba(245,197,24,0.2);
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
    flex-shrink: 0;
  }

  .fp-text h4 { font-size: 15px; font-weight: 600; margin-bottom: 3px; }
  .fp-text p { font-size: 13px; color: var(--text-muted); }

  /* ABOUT SECTION */
  .about-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
  }

  .about-images {
    position: relative;
    height: 500px;
  }

  .about-img-main {
    width: 65%;
    height: 380px;
    background: linear-gradient(135deg, var(--gray) 0%, var(--dark3) 100%);
    border-radius: 20px;
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 80px;
    overflow: hidden;
  }

  .about-img-secondary {
    width: 55%;
    height: 260px;
    background: var(--yellow);
    border-radius: 16px;
    position: absolute;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 60px;
  }

  .about-xp-badge {
    position: absolute;
    bottom: 30px;
    left: 10px;
    background: var(--dark);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 16px 20px;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .xp-num { font-family: 'Syne', sans-serif; font-size: 36px; font-weight: 800; color: var(--yellow); }
  .xp-text { font-size: 13px; color: var(--text-muted); }

  .check-list { list-style: none; display: flex; flex-direction: column; gap: 14px; margin: 28px 0; }
  .check-list li {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    font-size: 15px;
    color: var(--text-sub);
  }

  .check-icon {
    width: 22px; height: 22px;
    border-radius: 50%;
    background: rgba(245,197,24,0.15);
    border: 1px solid rgba(245,197,24,0.4);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px;
    color: var(--yellow);
    flex-shrink: 0;
    margin-top: 2px;
  }

  .contact-box {
    display: flex;
    align-items: center;
    gap: 16px;
    background: var(--dark3);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 20px 24px;
    margin-top: 32px;
  }

  .contact-box-icon { font-size: 32px; }
  .contact-box-text p { font-size: 12px; color: var(--text-muted); }
  .contact-box-text strong { font-size: 18px; font-weight: 700; color: var(--white); }
  .contact-box-quote { margin-left: auto; font-style: italic; color: var(--text-muted); font-size: 13px; }

  /* SKILLS SECTION */
  .skill-card {
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    transition: all 0.3s;
    cursor: pointer;
  }

  .skill-card:hover { border-color: rgba(245,197,24,0.3); transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,0.4); }

  .skill-card-img {
    height: 180px;
    display: flex; align-items: center; justify-content: center;
    font-size: 60px;
    position: relative;
    overflow: hidden;
  }

  .skill-badge {
    position: absolute;
    top: 14px; left: 14px;
    background: var(--yellow);
    color: var(--dark);
    font-size: 11px;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 6px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .skill-card-body { padding: 20px; }
  .skill-card-body h3 { font-size: 17px; font-weight: 700; margin-bottom: 8px; }
  .skill-card-body p { font-size: 14px; color: var(--text-muted); margin-bottom: 16px; }

  .skill-meta { display: flex; align-items: center; justify-content: space-between; }
  .skill-rating { color: var(--yellow); font-size: 13px; }
  .skill-rating span { color: var(--text-muted); margin-left: 4px; }
  .skill-price { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; color: var(--yellow); }
  .skill-price.free { color: #4ade80; }

  .skills-tabs {
    display: flex;
    gap: 4px;
    margin-bottom: 48px;
    background: var(--dark2);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 6px;
    width: fit-content;
  }

  .tab-btn {
    padding: 9px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    color: var(--text-muted);
    background: transparent;
    border: none;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
  }

  .tab-btn.active, .tab-btn:hover {
    background: var(--yellow);
    color: var(--dark);
    font-weight: 600;
  }
  .mission-box {
    background: linear-gradient(135deg, var(--yellow) 0%, #FFD60A 100%);
    border-radius: 24px;
    padding: 80px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .mission-box h2 { font-size: 48px; color: var(--dark); font-weight: 800; max-width: 700px; margin: 0 auto 20px; }
  .mission-box p { font-size: 18px; color: rgba(0,0,0,0.65); max-width: 560px; margin: 0 auto; }

  .team-card {
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 32px;
    text-align: center;
    transition: all 0.3s;
  }

  .team-card:hover { border-color: rgba(245,197,24,0.3); transform: translateY(-4px); }

  .team-avatar {
    width: 80px; height: 80px; border-radius: 50%;
    background: var(--yellow);
    margin: 0 auto 16px;
    display: flex; align-items: center; justify-content: center;
    font-size: 32px; font-weight: 800; color: var(--dark);
    font-family: 'Syne', sans-serif;
  }

  .team-name { font-size: 18px; font-weight: 700; margin-bottom: 4px; }
  .team-role { font-size: 13px; color: var(--yellow); font-weight: 500; margin-bottom: 12px; }
  .team-bio { font-size: 14px; color: var(--text-muted); line-height: 1.6; }

  .value-card {
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 32px;
    transition: all 0.3s;
  }

  .value-card:hover { border-color: rgba(245,197,24,0.3); }

  .value-icon { font-size: 40px; margin-bottom: 16px; display: block; }
  .value-card h3 { font-size: 20px; font-weight: 700; margin-bottom: 10px; }
  .value-card p { font-size: 14px; color: var(--text-muted); line-height: 1.65; }

  /* ═══════════════════════════════════════
     DASHBOARD PAGE
  ═══════════════════════════════════════ */

  .dashboard {
    display: grid;
    grid-template-columns: 260px 1fr;
    min-height: calc(100vh - 73px);
  }

  .sidebar {
    background: var(--dark2);
    border-right: 1px solid var(--border);
    padding: 32px 16px;
    position: sticky;
    top: 72px;
    height: calc(100vh - 72px);
    overflow-y: auto;
  }

  .sidebar-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--text-muted);
    padding: 0 12px;
    margin-bottom: 8px;
    margin-top: 24px;
  }

  .sidebar-link {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 11px 14px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.2s;
    margin-bottom: 2px;
    text-decoration: none;
  }

  .sidebar-link:hover { background: var(--gray); color: var(--white); }
  .sidebar-link.active { background: rgba(245,197,24,0.1); color: var(--yellow); font-weight: 600; }
  .sidebar-link .sl-icon { font-size: 18px; width: 24px; text-align: center; }

  .sidebar-badge {
    margin-left: auto;
    background: var(--yellow);
    color: var(--dark);
    font-size: 10px;
    font-weight: 800;
    padding: 2px 8px;
    border-radius: 100px;
  }

  .dash-main { padding: 40px; overflow-y: auto; }

  .dash-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 36px;
  }

  .dash-greeting { font-size: 13px; color: var(--text-muted); margin-bottom: 4px; }
  .dash-title { font-size: 28px; font-weight: 800; }

  .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 36px; }

  .kpi-card {
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 20px 22px;
    transition: all 0.2s;
  }

  .kpi-card:hover { border-color: rgba(245,197,24,0.25); }

  .kpi-label { font-size: 12px; color: var(--text-muted); font-weight: 500; margin-bottom: 8px; display: flex; justify-content: space-between; }
  .kpi-icon { font-size: 16px; }
  .kpi-value { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; color: var(--white); }
  .kpi-change { font-size: 12px; margin-top: 4px; }
  .kpi-change.up { color: #4ade80; }
  .kpi-change.down { color: #f87171; }

  .dash-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
  .dash-row-3 { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-bottom: 24px; }

  .dash-widget {
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 24px;
  }

  .widget-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .widget-title { font-size: 15px; font-weight: 700; }
  .widget-action { font-size: 13px; color: var(--yellow); cursor: pointer; }

  .progress-bar-wrap { margin-bottom: 14px; }
  .progress-label { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px; }
  .progress-label span:first-child { color: var(--text-sub); }
  .progress-label span:last-child { color: var(--yellow); font-weight: 600; }
  .progress-bar { height: 6px; background: var(--gray); border-radius: 100px; overflow: hidden; }
  .progress-fill { height: 100%; background: var(--yellow); border-radius: 100px; }

  .activity-list { display: flex; flex-direction: column; gap: 12px; }
  .activity-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    background: var(--dark3);
    border-radius: 8px;
    font-size: 13px;
  }

  .ai-dot {
    width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
  }

  .activity-text { flex: 1; color: var(--text-sub); }
  .activity-time { color: var(--text-muted); font-size: 12px; white-space: nowrap; }

  .challenge-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 12px 0;
    border-bottom: 1px solid var(--border);
  }

  .challenge-item:last-child { border-bottom: none; }

  .ch-icon {
    width: 36px; height: 36px;
    border-radius: 8px;
    background: rgba(245,197,24,0.1);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }

  .ch-info { flex: 1; }
  .ch-info h5 { font-size: 14px; font-weight: 600; }
  .ch-info p { font-size: 12px; color: var(--text-muted); }
  .ch-due { font-size: 12px; color: var(--text-muted); white-space: nowrap; }

  .chat-preview { display: flex; flex-direction: column; gap: 10px; }
  .chat-msg {
    display: flex;
    gap: 10px;
    align-items: flex-end;
  }

  .chat-msg.sent { flex-direction: row-reverse; }

  .chat-av {
    width: 30px; height: 30px; border-radius: 50%;
    background: var(--yellow);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: var(--dark);
    flex-shrink: 0;
  }

  .chat-bubble {
    background: var(--dark3);
    border-radius: 12px 12px 12px 4px;
    padding: 10px 14px;
    font-size: 13px;
    color: var(--text-sub);
    max-width: 200px;
  }

  .chat-msg.sent .chat-bubble {
    background: rgba(245,197,24,0.15);
    color: var(--yellow-light);
    border-radius: 12px 12px 4px 12px;
  }

  .chat-input {
    display: flex;
    gap: 8px;
    margin-top: 14px;
  }

  .chat-input input {
    flex: 1;
    background: var(--dark3);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 13px;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    outline: none;
  }

  .chat-input input:focus { border-color: var(--yellow); }

  .chat-input button {
    background: var(--yellow);
    color: var(--dark);
    border: none;
    border-radius: 8px;
    padding: 10px 14px;
    cursor: pointer;
    font-weight: 600;
    font-size: 13px;
  }

  `,
})
export class About {

}
