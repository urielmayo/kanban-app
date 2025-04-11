/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUserProfile,
  loginUser,
  logoutUser,
  registerUser,
  refreshToken,
} from "../utils/http";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated by making a request to the server
    const checkAuth = async () => {
      try {
        const userData = await getUserProfile();
        setUser(userData);
      } catch (error) {
        try {
          await refreshToken();
          // If refresh succeeds, try to get user profile again
          const userData = await getUserProfile();
          setUser(userData);
        } catch (refreshError) {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async ({ email, password }) => {
    const userData = await loginUser({ email, password });
    if (userData) {
      const updatedUserData = await getUserProfile();
      setUser(updatedUserData);
    }
    return true;
  };

  const signup = async (formData) => {
    const userData = await registerUser(formData);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
