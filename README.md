# SPIN Website

Static website for the Sustainable Power and Irrigation for Nigeria (SPIN) Project.

The site is built with plain HTML, shared CSS, Tailwind CDN utilities, and static assets. There is no build step required for day-to-day content updates.

## Project Structure

- `index.html` is the homepage.
- `about.html`, `mandate.html`, `advertisements.html`, `participating-states.html`, `gallery.html`, `grievance.html`, and `contact.html` are main public pages.
- `states/` contains individual participating state pages.
- `ads/` contains dated advertisement detail pages.
- `docs/` contains public downloadable documents.
- `images/` contains logos, state maps, gallery images, and page media.
- `style.css` contains shared custom CSS used with Tailwind CDN classes.
- `template.html` is the starter structure for new static pages.
- `grievance-admin.html` is the GRM admin dashboard page.

## Local Preview

Open any `.html` file directly in a browser for quick checks.

For a local server, run this from the repository root:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/index.html
```

Production navigation uses clean paths such as `/about` and `/grievance`. If local clean URLs do not resolve, open the explicit file path such as `/about.html`.

## Navigation

The header navigation is repeated in static HTML files, so menu updates must be applied to each page that includes a menu.

Current primary menu order:

1. Home
2. About us
3. Mandate
4. Advertisements
5. News
6. Participating States
7. Gallery
8. Projects
9. Resources
10. Grievance
11. Contact

The full desktop navigation is shown from the `xl` breakpoint upward. Smaller screens use the hamburger menu to avoid horizontal overflow on tablets and mobile devices.

## Responsive Checks

Before handing off layout changes, test these widths in a browser:

- Mobile: `375px` wide
- Tablet: `768px` wide
- Small desktop: `1024px` wide
- Desktop: `1280px` wide and above

Check that the hamburger opens, the page does not scroll sideways, tables remain readable inside horizontal scroll wrappers, and footer columns do not feel cramped.

## Updating Content

- Keep page titles, link labels, and image `alt` text meaningful.
- Add downloadable files to `docs/` and images to `images/`.
- Use lowercase, hyphenated filenames for new assets when practical.
- Keep Tailwind utility classes consistent with nearby markup.
- Update repeated navigation markup across all relevant pages when a menu item changes.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the participating-states sequence and contribution checklist.
