# AGENTS.md

## Layout
- `backend/` — Express 5 + Mongoose 9, CommonJS, entry `server.js`, port 5001. API routes are under `routes/`.
- `frontend/` — React 18 + Vite 8, ESM, feature modules under `src/features/`, shared UI in `src/components/`, contexts in `src/context/`.
- Root has no package.json — install/run each side separately.

## Commands
- Backend: `cd backend && npm run dev` (nodemon) / `npm start` / `npm test` / `npm run seed:quiz`
- Frontend: `cd frontend && npm run dev` / `npm run build` / `npm run lint`
- Frontend: run `npm run lint` before committing frontend changes. CI runs backend tests, frontend lint, and frontend build.

## Environment
- Copy `backend/.env.example` → `backend/.env` (MONGO_URI, JWT_SECRET, FRONTEND_URL, PORT, CLOUD_NAME/CLOUD_KEY/CLOUD_SECRET) and `frontend/.env.example` → `frontend/.env` (VITE_API_URL). Both are gitignored — never commit.
- Backend needs MongoDB reachable before server start; `connectDB()` runs at boot.

## Conventions / gotchas
- CORS in `backend/server.js` allows the exact `FRONTEND_URL`; non-production mode also allows Vite at `http://localhost:5173` and `http://localhost:5174`. Vercel preview origins need to be configured as `FRONTEND_URL`; there is no wildcard or `CORS_ORIGINS` support.
- Rate limit: 150 req / 15 min per authenticated user or anonymous client IP in `server.js`.
- Resource and avatar uploads use in-memory Multer validation and Cloudinary storage; no upload route writes to or serves `backend/uploads/`.
- Frontend routing is defined in `src/app/App.jsx` (lazy imports); `src/app/routes.jsx` is an intentional empty stub.
- Quiz feature has its own duplicate Login/Register/Navbar pages under `features/quiz/pages` and `features/quiz/components/UI`; main pages live in `src/pages/`.
- `frontend/dist/` is a committed-looking build artifact dir; it's gitignored — don't hand-edit.
- Vercel SPA rewrite (`vercel.json`) sends all paths to `/`; keep it when adding routes.
- Quiz PDF export deps (html2pdf, html2canvas, jspdf) are split into a `pdf-vendor` chunk in `vite.config.js` — keep heavy imports behind lazy routes.
- OpenCode itself is configured via `opencode.json` (document-generator MCP server enabled).
