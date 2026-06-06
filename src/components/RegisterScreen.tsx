import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, User, Mail, Eye, EyeOff } from 'lucide-react';
import logoImg from '../image/logo.png';

interface RegisterScreenProps {
  onRegister: (values: { businessName: string; phone: string; email: string }) => void;
  onGoToLogin: () => void;
  onBack: () => void;
}

export default function RegisterScreen({ onRegister, onGoToLogin, onBack }: RegisterScreenProps) {
  const [businessName, setBusinessName] = useState('Tani Maju Sejahtera');
  const [phone, setPhone] = useState('81234567890');
  const [email, setEmail] = useState('budi.santoso@gmail.com');
  const [password, setPassword] = useState('password123');
  const [confirmPassword, setConfirmPassword] = useState('password123');
  
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !phone) {
      setError('Nama Pemilik Usaha dan Nomor Handphone wajib diisi');
      return;
    }
    if (password !== confirmPassword) {
      setError('Password dan Konfirmasi Password tidak sesuai');
      return;
    }
    setError('');
    onRegister({ businessName, phone, email });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col h-full pb-8 bg-brand-bg relative overflow-y-auto"
    >
      {/* Top App Bar */}
      <header className="sticky top-0 bg-white border-b border-slate-100 flex items-center justify-between px-4 h-14 z-10">
        <button 
          onClick={onBack}
          aria-label="Kembali"
          className="text-brand-green-dark hover:bg-slate-50 transition-colors p-2 rounded-full flex items-center justify-center active:scale-95 duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-bold text-center flex-1 mr-8 text-brand-green-dark text-base">Informasi Akun</h1>
      </header>

      {/* Main Container Card */}
      <div className="flex-1 w-full max-w-sm mx-auto px-4 pt-6 pb-4">
        <div className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(31,56,38,0.03)] p-6 border border-slate-100 flex flex-col">
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-6">
            <img 
              alt="TumbasNa Logo" 
              className="h-8 mb-4 object-contain mix-blend-multiply" 
              src={logoImg}
              referrerPolicy="no-referrer"
            />
            <h2 className="font-bold text-lg text-brand-green-dark text-center">Daftar Akun Buyer</h2>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            
            {/* Nama Pemilik Usaha */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1 ml-1" htmlFor="nama">
                Nama Pemilik Usaha / Bisnis
              </label>
              <div className="relative">
                <input 
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-green-light focus:border-transparent transition-all" 
                  id="nama" 
                  placeholder="Masukkan nama lengkap" 
                  required
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
                <User className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
              </div>
            </div>

            {/* Nomor Handphone */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1 ml-1" htmlFor="phone">
                Nomor Handphone
              </label>
              <div className="flex border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white focus-within:ring-2 focus-within:ring-brand-green-light focus-within:border-transparent transition-all">
                <span className="inline-flex items-center px-3.5 bg-slate-50 border-r border-slate-200 text-slate-500 text-sm font-semibold">
                  +62
                </span>
                <input 
                  className="flex-1 w-full px-4 py-3 focus:outline-none text-sm text-slate-800" 
                  id="phone" 
                  placeholder="81234567890" 
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1 ml-1" htmlFor="email">
                Email (Opsional)
              </label>
              <div className="relative">
                <input 
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-green-light focus:border-transparent transition-all" 
                  id="email" 
                  placeholder="contoh@email.com" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1 ml-1" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input 
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-green-light focus:border-transparent transition-all" 
                  id="password" 
                  placeholder="Masukkan password" 
                  required
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-green-dark transition-colors focus:outline-none" 
                  onClick={() => setShowPass(!showPass)} 
                  type="button"
                >
                  {showPass ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            {/* Konfirmasi Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1 ml-1" htmlFor="confirm_password">
                Konfirmasi Password
              </label>
              <div className="relative">
                <input 
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-green-light focus:border-transparent transition-all" 
                  id="confirm_password" 
                  placeholder="Ketik ulang password" 
                  required
                  type={showConfirmPass ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-green-dark transition-colors focus:outline-none" 
                  onClick={() => setShowConfirmPass(!showConfirmPass)} 
                  type="button"
                >
                  {showConfirmPass ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            {error && <p className="text-xs text-rose-500 ml-1 font-medium">{error}</p>}

            {/* Submit */}
            <button 
              className="w-full bg-brand-orange hover:bg-amber-600 text-white font-bold text-sm rounded-xl py-3.5 mt-4 shadow-md hover:opacity-95 active:scale-[0.98] transition-all flex justify-center items-center" 
              type="submit"
            >
              Daftar Sekarang
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-6 text-center text-xs">
            <span className="text-slate-500">Sudah punya akun? </span>
            <button 
              onClick={onGoToLogin}
              className="text-brand-green-light font-bold hover:underline transition-colors"
            >
              Masuk Sekarang
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
