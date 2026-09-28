# Media Folder — Shree Baba Sidhnath Mandir

All uploaded media is stored here inside the repository.
The built-in Admin Panel (⚙️ icon → Login) lets you upload images, MP3 and MP4
files. On **Export Content ZIP**, uploaded media is written into the
`custom/` subfolders below, preserving this exact folder structure.
Unzip the export into the project root and commit to publish.

## Folder Structure

```
public/media/
│
├── images/
│   ├── gallery/        ← Photo gallery uploads
│   ├── temple/         ← General temple images, video thumbnails
│   ├── hero/           ← Hero / banner images
│   ├── festivals/      ← Festival imagery
│   ├── icons/          ← Logo, favicon, icons
│   ├── backgrounds/    ← Page background images
│   └── custom/         ← Images uploaded via the Admin Panel
│
├── audio/              ← MP3 devotional music tracks
│   └── custom/         ← Audio uploaded via the Admin Panel
├── video/              ← MP4 temple videos
│   └── custom/         ← Videos uploaded via the Admin Panel
└── documents/          ← PDFs, event schedules, press kits
```

## URL Pattern

Files are served at their public path with no prefix:

| Folder                        | Public URL                          |
|-------------------------------|-------------------------------------|
| `public/media/images/gallery/` | `/media/images/gallery/filename.jpg` |
| `public/media/images/hero/`    | `/media/images/hero/filename.jpg`    |
| `public/media/audio/`          | `/media/audio/filename.mp3`          |
| `public/media/video/`          | `/media/video/filename.mp4`          |

## Naming Convention

- Use **lowercase** letters only
- Replace spaces with **underscores** (`_`)
- Include a **date prefix** for time-sensitive media: `2025_diwali_archway.jpg`
- For gallery images: `temple_<description>_<number>.jpg`
- For audio: `<raga-name>_<instrument>.mp3`

## Image Optimization

The Vite build plugin (`scripts/optimizeImages.js`) automatically:
1. Resizes images exceeding 2400×2400 px (preserving aspect ratio)
2. Generates a `.webp` companion for every `.jpg` / `.png` in `dist/`
3. Compresses JPEG at quality 82 and WebP at quality 80
4. Logs all transformations during `npm run build`

React components use the `<LazyImage>` component (`src/components/LazyImage.jsx`)
which serves `.webp` with a `.jpg` fallback via `<picture>` and only loads
the image once it enters the viewport (IntersectionObserver).

## Audio Metadata

The `src/utils/mediaMetadata.js` utility extracts duration, file size,
format, and estimated bitrate from any audio file using the Web Audio API.
This data is used in `AudioPlayer.jsx` to populate the playlist display.

## Video Metadata + Thumbnails

`src/utils/mediaMetadata.js` also handles videos: it uses an off-screen
`<video>` element to capture the first frame as a canvas thumbnail and
reads duration, resolution, and file size.
