html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Auth Controller Code</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/atom-one-dark.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js"></script>
    <script>hljs.highlightAll();</script>
</head>
<body class="bg-gray-900 text-gray-100 min-h-screen p-6">
    <div class="max-w-6xl mx-auto">
        <header class="mb-10">
            <h1 class="text-3xl font-bold text-blue-400 mb-2">
                <i class="fas fa-lock mr-3"></i>Authentication Controller
            </h1>
            <p class="text-gray-400">JWT-based authentication controller for Node.js/Express applications</p>
            <div class="flex items-center mt-4 text-sm text-gray-500">
                <span class="bg-gray-800 px-3 py-1 rounded mr-3">
                    <i class="fas fa-file-code mr-1"></i> server/controllers/authController.js
                </span>
                <span class="bg-gray-800 px-3 py-1 rounded">
                    <i class="fas fa-shield-alt mr-1"></i> JWT Authentication
                </span>
            </div>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Main Code Panel -->
            <div class="lg:col-span-2">
                <div class="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
                    <div class="bg-gray-900 px-6 py-4 border-b border-gray-700 flex justify-between items-center">
                        <div class="flex items-center">
                            <div class="flex space-x-2 mr-4">
                                <div class="w-3 h-3 rounded-full bg-red-500"></div>
                                <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div class="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                            <span class="font-mono text-sm">authController.js</span>
                        </div>
                        <button id="copyBtn" class="text-blue-400 hover:text-blue-300 text-sm">
                            <i class="far fa-copy mr-1"></i> Copy Code
                        </button>
                    </div>
                    <pre class="p-0 m-0 overflow-auto max-h-[600px]"><code class="javascript rounded-lg" id="codeBlock">
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret-key';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '30d';

/**
 * Generate JWT token
 * @param {Object} user - User object
 * @returns {String} JWT token
 */
const generateToken = (user) => {
    return jwt.sign(
        { 
            id: user._id, 
            email: user.email,
            role: user.role 
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
};

/**
 * Generate refresh token
 * @param {Object} user - User object
 * @returns {String} Refresh token
 */
const generateRefreshToken = (user) => {
    return jwt.sign(
        { 
            id: user._id,
            type: 'refresh' 
        },
        REFRESH_TOKEN_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
    );
};

/**
 * Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
exports.register = async (req, res) => {
    try {
        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false, 
                errors: errors.array() 
            });
        }

        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // Generate tokens
        const token = generateToken(user);
        const refreshToken = generateRefreshToken(user);

        // Save refresh token to user document
        user.refreshToken = refreshToken;
        await user.save();

        // Remove password from response
        const userResponse = user.toObject();
        delete userResponse.password;
        delete userResponse.refreshToken;

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            refreshToken,
            user: userResponse
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Login user
 * @route POST /api/auth/login
 * @access Public
 */
exports.login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false, 
                errors: errors.array() 
            });
        }

        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate tokens
        const token = generateToken(user);
        const refreshToken = generateRefreshToken(user);

        // Save refresh token
        user.refreshToken = refreshToken;
        await user.save();

        // Remove sensitive data from response
        const userResponse = user.toObject();
        delete userResponse.password;
        delete userResponse.refreshToken;

        res.json({
            success: true,
            message: 'Login successful',
            token,
            refreshToken,
            user: userResponse
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Refresh access token
 * @route POST /api/auth/refresh-token
 * @access Public
 */
exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: 'Refresh token is required'
            });
        }

        // Verify refresh token
        let decoded;
        try {
            decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired refresh token'
            });
        }

        // Find user with this refresh token
        const user = await User.findOne({ 
            _id: decoded.id, 
            refreshToken: refreshToken 
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid refresh token'
            });
        }

        // Generate new access token
        const newAccessToken = generateToken(user);

        res.json({
            success: true,
            token: newAccessToken
        });

    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during token refresh'
        });
    }
};

/**
 * Logout user (invalidate refresh token)
 * @route POST /api/auth/logout
 * @access Private
 */
exports.logout = async (req, res) => {
    try {
        const userId = req.user.id;

        // Clear refresh token from user document
        await User.findByIdAndUpdate(userId, { 
            $unset: { refreshToken: 1 } 
        });

        res.json({
            success: true,
            message: 'Logged out successfully'
        });

    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during logout'
        });
    }
};

/**
 * Get current user profile
 * @route GET /api/auth/me
 * @access Private
 */
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password -refreshToken');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching profile'
        });
    }
};

/**
 * Middleware to verify JWT token
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
exports.verifyToken = (req, res, next) => {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. No token provided.'
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token has expired',
                expiredAt: error.expiredAt
            });
        }
        
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
};

/**
 * Middleware to check user role
 * @param {...String} roles - Allowed roles
 * @returns {Function} Middleware function
 */
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Role ${req.user.role} is not authorized to access this resource`
            });
        }

        next();
    };
};

/**
 * Validate token (for client-side checking)
 * @route POST /api/auth/validate-token
 * @access Private
 */
exports.validateToken = (req, res) => {
    res.json({
        success: true,
        message: 'Token is valid',
        user: req.user
    });
};
                    </code></pre>
                </div>
            </div>

            <!-- Sidebar -->
            <div class="space-y-8">
                <!-- Dependencies Card -->
                <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h3 class="text-xl font-bold text-blue-400 mb-4">
                        <i class="fas fa-boxes mr-2"></i> Required Dependencies
                    </h3>
                    <ul class="space-y-3">
                        <li class="flex items-center">
                            <span class="bg-blue-900 text-blue-300 px-3 py-1 rounded text-sm font-mono mr-3">jsonwebtoken</span>
                            <span class="text-gray-400">JWT generation & verification</span>
                        </li>
                        <li class="flex items-center">
                            <span class="bg-blue-900 text-blue-300 px-3 py-1 rounded text-sm font-mono mr-3">bcryptjs</span>
                            <span class="text-gray-400">Password hashing</span>
                        </li>
                        <li class="flex items-center">
                            <span class="bg-blue-900 text-blue-300 px-3 py-1 rounded text-sm font-mono mr-3">express-validator</span>
                            <span class="text-gray-400">Request validation</span>
                        </li>
                    </ul>
                    <div class="mt-6 p-4 bg-gray-900 rounded-lg">
                        <p class="text-sm text-gray-400 mb-2">Install with:</p>
                        <code class="bg-black text-green-400 px-3 py-2 rounded block text-sm font-mono">
                            npm install jsonwebtoken bcryptjs express-validator
                        </code>
                    </div>
                </div>

                <!-- Functions Card -->
                <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h3 class="text-xl font-bold text-green-400 mb-4">
                        <i class="fas fa-functions mr-2"></i> Controller Functions
                    </h3>
                    <div class="space-y-3">
                        <div class="p-3 bg-gray-900 rounded hover:bg-gray-850">
                            <div class="font-mono text-sm text-green-300">register()</div>
                            <div class="text-sm text-gray-400 mt-1">Creates new user with hashed password</div>
                        </div>
                        <div class="p-3 bg-gray-900 rounded hover:bg-gray-850">
                            <div class="font-mono text-sm text-green-300">login()</div>
                            <div class="text-sm text-gray-400 mt-1">Authenticates user & returns JWT tokens</div>
                        </div>
                        <div class="p-3 bg-gray-900 rounded hover:bg-gray-850">
                            <div class="font-mono text-sm text-green-300">refreshToken()</div>
                            <div class="text-sm text-gray-400 mt-1">Generates new access token using refresh token</div>
                        </div>
                        <div class="p-3 bg-gray-900 rounded hover:bg-gray-850">
                            <div class="font-mono text-sm text-green-300">verifyToken()</div>
                            <div class="text-sm text-gray-400 mt-1">Middleware for JWT authentication</div>
                        </div>
                        <div class="p-3 bg-gray-900 rounded hover:bg-gray-850">
                            <div class="font-mono text-sm text-green-300">authorize()</div>
                            <div class="text-sm text-gray-400 mt-1">Role-based authorization middleware</div>
                        </div>
                    </div>
                </div>

                <!-- Usage Example -->
                <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h3 class="text-xl font-bold text-yellow-400 mb-4">
                        <i class="fas fa-code mr-2"></i> Router Setup Example
                    </h3>
                    <pre class="bg-black p-4 rounded text-sm overflow-auto"><code class="javascript">
// In server/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { body } = require('express-validator');

// Public routes
router.post('/register', [
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
], authController.register);

router.post('/login', [
    body('email').isEmail(),
    body('password').exists()
], authController.login);

router.post('/refresh-token', authController.refreshToken);

// Protected routes
router.get('/me', authController.verifyToken, authController.getMe);
router.post('/logout', authController.verifyToken, authController.logout);
router.post('/validate-token', authController.verifyToken, authController.validateToken);

// Admin only route example
router.get('/admin', 
    authController.verifyToken, 
    authController.authorize('admin'), 
    (req, res) => {
        res.json({ message: 'Admin access granted' });
    }
);

module.exports = router;
                    </code></pre>
                </div>
            </div>
        </div>

        <!-- Environment Variables -->
        <div class="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 class="text-xl font-bold text-purple-400 mb-4">
                <i class="fas fa-cog mr-2"></i> Environment Variables
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-gray-900 p-4 rounded">
                    <div class="font-mono text-sm text-purple-300">JWT_SECRET</div>
                    <div class="text-sm text-gray-400 mt-1">Secret key for signing access tokens</div>
                </div>
                <div
<!-- update 1774955530.6639938 -->