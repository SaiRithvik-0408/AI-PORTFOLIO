import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, LogOut, Check, X, Eye, EyeOff } from 'lucide-react';
import { initialSectionVisibility, getSectionVisibility, setSectionVisibility } from './config';

const AdminPortal = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loginData, setLoginData] = useState({ username: '', password: '' });
    const [visibility, setVisibility] = useState(getSectionVisibility());
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        if (loginData.username === 'admin' && loginData.password === 'admin') {
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('Invalid username or password');
        }
    };

    const toggleVisibility = (section) => {
        const newVisibility = { ...visibility, [section]: !visibility[section] };
        setVisibility(newVisibility);
        setSectionVisibility(newVisibility);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        navigate('/');
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-slate-900 rounded-2xl border border-white/10 p-8 shadow-2xl">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-4">
                            <Settings className="text-indigo-400" size={32} />
                        </div>
                        <h1 className="text-2xl font-bold text-white">Admin Login</h1>
                        <p className="text-gray-400 text-sm">Enter your credentials to continue</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Username</label>
                            <input
                                type="text"
                                value={loginData.username}
                                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                            <input
                                type="password"
                                value={loginData.password}
                                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                required
                            />
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-semibold transition-all shadow-lg shadow-indigo-500/20"
                        >
                            Log In
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                            <Settings className="text-indigo-400" size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                            <p className="text-gray-400 text-sm">Manage Portfolio Visibility</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all text-sm font-medium"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold">Section Name</th>
                                <th className="px-6 py-4 font-semibold text-center">Visibility</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {Object.keys(visibility).map((section) => (
                                <tr
                                    key={section}
                                    className="group hover:bg-white/[0.02] transition-colors duration-200"
                                >
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${visibility[section] ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-gray-500'}`}>
                                                <Settings size={18} />
                                            </div>
                                            <span className={`font-medium capitalize ${visibility[section] ? 'text-white' : 'text-gray-500'}`}>
                                                {section}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex justify-center">
                                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${visibility[section]
                                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                    : 'bg-red-500/20 text-red-500 border border-red-500/30'
                                                }`}>
                                                {visibility[section] ? (
                                                    <>
                                                        <Eye size={12} />
                                                        <span>Visible</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <EyeOff size={12} />
                                                        <span>Hidden</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex justify-end">
                                            <button
                                                onClick={() => toggleVisibility(section)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${visibility[section] ? 'bg-indigo-500' : 'bg-slate-700'
                                                    }`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${visibility[section] ? 'translate-x-6' : 'translate-x-1'
                                                        }`}
                                                />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-8 p-6 bg-indigo-500/5 rounded-2xl border border-indigo-500/20 flex flex-col items-center gap-4">
                    <p className="text-indigo-300 text-sm flex items-center gap-2">
                        <Check size={16} />
                        Changes are saved locally and will persist in your browser.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="text-indigo-400 hover:text-indigo-300 text-sm font-medium underline underline-offset-4 flex items-center gap-2 transition-colors"
                    >
                        Return to Portfolio
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminPortal;
