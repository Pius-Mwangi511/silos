import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  template: `
<footer id="main-footer">
  <div class="container">
    <div class="footer-grid">

      <!-- Brand -->
      <div class="footer-brand">
        <a routerLink="/" class="nav-logo" style="margin-bottom: 0; text-decoration: none;">
          <div class="logo-icon">S</div>
          <span class="logo-text">Skill<span>Silo</span></span>
        </a>
        <p>Your ultimate destination for skill communities. Build, learn and collaborate inside focused silos with real challenges and cross-domain connections.</p>
        <div class="newsletter-form">
          <input placeholder="Your email...">
          <button class="btn btn-primary" style="padding: 12px 18px; font-size: 14px;">Join</button>
        </div>
      </div>

      <!-- Platform links -->
      <div class="footer-col">
        <h5>Platform</h5>
        <ul class="footer-links">
          <li><a routerLink="/manysilos">Browse Silos</a></li>
          <li><a routerLink="/dashboard">Dashboard</a></li>
          <li><a routerLink="/silos">Challenges</a></li>
          <li><a routerLink="/cross-silo">Cross-Silo</a></li>
          <li><a routerLink="/consultations">Consultations</a></li>
        </ul>
      </div>

      <!-- Company links -->
      <div class="footer-col">
        <h5>Company</h5>
        <ul class="footer-links">
          <li><a routerLink="/about">About Us</a></li>
          <li><a>Careers</a></li>
          <li><a>Blog</a></li>
          <li><a>Press</a></li>
          <li><a routerLink="/contact">Contact</a></li>
        </ul>
      </div>

      <!-- Support links -->
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
        <a class="social-btn" href="https://x.com" target="_blank" rel="noopener">𝕏</a>
        <a class="social-btn" href="https://linkedin.com" target="_blank" rel="noopener">in</a>
        <a class="social-btn" href="https://instagram.com" target="_blank" rel="noopener">ig</a>
        <a class="social-btn" href="https://github.com" target="_blank" rel="noopener">gh</a>
      </div>
    </div>
  </div>
</footer>
  `,
  styles: `
  footer {
    background: var(--dark2);
    border-top: 1px solid var(--border);
    padding: 80px 0 40px;
  }

  .footer-grid {
    display: grid;
    grid-template-columns: 1.5fr 1fr 1fr 1fr;
    gap: 60px;
    margin-bottom: 60px;
  }

  .footer-brand p {
    font-size: 14px;
    color: var(--text-muted);
    line-height: 1.7;
    margin-top: 16px;
    max-width: 280px;
  }

  .footer-col h5 {
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 20px;
    color: var(--white);
  }

  .footer-links {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

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

  .social-btn:hover {
    background: var(--yellow);
    color: var(--dark);
    border-color: var(--yellow);
  }

  /* Newsletter */
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

  /* Logo */
  .nav-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
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
    flex-shrink: 0;
  }

  .logo-text {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 22px;
    color: var(--white);
    letter-spacing: -0.5px;
  }

  .logo-text span { color: var(--yellow); }

  /* Buttons */
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

  .btn-primary { background: var(--yellow); color: var(--dark); }
  .btn-primary:hover {
    background: var(--yellow-light);
    box-shadow: var(--yellow-glow);
    transform: translateY(-1px);
  }

  /* Responsive */
  @media (max-width: 900px) {
    .footer-grid { grid-template-columns: 1fr 1fr; gap: 40px; }
  }

  @media (max-width: 560px) {
    .footer-grid { grid-template-columns: 1fr; }
    .footer-bottom { flex-direction: column; gap: 16px; text-align: center; }
  }
  `
})
export class Footer {}