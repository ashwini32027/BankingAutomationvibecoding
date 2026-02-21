import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Download, Calendar, Search, CreditCard, Landmark, History, X, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';

const AccountDetails = () => {
    const { id } = useParams();
    const [account, setAccount] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const [accRes, transRes] = await Promise.all([
                    api.get(`/accounts/${id}`),
                    api.get(`/accounts/${id}/transactions`)
                ]);
                setAccount(accRes.data);
                setTransactions(transRes.data);
            } catch (err) {
                console.error("AccountDetails Error:", err, err.response?.data);
                setError('Failed to fetch account details.');
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(val || 0);
    };

    if (loading) return (
        <div className="flex h-64 items-center justify-center space-x-2">
            <div className="w-8 h-8 rounded-full border-4 border-brand-light border-t-brand-accent animate-spin"></div>
            <span className="text-gray-500 font-medium">Loading Account Details...</span>
        </div>
    );

    if (error) return (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200">
            {error}
        </div>
    );

    if (!account) return <div>Account not found.</div>;

    const filteredTransactions = transactions.filter(tx => {
        const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tx.type.toLowerCase().includes(searchTerm.toLowerCase());

        const txDate = new Date(tx.createdAt);
        const matchesStart = startDate ? txDate >= new Date(startDate) : true;
        const matchesEnd = endDate ? txDate <= new Date(endDate) : true;

        return matchesSearch && matchesStart && matchesEnd;
    });

    const handleDownloadCSV = () => {
        if (!transactions.length) return alert("No transactions to export.");

        const headers = ["Date", "Description", "Type", "Amount", "Balance After"];
        const rows = transactions.map(tx => [
            new Date(tx.createdAt).toLocaleString(),
            tx.description.replace(/,/g, ""), // Remove commas to avoid CSV break
            tx.type,
            tx.amount,
            "N/A" // Balance after is complex without cumulative sum logic here
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Statement_${account.accountNumber}_${new Date().toLocaleDateString()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Breadcrumbs & Back Link */}
            <div className="flex items-center gap-4 text-sm">
                <Link to="/dashboard" className="text-gray-500 hover:text-brand-accent flex items-center gap-1 transition-colors">
                    <ArrowLeft size={16} /> Dashboard
                </Link>
                <ChevronRight size={14} className="text-gray-300" />
                <span className="text-gray-800 font-bold">Account Details</span>
            </div>

            {/* Header / Account Card */}
            <div className="card bg-gray-900 text-white p-8 rounded-[2rem] shadow-2xl relative overflow-hidden border border-gray-800">
                <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
                    <Landmark size={250} />
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                    <div className="flex items-center gap-6">
                        <div className={`p-4 rounded-3xl ${account.type === 'Checking' ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'} border border-white/5 shadow-inner`}>
                            <Landmark size={40} />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-4xl font-black">{account.type} Account</h1>
                                <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${account.status === 'Active' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                                    {account.status}
                                </span>
                            </div>
                            <p className="text-gray-400 font-mono text-lg mt-1 tracking-[0.2em]">
                                Account #: {account.accountNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl min-w-[250px] shadow-2xl">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Available Liquidity</p>
                        <h2 className="text-4xl font-black">
                            {formatCurrency(account.balance)}
                        </h2>
                    </div>
                </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-accent transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search descriptions, types..."
                            className="input-field pl-12 h-14 bg-white border-2 border-gray-100 rounded-2xl focus:border-brand-accent shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex bg-white p-2 border-2 border-gray-100 rounded-2xl shadow-sm gap-2">
                        <div className="flex items-center gap-2 px-3">
                            <Calendar size={18} className="text-brand-accent" />
                            <input
                                type="date"
                                className="bg-transparent text-sm font-bold text-gray-600 outline-none"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div className="w-px h-full bg-gray-200"></div>
                        <div className="flex items-center gap-2 px-3">
                            <input
                                type="date"
                                className="bg-transparent text-sm font-bold text-gray-600 outline-none"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                        {(startDate || endDate || searchTerm) && (
                            <button
                                onClick={() => { setStartDate(''); setEndDate(''); setSearchTerm(''); }}
                                className="px-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between text-xs mt-2">
                    <p className="text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                        <History size={14} /> Showing {filteredTransactions.length} of {transactions.length} Records
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleDownloadCSV}
                        className="btn-secondary flex items-center gap-2 py-3 px-6 rounded-2xl hover:scale-105 active:scale-95 transition-all"
                    >
                        <Download size={18} /> Download Statement
                    </button>
                </div>
            </div>

            {/* Transactions List */}
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-900 text-white rounded-xl">
                            <History size={20} />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Transaction Ledger</h3>
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse"></div> REAL-TIME RECORD
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100">
                                <th className="px-8 py-5">Timestamp</th>
                                <th className="px-8 py-5">Classification</th>
                                <th className="px-8 py-5">Manifest Description</th>
                                <th className="px-8 py-5 text-right">Magnitude</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-20 text-gray-500 font-bold italic">
                                        No transactions recorded in the ledger.
                                    </td>
                                </tr>
                            ) : (
                                filteredTransactions.map((tx) => (
                                    <tr key={tx._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="text-gray-900 font-bold text-sm">
                                                {new Date(tx.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                            <div className="text-[10px] text-gray-400 font-mono mt-1">
                                                {new Date(tx.createdAt).toLocaleTimeString()}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight ${tx.type === 'credit'
                                                ? 'bg-green-50 text-green-700 border border-green-100'
                                                : 'bg-red-50 text-red-700 border border-red-100'
                                                }`}>
                                                {tx.type === 'credit' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                                {tx.type}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-gray-600 font-medium text-sm group-hover:text-gray-900 transition-colors italic">
                                                "{tx.description}"
                                            </p>
                                        </td>
                                        <td className={`px-8 py-6 text-right font-black text-lg ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                            {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AccountDetails;
