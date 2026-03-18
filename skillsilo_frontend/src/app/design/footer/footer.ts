import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  template: `
    <!-- <body> -->
    <!-- ═══════════════════════════════════
     FOOTER (shown on all non-dashboard pages)
═══════════════════════════════════ -->
<footer id="main-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="nav-logo" style="margin-bottom: 0; cursor: pointer;" >
            <div class="logo-icon">S</div>
            <span class="logo-text">Skill<span>Silo</span></span>
          </div>
          <p>Your ultimate destination for skill communities. Build, learn and collaborate inside focused silos with real challenges and cross-domain connections.</p>
          <div class="newsletter-form">
            <input placeholder="Your email...">
            <button class="btn btn-primary" style="padding: 12px 18px; font-size: 14px;">Join</button>
          </div>
        </div>
  
        <div class="footer-col">
          <h5>Platform</h5>
          <ul class="footer-links">
            <li><a >Browse Silos</a></li>
            <li><a >Dashboard</a></li>
            <li><a>Challenges</a></li>
            <li><a>Cross-Silo</a></li>
            <li><a>Consultations</a></li>
          </ul>
        </div>
  
        <div class="footer-col">
          <h5>Company</h5>
          <ul class="footer-links">
            <li><a >About Us</a></li>
            <li><a>Careers</a></li>
            <li><a>Blog</a></li>
            <li><a>Press</a></li>
            <li><a >Contact</a></li>
          </ul>
        </div>
  
        <div class="footer-col">
          <h5>Support</h5>
          <ul class="footer-links">
            <li><a>Help Center</a></li>
            <li><a>Community</a></li>
            <li><a>Privacy Policy</a></li>
            <li><a>Terms of Service</a></li>
            <li><a>Cookie Policy</a></li>
          </ul>
        </div>
      </div>
  
      <div class="footer-bottom">
        <p>© 2026 SkillSilo. All rights reserved. Made with ❤️ in Nairobi.</p>
        <div class="social-links">
          <a class="social-btn">𝕏</a>
          <a class="social-btn">in</a>
          <a class="social-btn">ig</a>
          <a class="social-btn">gh</a>
        </div>
      </div>
    </div>
  </footer>
<!-- </body> -->
  `,
  styles: `
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

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--dark);
    color: var(--text);
    overflow-x: hidden;
    line-height: 1.6;
  }

  h1, h2, h3, h4, h5 {
    font-family: 'Syne', sans-serif;
    line-height: 1.15;
  }

  .display-font { font-family: 'Clash Display', sans-serif; }

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
  `,
})
export class Footer {

}
