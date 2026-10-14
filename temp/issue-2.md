Yes. That is exactly how I would architect it. With hundreds of components, they should be data-driven and dynamically loaded, not imported into Next.js and compiled individually.

The key reason our component is:

schema.json
template.html
rather than:

Component.tsx
is that it can be loaded at runtime.

How it would work
Instead of Next.js having:

import Hero from "./components/Hero";
import Benefits from "./components/Benefits";
import Testimonials from "./components/Testimonials";
we have a component registry/database:

{
  "hero-01": {
    "schema": "/components/hero-01/schema.json",
    "template": "/components/hero-01/template.html"
  },
  "benefits-01": {
    "schema": "/components/benefits-01/schema.json",
    "template": "/components/benefits-01/template.html"
  }
}
Then a page layout simply says:

{
  "components": [
    {
      "type": "hero-01",
      "content": {
        "title": "AC Repair",
        "subtitle": "Fast service in Princeton"
      }
    },
    {
      "type": "benefits-01",
      "content": {
        "title": "Why Choose Us"
      }
    }
  ]
}
The runtime does:

hero-01
   ↓
load schema
load template
   ↓
inject content
   ↓
render
Adding component #101
This is where it becomes powerful.

You upload:

components/
└── service-hero-27/
    ├── schema.json
    └── template.html
Register it:

service-hero-27
and it’s immediately available in the editor.

No:

npm build
Next.js compile
Next.js deployment
should be necessary.

Even better: store them in the database
Eventually I wouldn’t even require physical component folders.

You could have:

COMPONENT TABLE
id
name
category
schema_json
template_html
version
status
thumbnail
created_at

For example:

ID	Name	Category
hero-001	Split Hero	Hero
hero-002	Center Hero	Hero
benefits-001	Benefits Grid	Benefits
faq-001	FAQ Accordion	FAQ
cta-001	Full Width CTA	CTA
The editor asks:

GET /api/components?category=hero
and gets whatever components currently exist.

You could add component #500 without touching the Next.js application.

What still gets compiled?
Only the editor/runtime engine itself:

NEXT.JS APPLICATION
│
├── Schema Form Engine       ← compiled
├── Template Renderer        ← compiled
├── Component Browser        ← compiled
├── Page Composer            ← compiled
├── Image Editor             ← compiled
├── Validation Engine        ← compiled
└── API Client               ← compiled
             │
             ▼
      DYNAMIC CONTENT
             │
     ┌───────┴────────┐
     │                │
 Component DB       Page DB
     │                │
 schema             layout
 template           content
The engine is compiled. Components are data.

One caveat: JavaScript behavior
This is another reason I would avoid arbitrary behavior.js files for components where possible.

If component #427 uploads arbitrary JavaScript, dynamic loading becomes more complicated and creates security/versioning problems.

Instead, components should declare known behaviors:

{
  "behavior": "accordion"
}
or:

{
  "behavior": "carousel"
}
The compiled runtime already knows how to execute accordion, carousel, form, modal, etc.

For something like a quote form:

{
  "behavior": "bizfire-form",
  "endpoint": "quote"
}
rather than uploading arbitrary JS.

That keeps hundreds or even thousands of components dynamically installable without rebuilding Next.js.

So I would make this an architectural requirement now:

Components are runtime data, not application source code.

That will make the system much more scalable.

