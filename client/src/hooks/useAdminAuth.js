"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export const useAdminAuth = () => {
  const [adminUser, setAdminUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token');
      const user = localStorage.getItem('admin_user') || sessionStorage.getItem('admin_user');
      
      if (token && user) {
        setAdminUser(JSON.parse(user));
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setAdminUser(null);
      }
      setIsLoading(false);
    }
  };

  const login = (token, user) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_token', token);
      localStorage.setItem('admin_user', JSON.stringify(user));
      setAdminUser(user);
      setIsAuthenticated(true);
      setIsLoading(false);
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      sessionStorage.removeItem('admin_token');
      sessionStorage.removeItem('admin_user');
      setAdminUser(null);
      setIsAuthenticated(false);
      router.push('/admin/login');
    }
  };

  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token');
    }
    return null;
  };

  return {
    adminUser,
    isAuthenticated,
    isLoading,
    login,
    logout,
    getToken,
    checkAuth,
  };
};
