import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useAdmin } from './AdminContext';
import LoginModal from './LoginModal';
import AdminDashboard from './AdminDashboard';

const AdminPanelContext = createContext(null);

export const useAdminPanel = () => {
  const context = useContext(AdminPanelContext);
  if (!context) {
    throw new Error('useAdminPanel must be used within an AdminPanel');
  }
  return context;
};

export default function AdminPanel({ children }) {
  const { isAuthenticated } = useAdmin();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  const openAdminPanel = useCallback(() => {
    if (isAuthenticated) {
      setIsDashboardOpen(true);
    } else {
      setIsLoginOpen(true);
    }
  }, [isAuthenticated]);

  const value = useMemo(() => ({ openAdminPanel }), [openAdminPanel]);

  return (
    <AdminPanelContext.Provider value={value}>
      {children}

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={() => setIsDashboardOpen(true)}
      />

      <AdminDashboard
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
      />
    </AdminPanelContext.Provider>
  );
}
