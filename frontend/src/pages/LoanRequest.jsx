import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { HandCoins, AlertCircle, CheckCircle, Calculator, Info } from 'lucide-react';

const LoanRequest = () => {
    const [amount, setAmount] = useState('');
    const [income, setIncome] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const loanAmount = parseFloat(amount);
        const userIncome = parseFloat(income);

        if (loanAmount <= 0 || userIncome <= 0) {
            setError('Amount and income must be valid positive numbers.');
            return;
        }

        // Basic frontend sanity check: Bank doesn't loan more than 5x income usually
        if (loanAmount > userIncome * 5) {
            setError('Requested loan amount exceeds standard debt-to-income limits. Application blocked.');
            return;
        }

        setIsLoading(true);

        try {
            await api.post('/loans', {
                amount: loanAmount,
                income: userIncome
            });
            setSuccess('Loan application submitted successfully. Pending administrator review.');
            setTimeout(() => navigate('/dashboard'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit loan request');
        } finally {
            setIsLoading(false);
        }
    };

    // Auto-calculate rough monthly payment at 6% interest 5 year term
    const monthlyPayment = amount ? ((parseFloat(amount) * 1.3) / 60).toFixed(2) : '0.00';

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="card shadow-xl p-8 border-t-4 border-brand-accent bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full -mr-16 -mt-16 blur-2xl"></div>

                <div className="flex items-center gap-4 mb-8 pb-4 border-b border-gray-100 relative z-10">
                    <div className="p-3 bg-brand-light text-brand-accent rounded-full shadow-sm">
                        <HandCoins size={28} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-extrabold text-brand-blue tracking-tight">Apply for a Loan</h2>
                        <p className="text-gray-500 text-sm font-medium mt-1">Get approved in minutes with LaxmiBank Elite decisions.</p>
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-2 bg-red-50 text-red-600 p-4 rounded-md mb-6 border-l-4 border-red-500 font-medium z-10 relative">
                        <AlertCircle size={20} /> <span className="flex-1">{error}</span>
                    </div>
                )}

                {success && (
                    <div className="flex items-center gap-2 bg-green-50 text-green-700 p-4 rounded-md mb-6 border-l-4 border-green-500 font-medium shadow-sm z-10 relative">
                        <CheckCircle size={20} className="text-green-500" /> <span className="flex-1">{success}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                    <form onSubmit={handleSubmit} className="md:col-span-2 space-y-6">
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <label className="block text-gray-800 text-sm font-bold mb-2 uppercase" htmlFor="amount">Loan Amount Required</label>
                            <div className="relative mb-6">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none font-bold text-gray-500 text-lg">$</div>
                                <input
                                    className="input-field pl-8 font-mono text-xl py-3 border-gray-300 focus:ring-4 focus:ring-brand-accent/20 focus:border-brand-accent shadow-inner text-gray-800"
                                    id="amount" type="number" step="100" min="100" placeholder="10,000"
                                    value={amount} onChange={(e) => setAmount(e.target.value)} required
                                />
                            </div>

                            <label className="block text-gray-800 text-sm font-bold mb-2 uppercase" htmlFor="income">Annual Verified Income</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none font-bold text-gray-500 text-lg">$</div>
                                <input
                                    className="input-field pl-8 font-mono text-xl py-3 border-gray-300 focus:ring-4 focus:ring-brand-accent/20 focus:border-brand-accent shadow-inner text-gray-800"
                                    id="income" type="number" step="1000" min="1000" placeholder="75,000"
                                    value={income} onChange={(e) => setIncome(e.target.value)} required
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                className={`py-4 px-10 rounded-lg font-bold text-lg text-white shadow-xl transition-all duration-300 flex items-center gap-3 w-full justify-center ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-blue hover:bg-brand-accent hover:shadow-brand-accent/30 hover:-translate-y-1'}`}
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Submitting Application...' : 'Submit Application'}
                            </button>
                        </div>
                    </form>

                    {/* Estimator Side Panel */}
                    <div className="bg-brand-light/30 border border-blue-100 rounded-xl p-6 flex flex-col h-full">
                        <div className="flex items-center gap-2 text-brand-blue font-bold tracking-wider uppercase text-sm mb-4 pb-2 border-b border-blue-200">
                            <Calculator size={18} /> Estimator
                        </div>

                        <div className="flex-1">
                            <p className="text-gray-500 text-xs font-semibold uppercase mb-1">Est. Monthly Payment</p>
                            <h3 className="text-3xl font-black text-gray-800 mb-6 flex items-baseline">
                                <span className="text-gray-400 text-lg mr-1">$</span>{monthlyPayment} <span className="text-sm text-gray-500 font-medium ml-1">/mo</span>
                            </h3>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm py-2 border-b border-gray-100 font-medium text-gray-600">
                                    <span>Interest Rate:</span> <span className="font-bold text-brand-blue">6.00% APR</span>
                                </div>
                                <div className="flex justify-between text-sm py-2 border-b border-gray-100 font-medium text-gray-600">
                                    <span>Term Length:</span> <span className="font-bold text-gray-800">60 Months</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto bg-blue-50 p-4 rounded-lg flex gap-3 text-sm text-blue-800 border border-blue-100 shadow-sm">
                            <Info size={24} className="shrink-0 text-blue-500" />
                            <p className="font-medium leading-relaxed tracking-wide text-xs">All loans are subject to credit approval and verification of stated income by an admin.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoanRequest;
