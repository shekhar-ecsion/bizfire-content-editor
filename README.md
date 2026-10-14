# Bizfire Dynamic Component + Page Editor POC

This Next.js POC demonstrates the minimal Bizfire component contract and page composition editing.

## Component contract
Each component is discovered automatically from `/components/<component-id>/` and requires only:
- `schema.json` — editable fields
- `template.html` — renderable HTML

All visual CSS lives in the single global `app/style.css`. There is no component CSS, page CSS, PHP template, controller, React component, or compile-time import per component.

## Included components
1. `simple-image-section` — title, subtitle, image + alt text
2. `benefits-grid` — title, subtitle, three benefit lines
3. `cta-section` — title, subtitle, button label + URL

## Page editor POC
The page is an ordered JSON array of component instances. The UI supports:
- dynamically discovered component library
- select/edit a component from its schema
- live full-page preview
- add components
- remove components
- reorder components
- inspect the resulting page JSON

## Run
```bash
npm install
npm run dev
```
Then open http://localhost:3000.

## Add component #4
Create a new folder under `components/` containing `schema.json` and `template.html`, restart the dev server for this filesystem POC, and it will be discovered automatically. In production, the same contract can be served from a database/API so no Next.js rebuild is required.
