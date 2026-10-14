Yes. For where you are now, I would absolutely start with a Git repository as the canonical Theme Library. You do not need a database/object-storage system yet.

Think of it as a separate repository from the Next.js application:

bizfire-theme-library/
│
├── themes/
│
│   ├── trades-modern/
│   │   ├── theme.json
│   │   ├── style.css
│   │   │
│   │   ├── components/
│   │   │   ├── hero-001/
│   │   │   │   ├── schema.json
│   │   │   │   └── template.html
│   │   │   │
│   │   │   ├── hero-002/
│   │   │   │   ├── schema.json
│   │   │   │   └── template.html
│   │   │   │
│   │   │   ├── benefits-001/
│   │   │   │   ├── schema.json
│   │   │   │   └── template.html
│   │   │   │
│   │   │   └── ...
│   │   │
│   │   └── pages/
│   │       ├── home-001.json
│   │       ├── service-001.json
│   │       ├── service-002.json
│   │       └── location-001.json
│   │
│   ├── medical-modern/
│   │   ├── theme.json
│   │   ├── style.css
│   │   ├── components/
│   │   └── pages/
│   │
│   └── legal-modern/
│       ├── theme.json
│       ├── style.css
│       ├── components/
│       └── pages/

Adding a new component

Developer creates:

themes/trades-modern/components/hero-027/

and adds:

schema.json
template.html

Then:

git add
git commit
git push

The component becomes part of that theme.

No changes to the Next.js source code should be required.

Adding a new page template

Same concept:

themes/trades-modern/pages/emergency-service-003.json

Containing:

{
  "id": "emergency-service-003",
  "name": "Emergency Service",
  "pageType": "service",
  "components": [
    { "type": "hero-027" },
    { "type": "trust-004" },
    { "type": "emergency-services-002" },
    { "type": "reviews-006" },
    { "type": "faq-003" },
    { "type": "cta-009" }
  ]
}

Commit and push.

Again, no Next.js code change.

Git gives us something very valuable: versioning

Suppose someone changes:

hero-027/template.html

and breaks 50 websites.

Git gives you:

commit A → working
commit B → broken

You can immediately identify and revert the change.

This also gives you a very clean development workflow:

Developer
    ↓
Creates/changes component
    ↓
Node validator
    ↓
Preview/test
    ↓
Git PR
    ↓
Review
    ↓
Merge
    ↓
Available to Bizfire

I would add one thing immediately: automated validation

When someone pushes a theme, CI should run:

Validate theme.json
Validate every schema.json
        ↓
Validate every template.html
        ↓
Check template variables against schema
        ↓
Extract every CSS class
        ↓
Check against style.css
        ↓
Validate every page JSON
        ↓
Check referenced components exist
        ↓
Render test pages
        ↓
PASS / FAIL

That becomes extremely valuable when you reach hundreds of components.

How Next.js gets the library

Initially, you don’t even need a sophisticated Theme API.

The Next.js server can have access to a checked-out copy of:

bizfire-theme-library

and dynamically read:

/themes/{theme}/components/
/themes/{theme}/pages/

Later, if multiple applications need it, put a thin API in front:

Git Theme Library
       ↓
Theme Service/API
       ↓
Next.js Editor
AI Compiler
Designer App
WordPress Publisher

The underlying Git repository can remain the canonical source.

So I would start with Git, not a database.

It’s simple, developer-friendly, version-controlled, reviewable, rollbackable, and perfectly capable of handling hundreds or thousands of small HTML/JSON component files.

The database/API layer can be introduced later when you need faster search, permissions, customer-specific libraries, or much larger scale.