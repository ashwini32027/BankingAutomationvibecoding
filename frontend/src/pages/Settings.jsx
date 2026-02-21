import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { UserCircle, Mail, Phone, MapPin, ShieldCheck, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
    const { user, login } = useAuth(); // We need login to update the local context if name changes
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        password: '',
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.get('/users/profile');
                setFormData({
                    fullName: data.fullName || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    address: data.address || '',
                    password: '', // Don't populate password
                });
            } catch (err) {
                setError('Failed to load profile data.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setSaving(true);

        try {
            // Password updates are still direct for security reasons if the user knows their current session
            if (formData.password) {
                await api.put('/users/profile', { password: formData.password });
                setMessage('Password updated successfully.');
                setFormData(prev => ({ ...prev, password: '' }));
                setSaving(false);
                return;
            }

            // Sensitive fields go through the Request System (Requirement PROF_001)
            const updateBody = {
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                address: formData.address
            };

            await api.post('/users/profile/profile-request', updateBody);

            setMessage('Update request submitted! Sensitive details (Name, Email, etc.) require Admin Approval before reflecting on your account.');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit update request.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500 font-bold animate-pulse">Loading Profile...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="card shadow-xl p-0 border-0 overflow-hidden bg-white">

                {/* Header */}
                <div className="bg-brand-blue text-white p-8 relative overflow-hidden">
                    <div className="absolute right-0 top-0 opacity-10 blur-xl pointer-events-none transform translate-x-12 -translate-y-12">
                        <UserCircle size={200} />
                    </div>
                    <div className="relative z-10 flex items-center gap-4">
                        <div className="h-20 w-20 rounded-full bg-brand-accent/20 border-2 border-brand-accent flex items-center justify-center shadow-lg">
                            <UserCircle size={48} className="text-brand-light" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-extrabold tracking-tight">{user.fullName || user.username}</h2>
                            <p className="text-blue-200 mt-1 font-medium flex items-center gap-2">
                                <ShieldCheck size={16} /> Verified Elite Account
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="flex items-center gap-2 bg-red-50 text-red-600 p-4 rounded-md mb-6 border-l-4 border-red-500 font-medium">
                            <AlertCircle size={20} /> <span className="flex-1">{error}</span>
                        </div>
                    )}

                    {message && (
                        <div className="flex items-center gap-2 bg-green-50 text-green-700 p-4 rounded-md mb-6 border-l-4 border-green-500 font-medium shadow-sm">
                            <CheckCircle size={20} className="text-green-500" /> <span className="flex-1">{message}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                            {/* Personal Info Col */}
                            <div className="space-y-6">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-brand-blue border-b border-gray-200 pb-2 flex items-center gap-2">
                                    Personal Information
                                </h3>

                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
                                    <input
                                        className="input-field bg-gray-50 border-gray-200 focus:bg-white"
                                        name="fullName" type="text"
                                        value={formData.fullName} onChange={handleChange} required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <Mail size={16} />
                                        </div>
                                        <input
                                            className="input-field pl-10 bg-gray-50 border-gray-200 focus:bg-white"
                                            name="email" type="email"
                                            value={formData.email} onChange={handleChange} required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <Phone size={16} />
                                        </div>
                                        <input
                                            className="input-field pl-10 bg-gray-50 border-gray-200 focus:bg-white"
                                            name="phone" type="tel"
                                            value={formData.phone} onChange={handleChange} required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Address & Security Col */}
                            <div className="space-y-6">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-brand-blue border-b border-gray-200 pb-2 flex items-center gap-2">
                                    Contact & Security
                                </h3>

                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Registered Address</label>
                                    <div className="relative">
                                        <div className="absolute top-3 left-0 pl-3 text-gray-400">
                                            <MapPin size={16} />
                                        </div>
                                        <textarea
                                            className="input-field pl-10 h-28 resize-none bg-gray-50 border-gray-200 focus:bg-white"
                                            name="address"
                                            value={formData.address} onChange={handleChange} required
                                        />
                                    </div>
                                </div>

                                <div className="bg-orange-50/50 p-4 rounded-lg border border-orange-100">
                                    <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center gap-2">
                                        Update Password
                                        <span className="text-xs font-normal text-gray-500">(Leave blank to keep current)</span>
                                    </label>
                                    <input
                                        className="input-field bg-white border-orange-200 focus:ring-orange-200 focus:border-orange-400"
                                        name="password" type="password"
                                        placeholder="New password (min 8 chars)"
                                        value={formData.password} onChange={handleChange} minLength={8}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100 flex justify-end">
                            <button
                                className={`py-3 px-8 rounded-lg font-bold text-white shadow-md transition-all duration-300 flex items-center gap-2 ${saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-blue hover:bg-brand-accent hover:-translate-y-0.5'}`}
                                type="submit" disabled={saving}
                            >
                                {saving ? 'Saving Changes...' : 'Save Profile Settings'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Settings;
