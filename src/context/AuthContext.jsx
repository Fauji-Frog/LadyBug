import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUserApi, registerUserApi, checkBackendHealth } from '../services/api';

const AuthContext = createContext(null);

const STORAGE_KEY_AUTH_USER = 'releaf_auth_user';
const STORAGE_KEY_AUTH_TOKEN = 'releaf_auth_token';
const STORAGE_KEY_REGISTERED_USERS = 'releaf_registered_users';

function getStoredUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REGISTERED_USERS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredUser(user) {
  try {
    const list = getStoredUsers();
    const filtered = list.filter(u => 
      u.email.toLowerCase() !== user.email.toLowerCase() && 
      (!user.studentId || u.studentId !== user.studentId)
    );
    filtered.push(user);
    localStorage.setItem(STORAGE_KEY_REGISTERED_USERS, JSON.stringify(filtered));
  } catch (e) {
    console.error('Failed to save user in local store:', e);
  }
}

export function AuthProvider({ children }) {
  // Start fresh with NO pre-filled demo student. Strictly null unless user already logged in!
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY_AUTH_USER) || localStorage.getItem(STORAGE_KEY_AUTH_USER);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return sessionStorage.getItem(STORAGE_KEY_AUTH_TOKEN) || localStorage.getItem(STORAGE_KEY_AUTH_TOKEN) || null;
  });

  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const [checkingBackend, setCheckingBackend] = useState(true);

  // Ping backend on mount to determine live vs offline mode
  const verifyBackend = async () => {
    setCheckingBackend(true);
    const online = await checkBackendHealth();
    setIsBackendOnline(online);
    setCheckingBackend(false);
  };

  useEffect(() => {
    verifyBackend();
    const interval = setInterval(verifyBackend, 30000);
    return () => clearInterval(interval);
  }, []);

  // Strict Login handler: strictly validates credentials
  const login = async (identifier, password, rememberMe = false) => {
    const cleanId = (identifier || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (!cleanId || !cleanPass) {
      return { success: false, error: 'Both Email/Student ID and Password are required.' };
    }

    // 1. Try real backend first if online
    if (isBackendOnline) {
      const res = await loginUserApi({ identifier: cleanId, password: cleanPass });
      if (res.success && res.data) {
        const rawUser = res.data.user || res.data;
        const profile = res.data.profile || {};
        const userData = {
          ...rawUser,
          ...profile,
          fullName: rawUser.fullName || rawUser.name || 'Student',
          name: rawUser.name || rawUser.fullName || 'Student',
          studentId: profile.studentId || rawUser.studentId || '',
          department: profile.department || rawUser.department || 'Computer Science',
          batch: profile.batch || rawUser.batch || 'Class of 2026',
          contact: profile.contact || rawUser.contact || rawUser.phone || ''
        };
        const userToken = res.data.token || `releaf-jwt-${userData.id || Date.now()}`;
        setCurrentUser(userData);
        setToken(userToken);

        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem(STORAGE_KEY_AUTH_USER, JSON.stringify(userData));
        storage.setItem(STORAGE_KEY_AUTH_TOKEN, userToken);
        return { success: true, isBackend: true };
      }
      // If backend responded with an authentication rejection
      if (res.error && !res.isNetworkError) {
        return { success: false, error: res.error };
      }
    }

    // 2. If backend is offline or network error, verify strictly against registered students
    const registeredUsers = getStoredUsers();
    const foundUser = registeredUsers.find(u =>
      (u.email && u.email.toLowerCase() === cleanId) ||
      (u.studentId && u.studentId.toLowerCase() === cleanId)
    );

    if (!foundUser) {
      return {
        success: false,
        error: 'No student account found with this Email or Student ID. Please sign up first.'
      };
    }

    if (foundUser.password !== cleanPass) {
      return {
        success: false,
        error: 'Incorrect password. Please verify your credentials and try again.'
      };
    }

    // Valid credentials verified!
    setCurrentUser(foundUser);
    const userToken = `releaf-session-${foundUser.id}`;
    setToken(userToken);

    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(STORAGE_KEY_AUTH_USER, JSON.stringify(foundUser));
    storage.setItem(STORAGE_KEY_AUTH_TOKEN, userToken);

    return { success: true, isBackend: false };
  };

  // Strict Registration handler: saves account
  const register = async (studentData) => {
    const cleanEmail = (studentData.email || '').trim().toLowerCase();
    const cleanId = (studentData.studentId || '').trim();
    const cleanPass = (studentData.password || '').trim();

    // 1. Try backend first if online
    if (isBackendOnline) {
      const res = await registerUserApi(studentData);
      if (res.success && res.data) {
        const rawUser = res.data.user || res.data;
        const profile = res.data.profile || {};
        const userData = {
          ...rawUser,
          ...profile,
          fullName: rawUser.fullName || rawUser.name || studentData.fullName,
          name: rawUser.name || rawUser.fullName || studentData.fullName,
          studentId: profile.studentId || rawUser.studentId || studentData.studentId,
          department: profile.department || rawUser.department || studentData.department,
          batch: profile.batch || rawUser.batch || studentData.batch,
          contact: profile.contact || rawUser.contact || studentData.phone
        };
        saveStoredUser({ ...userData, password: cleanPass });
        return { success: true, isBackend: true };
      }
      if (res.error && !res.isNetworkError) {
        return { success: false, error: res.error };
      }
    }

    // 2. If backend is offline, validate uniqueness and store locally
    const existingUsers = getStoredUsers();
    const emailExists = existingUsers.some(u => u.email && u.email.toLowerCase() === cleanEmail);
    if (emailExists) {
      return { success: false, error: 'A student account with this university email already exists. Please log in.' };
    }

    if (cleanId) {
      const idExists = existingUsers.some(u => u.studentId && u.studentId.toLowerCase() === cleanId.toLowerCase());
      if (idExists) {
        return { success: false, error: 'A student account with this Student ID already exists. Please log in.' };
      }
    }

    const newStudent = {
      id: `student-${Date.now()}`,
      fullName: studentData.fullName.trim(),
      name: studentData.fullName.trim(),
      studentId: cleanId,
      email: cleanEmail,
      department: studentData.department || 'Computer Science',
      batch: studentData.batch || 'Class of 2026',
      contact: (studentData.phone || '').trim(),
      phone: (studentData.phone || '').trim(),
      campus: 'Central Campus',
      bio: `Student at ${studentData.department || 'University'}, ${studentData.batch || 'Class of 2026'}.`,
      avatarBg: '#344E41',
      joinedDate: 'Joined Recently',
      exchangesCompleted: 0,
      password: cleanPass
    };

    saveStoredUser(newStudent);

    return {
      success: true,
      isBackend: false,
      message: 'Account created successfully! Please log in.'
    };
  };

  // Logout handler: completely clears authentication
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
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedFields };
    setCurrentUser(updated);
    sessionStorage.setItem(STORAGE_KEY_AUTH_USER, JSON.stringify(updated));
    saveStoredUser(updated);
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
