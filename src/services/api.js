// ===================================================================
// ReLeaf – API Client & Backend Integration Layer
// Target Base URL: http://localhost:5000/api
//
// Endpoints Integrated:
// - GET  /books (and /books?status=available, /books?status=wanted)
// - POST /listings/available
// - POST /listings/wanted
// - POST /matches/run
// - GET  /matches (and /matches/:studentId)
// - POST /auth/login
// - POST /auth/register
// ===================================================================

import { INITIAL_BOOKS, INITIAL_MATCHES } from '../data/mockData';

export const API_BASE_URL = 'http://localhost:5000/api';

const LOCAL_STORAGE_KEY_BOOKS = 'releaf_books_store';
const LOCAL_STORAGE_KEY_MATCHES = 'releaf_matches_store';
const LOCAL_STORAGE_KEY_INTERESTS = 'releaf_swiped_interests';

function getLocalBooks() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_BOOKS);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY_BOOKS, JSON.stringify(INITIAL_BOOKS));
      return INITIAL_BOOKS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_BOOKS;
  }
}

function saveLocalBooks(books) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_BOOKS, JSON.stringify(books));
  } catch (e) {
    console.error('Failed to save to local store:', e);
  }
}

function getLocalMatches() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_MATCHES);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY_MATCHES, JSON.stringify(INITIAL_MATCHES));
      return INITIAL_MATCHES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_MATCHES;
  }
}

function saveLocalMatches(matches) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_MATCHES, JSON.stringify(matches));
  } catch (e) {
    console.error('Failed to save matches:', e);
  }
}

export function getLocalInterests() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_INTERESTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalInterest(bookId, interestType = 'interested') {
  try {
    const list = getLocalInterests();
    const existing = list.filter(item => item.bookId !== bookId);
    existing.push({
      bookId,
      type: interestType,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem(LOCAL_STORAGE_KEY_INTERESTS, JSON.stringify(existing));
  } catch (e) {
    console.error('Failed to save swipe interest:', e);
  }
}

// Check backend connectivity
export async function checkBackendHealth() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1800);
    const res = await fetch(`${API_BASE_URL}/books`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return res.ok || res.status < 500;
  } catch {
    return false;
  }
}

// -------------------------------------------------------------------
// 1. GET /books (with optional ?status=available or ?status=wanted)
// -------------------------------------------------------------------
export async function fetchBooks(status = null) {
  const url = status 
    ? `${API_BASE_URL}/books?status=${encodeURIComponent(status)}`
    : `${API_BASE_URL}/books`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    const items = Array.isArray(data) ? data : (data.books || data.data || []);
    return { data: items, isMock: false };
  } catch (error) {
    const local = getLocalBooks();
    const filtered = status ? local.filter(b => b.status === status) : local;
    return { data: filtered, isMock: true, error: error.message };
  }
}

// -------------------------------------------------------------------
// 2. POST /listings/available + Automatic Matching Trigger
// -------------------------------------------------------------------
export async function createAvailableListing(payload) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const response = await fetch(`${API_BASE_URL}/listings/available`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }
    const resData = await response.json();

    // Trigger matching run endpoint automatically (Part 15)
    try {
      await fetch(`${API_BASE_URL}/matches/run`, { method: 'POST' });
    } catch (e) {
      // background match run
    }

    return { data: resData.data || resData, isMock: false, success: true };
  } catch (error) {
    const newBook = {
      id: `book-local-${Date.now()}`,
      status: 'available',
      title: payload.title || payload.bookTitle,
      author: payload.author,
      edition: payload.edition,
      condition: payload.condition || 'Good',
      price: Number(payload.price) || 0,
      sellerName: payload.studentName || payload.sellerName,
      sellerContact: payload.contactInfo || payload.sellerContact,
      phone: payload.phone || '',
      department: payload.department || 'General Academic',
      courseCode: payload.courseCode || 'GEN100',
      description: payload.description || '',
      coverBg: '#344E41',
      coverAccent: '#F6E7A1',
      createdAt: new Date().toISOString(),
      interestedCount: 0
    };

    const currentBooks = getLocalBooks();
    saveLocalBooks([newBook, ...currentBooks]);

    return {
      data: newBook,
      isMock: true,
      success: true,
      notice: 'Backend currently offline. Listing saved locally and visible in preview.'
    };
  }
}

// -------------------------------------------------------------------
// 3. POST /listings/wanted + Automatic Matching Trigger
// -------------------------------------------------------------------
export async function createWantedListing(payload) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const response = await fetch(`${API_BASE_URL}/listings/wanted`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }
    const resData = await response.json();

    // Trigger matching run endpoint automatically (Part 15)
    try {
      await fetch(`${API_BASE_URL}/matches/run`, { method: 'POST' });
    } catch (e) {
      // background match run
    }

    return { data: resData.data || resData, isMock: false, success: true };
  } catch (error) {
    const newWanted = {
      id: `wanted-local-${Date.now()}`,
      status: 'wanted',
      title: payload.title || payload.bookTitle,
      author: payload.author,
      edition: payload.edition,
      studentName: payload.studentName,
      contact: payload.contactInfo || payload.contact,
      phone: payload.phone || '',
      department: payload.department || 'General Academic',
      courseCode: payload.courseCode || '',
      notes: payload.notes || payload.description || '',
      urgency: payload.urgency || 'Medium',
      createdAt: new Date().toISOString()
    };

    const currentBooks = getLocalBooks();
    saveLocalBooks([newWanted, ...currentBooks]);

    return {
      data: newWanted,
      isMock: true,
      success: true,
      notice: 'Backend currently offline. Request saved locally and visible in preview.'
    };
  }
}

// -------------------------------------------------------------------
// 4. GET /matches (and trigger POST /matches/run)
// -------------------------------------------------------------------
export async function fetchMatches(studentId = null) {
  const url = studentId
    ? `${API_BASE_URL}/matches/${encodeURIComponent(studentId)}`
    : `${API_BASE_URL}/matches`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    const items = Array.isArray(data) ? data : (data.matches || data.data || []);
    return { data: items, isMock: false };
  } catch (error) {
    const local = getLocalMatches();
    return { data: local, isMock: true, error: error.message };
  }
}

// -------------------------------------------------------------------
// 5. POST /matches/run (Explicitly triggers matching service)
// -------------------------------------------------------------------
export async function runMatchingServiceApi() {
  try {
    const res = await fetch(`${API_BASE_URL}/matches/run`, {
      method: 'POST',
      headers: { 'Accept': 'application/json' }
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// -------------------------------------------------------------------
// 6. Authentication APIs
// -------------------------------------------------------------------
export async function loginUserApi(credentials) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.message || `Login failed with status ${response.status}`);
    }
    const data = await response.json();
    return { success: true, data, isMock: false };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      isMissingEndpoint: true
    };
  }
}

export async function registerUserApi(userData) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.message || `Registration failed with status ${response.status}`);
    }
    const data = await response.json();
    return { success: true, data, isMock: false };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      isMissingEndpoint: true
    };
  }
}
