/**
 * LazyImage.jsx
 *
 * Production-grade lazy-loading image component.
 *
 * Features:
 *   • Defers loading until the element is within `rootMargin` of the viewport
 *     using a single shared IntersectionObserver (one observer for the page).
 *   • Serves WebP with the original format as fallback via <picture>.
 *   • Shows a shimmer placeholder while loading.
 *   • Fades in the image on load to avoid layout flash.
 *   • Resolves WebP sibling URLs via resolveImage() from mediaUtils.
 *   • Fully accessible: passes through alt, role, aria-* props.
 *   • Zero external dependencies beyond React.
 *
 * Usage:
 *   <LazyImage
 *     src="/media/images/gallery/arch.jpg"
 *     alt="Temple arch"
 *     className="w-full h-full object-cover"
 *     aspectRatio="portrait"     // "landscape" | "portrait" | "square" — optional
 *     rootMargin="200px"         // default "300px" — how early to start loading
 *     priority                   // set on above-the-fold images to skip lazy loading
 *   />
 */

import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from 'react';
import { resolveImage } from '../utils/mediaUtils';

// ─── Shared IntersectionObserver (one per page, not one per image) ────────────

const ObserverContext = createContext(null);

/**
 * Wrap your app (or a section) with <LazyImageProvider> if you want fine
 * control over rootMargin / threshold. Otherwise LazyImage creates its own
 * observer internally with sensible defaults.
 */
export function LazyImageProvider({ rootMargin = '300px', children }) {
  const observerRef  = useRef(null);
  const callbacksRef = useRef(new Map()); // element → callback

  if (!observerRef.current && typeof IntersectionObserver !== 'undefined') {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cb = callbacksRef.current.get(entry.target);
            if (cb) {
              cb();
              observerRef.current.unobserve(entry.target);
              callbacksRef.current.delete(entry.target);
            }
          }
        });
      },
      { rootMargin, threshold: 0 }
    );
  }

  const observe = useCallback((el, cb) => {
    if (!el || !observerRef.current) {
      cb(); // SSR / no-IO fallback: load immediately
      return;
    }
    callbacksRef.current.set(el, cb);
    observerRef.current.observe(el);
  }, []);

  const unobserve = useCallback((el) => {
    if (!el || !observerRef.current) return;
    observerRef.current.unobserve(el);
    callbacksRef.current.delete(el);
  }, []);

  return (
    <ObserverContext.Provider value={{ observe, unobserve }}>
      {children}
    </ObserverContext.Provider>
  );
}

// ─── Internal fallback observer (used when no Provider is in the tree) ────────

let _globalObserver = null;
const _globalCallbacks = new Map();

function getGlobalObserver(rootMargin = '300px') {
  if (typeof IntersectionObserver === 'undefined') return null;
  if (!_globalObserver) {
    _globalObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cb = _globalCallbacks.get(entry.target);
            if (cb) {
              cb();
              _globalObserver.unobserve(entry.target);
              _globalCallbacks.delete(entry.target);
            }
          }
        });
      },
      { rootMargin, threshold: 0 }
    );
  }
  return _globalObserver;
}

// ─── LazyImage component ──────────────────────────────────────────────────────

const ASPECT_CLASSES = {
  portrait:  'aspect-[3/4]',
  landscape: 'aspect-[4/3]',
  square:    'aspect-square',
};

export default function LazyImage({
  src,
  alt = '',
  className = '',
  aspectRatio,   // "landscape" | "portrait" | "square" — adds aspect-ratio wrapper
  rootMargin = '300px',
  priority = false,   // true = load immediately (above-the-fold hero images)
  onLoad,
  onError,
  style,
  ...rest
}) {
  const wrapperRef     = useRef(null);
  const [loaded, setLoaded]   = useState(false);
  const [visible, setVisible] = useState(priority); // priority images are immediately visible
  const [errored, setErrored] = useState(false);

  const ctx = useContext(ObserverContext);

  // Resolve WebP sibling
  const { src: resolvedSrc, webpSrc } = resolveImage(src);

  // ── Intersection observation ──────────────────────────────────────────────
  useEffect(() => {
    if (priority || !wrapperRef.current) {
      setVisible(true);
      return;
    }

    const el = wrapperRef.current;
    const markVisible = () => setVisible(true);

    if (ctx) {
      ctx.observe(el, markVisible);
      return () => ctx.unobserve(el);
    }

    // Fallback: global observer
    const observer = getGlobalObserver(rootMargin);
    if (observer) {
      _globalCallbacks.set(el, markVisible);
      observer.observe(el);
      return () => {
        observer.unobserve(el);
        _globalCallbacks.delete(el);
      };
    }

    // Final fallback: no IntersectionObserver (old browser / SSR)
    setVisible(true);
  }, [priority, rootMargin, ctx]);

  const handleLoad = useCallback(() => {
    setLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setErrored(true);
    onError?.();
  }, [onError]);

  // ── Wrapper classes ───────────────────────────────────────────────────────
  const aspectClass = aspectRatio ? (ASPECT_CLASSES[aspectRatio] ?? '') : '';

  return (
    <div
      ref={wrapperRef}
      className={`relative overflow-hidden ${aspectClass}`}
      style={style}
    >
      {/* Shimmer placeholder — visible until image loads */}
      {!loaded && !errored && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-navy-900 animate-pulse"
          style={{
            background: 'linear-gradient(90deg, #0d1f3c 25%, #1a3560 50%, #0d1f3c 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.6s infinite',
          }}
        />
      )}

      {/* Error state */}
      {errored && (
        <div
          aria-label="Image unavailable"
          className="absolute inset-0 flex items-center justify-center bg-navy-950 text-sacred-ivory/30 text-xs font-marcellus"
        >
          <span>Image unavailable</span>
        </div>
      )}

      {/* Actual image — only injected into DOM once visible */}
      {visible && !errored && (
        <picture>
          {/* WebP source (preferred by browsers that support it) */}
          {webpSrc && <source srcSet={webpSrc} type="image/webp" />}

          <img
            src={resolvedSrc}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            className={`${className} transition-opacity duration-500 ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            {...rest}
          />
        </picture>
      )}
    </div>
  );
}
