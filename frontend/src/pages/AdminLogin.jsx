import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShieldAlert, User, Lock, ArrowRight } from 'lucide-react';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login, user } = useAuth();
    const navigate = useNavigate();

    // If already an admin, go to admin panel
    useEffect(() => {
        if (user && user.role === 'admin') {
            navigate('/admin');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL;
            const response = await axios.post(`${API_URL}/auth/login`, { username, password });

            if (response.data.role !== 'admin') {
                setError('Access Denied: Specialized Admin Credentials Required.');
                return;
            }

            login(response.data);
            navigate('/admin');
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication Failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-100px)] bg-gray-50">
            <div className="w-full max-w-md">
                <div className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-800 transform transition-all duration-500">
                    <div className="p-8 pb-4 text-center border-b border-gray-800 bg-gradient-to-b from-gray-800 to-gray-900">
                        <div className="inline-flex justify-center items-center h-20 w-20 rounded-2xl bg-orange-500/10 text-orange-500 mb-4 border border-orange-500/20 shadow-[0_0_20px_rgba(249,115,22,0.1)]">
                            <ShieldAlert size={40} />
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-widest uppercase">Admin Portal</h2>
                        <p className="text-gray-400 mt-2 text-sm font-medium">LaxmiBank Elite Security Access</p>
                    </div>

                    <div className="p-10 space-y-6">
                        {error && (
                            <div className="bg-red-500/10 text-red-400 p-4 rounded-xl border border-red-500/20 text-sm flex items-center gap-3 animate-pulse">
                                <ShieldAlert size={18} />
                                <span className="font-semibold">{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-1">
                                <label className="block text-gray-400 text-xs font-black uppercase tracking-widest ml-1" htmlFor="username">
                                    Administrative ID
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                                        <User size={18} />
                                    </div>
                                    <input
                                        className="w-full bg-gray-800 border-2 border-gray-700 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-mono"
                                        id="username"
                                        type="text"
                                        placeholder="Enter Admin ID"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="block text-gray-400 text-xs font-black uppercase tracking-widest ml-1" htmlFor="password">
                                    Encyrpted Key
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        className="w-full bg-gray-800 border-2 border-gray-700 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-mono"
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
                                className={`group relative w-full py-4 rounded-xl font-bold uppercase tracking-widest text-white shadow-xl transition-all duration-300 overflow-hidden ${isLoading ? 'bg-gray-700 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-500 active:scale-95'
                                    }`}
                                type="submit"
                                disabled={isLoading}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                <span className="relative flex items-center justify-center gap-2">
                                    {isLoading ? 'Verifying Integrity...' : (
                                        <>
                                            Initialize Access <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </span>
                            </button>
                        </form>
                    </div>

                    <div className="p-6 bg-black/40 text-center border-t border-gray-800">
                        <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em]">
                            Restricted Access • Connection Encrypted 256-bit
                        </p>
                    </div>
                </div>

                <p className="text-center mt-6 text-gray-400 text-sm">
                    Forgotten your secure key? Contact system root.
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
