import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Wallet, AlertCircle, CheckCircle } from 'lucide-react';

const OpenAccount = () => {
    const [type, setType] = useState('Current');
    const [initialDeposit, setInitialDeposit] = useState('');
    const [nomineeName, setNomineeName] = useState('');
    const [nomineeRelationship, setNomineeRelationship] = useState('');
    const [beneficiaryMobile, setBeneficiaryMobile] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        if (initialDeposit && parseFloat(initialDeposit) < 0) {
            setError('Initial deposit cannot be negative.');
            setIsLoading(false);
            return;
        }

        try {
            const { data } = await api.post('/accounts', {
                type,
                initialDeposit: initialDeposit ? parseFloat(initialDeposit) : 0,
                nomineeName,
                nomineeRelationship,
                beneficiaryMobile
            });
            setSuccess(`Account opened successfully! Account Number: ${data.accountNumber}`);
            setTimeout(() => navigate('/dashboard'), 3000); // Redirect after success
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to open account');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="card shadow-lg p-8 border-t-4 border-brand-accent">
                <div className="flex items-center gap-4 border-b border-gray-100 pb-4 mb-6">
                    <div className="bg-brand-light p-3 text-brand-accent rounded-full shadow-sm">
                        <Wallet size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-extrabold text-brand-blue">Open New Account</h2>
                        <p className="text-gray-500 text-sm">Select an account type and fund it</p>
                    </div>
                </div>

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
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <label className="block text-gray-800 text-sm font-bold mb-3 uppercase tracking-wide">
                            What type of account would you like to open?
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <label className={`cursor-pointer group flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-all ${type === 'Current' ? 'border-brand-accent bg-blue-50/50 shadow-md ring-2 ring-brand-accent/20' : 'border-gray-200 hover:border-brand-accent hover:bg-white'}`}>
                                <input
                                    type="radio"
                                    value="Current"
                                    checked={type === 'Current'}
                                    onChange={(e) => setType(e.target.value)}
                                    className="sr-only"
                                />
                                <span className="font-extrabold text-lg text-brand-blue group-hover:text-brand-accent mb-1 transition-colors">Current</span>
                                <span className="text-xs text-gray-500 font-medium text-center">Everyday business transactions</span>
                            </label>
                            <label className={`cursor-pointer group flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-all ${type === 'Savings' ? 'border-brand-accent bg-blue-50/50 shadow-md ring-2 ring-brand-accent/20' : 'border-gray-200 hover:border-brand-accent hover:bg-white'}`}>
                                <input
                                    type="radio"
                                    value="Savings"
                                    checked={type === 'Savings'}
                                    onChange={(e) => setType(e.target.value)}
                                    className="sr-only"
                                />
                                <span className="font-extrabold text-lg text-green-700 group-hover:text-green-600 mb-1 transition-colors">Savings</span>
                                <span className="text-xs text-gray-500 font-medium text-center">Earn competitive interest</span>
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-blue-50/30 border border-blue-100 rounded-lg">
                        <div className="md:col-span-2 text-xs font-black text-brand-blue uppercase tracking-[0.2em] mb-2">Nominee & Beneficiary Information</div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nomineeName">Nominee Full Name</label>
                            <input
                                className="input-field"
                                id="nomineeName"
                                type="text"
                                placeholder="Enter Nominee Name"
                                value={nomineeName}
                                onChange={(e) => setNomineeName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nomineeRelationship">Relationship</label>
                            <input
                                className="input-field"
                                id="nomineeRelationship"
                                type="text"
                                placeholder="e.g. Spouse, Parent"
                                value={nomineeRelationship}
                                onChange={(e) => setNomineeRelationship(e.target.value)}
                                required
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="beneficiaryMobile">Beneficiary Mobile Number</label>
                            <input
                                className="input-field"
                                id="beneficiaryMobile"
                                type="tel"
                                placeholder="10-digit Mobile Number"
                                value={beneficiaryMobile}
                                onChange={(e) => setBeneficiaryMobile(e.target.value)}
                                required
                                pattern="[0-9]{10}"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-800 text-sm font-bold mb-2 uppercase tracking-wide" htmlFor="initialDeposit">
                            Funding Amount (Initial Deposit)
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none font-bold text-gray-500">
                                $
                            </div>
                            <input
                                className="input-field pl-8 font-mono text-lg shadow-inner py-3 border-gray-300 focus:ring-4 focus:ring-brand-accent/20 focus:border-brand-accent transition-all"
                                id="initialDeposit"
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                value={initialDeposit}
                                onChange={(e) => setInitialDeposit(e.target.value)}
                            />
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400 text-sm font-semibold uppercase">
                                USD
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-2 italic font-medium">A security deposit is required for account activation.</p>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                        <button
                            className={`py-3 px-8 rounded-lg font-bold text-white shadow-md transition-all duration-300 flex items-center gap-2 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-blue hover:bg-brand-accent hover:shadow-xl hover:-translate-y-0.5'}`}
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Opening Account...' : 'Open New Account'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OpenAccount;
