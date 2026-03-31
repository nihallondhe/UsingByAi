html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JWT Utils Documentation</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
    <script>hljs.highlightAll();</script>
</head>
<body class="bg-gray-50 text-gray-800">
    <div class="container mx-auto px-4 py-8">
        <header class="mb-10">
            <h1 class="text-4xl font-bold text-gray-900 mb-2">JWT Utilities Documentation</h1>
            <p class="text-gray-600">Utility functions for JWT token generation, verification, and refresh</p>
            <div class="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                <p class="text-sm text-blue-800"><strong>File:</strong> utils/jwtUtils.js</p>
            </div>
        </header>

        <main class="space-y-12">
            <!-- Overview Section -->
            <section class="bg-white rounded-xl shadow-md p-6">
                <h2 class="text-2xl font-semibold mb-4 text-gray-900">Overview</h2>
                <p class="text-gray-700 mb-4">This module provides utility functions for handling JSON Web Tokens (JWT) in a Node.js application. It includes functions for generating access and refresh tokens, verifying tokens, and refreshing expired access tokens.</p>
                <div class="bg-gray-100 p-4 rounded-lg">
                    <p class="text-sm text-gray-600"><strong>Dependencies:</strong> jsonwebtoken, crypto</p>
                </div>
            </section>

            <!-- Code Implementation -->
            <section class="bg-white rounded-xl shadow-md p-6">
                <h2 class="text-2xl font-semibold mb-4 text-gray-900">Implementation</h2>
                <div class="overflow-hidden rounded-lg">
                    <pre class="text-sm"><code class="language-javascript">
// utils/jwtUtils.js
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Configuration
const JWT_CONFIG = {
    accessTokenSecret: process.env.JWT_ACCESS_SECRET || 'your-access-secret-key-change-in-production',
    refreshTokenSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production',
    accessTokenExpiry: '15m', // 15 minutes
    refreshTokenExpiry: '7d', // 7 days
    issuer: 'your-app-name',
    audience: 'your-app-client'
};

// Generate a secure random secret (for initial setup)
function generateRandomSecret(length = 64) {
    return crypto.randomBytes(length).toString('hex');
}

/**
 * Generate access token for a user
 * @param {Object} user - User object containing user data
 * @param {string} user.id - User ID
 * @param {string} user.email - User email
 * @param {Array} user.roles - User roles/permissions
 * @returns {string} JWT access token
 */
function generateAccessToken(user) {
    const payload = {
        sub: user.id,
        email: user.email,
        roles: user.roles || [],
        type: 'access'
    };

    return jwt.sign(payload, JWT_CONFIG.accessTokenSecret, {
        expiresIn: JWT_CONFIG.accessTokenExpiry,
        issuer: JWT_CONFIG.issuer,
        audience: JWT_CONFIG.audience
    });
}

/**
 * Generate refresh token for a user
 * @param {Object} user - User object containing user data
 * @param {string} user.id - User ID
 * @returns {string} JWT refresh token
 */
function generateRefreshToken(user) {
    const payload = {
        sub: user.id,
        type: 'refresh'
    };

    return jwt.sign(payload, JWT_CONFIG.refreshTokenSecret, {
        expiresIn: JWT_CONFIG.refreshTokenExpiry,
        issuer: JWT_CONFIG.issuer,
        audience: JWT_CONFIG.audience
    });
}

/**
 * Generate both access and refresh tokens
 * @param {Object} user - User object
 * @returns {Object} Object containing accessToken and refreshToken
 */
function generateTokenPair(user) {
    return {
        accessToken: generateAccessToken(user),
        refreshToken: generateRefreshToken(user)
    };
}

/**
 * Verify access token
 * @param {string} token - JWT access token
 * @returns {Object} Decoded token payload or error
 */
function verifyAccessToken(token) {
    try {
        return jwt.verify(token, JWT_CONFIG.accessTokenSecret, {
            issuer: JWT_CONFIG.issuer,
            audience: JWT_CONFIG.audience
        });
    } catch (error) {
        return { error: error.message };
    }
}

/**
 * Verify refresh token
 * @param {string} token - JWT refresh token
 * @returns {Object} Decoded token payload or error
 */
function verifyRefreshToken(token) {
    try {
        return jwt.verify(token, JWT_CONFIG.refreshTokenSecret, {
            issuer: JWT_CONFIG.issuer,
            audience: JWT_CONFIG.audience
        });
    } catch (error) {
        return { error: error.message };
    }
}

/**
 * Refresh access token using a valid refresh token
 * @param {string} refreshToken - Valid refresh token
 * @param {Object} userData - User data to generate new access token
 * @returns {Object} New access token or error
 */
function refreshAccessToken(refreshToken, userData) {
    const decoded = verifyRefreshToken(refreshToken);
    
    if (decoded.error) {
        return { error: 'Invalid refresh token' };
    }
    
    if (decoded.type !== 'refresh') {
        return { error: 'Token is not a refresh token' };
    }
    
    return {
        accessToken: generateAccessToken(userData)
    };
}

/**
 * Decode token without verification (for inspection)
 * @param {string} token - JWT token
 * @returns {Object} Decoded token payload
 */
function decodeToken(token) {
    return jwt.decode(token);
}

/**
 * Check if token is about to expire (within threshold)
 * @param {string} token - JWT token
 * @param {number} thresholdSeconds - Threshold in seconds (default: 300 = 5 minutes)
 * @returns {boolean} True if token is about to expire
 */
function isTokenExpiringSoon(token, thresholdSeconds = 300) {
    try {
        const decoded = jwt.decode(token);
        if (!decoded || !decoded.exp) return false;
        
        const currentTime = Math.floor(Date.now() / 1000);
        const timeUntilExpiry = decoded.exp - currentTime;
        
        return timeUntilExpiry <= thresholdSeconds;
    } catch (error) {
        return false;
    }
}

/**
 * Get token expiration time
 * @param {string} token - JWT token
 * @returns {Date|null} Expiration date or null
 */
function getTokenExpiry(token) {
    try {
        const decoded = jwt.decode(token);
        return decoded && decoded.exp ? new Date(decoded.exp * 1000) : null;
    } catch (error) {
        return null;
    }
}

// Export all functions
module.exports = {
    generateRandomSecret,
    generateAccessToken,
    generateRefreshToken,
    generateTokenPair,
    verifyAccessToken,
    verifyRefreshToken,
    refreshAccessToken,
    decodeToken,
    isTokenExpiringSoon,
    getTokenExpiry,
    JWT_CONFIG
};
                    </code></pre>
                </div>
            </section>

            <!-- Usage Examples -->
            <section class="bg-white rounded-xl shadow-md p-6">
                <h2 class="text-2xl font-semibold mb-4 text-gray-900">Usage Examples</h2>
                
                <div class="space-y-6">
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <h3 class="font-medium text-gray-900 mb-2">1. Generating Tokens</h3>
                        <pre class="text-sm bg-gray-100 p-3 rounded"><code class="language-javascript">
const { generateTokenPair } = require('./utils/jwtUtils');

const user = {
    id: '12345',
    email: 'user@example.com',
    roles: ['user', 'admin']
};

const tokens = generateTokenPair(user);
console.log('Access Token:', tokens.accessToken);
console.log('Refresh Token:', tokens.refreshToken);
                        </code></pre>
                    </div>

                    <div class="bg-gray-50 p-4 rounded-lg">
                        <h3 class="font-medium text-gray-900 mb-2">2. Verifying Tokens</h3>
                        <pre class="text-sm bg-gray-100 p-3 rounded"><code class="language-javascript">
const { verifyAccessToken } = require('./utils/jwtUtils');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
const result = verifyAccessToken(token);

if (result.error) {
    console.error('Token verification failed:', result.error);
} else {
    console.log('Token is valid. User ID:', result.sub);
}
                        </code></pre>
                    </div>

                    <div class="bg-gray-50 p-4 rounded-lg">
                        <h3 class="font-medium text-gray-900 mb-2">3. Refreshing Tokens</h3>
                        <pre class="text-sm bg-gray-100 p-3 rounded"><code class="language-javascript">
const { refreshAccessToken } = require('./utils/jwtUtils');

const refreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
const userData = { id: '12345', email: 'user@example.com', roles: ['user'] };

const newTokens = refreshAccessToken(refreshToken, userData);

if (newTokens.error) {
    console.error('Refresh failed:', newTokens.error);
} else {
    console.log('New Access Token:', newTokens.accessToken);
}
                        </code></pre>
                    </div>
                </div>
            </section>

            <!-- Environment Variables -->
            <section class="bg-white rounded-xl shadow-md p-6">
                <h2 class="text-2xl font-semibold mb-4 text-gray-900">Environment Variables</h2>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variable</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Default</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr>
                                <td class="px-4 py-3 text-sm font-mono">JWT_ACCESS_SECRET</td>
                                <td class="px-4 py-3 text-sm">Secret key for signing access tokens</td>
                                <td class="px-4 py-3 text-sm font-mono">your-access-secret-key-change-in-production</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-3 text-sm font-mono">JWT_REFRESH_SECRET</td>
                                <td class="px-4 py-3 text-sm">Secret key for signing refresh tokens</td>
                                <td class="px-4 py-3 text-sm font-mono">your-refresh-secret-key-change-in-production</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- Best Practices -->
            <section class="bg-white rounded-xl shadow-md p-6">
                <h2 class="text-2xl font-semibold mb-4 text-gray-900">Best Practices</h2>
                <ul class="space-y-3 text-gray-700">
                    <li class="flex items-start">
                        <span class="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Always use different secrets for access and refresh tokens</span>
                    </li>
                    <li class="flex items-start">
                        <span class="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Store secrets in environment variables, never in code</span>
                    </li>
                    <li class="flex items-start">
                        <span class="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Use short expiration times for access tokens (15-30 minutes)</span>
                    </li>
                    <li class="flex items-start">
                        <span class="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Use longer expiration times for refresh tokens (7-30 days)</span>
                    </li>
                    <li class="flex items-start">
                        <span class="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Implement token blacklisting for logout functionality</span>
                    </li>
                    <li class="flex items-start">
                        <span class="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Use HTTPS in production to prevent token interception</span>
                    </li>
                </ul>
            </section>
        </main>

        <footer class="mt-12 pt-8 border-t border-gray-200 text-center text-gray-600 text-sm">
            <p>JWT Utilities Module • Created with security best practices in mind</p>
            <p class="mt-2">Remember to rotate your JWT secrets periodically in production</p>
        </footer>
    </div>

    <script>
        // Initialize syntax highlighting
        document.addEventListener('DOMContentLoaded', function() {
            document.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });
        });
    </script>
</body>
</html>
<!-- update 1774955533.073746 -->