html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Page</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body class="bg-gray-50 min-h-screen">
    <div id="root" class="flex items-center justify-center min-h-screen"></div>

    <script type="text/babel">
        const { useState } = React;

        const LoginPage = () => {
            const [formData, setFormData] = useState({
                email: '',
                password: ''
            });
            
            const [errors, setErrors] = useState({
                email: '',
                password: ''
            });
            
            const [isSubmitting, setIsSubmitting] = useState(false);
            const [submitMessage, setSubmitMessage] = useState('');

            const validateEmail = (email) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!email) return 'Email is required';
                if (!emailRegex.test(email)) return 'Please enter a valid email address';
                return '';
            };

            const validatePassword = (password) => {
                if (!password) return 'Password is required';
                if (password.length < 6) return 'Password must be at least 6 characters';
                return '';
            };

            const handleInputChange = (e) => {
                const { name, value } = e.target;
                setFormData(prev => ({
                    ...prev,
                    [name]: value
                }));
                
                // Clear error for this field when user starts typing
                if (errors[name]) {
                    setErrors(prev => ({
                        ...prev,
                        [name]: ''
                    }));
                }
            };

            const validateForm = () => {
                const newErrors = {
                    email: validateEmail(formData.email),
                    password: validatePassword(formData.password)
                };
                
                setErrors(newErrors);
                return !newErrors.email && !newErrors.password;
            };

            const handleSubmit = async (e) => {
                e.preventDefault();
                setSubmitMessage('');
                
                if (!validateForm()) {
                    return;
                }

                setIsSubmitting(true);
                
                try {
                    // Simulate API call
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    
                    // In a real app, you would make an actual API call here
                    // const response = await fetch('/api/login', {
                    //     method: 'POST',
                    //     headers: { 'Content-Type': 'application/json' },
                    //     body: JSON.stringify(formData)
                    // });
                    
                    setSubmitMessage({
                        type: 'success',
                        text: 'Login successful! Redirecting...'
                    });
                    
                    // Reset form after successful submission
                    setFormData({ email: '', password: '' });
                    
                } catch (error) {
                    setSubmitMessage({
                        type: 'error',
                        text: 'Login failed. Please check your credentials.'
                    });
                } finally {
                    setIsSubmitting(false);
                }
            };

            return (
                <div className="w-full max-w-md mx-auto p-6">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
                            <p className="text-gray-600 mt-2">Sign in to your account</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                        errors.email ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter your email"
                                    disabled={isSubmitting}
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                                        Forgot password?
                                    </a>
                                </div>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                        errors.password ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter your password"
                                    disabled={isSubmitting}
                                />
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                )}
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                                    Remember me
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                                    isSubmitting
                                        ? 'bg-blue-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing in...
                                    </span>
                                ) : (
                                    'Sign In'
                                )}
                            </button>

                            {submitMessage && (
                                <div className={`p-4 rounded-lg ${
                                    submitMessage.type === 'success' 
                                        ? 'bg-green-50 text-green-800 border border-green-200'
                                        : 'bg-red-50 text-red-800 border border-red-200'
                                }`}>
                                    {submitMessage.text}
                                </div>
                            )}
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-gray-600">
                                Don't have an account?{' '}
                                <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                                    Sign up
                                </a>
                            </p>
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <div className="text-center">
                                <p className="text-gray-600 mb-4">Or continue with</p>
                                <div className="flex justify-center space-x-4">
                                    <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                        <span className="text-gray-700 font-medium">Google</span>
                                    </button>
                                    <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                        <span className="text-gray-700 font-medium">GitHub</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        };

        const App = () => <LoginPage />;

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
    </script>
</body>
</html>
<!-- update 1774955526.23502 -->