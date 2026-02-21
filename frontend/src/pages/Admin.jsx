import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Users, CreditCard, Banknote, ShieldAlert, CheckCircle, Ban, TrendingUp, Trash2, History, Search, RefreshCw, AlertTriangle, ExternalLink } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const Admin = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalAccounts: 0,
        pendingLoans: 0,
        totalAssets: 0
    });
    const [loans, setLoans] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [profileRequests, setProfileRequests] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    if (user?.role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    const fetchData = async () => {
        setLoading(true);
        try {
            // Using separate try-catch or individual resolution to avoid one failure blocking all
            const results = await Promise.allSettled([
                api.get('/admin/dashboard'),
                api.get('/admin/loans/pending'),
                api.get('/admin/accounts'),
                api.get('/admin/users'),
                api.get('/admin/transactions'),
                api.get('/admin/profile-requests')
            ]);

            if (results[0].status === 'fulfilled') setStats(results[0].value.data);
            if (results[1].status === 'fulfilled') setLoans(results[1].value.data);
            if (results[2].status === 'fulfilled') setAccounts(results[2].value.data);
            if (results[3].status === 'fulfilled') setUsersList(results[3].value.data);
            if (results[4].status === 'fulfilled') setTransactions(results[4].value.data);
            if (results[5].status === 'fulfilled') setProfileRequests(results[5].value.data);

            // Log any failures
            results.forEach((res, i) => {
                if (res.status === 'rejected') {
                    // console.error(`Admin request ${i} failed:`, res.reason); // Removed per user request
                }
            });
        } catch (error) {
            // console.error("Admin fetch error", error); // Removed per user request
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleLoanAction = async (id, status) => {
        if (!window.confirm(`Are you sure you want to ${status} this loan?`)) return;
        try {
            await api.put(`/admin/loans/${id}`, { status });
            setLoans(loans.filter(l => l._id !== id));
            fetchData(); // Refresh stats
        } catch (error) {
            alert("Action failed.");
        }
    };

    const handleAccountStatus = async (id, status) => {
        try {
            const res = await api.put(`/admin/accounts/${id}/status`, { status });
            setAccounts(accounts.map(acc => acc._id === id ? res.data : acc));
            fetchData();
        } catch (error) {
            alert("Update failed.");
        }
    }

    const handleProfileRequest = async (id, status) => {
        const comment = status === 'Rejected' ? window.prompt("Reason for rejection:") : "Approved by system administrator.";
        if (status === 'Rejected' && comment === null) return;

        try {
            await api.put(`/admin/profile-requests/${id}`, { status, adminComment: comment });
            setProfileRequests(profileRequests.map(r => r._id === id ? { ...r, status } : r));
            fetchData();
            alert(`Request ${status.toLowerCase()} successfully.`);
        } catch (error) {
            alert("Action failed.");
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm("CRITICAL: This will permanently delete the user and all their bank accounts. Proceed?")) return;
        try {
            await api.delete(`/admin/users/${id}`);
            setUsersList(usersList.filter(u => u._id !== id));
            fetchData();
            alert("User deleted successfully.");
        } catch (error) {
            alert(error.response?.data?.message || "Deletion failed.");
        }
    };

    if (loading && !stats.totalUsers && usersList.length === 0) return (
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
            <RefreshCw className="animate-spin text-orange-500" size={48} />
            <p className="text-gray-500 font-black tracking-widest uppercase text-sm">Synchronizing Master Records...</p>
        </div>
    );

    const filteredUsers = usersList.filter(u =>
        u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(val || 0);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
            {/* Admin Banner */}
            <div className="bg-gray-900 text-white p-8 rounded-[2rem] shadow-2xl border border-gray-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <ShieldAlert size={300} />
                </div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-orange-500 rounded-2xl shadow-[0_0_30px_rgba(249,115,22,0.3)]">
                            <ShieldAlert size={40} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">Administrative Core</h1>
                            <p className="text-orange-400 font-mono text-xs mt-2 uppercase tracking-[0.3em]">LaxmiBank Elite Control Panel</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-red-500/10 text-red-100 px-6 py-2 rounded-full border border-red-500/50 text-sm font-bold flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-red-400 animate-ping"></div> Live Ops Agent: {user.username}
                        </div>
                        <button onClick={fetchData} className="p-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors border border-gray-700">
                            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'blue' },
                    { label: 'Active Accounts', value: stats.totalAccounts, icon: CreditCard, color: 'green' },
                    { label: 'Pending Loans', value: stats.pendingLoans, icon: Banknote, color: 'orange' },
                    { label: 'Total Assets', value: formatCurrency(stats.totalAssets), icon: TrendingUp, color: 'purple' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl bg-gray-50 text-gray-700 group-hover:scale-110 transition-transform`}>
                                <stat.icon size={24} />
                            </div>
                            <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Real-time</span>
                        </div>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                        <h3 className="text-3xl font-black text-gray-900">{stat.value}</h3>
                    </div>
                ))}
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden min-h-[600px]">
                <div className="flex flex-wrap border-b border-gray-100 bg-gray-50/50 p-2 gap-2">
                    {[
                        { id: 'overview', label: 'Loan Requests', count: loans.length, icon: Banknote },
                        { id: 'accounts', label: 'Accounts', count: accounts.length, icon: CreditCard },
                        { id: 'users', label: 'Users', count: usersList.length, icon: Users },
                        { id: 'profileRequests', label: 'Profile Edits', count: profileRequests.filter(r => r.status === 'Pending').length, icon: RefreshCw },
                        { id: 'transactions', label: 'Transaction Audit', icon: History }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 text-sm font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === tab.id
                                ? 'bg-gray-900 text-white shadow-lg'
                                : 'text-gray-500 hover:bg-gray-200/50 hover:text-gray-800'
                                }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                            {tab.count !== undefined && (
                                <span className={`ml-2 px-2 py-0.5 rounded-md text-[10px] ${activeTab === tab.id ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                <div className="p-8">
                    {/* Search Bar for appropriate tabs */}
                    {(activeTab === 'users' || activeTab === 'accounts') && (
                        <div className="relative mb-8">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by name, email or account number..."
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-orange-500/50 transition-all font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    )}

                    {activeTab === 'overview' && (
                        <div className="space-y-4">
                            {loans.length === 0 ? (
                                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                                    <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
                                    <p className="text-gray-500 font-bold">All loan applications processed.</p>
                                </div>
                            ) : (
                                loans.map(loan => (
                                    <div key={loan._id} className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-white border border-gray-100 rounded-2xl hover:border-orange-200 transition-all hover:bg-orange-50/30">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-black">
                                                    {loan.userId?.fullName?.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-gray-900">{loan.userId?.fullName}</h4>
                                                    <p className="text-xs text-gray-500 font-mono">{loan.userId?.email}</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 pt-2">
                                                <div>
                                                    <p className="text-[10px] font-black uppercase text-gray-400">Request Amount</p>
                                                    <p className="text-lg font-black text-brand-blue">{formatCurrency(loan.amount)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase text-gray-400">Reported Income</p>
                                                    <p className="text-lg font-black text-gray-800">{formatCurrency(loan.income)}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 mt-6 md:mt-0">
                                            <button onClick={() => handleLoanAction(loan._id, 'Approved')} className="flex-1 md:flex-none px-6 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20 flex items-center justify-center gap-2">
                                                <CheckCircle size={18} /> Approve
                                            </button>
                                            <button onClick={() => handleLoanAction(loan._id, 'Rejected')} className="flex-1 md:flex-none px-6 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20 flex items-center justify-center gap-2">
                                                <Ban size={18} /> Reject
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'accounts' && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100">
                                        <th className="px-4 py-4">Account Holder</th>
                                        <th className="px-4 py-4">Status</th>
                                        <th className="px-4 py-4">Type</th>
                                        <th className="px-4 py-4 text-right">Balance</th>
                                        <th className="px-4 py-4 text-center">Security</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {accounts.filter(a => a.userId?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())).map(acc => (
                                        <tr key={acc._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-5">
                                                <div className="font-bold text-gray-900">{acc.userId?.fullName || 'N/A'}</div>
                                                <div className="text-[10px] font-mono text-gray-500">#{acc.accountNumber}</div>
                                            </td>
                                            <td className="px-4 py-5">
                                                <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-tight rounded-full ${acc.status === 'Active' ? 'bg-green-100 text-green-700' :
                                                    acc.status === 'Frozen' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {acc.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-5 font-bold text-gray-600 text-sm">{acc.type}</td>
                                            <td className="px-4 py-5 text-right font-black text-gray-900">{formatCurrency(acc.balance)}</td>
                                            <td className="px-4 py-5">
                                                <div className="flex justify-center">
                                                    {acc.status === 'Frozen' ? (
                                                        <button onClick={() => handleAccountStatus(acc._id, 'Active')} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-green-200" title="Unfreeze Account">
                                                            <CheckCircle size={18} />
                                                        </button>
                                                    ) : (
                                                        <button onClick={() => handleAccountStatus(acc._id, 'Frozen')} className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors border border-orange-200" title="Freeze Account">
                                                            <AlertTriangle size={18} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredUsers.map(u => (
                                <div key={u._id} className="p-6 bg-white border border-gray-100 rounded-3xl hover:border-red-100 transition-all hover:shadow-xl group">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-14 w-14 bg-gradient-to-br from-gray-800 to-black text-white rounded-2xl flex items-center justify-center text-xl font-black">
                                                {u.fullName?.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-gray-900 text-lg">{u.fullName}</h4>
                                                <p className="text-xs text-orange-500 font-bold uppercase tracking-widest">{u.username}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => handleDeleteUser(u._id)} className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100">
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                    <div className="space-y-3 bg-gray-50 p-4 rounded-2xl">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-400 font-bold uppercase">System ID</span>
                                            <span className="text-gray-900 font-mono tracking-tighter">{u._id}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-400 font-bold uppercase">Email Vector</span>
                                            <span className="text-gray-900 font-bold">{u.email}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-400 font-bold uppercase">Joined Base</span>
                                            <span className="text-gray-900 font-bold">{new Date(u.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'profileRequests' && (
                        <div className="space-y-6">
                            {profileRequests.length === 0 ? (
                                <div className="text-center py-20 bg-gray-50 rounded-3xl">
                                    <p className="text-gray-500 font-bold">No profile update requests found.</p>
                                </div>
                            ) : (
                                profileRequests.map(req => (
                                    <div key={req._id} className={`p-6 bg-white border rounded-2xl transition-all ${req.status === 'Pending' ? 'border-orange-100 shadow-lg' : 'border-gray-100 opacity-60'}`}>
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">
                                                    <User size={24} />
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-gray-900">{req.userId?.fullName}</h4>
                                                    <p className="text-xs text-brand-blue font-bold uppercase tracking-widest">{req.userId?.username}</p>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${req.status === 'Pending' ? 'bg-orange-100 text-orange-600' :
                                                req.status === 'Approved' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                                }`}>
                                                {req.status}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                <p className="text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Current Profile</p>
                                                <ul className="text-xs space-y-1 font-medium text-gray-500">
                                                    <li>Name: {req.oldValue.fullName}</li>
                                                    <li>Email: {req.oldValue.email}</li>
                                                    <li>Phone: {req.oldValue.phone}</li>
                                                    <li className="truncate">Addr: {req.oldValue.address}</li>
                                                </ul>
                                            </div>
                                            <div className="p-4 bg-brand-light rounded-xl border border-brand-accent/20">
                                                <p className="text-[10px] font-black uppercase text-brand-accent mb-2 tracking-widest">Requested Update</p>
                                                <ul className="text-xs space-y-1 font-bold text-gray-900 font-mono">
                                                    <li className={req.oldValue.fullName !== req.newValue.fullName ? "text-orange-600" : ""}>Name: {req.newValue.fullName}</li>
                                                    <li className={req.oldValue.email !== req.newValue.email ? "text-orange-600" : ""}>Email: {req.newValue.email}</li>
                                                    <li className={req.oldValue.phone !== req.newValue.phone ? "text-orange-600" : ""}>Phone: {req.newValue.phone}</li>
                                                    <li className={req.oldValue.address !== req.newValue.address ? "text-orange-600" : ""}>Addr: {req.newValue.address}</li>
                                                </ul>
                                            </div>
                                        </div>

                                        {req.status === 'Pending' && (
                                            <div className="flex gap-3">
                                                <button onClick={() => handleProfileRequest(req._id, 'Approved')} className="flex-1 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20">
                                                    Approve Update
                                                </button>
                                                <button onClick={() => handleProfileRequest(req._id, 'Rejected')} className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20">
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                        {req.adminComment && (
                                            <p className="mt-4 text-xs font-medium text-gray-400 italic">
                                                Admin Note: "{req.adminComment}"
                                            </p>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'transactions' && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100">
                                        <th className="px-4 py-4">Timestamp</th>
                                        <th className="px-4 py-4">Entity/Holder</th>
                                        <th className="px-4 py-4">Manifest</th>
                                        <th className="px-4 py-4 text-right">Magnitude</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {transactions.map((tx, i) => (
                                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-5 text-xs text-gray-500 font-mono">
                                                {new Date(tx.createdAt).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-5">
                                                <div className="font-bold text-gray-800">{tx.accountId?.userId?.fullName || 'System'}</div>
                                                <div className="text-[10px] text-gray-400 uppercase tracking-tighter font-black">
                                                    Account: ...{tx.accountId?.accountNumber?.slice(-4)}
                                                </div>
                                            </td>
                                            <td className="px-4 py-5 text-sm font-medium text-gray-600 italic">
                                                "{tx.description}"
                                            </td>
                                            <td className={`px-4 py-5 text-right font-black ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                                {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {transactions.length === 0 && (
                                <div className="text-center py-20 bg-gray-50 rounded-3xl">
                                    <p className="text-gray-500 font-bold">No transactions found in archive.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Admin;
