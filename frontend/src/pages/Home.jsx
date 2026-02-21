import React from 'react';
import { Link } from 'react-router-dom';
import { Landmark, ShieldCheck, TrendingUp, Smartphone, ArrowRight } from 'lucide-react';

const Home = () => {
    return (
        <div className="space-y-20 pb-20 -mt-6">
            {/* Hero Section */}
            <section className="relative bg-brand-blue text-white overflow-hidden py-32 px-6 lg:px-8 mt-6 rounded-[2.5rem] shadow-2xl">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-accent/20 rounded-full blur-3xl -mr-64 -mt-32 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1 space-y-8 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-semibold tracking-wide text-brand-light transform hover:scale-105 transition-transform cursor-pointer">
                            <ShieldCheck size={18} className="text-brand-accent" /> Enterprise-Grade Security
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
                            Banking Reimagined for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 italic">Tomorrow.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-blue-100 max-w-2xl font-light leading-relaxed">
                            Experience LaxmiBank Elite. The standard in modern wealth management, seamless transfers, and unparalleled digital service.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 justify-center md:justify-start">
                            <Link to="/register" className="btn-primary flex items-center gap-2 px-8 py-4 text-lg w-full sm:w-auto justify-center shadow-brand-accent/30 shadow-lg hover:-translate-y-1">
                                Open an Account <ArrowRight size={20} />
                            </Link>
                            <Link to="/login" className="text-white hover:text-brand-accent font-semibold flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 rounded hover:bg-white/10 transition-all text-lg w-full sm:w-auto justify-center">
                                Sign In Details
                            </Link>
                        </div>
                    </div>

                    {/* Hero Image / Graphic Wrapper */}
                    <div className="flex-1 hidden md:block">
                        <div className="relative w-full aspect-square max-w-lg mx-auto transform perspective-1000 rotate-y-[-10deg] rotate-x-[5deg] hover:rotate-0 transition-transform duration-700 shadow-2xl rounded-2xl bg-gradient-to-tr from-gray-900 to-brand-blue border border-white/10 overflow-hidden group">
                            {/* Conceptual App UI Mockup */}
                            <div className="absolute inset-x-0 top-0 h-16 border-b border-white/10 bg-black/20 flex items-center px-6 justify-between">
                                <div className="flex items-center gap-2"><Landmark size={24} className="text-brand-accent" /><span className="font-bold text-lg tracking-widest">ELITE</span></div>
                                <div className="flex gap-2"><div className="w-2 h-2 rounded-full bg-red-400"></div><div className="w-2 h-2 rounded-full bg-yellow-400"></div><div className="w-2 h-2 rounded-full bg-green-400"></div></div>
                            </div>
                            <div className="p-8 pt-24 space-y-6">
                                <div className="h-4 w-32 bg-white/10 rounded-full"></div>
                                <div className="h-16 w-3/4 bg-white/5 rounded-xl border border-white/10 flex items-center px-4"><div className="h-8 w-8 rounded-full bg-brand-accent/50 mr-4"></div><div className="h-4 w-24 bg-white/20 rounded-full"></div></div>
                                <div className="h-16 w-full bg-white/5 rounded-xl border border-white/10 flex items-center px-4"><div className="h-8 w-8 rounded-full bg-indigo-500/50 mr-4"></div><div className="h-4 w-32 bg-white/20 rounded-full"></div></div>
                                <div className="h-16 w-5/6 bg-white/5 rounded-xl border border-white/10 flex items-center px-4"><div className="h-8 w-8 rounded-full bg-green-500/50 mr-4"></div><div className="h-4 w-20 bg-white/20 rounded-full"></div></div>
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                            <div className="absolute bottom-8 left-8 right-8">
                                <div className="bg-brand-accent/20 border border-brand-accent/50 p-4 rounded-xl text-brand-light font-medium backdrop-blur-md group-hover:bg-brand-accent/40 transition-colors">
                                    Live Transaction Sync Active
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-brand-accent font-bold tracking-wider uppercase text-sm mb-2">Why Choose Us</h2>
                    <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900">Banking designed for your lifestyle.</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* Feature 1 */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300 group">
                        <div className="h-14 w-14 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center mb-6 group-hover:bg-brand-blue group-hover:text-white transition-colors duration-300 shadow-inner">
                            <Smartphone size={28} />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 mb-3">Mobile First Design</h4>
                        <p className="text-gray-500 leading-relaxed font-medium">Manage your wealth anytime, anywhere. Our responsive platform ensures a native-like experience on every device.</p>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300 group">
                        <div className="h-14 w-14 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shadow-inner">
                            <ArrowRight size={28} />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 mb-3">Atomic Transfers</h4>
                        <p className="text-gray-500 leading-relaxed font-medium">Built on MongoDB transaction sessions. If a transfer fails mid-way, not a single penny is lost. 100% ACID compliant logic.</p>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300 group">
                        <div className="h-14 w-14 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300 shadow-inner">
                            <TrendingUp size={28} />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 mb-3">Instant Scalability</h4>
                        <p className="text-gray-500 leading-relaxed font-medium">Enterprise MERN architecture. Ready to handle thousands of concurrent transactions with Express rate limiting & Helmet security.</p>
                    </div>
                </div>
            </section>

            {/* Trust Callout */}
            <section className="bg-brand-light rounded-3xl p-12 max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8 text-center md:text-left shadow-inner border border-blue-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <ShieldCheck size={200} />
                </div>
                <div className="p-4 bg-white rounded-2xl shadow-sm z-10 shrink-0">
                    <Landmark size={64} className="text-brand-blue" />
                </div>
                <div className="z-10">
                    <h3 className="text-2xl font-bold text-brand-blue mb-2">Trusted by 10,000+ businesses globally.</h3>
                    <p className="text-gray-600 font-medium">Join the financial revolution today. No hidden fees, no complex jargon. Just transparent, reliable banking engineering.</p>
                </div>
                <div className="md:ml-auto z-10">
                    <Link to="/about" className="font-bold text-brand-accent hover:text-brand-blue underline decoration-2 underline-offset-4 transition-colors">
                        Read our technical whitepaper →
                    </Link>
                </div>
            </section>

            {/* Demo Note */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md shadow-sm max-w-4xl mx-auto mb-10 text-center">
                <p className="text-yellow-700 font-bold">
                    ⚠️ Demo for automation testing
                </p>
            </div>
        </div>
    );
};

export default Home;
