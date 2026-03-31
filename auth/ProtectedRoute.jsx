html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ProtectedRoute Component</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body class="bg-gray-100 min-h-screen p-8">
    <div id="root" class="max-w-4xl mx-auto"></div>

    <script type="text/babel">
        const { useState, useEffect, useContext, createContext } = React;

        // Create Auth Context
        const AuthContext = createContext();

        // Mock Auth Provider Component
        const AuthProvider = ({ children }) => {
            const [user, setUser] = useState(null);
            const [loading, setLoading] = useState(true);

            useEffect(() => {
                // Simulate authentication check
                const timer = setTimeout(() => {
                    const mockUser = localStorage.getItem('user');
                    if (mockUser) {
                        setUser(JSON.parse(mockUser));
                    }
                    setLoading(false);
                }, 500);

                return () => clearTimeout(timer);
            }, []);

            const login = (userData) => {
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
            };

            const logout = () => {
                setUser(null);
                localStorage.removeItem('user');
            };

            return (
                <AuthContext.Provider value={{ user, loading, login, logout }}>
                    {children}
                </AuthContext.Provider>
            );
        };

        // ProtectedRoute Component
        const ProtectedRoute = ({ children, redirectTo = "/login" }) => {
            const { user, loading } = useContext(AuthContext);
            const [shouldRedirect, setShouldRedirect] = useState(false);

            useEffect(() => {
                if (!loading && !user) {
                    setShouldRedirect(true);
                }
            }, [user, loading]);

            if (loading) {
                return (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                );
            }

            if (shouldRedirect) {
                // In a real app, you would use react-router's Navigate component
                // For this demo, we'll show a redirect message
                return (
                    <div className="text-center p-8">
                        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
                            <p className="font-bold">Authentication Required</p>
                            <p>Redirecting to login page...</p>
                        </div>
                        <button 
                            onClick={() => window.location.href = redirectTo}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Go to Login
                        </button>
                    </div>
                );
            }

            return children;
        };

        // Example Usage Components
        const Dashboard = () => (
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h2>
                <p className="text-gray-600">Welcome to your protected dashboard!</p>
                <p className="text-gray-600 mt-2">This content is only visible to authenticated users.</p>
            </div>
        );

        const LoginPage = () => {
            const { login } = useContext(AuthContext);
            
            const handleLogin = () => {
                login({
                    id: 1,
                    name: "John Doe",
                    email: "john@example.com",
                    role: "user"
                });
            };

            return (
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Login</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Email
                            </label>
                            <input 
                                type="email" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your email"
                                defaultValue="john@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Password
                            </label>
                            <input 
                                type="password" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your password"
                                defaultValue="password123"
                            />
                        </div>
                        <button 
                            onClick={handleLogin}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            );
        };

        const App = () => {
            const { user, logout } = useContext(AuthContext);
            const [currentPage, setCurrentPage] = useState('dashboard');

            return (
                <div className="space-y-8">
                    <header className="bg-white shadow-lg rounded-lg p-6">
                        <div className="flex justify-between items-center">
                            <h1 className="text-3xl font-bold text-gray-800">ProtectedRoute Demo</h1>
                            <div className="flex items-center space-x-4">
                                {user ? (
                                    <>
                                        <span className="text-gray-600">
                                            Welcome, <span className="font-semibold">{user.name}</span>
                                        </span>
                                        <button 
                                            onClick={logout}
                                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <button 
                                        onClick={() => setCurrentPage('login')}
                                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Login
                                    </button>
                                )}
                            </div>
                        </div>
                    </header>

                    <main>
                        {currentPage === 'dashboard' ? (
                            <ProtectedRoute redirectTo="/login">
                                <Dashboard />
                            </ProtectedRoute>
                        ) : (
                            <LoginPage />
                        )}
                    </main>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">ProtectedRoute Component Features:</h3>
                        <ul className="list-disc pl-5 space-y-2 text-gray-600">
                            <li>Checks authentication status using context</li>
                            <li>Shows loading state while checking auth</li>
                            <li>Redirects unauthenticated users to login</li>
                            <li>Renders children only when authenticated</li>
                            <li>Accepts custom redirect path via props</li>
                        </ul>
                    </div>
                </div>
            );
        };

        // Render the app
        const Root = () => (
            <AuthProvider>
                <App />
            </AuthProvider>
        );

        ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
    </script>
</body>
</html>
<!-- update 1774955528.4808483 -->