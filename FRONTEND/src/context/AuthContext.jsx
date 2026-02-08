import { createContext, useState, useEffect, useMemo } from "react";
import { loginUser, logoutUser, getCurrentUser } from "../api/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Restore session on app load
  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const res = await getCurrentUser();
        if (isMounted && res.success) {
          setUser(res.user);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    checkAuth();

    return () => {
      isMounted = false; // Prevent state updates after unmount
    };
  }, []);

  // 🔹 Login
  const login = async (credentials) => {
    const res = await loginUser(credentials);
    if (res.success) {
      setUser(res.user);
    }
    return res;
  };

  // 🔹 Logout
  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  // 🔹 Memoized context value (performance optimization)
  const value = useMemo(() => ({ user, login, logout, loading }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
