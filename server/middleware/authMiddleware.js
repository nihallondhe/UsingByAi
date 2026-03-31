html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JWT Authentication Middleware</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Fira Code', monospace; }
        .code-block { background-color: #1e293b; }
        .comment { color: #64748b; }
        .keyword { color: #60a5fa; }
        .function { color: #c084fc; }
        .string { color: #34d399; }
        .variable { color: #fbbf24; }
        .operator { color: #f87171; }
    </style>
</head>
<body class="bg-gray-900 text-gray-100 p-6">
    <div class="max-w-6xl mx-auto">
        <!-- Header -->
        <header class="mb-10">
            <h1 class="text-4xl font-bold text-blue-400 mb-2">
                <i class="fas fa-shield-alt mr-3"></i>JWT Authentication Middleware
            </h1>
            <p class="text-gray-400 text-lg">Secure middleware for token verification and user authentication</p>
            <div class="flex items-center mt-4 text-sm text-gray-500">
                <span class="mr-4"><i class="fas fa-file-code mr-1"></i> authMiddleware.js</span>
                <span class="mr-4"><i class="fas fa-folder mr-1"></i> server/middleware/</span>
                <span><i class="fas fa-server mr-1"></i> Node.js Express Middleware</span>
            </div>
        </header>

        <!-- Main Content -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Code Panel -->
            <div class="lg:col-span-2">
                <div class="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
                    <div class="bg-gray-900 px-6 py-4 border-b border-gray-700 flex justify-between items-center">
                        <div class="flex items-center">
                            <div class="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                            <div class="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                            <div class="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                            <span class="ml-4 text-gray-300 font-medium">server/middleware/authMiddleware.js</span>
                        </div>
                        <button class="text-blue-400 hover:text-blue-300 transition">
                            <i class="far fa-copy"></i> Copy Code
                        </button>
                    </div>
                    
                    <div class="p-6 overflow-x-auto">
                        <pre class="text-sm leading-relaxed">
<code><span class="comment">/**
 * JWT Authentication Middleware
 * Verifies tokens and authenticates users for protected routes
 * @module middleware/authMiddleware
 */</span>

<span class="keyword">const</span> jwt = <span class="function">require</span>(<span class="string">'jsonwebtoken'</span>);
<span class="keyword">const</span> User = <span class="function">require</span>(<span class="string">'../models/User'</span>);

<span class="comment">/**
 * Middleware to verify JWT token and authenticate user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */</span>
<span class="keyword">const</span> <span class="variable">authMiddleware</span> = <span class="keyword">async</span> (req, res, next) => {
    <span class="keyword">try</span> {
        <span class="comment">// Get token from Authorization header</span>
        <span class="keyword">const</span> <span class="variable">authHeader</span> = req.<span class="variable">headers</span>.<span class="variable">authorization</span>;
        
        <span class="keyword">if</span> (<span class="operator">!</span><span class="variable">authHeader</span> <span class="operator">||</span> <span class="operator">!</span><span class="variable">authHeader</span>.<span class="function">startsWith</span>(<span class="string">'Bearer '</span>)) {
            <span class="keyword">return</span> res.<span class="function">status</span>(<span class="number">401</span>).<span class="function">json</span>({
                <span class="variable">success</span>: <span class="keyword">false</span>,
                <span class="variable">message</span>: <span class="string">'Access denied. No token provided.'</span>
            });
        }

        <span class="comment">// Extract token from header</span>
        <span class="keyword">const</span> <span class="variable">token</span> = <span class="variable">authHeader</span>.<span class="function">split</span>(<span class="string">' '</span>)[<span class="number">1</span>];

        <span class="comment">// Verify token</span>
        <span class="keyword">const</span> <span class="variable">decoded</span> = jwt.<span class="function">verify</span>(
            <span class="variable">token</span>,
            process.<span class="variable">env</span>.<span class="variable">JWT_SECRET</span> <span class="operator">||</span> <span class="string">'your-secret-key'</span>
        );

        <span class="comment">// Find user by ID from decoded token</span>
        <span class="keyword">const</span> <span class="variable">user</span> = <span class="keyword">await</span> User.<span class="function">findById</span>(<span class="variable">decoded</span>.<span class="variable">userId</span>).<span class="function">select</span>(<span class="string">'-password'</span>);

        <span class="keyword">if</span> (<span class="operator">!</span><span class="variable">user</span>) {
            <span class="keyword">return</span> res.<span class="function">status</span>(<span class="number">401</span>).<span class="function">json</span>({
                <span class="variable">success</span>: <span class="keyword">false</span>,
                <span class="variable">message</span>: <span class="string">'User not found. Token is invalid.'</span>
            });
        }

        <span class="comment">// Check if user is active</span>
        <span class="keyword">if</span> (<span class="operator">!</span><span class="variable">user</span>.<span class="variable">isActive</span>) {
            <span class="keyword">return</span> res.<span class="function">status</span>(<span class="number">403</span>).<span class="function">json</span>({
                <span class="variable">success</span>: <span class="keyword">false</span>,
                <span class="variable">message</span>: <span class="string">'Account is deactivated. Please contact administrator.'</span>
            });
        }

        <span class="comment">// Attach user to request object</span>
        req.<span class="variable">user</span> = <span class="variable">user</span>;
        
        <span class="comment">// Proceed to next middleware/route handler</span>
        <span class="function">next</span>();
        
    } <span class="keyword">catch</span> (error) {
        <span class="comment">// Handle different JWT errors</span>
        <span class="keyword">let</span> <span class="variable">errorMessage</span> = <span class="string">'Authentication failed'</span>;
        <span class="keyword">let</span> <span class="variable">statusCode</span> = <span class="number">401</span>;

        <span class="keyword">if</span> (error.<span class="variable">name</span> === <span class="string">'TokenExpiredError'</span>) {
            <span class="variable">errorMessage</span> = <span class="string">'Token has expired. Please login again.'</span>;
        } <span class="keyword">else</span> <span class="keyword">if</span> (error.<span class="variable">name</span> === <span class="string">'JsonWebTokenError'</span>) {
            <span class="variable">errorMessage</span> = <span class="string">'Invalid token. Please provide a valid token.'</span>;
        } <span class="keyword">else</span> <span class="keyword">if</span> (error.<span class="variable">name</span> === <span class="string">'NotBeforeError'</span>) {
            <span class="variable">errorMessage</span> = <span class="string">'Token not yet active.'</span>;
        } <span class="keyword">else</span> {
            <span class="variable">errorMessage</span> = error.<span class="variable">message</span> <span class="operator">||</span> <span class="string">'Authentication error'</span>;
            <span class="variable">statusCode</span> = <span class="number">500</span>;
        }

        <span class="keyword">return</span> res.<span class="function">status</span>(<span class="variable">statusCode</span>).<span class="function">json</span>({
            <span class="variable">success</span>: <span class="keyword">false</span>,
            <span class="variable">message</span>: <span class="variable">errorMessage</span>,
            <span class="variable">error</span>: process.<span class="variable">env</span>.<span class="variable">NODE_ENV</span> === <span class="string">'development'</span> ? error.<span class="variable">stack</span> : undefined
        });
    }
};

<span class="comment">/**
 * Optional role-based authorization middleware
 * @param {...String} roles - Allowed roles for the route
 * @returns {Function} Middleware function
 */</span>
<span class="keyword">const</span> <span class="variable">authorize</span> = (...<span class="variable">roles</span>) => {
    <span class="keyword">return</span> (req, res, next) => {
        <span class="keyword">if</span> (<span class="operator">!</span>req.<span class="variable">user</span>) {
            <span class="keyword">return</span> res.<span class="function">status</span>(<span class="number">401</span>).<span class="function">json</span>({
                <span class="variable">success</span>: <span class="keyword">false</span>,
                <span class="variable">message</span>: <span class="string">'User not authenticated'</span>
            });
        }

        <span class="keyword">if</span> (<span class="operator">!</span><span class="variable">roles</span>.<span class="function">includes</span>(req.<span class="variable">user</span>.<span class="variable">role</span>)) {
            <span class="keyword">return</span> res.<span class="function">status</span>(<span class="number">403</span>).<span class="function">json</span>({
                <span class="variable">success</span>: <span class="keyword">false</span>,
                <span class="variable">message</span>: <span class="string">`Role ${req.user.role} is not authorized to access this resource`</span>
            });
        }

        <span class="function">next</span>();
    };
};

<span class="comment">// Export middleware functions</span>
module.<span class="variable">exports</span> = {
    <span class="variable">authMiddleware</span>,
    <span class="variable">authorize</span>
};</code></pre>
                    </div>
                </div>
            </div>

            <!-- Info Panel -->
            <div class="space-y-8">
                <!-- Middleware Info -->
                <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h2 class="text-xl font-bold text-green-400 mb-4">
                        <i class="fas fa-info-circle mr-2"></i>Middleware Features
                    </h2>
                    <ul class="space-y-3 text-gray-300">
                        <li class="flex items-start">
                            <i class="fas fa-check text-green-500 mt-1 mr-3"></i>
                            <span>JWT token verification and validation</span>
                        </li>
                        <li class="flex items-start">
                            <i class="fas fa-check text-green-500 mt-1 mr-3"></i>
                            <span>User authentication and request attachment</span>
                        </li>
                        <li class="flex items-start">
                            <i class="fas fa-check text-green-500 mt-1 mr-3"></i>
                            <span>Role-based authorization support</span>
                        </li>
                        <li class="flex items-start">
                            <i class="fas fa-check text-green-500 mt-1 mr-3"></i>
                            <span>Comprehensive error handling</span>
                        </li>
                        <li class="flex items-start">
                            <i class="fas fa-check text-green-500 mt-1 mr-3"></i>
                            <span>User status validation (active/inactive)</span>
                        </li>
                    </ul>
                </div>

                <!-- Usage Example -->
                <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h2 class="text-xl font-bold text-purple-400 mb-4">
                        <i class="fas fa-code mr-2"></i>Usage Example
                    </h2>
                    <div class="bg-gray-900 rounded-lg p-4 text-sm">
                        <code class="text-gray-300">
                            <span class="text-blue-400">const</span> { authMiddleware, authorize } = <span class="text-purple-400">require</span>(<span class="text-green-400">'./middleware/authMiddleware'</span>);<br><br>
                            
                            <span class="text-gray-500">// Protect a route</span><br>
                            router.<span class="text-yellow-400">get</span>(<span class="text-green-400">'/profile'</span>, authMiddleware, getProfile);<br><br>
                            
                            <span class="text-gray-500">// Protect with role authorization</span><br>
                            router.<span class="text-yellow-400">get</span>(<span class="text-green-400">'/admin'</span>, <br>
                            &nbsp;&nbsp;authMiddleware, <br>
                            &nbsp;&nbsp;authorize(<span class="text-green-400">'admin'</span>, <span class="text-green-400">'superadmin'</span>), <br>
                            &nbsp;&nbsp;adminController<br>
                            );
                        </code>
                    </div>
                </div>

                <!-- Dependencies -->
                <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h2 class="text-xl font-bold text-yellow-400 mb-4">
                        <i class="fas fa-box mr-2"></i>Required Dependencies
                    </h2>
                    <div class="space-y-2">
                        <div class="flex justify-between items-center p-3 bg-gray-900 rounded">
                            <span class="font-medium">jsonwebtoken</span>
                            <span class="text-green-400 text-sm">^9.0.0</span>
                        </div>
                        <div class="flex justify-between items-center p-3 bg-gray-900 rounded">
                            <span class="font-medium">User Model</span>
                            <span class="text-blue-400 text-sm">../models/User</span>
                        </div>
                    </div>
                </div>

                <!-- Environment Variables -->
                <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h2 class="text-xl font-bold text-red-400 mb-4">
                        <i class="fas fa-cog mr-2"></i>Environment Variables
                    </h2>
                    <div class="space-y-3">
                        <div>
                            <code class="bg-gray-900 px-3 py-1 rounded text-sm">JWT_SECRET=your-super-secret-key-here</code>
                            <p class="text-gray-400 text-sm mt-1">Secret key for signing and verifying tokens</p>
                        </div>
                        <div>
                            <code class="bg-gray-900 px-3 py-1 rounded text-sm">NODE_ENV=development/production</code>
                            <p class="text-gray-400 text-sm mt-1">Controls error stack trace visibility</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <footer class="mt-12 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
            <p>JWT Authentication Middleware • Secure your Express.js API endpoints</p>
            <p class="mt-2">Automatically handles token validation, user authentication, and role-based authorization</p>
        </footer>
    </div
<!-- update 1774955529.9635386 -->