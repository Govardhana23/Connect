import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_BASE, headers: { 'Content-Type': 'application/json' } });

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(err);
    }
);

export const authAPI = {
    register: (data: { name: string; email: string; password: string; role: string }) => api.post('/auth/register', data),
    login: (data: { email: string; password: string }) => api.post('/auth/login', data),
    googleLogin: (idToken: string) => api.post('/auth/google', { idToken }),
    phoneLogin: (idToken: string) => api.post('/auth/phone', { idToken }),
    getMe: () => api.get('/auth/me'),
};

export const marketplaceAPI = {
    getCategories: () => api.get('/marketplace/categories'),
    getServices: (params?: Record<string, string>) => api.get('/marketplace/services', { params }),
    getServiceById: (id: string) => api.get(`/marketplace/services/${id}`),
    getProviders: (params?: Record<string, string>) => api.get('/marketplace/providers', { params }),
    getProviderById: (id: string) => api.get(`/marketplace/providers/${id}`),
};

export const productAPI = {
    getProducts: () => api.get('/marketplace/products'),
    getProductById: (id: string) => api.get(`/marketplace/products/${id}`),
};

export default api;
