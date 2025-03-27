const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/auth';

// General API request function
const apiRequest = async (endpoint, method, data = null) => {
    try {
        const token = localStorage.getItem('token'); // Retrieve stored token

        // Set request headers
        const headers = {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }) // Include token if available
        };

        // Configure request options
        const options = {
            method,
            headers,
            credentials: 'include', // Include credentials (e.g., cookies if needed)
        };

        if (data) options.body = JSON.stringify(data); // Add body only if data exists

        // Send API request
        const response = await fetch(`${API_URL}/${endpoint}`, options);

        // Check if response is HTML (error page)
        const contentType = response.headers.get('content-type');
        if (!response.ok) {
            if (contentType && contentType.includes('text/html')) {
                throw new Error(`Unexpected HTML response. Check if "${API_URL}/${endpoint}" exists.`);
            }
            const errorData = await response.json();
            throw new Error(errorData.msg || 'An error occurred. Please try again.');
        }

        return await response.json(); // Return response data
    } catch (error) {
        console.error(`API Error in "${endpoint}":`, error.message);
        throw error; // Rethrow error for component handling
    }
};

const authService = {
    // User Registration
    signUp: async (userData) => await apiRequest('signup', 'POST', userData),

    // User Login
    login: async (loginData) => {
        const data = await apiRequest('login', 'POST', loginData);
        localStorage.setItem('token', data.token); // Store JWT token
        localStorage.setItem('user', JSON.stringify(data.user)); // Store user data
        return data;
    },

    // User Logout
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Password Reset Request
    requestPasswordReset: async (email) => await apiRequest('forgot-password', 'POST', { identifier: email }),

    // Reset Password with Token
    resetPassword: async (token, newPassword) => await apiRequest('reset-password', 'POST', { token, newPassword }),

    // Fetch User Profile (Protected Route)
    getUserProfile: async () => await apiRequest('profile', 'GET'),
};

export default authService;
