html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AuthContext.jsx</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
        .code-container {
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 14px;
            line-height: 1.5;
        }
        .keyword { color: #569cd6; }
        .function { color: #dcdcaa; }
        .string { color: #ce9178; }
        .comment { color: #6a9955; }
        .variable { color: #9cdcfe; }
        .constant { color: #4ec9b0; }
        .operator { color: #d4d4d4; }
    </style>
</head>
<body class="bg-gray-900 text-gray-100 p-6">
    <div class="max-w-6xl mx-auto">
        <h1 class="text-3xl font-bold mb-2 text-blue-400">auth/AuthContext.jsx</h1>
        <p class="text-gray-400 mb-6">React context for authentication state management with login/logout functions and JWT token storage</p>
        
        <div class="bg-gray-800 rounded-lg p-6 shadow-xl">
            <div class="code-container">
                <pre><code>
<span class="keyword">import</span> React, { createContext, useState, useContext, useEffect } <span class="keyword">from</span> <span class="string">'react'</span>;

<span class="comment">// Create the authentication context</span>
<span class="keyword">const</span> <span class="variable">AuthContext</span> = <span class="function">createContext</span>(<span class="keyword">null</span>);

<span class="comment">/**
 * Custom hook to use the authentication context
 * @returns {Object} Authentication context value
 */</span>
<span class="keyword">export const</span> <span class="function">useAuth</span> = () => {
    <span class="keyword">const</span> context = <span class="function">useContext</span>(<span class="variable">AuthContext</span>);
    <span class="keyword">if</span> (!context) {
        <span class="keyword">throw new</span> <span class="function">Error</span>(<span class="string">'useAuth must be used within an AuthProvider'</span>);
    }
    <span class="keyword">return</span> context;
};

<span class="comment">/**
 * Authentication provider component
 * Manages authentication state and provides login/logout functionality
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */</span>
<span class="keyword">export const</span> <span class="variable">AuthProvider</span> = ({ children }) => {
    <span class="comment">// State for authentication token</span>
    <span class="keyword">const</span> [token, setToken] = <span class="function">useState</span>(<span class="keyword">null</span>);
    
    <span class="comment">// State for user information</span>
    <span class="keyword">const</span> [user, setUser] = <span class="function">useState</span>(<span class="keyword">null</span>);
    
    <span class="comment">// State for loading status</span>
    <span class="keyword">const</span> [loading, setLoading] = <span class="function">useState</span>(<span class="keyword">true</span>);

    <span class="comment">/**
     * Initialize authentication state from localStorage
     */</span>
    <span class="function">useEffect</span>(() => {
        <span class="keyword">const</span> initializeAuth = () => {
            <span class="keyword">try</span> {
                <span class="keyword">const</span> storedToken = <span class="function">localStorage</span>.<span class="function">getItem</span>(<span class="string">'authToken'</span>);
                <span class="keyword">const</span> storedUser = <span class="function">localStorage</span>.<span class="function">getItem</span>(<span class="string">'user'</span>);
                
                <span class="keyword">if</span> (storedToken) {
                    <span class="function">setToken</span>(storedToken);
                    
                    <span class="keyword">if</span> (storedUser) {
                        <span class="function">setUser</span>(<span class="function">JSON</span>.<span class="function">parse</span>(storedUser));
                    }
                    
                    <span class="comment">// Validate token on initialization (optional)</span>
                    <span class="comment">// You can add token validation logic here</span>
                }
            } <span class="keyword">catch</span> (error) {
                <span class="function">console</span>.<span class="function">error</span>(<span class="string">'Error initializing auth:'</span>, error);
                <span class="function">logout</span>();
            } <span class="keyword">finally</span> {
                <span class="function">setLoading</span>(<span class="keyword">false</span>);
            }
        };

        <span class="function">initializeAuth</span>();
    }, []);

    <span class="comment">/**
     * Login function
     * @param {string} authToken - JWT token
     * @param {Object} userData - User information
     */</span>
    <span class="keyword">const</span> <span class="function">login</span> = (authToken, userData) => {
        <span class="keyword">try</span> {
            <span class="comment">// Store token in state</span>
            <span class="function">setToken</span>(authToken);
            
            <span class="comment">// Store user data in state</span>
            <span class="function">setUser</span>(userData);
            
            <span class="comment">// Persist to localStorage</span>
            <span class="function">localStorage</span>.<span class="function">setItem</span>(<span class="string">'authToken'</span>, authToken);
            <span class="function">localStorage</span>.<span class="function">setItem</span>(<span class="string">'user'</span>, <span class="function">JSON</span>.<span class="function">stringify</span>(userData));
            
            <span class="function">console</span>.<span class="function">log</span>(<span class="string">'Login successful'</span>);
        } <span class="keyword">catch</span> (error) {
            <span class="function">console</span>.<span class="function">error</span>(<span class="string">'Login error:'</span>, error);
            <span class="keyword">throw</span> error;
        }
    };

    <span class="comment">/**
     * Logout function
     * Clears authentication state and localStorage
     */</span>
    <span class="keyword">const</span> <span class="function">logout</span> = () => {
        <span class="function">setToken</span>(<span class="keyword">null</span>);
        <span class="function">setUser</span>(<span class="keyword">null</span>);
        
        <span class="function">localStorage</span>.<span class="function">removeItem</span>(<span class="string">'authToken'</span>);
        <span class="function">localStorage</span>.<span class="function">removeItem</span>(<span class="string">'user'</span>);
        
        <span class="function">console</span>.<span class="function">log</span>(<span class="string">'Logout successful'</span>);
    };

    <span class="comment">/**
     * Update user information
     * @param {Object} updatedUser - Updated user data
     */</span>
    <span class="keyword">const</span> <span class="function">updateUser</span> = (updatedUser) => {
        <span class="function">setUser</span>(updatedUser);
        <span class="function">localStorage</span>.<span class="function">setItem</span>(<span class="string">'user'</span>, <span class="function">JSON</span>.<span class="function">stringify</span>(updatedUser));
    };

    <span class="comment">/**
     * Check if user is authenticated
     * @returns {boolean} Authentication status
     */</span>
    <span class="keyword">const</span> <span class="function">isAuthenticated</span> = () => {
        <span class="keyword">return</span> !!token;
    };

    <span class="comment">// Context value containing all authentication methods and state</span>
    <span class="keyword">const</span> contextValue = {
        token,
        user,
        loading,
        login,
        logout,
        updateUser,
        isAuthenticated
    };

    <span class="keyword">return</span> (
        &lt;<span class="variable">AuthContext.Provider</span> <span class="variable">value</span>={contextValue}&gt;
            {children}
        &lt;/<span class="variable">AuthContext.Provider</span>&gt;
    );
};

<span class="comment">/**
 * Higher-order component to protect routes
 * @param {React.Component} Component - Component to protect
 * @returns {React.Component} Protected component
 */</span>
<span class="keyword">export const</span> <span class="function">withAuth</span> = (<span class="variable">Component</span>) => {
    <span class="keyword">return</span> <span class="function">function</span> <span class="variable">ProtectedComponent</span>(props) {
        <span class="keyword">const</span> { isAuthenticated, loading } = <span class="function">useAuth</span>();
        
        <span class="keyword">if</span> (loading) {
            <span class="keyword">return</span> (
                &lt;<span class="variable">div</span> <span class="variable">className</span>=<span class="string">"flex items-center justify-center min-h-screen"</span>&gt;
                    &lt;<span class="variable">div</span> <span class="variable">className</span>=<span class="string">"text-xl"</span>&gt;Loading...&lt;/<span class="variable">div</span>&gt;
                &lt;/<span class="variable">div</span>&gt;
            );
        }
        
        <span class="keyword">if</span> (!isAuthenticated()) {
            <span class="comment">// Redirect to login or show unauthorized message</span>
            <span class="keyword">return</span> (
                &lt;<span class="variable">div</span> <span class="variable">className</span>=<span class="string">"flex items-center justify-center min-h-screen"</span>&gt;
                    &lt;<span class="variable">div</span> <span class="variable">className</span>=<span class="string">"text-xl text-red-500"</span>&gt;
                        Unauthorized. Please log in.
                    &lt;/<span class="variable">div</span>&gt;
                &lt;/<span class="variable">div</span>&gt;
            );
        }
        
        <span class="keyword">return</span> &lt;<span class="variable">Component</span> {...props} /&gt;;
    };
};

<span class="keyword">export default</span> <span class="variable">AuthContext</span>;
                </code></pre>
            </div>
        </div>

        <div class="mt-8 bg-gray-800 rounded-lg p-6">
            <h2 class="text-xl font-bold mb-4 text-green-400">Usage Example</h2>
            <div class="code-container">
                <pre><code>
<span class="comment">// In your main App.jsx or index.jsx:</span>
<span class="keyword">import</span> React <span class="keyword">from</span> <span class="string">'react'</span>;
<span class="keyword">import</span> ReactDOM <span class="keyword">from</span> <span class="string">'react-dom/client'</span>;
<span class="keyword">import</span> { AuthProvider } <span class="keyword">from</span> <span class="string">'./auth/AuthContext'</span>;
<span class="keyword">import</span> App <span class="keyword">from</span> <span class="string">'./App'</span>;

<span class="keyword">const</span> root = <span class="function">ReactDOM</span>.<span class="function">createRoot</span>(<span class="function">document</span>.<span class="function">getElementById</span>(<span class="string">'root'</span>));
root.<span class="function">render</span>(
    &lt;<span class="variable">React.StrictMode</span>&gt;
        &lt;<span class="variable">AuthProvider</span>&gt;
            &lt;<span class="variable">App</span> /&gt;
        &lt;/<span class="variable">AuthProvider</span>&gt;
    &lt;/<span class="variable">React.StrictMode</span>&gt;
);

<span class="comment">// In a component that needs authentication:</span>
<span class="keyword">import</span> React <span class="keyword">from</span> <span class="string">'react'</span>;
<span class="keyword">import</span> { useAuth, withAuth } <span class="keyword">from</span> <span class="string">'./auth/AuthContext'</span>;

<span class="keyword">const</span> <span class="function">LoginComponent</span> = () => {
    <span class="keyword">const</span> { login } = <span class="function">useAuth</span>();
    
    <span class="keyword">const</span> <span class="function">handleLogin</span> = () => {
        <span class="comment">// Simulate API call</span>
        <span class="keyword">const</span> mockToken = <span class="string">'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'</span>;
        <span class="keyword">const</span> mockUser = { id: 1, name: <span class="string">'John Doe'</span>, email: <span class="string">'john@example.com'</span> };
        
        <span class="function">login</span>(mockToken, mockUser);
    };
    
    <span class="keyword">return</span> (
        &lt;<span class="variable">button</span> <span class="variable">onClick</span>={handleLogin}&gt;
            Login
        &lt;/<span class="variable">button</span>&gt;
    );
};

<span class="keyword">const</span> <span class="function">ProtectedComponent</span> = () => {
    <span class="keyword">const</span> { user, logout } = <span class="function">useAuth</span>();
    
    <span class="keyword">return</span> (
        &lt;<span class="variable">div</span>&gt;
            &lt;<span class="variable">h1</span>&gt;Welcome, {user?.name}&lt;/<span class="variable">h1</span>&gt;
            &lt;<span class="variable">button</span> <span class="variable">onClick</span>={logout}&gt;
                Logout
            &lt;/<span class="variable">button</span>&gt;
        &lt;/<span class="variable">div</span>&gt;
    );
};

<span class="comment">// Wrap component with authentication HOC</span>
<span class="keyword">const</span> <span class="variable">ProtectedComponentWithAuth</span> = <span class="function">withAuth</span>(<span class="variable">ProtectedComponent</span>);
                </code></pre>
            </div>
        </div>
    </div>
</body>
</html>
<!-- update 1774955526.9100862 -->