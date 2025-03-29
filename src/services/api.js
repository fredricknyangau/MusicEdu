import axios from 'axios';

const API_URL = 'https://music-edu.vercel.app/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Ensure cookies are sent
  headers: { 'Content-Type': 'application/json' }
});

// Authentication
export const login = async (credentials) => await api.post('/auth/login', credentials);
export const register = async (userData) => await api.post('/auth/register', userData);
export const logout = async () => await api.post('/auth/logout');

// Fetch user profile
export const fetchUserProfile = async () => await api.get('/users/profile');

// Instruments
export const getInstruments = async () => await api.get('/instruments');
export const addInstrument = async (data) => await api.post('/instruments', data);
export const editInstrument = async (id, data) => await api.put(`/instruments/${id}`, data);
export const deleteInstrument = async (id) => await api.delete(`/instruments/${id}`);

// Feedback
export const submitFeedback = async (feedback) => await api.post('/feedback', feedback);
