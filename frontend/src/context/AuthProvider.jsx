import React, { createContext, useState, useContext } from 'react';
import authApi from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email, password) => {
    try {
      const response = await authApi.login(email, password);
      const { token, authenticated } = response.data;

      if (authenticated && token) {
        // Decode JWT to get user info (simple base64 decode)
        const tokenParts = token.split('.');
        const payload = JSON.parse(atob(tokenParts[1] || ''));

        const extractRole = (p) => {
          if (!p) return 'user';
          // scope can be a space-separated string like "ROLE_ADMIN ROLE_USER"
          if (typeof p.scope === 'string') {
            const parts = p.scope.split(/\s+/).filter(Boolean);
            const rolePart = parts.find(x => x.startsWith('ROLE_')) || parts[0];
            return (rolePart || 'ROLE_USER').replace(/^ROLE_/, '').toLowerCase();
          }
          // sometimes roles/authorities are in arrays
          if (Array.isArray(p.roles) && p.roles.length) {
            const rp = p.roles.find(x => x.startsWith('ROLE_')) || p.roles[0];
            return (rp || 'ROLE_USER').replace(/^ROLE_/, '').toLowerCase();
          }
          if (Array.isArray(p.authorities) && p.authorities.length) {
            const rp = p.authorities.find(x => x.startsWith('ROLE_')) || p.authorities[0];
            return (rp || 'ROLE_USER').replace(/^ROLE_/, '').toLowerCase();
          }

          return 'user';
        };

        const userInfo = {
          userId: payload.userId, // Lấy userId từ claim
          email: payload.sub || payload.email,
          role: extractRole(payload),
          token: token,
        };

        setUser(userInfo);
        localStorage.setItem('user', JSON.stringify(userInfo));
        localStorage.setItem('token', token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      // Throw the error to be handled by the caller
      throw error;
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await authApi.logout(token);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      // Xóa dữ liệu doctor-specific để tránh xung đột khi đổi tài khoản
      localStorage.removeItem('selectedFamily');
      localStorage.removeItem('hasViewedPatients');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};