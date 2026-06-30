# Contributing to the SPIN Website

Thank you for helping improve the SPIN website. This is a static HTML/CSS site, so most changes are made directly in HTML files, shared styles, images, and documents.

## Project Structure

- `index.html`, `about.html`, `mandate.html`, `advertisements.html`, `participating-states.html`, `gallery.html`, `grievance.html`, and `contact.html` are the main public pages.
- `style.css` contains shared custom CSS used alongside Tailwind CDN classes.
- `images/` stores logos, state maps, gallery media, and video assets.
- `docs/` stores public procurement documents and downloadable files.
- `ads/` stores dated advertisement pages.
- `states/` stores individual state pages.
- Files or folders with `copy`, `main`, or `saif` in the name are working snapshots. Do not treat them as the source of truth unless a maintainer asks you to.

## Local Preview

You can preview most page changes by opening the relevant `.html` file directly in a browser.

For a local server, run this from the repository root:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/index.html
```

Many navigation links use clean production paths such as `/about` and `/participating-states`. If your local server does not rewrite clean URLs to `.html` files, open the explicit file path instead, for example `/about.html`.

## Editing Pages

Keep the existing layout patterns unless the change requires a broader redesign.

- Use the current header, footer, spacing, colors, and typography patterns.
- Keep page titles, image `alt` text, and visible labels meaningful.
- Prefer editing the active page, not a backup copy.
- Keep Tailwind utility classes consistent with nearby markup.
- Put shared CSS in `style.css` only when the styling is reused or difficult to express cleanly in existing utilities.

## Updating Navigation

The site uses repeated static HTML menus instead of a shared component. When a primary menu item changes, update both desktop and mobile menus in every public page that includes the header.

The desktop menu uses `hidden xl:flex` and the mobile menu uses `xl:hidden` so tablets use the hamburger menu instead of overflowing the navigation bar.

## Updating Images and Documents

- Add site images to `images/`.
- Add downloadable documents to `docs/`.
- Use lowercase, hyphenated filenames for new files when practical, for example `state-workshop-report.pdf`.
- Compress large media before committing when possible.
- Update any page links that reference a renamed file.

## Participating States

The active state list lives in `participating-states.html`. Keep the list aligned with the stated total of participating states and avoid adding rows without a working state page.

Current display order:

| S/N | Model | State | Page |
| --- | --- | --- | --- |
| 1 | Model 1 | Adamawa | `states/adamawa.html` |
| 2 | Model 1 | Bauchi | `states/bauchi.html` |
| 3 | Model 1 | Benue | `states/benue.html` |
| 4 | Model 1 | Ebonyi | `states/ebonyi.html` |
| 5 | Model 1 | Ekiti | `states/ekiti.html` |
| 6 | Model 1 | Enugu | `states/enugu.html` |
| 7 | Model 1 | Kogi | `states/kogi.html` |
| 8 | Model 1 | Kwara | `states/kwara.html` |
| 9 | Model 1 | Nasarawa | `states/nasarawa.html` |
| 10 | Model 1 | Plateau | `states/plateau.html` |
| 11 | Model 2 | Cross-River | `states/cross-river.html` |
| 12 | Model 2 | Gombe | `states/gombe.html` |
| 13 | Model 2 | Jigawa | `states/jigawa.html` |
| 14 | Model 2 | Kaduna | `states/kaduna.html` |
| 15 | Model 2 | Kano | `states/kano.html` |
| 16 | Model 2 | Katsina | `states/katsina.html` |
| 17 | Model 2 | Kebbi | `states/kebbi.html` |
| 18 | Model 2 | Niger | `states/niger.html` |
| 19 | Model 2 | Sokoto | `states/sokoto.html` |
| 20 | Model 2 | Taraba | `states/taraba.html` |
| 21 | Model 2 | Yobe | `states/yobe.html` |
| 22 | Model 2 | Zamfara | `states/zamfara.html` |

When adding a new state:

1. Create or update the state page in `states/`.
2. Add the state map or related media to `images/`.
3. Add the row to `participating-states.html` in the agreed sequence.
4. Confirm the link works locally.

`generate_states.py` is a legacy helper and can overwrite existing state pages. Review it carefully before running it.

## Pre-Commit Checks

Before opening a pull request or handing off changes:

```bash
git status --short
```

Then manually check the pages you changed in a browser. For navigation-heavy changes, verify that every updated link resolves to an existing file or clean production route.

## Pull Request Checklist

- The change is scoped to the requested page, content, or asset.
- New links point to existing pages or documents.
- New images have useful `alt` text.
- The participating-states sequence remains correct when that page is edited.
- Browser preview has been checked for desktop and mobile widths when the layout changes.
