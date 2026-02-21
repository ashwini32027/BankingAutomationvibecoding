import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, History, ArrowDownLeft, ArrowUpRight, Calendar, Info } from 'lucide-react';

const Transactions = () => {
    const [accounts, setAccounts] = useState([]);
    const [selectedAccountId, setSelectedAccountId] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const { data } = await api.get('/accounts');
                setAccounts(data);
                if (data.length > 0) {
                    setSelectedAccountId(data[0]._id);
                }
            } catch (err) {
                setError('Failed to fetch accounts.');
            }
        };
        fetchAccounts();
    }, []);

    useEffect(() => {
        const fetchTransactions = async () => {
            if (!selectedAccountId) return;
            setLoading(true);
            try {
                const { data } = await api.get(`/accounts/${selectedAccountId}/transactions`);
                setTransactions(data);
            } catch (err) {
                setError('Failed to fetch transactions.');
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [selectedAccountId]);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="card border-0 shadow-lg p-0 overflow-hidden rounded-xl">
                {/* Header */}
                <div className="bg-brand-blue text-white p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
                    <div className="absolute right-0 top-0 opacity-10 blur-xl pointer-events-none transform translate-x-12 -translate-y-12">
                        <History size={160} />
                    </div>
                    <div className="z-10">
                        <h2 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
                            <Search className="text-brand-accent h-8 w-8" /> Find Transactions
                        </h2>
                        <p className="text-blue-200 mt-2 font-medium max-w-sm">Review detailed historical data securely linked to your account activity.</p>
                    </div>

                    <div className="z-10 bg-white/10 p-4 rounded-lg backdrop-blur bg-opacity-30 border border-white/20 shadow-inner w-full md:w-auto">
                        <label className="block text-xs uppercase tracking-wider text-blue-100 font-bold mb-2">Select Account Filter</label>
                        <select
                            className="w-full md:w-64 input-field bg-white/20 text-white border-white/30 focus:ring-brand-accent focus:border-brand-accent py-2 cursor-pointer font-semibold shadow-sm option:text-gray-800"
                            value={selectedAccountId}
                            onChange={(e) => setSelectedAccountId(e.target.value)}
                            style={{ colorLine: 'black' }} // Hack for select text color in some browsers vs dropdown
                        >
                            {accounts.map(acc => (
                                <option key={acc._id} value={acc._id} className="text-gray-800">
                                    {acc.type} - *{acc.accountNumber.slice(-4)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-8 bg-gray-50/50 min-h-[400px]">
                    {error && (
                        <div className="text-red-500 bg-red-50 p-4 rounded-md font-bold text-center border border-red-200 shadow-sm flex items-center justify-center gap-2 mb-6">
                            <Info size={18} /> {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="flex h-64 items-center justify-center space-x-3 text-brand-blue">
                            <div className="w-8 h-8 rounded-full border-4 border-brand-light border-t-brand-accent animate-spin shadow-sm"></div>
                            <span className="font-semibold text-xl animate-pulse tracking-wide">Retrieving ledger...</span>
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-500 border-2 border-dashed border-gray-200 rounded-xl bg-white shadow-sm">
                            <History className="h-16 w-16 mb-4 text-brand-accent/50" />
                            <p className="text-xl font-bold tracking-tight text-gray-700">No transactions recorded</p>
                            <p className="text-sm mt-1">This account has no recent activity.</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="grid grid-cols-12 gap-4 p-4 bg-gray-100/80 border-b border-gray-200 text-xs font-black text-gray-500 uppercase tracking-widest">
                                <div className="col-span-3">Date</div>
                                <div className="col-span-5">Description</div>
                                <div className="col-span-2 text-right">Debit</div>
                                <div className="col-span-2 text-right">Credit</div>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {transactions.map((t) => (
                                    <div key={t._id} className="grid grid-cols-12 gap-4 p-4 hover:bg-brand-light/20 transition-colors items-center group">
                                        <div className="col-span-3 text-sm text-gray-600 font-medium flex items-center gap-2">
                                            <div className="bg-gray-100 p-1.5 rounded-md group-hover:bg-white transition-colors shadow-sm">
                                                <Calendar size={14} className="text-brand-accent" />
                                            </div>
                                            {new Date(t.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                        <div className="col-span-5 text-sm font-semibold text-brand-blue flex items-center gap-2">
                                            {t.type === 'credit' ? <ArrowDownLeft size={16} className="text-green-500" /> : <ArrowUpRight size={16} className="text-gray-400" />}
                                            {t.description}
                                        </div>
                                        <div className="col-span-2 text-right font-mono text-sm tracking-wide">
                                            {t.type === 'debit' ? (
                                                <span className="text-gray-800 font-medium">
                                                    ${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </span>
                                            ) : '-'}
                                        </div>
                                        <div className="col-span-2 text-right font-mono text-sm tracking-wide">
                                            {t.type === 'credit' ? (
                                                <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded shadow-sm border border-green-100">
                                                    ${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </span>
                                            ) : '-'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Transactions;
