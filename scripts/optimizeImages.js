/**
 * scripts/optimizeImages.js
 *
 * Vite plugin: post-build image optimization using `sharp`.
 *
 * What it does after `vite build` writes dist/:
 *   1. Scans dist/media/images/**  and dist/images/** for JPG/PNG/WebP files
 *   2. Resizes any image exceeding MAX_DIMENSION on either axis (preserves AR)
 *   3. Re-compresses JPEGs at JPEG_QUALITY
 *   4. Generates a .webp companion at WEBP_QUALITY for every non-webp source
 *   5. Skips already-webp files and tiny files < MIN_BYTES
 *   6. Prints a concise summary table
 *
 * sharp is a devDependency — not bundled into the client JS at all.
 * It runs only during `npm run build` on the CI/build server.
 *
 * Configuration constants (tune here, not in vite.config.js):
 */

const MAX_DIMENSION = 2400;   // px — resize if width or height exceeds this
const JPEG_QUALITY  = 82;     // 1-100
const WEBP_QUALITY  = 80;     // 1-100
const MIN_BYTES     = 4096;   // skip optimization for files smaller than 4 KB
const SCAN_GLOBS    = [       // relative to dist/
  'media/images/**/*.{jpg,jpeg,png,webp}',
  'images/**/*.{jpg,jpeg,png,webp}',
];

import path   from 'node:path';
import fs     from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

/**
 * Lazily resolve `sharp` so that the plugin degrades gracefully if sharp is
 * not installed (e.g. during `npm install` before devDeps are available).
 */
function loadSharp() {
  try {
    return require('sharp');
  } catch {
    return null;
  }
}

/** Recursively collect files matching simple glob extensions */
function collectFiles(dir, extensions) {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  function walk(current) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (extensions.some((ext) => entry.name.toLowerCase().endsWith(ext))) {
        results.push(full);
      }
    }
  }
  walk(dir);
  return results;
}

/** Format bytes to a human-readable string */
function fmt(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export function optimizeImagesPlugin() {
  let outDir = 'dist';

  return {
    name: 'optimize-images',
    enforce: 'post',
    apply: 'build',

    configResolved(config) {
      outDir = config.build?.outDir ?? 'dist';
    },

    async closeBundle() {
      const sharp = loadSharp();
      if (!sharp) {
        console.warn(
          '\n[optimizeImages] sharp is not installed — skipping image optimization.\n' +
          '  Run: npm install -D sharp\n'
        );
        return;
      }

      const extensions = ['.jpg', '.jpeg', '.png', '.webp'];
      const scanDirs = [
        path.join(outDir, 'media', 'images'),
        path.join(outDir, 'images'),
      ];

      const files = scanDirs.flatMap((d) => collectFiles(d, extensions));

      if (files.length === 0) {
        console.log('\n[optimizeImages] No images found in dist/ — nothing to optimize.\n');
        return;
      }

      console.log(`\n[optimizeImages] Optimizing ${files.length} image(s)…`);

      const rows = [];
      let totalSavedBytes = 0;

      for (const filePath of files) {
        const stat = fs.statSync(filePath);
        if (stat.size < MIN_BYTES) continue;

        const ext  = path.extname(filePath).toLowerCase();
        const base = filePath.slice(0, -ext.length);
        const isWebP = ext === '.webp';

        let origSize = stat.size;
        let newSize  = origSize;
        let webpSize = 0;

        try {
          const img = sharp(filePath);
          const meta = await img.metadata();

          // Resize if either dimension exceeds MAX_DIMENSION
          const needsResize =
            (meta.width  && meta.width  > MAX_DIMENSION) ||
            (meta.height && meta.height > MAX_DIMENSION);

          let pipeline = needsResize
            ? img.resize({ width: MAX_DIMENSION, height: MAX_DIMENSION,
                           fit: 'inside', withoutEnlargement: true })
            : img;

          // Re-compress the original format in place
          let compressed;
          if (isWebP) {
            compressed = await pipeline.webp({ quality: WEBP_QUALITY }).toBuffer();
          } else if (ext === '.png') {
            compressed = await pipeline.png({ compressionLevel: 8, adaptiveFiltering: true }).toBuffer();
          } else {
            compressed = await pipeline
              .jpeg({ quality: JPEG_QUALITY, progressive: true, mozjpeg: true })
              .toBuffer();
          }

          // Only write if we actually saved space
          if (compressed.length < origSize) {
            fs.writeFileSync(filePath, compressed);
            newSize = compressed.length;
          }

          // Generate .webp companion (skip if the source is already webp)
          if (!isWebP) {
            const webpPath = `${base}.webp`;
            const webpBuf  = await sharp(filePath)
              .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION,
                        fit: 'inside', withoutEnlargement: true })
              .webp({ quality: WEBP_QUALITY })
              .toBuffer();
            fs.writeFileSync(webpPath, webpBuf);
            webpSize = webpBuf.length;
          }

          const saved = origSize - newSize;
          totalSavedBytes += saved;

          rows.push({
            file:     path.relative(outDir, filePath),
            orig:     fmt(origSize),
            new:      fmt(newSize),
            webp:     isWebP ? '(source)' : fmt(webpSize),
            saved:    saved > 0 ? `-${fmt(saved)}` : 'already optimal',
          });
        } catch (err) {
          console.warn(`  [optimizeImages] Skipped ${path.basename(filePath)}: ${err.message}`);
        }
      }

      // Print summary table
      if (rows.length > 0) {
        const col = (s, w) => String(s).padEnd(w);
        const header = `  ${col('File', 52)} ${col('Original', 10)} ${col('Optimized', 10)} ${col('WebP', 10)} ${col('Saved', 14)}`;
        const sep    = '  ' + '-'.repeat(header.length - 2);
        console.log(header);
        console.log(sep);
        for (const r of rows) {
          console.log(`  ${col(r.file, 52)} ${col(r.orig, 10)} ${col(r.new, 10)} ${col(r.webp, 10)} ${col(r.saved, 14)}`);
        }
        console.log(sep);
        console.log(`  Total saved: ${fmt(totalSavedBytes)} across ${rows.length} file(s)\n`);
      }
    },
  };
}
