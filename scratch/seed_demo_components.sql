-- =========================================================================
-- SEED SCRIPT: Real-World Components for Azure PostgreSQL
-- Target Table: public.theme_components
-- Theme: Trades Modern (theme_guid: 'a1000000-0000-0000-0000-000000000001')
-- Matching Table Constraint: UNIQUE (theme_guid, component_key)
-- =========================================================================

-- -------------------------------------------------------------------------
-- Component 1: accordion-map-section
-- -------------------------------------------------------------------------
INSERT INTO public.theme_components (
  theme_guid,
  component_key,
  name,
  category,
  schema_json,
  template_html,
  defaults_json,
  css,
  display_order,
  is_active,
  is_deleted
)
VALUES (
  'a1000000-0000-0000-0000-000000000001',
  'accordion-map-section',
  'NJ Service Areas & Accordion',
  'Locations',
  '{
  "name": "NJ Service Areas & Accordion",
  "category": "Locations",
  "fields": {
    "heading": {
      "type": "text",
      "label": "Section Heading",
      "default": "New Jersey Chooses Princeton Air"
    },
    "items": {
      "type": "array",
      "label": "Feature Accordion Items",
      "itemLabel": "Accordion Item",
      "itemSchema": {
        "number": {
          "type": "text",
          "label": "Item Number",
          "default": "1."
        },
        "title": {
          "type": "text",
          "label": "Item Title",
          "default": "One Trusted Team for the Entire Home"
        }
      }
    },
    "buttonText": {
      "type": "text",
      "label": "Map Button Text",
      "default": "New Jersey Locations"
    }
  }
}'::jsonb,
  '<section class="nj-section section-padding py-lg-6">
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
</section>',
  '{
  "heading": "New Jersey Chooses Princeton Air",
  "items": [
    {
      "_id": "nj-1",
      "number": "1.",
      "title": "One Trusted Team for the Entire Home"
    },
    {
      "_id": "nj-2",
      "number": "2.",
      "title": "Thorough, Code-Compliant Work"
    },
    {
      "_id": "nj-3",
      "number": "3.",
      "title": "Flexible Financing Options"
    },
    {
      "_id": "nj-4",
      "number": "4.",
      "title": "Solutions Made to Last"
    },
    {
      "_id": "nj-5",
      "number": "5.",
      "title": "Respect for Your Home & Privacy"
    },
    {
      "_id": "nj-6",
      "number": "6.",
      "title": "Responsive Emergency Plumbing Service"
    }
  ],
  "buttonText": "New Jersey Locations"
}'::jsonb,
  '/* Scoped Layer 2 styles for accordion-map-section */
.nj-section { background: #fff; padding: 48px 0; }
',
  10,
  true,
  false
)
ON CONFLICT (theme_guid, component_key) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  schema_json = EXCLUDED.schema_json,
  template_html = EXCLUDED.template_html,
  defaults_json = EXCLUDED.defaults_json,
  css = EXCLUDED.css,
  display_order = EXCLUDED.display_order,
  is_active = true,
  is_deleted = false,
  updated_on = CURRENT_TIMESTAMP;

-- -------------------------------------------------------------------------
-- Component 2: benefits-grid
-- -------------------------------------------------------------------------
INSERT INTO public.theme_components (
  theme_guid,
  component_key,
  name,
  category,
  schema_json,
  template_html,
  defaults_json,
  css,
  display_order,
  is_active,
  is_deleted
)
VALUES (
  'a1000000-0000-0000-0000-000000000001',
  'benefits-grid',
  'Benefits Grid',
  'Features',
  '{
  "name": "Benefits Grid",
  "category": "Features",
  "fields": {
    "eyebrow": { "type": "text", "label": "Eyebrow Badge", "default": "WHY CHOOSE US" },
    "title": { "type": "text", "label": "Heading", "required": true, "default": "Straightforward Service Homeowners Count On" },
    "subtitle": { "type": "textarea", "label": "Subtitle", "default": "We treat your home with respect and give you upfront pricing before any work starts." },
    "items": {
      "type": "array",
      "label": "Benefit Cards",
      "labelField": "title",
      "itemSchema": {
        "number": { "type": "text", "label": "Number Badge (e.g. 01)" },
        "title": { "type": "text", "label": "Card Title", "required": true },
        "description": { "type": "textarea", "label": "Description" }
      }
    }
  }
}
'::jsonb,
  '<section class="benefits-section">
  <div class="benefits-section__heading">
    {{#if eyebrow}}<p class="benefits-section__eyebrow">{{eyebrow}}</p>{{/if}}
    <h2>{{title}}</h2>
    {{#if subtitle}}<p class="benefits-section__subtitle">{{subtitle}}</p>{{/if}}
  </div>
  <div class="benefits-section__grid">
    {{#each items}}
    <article class="benefit-card">
      {{#if number}}<span class="benefit-card__number">{{number}}</span>{{/if}}
      <h3>{{title}}</h3>
      {{#if description}}<p>{{description}}</p>{{/if}}
    </article>
    {{/each}}
  </div>
</section>
',
  '{
  "eyebrow": "WHY CHOOSE US",
  "title": "Straightforward Service Homeowners Count On",
  "subtitle": "We treat your home with respect and give you upfront pricing before any work starts.",
  "items": [
    {
      "_id": "ben-01",
      "number": "01",
      "title": "45-Minute Dispatch",
      "description": "Fast local response when your AC fails during summer heat waves."
    },
    {
      "_id": "ben-02",
      "number": "02",
      "title": "Licensed & Insured",
      "description": "Background-checked, master technicians with 10+ years experience."
    },
    {
      "_id": "ben-03",
      "number": "03",
      "title": "Flat-Rate Pricing",
      "description": "Zero hidden trip charges, zero overtime penalties, no high pressure."
    }
  ]
}
'::jsonb,
  '',
  20,
  true,
  false
)
ON CONFLICT (theme_guid, component_key) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  schema_json = EXCLUDED.schema_json,
  template_html = EXCLUDED.template_html,
  defaults_json = EXCLUDED.defaults_json,
  css = EXCLUDED.css,
  display_order = EXCLUDED.display_order,
  is_active = true,
  is_deleted = false,
  updated_on = CURRENT_TIMESTAMP;

-- -------------------------------------------------------------------------
-- Component 3: certifications-marquee
-- -------------------------------------------------------------------------
INSERT INTO public.theme_components (
  theme_guid,
  component_key,
  name,
  category,
  schema_json,
  template_html,
  defaults_json,
  css,
  display_order,
  is_active,
  is_deleted
)
VALUES (
  'a1000000-0000-0000-0000-000000000001',
  'certifications-marquee',
  'Certifications & Partners Marquee',
  'Trust Badges',
  '{
  "name": "Certifications & Partners Marquee",
  "category": "Trust Badges",
  "fields": {
    "heading": {
      "type": "text",
      "label": "Optional Heading",
      "default": "Trusted & Certified Excellence"
    }
  }
}'::jsonb,
  '<section class="gallery-slider-wrapper section-padding">
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
</section>',
  '{
  "heading": "Trusted & Certified Excellence"
}'::jsonb,
  '/* Scoped Layer 2 styles for certifications-marquee */
.gallery-slider-wrapper { background: #fff; padding: 36px 0; border-top: 1px solid #ECECEC; }
',
  30,
  true,
  false
)
ON CONFLICT (theme_guid, component_key) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  schema_json = EXCLUDED.schema_json,
  template_html = EXCLUDED.template_html,
  defaults_json = EXCLUDED.defaults_json,
  css = EXCLUDED.css,
  display_order = EXCLUDED.display_order,
  is_active = true,
  is_deleted = false,
  updated_on = CURRENT_TIMESTAMP;

-- -------------------------------------------------------------------------
-- Component 4: comfort-closing-cta
-- -------------------------------------------------------------------------
INSERT INTO public.theme_components (
  theme_guid,
  component_key,
  name,
  category,
  schema_json,
  template_html,
  defaults_json,
  css,
  display_order,
  is_active,
  is_deleted
)
VALUES (
  'a1000000-0000-0000-0000-000000000001',
  'comfort-closing-cta',
  'Closing Guarantee & Callout',
  'Call to Action',
  '{
  "name": "Closing Guarantee & Callout",
  "category": "Call to Action",
  "fields": {
    "title": {
      "type": "text",
      "label": "Closing Heading",
      "default": "Restore Your Comfort. Call Princeton Air Today."
    },
    "subtitle": {
      "type": "text",
      "label": "Subheading",
      "default": "Quality, Friendly Service in Central New Jersey Since 1971."
    },
    "phone": {
      "type": "text",
      "label": "Phone",
      "default": "(123) 456-7890"
    }
  }
}'::jsonb,
  '<section class="comfort-section section-padding" style="background:#172033; color:#fff; padding:60px 0; text-align:center;">
  <div class="container">
    <h2 style="color:#fff; font-size:36px; font-weight:800; margin-bottom:12px;">{{title}}</h2>
    <p style="color:#94a3b8; font-size:18px; margin-bottom:28px;">{{subtitle}}</p>
    <a href="tel:{{phone}}" style="background:#A01922; color:#fff; padding:14px 32px; border-radius:30px; font-size:18px; font-weight:700; text-decoration:none; display:inline-block;">Call {{phone}}</a>
  </div>
</section>',
  '{
  "title": "Restore Your Comfort. Call Princeton Air Today.",
  "subtitle": "Quality, Friendly Service in Central New Jersey Since 1971.",
  "phone": "(123) 456-7890"
}'::jsonb,
  '/* Scoped Layer 2 styles for comfort-closing-cta */
.comfort-section { background: #172033; color: #fff; }
',
  40,
  true,
  false
)
ON CONFLICT (theme_guid, component_key) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  schema_json = EXCLUDED.schema_json,
  template_html = EXCLUDED.template_html,
  defaults_json = EXCLUDED.defaults_json,
  css = EXCLUDED.css,
  display_order = EXCLUDED.display_order,
  is_active = true,
  is_deleted = false,
  updated_on = CURRENT_TIMESTAMP;

-- -------------------------------------------------------------------------
-- Component 5: comfort-club-perks
-- -------------------------------------------------------------------------
INSERT INTO public.theme_components (
  theme_guid,
  component_key,
  name,
  category,
  schema_json,
  template_html,
  defaults_json,
  css,
  display_order,
  is_active,
  is_deleted
)
VALUES (
  'a1000000-0000-0000-0000-000000000001',
  'comfort-club-perks',
  'Home Comfort Club Perks',
  'Features',
  '{
  "name": "Home Comfort Club Perks",
  "category": "Features",
  "fields": {
    "title": {
      "type": "text",
      "label": "Title",
      "default": "Year-Round Confidence With the Home Comfort Club"
    },
    "badge": {
      "type": "text",
      "label": "Badge Text",
      "default": "THE HOME COMFORT CLUB"
    },
    "desc": {
      "type": "textarea",
      "label": "Description",
      "default": "Regular maintenance protects your plumbing investments and avoids high-cost emergency dispatch fees."
    },
    "perks": {
      "type": "array",
      "label": "Club Perks",
      "itemLabel": "Perk Item",
      "itemSchema": {
        "text": {
          "type": "text",
          "label": "Perk Title",
          "default": "Priority Emergency Dispatch"
        }
      }
    },
    "image": {
      "type": "image",
      "label": "Side Image",
      "default": {
        "src": "/assets/img/the-home-comfort-club-new.webp",
        "alt": "Home Comfort Club"
      }
    }
  }
}'::jsonb,
  '<section class="comfort-club-section section-padding py-lg-6">
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
</section>',
  '{
  "title": "Year-Round Confidence With the Home Comfort Club",
  "badge": "THE HOME COMFORT CLUB",
  "desc": "Regular maintenance protects your plumbing investments, maintains manufacturer warranties, and avoids high-cost emergency dispatch fees.",
  "perks": [
    {
      "_id": "p-1",
      "text": "15% Discount on all plumbing and drain service repairs"
    },
    {
      "_id": "p-2",
      "text": "Priority scheduling ahead of non-members during peak freezes"
    },
    {
      "_id": "p-3",
      "text": "Comprehensive annual whole-house plumbing inspection"
    },
    {
      "_id": "p-4",
      "text": "Waived emergency overtime diagnostic charges"
    }
  ],
  "image": {
    "src": "/assets/img/the-home-comfort-club-new.webp",
    "alt": "Home Comfort Club"
  }
}'::jsonb,
  '/* Scoped Layer 2 styles for comfort-club-perks */
.comfort-club-section { background:#fff; padding:48px 0; }
',
  50,
  true,
  false
)
ON CONFLICT (theme_guid, component_key) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  schema_json = EXCLUDED.schema_json,
  template_html = EXCLUDED.template_html,
  defaults_json = EXCLUDED.defaults_json,
  css = EXCLUDED.css,
  display_order = EXCLUDED.display_order,
  is_active = true,
  is_deleted = false,
  updated_on = CURRENT_TIMESTAMP;

-- -------------------------------------------------------------------------
-- Component 6: coupon-grid
-- -------------------------------------------------------------------------
INSERT INTO public.theme_components (
  theme_guid,
  component_key,
  name,
  category,
  schema_json,
  template_html,
  defaults_json,
  css,
  display_order,
  is_active,
  is_deleted
)
VALUES (
  'a1000000-0000-0000-0000-000000000001',
  'coupon-grid',
  'Promotional Coupons Grid',
  'Promotions',
  '{
  "name": "Promotional Coupons Grid",
  "category": "Promotions",
  "fields": {
    "heading": {
      "type": "text",
      "label": "Section Heading",
      "default": "Plumbing Specials & Discounts"
    },
    "coupons": {
      "type": "array",
      "label": "Coupons",
      "itemLabel": "Coupon",
      "itemSchema": {
        "discount": {
          "type": "text",
          "label": "Discount Amount",
          "default": "$50 OFF"
        },
        "title": {
          "type": "text",
          "label": "Service Offer",
          "default": "Water Heater Installation"
        },
        "terms": {
          "type": "text",
          "label": "Terms & Conditions",
          "default": "Valid on complete system replacement. Cannot combine."
        },
        "expiry": {
          "type": "text",
          "label": "Expiration Text",
          "default": "Expires 11/30/2026"
        }
      }
    }
  }
}'::jsonb,
  '<section class="coupon-section py-lg-6">
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
</section>',
  '{
  "heading": "Plumbing Specials & Discounts",
  "coupons": [
    {
      "_id": "c-1",
      "discount": "$50 OFF",
      "title": "Sink/Shower Unclog (Branch Line)",
      "terms": "Cannot be combined with other offers.",
      "expiry": "Expires 11/30/2026"
    },
    {
      "_id": "c-2",
      "discount": "$75 OFF",
      "title": "Drain Cleaning Service",
      "terms": "Valid for standard residential lines.",
      "expiry": "Expires 11/30/2026"
    },
    {
      "_id": "c-3",
      "discount": "$250 OFF",
      "title": "Water Heater Installation",
      "terms": "Applies to tankless or hybrid units.",
      "expiry": "Expires 11/30/2026"
    }
  ]
}'::jsonb,
  '/* Scoped Layer 2 styles for coupon-grid */
.coupon-section { background: #fafafa; padding: 48px 0; }
',
  60,
  true,
  false
)
ON CONFLICT (theme_guid, component_key) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  schema_json = EXCLUDED.schema_json,
  template_html = EXCLUDED.template_html,
  defaults_json = EXCLUDED.defaults_json,
  css = EXCLUDED.css,
  display_order = EXCLUDED.display_order,
  is_active = true,
  is_deleted = false,
  updated_on = CURRENT_TIMESTAMP;

-- -------------------------------------------------------------------------
-- Component 7: cta-banner
-- -------------------------------------------------------------------------
INSERT INTO public.theme_components (
  theme_guid,
  component_key,
  name,
  category,
  schema_json,
  template_html,
  defaults_json,
  css,
  display_order,
  is_active,
  is_deleted
)
VALUES (
  'a1000000-0000-0000-0000-000000000001',
  'cta-banner',
  'Call to Action Banner',
  'Call to Action',
  '{
  "name": "Call to Action Banner",
  "category": "Call to Action",
  "fields": {
    "title": { "type": "text", "label": "Heading", "required": true, "default": "Need Immediate AC or Heating Service?" },
    "subtitle": { "type": "textarea", "label": "Subtitle", "default": "Speak directly with our Princeton dispatch team. No hold music, no automated runaround." },
    "buttonText": { "type": "text", "label": "Button Label", "default": "Book Service Online" },
    "buttonUrl": { "type": "text", "label": "Button URL", "default": "#book" }
  }
}
'::jsonb,
  '<section class="cta-section">
  <div class="cta-section__box">
    <div>
      <h2>{{title}}</h2>
      {{#if subtitle}}<p>{{subtitle}}</p>{{/if}}
    </div>
    {{#if buttonText}}
    <a class="cta-section__button" href="{{buttonUrl}}">{{buttonText}}</a>
    {{/if}}
  </div>
</section>
',
  '{
  "title": "Need Immediate AC or Heating Service?",
  "subtitle": "Speak directly with our Princeton dispatch team. No hold music, no automated runaround.",
  "buttonText": "Book Service Online",
  "buttonUrl": "#book"
}
'::jsonb,
  '',
  70,
  true,
  false
)
ON CONFLICT (theme_guid, component_key) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  schema_json = EXCLUDED.schema_json,
  template_html = EXCLUDED.template_html,
  defaults_json = EXCLUDED.defaults_json,
  css = EXCLUDED.css,
  display_order = EXCLUDED.display_order,
  is_active = true,
  is_deleted = false,
  updated_on = CURRENT_TIMESTAMP;

-- -------------------------------------------------------------------------
-- Component 8: cta-banner-dual
-- -------------------------------------------------------------------------
INSERT INTO public.theme_components (
  theme_guid,
  component_key,
  name,
  category,
  schema_json,
  template_html,
  defaults_json,
  css,
  display_order,
  is_active,
  is_deleted
)
VALUES (
  'a1000000-0000-0000-0000-000000000001',
  'cta-banner-dual',
  'Dual CTA Contact Banner',
  'Call to Action',
  '{
  "name": "Dual CTA Contact Banner",
  "category": "Call to Action",
  "fields": {
    "phoneTitle": {
      "type": "text",
      "label": "Phone Card Title",
      "default": "Ready to talk to a home services specialist?"
    },
    "phoneText": {
      "type": "text",
      "label": "Phone Number",
      "default": "(123) 456-7890"
    },
    "chatTitle": {
      "type": "text",
      "label": "Chat Card Title",
      "default": "Need Immediate Help?"
    },
    "chatButtonText": {
      "type": "text",
      "label": "Chat Button Text",
      "default": "Chat with us"
    }
  }
}'::jsonb,
  '<section class="cta-banner-section">
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
</section>',
  '{
  "phoneTitle": "Ready to talk to a home services specialist?",
  "phoneText": "(123) 456-7890",
  "chatTitle": "Need Immediate Help?",
  "chatButtonText": "Chat with us"
}'::jsonb,
  '/* Scoped Layer 2 styles for cta-banner-dual */
.cta-banner-section { padding: 40px 0; }
',
  80,
  true,
  false
)
ON CONFLICT (theme_guid, component_key) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  schema_json = EXCLUDED.schema_json,
  template_html = EXCLUDED.template_html,
  defaults_json = EXCLUDED.defaults_json,
  css = EXCLUDED.css,
  display_order = EXCLUDED.display_order,
  is_active = true,
  is_deleted = false,
  updated_on = CURRENT_TIMESTAMP;

-- -------------------------------------------------------------------------
-- Component 9: cta-strip
-- -------------------------------------------------------------------------
INSERT INTO public.theme_components (
  theme_guid,
  component_key,
  name,
  category,
  schema_json,
  template_html,
  defaults_json,
  css,
  display_order,
  is_active,
  is_deleted
)
VALUES (
  'a1000000-0000-0000-0000-000000000001',
  'cta-strip',
  'CTA Urgency Strip',
  'Call to Action',
  '{
  "name": "CTA Urgency Strip",
  "category": "Call to Action",
  "fields": {
    "text": {
      "type": "text",
      "label": "Callout Text",
      "default": "Ready to talk to a home services specialist?"
    },
    "buttonText": {
      "type": "text",
      "label": "Button Label",
      "default": "Schedule Services"
    },
    "buttonUrl": {
      "type": "text",
      "label": "Button URL",
      "default": "#quote"
    }
  }
}'::jsonb,
  '<section class="cta-section">
  <div class="container">
    <div class="cta-wrapper">
      <p class="cta-text">{{text}}</p>
      <a href="{{buttonUrl}}" onclick="openQuotePopup()" class="btn-filled-chat">{{buttonText}}</a>
    </div>
  </div>
</section>',
  '{
  "text": "Ready to talk to a home services specialist?",
  "buttonText": "Schedule Services",
  "buttonUrl": "#quote"
}'::jsonb,
  '/* Scoped Layer 2 styles for cta-strip */
.cta-section { background-color: #000; padding: 18px 0; }
.cta-wrapper { display: flex; align-items: center; justify-content: center; gap: 24px; flex-wrap: wrap; }
.cta-text { color: #fff; font-size: 18px; margin: 0; font-weight: 500; }
',
  90,
  true,
  false
)
ON CONFLICT (theme_guid, component_key) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  schema_json = EXCLUDED.schema_json,
  template_html = EXCLUDED.template_html,
  defaults_json = EXCLUDED.defaults_json,
  css = EXCLUDED.css,
  display_order = EXCLUDED.display_order,
  is_active = true,
  is_deleted = false,
  updated_on = CURRENT_TIMESTAMP;

-- -------------------------------------------------------------------------
-- Component 10: faq-accordion
-- -------------------------------------------------------------------------
INSERT INTO public.theme_components (
  theme_guid,
  component_key,
  name,
  category,
  schema_json,
  template_html,
  defaults_json,
  css,
  display_order,
  is_active,
  is_deleted
)
VALUES (
  'a1000000-0000-0000-0000-000000000001',
  'faq-accordion',
  'FAQ Accordion',
  'Content',
  '{
  "name": "FAQ Accordion",
  "category": "Content",
  "fields": {
    "eyebrow": { "type": "text", "label": "Eyebrow Badge", "default": "COMMON QUESTIONS" },
    "title": { "type": "text", "label": "Heading", "required": true, "default": "Frequently Asked Questions" },
    "subtitle": { "type": "textarea", "label": "Subtitle", "default": "Quick answers regarding diagnostic fees, warranties, and emergency dispatch." },
    "items": {
      "type": "array",
      "label": "Questions & Answers",
      "labelField": "question",
      "itemSchema": {
        "question": { "type": "text", "label": "Question", "required": true },
        "answer": { "type": "textarea", "label": "Answer", "required": true }
      }
    }
  }
}
'::jsonb,
  '<section class="faq-section">
  <div class="faq-section__heading">
    {{#if eyebrow}}<p class="faq-section__eyebrow">{{eyebrow}}</p>{{/if}}
    <h2>{{title}}</h2>
    {{#if subtitle}}<p class="faq-section__subtitle">{{subtitle}}</p>{{/if}}
  </div>
  <div class="faq-list">
    {{#each items}}
    <details class="faq-item" open>
      <summary>{{question}}</summary>
      <p>{{answer}}</p>
    </details>
    {{/each}}
  </div>
</section>
',
  '{
  "eyebrow": "COMMON QUESTIONS",
  "title": "Frequently Asked Questions",
  "subtitle": "Quick answers regarding diagnostic fees, warranties, and emergency dispatch.",
  "items": [
    {
      "_id": "faq-01",
      "question": "How quickly can a technician reach my home in Princeton?",
      "answer": "For active cooling emergencies during summer, our average dispatch window is 30 to 45 minutes across the Princeton area."
    },
    {
      "_id": "faq-02",
      "question": "Do you charge extra for evening or weekend visits?",
      "answer": "No. We believe in clear, flat-rate pricing. You receive the exact repair estimate upfront before any wrench is turned."
    },
    {
      "_id": "faq-03",
      "question": "What warranty comes with repairs?",
      "answer": "All parts and labor carry a 1-year 100% satisfaction guarantee. If the issue recurs, we return and fix it at no charge."
    }
  ]
}
'::jsonb,
  '',
  100,
  true,
  false
)
ON CONFLICT (theme_guid, component_key) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  schema_json = EXCLUDED.schema_json,
  template_html = EXCLUDED.template_html,
  defaults_json = EXCLUDED.defaults_json,
  css = EXCLUDED.css,
  display_order = EXCLUDED.display_order,
  is_active = true,
  is_deleted = false,
  updated_on = CURRENT_TIMESTAMP;

-- -------------------------------------------------------------------------
-- Component 11: financing-cta
-- -------------------------------------------------------------------------
INSERT INTO public.theme_components (
  theme_guid,
  component_key,
  name,
  category,
  schema_json,
  template_html,
  defaults_json,
  css,
  display_order,
  is_active,
  is_deleted
)
VALUES (
  'a1000000-0000-0000-0000-000000000001',
  'financing-cta',
  'Financing Pre-Approval Banner',
  'Call to Action',
  '{
  "name": "Financing Pre-Approval Banner",
  "category": "Call to Action",
  "fields": {
    "title": {
      "type": "text",
      "label": "Banner Title",
      "default": "Get Pre-Approved Financing"
    },
    "desc": {
      "type": "textarea",
      "label": "Details",
      "default": "Affordable monthly payment plans with zero penalty for early payoff. Quick, secure online application."
    },
    "buttonText": {
      "type": "text",
      "label": "Button Label",
      "default": "Apply For Financing"
    }
  }
}'::jsonb,
  '<section class="financing-cta-section bg-light-gray" style="padding:48px 0;">
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
</section>',
  '{
  "title": "Get Pre-Approved Financing",
  "desc": "Affordable monthly payment plans with zero penalty for early payoff. Quick, secure online application.",
  "buttonText": "Apply For Financing"
}'::jsonb,
  '/* Scoped Layer 2 styles for financing-cta */
.financing-cta-section { background: #f8fafc; }
',
  110,
  true,
  false
)
ON CONFLICT (theme_guid, component_key) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  schema_json = EXCLUDED.schema_json,
  template_html = EXCLUDED.template_html,
  defaults_json = EXCLUDED.defaults_json,
  css = EXCLUDED.css,
  display_order = EXCLUDED.display_order,
  is_active = true,
  is_deleted = false,
  updated_on = CURRENT_TIMESTAMP;

-- -------------------------------------------------------------------------
-- Component 12: hero-split
-- -------------------------------------------------------------------------
INSERT INTO public.theme_components (
  theme_guid,
  component_key,
  name,
  category,
  schema_json,
  template_html,
  defaults_json,
  css,
  display_order,
  is_active,
  is_deleted
)
VALUES (
  'a1000000-0000-0000-0000-000000000001',
  'hero-split',
  'Split Hero with Image',
  'Hero',
  '{
  "name": "Split Hero with Image",
  "category": "Hero",
  "fields": {
    "eyebrow": { "type": "text", "label": "Eyebrow Badge", "default": "24/7 EMERGENCY DISPATCH" },
    "title": { "type": "text", "label": "Main Heading", "required": true, "default": "AC Repair & Cooling Service in Princeton" },
    "subtitle": { "type": "textarea", "label": "Subtitle", "default": "Fast, honest technicians on call. Flat-rate pricing with no surprise overtime fees." },
    "buttonText": { "type": "text", "label": "Button Label", "default": "Call (609) 555-0198" },
    "buttonUrl": { "type": "text", "label": "Button URL", "default": "tel:6095550198" },
    "image": { "type": "image", "label": "Hero Image", "aspectRatio": "16:9" }
  }
}
'::jsonb,
  '<section class="hero-section">
  <div class="hero-section__inner">
    <div class="hero-section__content">
      {{#if eyebrow}}<p class="hero-section__eyebrow">{{eyebrow}}</p>{{/if}}
      <h1>{{title}}</h1>
      {{#if subtitle}}<p class="hero-section__subtitle">{{subtitle}}</p>{{/if}}
      {{#if buttonText}}
      <div class="hero-section__actions">
        <a href="{{buttonUrl}}" class="btn-primary">{{buttonText}}</a>
      </div>
      {{/if}}
    </div>
    {{#if image.src}}
    <img class="hero-section__image" src="{{image.src}}" alt="{{image.alt}}" />
    {{/if}}
  </div>
</section>
',
  '{
  "eyebrow": "24/7 EMERGENCY DISPATCH",
  "title": "AC Repair & Cooling Service in Princeton",
  "subtitle": "Fast, honest technicians on call. Flat-rate pricing with no surprise overtime fees.",
  "buttonText": "Call (609) 555-0198",
  "buttonUrl": "tel:6095550198",
  "image": {
    "src": "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1400&q=80",
    "alt": "HVAC technician servicing air conditioner"
  }
}
'::jsonb,
  '',
  120,
  true,
  false
)
ON CONFLICT (theme_guid, component_key) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  schema_json = EXCLUDED.schema_json,
  template_html = EXCLUDED.template_html,
  defaults_json = EXCLUDED.defaults_json,
  css = EXCLUDED.css,
  display_order = EXCLUDED.display_order,
  is_active = true,
  is_deleted = false,
  updated_on = CURRENT_TIMESTAMP;

-- -------------------------------------------------------------------------
-- Component 13: plumbing-care-video
-- -------------------------------------------------------------------------
INSERT INTO public.theme_components (
  theme_guid,
  component_key,
  name,
  category,
  schema_json,
  template_html,
  defaults_json,
  css,
  display_order,
  is_active,
  is_deleted
)
VALUES (
  'a1000000-0000-0000-0000-000000000001',
  'plumbing-care-video',
  'Plumbing Care Video Section',
  'Media',
  '{
  "name": "Plumbing Care Video Section",
  "category": "Media",
  "fields": {
    "heading": {
      "type": "text",
      "label": "Section Heading",
      "default": "Plumbing Care That Matches the Character of Your Home"
    },
    "subheading": {
      "type": "text",
      "label": "Subheading",
      "default": "The right plumbing approach depends on what''s already there."
    },
    "image": {
      "type": "image",
      "label": "Video Thumbnail / Image",
      "default": {
        "src": "/assets/img/2-plumbing-care.webp",
        "alt": "Plumbing service video placeholder"
      }
    },
    "desc1": {
      "type": "textarea",
      "label": "Paragraph 1",
      "default": "Every home has its own story, its own age, and its own plumbing system characteristics. We diagnose issues with careful attention to finished spaces."
    },
    "desc2": {
      "type": "textarea",
      "label": "Paragraph 2",
      "default": "Whether it''s modern fixtures or historic pipes, our master technicians know how to preserve your home while restoring optimal water flow and reliability."
    },
    "phone": {
      "type": "text",
      "label": "Phone Number",
      "default": "(123) 456-7890"
    },
    "chatText": {
      "type": "text",
      "label": "Chat Button Text",
      "default": "Chat with us"
    }
  }
}'::jsonb,
  '<section class="plumbing-care-section section-padding bg-light-gray py-lg-6">
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
</section>',
  '{
  "heading": "Plumbing Care That Matches the Character of Your Home",
  "subheading": "The right plumbing approach depends on what''s already there.",
  "image": {
    "src": "/assets/img/2-plumbing-care.webp",
    "alt": "Plumbing service video placeholder"
  },
  "desc1": "Every home has its own story, its own age, and its own plumbing system characteristics. We diagnose issues with careful attention to finished spaces.",
  "desc2": "Whether it''s modern fixtures or historic pipes, our master technicians know how to preserve your home while restoring optimal water flow and reliability.",
  "phone": "(123) 456-7890",
  "chatText": "Chat with us"
}'::jsonb,
  '/* Scoped Layer 2 styles for plumbing-care-video */
.video-card { position: relative; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.12); }
.video-card-img { width: 100%; height: auto; display: block; object-fit: cover; }
.play-button-wrapper { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
.play-button { width: 72px; height: 72px; border-radius: 50%; background: #A01922; border: none; color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(160,25,34,0.4); }
.play-button svg { width: 28px; height: 28px; fill: #fff; }
',
  130,
  true,
  false
)
ON CONFLICT (theme_guid, component_key) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  schema_json = EXCLUDED.schema_json,
  template_html = EXCLUDED.template_html,
  defaults_json = EXCLUDED.defaults_json,
  css = EXCLUDED.css,
  display_order = EXCLUDED.display_order,
  is_active = true,
  is_deleted = false,
  updated_on = CURRENT_TIMESTAMP;

-- -------------------------------------------------------------------------
-- Component 14: plumbing-hero-split
-- -------------------------------------------------------------------------
INSERT INTO public.theme_components (
  theme_guid,
  component_key,
  name,
  category,
  schema_json,
  template_html,
  defaults_json,
  css,
  display_order,
  is_active,
  is_deleted
)
VALUES (
  'a1000000-0000-0000-0000-000000000001',
  'plumbing-hero-split',
  'Plumbing Hero Split',
  'Hero',
  '{
  "name": "Plumbing Hero Split",
  "category": "Hero",
  "fields": {
    "title": {
      "type": "text",
      "label": "Main Title",
      "default": "New Jersey Plumbing Services"
    },
    "intro": {
      "type": "textarea",
      "label": "Intro Text",
      "default": "The quiet of a household depends on plumbing that works without being thought about."
    },
    "paragraph1": {
      "type": "textarea",
      "label": "Paragraph 1",
      "default": "Water pooling where it shouldn''t. A shower that runs cold before the morning is over. A toilet that runs and runs at 2 a.m. These are the moments that pull a household off schedule."
    },
    "paragraph2": {
      "type": "textarea",
      "label": "Paragraph 2",
      "default": "Princeton Air''s licensed plumbers arrive prepared, diagnose the actual cause, and complete the repair with careful attention to your finished spaces. Call or book online to schedule plumbing service in New Jersey."
    },
    "image": {
      "type": "image",
      "label": "Hero Image",
      "default": {
        "src": "/assets/img/1-index-hero-img.webp",
        "alt": "Professional Plumber"
      }
    }
  }
}'::jsonb,
  '<section class="plumbing-service-section">
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
</section>',
  '{
  "title": "New Jersey Plumbing Services",
  "intro": "The quiet of a household depends on plumbing that works without being thought about.",
  "paragraph1": "Water pooling where it shouldn''t. A shower that runs cold before the morning is over. A toilet that runs and runs at 2 a.m. These are the moments that pull a household off schedule.",
  "paragraph2": "Princeton Air''s licensed plumbers arrive prepared, diagnose the actual cause, and complete the repair with careful attention to your finished spaces. Call or book online to schedule plumbing service in New Jersey.",
  "image": {
    "src": "/assets/img/1-index-hero-img.webp",
    "alt": "Professional Plumber"
  }
}'::jsonb,
  '/* Scoped Layer 2 styles for plumbing-hero-split */
.plumbing-service-section { min-height: 374px; display: flex; background: #fff; padding: 0; }
.plumbing-service-content { background: linear-gradient(to right, #A01922, #7D1118, #390106); color: #fff; }
.plumbing-service-title { color: #fff; font-family: Outfit, sans-serif; font-size: 38px; font-weight: 700; }
',
  140,
  true,
  false
)
ON CONFLICT (theme_guid, component_key) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  schema_json = EXCLUDED.schema_json,
  template_html = EXCLUDED.template_html,
  defaults_json = EXCLUDED.defaults_json,
  css = EXCLUDED.css,
  display_order = EXCLUDED.display_order,
  is_active = true,
  is_deleted = false,
  updated_on = CURRENT_TIMESTAMP;

-- -------------------------------------------------------------------------
-- Component 15: plumbing-hvac-cross-sell
-- -------------------------------------------------------------------------
INSERT INTO public.theme_components (
  theme_guid,
  component_key,
  name,
  category,
  schema_json,
  template_html,
  defaults_json,
  css,
  display_order,
  is_active,
  is_deleted
)
VALUES (
  'a1000000-0000-0000-0000-000000000001',
  'plumbing-hvac-cross-sell',
  'Multi-Trade Cross-Sell Bar',
  'Services',
  '{
  "name": "Multi-Trade Cross-Sell Bar",
  "category": "Services",
  "fields": {
    "heading": {
      "type": "text",
      "label": "Section Heading",
      "default": "Total Home Comfort Under One Roof"
    }
  }
}'::jsonb,
  '<section class="plumbing-hvac-section section-padding bg-light-gray" style="padding:40px 0;">
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
</section>',
  '{
  "heading": "Total Home Comfort Under One Roof"
}'::jsonb,
  '/* Scoped Layer 2 styles for plumbing-hvac-cross-sell */
.plumbing-hvac-section { background:#f8fafc; }
',
  150,
  true,
  false
)
ON CONFLICT (theme_guid, component_key) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  schema_json = EXCLUDED.schema_json,
  template_html = EXCLUDED.template_html,
  defaults_json = EXCLUDED.defaults_json,
  css = EXCLUDED.css,
  display_order = EXCLUDED.display_order,
  is_active = true,
  is_deleted = false,
  updated_on = CURRENT_TIMESTAMP;

-- -------------------------------------------------------------------------
-- Component 16: plumbing-order-checklist
-- -------------------------------------------------------------------------
INSERT INTO public.theme_components (
  theme_guid,
  component_key,
  name,
  category,
  schema_json,
  template_html,
  defaults_json,
  css,
  display_order,
  is_active,
  is_deleted
)
VALUES (
  'a1000000-0000-0000-0000-000000000001',
  'plumbing-order-checklist',
  'Plumbing Order & Guarantee',
  'Features',
  '{
  "name": "Plumbing Order & Guarantee",
  "category": "Features",
  "fields": {
    "sectionTitle": {
      "type": "text",
      "label": "Section Title",
      "default": "When Plumbing Disrupts Your Home, We Restore Order"
    },
    "headline": {
      "type": "text",
      "label": "Left Headline",
      "default": "Your plumbing works in the background until the minute it stops."
    },
    "desc1": {
      "type": "textarea",
      "label": "Description 1",
      "default": "You turn a handle expecting water. You flush expecting nothing else to happen. When one of those automatic assumptions stops holding, the rest of the household adjusts around it."
    },
    "desc2": {
      "type": "textarea",
      "label": "Description 2",
      "default": "Princeton Air''s licensed plumbers walk into that moment with a plan. Five decades of serving New Jersey homeowners has taught us that the plumbing call that earns the next one is the one that''s done properly the first time."
    },
    "stats": {
      "type": "array",
      "label": "Stats & Badges",
      "itemLabel": "Stat Item",
      "itemSchema": {
        "number": {
          "type": "text",
          "label": "Number/Stat",
          "default": "50+"
        },
        "label": {
          "type": "text",
          "label": "Label",
          "default": "Years in Business"
        }
      }
    }
  }
}'::jsonb,
  '<section class="plumbing-order-section section-padding bg-light-gray">
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
</section>',
  '{
  "sectionTitle": "When Plumbing Disrupts Your Home, We Restore Order",
  "headline": "Your plumbing works in the background until the minute it stops.",
  "desc1": "You turn a handle expecting water. You flush expecting nothing else to happen. You walk past the laundry room without thinking about what''s under the sink. When one of those automatic assumptions stops holding, the rest of the household adjusts around it, and you start running a quiet inventory of what else might be about to go wrong.",
  "desc2": "Princeton Air''s licensed plumbers walk into that moment with a plan. We evaluate the whole system, not just the obvious failure, name the cause accurately, and put forward a scope that makes sense for your household and your budget. Five decades of serving New Jersey homeowners has taught us that the plumbing call that earns the next one is the one that''s done properly the first time.",
  "stats": [
    {
      "_id": "stat-1",
      "number": "50+",
      "label": "Years in Business"
    },
    {
      "_id": "stat-2",
      "number": "700",
      "label": "Skilled Employees"
    },
    {
      "_id": "stat-3",
      "number": "24/7",
      "label": "Emergency Service"
    },
    {
      "_id": "stat-4",
      "number": "500",
      "label": "Trucks on the Road"
    }
  ]
}'::jsonb,
  '/* Scoped Layer 2 styles for plumbing-order-checklist */
.plumbing-stats-card { background: #fff; padding: 32px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.plumbing-stat-item { display: flex; align-items: center; gap: 16px; }
.plumbing-stat-icon { width: 44px; height: 44px; background: #A01922; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
.plumbing-stat-icon svg { width: 22px; height: 22px; }
.plumbing-stat-number { font-size: 28px; font-weight: 800; color: #172033; display: block; line-height: 1.1; }
.plumbing-stat-label { font-size: 13px; color: #5b6472; font-weight: 500; }
',
  160,
  true,
  false
)
ON CONFLICT (theme_guid, component_key) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  schema_json = EXCLUDED.schema_json,
  template_html = EXCLUDED.template_html,
  defaults_json = EXCLUDED.defaults_json,
  css = EXCLUDED.css,
  display_order = EXCLUDED.display_order,
  is_active = true,
  is_deleted = false,
  updated_on = CURRENT_TIMESTAMP;

-- -------------------------------------------------------------------------
-- Component 17: plumbing-services-grid
-- -------------------------------------------------------------------------
INSERT INTO public.theme_components (
  theme_guid,
  component_key,
  name,
  category,
  schema_json,
  template_html,
  defaults_json,
  css,
  display_order,
  is_active,
  is_deleted
)
VALUES (
  'a1000000-0000-0000-0000-000000000001',
  'plumbing-services-grid',
  'Plumbing Services Grid',
  'Services',
  '{
  "name": "Plumbing Services Grid",
  "category": "Services",
  "fields": {
    "cards": {
      "type": "array",
      "label": "Service Cards",
      "itemLabel": "Service Card",
      "itemSchema": {
        "title": {
          "type": "text",
          "label": "Service Title",
          "default": "Plumbing Installation"
        },
        "link": {
          "type": "text",
          "label": "Link URL",
          "default": "#"
        }
      }
    }
  }
}'::jsonb,
  '<section class="plumbing-services-section" aria-label="Plumbing services">
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
</section>',
  '{
  "cards": [
    {
      "_id": "srv-1",
      "title": "Plumbing",
      "link": "#"
    },
    {
      "_id": "srv-2",
      "title": "Plumbing Installation",
      "link": "#"
    },
    {
      "_id": "srv-3",
      "title": "Plumbing Repair",
      "link": "#"
    },
    {
      "_id": "srv-4",
      "title": "Commercial",
      "link": "#"
    }
  ]
}'::jsonb,
  '/* Scoped Layer 2 styles for plumbing-services-grid */
.plumbing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; max-width: 1200px; margin: 0 auto; padding: 24px 16px; }
.card-body-center { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; transition: transform 0.2s, box-shadow 0.2s; }
.card-body-center:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); border-color: #A01922; }
.plumbing-card-icon svg { width: 32px; height: 32px; fill: none; stroke: #A01922; stroke-width: 2; }
.plumbing-card-title { font-size: 18px; font-weight: 700; color: #172033; margin: 0; }
',
  170,
  true,
  false
)
ON CONFLICT (theme_guid, component_key) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  schema_json = EXCLUDED.schema_json,
  template_html = EXCLUDED.template_html,
  defaults_json = EXCLUDED.defaults_json,
  css = EXCLUDED.css,
  display_order = EXCLUDED.display_order,
  is_active = true,
  is_deleted = false,
  updated_on = CURRENT_TIMESTAMP;

-- -------------------------------------------------------------------------
-- Component 18: plumbing-spotlight-hero
-- -------------------------------------------------------------------------
INSERT INTO public.theme_components (
  theme_guid,
  component_key,
  name,
  category,
  schema_json,
  template_html,
  defaults_json,
  css,
  display_order,
  is_active,
  is_deleted
)
VALUES (
  'a1000000-0000-0000-0000-000000000001',
  'plumbing-spotlight-hero',
  'Plumbing Spotlight Banner',
  'Hero',
  '{
  "name": "Plumbing Spotlight Banner",
  "category": "Hero",
  "fields": {
    "title": {
      "type": "text",
      "label": "Spotlight Title",
      "default": "Our New Jersey Plumbing Services"
    },
    "desc": {
      "type": "textarea",
      "label": "Description",
      "default": "From precision leak detection to whole-home repiping and high-efficiency water heater conversions, our master technicians ensure lasting comfort."
    },
    "image": {
      "type": "image",
      "label": "Image",
      "default": {
        "src": "/assets/img/plumbing-hero.webp",
        "alt": "New Jersey Plumbing"
      }
    }
  }
}'::jsonb,
  '<section class="plumbing-hero section-padding bg-light-gray" style="padding:48px 0;">
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
</section>',
  '{
  "title": "Our New Jersey Plumbing Services",
  "desc": "From precision leak detection to whole-home repiping and high-efficiency water heater conversions, our master technicians ensure lasting comfort.",
  "image": {
    "src": "/assets/img/plumbing-hero.webp",
    "alt": "New Jersey Plumbing"
  }
}'::jsonb,
  '/* Scoped Layer 2 styles for plumbing-spotlight-hero */
.plumbing-hero { background:#f8fafc; }
',
  180,
  true,
  false
)
ON CONFLICT (theme_guid, component_key) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  schema_json = EXCLUDED.schema_json,
  template_html = EXCLUDED.template_html,
  defaults_json = EXCLUDED.defaults_json,
  css = EXCLUDED.css,
  display_order = EXCLUDED.display_order,
  is_active = true,
  is_deleted = false,
  updated_on = CURRENT_TIMESTAMP;

-- -------------------------------------------------------------------------
-- Component 19: process-steps-grid
-- -------------------------------------------------------------------------
INSERT INTO public.theme_components (
  theme_guid,
  component_key,
  name,
  category,
  schema_json,
  template_html,
  defaults_json,
  css,
  display_order,
  is_active,
  is_deleted
)
VALUES (
  'a1000000-0000-0000-0000-000000000001',
  'process-steps-grid',
  'Process Steps Grid',
  'Process',
  '{
  "name": "Process Steps Grid",
  "category": "Process",
  "fields": {
    "title": {
      "type": "text",
      "label": "Section Heading",
      "default": "Three Simple Steps to Reliable Plumbing"
    },
    "steps": {
      "type": "array",
      "label": "Steps",
      "itemLabel": "Step",
      "itemSchema": {
        "number": {
          "type": "text",
          "label": "Step Number",
          "default": "01"
        },
        "title": {
          "type": "text",
          "label": "Step Title",
          "default": "Contact Princeton Air"
        },
        "desc": {
          "type": "textarea",
          "label": "Step Description",
          "default": "Reach out by phone or online. Speak directly with a local dispatch coordinator."
        }
      }
    },
    "image": {
      "type": "image",
      "label": "Side Image",
      "default": {
        "src": "/assets/img/4-three-simple-steps.webp",
        "alt": "Three Simple Steps"
      }
    }
  }
}'::jsonb,
  '<section class="steps-section bg-light-gray section-padding py-lg-6">
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
</section>',
  '{
  "title": "Three Simple Steps to Reliable Plumbing",
  "steps": [
    {
      "_id": "step-1",
      "number": "01",
      "title": "Contact Princeton Air",
      "desc": "Reach out by phone or book online. You speak directly with our team — no runaround, no endless menus."
    },
    {
      "_id": "step-2",
      "number": "02",
      "title": "Receive Clear Answers",
      "desc": "Our licensed plumber arrives on schedule, thoroughly inspects the issue, and provides flat-rate pricing before starting."
    },
    {
      "_id": "step-3",
      "number": "03",
      "title": "Precise Work Completed",
      "desc": "We complete the repair or installation according to state plumbing code, verify operation, and leave your home spotless."
    }
  ],
  "image": {
    "src": "/assets/img/4-three-simple-steps.webp",
    "alt": "Three Simple Steps"
  }
}'::jsonb,
  '/* Scoped Layer 2 styles for process-steps-grid */
.steps-section { background-color: #f8fafc; }
',
  190,
  true,
  false
)
ON CONFLICT (theme_guid, component_key) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  schema_json = EXCLUDED.schema_json,
  template_html = EXCLUDED.template_html,
  defaults_json = EXCLUDED.defaults_json,
  css = EXCLUDED.css,
  display_order = EXCLUDED.display_order,
  is_active = true,
  is_deleted = false,
  updated_on = CURRENT_TIMESTAMP;

-- -------------------------------------------------------------------------
-- Component 20: services-detailed-grid
-- -------------------------------------------------------------------------
INSERT INTO public.theme_components (
  theme_guid,
  component_key,
  name,
  category,
  schema_json,
  template_html,
  defaults_json,
  css,
  display_order,
  is_active,
  is_deleted
)
VALUES (
  'a1000000-0000-0000-0000-000000000001',
  'services-detailed-grid',
  'Detailed Services Grid (6 Cards)',
  'Services',
  '{
  "name": "Detailed Services Grid (6 Cards)",
  "category": "Services",
  "fields": {
    "title": {
      "type": "text",
      "label": "Section Title",
      "default": "Comprehensive Residential Plumbing Services"
    },
    "cards": {
      "type": "array",
      "label": "Service Cards",
      "itemLabel": "Service Card",
      "itemSchema": {
        "title": {
          "type": "text",
          "label": "Card Title",
          "default": "Emergency Plumbing"
        },
        "desc": {
          "type": "textarea",
          "label": "Summary",
          "default": "Immediate response when pipes burst or basements flood."
        }
      }
    }
  }
}'::jsonb,
  '<section class="services-section section-padding bg-light-gray" style="padding:48px 0;">
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
</section>',
  '{
  "title": "Comprehensive Residential Plumbing Services",
  "cards": [
    {
      "_id": "sc-1",
      "title": "Emergency Plumbing",
      "desc": "Fast local response when pipes freeze, burst, or overflow."
    },
    {
      "_id": "sc-2",
      "title": "Pipe Repair & Repiping",
      "desc": "Modern PEX and copper plumbing upgrades with minimal wall cutting."
    },
    {
      "_id": "sc-3",
      "title": "Drain Cleaning & Hydro-Jetting",
      "desc": "Camera video inspection and high-pressure root clearing."
    },
    {
      "_id": "sc-4",
      "title": "Water Heaters",
      "desc": "Traditional tank diagnostics, element replacement, and routine flushing."
    },
    {
      "_id": "sc-5",
      "title": "Tankless Water Heaters",
      "desc": "Endless on-demand hot water with high-efficiency energy rebates."
    },
    {
      "_id": "sc-6",
      "title": "Sewer Line Services",
      "desc": "Trenchless sewer repairs and main line replacements."
    }
  ]
}'::jsonb,
  '/* Scoped Layer 2 styles for services-detailed-grid */
.services-section { background:#f8fafc; }
',
  200,
  true,
  false
)
ON CONFLICT (theme_guid, component_key) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  schema_json = EXCLUDED.schema_json,
  template_html = EXCLUDED.template_html,
  defaults_json = EXCLUDED.defaults_json,
  css = EXCLUDED.css,
  display_order = EXCLUDED.display_order,
  is_active = true,
  is_deleted = false,
  updated_on = CURRENT_TIMESTAMP;

-- -------------------------------------------------------------------------
-- Component 21: testimonial-carousel
-- -------------------------------------------------------------------------
INSERT INTO public.theme_components (
  theme_guid,
  component_key,
  name,
  category,
  schema_json,
  template_html,
  defaults_json,
  css,
  display_order,
  is_active,
  is_deleted
)
VALUES (
  'a1000000-0000-0000-0000-000000000001',
  'testimonial-carousel',
  'Testimonials Carousel',
  'Social Proof',
  '{
  "name": "Testimonials Carousel",
  "category": "Social Proof",
  "fields": {
    "title": {
      "type": "text",
      "label": "Section Title",
      "default": "What Our Customers Are Saying"
    },
    "subtitle": {
      "type": "text",
      "label": "Subtitle",
      "default": "100% Satisfaction Guarantee"
    },
    "slides": {
      "type": "array",
      "label": "Review Slides",
      "itemLabel": "Slide (3 reviews)",
      "itemSchema": {
        "reviewer1_name": {
          "type": "text",
          "label": "Reviewer 1 Name",
          "default": "Steven Raffuel"
        },
        "reviewer1_text": {
          "type": "textarea",
          "label": "Reviewer 1 Quote",
          "default": "A/C went down unexpectedly in the middle of humid New Jersey summer. Princeton Air was out in less than 24 hours."
        },
        "reviewer2_name": {
          "type": "text",
          "label": "Reviewer 2 Name",
          "default": "Janet Grisi"
        },
        "reviewer2_text": {
          "type": "textarea",
          "label": "Reviewer 2 Quote",
          "default": "Princeton Air provided prompt and honest service for our water heater replacement. Highly recommend."
        }
      }
    }
  }
}'::jsonb,
  '<section class="testimonial-section bg-light-gray section-padding" aria-label="Customer testimonials">
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
</section>',
  '{
  "title": "What Our Customers Are Saying",
  "subtitle": "100% Satisfaction Guarantee",
  "slides": [
    {
      "_id": "sl-1",
      "reviewer1_name": "Steven Raffuel",
      "reviewer1_text": "A/C went down unexpectedly in the middle of humid New Jersey summer. Princeton Air was out in less than 24 hours and solved the problem with zero stress.",
      "reviewer2_name": "Janet Grisi",
      "reviewer2_text": "Fast, professional, and very thorough. They explained every detail before doing the work and left our home clean."
    }
  ]
}'::jsonb,
  '/* Scoped Layer 2 styles for testimonial-carousel */
.testimonial-section { background: #f8fafc; }
',
  210,
  true,
  false
)
ON CONFLICT (theme_guid, component_key) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  schema_json = EXCLUDED.schema_json,
  template_html = EXCLUDED.template_html,
  defaults_json = EXCLUDED.defaults_json,
  css = EXCLUDED.css,
  display_order = EXCLUDED.display_order,
  is_active = true,
  is_deleted = false,
  updated_on = CURRENT_TIMESTAMP;

-- -------------------------------------------------------------------------
-- Component 22: testimonials-grid
-- -------------------------------------------------------------------------
INSERT INTO public.theme_components (
  theme_guid,
  component_key,
  name,
  category,
  schema_json,
  template_html,
  defaults_json,
  css,
  display_order,
  is_active,
  is_deleted
)
VALUES (
  'a1000000-0000-0000-0000-000000000001',
  'testimonials-grid',
  'Customer Testimonials',
  'Social Proof',
  '{
  "name": "Customer Testimonials",
  "category": "Social Proof",
  "fields": {
    "eyebrow": { "type": "text", "label": "Eyebrow Badge", "default": "REVIEWS & TRUST" },
    "title": { "type": "text", "label": "Heading", "required": true, "default": "What Princeton Homeowners Say" },
    "subtitle": { "type": "textarea", "label": "Subtitle", "default": "Over 1,200 verified reviews from families across Mercer County." },
    "items": {
      "type": "array",
      "label": "Testimonials",
      "labelField": "author",
      "itemSchema": {
        "author": { "type": "text", "label": "Customer Name", "required": true },
        "role": { "type": "text", "label": "Location / Customer Type" },
        "rating": { "type": "text", "label": "Rating (e.g. ★★★★★)" },
        "quote": { "type": "textarea", "label": "Review Quote", "required": true }
      }
    }
  }
}
'::jsonb,
  '<section class="testimonials-section">
  <div class="testimonials-section__heading">
    {{#if eyebrow}}<p class="testimonials-section__eyebrow">{{eyebrow}}</p>{{/if}}
    <h2>{{title}}</h2>
    {{#if subtitle}}<p class="testimonials-section__subtitle">{{subtitle}}</p>{{/if}}
  </div>
  <div class="testimonials-grid">
    {{#each items}}
    <article class="testimonial-card">
      {{#if rating}}<div class="testimonial-card__rating">{{rating}}</div>{{/if}}
      <blockquote class="testimonial-card__quote">“{{quote}}”</blockquote>
      <div class="testimonial-card__footer">
        <div class="testimonial-card__badge">✓</div>
        <div class="testimonial-card__meta">
          <strong class="testimonial-card__author">{{author}}</strong>
          {{#if role}}<span class="testimonial-card__role">{{role}}</span>{{/if}}
        </div>
      </div>
    </article>
    {{/each}}
  </div>
</section>
',
  '{
  "eyebrow": "REVIEWS & TRUST",
  "title": "What Princeton Homeowners Say",
  "subtitle": "Over 1,200 verified reviews from families across Mercer County.",
  "items": [
    {
      "_id": "t-01",
      "author": "Sarah Jenkins",
      "role": "Homeowner in Princeton",
      "rating": "★★★★★",
      "quote": "Technician arrived within 45 minutes on a 90-degree afternoon. Diagnosed the blown capacitor and had our AC cooling right away."
    },
    {
      "_id": "t-02",
      "author": "Marcus Vance",
      "role": "Verified Customer",
      "rating": "★★★★★",
      "quote": "Transparent pricing with no hidden charges. Explained the repair options clearly before doing any work. Will definitely call again."
    },
    {
      "_id": "t-03",
      "author": "David & Elena Ross",
      "role": "Residential Client",
      "rating": "★★★★★",
      "quote": "Bizfire replaced our entire central cooling system. Professional crew, spotless cleanup, and our energy bills actually dropped."
    }
  ]
}
'::jsonb,
  '',
  220,
  true,
  false
)
ON CONFLICT (theme_guid, component_key) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  schema_json = EXCLUDED.schema_json,
  template_html = EXCLUDED.template_html,
  defaults_json = EXCLUDED.defaults_json,
  css = EXCLUDED.css,
  display_order = EXCLUDED.display_order,
  is_active = true,
  is_deleted = false,
  updated_on = CURRENT_TIMESTAMP;

-- -------------------------------------------------------------------------
-- Component 23: trust-bar
-- -------------------------------------------------------------------------
INSERT INTO public.theme_components (
  theme_guid,
  component_key,
  name,
  category,
  schema_json,
  template_html,
  defaults_json,
  css,
  display_order,
  is_active,
  is_deleted
)
VALUES (
  'a1000000-0000-0000-0000-000000000001',
  'trust-bar',
  'Trust Rating & Social Bar',
  'Social Proof',
  '{
  "name": "Trust Rating & Social Bar",
  "category": "Social Proof",
  "fields": {
    "rating": {
      "type": "text",
      "label": "Rating Score",
      "default": "4.7"
    },
    "reviewText": {
      "type": "text",
      "label": "Review Details",
      "default": "Based on 6634 reviews powered by Google"
    }
  }
}'::jsonb,
  '<section class="trust-bar section-padding" aria-label="Trust bar with reviews and social links">
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
</section>',
  '{
  "rating": "4.7",
  "reviewText": "Based on 6634 reviews powered by Google"
}'::jsonb,
  '/* Scoped Layer 2 styles for trust-bar */
.trust-bar { background: #fff; border-bottom: 1px solid #ECECEC; padding: 18px 0; }
.trust-left { display: flex; align-items: center; gap: 14px; }
.trust-rating { font-size: 24px; font-weight: 800; color: #172033; }
.trust-review { font-size: 14px; color: #5b6472; }
.trust-right { display: flex; gap: 10px; }
.trust-icon-btn { width: 36px; height: 36px; border-radius: 50%; background: #f8fafc; border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: center; color: #475569; text-decoration: none; }
',
  230,
  true,
  false
)
ON CONFLICT (theme_guid, component_key) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  schema_json = EXCLUDED.schema_json,
  template_html = EXCLUDED.template_html,
  defaults_json = EXCLUDED.defaults_json,
  css = EXCLUDED.css,
  display_order = EXCLUDED.display_order,
  is_active = true,
  is_deleted = false,
  updated_on = CURRENT_TIMESTAMP;

