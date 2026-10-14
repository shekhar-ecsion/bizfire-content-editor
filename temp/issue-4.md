Yes. Absolutely. I would make this a core feature of the Next.js editor.

A Page Type defines what kind of page it is. A Page Variant defines a particular component composition for that page type.

For example:

Page Type: Service
Variants:
├── service-standard
├── service-emergency
├── service-long-form
├── service-conversion
└── service-premium

Each variant is essentially a different page layout JSON.

In the Next.js editor
You could start with:

SERVICE PAGE — Standard

[ Hero 017              ]
[ Trust Bar 004         ]
[ Service Content 012   ]
[ Benefits 007          ]
[ Reviews 003           ]
[ FAQ 005               ]
[ CTA 011               ]

Then visually:

+ Add Section
Remove Section
↑ Move Up
↓ Move Down
Replace Component
Duplicate Component
You change it to:

[ Hero 027              ]
[ Emergency Banner 002  ]
[ Trust Bar 004         ]
[ Service Content 012   ]
[ Benefits 014          ]
[ Reviews 003           ]
[ FAQ 005               ]
[ CTA 019               ]
Then choose:

Save as Page Variant

Name:

Emergency Service
The editor generates:

themes/trades-modern/pages/
service-emergency.json
containing:

{
"id": "service-emergency",
"name": "Emergency Service",
"pageType": "service",

"components": [
{ "type": "hero-027" },
{ "type": "emergency-banner-002" },
{ "type": "trust-004" },
{ "type": "service-content-012" },
{ "type": "benefits-014" },
{ "type": "reviews-003" },
{ "type": "faq-005" },
{ "type": "cta-019" }
]
}

Important distinction
I would keep three concepts separate:

Concept	Example	Purpose
Page Type	service	Semantic purpose/schema
Page Variant	service-emergency	Reusable component composition
Actual Page	/emergency-ac-repair/	Customer content using that composition
So:

SERVICE
Page Type
   │
   ├── Standard Variant
   ├── Emergency Variant
   ├── Long Form Variant
   └── Conversion Variant
              │
              ▼
        Actual Pages
Multiple actual pages can use the same variant.

Even better, create variants from actual pages
Suppose AI creates a particularly good /water-heater-repair/ page.

Someone modifies it in the editor and likes the result:

Hero 12
Trust 03
Problem/Solution 07
Benefits 11
Process 04
Reviews 08
FAQ 02
CTA 14
They could select:

Save Layout as New Variant

The system strips out the customer’s actual content and saves only the reusable composition:

{
  "pageType": "service",
  "components": [
    {"type": "hero-012"},
    {"type": "trust-003"},
    {"type": "problem-solution-007"},
    {"type": "benefits-011"},
    {"type": "process-004"},
    {"type": "reviews-008"},
    {"type": "faq-002"},
    {"type": "cta-014"}
  ]
}
Now that becomes a reusable theme asset.

One important safeguard
I would not have every user modification automatically change the Git theme library.

There should be a deliberate distinction:

Edit this page
      ↓
Only changes this customer's page
Save as Site Variant
↓
Available within this website


Publish to Theme Library
↓
Creates Git page variant
↓
Validation
↓
PR/review
↓
Reusable everywhere

That protects the canonical theme library from accumulating hundreds of accidental variations.

This also sets us up very nicely for AI composition later. Instead of AI inventing page structure from scratch every time, it can first choose:

Page type = Service → choose the best approved Service variant → populate semantic content → optionally recommend component substitutions.

That gives you controlled variability rather than uncontrolled AI-generated design, which fits the architecture we’ve been building.