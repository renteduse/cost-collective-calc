
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from '@/components/ui/sonner';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferredCurrency?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserInfo: (updatedUser: Partial<User>) => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL || '/api'}/auth/me`, {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });
          setUser(response.data);
          setToken(storedToken);
        } catch (err) {
          console.error('Error validating token:', err);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          navigate('/login');
        }
      }
      setLoading(false);
    };

    checkToken();
  }, [navigate]);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_API_URL || '/api'}/auth/login`, {
        email,
        password,
      });

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_API_URL || '/api'}/auth/register`, {
        name,
        email,
        password,
      });

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    navigate('/login');
  };

  const updateUserInfo = (updatedUser: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updatedUser });
    }
  };

  // Add the updateProfile function to fix the ProfilePage error
  const updateProfile = async (data: Partial<User>) => {
    try {
      setLoading(true);
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL || '/api'}/auth/profile`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setUser({ ...user, ...response.data });
      toast('Profile updated successfully');
      return response.data;
    } catch (err: any) {
      toast('Failed to update profile', {
        description: err.response?.data?.message || 'An error occurred',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        updateUserInfo,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
