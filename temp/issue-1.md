Yes. Let’s make the simplest possible real component: two editable lines of text + one editable image.

I would start with only 3 component files. manifest.json can wait; the folder name can identify the component.

Folder

components/
└── simple-image-section/
    ├── schema.json
    ├── editor.json
    └── template.html

The global theme provides:

theme/
└── style.css

And the actual page content is stored separately.

1. schema.json

Defines the three editable values:

{
  "title": {
    "type": "text",
    "required": true
  },
  "subtitle": {
    "type": "text"
  },
  "image": {
    "type": "image",
    "fields": {
      "src": "url",
      "alt": "text"
    }
  }
}

This says the component has:

title
subtitle
image.src
image.alt

2. editor.json

Tells Next.js what editing controls to display:

{
  "fields": [
    {
      "key": "title",
      "label": "Title",
      "control": "text"
    },
    {
      "key": "subtitle",
      "label": "Subtitle",
      "control": "text"
    },
    {
      "key": "image",
      "label": "Image",
      "control": "image"
    }
  ]
}

The editor automatically produces something conceptually like:

Title
[ AC Repair in Princeton             ]
Subtitle
[ Fast, reliable service             ]
Image
[ Choose Image ]  [ Replace ]

3. template.html

The actual component HTML:

<section class="image-section">
    <div class="image-section__content">
        <h2>{{title}}</h2>
        <p>{{subtitle}}</p>
    </div>
    <img
        class="image-section__image"
        src="{{image.src}}"
        alt="{{image.alt}}"
    >
</section>

There is no CSS in the component.

The classes:

image-section
image-section__content
image-section__image

must exist in the theme’s global style.css.

Your Node validator can verify that.

Actual content

For a particular page, the data might be:

{
  "title": "AC Repair in Princeton",
  "subtitle": "Fast, reliable service when you need it.",
  "image": {
    "src": "/uploads/ac-repair.jpg",
    "alt": "Technician repairing an air conditioner"
  }
}

The Next.js editor loads:

schema.json
     +
editor.json
     +
page content JSON
     ↓
EDITING UI

And preview uses:

template.html
     +
page content JSON
     +
style.css
     ↓
PREVIEW

After editing the title:

"title": "Emergency AC Repair in Princeton"

the preview immediately changes.

I would actually question whether we need editor.json

For something this simple, Node can infer the editor from schema.json:

{
  "title": {
    "type": "text",
    "label": "Title"
  },
  "subtitle": {
    "type": "text",
    "label": "Subtitle"
  },
  "image": {
    "type": "image",
    "label": "Image"
  }
}

Then we could reduce the component to just:

simple-image-section/
├── schema.json
└── template.html

with style.css global.

I think that should be our target: two files per normal component, with editor.json only when the component needs a custom editing layout.