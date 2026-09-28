import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Upload, Image, Music, Video, X, Trash2 } from 'lucide-react';
import { useAdmin } from './AdminContext';

const formatFileSize = (bytes) => {
  if (bytes === 0 || !bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const detectMediaType = (fileName, dataUrl) => {
  const name = (fileName || '').toLowerCase();
  const url = (dataUrl || '').toLowerCase();
  if (name.endsWith('.mp3') || url.includes('audio/mpeg') || url.includes('audio/mp3')) {
    return 'audio';
  }
  if (name.endsWith('.mp4') || url.includes('video/mp4')) {
    return 'video';
  }
  return 'image';
};

const validateAccept = (file, acceptStr) => {
  if (!acceptStr) return true;
  const acceptItems = acceptStr.split(',').map((s) => s.trim().toLowerCase());
  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();
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

export default function MediaUpload({
  category = 'Upload',
  accept = 'image/*,.mp3,.mp4',
  currentValue = '',
  onUpload,
  onRemove,
  onReplace,
}) {
  const { uploadedFiles } = useAdmin();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const inputRef = useRef(null);
  const replaceInputRef = useRef(null);

  const resolvePreview = useCallback(() => {
    if (previewUrl) return previewUrl;
    if (currentValue && currentValue.startsWith('data:')) return currentValue;
    if (currentValue && uploadedFiles[currentValue]) return uploadedFiles[currentValue];
    return currentValue || '';
  }, [previewUrl, currentValue, uploadedFiles]);

  useEffect(() => {
    if (!previewUrl && currentValue && !currentValue.startsWith('data:')) {
      const match = Object.entries(uploadedFiles).find(([key]) => key === currentValue);
      if (match) {
        setFileName(match[0]);
      }
    }
  }, [currentValue, uploadedFiles, previewUrl]);

  const readFileAsDataUrl = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }, []);

  const handleFileSelect = useCallback(
    async (file, isReplace = false) => {
      setError('');
      if (!file) return;
      if (!validateAccept(file, accept)) {
        setError(`Invalid file type. Accepted: ${accept}`);
        return;
      }
      setIsLoading(true);
      try {
        const dataUrl = await readFileAsDataUrl(file);
        setPreviewUrl(dataUrl);
        setFileName(file.name);
        setFileSize(file.size);
        if (isReplace && onReplace) {
          onReplace(file.name, dataUrl);
        } else if (onUpload) {
          onUpload(file.name, dataUrl);
        }
      } catch (err) {
        setError(err.message || 'Failed to process file');
      } finally {
        setIsLoading(false);
      }
    },
    [accept, onUpload, onReplace, readFileAsDataUrl]
  );

  const handleInputChange = useCallback(
    (e) => {
      const file = e.target.files && e.target.files[0];
      handleFileSelect(file, false);
      if (inputRef.current) inputRef.current.value = '';
    },
    [handleFileSelect]
  );

  const handleReplaceChange = useCallback(
    (e) => {
      const file = e.target.files && e.target.files[0];
      handleFileSelect(file, true);
      if (replaceInputRef.current) replaceInputRef.current.value = '';
    },
    [handleFileSelect]
  );

  const handleRemove = useCallback(() => {
    setPreviewUrl('');
    setFileName('');
    setFileSize(0);
    setError('');
    if (onRemove) onRemove();
  }, [onRemove]);

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
      const hasExisting = !!(previewUrl || currentValue);
      handleFileSelect(file, hasExisting);
    },
    [handleFileSelect, previewUrl, currentValue]
  );

  const activePreview = resolvePreview();
  const mediaType = detectMediaType(fileName || currentValue || '', activePreview);
  const hasFile = !!(activePreview || currentValue);

  const MediaIcon = mediaType === 'audio' ? Music : mediaType === 'video' ? Video : Image;

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between">
        <label className="font-cinzel text-sm font-semibold text-gold-300 tracking-wider">
          {category}
        </label>
        {fileName && (
          <span className="font-marcellus text-[10px] text-sacred-ivory/50 truncate max-w-[60%] text-right">
            {fileName}
            {fileSize ? ` • ${formatFileSize(fileSize)}` : ''}
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
                        PROCESSING...
                      </span>
                    </div>
                  </div>
                )}

                {mediaType === 'image' && activePreview && (
                  <div className="flex items-center justify-center bg-navy-950 min-h-[180px] max-h-[280px]">
                    <img
                      src={activePreview}
                      alt={fileName || category}
                      className="w-full h-full object-contain max-h-[280px]"
                    />
                  </div>
                )}

                {mediaType === 'audio' && (
                  <div className="p-5 flex flex-col items-center gap-4 bg-navy-950 min-h-[180px]">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-500/20 to-navy-900 border border-gold-400/40 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.25)]">
                      <Music className="w-7 h-7 text-gold-400" />
                    </div>
                    {activePreview && (
                      <audio
                        controls
                        src={activePreview}
                        className="w-full max-w-md h-10"
                      />
                    )}
                  </div>
                )}

                {mediaType === 'video' && (
                  <div className="p-4 flex flex-col items-center gap-4 bg-navy-950 min-h-[180px]">
                    {activePreview ? (
                      <video
                        controls
                        src={activePreview}
                        className="w-full max-h-[260px] rounded-lg bg-black"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-500/20 to-navy-900 border border-gold-400/40 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.25)]">
                        <Video className="w-7 h-7 text-gold-400" />
                      </div>
                    )}
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
                  />
                </label>
                <button
                  onClick={handleRemove}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 hover:border-red-500/50 text-red-300 hover:text-red-200 transition-all font-cinzel text-xs tracking-wider group"
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
                        READING FILE...
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="relative">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-navy-900 via-navy-850 to-navy-900 border border-gold-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.1)]">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold-500/15 to-navy-950 border border-gold-400/30 flex items-center justify-center">
                            <Upload className="w-6 h-6 text-gold-400" />
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
                          Supports JPG, PNG, GIF, WEBP, SVG, MP3, MP4
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
