import { createContext, useContext, useState, useCallback, useMemo } from 'react';

import templeData from '../../content/temple.json';
import homeData from '../../content/home.json';
import contactData from '../../content/contact.json';
import festivalsData from '../../content/festivals.json';
import galleryData from '../../content/gallery.json';
import videosData from '../../content/videos.json';
import musicData from '../../content/music.json';
import mapsData from '../../content/maps.json';
import socialData from '../../content/social.json';
import imagesData from '../../content/images.json';
import themeData from '../../content/theme.json';
import animationsData from '../../content/animations.json';

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

const createInitialContent = () => ({
  temple: deepClone(templeData),
  home: deepClone(homeData),
  contact: deepClone(contactData),
  festivals: deepClone(festivalsData),
  gallery: deepClone(galleryData),
  videos: deepClone(videosData),
  music: deepClone(musicData),
  maps: deepClone(mapsData),
  social: deepClone(socialData),
  images: deepClone(imagesData),
  theme: deepClone(themeData),
  animations: deepClone(animationsData),
});

const ADMIN_USERNAME = 'MANDIR';
const ADMIN_PASSWORD = 'MANDIR123';

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [content, setContent] = useState(createInitialContent);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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

  const updateContent = useCallback((collectionKey, newValue) => {
    setContent((prev) => {
      if (!(collectionKey in prev)) {
        return prev;
      }
      return {
        ...prev,
        [collectionKey]: deepClone(newValue),
      };
    });
    setHasUnsavedChanges(true);
  }, []);

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
      return {
        ...prev,
        [collectionKey]: {
          ...collection,
          items: newItems,
        },
      };
    });
    setHasUnsavedChanges(true);
  }, []);

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
        [collectionKey]: {
          ...collection,
          items: [...currentItems, deepClone(newItem)],
        },
      };
    });
    setHasUnsavedChanges(true);
  }, []);

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
      return {
        ...prev,
        [collectionKey]: {
          ...collection,
          items: newItems,
        },
      };
    });
    setHasUnsavedChanges(true);
  }, []);

  const updateMedia = useCallback((fileName, dataUrl) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [fileName]: dataUrl,
    }));
    setHasUnsavedChanges(true);
  }, []);

  const removeMedia = useCallback((fileName) => {
    setUploadedFiles((prev) => {
      const next = { ...prev };
      delete next[fileName];
      return next;
    });
    setHasUnsavedChanges(true);
  }, []);

  const markAsSaved = useCallback(() => {
    setHasUnsavedChanges(false);
  }, []);

  const importContent = useCallback((fullContentObject, mediaObject) => {
    if (fullContentObject && typeof fullContentObject === 'object') {
      setContent((prev) => {
        const next = { ...prev };
        for (const key of Object.keys(fullContentObject)) {
          if (key in prev) {
            next[key] = deepClone(fullContentObject[key]);
          }
        }
        return next;
      });
    }
    if (mediaObject && typeof mediaObject === 'object') {
      setUploadedFiles(deepClone(mediaObject));
    }
    setHasUnsavedChanges(true);
  }, []);

  const getExportContent = useCallback(() => {
    return {
      content: deepClone(content),
      media: deepClone(uploadedFiles),
    };
  }, [content, uploadedFiles]);

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
      uploadedFiles,
      updateMedia,
      removeMedia,
      hasUnsavedChanges,
      markAsSaved,
      importContent,
      getExportContent,
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
      uploadedFiles,
      updateMedia,
      removeMedia,
      hasUnsavedChanges,
      markAsSaved,
      importContent,
      getExportContent,
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
