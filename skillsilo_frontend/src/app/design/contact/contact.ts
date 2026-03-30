import { Component } from '@angular/core';
import { Footer } from "../footer/footer";
import { Navbar } from "../navbar/navbar";

@Component({
  selector: 'app-contact',
  standalone:true,
  imports: [Footer, Navbar],
  template: `
   <app-navbar></app-navbar>

   
<!-- ══════════════════════════════════════════
     CONTACT PAGE
══════════════════════════════════════════ -->
<div id="page-contact" class="page active">

<div class="page-hero">
  <div class="container">
    <div class="tag" style="margin: 0 auto 16px;">● Get In Touch</div>
    <h1>We'd Love to <span class="yellow">Hear</span> From You</h1>
    <p>Questions, partnerships, or just want to say hello? We're here and ready to help.</p>
  </div>
</div>

<section class="section">
  <div class="container">
    <div class="contact-grid">

      <!-- Contact Info -->
      <div>
        <h2 class="section-title" style="font-size: 36px; margin-bottom: 8px;">Let's <span class="yellow">Connect</span></h2>
        <p style="color: var(--text-sub); font-size: 15px; margin-bottom: 36px; line-height: 1.7;">Whether you're a learner, educator, partner or investor — our team is ready to talk.</p>

        <div class="contact-info-card" style="padding: 24px;">
          <div class="ci-icon">📍</div>
          <div class="ci-text">
            <h4>Our Office</h4>
            <p>Westlands Square, Nairobi, Kenya</p>
          </div>
        </div>
        <div class="contact-info-card" style="padding: 24px;">
          <div class="ci-icon">📞</div>
          <div class="ci-text">
            <h4>Phone</h4>
            <p>+254 700 000 000</p>
          </div>
        </div>
        <div class="contact-info-card" style="padding: 24px;">
          <div class="ci-icon">✉️</div>
          <div class="ci-text">
            <h4>Email</h4>
            <p>hello@skillsilo.co</p>
          </div>
        </div>
        <div class="contact-info-card" style="padding: 24px;">
          <div class="ci-icon">🕐</div>
          <div class="ci-text">
            <h4>Hours</h4>
            <p>Mon – Fri · 8AM – 6PM EAT</p>
          </div>
        </div>

        <div style="margin-top: 32px;">
          <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em;">Follow Us</p>
          <div style="display: flex; gap: 10px;">
            <a class="social-btn">𝕏</a>
            <a class="social-btn">in</a>
            <a class="social-btn">ig</a>
            <a class="social-btn">gh</a>
          </div>
        </div>
      </div>

      <!-- Contact Form -->
      <div class="form-card">
        <h3 style="font-size: 24px; font-weight: 700; margin-bottom: 8px;">Send Us a Message</h3>
        <p style="font-size: 14px; color: var(--text-muted); margin-bottom: 32px;">We typically respond within 24 hours.</p>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">First Name</label>
            <input class="form-input" type="text" placeholder="Kevin">
          </div>
          <div class="form-group">
            <label class="form-label">Last Name</label>
            <input class="form-input" type="text" placeholder="Otieno">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input class="form-input" type="email" placeholder="kevin@example.com">
          </div>
          <div class="form-group">
            <label class="form-label">Phone</label>
            <input class="form-input" type="tel" placeholder="+254 700 000 000">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Subject</label>
          <select class="form-select">
            <option>General Inquiry</option>
            <option>Partnership</option>
            <option>Technical Support</option>
            <option>Media & Press</option>
            <option>Investment</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Message</label>
          <textarea class="form-textarea" placeholder="Tell us how we can help..."></textarea>
        </div>

        <button class="btn btn-primary btn-lg" style="width: 100%; justify-content: center;">Send Message →</button>
      </div>
    </div>
  </div>
</section>

<!-- MAP / VISUAL -->
<section class="section-sm" style="background: var(--dark2); border-top: 1px solid var(--border);">
  <div class="container">
    <div style="background: var(--dark3); border: 1px solid var(--border); border-radius: var(--radius); padding: 60px; text-align: center;">
      <div style="font-size: 60px; margin-bottom: 16px;">📍</div>
      <h3 style="font-size: 24px; font-weight: 700; margin-bottom: 8px;">Nairobi, Kenya</h3>
      <p style="color: var(--text-muted);">Westlands Square · Nairobi · East Africa's Tech Hub</p>
      <button class="btn btn-primary" style="margin-top: 20px;">Get Directions →</button>
    </div>
  </div>
</section>

</div>

   <app-footer></app-footer>
  `,
  styles: `
  //   :root {
  //   --yellow: #F5C518;
  //   --yellow-light: #FFE066;
  //   --yellow-dark: #D4A800;
  //   --dark: #0D0D0D;
  //   --dark2: #141414;
  //   --dark3: #1E1E1E;
  //   --gray: #2A2A2A;
  //   --gray2: #3A3A3A;
  //   --text: #F0F0F0;
  //   --text-muted: #8A8A8A;
  //   --text-sub: #B0B0B0;
  //   --white: #FFFFFF;
  //   --card-bg: #181818;
  //   --border: rgba(255,255,255,0.07);
  //   --yellow-glow: 0 0 40px rgba(245,197,24,0.25);
  //   --radius: 16px;
  //   --radius-sm: 8px;
  // }

  // * { margin: 0; padding: 0; box-sizing: border-box; }

  // html { scroll-behavior: smooth; }

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

  /* TESTIMONIALS */
  .testimonial-card {
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 32px;
  }

  .testimonial-quote { font-size: 15px; color: var(--text-sub); line-height: 1.75; margin-bottom: 24px; }
  .testimonial-quote::before { content: '"'; font-size: 48px; color: var(--yellow); line-height: 0; vertical-align: -20px; margin-right: 4px; font-family: serif; }

  .testimonial-author { display: flex; align-items: center; gap: 12px; }
  .author-avatar {
    width: 44px; height: 44px; border-radius: 50%;
    background: var(--yellow);
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 16px; color: var(--dark);
  }

  .author-name { font-size: 15px; font-weight: 600; }
  .author-role { font-size: 13px; color: var(--text-muted); }
  .author-stars { margin-left: auto; color: var(--yellow); font-size: 13px; }

  /* CTA BANNER */
  .cta-banner {
    background: linear-gradient(135deg, var(--yellow) 0%, #FFD60A 100%);
    border-radius: 24px;
    padding: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 40px;
    position: relative;
    overflow: hidden;
  }

  .cta-banner::before {
    content: '⚡';
    position: absolute;
    font-size: 200px;
    right: -20px;
    top: -40px;
    opacity: 0.07;
    line-height: 1;
  }

  .cta-banner h2 { font-size: 40px; color: var(--dark); font-weight: 800; max-width: 480px; }
  .cta-banner p { color: rgba(0,0,0,0.6); margin-top: 10px; font-size: 16px; }

  .btn-cta-dark { background: var(--dark); color: var(--white); }
  .btn-cta-dark:hover { background: #111; }

  /* PARTNERS */
  .partners-strip {
    display: flex;
    gap: 48px;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }

  .partner-logo {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 18px;
    color: var(--text-muted);
    letter-spacing: -0.5px;
    transition: color 0.2s;
    cursor: pointer;
  }

  .partner-logo:hover { color: var(--yellow); }

  /* UPCOMING EVENTS */
  .event-card {
    display: flex;
    gap: 20px;
    align-items: flex-start;
    padding: 20px;
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    transition: all 0.2s;
  }

  .event-card:hover { border-color: rgba(245,197,24,0.3); }

  .event-date {
    background: var(--yellow);
    color: var(--dark);
    border-radius: 10px;
    padding: 10px 14px;
    text-align: center;
    min-width: 54px;
    flex-shrink: 0;
  }

  .event-day { font-size: 24px; font-weight: 800; font-family: 'Syne', sans-serif; line-height: 1; }
  .event-month { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; }
  .event-info h4 { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
  .event-info p { font-size: 13px; color: var(--text-muted); }

  /* ═══════════════════════════════════════
     SILOS PAGE
  ═══════════════════════════════════════ */

  .page-hero {
    background: linear-gradient(180deg, var(--dark2) 0%, var(--dark) 100%);
    border-bottom: 1px solid var(--border);
    padding: 80px 0 60px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .page-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 50% 80% at 50% 100%, rgba(245,197,24,0.08) 0%, transparent 70%);
  }

  .page-hero h1 { font-size: clamp(36px, 5vw, 64px); font-weight: 800; position: relative; }
  .page-hero p { font-size: 18px; color: var(--text-sub); margin-top: 16px; max-width: 600px; margin-left: auto; margin-right: auto; position: relative; }

  .silo-card {
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    transition: all 0.3s;
    cursor: pointer;
  }

  .silo-card:hover { border-color: rgba(245,197,24,0.35); transform: translateY(-5px); box-shadow: 0 20px 50px rgba(0,0,0,0.5); }

  .silo-card-header {
    padding: 28px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
  }

  .silo-card-icon {
    width: 56px; height: 56px;
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 28px;
  }

  .silo-card-status {
    padding: 4px 12px;
    border-radius: 100px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .status-active { background: rgba(74, 222, 128, 0.1); color: #4ade80; border: 1px solid rgba(74,222,128,0.25); }
  .status-popular { background: rgba(245,197,24,0.12); color: var(--yellow); border: 1px solid rgba(245,197,24,0.3); }
  .status-new { background: rgba(167,139,250,0.12); color: #a78bfa; border: 1px solid rgba(167,139,250,0.3); }

  .silo-card-body { padding: 0 28px 28px; }
  .silo-card-body h3 { font-size: 20px; font-weight: 700; margin-bottom: 8px; }
  .silo-card-body p { font-size: 14px; color: var(--text-muted); line-height: 1.6; margin-bottom: 20px; }

  .silo-card-stats {
    display: flex;
    gap: 24px;
    padding-top: 20px;
    border-top: 1px solid var(--border);
  }

  .silo-stat { display: flex; flex-direction: column; gap: 2px; }
  .silo-stat-num { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700; color: var(--yellow); }
  .silo-stat-label { font-size: 12px; color: var(--text-muted); }

  .silo-card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 28px;
    background: rgba(255,255,255,0.02);
    border-top: 1px solid var(--border);
  }

  .member-avatars { display: flex; align-items: center; gap: 4px; }
  .av {
    width: 30px; height: 30px; border-radius: 50%;
    border: 2px solid var(--card-bg);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: var(--dark);
    margin-left: -8px;
  }

  .av:first-child { margin-left: 0; }
  .av-count { margin-left: 6px; font-size: 12px; color: var(--text-muted); }

  .cross-silo-box {
    background: linear-gradient(135deg, rgba(245,197,24,0.08) 0%, rgba(245,197,24,0.02) 100%);
    border: 1px solid rgba(245,197,24,0.2);
    border-radius: var(--radius);
    padding: 40px;
    margin-top: 60px;
    display: flex;
    align-items: center;
    gap: 40px;
  }

  .cross-silo-icon { font-size: 64px; }
  .cross-silo-text h3 { font-size: 26px; font-weight: 700; margin-bottom: 8px; }
  .cross-silo-text p { font-size: 15px; color: var(--text-sub); line-height: 1.65; max-width: 480px; }
  .cross-silo-action { margin-left: auto; flex-shrink: 0; }

  /* ═══════════════════════════════════════
     ABOUT PAGE
  ═══════════════════════════════════════ */

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

  /* ═══════════════════════════════════════
     CONTACT PAGE
  ═══════════════════════════════════════ */

  .contact-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 60px; align-items: start; }

  .contact-info-card {
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 40px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 20px;
    transition: all 0.2s;
  }

  .contact-info-card:hover { border-color: rgba(245,197,24,0.3); }

  .ci-icon {
    width: 52px; height: 52px;
    border-radius: 14px;
    background: rgba(245,197,24,0.1);
    border: 1px solid rgba(245,197,24,0.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 24px;
    flex-shrink: 0;
  }

  .ci-text h4 { font-size: 16px; font-weight: 700; margin-bottom: 4px; }
  .ci-text p { font-size: 14px; color: var(--text-muted); }

  .form-card {
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 48px;
  }

  .form-group { margin-bottom: 22px; }
  .form-label { display: block; font-size: 13px; font-weight: 600; color: var(--text-sub); margin-bottom: 8px; letter-spacing: 0.02em; }
  .form-input, .form-textarea, .form-select {
    width: 100%;
    background: var(--dark3);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 13px 16px;
    font-size: 15px;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: border-color 0.2s;
  }

  .form-input:focus, .form-textarea:focus, .form-select:focus { border-color: var(--yellow); }
  .form-textarea { resize: vertical; min-height: 140px; }
  .form-select { appearance: none; }

  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

  /* ─── FOOTER ─── */
  footer {
    background: var(--dark2);
    border-top: 1px solid var(--border);
    padding: 80px 0 40px;
  }

  .footer-grid { display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr; gap: 60px; margin-bottom: 60px; }

  .footer-brand p { font-size: 14px; color: var(--text-muted); line-height: 1.7; margin-top: 16px; max-width: 280px; }

  .footer-col h5 { font-size: 14px; font-weight: 700; margin-bottom: 20px; color: var(--white); }
  .footer-links { list-style: none; display: flex; flex-direction: column; gap: 10px; }
  .footer-links a {
    font-size: 14px;
    color: var(--text-muted);
    text-decoration: none;
    transition: color 0.2s;
    cursor: pointer;
  }

  .footer-links a:hover { color: var(--yellow); }

  .footer-bottom {
    padding-top: 32px;
    border-top: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .footer-bottom p { font-size: 13px; color: var(--text-muted); }

  .social-links { display: flex; gap: 10px; }
  .social-btn {
    width: 38px; height: 38px;
    border-radius: 8px;
    background: var(--gray);
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
    color: var(--text-sub);
  }

  .social-btn:hover { background: var(--yellow); color: var(--dark); border-color: var(--yellow); }

  /* ─── NEWSLETTER ─── */
  .newsletter-form {
    display: flex;
    gap: 10px;
    margin-top: 20px;
  }

  .newsletter-form input {
    flex: 1;
    background: var(--dark3);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 12px 16px;
    font-size: 14px;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    outline: none;
  }

  .newsletter-form input:focus { border-color: var(--yellow); }

  /* ─── RESPONSIVE ─── */
  @media (max-width: 900px) {
    nav { padding: 0 20px; }
    .nav-links { display: none; }
    .container, .container-wide { padding: 0 20px; }
    .hero-inner { grid-template-columns: 1fr; gap: 40px; }
    .hero-visual { display: none; }
    .about-grid { grid-template-columns: 1fr; }
    .about-images { height: 300px; }
    .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; }
    .footer-grid { grid-template-columns: 1fr 1fr; }
    .dashboard { grid-template-columns: 1fr; }
    .sidebar { display: none; }
    .kpi-grid { grid-template-columns: 1fr 1fr; }
    .dash-row, .dash-row-3 { grid-template-columns: 1fr; }
    .contact-grid { grid-template-columns: 1fr; }
    .cta-banner { flex-direction: column; text-align: center; padding: 40px; }
    .cross-silo-box { flex-direction: column; }
    .cross-silo-action { margin: 0; }
  }

  /* ─── SCROLL ANIMATIONS ─── */
  .reveal {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease;
  }

  .reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }
  `,
})
export class Contact {

}
