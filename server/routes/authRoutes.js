html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Auth Routes Documentation</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 text-gray-800">
    <div class="container mx-auto px-4 py-8">
        <header class="mb-10">
            <h1 class="text-4xl font-bold text-gray-900 mb-2">Authentication Routes</h1>
            <p class="text-gray-600">Express.js routes for login, logout, and token refresh endpoints</p>
            <div class="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500">
                <p class="text-sm text-blue-800"><strong>File:</strong> server/routes/authRoutes.js</p>
            </div>
        </header>

        <main class="space-y-12">
            <!-- Route Overview -->
            <section class="bg-white rounded-xl shadow-md p-6">
                <h2 class="text-2xl font-semibold mb-4 text-gray-800">Route Overview</h2>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-100">
                            <tr>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Method</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Endpoint</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Description</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            <tr>
                                <td class="px-4 py-3"><span class="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">POST</span></td>
                                <td class="px-4 py-3 font-mono text-gray-900">/api/auth/login</td>
                                <td class="px-4 py-3">Authenticate user and return access/refresh tokens</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-3"><span class="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">POST</span></td>
                                <td class="px-4 py-3 font-mono text-gray-900">/api/auth/logout</td>
                                <td class="px-4 py-3">Invalidate refresh token and clear authentication</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-3"><span class="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">POST</span></td>
                                <td class="px-4 py-3 font-mono text-gray-900">/api/auth/refresh</td>
                                <td class="px-4 py-3">Generate new access token using refresh token</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- Code Implementation -->
            <section class="bg-white rounded-xl shadow-md p-6">
                <h2 class="text-2xl font-semibold mb-4 text-gray-800">Implementation Code</h2>
                <div class="space-y-8">
                    <!-- Login Route -->
                    <div>
                        <h3 class="text-xl font-medium mb-3 text-gray-700">Login Route</h3>
                        <div class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                            <pre><code class="text-sm font-mono">
// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ 
                error: 'Email and password are required' 
            });
        }
        
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                error: 'Invalid credentials' 
            });
        }
        
        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ 
                error: 'Invalid credentials' 
            });
        }
        
        // Generate tokens
        const accessToken = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );
        
        const refreshToken = jwt.sign(
            { userId: user._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        );
        
        // Store refresh token in database
        user.refreshToken = refreshToken;
        await user.save();
        
        // Set refresh token as HTTP-only cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        
        // Return access token
        res.json({
            accessToken,
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
                            </code></pre>
                        </div>
                    </div>

                    <!-- Logout Route -->
                    <div>
                        <h3 class="text-xl font-medium mb-3 text-gray-700">Logout Route</h3>
                        <div class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                            <pre><code class="text-sm font-mono">
// POST /api/auth/logout
router.post('/logout', async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        
        if (!refreshToken) {
            return res.status(204).send(); // No content
        }
        
        // Find user with this refresh token
        const user = await User.findOne({ refreshToken });
        if (user) {
            // Clear refresh token from database
            user.refreshToken = null;
            await user.save();
        }
        
        // Clear the refresh token cookie
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        
        res.status(200).json({ message: 'Logged out successfully' });
        
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
                            </code></pre>
                        </div>
                    </div>

                    <!-- Refresh Token Route -->
                    <div>
                        <h3 class="text-xl font-medium mb-3 text-gray-700">Refresh Token Route</h3>
                        <div class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                            <pre><code class="text-sm font-mono">
// POST /api/auth/refresh
router.post('/refresh', async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        
        if (!refreshToken) {
            return res.status(401).json({ error: 'Refresh token required' });
        }
        
        // Verify refresh token
        let decoded;
        try {
            decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        } catch (error) {
            return res.status(403).json({ error: 'Invalid refresh token' });
        }
        
        // Find user with this refresh token
        const user = await User.findOne({ 
            _id: decoded.userId, 
            refreshToken 
        });
        
        if (!user) {
            return res.status(403).json({ error: 'Invalid refresh token' });
        }
        
        // Generate new access token
        const accessToken = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );
        
        res.json({ accessToken });
        
    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
                            </code></pre>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Middleware Section -->
            <section class="bg-white rounded-xl shadow-md p-6">
                <h2 class="text-2xl font-semibold mb-4 text-gray-800">Required Middleware</h2>
                <div class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                    <pre><code class="text-sm font-mono">
// Import required modules
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware for parsing JSON and cookies
router.use(express.json());
const cookieParser = require('cookie-parser');
router.use(cookieParser());

// Export the router
module.exports = router;
                    </code></pre>
                </div>
            </section>

            <!-- Environment Variables -->
            <section class="bg-white rounded-xl shadow-md p-6">
                <h2 class="text-2xl font-semibold mb-4 text-gray-800">Environment Variables</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <h4 class="font-medium text-gray-700 mb-2">ACCESS_TOKEN_SECRET</h4>
                        <p class="text-sm text-gray-600">Secret key for signing access tokens (JWT)</p>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <h4 class="font-medium text-gray-700 mb-2">REFRESH_TOKEN_SECRET</h4>
                        <p class="text-sm text-gray-600">Secret key for signing refresh tokens (JWT)</p>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <h4 class="font-medium text-gray-700 mb-2">NODE_ENV</h4>
                        <p class="text-sm text-gray-600">Environment (development/production) for cookie security</p>
                    </div>
                </div>
            </section>
        </main>

        <footer class="mt-12 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
            <p>Authentication Routes Implementation • Express.js • JWT Authentication</p>
            <p class="mt-2">Use with proper security measures and validation in production</p>
        </footer>
    </div>
</body>
</html>
<!-- update 1774955529.2347374 -->