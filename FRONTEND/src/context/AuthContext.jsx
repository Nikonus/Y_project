import { createContext, useState, useEffect, useMemo } from "react";
import {
  loginUser,
  logoutUser,
  getCurrentUser,
} from "../api/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on app load
  useEffect(() => {
    const checkAuth = async () => {
      const res = await getCurrentUser();
      if (res.success) {
        setUser(res.user);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    const res = await loginUser(credentials);
    if (res.success) setUser(res.user);
    return res;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, login, logout, loading }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
