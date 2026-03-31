html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Auth API Service</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#3b82f6',
                        secondary: '#10b981',
                        danger: '#ef4444'
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-gray-50 min-h-screen p-6">
    <div class="max-w-4xl mx-auto">
        <header class="mb-8">
            <h1 class="text-3xl font-bold text-gray-800">Auth API Service</h1>
            <p class="text-gray-600 mt-2">API service functions for authentication endpoints</p>
        </header>

        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 class="text-xl font-semibold text-gray-700 mb-4">File: api/authApi.js</h2>
            
            <div class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre><code class="language-javascript">
// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Default headers for JSON requests
const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};

/**
 * Login API service
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise&lt;Object&gt;} - Response data with tokens
 */
export const login = async (email, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: defaultHeaders,
            body: JSON.stringify({ email, password }),
            credentials: 'include' // For handling cookies if needed
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login failed');
        }

        const data = await response.json();
        
        // Store tokens if returned in response body
        if (data.accessToken) {
            localStorage.setItem('accessToken', data.accessToken);
        }
        if (data.refreshToken) {
            localStorage.setItem('refreshToken', data.refreshToken);
        }

        return data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

/**
 * Logout API service
 * @returns {Promise&lt;Object&gt;} - Response data
 */
export const logout = async () => {
    try {
        const accessToken = localStorage.getItem('accessToken');
        const headers = { ...defaultHeaders };
        
        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }

        const response = await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            headers,
            credentials: 'include'
        });

        // Clear local storage regardless of response
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Logout failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Logout error:', error);
        // Still clear storage even if API call fails
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        throw error;
    }
};

/**
 * Refresh token API service
 * @returns {Promise&lt;Object&gt;} - New access token data
 */
export const refreshToken = async () => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
            method: 'POST',
            headers: defaultHeaders,
            body: JSON.stringify({ refreshToken }),
            credentials: 'include'
        });

        if (!response.ok) {
            // If refresh fails, clear tokens and redirect to login
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            
            const errorData = await response.json();
            throw new Error(errorData.message || 'Token refresh failed');
        }

        const data = await response.json();
        
        // Update stored tokens
        if (data.accessToken) {
            localStorage.setItem('accessToken', data.accessToken);
        }
        if (data.refreshToken) {
            localStorage.setItem('refreshToken', data.refreshToken);
        }

        return data;
    } catch (error) {
        console.error('Token refresh error:', error);
        throw error;
    }
};

/**
 * Helper function to get authenticated headers
 * @returns {Object} - Headers with authorization token
 */
export const getAuthHeaders = () => {
    const accessToken = localStorage.getItem('accessToken');
    const headers = { ...defaultHeaders };
    
    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }
    
    return headers;
};

/**
 * Helper function to check if user is authenticated
 * @returns {boolean} - Authentication status
 */
export const isAuthenticated = () => {
    const accessToken = localStorage.getItem('accessToken');
    return !!accessToken;
};

/**
 * Helper function to get stored user data
 * @returns {Object|null} - User data or null
 */
export const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};

/**
 * Helper function to set user data
 * @param {Object} user - User object
 */
export const setCurrentUser = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
};
                </code></pre>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white p-6 rounded-lg shadow-md">
                <h3 class="text-lg font-semibold text-primary mb-3">Login Function</h3>
                <p class="text-gray-600 mb-2">Handles user authentication</p>
                <ul class="text-sm text-gray-500 space-y-1">
                    <li>• POST request to /auth/login</li>
                    <li>• Stores tokens in localStorage</li>
                    <li>• Error handling included</li>
                </ul>
            </div>

            <div class="bg-white p-6 rounded-lg shadow-md">
                <h3 class="text-lg font-semibold text-secondary mb-3">Logout Function</h3>
                <p class="text-gray-600 mb-2">Handles user logout</p>
                <ul class="text-sm text-gray-500 space-y-1">
                    <li>• POST request to /auth/logout</li>
                    <li>• Clears localStorage</li>
                    <li>• Includes authorization header</li>
                </ul>
            </div>

            <div class="bg-white p-6 rounded-lg shadow-md">
                <h3 class="text-lg font-semibold text-danger mb-3">Token Refresh</h3>
                <p class="text-gray-600 mb-2">Refreshes expired access tokens</p>
                <ul class="text-sm text-gray-500 space-y-1">
                    <li>• POST request to /auth/refresh-token</li>
                    <li>• Uses refresh token</li>
                    <li>• Auto-redirect on failure</li>
                </ul>
            </div>
        </div>

        <div class="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 class="font-semibold text-blue-800 mb-2">Usage Example:</h4>
            <pre class="text-sm text-blue-900 bg-blue-100 p-3 rounded overflow-x-auto">
// Import the functions
import { login, logout, refreshToken, getAuthHeaders } from './api/authApi';

// Login usage
try {
    const userData = await login('user@example.com', 'password123');
    console.log('Login successful:', userData);
} catch (error) {
    console.error('Login failed:', error.message);
}

// Making authenticated requests
const response = await fetch('/api/protected-route', {
    headers: getAuthHeaders()
});

// Token refresh (typically called when 401 response is received)
try {
    const newTokens = await refreshToken();
    console.log('Token refreshed successfully');
} catch (error) {
    // Redirect to login page
    window.location.href = '/login';
}
            </pre>
        </div>
    </div>
</body>
</html>
<!-- update 1774955527.664774 -->