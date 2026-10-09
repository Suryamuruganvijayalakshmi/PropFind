import React, { useState } from 'react';
import { 
  X, 
  User, 
  Building2, 
  Lock, 
  Mail, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';

export default function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess
}) {
  const [roleTab, setRoleTab] = useState('buyer'); // 'buyer' or 'seller'
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleQuickLogin = (userProfile) => {
    onLoginSuccess(userProfile);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.login({
        email: email || (roleTab === 'buyer' ? 'sarah.buyer@propfind.com' : 'marcus.seller@vanceholdings.com'),
        name: name || (roleTab === 'buyer' ? 'Sarah Jenkins' : 'Marcus Vance'),
        role: roleTab
      });

      if (response.success && response.user) {
        onLoginSuccess(response.user);
        onClose();
      }
    } catch (err) {
      alert(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-6 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-iris-950 to-indigo-900 text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-iris-300 block">
              PropFind Secure Gateway
            </span>
            <h3 className="text-xl font-bold font-display mt-0.5">
              {roleTab === 'buyer' ? 'Buyer & Investor Access' : 'Verified Seller Portal'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Role Tab Selector (Separate for Seller & Buyer) */}
        <div className="p-4 bg-neutral-100 border-b border-neutral-200">
          <div className="grid grid-cols-2 gap-2 bg-neutral-200/80 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => setRoleTab('buyer')}
              className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                roleTab === 'buyer'
                  ? 'bg-white text-iris-700 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Buyer Login</span>
            </button>

            <button
              type="button"
              onClick={() => setRoleTab('seller')}
              className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                roleTab === 'seller'
                  ? 'bg-white text-iris-700 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Seller Login</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          
          {/* 1-Click Instant Demo Login Switchers */}
          <div className="p-3.5 rounded-2xl bg-ivory-100 border border-iris-100 text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-iris-600 block mb-2">
              Instant 1-Click Demo Profiles:
            </span>
            {roleTab === 'buyer' ? (
              <button
                type="button"
                onClick={() => handleQuickLogin({
                  id: 1,
                  name: "Sarah Jenkins",
                  email: "sarah.buyer@propfind.com",
                  role: "buyer",
                  phone: "+1 (555) 234-8901",
                  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                })}
                className="w-full flex items-center justify-between p-2 rounded-xl bg-white border border-neutral-200 hover:border-iris-400 text-xs font-semibold text-neutral-800 transition-colors shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                    alt="Sarah"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span>Sarah Jenkins (Buyer / Investor)</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-iris-600" />
              </button>
            ) : (
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickLogin({
                    id: 2,
                    name: "Marcus Vance",
                    email: "marcus.seller@vanceholdings.com",
                    role: "seller",
                    phone: "+1 (555) 789-4321",
                    agency: "Vance Elite Realty",
                    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
                  })}
                  className="w-full flex items-center justify-between p-2 rounded-xl bg-white border border-neutral-200 hover:border-iris-400 text-xs font-semibold text-neutral-800 transition-colors shadow-2xs"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
                      alt="Marcus"
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span>Marcus Vance (Vance Elite Realty)</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-iris-600" />
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin({
                    id: 3,
                    name: "Elena Rostova",
                    email: "elena@azureestates.com",
                    role: "seller",
                    phone: "+1 (555) 908-1122",
                    agency: "Azure International",
                    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
                  })}
                  className="w-full flex items-center justify-between p-2 rounded-xl bg-white border border-neutral-200 hover:border-iris-400 text-xs font-semibold text-neutral-800 transition-colors shadow-2xs"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
                      alt="Elena"
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span>Elena Rostova (Azure Estates)</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-iris-600" />
                </button>
              </div>
            )}
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-neutral-200"></div>
            <span className="flex-shrink mx-3 text-neutral-400 text-[11px] font-bold uppercase">Or sign in with email</span>
            <div className="flex-grow border-t border-neutral-200"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {isRegister && (
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alexander Morgan"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium focus:border-iris-500 focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={roleTab === 'buyer' ? "buyer@domain.com" : "seller@agency.com"}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium focus:border-iris-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium focus:border-iris-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-iris-600 hover:bg-iris-700 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <span>{isRegister ? `Register as ${roleTab}` : `Sign In as ${roleTab}`}</span>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-xs text-iris-600 font-semibold hover:underline"
            >
              {isRegister ? "Already have an account? Sign In" : "Need an account? Register here"}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
