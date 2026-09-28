# Shree Baba Sidhnath Mandir — React + FastAPI

A cinematic 3D temple website (React 19 + Vite + Three.js) with a lightweight
**JSON-file backend** (FastAPI). No database, no CMS, no external services —
all content lives in editable JSON files and all media lives on the server's
file system.

## Architecture

```
├── backend/                ← FastAPI (Python)
│   ├── main.py             ← App entry: CORS, routers, static mounts
│   ├── requirements.txt
│   ├── routers/
│   │   ├── content.py      ← GET/POST /api/content
│   │   └── media.py        ← POST /api/upload/*, DELETE /api/media
│   ├── services/
│   │   ├── json_service.py ← Atomic JSON read/write
│   │   └── media_service.py← Upload/delete with type + path safety
│   ├── content/            ← The 12 JSON content files (source of truth)
│   └── media/              ← Uploaded files (images / audio / video)
├── src/                    ← React frontend
│   ├── admin/              ← Built-in Admin Panel (login + dashboard)
│   ├── utils/api.js        ← All backend calls in one place
│   └── utils/contentStore.js ← Loads JSON from backend at startup
└── public/                 ← Static legacy assets (/images, /audio, /media)
```

## API

| Method | Endpoint                 | Purpose                          |
|--------|--------------------------|----------------------------------|
| GET    | `/api/health`            | Health check                     |
| GET    | `/api/content`           | All sections                     |
| GET    | `/api/content/{section}` | One section                      |
| POST   | `/api/content/{section}` | Save one section                 |
| POST   | `/api/upload/image`      | Upload image (multipart `file`)  |
| POST   | `/api/upload/audio`      | Upload MP3                       |
| POST   | `/api/upload/video`      | Upload MP4                       |
| DELETE | `/api/media?path=...`    | Delete an uploaded file          |

Sections: `temple`, `home`, `contact`, `festivals`, `gallery`, `videos`,
`music`, `maps`, `social`, `images`, `theme`, `animations`.

## Local Development

Run both processes:

```bash
# Terminal 1 — backend (http://localhost:8001)
py -3.13 -m pip install -r backend/requirements.txt   # first time only
npm run backend

# Terminal 2 — frontend (http://localhost:5173, proxies /api to :8001)
npm install
npm run dev
```

## Admin Panel

Click the ⚙️ Settings icon in the navbar.

- Username: `MANDIR`
- Password: `MANDIR123`

(Client-side only — it protects the admin UI, there are no user accounts.)

Edit any section, upload media, then press **Save Changes**. The backend
writes the JSON files immediately and the website refreshes live — no page
reload, no ZIP export, no git round-trip.

## Production (Render Web Service)

`render.yaml` defines a single Python web service:

- **Build:** `pip install -r backend/requirements.txt && npm ci && npm run build`
- **Start:** `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
- **Health check:** `/api/health`

In production FastAPI serves the built frontend from `dist/` on the same
origin as the API, so no CORS configuration is needed. Environment
variables: `PYTHON_VERSION`, `NODE_VERSION`, `ENVIRONMENT`, and optional
`CORS_ORIGINS` (comma-separated).

> ⚠ Note: Render's free-tier disk is ephemeral — content saved or media
> uploaded on the server resets on redeploy. For permanent changes, copy the
> updated `backend/content/*.json` and `backend/media/` files back into the
> repo and push, or attach a persistent disk.

## Production Build (frontend only)

```bash
npm run build     # outputs dist/, served by FastAPI
npm run preview
```
