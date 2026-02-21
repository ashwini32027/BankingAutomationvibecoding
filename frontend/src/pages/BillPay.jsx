import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { CreditCard, AlertCircle, CheckCircle, Store, Hash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BillPay = () => {
    const [accounts, setAccounts] = useState([]);
    const [fromAccountId, setFromAccountId] = useState('');
    const [payeeName, setPayeeName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [amount, setAmount] = useState('');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const { data } = await api.get('/accounts');
                const activeAccounts = data.filter(acc => acc.status === 'Active');
                setAccounts(activeAccounts);
                if (activeAccounts.length > 0) {
                    setFromAccountId(activeAccounts[0]._id);
                }
            } catch (err) {
                setError('Failed to fetch accounts.');
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
            setError('Payment amount must be greater than zero.');
            setIsLoading(false);
            return;
        }

        try {
            const { data } = await api.post('/bill-pay', {
                fromAccountId,
                payeeName,
                accountNumber,
                amount: parseFloat(amount)
            });

            setSuccess(`Payment of $${parseFloat(amount).toFixed(2)} to ${payeeName} scheduled successfully. (Ref: ${data.referenceId})`);

            // Clear form
            setPayeeName('');
            setAccountNumber('');
            setAmount('');

        } catch (err) {
            setError(err.response?.data?.message || 'Bill payment failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row gap-6">

                {/* Main Form Area */}
                <div className="flex-1 card shadow-xl p-0 border-0 bg-white overflow-hidden relative">
                    <div className="bg-brand-blue p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-accent/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
                        <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3 relative z-10">
                            <CreditCard className="text-brand-accent h-8 w-8" /> Pay Bills
                        </h2>
                        <p className="text-blue-200 mt-2 font-medium relative z-10">Fast, secure payments to thousands of registered billers.</p>
                    </div>

                    <div className="p-8">
                        {error && (
                            <div className="flex items-center gap-2 bg-red-50 text-red-600 p-4 rounded-md mb-6 border-l-4 border-red-500 font-medium">
                                <AlertCircle size={20} /> <span className="flex-1">{error}</span>
                            </div>
                        )}
                        {success && (
                            <div className="flex items-center gap-2 bg-green-50 text-green-700 p-4 rounded-md mb-6 border-l-4 border-green-500 font-medium shadow-sm">
                                <CheckCircle size={20} className="text-green-500" /> <span className="flex-1">{success}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-800 text-sm font-bold mb-2 uppercase tracking-wider text-xs">Pay From Account</label>
                                    <select
                                        className="input-field bg-gray-50 focus:bg-white border-gray-200 shadow-inner py-3 font-semibold text-gray-700 cursor-pointer text-lg"
                                        value={fromAccountId} onChange={(e) => setFromAccountId(e.target.value)} required
                                    >
                                        {accounts.map(acc => (
                                            <option key={acc._id} value={acc._id}>
                                                {acc.type} - *{acc.accountNumber.slice(-4)} (${acc.balance.toFixed(2)})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-gray-800 text-sm font-bold mb-2 flex items-center gap-2 tracking-wider text-xs uppercase">
                                            <Store size={14} className="text-gray-400" /> Payee Name
                                        </label>
                                        <input
                                            className="input-field bg-white py-3 border-gray-300 focus:ring-brand-accent/50 focus:border-brand-accent"
                                            type="text" placeholder="e.g. Electric Company"
                                            value={payeeName} onChange={(e) => setPayeeName(e.target.value)} required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-800 text-sm font-bold mb-2 flex items-center gap-2 tracking-wider text-xs uppercase">
                                            <Hash size={14} className="text-gray-400" /> Payee Account Number
                                        </label>
                                        <input
                                            className="input-field bg-white py-3 border-gray-300 font-mono tracking-wider focus:ring-brand-accent/50 focus:border-brand-accent"
                                            type="text" placeholder="Your account # with biller"
                                            value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-gray-800 text-sm font-bold mb-2 uppercase tracking-wider text-xs">Payment Amount</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none font-bold text-gray-500 text-xl">$</div>
                                            <input
                                                className="input-field pl-8 font-mono text-2xl py-6 border-gray-300 focus:ring-4 focus:ring-brand-accent/20 focus:border-brand-accent shadow-inner text-gray-900"
                                                type="number" step="0.01" min="0.01" placeholder="0.00"
                                                value={amount} onChange={(e) => setAmount(e.target.value)} required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100 flex justify-end">
                                <button
                                    className={`py-4 px-10 rounded-lg font-bold text-lg text-white shadow-xl transition-all duration-300 flex items-center gap-3 ${isLoading || accounts.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-blue hover:bg-brand-accent hover:-translate-y-1'}`}
                                    type="submit" disabled={isLoading || accounts.length === 0}
                                >
                                    <CreditCard size={20} />
                                    {isLoading ? 'Processing...' : 'Send Payment'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Info sidebar */}
                <div className="w-full md:w-64 space-y-4">
                    <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl shadow-sm">
                        <h4 className="font-bold text-brand-blue mb-2 text-sm uppercase tracking-wider">Bill Pay Guarantee</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">Payments are processed atomically. If your bill payment cannot be routed to the payee, your account balance will not be affected.</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 p-5 rounded-xl shadow-sm">
                        <h4 className="font-bold text-gray-700 mb-2 text-sm uppercase tracking-wider">Need to view history?</h4>
                        <p className="text-sm text-gray-500 mb-3">Check your accounts overview for past debits.</p>
                        <button onClick={() => navigate('/transactions')} className="text-sm font-bold text-brand-accent hover:underline w-full text-left">
                            Go to Transactions →
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default BillPay;
