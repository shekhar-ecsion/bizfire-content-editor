const fs = require('fs');
const path = require('path');

const rawSections = JSON.parse(fs.readFileSync('scratch/raw_sections.json', 'utf8'));
const compRoot = path.join(__dirname, 'workspaces/test-workspace-001/theme/components');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// 1. Plumbing Hero Split (Section 1)
ensureDir(path.join(compRoot, 'plumbing-hero-split'));
fs.writeFileSync(path.join(compRoot, 'plumbing-hero-split/schema.json'), JSON.stringify({
  name: 'Plumbing Hero Split',
  category: 'Hero',
  fields: {
    title: { type: 'text', label: 'Main Title', default: 'New Jersey Plumbing Services' },
    intro: { type: 'textarea', label: 'Intro Text', default: 'The quiet of a household depends on plumbing that works without being thought about.' },
    paragraph1: { type: 'textarea', label: 'Paragraph 1', default: 'Water pooling where it shouldn\'t. A shower that runs cold before the morning is over. A toilet that runs and runs at 2 a.m. These are the moments that pull a household off schedule.' },
    paragraph2: { type: 'textarea', label: 'Paragraph 2', default: 'Princeton Air\'s licensed plumbers arrive prepared, diagnose the actual cause, and complete the repair with careful attention to your finished spaces. Call or book online to schedule plumbing service in New Jersey.' },
    image: { type: 'image', label: 'Hero Image', default: { src: '/assets/img/1-index-hero-img.webp', alt: 'Professional Plumber' } }
  }
}, null, 2));

fs.writeFileSync(path.join(compRoot, 'plumbing-hero-split/defaults.json'), JSON.stringify({
  title: 'New Jersey Plumbing Services',
  intro: 'The quiet of a household depends on plumbing that works without being thought about.',
  paragraph1: 'Water pooling where it shouldn\'t. A shower that runs cold before the morning is over. A toilet that runs and runs at 2 a.m. These are the moments that pull a household off schedule.',
  paragraph2: 'Princeton Air\'s licensed plumbers arrive prepared, diagnose the actual cause, and complete the repair with careful attention to your finished spaces. Call or book online to schedule plumbing service in New Jersey.',
  image: { src: '/assets/img/1-index-hero-img.webp', alt: 'Professional Plumber' }
}, null, 2));

fs.writeFileSync(path.join(compRoot, 'plumbing-hero-split/template.html'), `<section class="plumbing-service-section">
  <div class="container-fluid">
    <div class="row p-0 align-items-stretch">
      <div class="col-lg-6 section-hero-main">
        <div class="plumbing-service-image">
          <img src="{{image.src}}" alt="{{image.alt}}" width="800" height="900" loading="eager" fetchpriority="high">
        </div>
      </div>
      <div class="col-lg-6 section-hero-main">
        <div class="plumbing-service-content">
          <div class="plumbing-service-divider"></div>
          <div class="plumbing-service-inner">
            <h2 class="plumbing-service-title">{{{title}}}</h2>
            {{#if intro}}<p class="plumbing-service-intro">{{intro}}</p>{{/if}}
            {{#if paragraph1}}<p class="plumbing-service-text">{{paragraph1}}</p>{{/if}}
            {{#if paragraph2}}<p class="plumbing-service-text">{{paragraph2}}</p>{{/if}}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`);

fs.writeFileSync(path.join(compRoot, 'plumbing-hero-split/style.css'), `/* Scoped Layer 2 styles for plumbing-hero-split */
.plumbing-service-section { min-height: 374px; display: flex; background: #fff; padding: 0; }
.plumbing-service-content { background: linear-gradient(to right, #A01922, #7D1118, #390106); color: #fff; }
.plumbing-service-title { color: #fff; font-family: Outfit, sans-serif; font-size: 38px; font-weight: 700; }
`);

// 2. CTA Strip (Section 2)
ensureDir(path.join(compRoot, 'cta-strip'));
fs.writeFileSync(path.join(compRoot, 'cta-strip/schema.json'), JSON.stringify({
  name: 'CTA Urgency Strip',
  category: 'Call to Action',
  fields: {
    text: { type: 'text', label: 'Callout Text', default: 'Ready to talk to a home services specialist?' },
    buttonText: { type: 'text', label: 'Button Label', default: 'Schedule Services' },
    buttonUrl: { type: 'text', label: 'Button URL', default: '#quote' }
  }
}, null, 2));

fs.writeFileSync(path.join(compRoot, 'cta-strip/defaults.json'), JSON.stringify({
  text: 'Ready to talk to a home services specialist?',
  buttonText: 'Schedule Services',
  buttonUrl: '#quote'
}, null, 2));

fs.writeFileSync(path.join(compRoot, 'cta-strip/template.html'), `<section class="cta-section">
  <div class="container">
    <div class="cta-wrapper">
      <p class="cta-text">{{text}}</p>
      <a href="{{buttonUrl}}" onclick="openQuotePopup()" class="btn-filled-chat">{{buttonText}}</a>
    </div>
  </div>
</section>`);

fs.writeFileSync(path.join(compRoot, 'cta-strip/style.css'), `/* Scoped Layer 2 styles for cta-strip */
.cta-section { background-color: #000; padding: 18px 0; }
.cta-wrapper { display: flex; align-items: center; justify-content: center; gap: 24px; flex-wrap: wrap; }
.cta-text { color: #fff; font-size: 18px; margin: 0; font-weight: 500; }
`);

// 3. Plumbing Order Checklist (Section 3)
ensureDir(path.join(compRoot, 'plumbing-order-checklist'));
fs.writeFileSync(path.join(compRoot, 'plumbing-order-checklist/schema.json'), JSON.stringify({
  name: 'Plumbing Order & Guarantee',
  category: 'Features',
  fields: {
    sectionTitle: { type: 'text', label: 'Section Title', default: 'When Plumbing Disrupts Your Home, We Restore Order' },
    headline: { type: 'text', label: 'Left Headline', default: 'Your plumbing works in the background until the minute it stops.' },
    desc1: { type: 'textarea', label: 'Description 1', default: 'You turn a handle expecting water. You flush expecting nothing else to happen. When one of those automatic assumptions stops holding, the rest of the household adjusts around it.' },
    desc2: { type: 'textarea', label: 'Description 2', default: 'Princeton Air\'s licensed plumbers walk into that moment with a plan. Five decades of serving New Jersey homeowners has taught us that the plumbing call that earns the next one is the one that\'s done properly the first time.' },
    stats: {
      type: 'array',
      label: 'Stats & Badges',
      itemLabel: 'Stat Item',
      itemSchema: {
        number: { type: 'text', label: 'Number/Stat', default: '50+' },
        label: { type: 'text', label: 'Label', default: 'Years in Business' }
      }
    }
  }
}, null, 2));

fs.writeFileSync(path.join(compRoot, 'plumbing-order-checklist/defaults.json'), JSON.stringify({
  sectionTitle: 'When Plumbing Disrupts Your Home, We Restore Order',
  headline: 'Your plumbing works in the background until the minute it stops.',
  desc1: 'You turn a handle expecting water. You flush expecting nothing else to happen. You walk past the laundry room without thinking about what\'s under the sink. When one of those automatic assumptions stops holding, the rest of the household adjusts around it, and you start running a quiet inventory of what else might be about to go wrong.',
  desc2: 'Princeton Air\'s licensed plumbers walk into that moment with a plan. We evaluate the whole system, not just the obvious failure, name the cause accurately, and put forward a scope that makes sense for your household and your budget. Five decades of serving New Jersey homeowners has taught us that the plumbing call that earns the next one is the one that\'s done properly the first time.',
  stats: [
    { _id: 'stat-1', number: '50+', label: 'Years in Business' },
    { _id: 'stat-2', number: '700', label: 'Skilled Employees' },
    { _id: 'stat-3', number: '24/7', label: 'Emergency Service' },
    { _id: 'stat-4', number: '500', label: 'Trucks on the Road' }
  ]
}, null, 2));

fs.writeFileSync(path.join(compRoot, 'plumbing-order-checklist/template.html'), `<section class="plumbing-order-section section-padding bg-light-gray">
  <div class="container">
    <h2 class="section-title text-center pb-2">{{{sectionTitle}}}</h2>
    <div class="row align-items-center">
      <div class="col-lg-6 col-12">
        <div>
          <h3 class="plumbing-order-title section-subtitle">{{headline}}</h3>
          <p class="plumbing-order-text section-desc">{{desc1}}</p>
          <p class="plumbing-order-text section-desc">{{desc2}}</p>
        </div>
      </div>
      <div class="col-lg-6 col-12">
        <div class="plumbing-stats-card">
          {{#each stats}}
          <div class="plumbing-stat-item">
            <div class="plumbing-stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
            </div>
            <div class="plumbing-stat-content">
              <span class="plumbing-stat-number">{{this.number}}</span>
              <span class="plumbing-stat-label">{{this.label}}</span>
            </div>
          </div>
          {{/each}}
        </div>
      </div>
    </div>
  </div>
</section>`);

fs.writeFileSync(path.join(compRoot, 'plumbing-order-checklist/style.css'), `/* Scoped Layer 2 styles for plumbing-order-checklist */
.plumbing-stats-card { background: #fff; padding: 32px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.plumbing-stat-item { display: flex; align-items: center; gap: 16px; }
.plumbing-stat-icon { width: 44px; height: 44px; background: #A01922; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
.plumbing-stat-icon svg { width: 22px; height: 22px; }
.plumbing-stat-number { font-size: 28px; font-weight: 800; color: #172033; display: block; line-height: 1.1; }
.plumbing-stat-label { font-size: 13px; color: #5b6472; font-weight: 500; }
`);

// 4. Plumbing Services Grid (Sections 4 & 15)
ensureDir(path.join(compRoot, 'plumbing-services-grid'));
fs.writeFileSync(path.join(compRoot, 'plumbing-services-grid/schema.json'), JSON.stringify({
  name: 'Plumbing Services Grid',
  category: 'Services',
  fields: {
    cards: {
      type: 'array',
      label: 'Service Cards',
      itemLabel: 'Service Card',
      itemSchema: {
        title: { type: 'text', label: 'Service Title', default: 'Plumbing Installation' },
        link: { type: 'text', label: 'Link URL', default: '#' }
      }
    }
  }
}, null, 2));

fs.writeFileSync(path.join(compRoot, 'plumbing-services-grid/defaults.json'), JSON.stringify({
  cards: [
    { _id: 'srv-1', title: 'Plumbing', link: '#' },
    { _id: 'srv-2', title: 'Plumbing Installation', link: '#' },
    { _id: 'srv-3', title: 'Plumbing Repair', link: '#' },
    { _id: 'srv-4', title: 'Commercial', link: '#' }
  ]
}, null, 2));

fs.writeFileSync(path.join(compRoot, 'plumbing-services-grid/template.html'), `<section class="plumbing-services-section" aria-label="Plumbing services">
  <div class="plumbing-grid">
    {{#each cards}}
    <a href="{{this.link}}" class="card-body card-body-center" aria-label="{{this.title}}">
      <span class="plumbing-card-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </span>
      <div class="plumbing-card-content">
        <h3 class="plumbing-card-title">{{this.title}}</h3>
      </div>
    </a>
    {{/each}}
  </div>
</section>`);

fs.writeFileSync(path.join(compRoot, 'plumbing-services-grid/style.css'), `/* Scoped Layer 2 styles for plumbing-services-grid */
.plumbing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; max-width: 1200px; margin: 0 auto; padding: 24px 16px; }
.card-body-center { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; transition: transform 0.2s, box-shadow 0.2s; }
.card-body-center:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); border-color: #A01922; }
.plumbing-card-icon svg { width: 32px; height: 32px; fill: none; stroke: #A01922; stroke-width: 2; }
.plumbing-card-title { font-size: 18px; font-weight: 700; color: #172033; margin: 0; }
`);

// 5. Plumbing Care Video Section (Section 5)
ensureDir(path.join(compRoot, 'plumbing-care-video'));
fs.writeFileSync(path.join(compRoot, 'plumbing-care-video/schema.json'), JSON.stringify({
  name: 'Plumbing Care Video Section',
  category: 'Media',
  fields: {
    heading: { type: 'text', label: 'Section Heading', default: 'Plumbing Care That Matches the Character of Your Home' },
    subheading: { type: 'text', label: 'Subheading', default: 'The right plumbing approach depends on what\'s already there.' },
    image: { type: 'image', label: 'Video Thumbnail / Image', default: { src: '/assets/img/2-plumbing-care.webp', alt: 'Plumbing service video placeholder' } },
    desc1: { type: 'textarea', label: 'Paragraph 1', default: 'Every home has its own story, its own age, and its own plumbing system characteristics. We diagnose issues with careful attention to finished spaces.' },
    desc2: { type: 'textarea', label: 'Paragraph 2', default: 'Whether it\'s modern fixtures or historic pipes, our master technicians know how to preserve your home while restoring optimal water flow and reliability.' },
    phone: { type: 'text', label: 'Phone Number', default: '(123) 456-7890' },
    chatText: { type: 'text', label: 'Chat Button Text', default: 'Chat with us' }
  }
}, null, 2));

fs.writeFileSync(path.join(compRoot, 'plumbing-care-video/defaults.json'), JSON.stringify({
  heading: 'Plumbing Care That Matches the Character of Your Home',
  subheading: 'The right plumbing approach depends on what\'s already there.',
  image: { src: '/assets/img/2-plumbing-care.webp', alt: 'Plumbing service video placeholder' },
  desc1: 'Every home has its own story, its own age, and its own plumbing system characteristics. We diagnose issues with careful attention to finished spaces.',
  desc2: 'Whether it\'s modern fixtures or historic pipes, our master technicians know how to preserve your home while restoring optimal water flow and reliability.',
  phone: '(123) 456-7890',
  chatText: 'Chat with us'
}, null, 2));

fs.writeFileSync(path.join(compRoot, 'plumbing-care-video/template.html'), `<section class="plumbing-care-section section-padding bg-light-gray py-lg-6">
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-10 col-xl-9 text-center">
        <h2 class="plumbing-care-heading section-title">{{heading}}</h2>
        <p class="plumbing-care-subheading section-subtitle">{{subheading}}</p>
        <div class="spacer-50"></div>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col-lg-12">
        <div class="video-card">
          <img src="{{image.src}}" alt="{{image.alt}}" class="video-card-img" width="1280" height="720" loading="lazy">
          <div class="play-button-wrapper">
            <button class="play-button" aria-label="Play video" onclick="openQuotePopup()">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <polygon points="6,3 20,12 6,21" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col-lg-10 col-xl-9 text-center">
        <div class="spacer-40"></div>
        {{#if desc1}}<p class="plumbing-care-text">{{desc1}}</p>{{/if}}
        {{#if desc2}}<p class="plumbing-care-text">{{desc2}}</p>{{/if}}
        <div class="button-group justify-content-center mt-4">
          <a href="tel:{{phone}}" class="btn-outline-phone">{{phone}}</a>
          <a href="#chat" onclick="openQuotePopup()" class="btn-filled-chat">{{chatText}}</a>
        </div>
      </div>
    </div>
  </div>
</section>`);

fs.writeFileSync(path.join(compRoot, 'plumbing-care-video/style.css'), `/* Scoped Layer 2 styles for plumbing-care-video */
.video-card { position: relative; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.12); }
.video-card-img { width: 100%; height: auto; display: block; object-fit: cover; }
.play-button-wrapper { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
.play-button { width: 72px; height: 72px; border-radius: 50%; background: #A01922; border: none; color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(160,25,34,0.4); }
.play-button svg { width: 28px; height: 28px; fill: #fff; }
`);

// 6. Trust Bar (Section 6)
ensureDir(path.join(compRoot, 'trust-bar'));
fs.writeFileSync(path.join(compRoot, 'trust-bar/schema.json'), JSON.stringify({
  name: 'Trust Rating & Social Bar',
  category: 'Social Proof',
  fields: {
    rating: { type: 'text', label: 'Rating Score', default: '4.7' },
    reviewText: { type: 'text', label: 'Review Details', default: 'Based on 6634 reviews powered by Google' }
  }
}, null, 2));

fs.writeFileSync(path.join(compRoot, 'trust-bar/defaults.json'), JSON.stringify({
  rating: '4.7',
  reviewText: 'Based on 6634 reviews powered by Google'
}, null, 2));

fs.writeFileSync(path.join(compRoot, 'trust-bar/template.html'), `<section class="trust-bar section-padding" aria-label="Trust bar with reviews and social links">
  <div class="container">
    <div class="row align-items-center justify-content-between w-100 trust-bar-row">
      <div class="col-auto">
        <div class="trust-left">
          <span class="trust-rating">{{rating}}</span>
          <span class="trust-stars" role="img" aria-label="Rated 4.7 out of 5 stars">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="#f59e0b"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="#f59e0b"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="#f59e0b"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="#f59e0b"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="#f59e0b"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </span>
          <span class="trust-review">{{reviewText}}</span>
        </div>
      </div>
      <div class="col-auto">
        <div class="trust-right">
          <a href="#" class="trust-icon-btn" aria-label="Social Link 1">★</a>
          <a href="#" class="trust-icon-btn" aria-label="Social Link 2">♦</a>
          <a href="#" class="trust-icon-btn" aria-label="Social Link 3">●</a>
        </div>
      </div>
    </div>
  </div>
</section>`);

fs.writeFileSync(path.join(compRoot, 'trust-bar/style.css'), `/* Scoped Layer 2 styles for trust-bar */
.trust-bar { background: #fff; border-bottom: 1px solid #ECECEC; padding: 18px 0; }
.trust-left { display: flex; align-items: center; gap: 14px; }
.trust-rating { font-size: 24px; font-weight: 800; color: #172033; }
.trust-review { font-size: 14px; color: #5b6472; }
.trust-right { display: flex; gap: 10px; }
.trust-icon-btn { width: 36px; height: 36px; border-radius: 50%; background: #f8fafc; border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: center; color: #475569; text-decoration: none; }
`);

// 7. Process Steps Grid (Section 8)
ensureDir(path.join(compRoot, 'process-steps-grid'));
fs.writeFileSync(path.join(compRoot, 'process-steps-grid/schema.json'), JSON.stringify({
  name: 'Process Steps Grid',
  category: 'Process',
  fields: {
    title: { type: 'text', label: 'Section Heading', default: 'Three Simple Steps to Reliable Plumbing' },
    steps: {
      type: 'array',
      label: 'Steps',
      itemLabel: 'Step',
      itemSchema: {
        number: { type: 'text', label: 'Step Number', default: '01' },
        title: { type: 'text', label: 'Step Title', default: 'Contact Princeton Air' },
        desc: { type: 'textarea', label: 'Step Description', default: 'Reach out by phone or online. Speak directly with a local dispatch coordinator.' }
      }
    },
    image: { type: 'image', label: 'Side Image', default: { src: '/assets/img/4-three-simple-steps.webp', alt: 'Three Simple Steps' } }
  }
}, null, 2));

fs.writeFileSync(path.join(compRoot, 'process-steps-grid/defaults.json'), JSON.stringify({
  title: 'Three Simple Steps to Reliable Plumbing',
  steps: [
    { _id: 'step-1', number: '01', title: 'Contact Princeton Air', desc: 'Reach out by phone or book online. You speak directly with our team — no runaround, no endless menus.' },
    { _id: 'step-2', number: '02', title: 'Receive Clear Answers', desc: 'Our licensed plumber arrives on schedule, thoroughly inspects the issue, and provides flat-rate pricing before starting.' },
    { _id: 'step-3', number: '03', title: 'Precise Work Completed', desc: 'We complete the repair or installation according to state plumbing code, verify operation, and leave your home spotless.' }
  ],
  image: { src: '/assets/img/4-three-simple-steps.webp', alt: 'Three Simple Steps' }
}, null, 2));

fs.writeFileSync(path.join(compRoot, 'process-steps-grid/template.html'), `<section class="steps-section bg-light-gray section-padding py-lg-6">
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-10 text-center mb-5">
        <h2 class="section-title">{{title}}</h2>
      </div>
    </div>
    <div class="row align-items-center">
      <div class="col-lg-7">
        <div class="steps-list">
          {{#each steps}}
          <div class="step-card mb-4" style="background:#fff; padding:24px; border-radius:12px; box-shadow:0 2px 10px rgba(0,0,0,0.04); display:flex; gap:20px;">
            <div class="step-num" style="font-size:32px; font-weight:800; color:#A01922; line-height:1;">{{this.number}}</div>
            <div>
              <h3 style="font-size:20px; font-weight:700; margin:0 0 8px;">{{this.title}}</h3>
              <p style="margin:0; color:#5b6472; font-size:15px;">{{this.desc}}</p>
            </div>
          </div>
          {{/each}}
        </div>
      </div>
      <div class="col-lg-5">
        <div class="steps-image" style="border-radius:16px; overflow:hidden; box-shadow:0 8px 24px rgba(0,0,0,0.08);">
          <img src="{{image.src}}" alt="{{image.alt}}" style="width:100%; height:auto; display:block;">
        </div>
      </div>
    </div>
  </div>
</section>`);

fs.writeFileSync(path.join(compRoot, 'process-steps-grid/style.css'), `/* Scoped Layer 2 styles for process-steps-grid */
.steps-section { background-color: #f8fafc; }
`);

// 8. Dual CTA Banner (Sections 9 & 17)
ensureDir(path.join(compRoot, 'cta-banner-dual'));
fs.writeFileSync(path.join(compRoot, 'cta-banner-dual/schema.json'), JSON.stringify({
  name: 'Dual CTA Contact Banner',
  category: 'Call to Action',
  fields: {
    phoneTitle: { type: 'text', label: 'Phone Card Title', default: 'Ready to talk to a home services specialist?' },
    phoneText: { type: 'text', label: 'Phone Number', default: '(123) 456-7890' },
    chatTitle: { type: 'text', label: 'Chat Card Title', default: 'Need Immediate Help?' },
    chatButtonText: { type: 'text', label: 'Chat Button Text', default: 'Chat with us' }
  }
}, null, 2));

fs.writeFileSync(path.join(compRoot, 'cta-banner-dual/defaults.json'), JSON.stringify({
  phoneTitle: 'Ready to talk to a home services specialist?',
  phoneText: '(123) 456-7890',
  chatTitle: 'Need Immediate Help?',
  chatButtonText: 'Chat with us'
}, null, 2));

fs.writeFileSync(path.join(compRoot, 'cta-banner-dual/template.html'), `<section class="cta-banner-section">
  <div class="container">
    <div class="row g-4">
      <div class="col-md-6">
        <div class="cta-banner-box" style="background:#172033; color:#fff; padding:32px; border-radius:14px; text-align:center;">
          <h3 style="color:#fff; font-size:22px; margin-bottom:12px;">{{phoneTitle}}</h3>
          <a href="tel:{{phoneText}}" class="btn-outline-phone" style="border:1px solid #fff; color:#fff; padding:12px 24px; border-radius:30px; display:inline-block; font-weight:700;">{{phoneText}}</a>
        </div>
      </div>
      <div class="col-md-6">
        <div class="cta-banner-box" style="background:#A01922; color:#fff; padding:32px; border-radius:14px; text-align:center;">
          <h3 style="color:#fff; font-size:22px; margin-bottom:12px;">{{chatTitle}}</h3>
          <a href="#chat" onclick="openQuotePopup()" class="btn-filled-chat" style="background:#fff; color:#A01922; padding:12px 24px; border-radius:30px; display:inline-block; font-weight:700;">{{chatButtonText}}</a>
        </div>
      </div>
    </div>
  </div>
</section>`);

fs.writeFileSync(path.join(compRoot, 'cta-banner-dual/style.css'), `/* Scoped Layer 2 styles for cta-banner-dual */
.cta-banner-section { padding: 40px 0; }
`);

// 9. Coupon Grid (Section 11)
ensureDir(path.join(compRoot, 'coupon-grid'));
fs.writeFileSync(path.join(compRoot, 'coupon-grid/schema.json'), JSON.stringify({
  name: 'Promotional Coupons Grid',
  category: 'Promotions',
  fields: {
    heading: { type: 'text', label: 'Section Heading', default: 'Plumbing Specials & Discounts' },
    coupons: {
      type: 'array',
      label: 'Coupons',
      itemLabel: 'Coupon',
      itemSchema: {
        discount: { type: 'text', label: 'Discount Amount', default: '$50 OFF' },
        title: { type: 'text', label: 'Service Offer', default: 'Water Heater Installation' },
        terms: { type: 'text', label: 'Terms & Conditions', default: 'Valid on complete system replacement. Cannot combine.' },
        expiry: { type: 'text', label: 'Expiration Text', default: 'Expires 11/30/2026' }
      }
    }
  }
}, null, 2));

fs.writeFileSync(path.join(compRoot, 'coupon-grid/defaults.json'), JSON.stringify({
  heading: 'Plumbing Specials & Discounts',
  coupons: [
    { _id: 'c-1', discount: '$50 OFF', title: 'Sink/Shower Unclog (Branch Line)', terms: 'Cannot be combined with other offers.', expiry: 'Expires 11/30/2026' },
    { _id: 'c-2', discount: '$75 OFF', title: 'Drain Cleaning Service', terms: 'Valid for standard residential lines.', expiry: 'Expires 11/30/2026' },
    { _id: 'c-3', discount: '$250 OFF', title: 'Water Heater Installation', terms: 'Applies to tankless or hybrid units.', expiry: 'Expires 11/30/2026' }
  ]
}, null, 2));

fs.writeFileSync(path.join(compRoot, 'coupon-grid/template.html'), `<section class="coupon-section py-lg-6">
  <div class="container">
    <div class="text-center mb-5">
      <h2 class="section-title">{{heading}}</h2>
    </div>
    <div class="row g-4">
      {{#each coupons}}
      <div class="col-md-4">
        <div class="coupon-card" style="border:2px dashed #A01922; border-radius:12px; padding:24px; background:#fff; text-align:center;">
          <div class="coupon-discount" style="font-size:32px; font-weight:800; color:#A01922;">{{this.discount}}</div>
          <h3 style="font-size:18px; margin:12px 0 8px;">{{this.title}}</h3>
          <p style="font-size:13px; color:#64748b; margin-bottom:16px;">{{this.terms}}</p>
          <div style="font-size:12px; font-weight:600; color:#dc2626; margin-bottom:16px;">{{this.expiry}}</div>
          <button type="button" onclick="openRedeemPopup()" class="btn-filled-chat coupon-btn" style="background:#A01922; color:#fff; border:none; padding:10px 20px; border-radius:30px; cursor:pointer;">Claim Coupon</button>
        </div>
      </div>
      {{/each}}
    </div>
  </div>
</section>`);

fs.writeFileSync(path.join(compRoot, 'coupon-grid/style.css'), `/* Scoped Layer 2 styles for coupon-grid */
.coupon-section { background: #fafafa; padding: 48px 0; }
`);

// 10. Certifications Marquee (Section 20)
ensureDir(path.join(compRoot, 'certifications-marquee'));
fs.writeFileSync(path.join(compRoot, 'certifications-marquee/schema.json'), JSON.stringify({
  name: 'Certifications & Partners Marquee',
  category: 'Trust Badges',
  fields: {
    heading: { type: 'text', label: 'Optional Heading', default: 'Trusted & Certified Excellence' }
  }
}, null, 2));

fs.writeFileSync(path.join(compRoot, 'certifications-marquee/defaults.json'), JSON.stringify({
  heading: 'Trusted & Certified Excellence'
}, null, 2));

fs.writeFileSync(path.join(compRoot, 'certifications-marquee/template.html'), `<section class="gallery-slider-wrapper section-padding">
  <div class="container">
    {{#if heading}}<h3 class="text-center mb-4" style="font-size:20px; color:#64748b;">{{heading}}</h3>{{/if}}
    <div class="gallery-slider-track" style="display:flex; justify-content:center; align-items:center; gap:36px; flex-wrap:wrap;">
      <div class="gallery-slider-card"><img src="/assets/img/nate-logo.webp" alt="NATE Certified" width="90" height="90" style="object-fit:contain;"></div>
      <div class="gallery-slider-card"><img src="/assets/img/nat-grid-logo.webp" alt="National Grid" width="90" height="90" style="object-fit:contain;"></div>
      <div class="gallery-slider-card"><img src="/assets/img/acca-logo.webp" alt="ACCA" width="90" height="90" style="object-fit:contain;"></div>
      <div class="gallery-slider-card"><img src="/assets/img/phcc-logo.webp" alt="PHCC" width="90" height="90" style="object-fit:contain;"></div>
      <div class="gallery-slider-card"><img src="/assets/img/bbb-logo.webp" alt="BBB A+ Rating" width="90" height="90" style="object-fit:contain;"></div>
      <div class="gallery-slider-card"><img src="/assets/img/abc-logo.webp" alt="ABC" width="90" height="90" style="object-fit:contain;"></div>
    </div>
  </div>
</section>`);

fs.writeFileSync(path.join(compRoot, 'certifications-marquee/style.css'), `/* Scoped Layer 2 styles for certifications-marquee */
.gallery-slider-wrapper { background: #fff; padding: 36px 0; border-top: 1px solid #ECECEC; }
`);

console.log("Components successfully scaffolded in theme/components!");
