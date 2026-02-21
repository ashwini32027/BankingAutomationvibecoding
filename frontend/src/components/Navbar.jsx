import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Landmark, Menu, User, LogOut, X } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsMenuOpen(false);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const navLinks = [
        { name: 'About Us', path: '/' },
        { name: 'Services', path: '/' },
        { name: 'Locations', path: '/' },
        { name: 'Admin Portal', path: '/admin-login' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-brand-blue text-white shadow-lg fixed top-0 w-full z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight hover:text-brand-light transition" onClick={() => setIsMenuOpen(false)}>
                            <Landmark className="h-8 w-8 text-brand-accent" />
                            <span>LaxmiBank <span className="text-brand-accent font-light italic text-sm">Elite</span></span>
                        </Link>
                    </div>

                    {/* Nav Links (Desktop) */}
                    <div className="hidden md:flex items-center space-x-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`transition text-sm font-medium ${isActive(link.path) ? 'text-brand-accent' : 'hover:text-brand-accent'}`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {user ? (
                            <div className="flex items-center gap-4 ml-4 border-l border-gray-600 pl-4">
                                <div className="flex items-center gap-2 text-sm text-gray-300">
                                    <User className="h-4 w-4" />
                                    <span>Welcome, <span className="font-semibold text-white">{user.fullName || user.username}</span></span>
                                </div>
                                {user.role === 'admin' && (
                                    <Link to="/admin" className="text-sm bg-orange-600 hover:bg-orange-700 px-3 py-1 rounded transition text-white">Admin Panel</Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-1 text-sm bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition text-white"
                                >
                                    <LogOut className="h-4 w-4" /> Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="text-sm hover:text-brand-accent font-medium transition">Login</Link>
                                <Link to="/register" className="text-sm bg-brand-accent hover:bg-blue-600 px-4 py-2 rounded font-medium transition shadow-sm text-white">Sign Up</Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="text-gray-300 hover:text-white p-2 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-brand-blue/95 backdrop-blur-md border-t border-white/10 shadow-2xl animate-in slide-in-from-top duration-300">
                    <div className="px-4 pt-2 pb-6 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="block px-3 py-4 text-base font-medium border-b border-white/5 hover:bg-white/5 transition"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {user ? (
                            <div className="pt-4 space-y-4">
                                <div className="px-3 py-2 flex items-center gap-2 text-gray-300">
                                    <User className="h-5 w-5" />
                                    <span>{user.fullName || user.username}</span>
                                </div>
                                {user.role === 'admin' && (
                                    <Link
                                        to="/admin"
                                        className="block px-3 py-3 text-base font-medium bg-orange-600 rounded text-center"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Admin Panel
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center gap-2 px-3 py-3 text-base font-medium bg-red-600 rounded"
                                >
                                    <LogOut className="h-5 w-5" /> Logout
                                </button>
                            </div>
                        ) : (
                            <div className="pt-4 flex flex-col gap-3 px-3">
                                <Link
                                    to="/login"
                                    className="w-full py-3 text-center border border-white/20 rounded font-medium"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="w-full py-3 text-center bg-brand-accent rounded font-medium text-white shadow-lg"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
