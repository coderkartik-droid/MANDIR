import { createContext, useContext, useState, useCallback, useEffect, useMemo, useRef } from 'react';

import { api } from '../utils/api';
import { getAllRaw, reload as reloadSiteContent, subscribe as subscribeToStore } from '../utils/contentStore';

const deepClone = (value) => {
  if (value === null || typeof value !== 'object') {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => deepClone(item));
  }
  const cloned = {};
  for (const key of Object.keys(value)) {
    cloned[key] = deepClone(value[key]);
  }
  return cloned;
};

const LIST_COLLECTIONS = ['festivals', 'gallery', 'music', 'videos'];

const ADMIN_USERNAME = 'MANDIR';
const ADMIN_PASSWORD = 'MANDIR123';

const snapshotContent = () => deepClone(getAllRaw() || {});

const detectKind = (file) => {
  const name = (file.name || '').toLowerCase();
  const type = (file.type || '').toLowerCase();
  if (type.startsWith('audio/') || name.endsWith('.mp3')) return 'audio';
  if (type.startsWith('video/') || name.endsWith('.mp4')) return 'video';
  return 'image';
};

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [content, setContent] = useState(snapshotContent);
  const [dirtySections, setDirtySections] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const contentRef = useRef(content);
  contentRef.current = content;
  const dirtyRef = useRef(dirtySections);
  dirtyRef.current = dirtySections;

  // Keep admin state in sync with the backend store whenever it reloads,
  // unless there are unsaved edits in progress.
  useEffect(() => {
    const sync = () => {
      if (Object.keys(dirtyRef.current).length === 0) {
        setContent(snapshotContent());
      }
    };
    sync();
    return subscribeToStore(sync);
  }, []);

  const login = useCallback((username, password) => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
  }, []);

  const markDirty = useCallback((sectionKey) => {
    setDirtySections((prev) => (prev[sectionKey] ? prev : { ...prev, [sectionKey]: true }));
  }, []);

  const updateContent = useCallback((sectionKey, newValue) => {
    setContent((prev) => {
      if (!(sectionKey in prev)) {
        return prev;
      }
      return { ...prev, [sectionKey]: deepClone(newValue) };
    });
    markDirty(sectionKey);
  }, [markDirty]);

  const updateListItem = useCallback((collectionKey, itemId, newValue) => {
    if (!LIST_COLLECTIONS.includes(collectionKey)) {
      return;
    }
    setContent((prev) => {
      const collection = prev[collectionKey];
      if (!collection || !Array.isArray(collection.items)) {
        return prev;
      }
      const newItems = collection.items.map((item) =>
        item.id === itemId ? deepClone(newValue) : item
      );
      return { ...prev, [collectionKey]: { ...collection, items: newItems } };
    });
    markDirty(collectionKey);
  }, [markDirty]);

  const addListItem = useCallback((collectionKey, newItem) => {
    if (!LIST_COLLECTIONS.includes(collectionKey)) {
      return;
    }
    setContent((prev) => {
      const collection = prev[collectionKey];
      if (!collection) {
        return prev;
      }
      const currentItems = Array.isArray(collection.items) ? collection.items : [];
      return {
        ...prev,
        [collectionKey]: { ...collection, items: [...currentItems, deepClone(newItem)] },
      };
    });
    markDirty(collectionKey);
  }, [markDirty]);

  const removeListItem = useCallback((collectionKey, itemId) => {
    if (!LIST_COLLECTIONS.includes(collectionKey)) {
      return;
    }
    setContent((prev) => {
      const collection = prev[collectionKey];
      if (!collection || !Array.isArray(collection.items)) {
        return prev;
      }
      const newItems = collection.items.filter((item) => item.id !== itemId);
      return { ...prev, [collectionKey]: { ...collection, items: newItems } };
    });
    markDirty(collectionKey);
  }, [markDirty]);

  /** Save every modified section to the backend, then refresh the live site. */
  const saveAll = useCallback(async () => {
    const sections = Object.keys(dirtyRef.current);
    if (sections.length === 0) {
      return { success: true, saved: 0 };
    }
    setIsSaving(true);
    try {
      for (const section of sections) {
        await api.saveSection(section, contentRef.current[section]);
      }
      setDirtySections({});
      await reloadSiteContent();
      return { success: true, saved: sections.length };
    } catch (err) {
      return { success: false, error: err.message || 'Save failed' };
    } finally {
      setIsSaving(false);
    }
  }, []);

  /** Upload a File to the backend; resolves with { name, path, url, size, kind }. */
  const uploadMedia = useCallback(async (file) => {
    const kind = detectKind(file);
    const result = await api.uploadMedia(kind, file);
    return result.file;
  }, []);

  /** Delete a previously uploaded file (paths under /api/media only). */
  const deleteMedia = useCallback(async (pathOrUrl) => {
    if (!pathOrUrl || typeof pathOrUrl !== 'string') return;
    if (!pathOrUrl.startsWith('/api/media/') && !pathOrUrl.startsWith('media/')) return;
    await api.deleteMedia(pathOrUrl);
  }, []);

  const hasUnsavedChanges = Object.keys(dirtySections).length > 0;

  const value = useMemo(
    () => ({
      isAuthenticated,
      login,
      logout,
      content,
      updateContent,
      updateListItem,
      addListItem,
      removeListItem,
      dirtySections,
      hasUnsavedChanges,
      isSaving,
      saveAll,
      uploadMedia,
      deleteMedia,
    }),
    [
      isAuthenticated,
      login,
      logout,
      content,
      updateContent,
      updateListItem,
      addListItem,
      removeListItem,
      dirtySections,
      hasUnsavedChanges,
      isSaving,
      saveAll,
      uploadMedia,
      deleteMedia,
    ]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export default AdminContext;
