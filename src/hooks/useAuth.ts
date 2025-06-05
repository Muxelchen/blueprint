import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
  permissions?: string[];
  avatar?: string;
  metadata?: Record<string, any>;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  token: string | null;
}

export interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<AuthUser>;
  signup: (email: string, password: string, userData?: Partial<AuthUser>) => Promise<AuthUser>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  updateProfile: (data: Partial<AuthUser>) => Promise<AuthUser>;
  refreshToken: () => Promise<string>;
  checkAuth: () => Promise<boolean>;
  hasPermission: (permission: string) => boolean;
  clearError: () => void;
}

// Default implementation - replace with your auth service
const authApi = {
  login: async (email: string, password: string): Promise<{user: AuthUser, token: string}> => {
    // This is just a mock implementation - replace with your API calls
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    // Demo authentication - simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Demo validation
        if (email === 'demo@example.com' && password === 'password') {
          resolve({
            user: {
              id: '1',
              email: 'demo@example.com',
              name: 'Demo User',
              role: 'admin',
              permissions: ['read:all', 'write:all', 'delete:own'],
              avatar: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
            },
            token: 'demo-jwt-token'
          });
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 500);
    });
  },
  
  signup: async (email: string, password: string, userData?: Partial<AuthUser>): Promise<{user: AuthUser, token: string}> => {
    // This is just a mock implementation - replace with your API calls
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          user: {
            id: Math.random().toString(36).substring(2, 10),
            email,
            name: userData?.name || email.split('@')[0],
            role: 'user',
            permissions: ['read:own', 'write:own'],
            ...userData
          },
          token: 'new-user-jwt-token'
        });
      }, 800);
    });
  },
  
  logout: async (): Promise<void> => {
    // This is just a mock implementation - replace with your API calls
    return new Promise((resolve) => {
      setTimeout(resolve, 300);
    });
  },
  
  refreshToken: async (token: string): Promise<string> => {
    // This is just a mock implementation - replace with your API calls
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('refreshed-jwt-token');
      }, 300);
    });
  },
  
  resetPassword: async (email: string): Promise<boolean> => {
    // This is just a mock implementation - replace with your API calls
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
  },
  
  updateProfile: async (userId: string, data: Partial<AuthUser>): Promise<AuthUser> => {
    // This is just a mock implementation - replace with your API calls
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: userId,
          email: data.email || 'user@example.com',
          ...data
        });
      }, 800);
    });
  },
  
  getUser: async (token: string): Promise<AuthUser | null> => {
    // This is just a mock implementation - replace with your API calls
    return new Promise((resolve) => {
      setTimeout(() => {
        if (token) {
          resolve({
            id: '1',
            email: 'demo@example.com',
            name: 'Demo User',
            role: 'admin',
            permissions: ['read:all', 'write:all', 'delete:own']
          });
        } else {
          resolve(null);
        }
      }, 500);
    });
  }
};

// Create an Auth context with a default value
export const AuthContext = createContext<AuthContextValue | null>(null);

// Provider component for the Auth context
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useProvideAuth();
  return React.createElement(AuthContext.Provider, { value: auth }, children);
};

// Hook for components to consume the Auth context
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Hook that provides the auth implementation
function useProvideAuth(): AuthContextValue {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    token: localStorage.getItem('auth_token')
  });

  // Check if the user is authenticated on mount
  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }
      
      try {
        const user = await authApi.getUser(token);
        
        if (user) {
          setState({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } else {
          // Token is invalid or expired
          localStorage.removeItem('auth_token');
          setState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });
        }
      } catch (error) {
        setState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: error instanceof Error ? error : new Error('Authentication failed')
        });
      }
    };
    
    checkAuthentication();
  }, []);

  // Login method
  const login = useCallback(async (email: string, password: string): Promise<AuthUser> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const { user, token } = await authApi.login(email, password);
      
      // Store the token in local storage
      localStorage.setItem('auth_token', token);
      
      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
      
      return user;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error : new Error('Login failed')
      }));
      
      throw error;
    }
  }, []);

  // Signup method
  const signup = useCallback(async (email: string, password: string, userData?: Partial<AuthUser>): Promise<AuthUser> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const { user, token } = await authApi.signup(email, password, userData);
      
      // Store the token in local storage
      localStorage.setItem('auth_token', token);
      
      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
      
      return user;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error : new Error('Signup failed')
      }));
      
      throw error;
    }
  }, []);

  // Logout method
  const logout = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      await authApi.logout();
      
      // Remove the token from local storage
      localStorage.removeItem('auth_token');
      
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error : new Error('Logout failed')
      }));
      
      throw error;
    }
  }, []);

  // Reset password method
  const resetPassword = useCallback(async (email: string): Promise<boolean> => {
    try {
      return await authApi.resetPassword(email);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Password reset failed')
      }));
      return false;
    }
  }, []);

  // Update user profile
  const updateProfile = useCallback(async (data: Partial<AuthUser>): Promise<AuthUser> => {
    if (!state.user) {
      throw new Error('User is not authenticated');
    }
    
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const updatedUser = await authApi.updateProfile(state.user.id, data);
      
      setState(prev => ({
        ...prev,
        user: updatedUser,
        isLoading: false
      }));
      
      return updatedUser;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error : new Error('Profile update failed')
      }));
      
      throw error;
    }
  }, [state.user]);

  // Refresh the auth token
  const refreshToken = useCallback(async (): Promise<string> => {
    if (!state.token) {
      throw new Error('No token to refresh');
    }
    
    try {
      const newToken = await authApi.refreshToken(state.token);
      
      // Update the token in local storage
      localStorage.setItem('auth_token', newToken);
      
      setState(prev => ({
        ...prev,
        token: newToken
      }));
      
      return newToken;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Token refresh failed')
      }));
      
      throw error;
    }
  }, [state.token]);

  // Check auth status
  const checkAuth = useCallback(async (): Promise<boolean> => {
    if (!state.token) {
      return false;
    }
    
    try {
      const user = await authApi.getUser(state.token);
      return !!user;
    } catch (error) {
      return false;
    }
  }, [state.token]);

  // Check if user has a specific permission
  const hasPermission = useCallback((permission: string): boolean => {
    if (!state.user || !state.user.permissions) {
      return false;
    }
    
    return state.user.permissions.includes(permission);
  }, [state.user]);

  // Clear error state
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    login,
    signup,
    logout,
    resetPassword,
    updateProfile,
    refreshToken,
    checkAuth,
    hasPermission,
    clearError
  };
}