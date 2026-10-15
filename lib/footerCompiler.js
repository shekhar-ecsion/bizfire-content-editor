import Handlebars from 'handlebars/dist/handlebars.js';

/**
 * Handlebars template for the Bizfire Site Footer & Multi-Column Navigation.
 * Responsive, self-contained HTML and scoped CSS with branding, multi-column links,
 * contact card, social profiles, and bottom copyright/legal bar.
 */
const FOOTER_TEMPLATE = `
<!-- Bizfire Site Footer Component -->
<footer class="bizfire-site-footer theme-{{settings.theme}}" data-component="site-footer">
  <div class="bizfire-footer-container main-container">
    <div class="bizfire-footer-grid">
      <!-- Column 1: Brand & About -->
      <div class="footer-col brand-col">
        <div class="footer-brand">
          <a href="/" class="brand-link" title="{{branding.siteTitle}}">
            {{#if branding.logoUrl}}
            <img src="{{branding.logoUrl}}" alt="{{branding.siteTitle}}" class="brand-logo" style="max-width: {{#if branding.logoWidth}}{{branding.logoWidth}}px{{else}}160px{{/if}};" />
            {{else}}
            <span class="brand-text">{{branding.siteTitle}}</span>
            {{/if}}
          </a>
          {{#if branding.tagline}}
          <p class="brand-tagline">{{branding.tagline}}</p>
          {{/if}}
          {{#if branding.aboutText}}
          <p class="brand-about">{{branding.aboutText}}</p>
          {{/if}}
        </div>

        {{#if hasSocial}}
        <div class="footer-social-links" aria-label="Social Media">
          {{#if social.facebook}}
          <a href="{{social.facebook}}" target="_blank" rel="noopener noreferrer" class="social-icon" title="Facebook" aria-label="Facebook">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
          </a>
          {{/if}}
          {{#if social.twitter}}
          <a href="{{social.twitter}}" target="_blank" rel="noopener noreferrer" class="social-icon" title="X (Twitter)" aria-label="Twitter">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          {{/if}}
          {{#if social.linkedin}}
          <a href="{{social.linkedin}}" target="_blank" rel="noopener noreferrer" class="social-icon" title="LinkedIn" aria-label="LinkedIn">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
          </a>
          {{/if}}
          {{#if social.instagram}}
          <a href="{{social.instagram}}" target="_blank" rel="noopener noreferrer" class="social-icon" title="Instagram" aria-label="Instagram">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          </a>
          {{/if}}
          {{#if social.youtube}}
          <a href="{{social.youtube}}" target="_blank" rel="noopener noreferrer" class="social-icon" title="YouTube" aria-label="YouTube">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          </a>
          {{/if}}
        </div>
        {{/if}}
      </div>

      <!-- Configurable Navigation Columns -->
      {{#each columns}}
      <div class="footer-col nav-col">
        <h4 class="col-title">{{title}}</h4>
        <ul class="footer-links-list">
          {{#each links}}
          <li>
            <a href="{{url}}" target="{{#if target}}{{target}}{{else}}_self{{/if}}">{{label}}</a>
          </li>
          {{/each}}
        </ul>
      </div>
      {{/each}}

      <!-- Contact Info Column -->
      {{#if hasContact}}
      <div class="footer-col contact-col">
        <h4 class="col-title">Get In Touch</h4>
        <ul class="footer-contact-list">
          {{#if contact.showAddress}}
          {{#if contact.address}}
          <li class="contact-item">
            <span class="contact-icon">&#128205;</span>
            <span class="contact-text">{{contact.address}}</span>
          </li>
          {{/if}}
          {{/if}}

          {{#if contact.showPhone}}
          {{#if contact.phone}}
          <li class="contact-item">
            <span class="contact-icon">&#128222;</span>
            <a href="tel:{{contact.phone}}" class="contact-link">{{contact.phone}}</a>
          </li>
          {{/if}}
          {{/if}}

          {{#if contact.showEmail}}
          {{#if contact.email}}
          <li class="contact-item">
            <span class="contact-icon">&#9993;</span>
            <a href="mailto:{{contact.email}}" class="contact-link">{{contact.email}}</a>
          </li>
          {{/if}}
          {{/if}}

          {{#if contact.workingHours}}
          <li class="contact-item">
            <span class="contact-icon">&#128340;</span>
            <span class="contact-text">{{contact.workingHours}}</span>
          </li>
          {{/if}}
        </ul>
      </div>
      {{/if}}
    </div>
  </div>

  <!-- Bottom Bar: Copyright & Legal Links -->
  <div class="bizfire-footer-bottom">
    <div class="bizfire-footer-container bottom-container">
      <div class="copyright-wrap">
        <p class="copyright-text">{{bottomBar.copyrightText}}</p>
      </div>

      {{#if bottomBar.links.length}}
      <div class="legal-links-wrap">
        <ul class="legal-links-list">
          {{#each bottomBar.links}}
          <li>
            <a href="{{url}}" target="{{#if target}}{{target}}{{else}}_self{{/if}}">{{label}}</a>
          </li>
          {{/each}}
        </ul>
      </div>
      {{/if}}
    </div>
  </div>
</footer>
`;

/**
 * Scoped CSS for the Bizfire Site Footer and Theme Suppression.
 */
const FOOTER_STYLES = `
<style id="bizfire-site-footer-css">
/* Bizfire Scoped Site Footer Styles */
/* Suppress native theme footer strictly on Bizfire custom pages */
body.has-bizfire-custom-footer footer:not(.bizfire-site-footer),
body.has-bizfire-custom-footer #colophon,
body.has-bizfire-custom-footer .site-footer,
body.has-bizfire-custom-footer .ast-footer-copyright,
body.has-bizfire-custom-footer #ast-mobile-footer,
body.wp-singular:has(.bizfire-site-footer) footer:not(.bizfire-site-footer),
body.wp-singular:has(.bizfire-site-footer) #colophon,
body.wp-singular:has(.bizfire-site-footer) .site-footer,
body.wp-singular:has(.bizfire-site-footer) .ast-footer-copyright,
body.wp-singular:has(.bizfire-site-footer) #ast-mobile-footer {
  display: none !important;
}

.bizfire-site-footer {
  width: 100%;
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.6;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  margin-top: 60px;
}

.bizfire-site-footer * {
  box-sizing: border-box;
}

/* Dark Theme Preset (Default) */
.bizfire-site-footer.theme-dark {
  background-color: #0f172a;
  color: #94a3b8;
}

.bizfire-site-footer.theme-dark .brand-text,
.bizfire-site-footer.theme-dark .col-title,
.bizfire-site-footer.theme-dark .copyright-text {
  color: #f8fafc;
}

.bizfire-site-footer.theme-dark .brand-tagline {
  color: #38bdf8;
}

.bizfire-site-footer.theme-dark .footer-links-list a,
.bizfire-site-footer.theme-dark .contact-link,
.bizfire-site-footer.theme-dark .legal-links-list a {
  color: #cbd5e1;
  text-decoration: none;
  transition: color 0.15s ease;
}

.bizfire-site-footer.theme-dark .footer-links-list a:hover,
.bizfire-site-footer.theme-dark .contact-link:hover,
.bizfire-site-footer.theme-dark .legal-links-list a:hover {
  color: #38bdf8;
}

.bizfire-site-footer.theme-dark .social-icon {
  background: rgba(255, 255, 255, 0.06);
  color: #cbd5e1;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.bizfire-site-footer.theme-dark .social-icon:hover {
  background: #38bdf8;
  color: #0f172a;
  border-color: #38bdf8;
}

.bizfire-site-footer.theme-dark .bizfire-footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

/* Light Theme Preset */
.bizfire-site-footer.theme-light {
  background-color: #f8fafc;
  color: #64748b;
  border-top: 1px solid #e2e8f0;
}

.bizfire-site-footer.theme-light .brand-text,
.bizfire-site-footer.theme-light .col-title,
.bizfire-site-footer.theme-light .copyright-text {
  color: #0f172a;
}

.bizfire-site-footer.theme-light .brand-tagline {
  color: #0284c7;
}

.bizfire-site-footer.theme-light .footer-links-list a,
.bizfire-site-footer.theme-light .contact-link,
.bizfire-site-footer.theme-light .legal-links-list a {
  color: #475569;
  text-decoration: none;
  transition: color 0.15s ease;
}

.bizfire-site-footer.theme-light .footer-links-list a:hover,
.bizfire-site-footer.theme-light .contact-link:hover,
.bizfire-site-footer.theme-light .legal-links-list a:hover {
  color: #0284c7;
}

.bizfire-site-footer.theme-light .social-icon {
  background: #ffffff;
  color: #475569;
  border: 1px solid #cbd5e1;
}

.bizfire-site-footer.theme-light .social-icon:hover {
  background: #0284c7;
  color: #ffffff;
  border-color: #0284c7;
}

.bizfire-site-footer.theme-light .bizfire-footer-bottom {
  border-top: 1px solid #e2e8f0;
}

/* Layout Containers */
.bizfire-site-footer .bizfire-footer-container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 20px;
}

.bizfire-site-footer .main-container {
  padding-top: 60px;
  padding-bottom: 50px;
}

.bizfire-site-footer .bizfire-footer-grid {
  display: grid;
  grid-template-columns: 1.5fr repeat(auto-fit, minmax(180px, 1fr));
  gap: 40px;
}

/* Column Elements */
.bizfire-site-footer .brand-col {
  padding-right: 15px;
}

.bizfire-site-footer .brand-link {
  text-decoration: none;
  display: inline-block;
  margin-bottom: 12px;
}

.bizfire-site-footer .brand-logo {
  height: auto;
  display: block;
}

.bizfire-site-footer .brand-text {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.bizfire-site-footer .brand-tagline {
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 12px;
}

.bizfire-site-footer .brand-about {
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 20px;
}

.bizfire-site-footer .footer-social-links {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.bizfire-site-footer .social-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  transition: all 0.2s ease;
  text-decoration: none;
}

.bizfire-site-footer .col-title {
  font-size: 15px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0 0 20px;
}

.bizfire-site-footer .footer-links-list,
.bizfire-site-footer .footer-contact-list,
.bizfire-site-footer .legal-links-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.bizfire-site-footer .footer-links-list li {
  margin-bottom: 10px;
}

.bizfire-site-footer .footer-links-list a {
  font-size: 14px;
  display: inline-block;
}

.bizfire-site-footer .contact-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 12px;
  font-size: 14px;
}

.bizfire-site-footer .contact-icon {
  font-size: 16px;
  flex-shrink: 0;
  line-height: 1.4;
}

.bizfire-site-footer .contact-link {
  word-break: break-all;
}

/* Bottom Bar */
.bizfire-site-footer .bizfire-footer-bottom {
  padding: 22px 0;
}

.bizfire-site-footer .bottom-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 15px;
}

.bizfire-site-footer .copyright-text {
  font-size: 13px;
  margin: 0;
}

.bizfire-site-footer .legal-links-list {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.bizfire-site-footer .legal-links-list a {
  font-size: 13px;
}

/* Responsive Breakpoints */
@media (max-width: 991px) {
  .bizfire-site-footer .bizfire-footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 30px;
  }

  .bizfire-site-footer .brand-col {
    grid-column: span 2;
  }
}

@media (max-width: 640px) {
  .bizfire-site-footer .main-container {
    padding-top: 40px;
    padding-bottom: 30px;
  }

  .bizfire-site-footer .bizfire-footer-grid {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .bizfire-site-footer .brand-col {
    grid-column: span 1;
  }

  .bizfire-site-footer .bottom-container {
    flex-direction: column;
    text-align: center;
    justify-content: center;
  }

  .bizfire-site-footer .legal-links-list {
    justify-content: center;
  }
}
</style>
`;

/**
 * Compiles the footer configuration JSON into self-contained HTML and CSS.
 *
 * @param {object} footerData Footer configuration object
 * @returns {{ html: string, css: string, compiledFooter: string }}
 */
export function compileFooter(footerData = {}) {
  const currentYear = new Date().getFullYear();

  const context = {
    branding: {
      siteTitle: footerData.branding?.siteTitle || 'Company Name',
      logoUrl: footerData.branding?.logoUrl || '',
      logoWidth: footerData.branding?.logoWidth || 160,
      tagline: footerData.branding?.tagline || '',
      aboutText: footerData.branding?.aboutText || '',
    },
    columns: Array.isArray(footerData.columns) ? footerData.columns : [],
    contact: {
      phone: footerData.contact?.phone || '',
      phoneLabel: footerData.contact?.phoneLabel || 'Phone',
      email: footerData.contact?.email || '',
      emailLabel: footerData.contact?.emailLabel || 'Email',
      address: footerData.contact?.address || '',
      addressLabel: footerData.contact?.addressLabel || 'Address',
      workingHours: footerData.contact?.workingHours || '',
      showPhone: footerData.contact?.showPhone !== false,
      showEmail: footerData.contact?.showEmail !== false,
      showAddress: footerData.contact?.showAddress !== false,
    },
    social: {
      facebook: footerData.social?.facebook || '',
      twitter: footerData.social?.twitter || '',
      linkedin: footerData.social?.linkedin || '',
      instagram: footerData.social?.instagram || '',
      youtube: footerData.social?.youtube || '',
    },
    bottomBar: {
      copyrightText:
        footerData.bottomBar?.copyrightText ||
        `© ${currentYear} ${footerData.branding?.siteTitle || 'Company'}. All rights reserved.`,
      links: Array.isArray(footerData.bottomBar?.links) ? footerData.bottomBar.links : [],
    },
    settings: {
      theme: footerData.settings?.theme === 'light' ? 'light' : 'dark',
      backgroundColor: footerData.settings?.backgroundColor || '',
      textColor: footerData.settings?.textColor || '',
      accentColor: footerData.settings?.accentColor || '',
    },
  };

  context.hasSocial = Boolean(
    context.social.facebook ||
      context.social.twitter ||
      context.social.linkedin ||
      context.social.instagram ||
      context.social.youtube
  );

  context.hasContact = Boolean(
    (context.contact.showPhone && context.contact.phone) ||
      (context.contact.showEmail && context.contact.email) ||
      (context.contact.showAddress && context.contact.address) ||
      context.contact.workingHours
  );

  const compiledTemplate = Handlebars.compile(FOOTER_TEMPLATE);
  const html = compiledTemplate(context);

  return {
    html: html.trim(),
    css: FOOTER_STYLES.trim(),
    compiledFooter: `${FOOTER_STYLES}\n${html}`.trim(),
  };
}
