import { createContext, useContext, useState, useEffect, useCallback, startTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import { STORAGE_KEYS, ROLES, ROUTES } from '@/constants';

const AuthContext = createContext(null);
export { AuthContext };

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const loadMe = useCallback(async () => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const { data } = await authService.getMe();
      setUser(data.data.user);
    } catch {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMe();
  }, [loadMe]);

  const login = async (credentials) => {
    const { data } = await authService.login(credentials);
    const { accessToken, refreshToken, user } = data.data;
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    setUser(user);
    return user;
  };

  const register = async (payload) => {
    const { data } = await authService.register(payload);
    const { accessToken, refreshToken, user } = data.data;
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    setUser(user);
    return user;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      /* ignore */
    } finally {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      setUser(null);
      startTransition(() => {
        navigate(ROUTES.HOME);
      });
    }
  };

  // Actualiza el usuario en context sin hacer login
  const updateUser = (data) => setUser((prev) => ({ ...prev, ...data }));

  const hasRole = (role) => user?.roles?.some((r) => r.role === role);
  const isSuperadmin = () => hasRole(ROLES.SUPERADMIN);
  const isArtistAdmin = () => hasRole(ROLES.ARTIST_ADMIN);
  const isStaff = () => isSuperadmin() || isArtistAdmin();

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    hasRole,
    isSuperadmin,
    isArtistAdmin,
    isStaff,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
