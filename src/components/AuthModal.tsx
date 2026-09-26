import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { ShieldCheck, X, CheckCircle, Mail, Lock, ArrowRight } from 'lucide-react';
import type { UserRole } from '../types/inventory';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type AuthMode = 'login' | 'signup' | 'forgot_otp';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { login, sendOTP, verifyOTP } = useInventory();

  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('nikhil9317@gov-ims.in');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState<UserRole>('manager');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    login(email, role);
    onSuccess();
    onClose();
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    await sendOTP(email);
    setOtpSent(true);
    setMessage('OTP Code sent to registered official email. (Use demo OTP: 9317)');
  };

  const handleVerifyReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyOTP(otpCode)) {
      login(email, role);
      alert('OTP Verified successfully! Password has been updated.');
      onSuccess();
      onClose();
    } else {
      setMessage('Invalid OTP code. Please enter 9317.');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans">
      <div className="bg-white rounded-md shadow-2xl max-w-md w-full border border-slate-300 overflow-hidden">
        {/* Government Header Bar */}
        <div className="gov-header-bg text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm uppercase tracking-wide">
              Gov IMS Portal Authentication
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-slate-200 text-xs font-bold bg-slate-100">
          <button
            onClick={() => { setMode('login'); setMessage(''); }}
            className={`flex-1 py-2.5 text-center transition ${
              mode === 'login' ? 'bg-white text-blue-900 border-b-2 border-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Official Sign In
          </button>
          <button
            onClick={() => { setMode('signup'); setMessage(''); }}
            className={`flex-1 py-2.5 text-center transition ${
              mode === 'signup' ? 'bg-white text-blue-900 border-b-2 border-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            New Officer Signup
          </button>
          <button
            onClick={() => { setMode('forgot_otp'); setMessage(''); }}
            className={`flex-1 py-2.5 text-center transition ${
              mode === 'forgot_otp' ? 'bg-white text-blue-900 border-b-2 border-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            OTP Reset
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 text-xs">
          {message && (
            <div className="mb-4 bg-blue-50 p-2.5 rounded border border-blue-200 text-blue-900 font-semibold flex items-center space-x-1.5">
              <CheckCircle className="w-4 h-4 text-blue-700 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Role Permission</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('manager')}
                    className={`py-2 text-xs font-bold rounded border transition ${
                      role === 'manager'
                        ? 'bg-blue-900 text-white border-blue-950 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-300'
                    }`}
                  >
                    Inventory Manager
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('staff')}
                    className={`py-2 text-xs font-bold rounded border transition ${
                      role === 'staff'
                        ? 'bg-blue-900 text-white border-blue-950 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-300'
                    }`}
                  >
                    Warehouse Staff
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Govt Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded font-semibold focus:border-blue-900"
                    placeholder="nikhil9317@gov-ims.in"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded font-semibold focus:border-blue-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setMode('forgot_otp')}
                  className="text-[11px] font-bold text-blue-900 hover:underline"
                >
                  Forgot Password? (OTP Reset)
                </button>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full gov-btn-primary py-2 rounded text-xs uppercase tracking-wide font-bold flex items-center justify-center space-x-1.5 shadow"
                >
                  <span>Log In to Inventory Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {mode === 'signup' && (
            <form onSubmit={handleLoginSubmit} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Officer Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nikhil"
                  className="w-full p-2 border border-slate-300 rounded font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded font-semibold"
                  placeholder="nikhil9317@gov-ims.in"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assign Initial Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded font-semibold"
                >
                  <option value="manager">Inventory Manager (Incoming/Outgoing Control)</option>
                  <option value="staff">Warehouse Staff (Picking, Shelving & Counting)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Create Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded font-semibold"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full gov-btn-primary py-2 rounded text-xs uppercase tracking-wide font-bold flex items-center justify-center space-x-1.5 shadow"
                >
                  <span>Register & Access Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {mode === 'forgot_otp' && (
            <div>
              {!otpSent ? (
                <form onSubmit={handleSendOTP} className="space-y-3">
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Enter your official registered email address to receive a secure 4-digit OTP verification code.
                  </p>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Registered Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded font-semibold"
                      placeholder="nikhil9317@gov-ims.in"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full gov-btn-primary py-2 rounded text-xs font-bold uppercase tracking-wide shadow"
                  >
                    Send Verification OTP Code
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyReset} className="space-y-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Enter 4-Digit OTP Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter 9317"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded font-mono font-bold text-center text-lg text-blue-900 tracking-widest"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Set New Password</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded font-semibold"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 rounded text-xs uppercase tracking-wide shadow"
                  >
                    Verify OTP & Access Dashboard
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
