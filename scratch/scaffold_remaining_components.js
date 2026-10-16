const fs = require('fs');
const path = require('path');

const compRoot = path.join(process.cwd(), 'workspaces/test-workspace-001/theme/components');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// 1. Testimonial Carousel (Section 10)
ensureDir(path.join(compRoot, 'testimonial-carousel'));
fs.writeFileSync(path.join(compRoot, 'testimonial-carousel/schema.json'), JSON.stringify({
  name: 'Testimonials Carousel',
  category: 'Social Proof',
  fields: {
    title: { type: 'text', label: 'Section Title', default: 'What Our Customers Are Saying' },
    subtitle: { type: 'text', label: 'Subtitle', default: '100% Satisfaction Guarantee' },
    slides: {
      type: 'array',
      label: 'Review Slides',
      itemLabel: 'Slide (3 reviews)',
      itemSchema: {
        reviewer1_name: { type: 'text', label: 'Reviewer 1 Name', default: 'Steven Raffuel' },
        reviewer1_text: { type: 'textarea', label: 'Reviewer 1 Quote', default: 'A/C went down unexpectedly in the middle of humid New Jersey summer. Princeton Air was out in less than 24 hours.' },
        reviewer2_name: { type: 'text', label: 'Reviewer 2 Name', default: 'Janet Grisi' },
        reviewer2_text: { type: 'textarea', label: 'Reviewer 2 Quote', default: 'Princeton Air provided prompt and honest service for our water heater replacement. Highly recommend.' }
      }
    }
  }
}, null, 2));

fs.writeFileSync(path.join(compRoot, 'testimonial-carousel/defaults.json'), JSON.stringify({
  title: 'What Our Customers Are Saying',
  subtitle: '100% Satisfaction Guarantee',
  slides: [
    {
      _id: 'sl-1',
      reviewer1_name: 'Steven Raffuel',
      reviewer1_text: 'A/C went down unexpectedly in the middle of humid New Jersey summer. Princeton Air was out in less than 24 hours and solved the problem with zero stress.',
      reviewer2_name: 'Janet Grisi',
      reviewer2_text: 'Fast, professional, and very thorough. They explained every detail before doing the work and left our home clean.'
    }
  ]
}, null, 2));

fs.writeFileSync(path.join(compRoot, 'testimonial-carousel/template.html'), `<section class="testimonial-section bg-light-gray section-padding" aria-label="Customer testimonials">
  <div class="container">
    <div class="testimonial-header text-center mb-5">
      <h2 class="testimonial-heading section-title">{{title}}</h2>
      <p class="testimonial-subtitle section-subtitle">{{subtitle}}</p>
    </div>
    <div class="carousel-wrapper" id="testimonialCarousel">
      <div class="carousel-track" id="carouselTrack" style="display:flex; overflow-x:auto; gap:24px; padding-bottom:16px;">
        {{#each slides}}
        <div class="carousel-slide" style="flex:0 0 100%; display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:24px;">
          <div class="card-body" style="background:#fff; padding:24px; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.05);">
            <div style="font-weight:700; font-size:16px; margin-bottom:8px;">{{this.reviewer1_name}}</div>
            <div style="color:#f59e0b; margin-bottom:12px;">★★★★★</div>
            <p style="color:#475569; font-size:14px; margin:0;">{{this.reviewer1_text}}</p>
          </div>
          <div class="card-body" style="background:#fff; padding:24px; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.05);">
            <div style="font-weight:700; font-size:16px; margin-bottom:8px;">{{this.reviewer2_name}}</div>
            <div style="color:#f59e0b; margin-bottom:12px;">★★★★★</div>
            <p style="color:#475569; font-size:14px; margin:0;">{{this.reviewer2_text}}</p>
          </div>
        </div>
        {{/each}}
      </div>
    </div>
  </div>
</section>`);

fs.writeFileSync(path.join(compRoot, 'testimonial-carousel/style.css'), `/* Scoped Layer 2 styles for testimonial-carousel */
.testimonial-section { background: #f8fafc; }
`);

// 2. Accordion Map Section (Section 7)
ensureDir(path.join(compRoot, 'accordion-map-section'));
fs.writeFileSync(path.join(compRoot, 'accordion-map-section/schema.json'), JSON.stringify({
  name: 'NJ Service Areas & Accordion',
  category: 'Locations',
  fields: {
    heading: { type: 'text', label: 'Section Heading', default: 'New Jersey Chooses Princeton Air' },
    items: {
      type: 'array',
      label: 'Feature Accordion Items',
      itemLabel: 'Accordion Item',
      itemSchema: {
        number: { type: 'text', label: 'Item Number', default: '1.' },
        title: { type: 'text', label: 'Item Title', default: 'One Trusted Team for the Entire Home' }
      }
    },
    buttonText: { type: 'text', label: 'Map Button Text', default: 'New Jersey Locations' }
  }
}, null, 2));

fs.writeFileSync(path.join(compRoot, 'accordion-map-section/defaults.json'), JSON.stringify({
  heading: 'New Jersey Chooses Princeton Air',
  items: [
    { _id: 'nj-1', number: '1.', title: 'One Trusted Team for the Entire Home' },
    { _id: 'nj-2', number: '2.', title: 'Thorough, Code-Compliant Work' },
    { _id: 'nj-3', number: '3.', title: 'Flexible Financing Options' },
    { _id: 'nj-4', number: '4.', title: 'Solutions Made to Last' },
    { _id: 'nj-5', number: '5.', title: 'Respect for Your Home & Privacy' },
    { _id: 'nj-6', number: '6.', title: 'Responsive Emergency Plumbing Service' }
  ],
  buttonText: 'New Jersey Locations'
}, null, 2));

fs.writeFileSync(path.join(compRoot, 'accordion-map-section/template.html'), `<section class="nj-section section-padding py-lg-6">
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-10 text-center mb-4">
        <h2 class="nj-heading section-title">{{heading}}</h2>
      </div>
    </div>
    <div class="row align-items-center gx-5">
      <div class="col-lg-8">
        <ul class="nj-list" style="list-style:none; padding:0; display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:16px;">
          {{#each items}}
          <li style="background:#fff; border:1px solid #e2e8f0; border-radius:10px; padding:16px 20px;">
            <a href="#" class="nj-list-item" style="display:flex; align-items:center; justify-content:space-between; text-decoration:none; color:#172033; font-weight:600;">
              <span><span class="nj-number" style="color:#A01922; margin-right:8px;">{{this.number}}</span> {{this.title}}</span>
              <span style="color:#A01922; font-size:18px;">+</span>
            </a>
          </li>
          {{/each}}
        </ul>
      </div>
      <div class="col-lg-4 text-center">
        <div class="nj-card" style="background:#172033; color:#fff; padding:32px 24px; border-radius:14px;">
          <h3 style="color:#fff; font-size:20px; margin-bottom:16px;">Service Area Coverage</h3>
          <p style="font-size:14px; color:#cbd5e1; margin-bottom:24px;">Proudly serving Mercer, Middlesex, Somerset, and surrounding Central NJ communities.</p>
          <a href="#locations" onclick="openQuotePopup()" class="btn-filled-chat location-popup" style="background:#A01922; color:#fff; padding:12px 24px; border-radius:30px; display:inline-block; font-weight:700;">{{buttonText}}</a>
        </div>
      </div>
    </div>
  </div>
</section>`);

fs.writeFileSync(path.join(compRoot, 'accordion-map-section/style.css'), `/* Scoped Layer 2 styles for accordion-map-section */
.nj-section { background: #fff; padding: 48px 0; }
`);

// 3. Financing CTA Section (Section 12)
ensureDir(path.join(compRoot, 'financing-cta'));
fs.writeFileSync(path.join(compRoot, 'financing-cta/schema.json'), JSON.stringify({
  name: 'Financing Pre-Approval Banner',
  category: 'Call to Action',
  fields: {
    title: { type: 'text', label: 'Banner Title', default: 'Get Pre-Approved Financing' },
    desc: { type: 'textarea', label: 'Details', default: 'Affordable monthly payment plans with zero penalty for early payoff. Quick, secure online application.' },
    buttonText: { type: 'text', label: 'Button Label', default: 'Apply For Financing' }
  }
}, null, 2));

fs.writeFileSync(path.join(compRoot, 'financing-cta/defaults.json'), JSON.stringify({
  title: 'Get Pre-Approved Financing',
  desc: 'Affordable monthly payment plans with zero penalty for early payoff. Quick, secure online application.',
  buttonText: 'Apply For Financing'
}, null, 2));

fs.writeFileSync(path.join(compRoot, 'financing-cta/template.html'), `<section class="financing-cta-section bg-light-gray" style="padding:48px 0;">
  <div class="container">
    <div style="background:#172033; color:#fff; border-radius:16px; padding:40px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:24px;">
      <div style="max-width:650px;">
        <h2 style="color:#fff; font-size:28px; margin:0 0 10px;">{{title}}</h2>
        <p style="color:#94a3b8; margin:0; font-size:16px;">{{desc}}</p>
      </div>
      <div>
        <a href="#financing" onclick="openQuotePopup()" class="btn-filled-chat" style="background:#A01922; color:#fff; padding:14px 28px; border-radius:30px; font-weight:700; text-decoration:none; display:inline-block;">{{buttonText}}</a>
      </div>
    </div>
  </div>
</section>`);

fs.writeFileSync(path.join(compRoot, 'financing-cta/style.css'), `/* Scoped Layer 2 styles for financing-cta */
.financing-cta-section { background: #f8fafc; }
`);

// 4. Comfort Club Perks (Section 13)
ensureDir(path.join(compRoot, 'comfort-club-perks'));
fs.writeFileSync(path.join(compRoot, 'comfort-club-perks/schema.json'), JSON.stringify({
  name: 'Home Comfort Club Perks',
  category: 'Features',
  fields: {
    title: { type: 'text', label: 'Title', default: 'Year-Round Confidence With the Home Comfort Club' },
    badge: { type: 'text', label: 'Badge Text', default: 'THE HOME COMFORT CLUB' },
    desc: { type: 'textarea', label: 'Description', default: 'Regular maintenance protects your plumbing investments and avoids high-cost emergency dispatch fees.' },
    perks: {
      type: 'array',
      label: 'Club Perks',
      itemLabel: 'Perk Item',
      itemSchema: {
        text: { type: 'text', label: 'Perk Title', default: 'Priority Emergency Dispatch' }
      }
    },
    image: { type: 'image', label: 'Side Image', default: { src: '/assets/img/the-home-comfort-club-new.webp', alt: 'Home Comfort Club' } }
  }
}, null, 2));

fs.writeFileSync(path.join(compRoot, 'comfort-club-perks/defaults.json'), JSON.stringify({
  title: 'Year-Round Confidence With the Home Comfort Club',
  badge: 'THE HOME COMFORT CLUB',
  desc: 'Regular maintenance protects your plumbing investments, maintains manufacturer warranties, and avoids high-cost emergency dispatch fees.',
  perks: [
    { _id: 'p-1', text: '15% Discount on all plumbing and drain service repairs' },
    { _id: 'p-2', text: 'Priority scheduling ahead of non-members during peak freezes' },
    { _id: 'p-3', text: 'Comprehensive annual whole-house plumbing inspection' },
    { _id: 'p-4', text: 'Waived emergency overtime diagnostic charges' }
  ],
  image: { src: '/assets/img/the-home-comfort-club-new.webp', alt: 'Home Comfort Club' }
}, null, 2));

fs.writeFileSync(path.join(compRoot, 'comfort-club-perks/template.html'), `<section class="comfort-club-section section-padding py-lg-6">
  <div class="container">
    <div class="row align-items-center">
      <div class="col-lg-6">
        <div style="font-size:12px; font-weight:800; color:#A01922; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:12px;">{{badge}}</div>
        <h2 class="section-title mb-3">{{title}}</h2>
        <p style="color:#5b6472; font-size:16px; margin-bottom:24px;">{{desc}}</p>
        <ul style="list-style:none; padding:0; margin:0 0 32px;">
          {{#each perks}}
          <li style="display:flex; align-items:center; gap:12px; margin-bottom:12px; font-weight:500;">
            <span style="color:#10b981; font-weight:800;">✓</span>
            <span>{{this.text}}</span>
          </li>
          {{/each}}
        </ul>
        <a href="#join-club" onclick="openQuotePopup()" class="btn-filled-chat" style="background:#A01922; color:#fff; padding:12px 28px; border-radius:30px; font-weight:700; text-decoration:none;">Join The Club</a>
      </div>
      <div class="col-lg-6">
        <div style="border-radius:16px; overflow:hidden; box-shadow:0 8px 30px rgba(0,0,0,0.08);">
          <img src="{{image.src}}" alt="{{image.alt}}" style="width:100%; height:auto; display:block;">
        </div>
      </div>
    </div>
  </div>
</section>`);

fs.writeFileSync(path.join(compRoot, 'comfort-club-perks/style.css'), `/* Scoped Layer 2 styles for comfort-club-perks */
.comfort-club-section { background:#fff; padding:48px 0; }
`);

// 5. Plumbing Spotlight Hero (Section 14)
ensureDir(path.join(compRoot, 'plumbing-spotlight-hero'));
fs.writeFileSync(path.join(compRoot, 'plumbing-spotlight-hero/schema.json'), JSON.stringify({
  name: 'Plumbing Spotlight Banner',
  category: 'Hero',
  fields: {
    title: { type: 'text', label: 'Spotlight Title', default: 'Our New Jersey Plumbing Services' },
    desc: { type: 'textarea', label: 'Description', default: 'From precision leak detection to whole-home repiping and high-efficiency water heater conversions, our master technicians ensure lasting comfort.' },
    image: { type: 'image', label: 'Image', default: { src: '/assets/img/plumbing-hero.webp', alt: 'New Jersey Plumbing' } }
  }
}, null, 2));

fs.writeFileSync(path.join(compRoot, 'plumbing-spotlight-hero/defaults.json'), JSON.stringify({
  title: 'Our New Jersey Plumbing Services',
  desc: 'From precision leak detection to whole-home repiping and high-efficiency water heater conversions, our master technicians ensure lasting comfort.',
  image: { src: '/assets/img/plumbing-hero.webp', alt: 'New Jersey Plumbing' }
}, null, 2));

fs.writeFileSync(path.join(compRoot, 'plumbing-spotlight-hero/template.html'), `<section class="plumbing-hero section-padding bg-light-gray" style="padding:48px 0;">
  <div class="container">
    <div class="row align-items-center">
      <div class="col-lg-6">
        <h2 class="section-title mb-3">{{title}}</h2>
        <p style="color:#5b6472; font-size:16px; line-height:1.6;">{{desc}}</p>
      </div>
      <div class="col-lg-6">
        <div style="border-radius:14px; overflow:hidden; box-shadow:0 6px 20px rgba(0,0,0,0.08);">
          <img src="{{image.src}}" alt="{{image.alt}}" style="width:100%; height:auto; display:block;">
        </div>
      </div>
    </div>
  </div>
</section>`);

fs.writeFileSync(path.join(compRoot, 'plumbing-spotlight-hero/style.css'), `/* Scoped Layer 2 styles for plumbing-spotlight-hero */
.plumbing-hero { background:#f8fafc; }
`);

// 6. Services Detailed Grid (Section 16)
ensureDir(path.join(compRoot, 'services-detailed-grid'));
fs.writeFileSync(path.join(compRoot, 'services-detailed-grid/schema.json'), JSON.stringify({
  name: 'Detailed Services Grid (6 Cards)',
  category: 'Services',
  fields: {
    title: { type: 'text', label: 'Section Title', default: 'Comprehensive Residential Plumbing Services' },
    cards: {
      type: 'array',
      label: 'Service Cards',
      itemLabel: 'Service Card',
      itemSchema: {
        title: { type: 'text', label: 'Card Title', default: 'Emergency Plumbing' },
        desc: { type: 'textarea', label: 'Summary', default: 'Immediate response when pipes burst or basements flood.' }
      }
    }
  }
}, null, 2));

fs.writeFileSync(path.join(compRoot, 'services-detailed-grid/defaults.json'), JSON.stringify({
  title: 'Comprehensive Residential Plumbing Services',
  cards: [
    { _id: 'sc-1', title: 'Emergency Plumbing', desc: 'Fast local response when pipes freeze, burst, or overflow.' },
    { _id: 'sc-2', title: 'Pipe Repair & Repiping', desc: 'Modern PEX and copper plumbing upgrades with minimal wall cutting.' },
    { _id: 'sc-3', title: 'Drain Cleaning & Hydro-Jetting', desc: 'Camera video inspection and high-pressure root clearing.' },
    { _id: 'sc-4', title: 'Water Heaters', desc: 'Traditional tank diagnostics, element replacement, and routine flushing.' },
    { _id: 'sc-5', title: 'Tankless Water Heaters', desc: 'Endless on-demand hot water with high-efficiency energy rebates.' },
    { _id: 'sc-6', title: 'Sewer Line Services', desc: 'Trenchless sewer repairs and main line replacements.' }
  ]
}, null, 2));

fs.writeFileSync(path.join(compRoot, 'services-detailed-grid/template.html'), `<section class="services-section section-padding bg-light-gray" style="padding:48px 0;">
  <div class="container">
    <div class="text-center mb-5">
      <h2 class="section-title">{{title}}</h2>
    </div>
    <div class="row g-4">
      {{#each cards}}
      <div class="col-md-4">
        <div style="background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:28px; height:100%;">
          <h3 style="font-size:20px; font-weight:700; color:#172033; margin:0 0 10px;">{{this.title}}</h3>
          <p style="color:#5b6472; font-size:14px; line-height:1.5; margin:0;">{{this.desc}}</p>
        </div>
      </div>
      {{/each}}
    </div>
  </div>
</section>`);

fs.writeFileSync(path.join(compRoot, 'services-detailed-grid/style.css'), `/* Scoped Layer 2 styles for services-detailed-grid */
.services-section { background:#f8fafc; }
`);

// 7. Plumbing HVAC Cross-Sell (Section 18)
ensureDir(path.join(compRoot, 'plumbing-hvac-cross-sell'));
fs.writeFileSync(path.join(compRoot, 'plumbing-hvac-cross-sell/schema.json'), JSON.stringify({
  name: 'Multi-Trade Cross-Sell Bar',
  category: 'Services',
  fields: {
    heading: { type: 'text', label: 'Section Heading', default: 'Total Home Comfort Under One Roof' }
  }
}, null, 2));

fs.writeFileSync(path.join(compRoot, 'plumbing-hvac-cross-sell/defaults.json'), JSON.stringify({
  heading: 'Total Home Comfort Under One Roof'
}, null, 2));

fs.writeFileSync(path.join(compRoot, 'plumbing-hvac-cross-sell/template.html'), `<section class="plumbing-hvac-section section-padding bg-light-gray" style="padding:40px 0;">
  <div class="container">
    <div class="text-center mb-4">
      <h2 class="section-title">{{heading}}</h2>
    </div>
    <div class="row g-3 text-center">
      <div class="col-md-3 col-6"><div style="background:#fff; padding:20px; border-radius:10px; font-weight:700; color:#172033; box-shadow:0 2px 8px rgba(0,0,0,0.04);">🔥 Heating & Cooling</div></div>
      <div class="col-md-3 col-6"><div style="background:#fff; padding:20px; border-radius:10px; font-weight:700; color:#172033; box-shadow:0 2px 8px rgba(0,0,0,0.04);">⚡ Electrical Systems</div></div>
      <div class="col-md-3 col-6"><div style="background:#fff; padding:20px; border-radius:10px; font-weight:700; color:#172033; box-shadow:0 2px 8px rgba(0,0,0,0.04);">💧 Water & Plumbing</div></div>
      <div class="col-md-3 col-6"><div style="background:#fff; padding:20px; border-radius:10px; font-weight:700; color:#172033; box-shadow:0 2px 8px rgba(0,0,0,0.04);">🏢 Commercial Care</div></div>
    </div>
  </div>
</section>`);

fs.writeFileSync(path.join(compRoot, 'plumbing-hvac-cross-sell/style.css'), `/* Scoped Layer 2 styles for plumbing-hvac-cross-sell */
.plumbing-hvac-section { background:#f8fafc; }
`);

// 8. Comfort Closing CTA (Section 19)
ensureDir(path.join(compRoot, 'comfort-closing-cta'));
fs.writeFileSync(path.join(compRoot, 'comfort-closing-cta/schema.json'), JSON.stringify({
  name: 'Closing Guarantee & Callout',
  category: 'Call to Action',
  fields: {
    title: { type: 'text', label: 'Closing Heading', default: 'Restore Your Comfort. Call Princeton Air Today.' },
    subtitle: { type: 'text', label: 'Subheading', default: 'Quality, Friendly Service in Central New Jersey Since 1971.' },
    phone: { type: 'text', label: 'Phone', default: '(123) 456-7890' }
  }
}, null, 2));

fs.writeFileSync(path.join(compRoot, 'comfort-closing-cta/defaults.json'), JSON.stringify({
  title: 'Restore Your Comfort. Call Princeton Air Today.',
  subtitle: 'Quality, Friendly Service in Central New Jersey Since 1971.',
  phone: '(123) 456-7890'
}, null, 2));

fs.writeFileSync(path.join(compRoot, 'comfort-closing-cta/template.html'), `<section class="comfort-section section-padding" style="background:#172033; color:#fff; padding:60px 0; text-align:center;">
  <div class="container">
    <h2 style="color:#fff; font-size:36px; font-weight:800; margin-bottom:12px;">{{title}}</h2>
    <p style="color:#94a3b8; font-size:18px; margin-bottom:28px;">{{subtitle}}</p>
    <a href="tel:{{phone}}" style="background:#A01922; color:#fff; padding:14px 32px; border-radius:30px; font-size:18px; font-weight:700; text-decoration:none; display:inline-block;">Call {{phone}}</a>
  </div>
</section>`);

fs.writeFileSync(path.join(compRoot, 'comfort-closing-cta/style.css'), `/* Scoped Layer 2 styles for comfort-closing-cta */
.comfort-section { background: #172033; color: #fff; }
`);

console.log("All 18 demo components created successfully!");
