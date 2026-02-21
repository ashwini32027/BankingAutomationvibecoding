import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { ArrowLeftRight, AlertCircle, CheckCircle, RefreshCcw } from 'lucide-react';

const TransferFunds = () => {
    const [accounts, setAccounts] = useState([]);
    const [fromAccountId, setFromAccountId] = useState('');
    const [toAccountNumber, setToAccountNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const { data } = await api.get('/accounts');
                setAccounts(data.filter(acc => acc.status === 'Active')); // Only active accounts can transfer
                if (data.length > 0) setFromAccountId(data[0]._id);
            } catch (err) {
                setError('Failed to fetch accounts. Please try reloading the page.');
            }
        };

        fetchAccounts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        if (parseFloat(amount) <= 0) {
            setError('Amount must be greater than zero.');
            setIsLoading(false);
            return;
        }

        try {
            const { data } = await api.post('/accounts/transfer', {
                fromAccountId,
                toAccountNumber,
                amount: parseFloat(amount),
                description
            });
            setSuccess(`Transfer successful! Reference ID: ${data.referenceId}`);
            // Clear form
            setToAccountNumber('');
            setAmount('');
            setDescription('');
        } catch (err) {
            setError(err.response?.data?.message || 'Transfer failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="card shadow-xl border border-gray-100 p-8 bg-white relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-light/40 rounded-full -mr-16 -mt-16 blur-2xl"></div>

                <div className="flex items-center gap-4 mb-8 pb-4 border-b border-gray-100 relative z-10">
                    <div className="p-3 bg-brand-blue text-white rounded-full shadow-md">
                        <ArrowLeftRight size={24} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-extrabold text-brand-blue tracking-tight">Transfer Funds</h2>
                        <p className="text-sm font-medium text-gray-400 mt-1 uppercase tracking-wider">Fast & Secure Atomicity Guarantee</p>
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-2 bg-red-50 text-red-600 p-4 rounded-md mb-6 border-l-4 border-red-500 font-medium">
                        <AlertCircle size={20} /> <span className="flex-1">{error}</span>
                    </div>
                )}
                {success && (
                    <div className="flex items-center gap-2 bg-green-50 text-green-700 p-4 rounded-md mb-6 border-l-4 border-green-500 font-medium shadow-sm">
                        <CheckCircle size={20} /> <span className="flex-1">{success}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 border-b border-gray-200 pb-2 mb-4 flex items-center gap-2">
                                <span className="text-brand-accent">1.</span> From Account
                            </h3>
                            <div>
                                <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="fromAccountId">Source Account</label>
                                <select
                                    className="input-field bg-white cursor-pointer py-3 border-gray-300 focus:ring-2 focus:ring-brand-accent focus:border-transparent font-medium text-gray-700 shadow-sm"
                                    id="fromAccountId"
                                    value={fromAccountId}
                                    onChange={(e) => setFromAccountId(e.target.value)}
                                    required
                                >
                                    {accounts.map(acc => (
                                        <option key={acc._id} value={acc._id}>
                                            {acc.type} - *{acc.accountNumber.slice(-4)} (${acc.balance.toFixed(2)})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-800 text-sm font-bold mb-2 uppercase" htmlFor="amount">Transfer Amount</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none font-bold text-gray-500 text-lg">
                                        $
                                    </div>
                                    <input
                                        className="input-field pl-8 font-mono text-xl py-4 border-gray-300 focus:ring-4 focus:ring-brand-accent/20 focus:border-brand-accent shadow-inner text-gray-800"
                                        id="amount" type="number" step="0.01" min="0.01" placeholder="0.00"
                                        value={amount} onChange={(e) => setAmount(e.target.value)} required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 bg-brand-light/30 p-6 rounded-xl border border-blue-100">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-brand-blue border-b border-blue-200 pb-2 mb-4 flex items-center gap-2">
                                <span className="text-brand-accent">2.</span> Destination
                            </h3>
                            <div>
                                <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="toAccountNumber">Recipient Account Number</label>
                                <input
                                    className="input-field bg-white py-3 border-blue-200 focus:ring-2 focus:ring-brand-accent font-mono tracking-wider shadow-sm"
                                    id="toAccountNumber" type="text" placeholder="10-digit number"
                                    value={toAccountNumber} onChange={(e) => setToAccountNumber(e.target.value)} required
                                />
                                <p className="text-xs text-gray-500 mt-2 font-medium">Transfers within LaxmiBank Elite clear instantly via DB session transactions.</p>
                            </div>

                            <div>
                                <label className="block text-gray-800 text-sm font-bold mb-2" htmlFor="description">Memo / Description</label>
                                <input
                                    className="input-field bg-white py-3 border-blue-200 focus:ring-2 focus:ring-brand-accent shadow-sm"
                                    id="description" type="text" placeholder="e.g. Rent Payment"
                                    value={description} onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex justify-end">
                        <button
                            className={`py-4 px-10 rounded-lg font-bold text-lg text-white shadow-xl transition-all duration-300 flex items-center gap-3 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-blue hover:bg-brand-accent hover:shadow-brand-accent/30 hover:-translate-y-1'}`}
                            type="submit"
                            disabled={isLoading || accounts.length === 0}
                        >
                            {isLoading ? <RefreshCcw className="animate-spin" size={24} /> : <ArrowLeftRight size={24} />}
                            {isLoading ? 'Processing Transfer...' : 'Transfer Funds Now'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransferFunds;
