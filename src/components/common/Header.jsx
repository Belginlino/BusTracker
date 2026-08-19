import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bus, MapPin, Navigation, Bookmark, Shield, User, Menu, X, Play, Zap } from 'lucide-react';
import { ROLES } from '../../utils/constants';

export default function Header({ currentRole, setRole, user, onOpenAuth }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-30 bg-slate-900 text-white shadow-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-lg shadow-brand-600/30 group-hover:bg-brand-500 transition-all">
              <Bus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight">TransitPulse</span>
                <span className="bg-brand-500/20 text-brand-400 text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded border border-brand-500/30">City MVP</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium leading-none">Real-Time Transit Tracker</p>
            </div>
          </Link>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/live"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/live')
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Navigation className="w-4 h-4" />
              Live Bus Map
            </Link>

            <Link
              to="/routes"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/routes')
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Bus className="w-4 h-4" />
              Routes
            </Link>

            <Link
              to="/stops"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/stops')
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <MapPin className="w-4 h-4" />
              Stops
            </Link>

            <Link
              to="/favorites"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/favorites')
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Bookmark className="w-4 h-4 text-amber-400" />
              Favorites
            </Link>
          </nav>

          {/* Right Actions: Role Selector & Auth */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Role Switcher for Hackathon Demo */}
            <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700">
              <button
                onClick={() => setRole(ROLES.PASSENGER)}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                  currentRole === ROLES.PASSENGER
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Passenger
              </button>
              <button
                onClick={() => setRole(ROLES.DRIVER)}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                  currentRole === ROLES.DRIVER
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Driver
              </button>
              <button
                onClick={() => setRole(ROLES.ADMIN)}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                  currentRole === ROLES.ADMIN
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Admin
              </button>
            </div>

            {/* Quick Route Shortcut based on selected role */}
            {currentRole === ROLES.DRIVER && (
              <Link
                to="/driver"
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                Driver GPS Portal
              </Link>
            )}

            {currentRole === ROLES.ADMIN && (
              <Link
                to="/admin"
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow"
              >
                <Shield className="w-3.5 h-3.5" />
                Admin Dashboard
              </Link>
            )}

            {/* Auth / Account button */}
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
            >
              <User className="w-4 h-4 text-brand-400" />
              <span>{user ? user.displayName || user.email?.split('@')[0] : 'Sign In'}</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900 px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 mb-3">
            <Link
              to="/live"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800 text-sm font-medium text-slate-200"
            >
              <Navigation className="w-4 h-4 text-brand-400" /> Live Bus Map
            </Link>
            <Link
              to="/routes"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800 text-sm font-medium text-slate-200"
            >
              <Bus className="w-4 h-4 text-emerald-400" /> Routes
            </Link>
            <Link
              to="/stops"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800 text-sm font-medium text-slate-200"
            >
              <MapPin className="w-4 h-4 text-purple-400" /> Stops
            </Link>
            <Link
              to="/favorites"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800 text-sm font-medium text-slate-200"
            >
              <Bookmark className="w-4 h-4 text-amber-400" /> Favorites
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <p className="text-xs text-slate-400 font-semibold mb-2 uppercase">Switch Mode (Hackathon Demo)</p>
            <div className="flex rounded-lg bg-slate-800 p-1">
              <button
                onClick={() => { setRole(ROLES.PASSENGER); setMobileMenuOpen(false); }}
                className={`flex-1 py-1.5 rounded text-xs font-semibold ${currentRole === ROLES.PASSENGER ? 'bg-brand-600 text-white' : 'text-slate-400'}`}
              >
                Passenger
              </button>
              <button
                onClick={() => { setRole(ROLES.DRIVER); setMobileMenuOpen(false); }}
                className={`flex-1 py-1.5 rounded text-xs font-semibold ${currentRole === ROLES.DRIVER ? 'bg-amber-600 text-white' : 'text-slate-400'}`}
              >
                Driver
              </button>
              <button
                onClick={() => { setRole(ROLES.ADMIN); setMobileMenuOpen(false); }}
                className={`flex-1 py-1.5 rounded text-xs font-semibold ${currentRole === ROLES.ADMIN ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
              >
                Admin
              </button>
            </div>
          </div>

          {currentRole === ROLES.DRIVER && (
            <Link
              to="/driver"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center bg-amber-500 text-slate-950 font-bold py-2 rounded-lg text-xs"
            >
              Open Driver GPS Dashboard
            </Link>
          )}

          {currentRole === ROLES.ADMIN && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center bg-emerald-500 text-slate-950 font-bold py-2 rounded-lg text-xs"
            >
              Open Admin Fleet Console
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
