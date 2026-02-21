import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserPlus, ShieldPlus } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        email: '',
        phone: '',
        address: '',
        dateOfBirth: '',
        govtId: '',
        password: '',
        confirmPassword: '',
    });

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }

        setError('');
        setIsLoading(true);

        try {
            const API_URL = import.meta.env.VITE_API_URL;
            const { data } = await axios.post(`${API_URL}/auth/register`, formData);
            login(data);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center py-12">
            <div className="card w-full max-w-2xl bg-white shadow-xl relative overflow-hidden">
                {/* Decorative Header */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-blue via-brand-accent to-blue-400"></div>

                <div className="flex items-center gap-4 mb-8 pb-4 border-b border-gray-100">
                    <div className="p-3 bg-brand-light text-brand-accent rounded-full">
                        <ShieldPlus size={28} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-extrabold text-brand-blue tracking-tight">Open New Account</h2>
                        <p className="text-sm text-gray-500 mt-1">Join LaxmiBank Elite for world-class banking services.</p>
                    </div>
                </div>

                {error && <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 border-l-4 border-red-500 font-medium">
                    Error: {error}
                </div>}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="fullName">Full Name</label>
                        <input
                            className="input-field"
                            id="fullName" name="fullName" type="text"
                            placeholder="e.g. Ashwini Kumar"
                            value={formData.fullName} onChange={handleChange} required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="username">Username</label>
                        <input
                            className="input-field"
                            id="username" name="username" type="text"
                            placeholder="A unique username"
                            value={formData.username} onChange={handleChange} required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">Email Address</label>
                        <input
                            className="input-field"
                            id="email" name="email" type="email"
                            placeholder="you@example.com"
                            value={formData.email} onChange={handleChange} required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="phone">Phone Number</label>
                        <input
                            className="input-field"
                            id="phone" name="phone" type="tel"
                            placeholder="+1 (555) 000-0000"
                            value={formData.phone} onChange={handleChange} required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="dateOfBirth">Date of Birth</label>
                        <input
                            className="input-field"
                            id="dateOfBirth" name="dateOfBirth" type="date"
                            value={formData.dateOfBirth} onChange={handleChange} required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="govtId">Govt ID (PAN / Aadhaar)</label>
                        <input
                            className="input-field"
                            id="govtId" name="govtId" type="text"
                            placeholder="ABCDE1234F"
                            value={formData.govtId} onChange={handleChange} required
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="address">Full Address</label>
                        <textarea
                            className="input-field resize-none h-20"
                            id="address" name="address"
                            placeholder="123 Financial District, Suite 100, City, Country"
                            value={formData.address} onChange={handleChange} required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">Password</label>
                        <input
                            className="input-field"
                            id="password" name="password" type="password"
                            placeholder="Min 8 characters"
                            value={formData.password} onChange={handleChange} required minLength="8"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            className="input-field"
                            id="confirmPassword" name="confirmPassword" type="password"
                            placeholder="Repeat password"
                            value={formData.confirmPassword} onChange={handleChange} required minLength="8"
                        />
                    </div>

                    <div className="md:col-span-2 mt-4 pt-6 border-t border-gray-100 flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            Already have an account? <Link to="/login" className="text-brand-accent font-bold hover:underline">Sign In</Link>
                        </div>
                        <button
                            className={`py-3 px-8 rounded-md font-bold text-white shadow-md transition-all duration-300 flex items-center gap-2 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-blue hover:bg-brand-accent hover:-translate-y-0.5'}`}
                            type="submit"
                            disabled={isLoading}
                        >
                            <UserPlus size={18} />
                            {isLoading ? 'Processing...' : 'Complete Registration'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
