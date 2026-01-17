// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
    return localStorage.getItem('adminToken');
};

// Helper function to create headers
const createHeaders = (includeAuth = false) => {
    const headers = {
        'Content-Type': 'application/json',
    };

    if (includeAuth) {
        const token = getAuthToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    return headers;
};

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: createHeaders(options.auth),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// Auth API
export const authAPI = {
    login: async (username, password) => {
        return apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });
    },

    verify: async (token) => {
        return apiCall('/auth/verify', {
            method: 'POST',
            body: JSON.stringify({ token }),
        });
    },
};

// Contact API
export const contactAPI = {
    submit: async (contactData) => {
        return apiCall('/contacts', {
            method: 'POST',
            body: JSON.stringify(contactData),
        });
    },

    getAll: async () => {
        return apiCall('/contacts', {
            method: 'GET',
            auth: true,
        });
    },

    delete: async (id) => {
        return apiCall(`/contacts/${id}`, {
            method: 'DELETE',
            auth: true,
        });
    },

    markAsRead: async (id) => {
        return apiCall(`/contacts/${id}/read`, {
            method: 'PATCH',
            auth: true,
        });
    },
};

// Feedback API
export const feedbackAPI = {
    submit: async (feedbackData) => {
        return apiCall('/feedback', {
            method: 'POST',
            body: JSON.stringify(feedbackData),
        });
    },

    getAll: async () => {
        return apiCall('/feedback', {
            method: 'GET',
            auth: true,
        });
    },

    delete: async (id) => {
        return apiCall(`/feedback/${id}`, {
            method: 'DELETE',
            auth: true,
        });
    },

    markAsRead: async (id) => {
        return apiCall(`/feedback/${id}/read`, {
            method: 'PATCH',
            auth: true,
        });
    },
};

// Config API
export const configAPI = {
    get: async () => {
        return apiCall('/config', {
            method: 'GET',
        });
    },

    update: async (configData) => {
        return apiCall('/config', {
            method: 'PUT',
            body: JSON.stringify({ configData }),
            auth: true,
        });
    },

    getColors: async () => {
        return apiCall('/config/colors', {
            method: 'GET',
        });
    },

    updateColors: async (colors) => {
        return apiCall('/config/colors', {
            method: 'PUT',
            body: JSON.stringify({ colors }),
            auth: true,
        });
    },

    resetColors: async () => {
        return apiCall('/config/colors/reset', {
            method: 'POST',
            auth: true,
        });
    },
};

// Token management
export const tokenManager = {
    set: (token) => {
        localStorage.setItem('adminToken', token);
    },

    get: () => {
        return localStorage.getItem('adminToken');
    },

    remove: () => {
        localStorage.removeItem('adminToken');
    },
};

export default {
    auth: authAPI,
    contact: contactAPI,
    feedback: feedbackAPI,
    config: configAPI,
    token: tokenManager,
};
