# Media Folder — Shree Baba Sidhnath Mandir

All uploaded media is stored here inside the repository.
Decap CMS uploads files into the correct subfolder automatically based on
the `media_folder` / `public_folder` mapping in `public/admin/index.html`.

## Folder Structure

```
public/media/
│
├── images/
│   ├── gallery/        ← Photo gallery uploads (CMS: Photo Gallery collection)
│   ├── temple/         ← General temple images, video thumbnails
│   ├── hero/           ← Hero / banner images (CMS: Featured Images → Hero)
│   ├── festivals/      ← Festival imagery (CMS: Featured Images → Festivals)
│   ├── icons/          ← Logo, favicon, icons (CMS: Featured Images → Logo)
│   └── backgrounds/    ← Page background images
│
├── audio/              ← MP3 devotional music tracks
├── video/              ← MP4 temple videos
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
