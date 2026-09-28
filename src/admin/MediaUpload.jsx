import React, { useState, useCallback, useRef } from 'react';
import { Upload, Image, Music, Video, X, Trash2 } from 'lucide-react';
import { useAdmin } from './AdminContext';

const formatFileSize = (bytes) => {
  if (bytes === 0 || !bytes) return '';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const detectMediaType = (value, acceptHint = '') => {
  const v = (value || '').toLowerCase();
  const hint = (acceptHint || '').toLowerCase();
  if (v.endsWith('.mp3') || v.includes('/audio/')) return 'audio';
  if (v.endsWith('.mp4') || v.includes('/video/')) return 'video';
  if (!v) {
    if (hint.includes('audio') || hint.includes('.mp3')) return 'audio';
    if (hint.includes('video') || hint.includes('.mp4')) return 'video';
  }
  return 'image';
};

const validateAccept = (file, acceptStr) => {
  if (!acceptStr) return true;
  const acceptItems = acceptStr.split(',').map((s) => s.trim().toLowerCase());
  const fileType = (file.type || '').toLowerCase();
  const fileName = (file.name || '').toLowerCase();
  return acceptItems.some((item) => {
    if (item.endsWith('/*')) {
      const prefix = item.slice(0, -2);
      return fileType.startsWith(prefix + '/');
    }
    if (item.startsWith('.')) {
      return fileName.endsWith(item);
    }
    return fileType === item;
  });
};

/**
 * MediaUpload — uploads a file straight to the FastAPI backend and stores the
 * returned relative path (e.g. "/api/media/images/1699_photo.jpg") in JSON.
 * No data URLs, no ZIP export, no client-side blob storage.
 */
export default function MediaUpload({
  category = 'Upload',
  accept = 'image/*,.mp3,.mp4',
  currentValue = '',
  onUpload,
  onRemove,
  onReplace,
}) {
  const admin = useAdmin();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [lastSize, setLastSize] = useState(0);
  const inputRef = useRef(null);
  const replaceInputRef = useRef(null);

  const hasFile = !!currentValue;
  const mediaType = detectMediaType(currentValue, accept);
  const baseName = currentValue ? currentValue.split('/').pop() : '';

  const uploadFile = useCallback(
    async (file, isReplace) => {
      setError('');
      if (!file) return;
      if (!validateAccept(file, accept)) {
        setError(`Invalid file type. Accepted: ${accept}`);
        return;
      }
      setIsLoading(true);
      try {
        const info = await admin.uploadMedia(file);
        setLastSize(info.size || 0);
        const storedPath = info.url;
        if (isReplace) {
          if (currentValue && currentValue !== storedPath) {
            admin.deleteMedia(currentValue).catch(() => {});
          }
          if (onReplace) onReplace(storedPath);
          else if (onUpload) onUpload(storedPath);
        } else if (onUpload) {
          onUpload(storedPath);
        }
      } catch (err) {
        setError(err.message || 'Upload failed');
      } finally {
        setIsLoading(false);
      }
    },
    [accept, admin, currentValue, onUpload, onReplace]
  );

  const handleInputChange = useCallback(
    (e) => {
      const file = e.target.files && e.target.files[0];
      uploadFile(file, false);
      if (inputRef.current) inputRef.current.value = '';
    },
    [uploadFile]
  );

  const handleReplaceChange = useCallback(
    (e) => {
      const file = e.target.files && e.target.files[0];
      uploadFile(file, true);
      if (replaceInputRef.current) replaceInputRef.current.value = '';
    },
    [uploadFile]
  );

  const handleRemove = useCallback(async () => {
    setError('');
    if (currentValue) {
      try {
        await admin.deleteMedia(currentValue);
      } catch {
        /* field is cleared regardless */
      }
    }
    setLastSize(0);
    if (onRemove) onRemove();
  }, [admin, currentValue, onRemove]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const file = e.dataTransfer.files && e.dataTransfer.files[0];
      uploadFile(file, hasFile);
    },
    [uploadFile, hasFile]
  );

  const MediaIcon = mediaType === 'audio' ? Music : mediaType === 'video' ? Video : Image;

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between">
        <label className="font-cinzel text-sm font-semibold text-gold-300 tracking-wider">
          {category}
        </label>
        {baseName && (
          <span className="font-marcellus text-[10px] text-sacred-ivory/50 truncate max-w-[60%] text-right">
            {baseName}
            {lastSize ? ` • ${formatFileSize(lastSize)}` : ''}
          </span>
        )}
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
          isDragging
            ? 'ring-2 ring-gold-400 ring-offset-2 ring-offset-navy-950 scale-[1.01]'
            : ''
        }`}
      >
        <div
          className={`glass-panel-dark backdrop-blur-xl border transition-all duration-300 ${
            isDragging
              ? 'border-gold-400 bg-navy-900/70'
              : 'border-gold-500/30'
          }`}
        >
          {hasFile ? (
            <div className="p-4">
              <div className="relative rounded-xl overflow-hidden bg-navy-950/80 border border-gold-500/20">
                {isLoading && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-navy-950/80 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 border-2 border-gold-400/30 border-t-gold-400 rounded-full animate-spin" />
                      <span className="font-cinzel text-xs text-gold-300 tracking-wider">
                        UPLOADING...
                      </span>
                    </div>
                  </div>
                )}

                {mediaType === 'image' && (
                  <div className="flex items-center justify-center bg-navy-950 min-h-[180px] max-h-[280px]">
                    <img
                      src={currentValue}
                      alt={baseName || category}
                      className="w-full h-full object-contain max-h-[280px]"
                    />
                  </div>
                )}

                {mediaType === 'audio' && (
                  <div className="p-5 flex flex-col items-center gap-4 bg-navy-950 min-h-[180px]">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-500/20 to-navy-900 border border-gold-400/40 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.25)]">
                      <Music className="w-7 h-7 text-gold-400" />
                    </div>
                    <audio controls src={currentValue} className="w-full max-w-md h-10" />
                  </div>
                )}

                {mediaType === 'video' && (
                  <div className="p-4 flex flex-col items-center gap-4 bg-navy-950 min-h-[180px]">
                    <video
                      controls
                      src={currentValue}
                      className="w-full max-h-[260px] rounded-lg bg-black"
                    />
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 justify-end">
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-900/80 hover:bg-navy-800 border border-gold-500/30 hover:border-gold-400/50 text-gold-300 hover:text-gold-200 cursor-pointer transition-all font-cinzel text-xs tracking-wider group">
                  <Upload className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
                  REPLACE
                  <input
                    ref={replaceInputRef}
                    type="file"
                    accept={accept}
                    onChange={handleReplaceChange}
                    className="hidden"
                    disabled={isLoading}
                  />
                </label>
                <button
                  onClick={handleRemove}
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 hover:border-red-500/50 text-red-300 hover:text-red-200 transition-all font-cinzel text-xs tracking-wider group disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                  REMOVE
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <label
                className={`block rounded-xl border-2 border-dashed cursor-pointer transition-all duration-300 ${
                  isDragging
                    ? 'border-gold-400 bg-gold-500/10'
                    : 'border-gold-500/30 hover:border-gold-400/60 bg-navy-950/40 hover:bg-navy-900/50'
                }`}
              >
                <div className="flex flex-col items-center justify-center py-10 px-4 gap-4">
                  {isLoading ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 border-2 border-gold-400/30 border-t-gold-400 rounded-full animate-spin" />
                      <span className="font-cinzel text-xs text-gold-300 tracking-wider">
                        UPLOADING...
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="relative">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-navy-900 via-navy-850 to-navy-900 border border-gold-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.1)]">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold-500/15 to-navy-950 border border-gold-400/30 flex items-center justify-center">
                            <MediaIcon className="w-6 h-6 text-gold-400" />
                          </div>
                        </div>
                        <div className="absolute -top-1 -right-1 flex -space-x-2">
                          <div className="w-5 h-5 rounded-lg bg-navy-850 border border-gold-400/30 flex items-center justify-center">
                            <Image className="w-2.5 h-2.5 text-gold-300" />
                          </div>
                          <div className="w-5 h-5 rounded-lg bg-navy-850 border border-gold-400/30 flex items-center justify-center">
                            <Music className="w-2.5 h-2.5 text-gold-300" />
                          </div>
                        </div>
                      </div>
                      <div className="text-center space-y-1">
                        <p className="font-cinzel text-sm font-semibold text-gold-gradient tracking-wider">
                          CLICK TO UPLOAD
                        </p>
                        <p className="font-marcellus text-xs text-sacred-ivory/50">
                          or drag & drop your file here
                        </p>
                        <p className="font-marcellus text-[10px] text-sacred-ivory/30 mt-2">
                          Saved on the server • JPG, PNG, WEBP, MP3, MP4
                        </p>
                      </div>
                    </>
                  )}
                </div>
                <input
                  ref={inputRef}
                  type="file"
                  accept={accept}
                  onChange={handleInputChange}
                  className="hidden"
                  disabled={isLoading}
                />
              </label>
            </div>
          )}

          {error && (
            <div className="mx-4 mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/30 flex items-start gap-3">
              <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-cinzel text-[11px] text-red-300 tracking-wider uppercase">
                  Upload Error
                </p>
                <p className="font-marcellus text-xs text-red-400/80 mt-0.5">
                  {error}
                </p>
              </div>
            </div>
          )}
        </div>

        {isDragging && (
          <div className="absolute inset-0 rounded-2xl pointer-events-none bg-divine-glow animate-pulse-glow" />
        )}
      </div>
    </div>
  );
}
