const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/auth';

// General API request function
const apiRequest = async (endpoint, method, data = null) => {
    try {
        const token = localStorage.getItem('token');

        // Set request headers
        const headers = {
            'Content-Type': 'application/json',
        };

        // Include Authorization header only for protected routes
        const publicEndpoints = ['/signup', '/login', '/forgot-password', '/reset-password'];
        if (!publicEndpoints.includes(endpoint) && token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        // Configure request options
        const options = {
            method,
            headers,
        };

        if (data) options.body = JSON.stringify(data);

        // Ensure endpoint starts with "/"
        const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

        // Send API request
        const response = await fetch(`${API_URL}${formattedEndpoint}`, options);

        // Check for errors
        const contentType = response.headers.get('content-type');
        if (!response.ok) {
            if (contentType && contentType.includes('text/html')) {
                const errorText = await response.text();
                console.error(`HTML Response Error:`, errorText);
                throw new Error(`Unexpected HTML response. Check if "${API_URL}${formattedEndpoint}" exists and is correctly configured.`);
            }
            const errorData = await response.json();
            throw new Error(errorData.message || 'An error occurred. Please try again.');
        }

        return await response.json();
    } catch (error) {
        console.error(`API Error in "${endpoint}":`, error.message);
        throw error;
    }
};

const authService = {
    signUp: async (userData) => await apiRequest('/signup', 'POST', userData),

    login: async (loginData) => {
        const data = await apiRequest('/login', 'POST', loginData);
        localStorage.setItem('token', data.token); // Store JWT token
        localStorage.setItem('user', JSON.stringify(data.user)); // Store user data
        return data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    requestPasswordReset: async (email) => await apiRequest('/forgot-password', 'POST', { identifier: email }),

    resetPassword: async (token, newPassword) => await apiRequest('/reset-password', 'POST', { token, newPassword }),

    getUserProfile: async () => await apiRequest('/profile', 'GET'),
};

export default authService;
