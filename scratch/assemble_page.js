const fs = require('fs');
const path = require('path');

const compRoot = path.join(process.cwd(), 'workspaces/test-workspace-001/theme/components');

function loadDefaults(id) {
  const defFile = path.join(compRoot, id, 'defaults.json');
  if (fs.existsSync(defFile)) {
    return JSON.parse(fs.readFileSync(defFile, 'utf8'));
  }
  return {};
}

const sectionTypes = [
  'plumbing-hero-split',
  'cta-strip',
  'plumbing-order-checklist',
  'plumbing-services-grid',
  'plumbing-care-video',
  'trust-bar',
  'accordion-map-section',
  'process-steps-grid',
  'cta-banner-dual',
  'testimonial-carousel',
  'coupon-grid',
  'financing-cta',
  'comfort-club-perks',
  'plumbing-spotlight-hero',
  'plumbing-services-grid',
  'services-detailed-grid',
  'cta-banner-dual',
  'plumbing-hvac-cross-sell',
  'comfort-closing-cta',
  'certifications-marquee'
];

const pageSections = sectionTypes.map((type, idx) => ({
  type,
  content: loadDefaults(type)
}));

const pageJson = {
  postId: 'demo-plumbing',
  slug: 'new-jersey-plumbing-services',
  title: 'New Jersey Plumbing Services | Princeton Air',
  templateId: 'demo-plumbing',
  lastSavedAt: new Date().toISOString(),
  lastPublishedAt: null,
  sections: pageSections
};

// Write page to workspaces/test-workspace-001/pages/demo-plumbing.json
const pagesDir = path.join(process.cwd(), 'workspaces/test-workspace-001/pages');
if (!fs.existsSync(pagesDir)) fs.mkdirSync(pagesDir, { recursive: true });
fs.writeFileSync(path.join(pagesDir, 'demo-plumbing.json'), JSON.stringify(pageJson, null, 2));

// Write template variant to workspaces/test-workspace-001/theme/page-templates/demo-plumbing.json
const templatesDir = path.join(process.cwd(), 'workspaces/test-workspace-001/theme/page-templates');
if (!fs.existsSync(templatesDir)) fs.mkdirSync(templatesDir, { recursive: true });

const templateVariant = {
  id: 'demo-plumbing',
  name: 'Real-World Production Plumbing Landing Page',
  description: 'Complete 20-section landing page matching the design team specification with video, carousels, coupons, and guarantee stats.',
  components: sectionTypes.map(type => ({ type }))
};

fs.writeFileSync(path.join(templatesDir, 'demo-plumbing.json'), JSON.stringify(templateVariant, null, 2));

console.log('Page and template variant created successfully!');
console.log('Total sections in page:', pageSections.length);
