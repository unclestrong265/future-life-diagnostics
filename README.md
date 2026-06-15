# Future-Life Diagnostics — Company Profile Website

A single-page company profile website for **Future-Life Diagnostics Laboratory & Medical Technologies**.

Built with compiled **Tailwind CSS** (no CDN) and **Iconify** icons. Brand colours: navy `#243C6C` + leaf green `#60B43C` (see [colours.md](colours.md)).

## Project structure

```
index.html            → the website
src/input.css         → Tailwind source (edit styles here)
tailwind.config.js    → theme / brand colours
dist/output.css       → COMPILED stylesheet (generated — do not edit by hand)
logo-emblem.png       → F-LDx logo
hero-lab.png          → hero background image
```

## Editing & building

The site uses a compiled Tailwind stylesheet. If you change any Tailwind classes in `index.html`
(or styles in `src/input.css`), rebuild the CSS:

```bash
npm install        # first time only
npm run build      # rebuild dist/output.css (minified)
```

While actively editing, you can auto-rebuild on save:

```bash
npm run dev        # watches and rebuilds automatically
```

> If you only edit text/content (not classes), no rebuild is needed.

## Deploying (going live)

The site is fully static — just upload these files to any web host:

```
index.html
dist/output.css
logo-emblem.png
logo-lockup.png
hero-lab.png
```

(You do **not** need to upload `node_modules`, `src/`, or the config files.)

Free hosting options: **Netlify**, **Vercel**, **GitHub Pages**, or **Cloudflare Pages** —
drag-and-drop the folder, or connect a repo.

## External dependencies (loaded at runtime)

- **Iconify** icons — `code.iconify.design` (CDN)
- **Google Fonts** — Inter & Poppins

These require an internet connection on the visitor's browser (standard for most sites).
Tailwind CSS is **compiled locally** and self-hosted in `dist/output.css`.
