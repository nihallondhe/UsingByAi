html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Model Code</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/atom-one-dark.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js"></script>
    <script>hljs.highlightAll();</script>
    <style>
        .code-container {
            font-family: 'Courier New', monospace;
            font-size: 14px;
        }
        .hljs {
            background: #1a202c !important;
            border-radius: 0.5rem;
            padding: 1.5rem !important;
        }
    </style>
</head>
<body class="bg-gray-900 text-gray-100 min-h-screen p-4 md:p-8">
    <div class="max-w-6xl mx-auto">
        <header class="mb-8">
            <h1 class="text-3xl font-bold text-blue-400 mb-2">
                <i class="fas fa-database mr-3"></i>User Model Implementation
            </h1>
            <p class="text-gray-400">Mongoose User model with password hashing and JWT token methods</p>
            <div class="flex flex-wrap gap-2 mt-4">
                <span class="bg-blue-900 text-blue-300 px-3 py-1 rounded-full text-sm">Mongoose</span>
                <span class="bg-green-900 text-green-300 px-3 py-1 rounded-full text-sm">bcryptjs</span>
                <span class="bg-purple-900 text-purple-300 px-3 py-1 rounded-full text-sm">jsonwebtoken</span>
                <span class="bg-yellow-900 text-yellow-300 px-3 py-1 rounded-full text-sm">Node.js</span>
            </div>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div class="bg-gray-800 p-6 rounded-xl">
                <h2 class="text-xl font-semibold text-green-400 mb-4">
                    <i class="fas fa-key mr-2"></i>Features
                </h2>
                <ul class="space-y-3">
                    <li class="flex items-start">
                        <i class="fas fa-check text-green-500 mt-1 mr-3"></i>
                        <span>Secure password hashing with bcrypt</span>
                    </li>
                    <li class="flex items-start">
                        <i class="fas fa-check text-green-500 mt-1 mr-3"></i>
                        <span>JWT token generation and verification</span>
                    </li>
                    <li class="flex items-start">
                        <i class="fas fa-check text-green-500 mt-1 mr-3"></i>
                        <span>Pre-save middleware for password hashing</span>
                    </li>
                    <li class="flex items-start">
                        <i class="fas fa-check text-green-500 mt-1 mr-3"></i>
                        <span>Instance methods for authentication</span>
                    </li>
                    <li class="flex items-start">
                        <i class="fas fa-check text-green-500 mt-1 mr-3"></i>
                        <span>Schema validation and indexing</span>
                    </li>
                </ul>
            </div>

            <div class="bg-gray-800 p-6 rounded-xl">
                <h2 class="text-xl font-semibold text-yellow-400 mb-4">
                    <i class="fas fa-cube mr-2"></i>Dependencies
                </h2>
                <div class="space-y-4">
                    <div>
                        <h3 class="font-medium text-gray-300 mb-1">Required Packages:</h3>
                        <code class="bg-gray-900 text-gray-300 px-3 py-1 rounded text-sm block">npm install mongoose bcryptjs jsonwebtoken</code>
                    </div>
                    <div>
                        <h3 class="font-medium text-gray-300 mb-1">Environment Variables:</h3>
                        <code class="bg-gray-900 text-gray-300 px-3 py-1 rounded text-sm block">JWT_SECRET=your_super_secret_key</code>
                        <code class="bg-gray-900 text-gray-300 px-3 py-1 rounded text-sm block">JWT_EXPIRE=30d</code>
                    </div>
                </div>
            </div>

            <div class="bg-gray-800 p-6 rounded-xl">
                <h2 class="text-xl font-semibold text-red-400 mb-4">
                    <i class="fas fa-exclamation-triangle mr-2"></i>Important Notes
                </h2>
                <ul class="space-y-3">
                    <li class="flex items-start">
                        <i class="fas fa-shield-alt text-red-400 mt-1 mr-3"></i>
                        <span>Never store JWT secret in code - use environment variables</span>
                    </li>
                    <li class="flex items-start">
                        <i class="fas fa-user-secret text-red-400 mt-1 mr-3"></i>
                        <span>Passwords are hashed before saving to database</span>
                    </li>
                    <li class="flex items-start">
                        <i class="fas fa-clock text-red-400 mt-1 mr-3"></i>
                        <span>Adjust JWT expiration based on your security needs</span>
                    </li>
                    <li class="flex items-start">
                        <i class="fas fa-database text-red-400 mt-1 mr-3"></i>
                        <span>Email field is indexed for faster queries</span>
                    </li>
                </ul>
            </div>
        </div>

        <div class="bg-gray-800 rounded-xl overflow-hidden mb-8">
            <div class="bg-gray-900 px-6 py-4 border-b border-gray-700 flex justify-between items-center">
                <div class="flex items-center">
                    <i class="fas fa-file-code text-blue-400 mr-3"></i>
                    <h2 class="text-xl font-bold text-gray-200">server/models/User.js</h2>
                </div>
                <div class="text-sm text-gray-400">
                    <i class="fas fa-code mr-1"></i> JavaScript
                </div>
            </div>
            
            <div class="p-1">
                <pre><code class="javascript code-container">
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Don't return password in queries by default
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    emailVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,
    verificationExpire: Date
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Index for faster email queries
UserSchema.index({ email: 1 });

// Pre-save middleware to hash password
UserSchema.pre('save', async function(next) {
    // Only hash the password if it's modified (or new)
    if (!this.isModified('password')) {
        return next();
    }
    
    try {
        // Generate salt
        const salt = await bcrypt.genSalt(10);
        // Hash password with salt
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare entered password with hashed password
UserSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate JWT token
UserSchema.methods.generateAuthToken = function() {
    return jwt.sign(
        { 
            id: this._id,
            email: this.email,
            role: this.role 
        },
        process.env.JWT_SECRET || 'fallback_secret_key_change_in_production',
        {
            expiresIn: process.env.JWT_EXPIRE || '30d'
        }
    );
};

// Method to generate password reset token
UserSchema.methods.generatePasswordResetToken = function() {
    // Generate a random token
    const resetToken = require('crypto').randomBytes(32).toString('hex');
    
    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = require('crypto')
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    
    // Set expire (10 minutes from now)
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    
    return resetToken;
};

// Method to generate email verification token
UserSchema.methods.generateVerificationToken = function() {
    const verificationToken = require('crypto').randomBytes(32).toString('hex');
    
    this.verificationToken = require('crypto')
        .createHash('sha256')
        .update(verificationToken)
        .digest('hex');
    
    this.verificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    
    return verificationToken;
};

// Static method to find user by token (for password reset)
UserSchema.statics.findByResetToken = function(token) {
    const hashedToken = require('crypto')
        .createHash('sha256')
        .update(token)
        .digest('hex');
    
    return this.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() }
    });
};

// Static method to find user by verification token
UserSchema.statics.findByVerificationToken = function(token) {
    const hashedToken = require('crypto')
        .createHash('sha256')
        .update(token)
        .digest('hex');
    
    return this.findOne({
        verificationToken: hashedToken,
        verificationExpire: { $gt: Date.now() }
    });
};

// Virtual for user's full profile URL (example)
UserSchema.virtual('profileUrl').get(function() {
    return `/api/v1/users/${this._id}/profile`;
});

// Update last login timestamp
UserSchema.methods.updateLastLogin = function() {
    this.lastLogin = Date.now();
    return this.save({ validateBeforeSave: false });
};

// Check if user is admin
UserSchema.methods.isAdmin = function() {
    return this.role === 'admin';
};

// Export the model
module.exports = mongoose.model('User', UserSchema);
                </code></pre>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-gray-800 p-6 rounded-xl">
                <h3 class="text-lg font-semibold text-blue-400 mb-4">
                    <i class="fas fa-user-plus mr-2"></i>Usage Example - Registration
                </h3>
                <pre><code class="javascript">
// In your controller
const User = require('./models/User');

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Create user
        const user = await User.create({
            name,
            email,
            password
        });
        
        // Generate token
        const token = user.generateAuthToken();
        
        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
                </code></pre>
            </div>

            <div class="bg-gray-800 p-6 rounded-xl">
                <h3 class="text-lg font-semibold text-green-400 mb-4">
                    <i class="fas fa-sign-in-alt mr-2"></i>Usage Example - Login
                </h3>
                <pre><code class="javascript">
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user with password selected
        const user = await User.findOne({ email })
            .select('+password');
        
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }
        
        // Check password
        const isMatch = await user.comparePassword(password);
        
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }
        
        // Update last login
        await user.updateLastLogin();
        
        // Generate token
        const token = user.generateAuthToken();
        
        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};
                </code></pre>
            </div>
        </div>

        <footer class="mt-12 pt-6 border-t border-gray-700 text-center text-gray-500 text-sm">
            <p>User Model Implementation • Secure Authentication System • Made with <i class="fas fa-heart text-red-500 mx-1"></i> for Node.js applications</p>
            <p class="mt-2">Remember to set environment variables and use HTTPS in production</p>
        </footer>
    </div>

    <script>
        // Copy code functionality
        document.addEventListener('DOMContentLoaded', function() {
            const codeBlocks = document.querySelectorAll('pre code');
            
            codeBlocks.forEach(block => {
                const container = block.parentElement.parentElement;
                const header = container.previousElementSibling;
                
                if (header && header.classList.contains('bg-gray-900')) {
                    const copyBtn = document.createElement('button');
                    copyBtn.innerHTML = '<i class="far fa-copy mr-2"></i>Copy';
                    copyBtn.className = 'bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors';
                    copyBtn.addEventListener('click', () => {
                        navigator.clipboard.writeText(block.textContent)
                            .then(() => {
                                copyBtn.innerHTML = '<i class="fas fa-check mr-2"></i>Copied!';
                                copyBtn.className = 'bg-green-600 text-white px-4 py-2 rounded-lg text-sm';
                                setTimeout(() => {
                                    copyBtn.innerHTML = '<i class="far fa-copy mr-2"></i>Copy';
                                    copyBtn.className = 'bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm';
                                }, 2000);
                            });
                    });
                    
                    header.querySelector('.flex').appendChild(copyBtn);
                }
            });
        });
    </script>
</body>
</html>
<!-- update 1774955531.5144253 -->