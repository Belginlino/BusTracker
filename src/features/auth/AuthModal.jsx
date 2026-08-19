import React, { useState } from 'react';
import { X, Lock, Mail, Shield, User, Bus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../utils/constants';

export default function AuthModal({ isOpen, onClose }) {
  const { login, role, setRole, user, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState(role || ROLES.PASSENGER);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (email && password) {
        await login(email, password);
      }
      setRole(selectedRole);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to authenticate');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 rounded-xl bg-brand-600 flex items-center justify-center mb-3">
            <Bus className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold">TransitPulse Identity Portal</h2>
          <p className="text-xs text-slate-400 mt-1">Sign in or switch role for Hackathon Demo</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {user ? (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="text-xs font-medium text-slate-500">Currently Signed In</div>
                <div className="text-sm font-bold text-slate-900">{user.email}</div>
                <div className="text-xs text-slate-600 mt-1">Role: <span className="font-semibold uppercase text-brand-600">{role}</span></div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                  Select Active Role (Hackathon Demo Mode)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => { setSelectedRole(ROLES.PASSENGER); setRole(ROLES.PASSENGER); }}
                    className={`py-2 rounded-lg text-xs font-semibold border transition-all ${
                      role === ROLES.PASSENGER
                        ? 'bg-brand-600 text-white border-brand-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Passenger
                  </button>
                  <button
                    type="button"
                    onClick={() => { setSelectedRole(ROLES.DRIVER); setRole(ROLES.DRIVER); }}
                    className={`py-2 rounded-lg text-xs font-semibold border transition-all ${
                      role === ROLES.DRIVER
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Driver
                  </button>
                  <button
                    type="button"
                    onClick={() => { setSelectedRole(ROLES.ADMIN); setRole(ROLES.ADMIN); }}
                    className={`py-2 rounded-lg text-xs font-semibold border transition-all ${
                      role === ROLES.ADMIN
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Admin
                  </button>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={logout}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100"
                >
                  Sign Out
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
                >
                  Continue
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="driver@transitpulse.city"
                    className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">Select User Role</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole(ROLES.PASSENGER)}
                    className={`py-2 rounded-lg text-xs font-semibold border transition-all ${
                      selectedRole === ROLES.PASSENGER
                        ? 'bg-brand-600 text-white border-brand-600'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    Passenger
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole(ROLES.DRIVER)}
                    className={`py-2 rounded-lg text-xs font-semibold border transition-all ${
                      selectedRole === ROLES.DRIVER
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    Driver
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole(ROLES.ADMIN)}
                    className={`py-2 rounded-lg text-xs font-semibold border transition-all ${
                      selectedRole === ROLES.ADMIN
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    Admin
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-sm shadow-md shadow-brand-600/20 transition-all"
              >
                {submitting ? 'Authenticating...' : 'Sign In / Select Role'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
