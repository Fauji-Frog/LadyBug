import React, { createContext, useContext, useState, useEffect } from 'react';
import { CURRENT_STUDENT_DEFAULT } from '../data/mockData';
import { loginUserApi, registerUserApi, checkBackendHealth } from '../services/api';

const AuthContext = createContext(null);

const STORAGE_KEY_AUTH_USER = 'releaf_auth_user';
const STORAGE_KEY_AUTH_TOKEN = 'releaf_auth_token';

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY_AUTH_USER) || localStorage.getItem(STORAGE_KEY_AUTH_USER);
      return stored ? JSON.parse(stored) : CURRENT_STUDENT_DEFAULT; // Defaults to logged in demo student for immediate preview
    } catch {
      return CURRENT_STUDENT_DEFAULT;
    }
  });

  const [token, setToken] = useState(() => {
    return sessionStorage.getItem(STORAGE_KEY_AUTH_TOKEN) || localStorage.getItem(STORAGE_KEY_AUTH_TOKEN) || 'demo-session-token';
  });

  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const [checkingBackend, setCheckingBackend] = useState(true);

  // Ping backend on mount to determine live vs demo mode
  const verifyBackend = async () => {
    setCheckingBackend(true);
    const online = await checkBackendHealth();
    setIsBackendOnline(online);
    setCheckingBackend(false);
  };

  useEffect(() => {
    verifyBackend();
    const interval = setInterval(verifyBackend, 30000); // periodically recheck
    return () => clearInterval(interval);
  }, []);

  // Login handler
  const login = async (identifier, password, rememberMe = false) => {
    // Attempt real backend call
    const res = await loginUserApi({ identifier, password });

    if (res.success && res.data) {
      const userData = res.data.user || res.data;
      const userToken = res.data.token || 'backend-auth-token';
      setCurrentUser(userData);
      setToken(userToken);

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem(STORAGE_KEY_AUTH_USER, JSON.stringify(userData));
      storage.setItem(STORAGE_KEY_AUTH_TOKEN, userToken);
      return { success: true, isBackend: true };
    }

    // If backend is unavailable or endpoint missing, handle demo login with clear feedback
    if (res.isMissingEndpoint || !isBackendOnline) {
      // Local student profile login
      const demoUser = {
        ...CURRENT_STUDENT_DEFAULT,
        email: identifier.includes('@') ? identifier : `${identifier}@campus.edu`,
        studentId: identifier.includes('@') ? CURRENT_STUDENT_DEFAULT.studentId : identifier
      };
      setCurrentUser(demoUser);
      setToken('demo-active-token');

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem(STORAGE_KEY_AUTH_USER, JSON.stringify(demoUser));
      storage.setItem(STORAGE_KEY_AUTH_TOKEN, 'demo-active-token');

      return {
        success: true,
        isBackend: false,
        notice: 'Connected in Student Demo Mode (Backend at http://localhost:5000/api not detected).'
      };
    }

    return { success: false, error: res.error || 'Invalid student credentials.' };
  };

  // Register handler
  const register = async (studentData) => {
    // Attempt backend registration
    const res = await registerUserApi(studentData);

    if (res.success && res.data) {
      const userData = res.data.user || res.data;
      const userToken = res.data.token || 'backend-auth-token';
      setCurrentUser(userData);
      setToken(userToken);
      sessionStorage.setItem(STORAGE_KEY_AUTH_USER, JSON.stringify(userData));
      sessionStorage.setItem(STORAGE_KEY_AUTH_TOKEN, userToken);
      return { success: true, isBackend: true };
    }

    // If backend endpoint is missing, create student session locally
    if (res.isMissingEndpoint || !isBackendOnline) {
      const newStudent = {
        id: `student-${Date.now()}`,
        fullName: studentData.fullName,
        studentId: studentData.studentId,
        email: studentData.email,
        department: studentData.department,
        batch: studentData.batch,
        phone: studentData.phone,
        campus: 'Central Campus',
        bio: `Student at ${studentData.department}, Batch ${studentData.batch}.`,
        avatarBg: '#344E41',
        joinedDate: 'November 2026',
        exchangesCompleted: 0
      };

      setCurrentUser(newStudent);
      setToken('demo-registered-token');
      sessionStorage.setItem(STORAGE_KEY_AUTH_USER, JSON.stringify(newStudent));
      sessionStorage.setItem(STORAGE_KEY_AUTH_TOKEN, 'demo-registered-token');

      return {
        success: true,
        isBackend: false,
        notice: 'Account created locally in Preview Mode (Backend at http://localhost:5000/api is offline).'
      };
    }

    return { success: false, error: res.error || 'Failed to complete registration.' };
  };

  // Logout handler
  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    sessionStorage.removeItem(STORAGE_KEY_AUTH_USER);
    sessionStorage.removeItem(STORAGE_KEY_AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEY_AUTH_USER);
    localStorage.removeItem(STORAGE_KEY_AUTH_TOKEN);
  };

  // Update Profile
  const updateProfile = (updatedFields) => {
    const updated = { ...currentUser, ...updatedFields };
    setCurrentUser(updated);
    sessionStorage.setItem(STORAGE_KEY_AUTH_USER, JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      token,
      isAuthenticated: Boolean(currentUser && token),
      login,
      register,
      logout,
      updateProfile,
      isBackendOnline,
      checkingBackend,
      verifyBackend
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
