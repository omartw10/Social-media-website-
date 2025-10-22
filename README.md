# Social-media-website-

This is a static front-end site (HTML/CSS/JS) that consumes the Tarmeez Academy API.

This repository has been prepared for static hosting (Netlify).

What I changed to make it Netlify-ready

- Replaced local `node_modules` references with CDN links for Bootstrap and Axios.
- Ensured `mainLogic.js` is loaded after vendor libraries.
- Removed any `file:///` absolute navigation and replaced with relative links.
- Added `index.html` which redirects to `home.html` so the site root works on Netlify.
- Added `dark-mode.css` and wired theme toggling in `mainLogic.js`.
- Added dark-mode overrides for comment blocks (id `comments`).

How to deploy (easy ways)

Option A — Drag & drop

1. Zip the project folder (do not include `node_modules` if present).
2. Go to https://app.netlify.com/drop and drop the folder to deploy.

Option B — Connect a Git repository

1. Push this project to a GitHub/GitLab/Bitbucket repository.
2. Login to Netlify and choose "New site from Git".
3. Connect your repo and set the publish directory to the repository root (empty string or `./`).
4. Click deploy.

Local testing

- You can open `index.html` or `home.html` directly in your browser for a quick smoke test.
- For a better local server (to avoid some browser CORS/file issues), run a simple static server, e.g. with Python:

```powershell
# PowerShell (Windows)
python -m http.server 8000
# then open http://localhost:8000/
```

Checklist (what you should verify after deploy)

- [ ] Page root loads (index redirects to home)
- [ ] Theme toggle appears and persists across reloads
- [ ] Comments (postDetails) show dark background when dark mode is selected
- [ ] No console errors about missing files or failed network requests (check browser DevTools)

Notes & suggestions

- I left `package-lock.json` in the repo; it's fine but not needed for a static deploy. You can remove it before zipping if you prefer.
- If you want the site to respect users' OS theme by default, I can add `prefers-color-scheme` detection.
- If you'd like a single-page app experience with client-side routing, I can add a `_redirects` file for Netlify.

If you want, I can:
- Add a `_redirects` file to map all SPA routes to `index.html`.
- Replace emoji theme toggle with an accessible SVG button and ARIA attributes.

