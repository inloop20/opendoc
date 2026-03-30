import { createContext, useState, useEffect } from 'react';
import { authApi } from '../services/authApi';
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const userData = await authApi.getCurrentUser();
        setUser(userData.data);
      } catch (err) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email, password) => {
    const data = await authApi.login(email, password);
    setUser(data.data);
    return data;
  };

  const logout = async () => {
  try {
    await authApi.logout(); 
  } catch (error) {
    console.error("Backend logout failed", error);
  } finally {
    setUser(null);
  }
};
  const register = async (email,username,password) =>{
    const data = await authApi.register(email,username,password);
    return data;
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout,register }}>
      {children}   
    </AuthContext.Provider>
  );
};