# Do You Travel — Full Project

Your original marketing site, unchanged in design, now backed by a real database
with an admin panel to manage travel packages (add / edit / delete), instead of
the packages being hardcoded in the React file.

```
do-you-travel/
├── backend/     Node.js + Express API, SQLite database, admin auth, image uploads
└── frontend/    Your original React + Vite site, now fetching packages live + admin UI
```

## What changed vs. your original files

- **Nothing about the homepage's design, layout, or styling was touched.**
  `App.jsx` still renders exactly the same sections in the same order.
- The only functional change to `App.jsx`: the hardcoded `PACKAGES` array was
  removed and the page now fetches packages from the API when it loads. The
  "Group Fixed Departures" section (which used to hardcode two specific
  packages) now automatically shows whichever packages you mark **Featured**
  in the admin panel.
- Two new routes were added, invisible unless you go looking for them:
  - `/admin/login` — admin sign-in
  - `/admin` — package manager (add / edit / delete, with image upload)

## 1. First-time setup

You'll need [Node.js 18+](https://nodejs.org) installed.

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run seed        # creates the database, admin account, and starter packages
npm run dev          # starts the API on http://localhost:4000
```

The seed step creates:
- An admin login: **username `admin`, password `admin123`** (change these in
  `.env` before re-seeding, or just change them directly once a "change
  password" UI matters to you — not built yet, see note below)
- The 6 packages that were originally hardcoded in `App.jsx`, including which
  two are "Featured" (Kashmir Summer Escape, Rajasthan Heritage Tour) so the
  homepage looks identical to before out of the box.

**About package images:** by default the seeded packages point at the same
Unsplash URLs your original file used, so nothing breaks. If you want local
copies of those images stored in the project (for consistency / to not
depend on Unsplash staying up), set `DOWNLOAD_SEED_IMAGES=true` in
`backend/.env`, delete `backend/data.sqlite`, and run `npm run seed` again —
it will download each image into `backend/uploads/seed/` and store the local
path in the database instead. This step needs a normal internet connection
on your machine (it couldn't be done from the sandboxed environment that
built this project).

### Frontend

In a second terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev          # starts the site on http://localhost:5173
```

Visit `http://localhost:5173` — the homepage should look identical to your
original design, now loading its packages from the API. Visit
`http://localhost:5173/admin/login` to sign in and manage packages.

## 2. Using the admin panel

1. Go to `/admin/login`, sign in with the credentials above.
2. **Add Package** — fill in title, category, region, duration, price, an
   image (upload a file or paste a URL), tags, description, and inclusions.
   Optionally check "Feature this on the homepage" and add a dates/route
   label — this is what powers the two big cards in the "Group Fixed
   Departures" black section.
3. **Edit** any package the same way.
4. **Delete** a package (asks for confirmation first).
5. Every change appears on the live homepage immediately — no rebuild needed,
   since the homepage fetches live from the API on each page load.

Sessions last 12 hours, then you'll be asked to log in again.

## 3. Verified working

Before handing this off, I tested (via the API directly, and by building the
frontend for production):
- Backend seeds itself correctly on first run
- `GET /api/packages` returns the right data shape
- Admin login rejects bad passwords, accepts correct ones, issues a session token
- Creating, updating, and deleting a package all work and require a valid admin session (requests without one are rejected)
- Image upload works and is also admin-only
- `npm run build` on the frontend compiles cleanly with no errors
- The two originally-featured packages come back correctly flagged as "Featured"

I could not launch an actual browser inside the sandbox this was built in, so
please do a quick visual pass once you run it locally — but every piece the
UI depends on (the API, the build, the data) has been exercised directly.

## 4. Notes, defaults, and things you may want to change

- **Change the admin password**: edit `ADMIN_USERNAME` / `ADMIN_PASSWORD` in
  `backend/.env`, delete `backend/data.sqlite`, and run `npm run seed` again
  (this resets *all* data — only do this before you've added real packages,
  or export/re-add them after).
- **`JWT_SECRET`**: change this in `backend/.env` to a long random string
  before deploying anywhere public.
- **Deploying**: if you host the backend somewhere other than
  `localhost:4000`, update `VITE_API_URL` in `frontend/.env` (and
  `FRONTEND_ORIGIN` in `backend/.env`) to match.
- **Known low-risk dependency notes**: `express`'s `qs` dependency has a
  moderate-severity advisory with no fix yet in the Express 4 line (only
  relevant to malformed query strings, which this API doesn't rely on).
  `react-router-dom` v6's latest release still carries a moderate advisory
  whose fix requires the v7 major version (a breaking API change) — the two
  underlying issues (SSR-hydration deserialization and crafted-redirect
  `Link`/`navigate` calls) don't apply to how this app uses the library. Both
  are worth revisiting later with `npm audit fix --force` if you want to be
  fully current, just test after doing so.
- **Not built yet**: a "change password" screen in the admin UI, and a
  gallery of multiple photos per package (each package currently has one
  main image, matching your original card design).

## 5. Project structure reference

```
backend/
  server.js          Express app entry point
  db.js              SQLite schema
  seed.js            Creates admin account + starter packages (and optionally downloads images)
  routes/
    auth.js          POST /api/admin/login, GET /api/admin/verify
    packages.js       GET/POST/PUT/DELETE /api/packages
    upload.js         POST /api/admin/upload (image files)
  middleware/auth.js  JWT verification for admin-only routes
  uploads/            Uploaded package images end up here, served at /uploads/...

frontend/
  src/App.jsx          Your original homepage, now fetching packages via the API
  src/lib/api.js        All API calls the frontend makes
  src/admin/
    AdminLogin.jsx       /admin/login
    AdminDashboard.jsx   /admin — package list, add/edit/delete
    PackageForm.jsx      Shared add/edit form (modal)
    useAdminAuth.js       Session check + redirect-if-not-logged-in hook
```
