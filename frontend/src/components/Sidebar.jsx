import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wallet, ArrowLeftRight, CreditCard, Search, UserCircle, HandCoins, LayoutDashboard } from 'lucide-react';

const Sidebar = ({ className = '' }) => {
    const { user } = useAuth();

    if (!user) return null;

    if (user.role === 'admin') {
        const adminLinks = [
            { name: 'Admin Dashboard', path: '/admin', icon: <LayoutDashboard size={18} /> },
        ];
        return (
            <div className={`bg-gray-900 rounded-lg shadow-sm border border-gray-800 flex flex-col h-fit sticky top-20 overflow-hidden ${className}`}>
                <div className="bg-orange-600 text-white p-4 font-bold text-lg uppercase tracking-tight border-b border-orange-500">
                    Control Center
                </div>
                <nav className="flex flex-col flex-1 p-2 space-y-1">
                    {adminLinks.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 w-full text-left font-medium ${isActive
                                    ? 'bg-orange-500/10 text-orange-500 border-l-4 border-orange-500'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`
                            }
                        >
                            {link.icon}
                            <span className="text-sm">{link.name}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>
        );
    }

    const links = [
        { name: 'Accounts Overview', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
        { name: 'Open New Account', path: '/open-account', icon: <Wallet size={18} /> },
        { name: 'Transfer Funds', path: '/transfer', icon: <ArrowLeftRight size={18} /> },
        { name: 'Bill Pay', path: '/bill-pay', icon: <CreditCard size={18} /> },
        { name: 'Find Transactions', path: '/transactions', icon: <Search size={18} /> },
        { name: 'Request Loan', path: '/loan-request', icon: <HandCoins size={18} /> },
        { name: 'Update Contact Info', path: '/settings', icon: <UserCircle size={18} /> },
    ];

    return (
        <div className={`bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col h-fit sticky top-20 overflow-hidden ${className}`}>
            <div className="bg-brand-blue text-white p-4 font-semibold text-lg tracking-wide border-b border-brand-accent">
                Account Services
            </div>
            <nav className="flex flex-col flex-1 p-2 space-y-1">
                {links.map((link) => (
                    <NavLink
                        key={link.name}
                        to={link.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 w-full text-left font-medium ${isActive
                                ? 'bg-brand-light text-brand-blue border-l-4 border-brand-accent shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-brand-accent'
                            }`
                        }
                    >
                        {link.icon}
                        <span className="text-sm">{link.name}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;
