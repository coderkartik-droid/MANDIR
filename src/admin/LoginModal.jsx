import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User, X, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useAdmin } from './AdminContext';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const { login } = useAdmin();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setUsername('');
      setPassword('');
      setError('');
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 600));

    const success = login(username, password);

    if (success) {
      setIsLoading(false);
      onClose();
      if (onLoginSuccess) onLoginSuccess();
    } else {
      setIsLoading(false);
      setError('Invalid credentials. Try MANDIR / MANDIR123');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md mx-4"
          >
            <div className="relative bg-navy-950/80 backdrop-blur-xl border border-gold-500/40 rounded-3xl p-8 shadow-[0_0_60px_rgba(212,175,55,0.15),0_25px_50px_rgba(0,0,0,0.6)]">
              <div className="ornate-corner-tl" />
              <div className="ornate-corner-tr" />
              <div className="ornate-corner-bl" />
              <div className="ornate-corner-br" />

              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full text-gold-400/70 hover:text-gold-300 hover:bg-gold-500/10 transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center mb-8">
                <div className="relative w-20 h-20 mb-5">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-gold-700/40 via-gold-500/20 to-sacred-saffron/30 blur-lg animate-pulse-glow" />
                  <div className="relative w-full h-full rounded-full border-2 border-gold-500/60 bg-gradient-to-br from-navy-900 via-navy-850 to-navy-900 flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.35)]">
                    <span className="font-cinzel-deco text-4xl text-gold-gradient">ॐ</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-gold-400" />
                  <h2 className="font-cinzel text-2xl tracking-[0.2em] text-gold-gradient font-bold">
                    TEMPLE ADMIN
                  </h2>
                  <Sparkles className="w-5 h-5 text-gold-400" />
                </div>

                <p className="font-marcellus text-sm text-sacred-ivory/60 tracking-wider">
                  Sacred Portal Access
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block font-cinzel text-xs tracking-widest text-gold-400/80 mb-2 uppercase">
                    Username
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="w-5 h-5 text-gold-500/60 group-focus-within:text-gold-400 transition-colors" />
                    </div>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-navy-900/70 border border-gold-500/25 text-sacred-ivory font-marcellus placeholder-sacred-ivory/30 focus:outline-none focus:border-gold-400/60 focus:shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all"
                      placeholder="Enter sacred username"
                      autoComplete="username"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-cinzel text-xs tracking-widest text-gold-400/80 mb-2 uppercase">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-gold-500/60 group-focus-within:text-gold-400 transition-colors" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-navy-900/70 border border-gold-500/25 text-sacred-ivory font-marcellus placeholder-sacred-ivory/30 focus:outline-none focus:border-gold-400/60 focus:shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all"
                      placeholder="Enter sacred password"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gold-500/60 hover:text-gold-300 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="flex items-start gap-2 px-4 py-3 rounded-xl bg-sacred-flame/10 border border-sacred-flame/30"
                    >
                      <span className="text-sacred-flame text-sm">⚠</span>
                      <p className="font-marcellus text-sm text-sacred-flame/90 leading-snug">
                        {error}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="relative w-full py-4 rounded-xl bg-gradient-to-r from-gold-200 via-gold-400 to-gold-600 text-navy-950 font-cinzel text-base font-bold tracking-[0.25em] uppercase shadow-[0_0_25px_rgba(212,175,55,0.4),0_8px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_0_40px_rgba(255,215,0,0.55),0_12px_28px_rgba(0,0,0,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer bg-[length:200%_100%]" />
                  <div className="relative flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-navy-950/30 border-t-navy-950 rounded-full"
                        />
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span>Sign In</span>
                        <Sparkles className="w-5 h-5" />
                      </>
                    )}
                  </div>
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-gold-500/15">
                <p className="font-marcellus text-center text-xs text-sacred-ivory/45 tracking-wide">
                  Default credentials:{' '}
                  <span className="text-gold-400/80 font-semibold">MANDIR / MANDIR123</span>
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
