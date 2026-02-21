import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, Mail, Lock } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL;
            const response = await axios.post(`${API_URL}/auth/login`, { username, password });

            if (response.data.role === 'admin') {
                setError('Please use the Admin Portal for administrative login.');
                return;
            }

            login(response.data);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-100px)]">
            <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-gray-100 p-8 transform transition hover:-translate-y-1 hover:shadow-2xl duration-500">
                <div className="text-center mb-8">
                    <div className="inline-flex justify-center items-center h-16 w-16 rounded-full bg-brand-light text-brand-accent mb-4">
                        <ShieldCheck size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
                    <p className="text-gray-500 mt-2 text-sm">Securely log into your LaxmiBank Elite account</p>
                </div>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded-md border border-red-200 text-sm mb-6 flex items-center gap-2">
                    <span className="font-semibold bg-red-100 text-red-700 px-2 py-1 rounded">Error</span> {error}
                </div>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="username">
                            Username
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <Mail size={18} />
                            </div>
                            <input
                                className="input-field pl-10"
                                id="username"
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <Lock size={18} />
                            </div>
                            <input
                                className="input-field pl-10"
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <button
                        className={`w-full py-3 rounded-md font-bold text-white shadow-md transition-all duration-300 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-blue hover:bg-brand-accent hover:shadow-lg'}`}
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Authenticating...' : 'Secure Login'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm border-t border-gray-100 pt-6">
                    <span className="text-gray-600">Don't have an account? </span>
                    <Link to="/register" className="text-brand-accent font-bold hover:underline">
                        Open An Account Now
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
