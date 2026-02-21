import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { DollarSign, AlertCircle, Landmark, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [accounts, setAccounts] = useState([]);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.role === 'admin') {
            navigate('/admin');
            return;
        }
        const fetchData = async () => {
            try {
                // Only fetch accounts first, then fetch their transactions
                const accRes = await api.get('/accounts');

                // Note: The admin endpoint is used here for simplicity if the user is authorized for their own IDs, 
                // but typically we'd have a user-specific recent transactions endpoint.
                // Let's try to fetch transactions for each account and merge them if a global one isn't ready.

                setAccounts(accRes.data);

                // Fetch transactions for all user accounts and flatten
                const allTransactions = await Promise.all(
                    accRes.data.map(acc => api.get(`/accounts/${acc._id}/transactions`))
                );
                const flattened = allTransactions.flatMap(res => res.data)
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 5);

                setRecentTransactions(flattened);
            } catch (err) {
                setError('Failed to fetch dashboard data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return (
        <div className="flex h-64 items-center justify-center space-x-2">
            <div className="w-8 h-8 rounded-full border-4 border-brand-light border-t-brand-accent animate-spin"></div>
            <span className="text-gray-500 font-medium">Loading Overview...</span>
        </div>
    );

    if (error) return (
        <div className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded mt-4 border border-red-200">
            <AlertCircle /> <span>{error}</span>
        </div>
    );

    const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0);

    return (
        <div className="space-y-8 pb-10">
            {/* Header section with total balance */}
            <div className="card bg-gradient-to-r from-brand-blue to-blue-800 text-white shadow-xl flex justify-between items-center px-8 py-10 relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 opacity-10">
                    <Landmark size={200} />
                </div>
                <div className="z-10">
                    <h1 className="text-4xl font-extrabold tracking-tight mb-2">Accounts Overview</h1>
                    <p className="text-blue-100 flex items-center gap-2">
                        <ShieldCheck size={18} /> Securely synced with LaxmiBank Elite records.
                    </p>
                </div>
                <div className="text-right z-10 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
                    <p className="text-sm uppercase tracking-wider font-semibold text-blue-200 mb-1">Total Available Balance</p>
                    <h2 className="text-5xl font-bold flex items-center justify-end">
                        <DollarSign size={40} className="mr-1 text-blue-300" />
                        {totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h2>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Accounts List */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">Your Accounts</h3>
                    {accounts.length === 0 ? (
                        <div className="card text-center py-16 bg-gray-50 border-dashed border-2">
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">No accounts found</h3>
                            <Link to="/open-account" className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-3 mt-4">
                                <Landmark size={20} /> Open New Account
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {accounts.map((acc) => (
                                <div key={acc._id} className="card hover:shadow-lg transition-all group relative overflow-hidden border border-gray-100">
                                    <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-lg text-[10px] font-black uppercase text-white shadow-sm ${acc.type === 'Current' ? 'bg-orange-500' : 'bg-green-600'}`}>
                                        {acc.type}
                                    </div>
                                    <div className="flex flex-col h-full mt-2">
                                        <div className="flex items-center gap-3 mb-4 text-brand-blue">
                                            <div className="p-3 bg-brand-light rounded-full text-brand-accent">
                                                <Landmark size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-black">{acc.type} Account</h3>
                                                <p className="text-xs font-mono tracking-wider text-gray-400 font-bold">●●●● {acc.accountNumber.slice(-4)}</p>
                                            </div>
                                        </div>

                                        <div className="flex-1 my-4">
                                            <p className="text-xs text-gray-400 font-black uppercase tracking-widest">Available Balance</p>
                                            <p className="text-3xl font-black text-gray-900 mt-1">
                                                <span className="text-gray-400 text-xl mr-1 font-bold">$</span>
                                                {acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                                            <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-tight rounded-full border ${acc.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                                {acc.status}
                                            </span>
                                            <Link to={`/accounts/${acc._id}`} className="text-sm text-brand-accent font-black hover:text-blue-700 transition-colors uppercase tracking-widest">
                                                Manage →
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Activities */}
                <div className="space-y-6">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">Recent Activities</h3>
                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden">
                        <div className="divide-y divide-gray-50">
                            {recentTransactions.length === 0 ? (
                                <div className="p-10 text-center text-gray-400 text-sm italic font-medium">No recent activity detected.</div>
                            ) : (
                                recentTransactions.map((tx, i) => (
                                    <div key={i} className="p-5 hover:bg-gray-50/50 transition-colors flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-xl ${tx.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                <Landmark size={16} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900 truncate max-w-[120px]">{tx.description}</p>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{new Date(tx.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <p className={`text-sm font-black ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                            {tx.type === 'credit' ? '+' : '-'}${tx.amount.toLocaleString()}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="p-4 bg-gray-50 border-t border-gray-100">
                            <button onClick={() => navigate('/transaction-history')} className="w-full py-3 text-xs font-black uppercase tracking-widest text-brand-blue hover:text-brand-accent transition-colors">
                                View Performance Audit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
