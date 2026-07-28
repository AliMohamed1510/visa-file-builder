import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('token');
      Cookies.remove('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

// Auth API
export const authApi = {
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  register: (data: any) => api.post('/auth/register', data),
  refresh: (refreshToken: string) => api.post('/auth/refresh', { refreshToken }),
  profile: () => api.get('/auth/profile'),
};

// Clients API
export const clientsApi = {
  list: (params?: any) => api.get('/clients', { params }),
  get: (id: string) => api.get(`/clients/${id}`),
  create: (data: any) => api.post('/clients', data),
  update: (id: string, data: any) => api.patch(`/clients/${id}`, data),
  delete: (id: string) => api.delete(`/clients/${id}`),
  search: (q: string) => api.get('/clients/search', { params: { q } }),
};

// Countries API
export const countriesApi = {
  list: (params?: any) => api.get('/countries', { params }),
  get: (id: string) => api.get(`/countries/${id}`),
};

// Visa Applications API
export const visaApi = {
  list: (params?: any) => api.get('/visa-applications', { params }),
  get: (id: string) => api.get(`/visa-applications/${id}`),
  create: (data: any) => api.post('/visa-applications', data),
  update: (id: string, data: any) => api.patch(`/visa-applications/${id}`, data),
  updateStatus: (id: string, status: string, notes?: string) => 
    api.patch(`/visa-applications/${id}/status`, { status, reviewNotes: notes }),
  statistics: () => api.get('/visa-applications/statistics'),
};

// Documents API
export const documentsApi = {
  list: (params?: any) => api.get('/documents', { params }),
  upload: (formData: FormData) => api.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  verify: (id: string, status: string, notes?: string) => 
    api.patch(`/documents/${id}/verify`, { status, notes }),
  delete: (id: string) => api.delete(`/documents/${id}`),
};

// OCR API
export const ocrApi = {
  passport: (filePath: string) => api.post('/ocr/passport', { filePath }),
  hotel: (filePath: string) => api.post('/ocr/hotel', { filePath }),
  flight: (filePath: string) => api.post('/ocr/flight', { filePath }),
};

// PDF API
export const pdfApi = {
  generate: (applicationId: string) => api.post(`/pdf/generate/${applicationId}`),
  preview: (applicationId: string) => `${API_URL}/api/pdf/preview/${applicationId}`,
};
