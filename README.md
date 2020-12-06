# website-for-historical-place

A small static website about Lumbini, the birthplace of Lord Buddha in Nepal.

## Pages

| File | Content |
| --- | --- |
| `lumbini.html` | Home page with the introduction, the story of Buddha and the Ashoka Pillar |
| `gallery.html` | Photo gallery |
| `sites.html` | The main sites of the Sacred Garden |
| `contact.html` | Contact form |
| `login.html` | Sign up style form that opens the home page on submit |

## Scripts and styles

| File | Purpose |
| --- | --- |
| `css/site.css` | Navigation bar and back to top button used by every page |
| `js/validate.js`, `js/form.js` | Contact form checks |
| `js/lightbox.js` | Full size photos in the gallery |
| `js/backtotop.js` | Back to top button on the home page |

## Run

There is nothing to build. Open `lumbini.html` in a browser. The pages expect
the images they reference (for example `buddha.jpg`, `gate.jpg` and
`pillar.jpg`) to sit in the same folder.

## Checking the markup

```
npx html-validate "*.html"
```

The rules are in `.htmlvalidate.json`. Inline styles are allowed because the pages still use them.

## Contact form checks

`js/validate.js` holds the checks (name, address, phone, email) and `js/form.js` shows a message under every field that has a problem before the form is sent. Run the tests with:

```
npm install
npm test
```
