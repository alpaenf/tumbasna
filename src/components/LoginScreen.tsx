import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Phone, HelpCircle, ArrowLeft } from 'lucide-react';
import logoImg from '../image/logo.png';

interface LoginScreenProps {
  onLogin: (phone: string) => void;
  onGoToRegister: () => void;
  onBack: () => void;
}

export default function LoginScreen({ onLogin, onGoToRegister, onBack }: LoginScreenProps) {
  const [phoneNumber, setPhoneNumber] = useState('81234567890');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) {
      setError('Nomor handphone wajib diisi');
      return;
    }
    setError('');
    onLogin(phoneNumber);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col h-full pb-8 pt-6 px-6 bg-brand-bg relative overflow-y-auto text-[#1C201E]"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-stone-100 rounded-md text-brand-green-dark transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <img 
          alt="TumbasNa Logo" 
          src={logoImg} 
          className="h-8 object-contain animate-fade-in mix-blend-multiply"
          referrerPolicy="no-referrer"
        />
        <div className="w-9 h-9" /> {/* Spacer */}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full text-left">
        {/* Headline */}
        <h2 className="text-xl font-serif font-bold text-brand-green-dark mb-2.5 tracking-tight">
          Selamat Datang, Pembeli
        </h2>
        <p className="text-xs font-sans text-[#55605C] font-semibold mb-8 leading-relaxed">
          Silakan masuk untuk mulai bertransaksi komoditas pertanian segar bebas cengkeraman tengkulak.
        </p>

        {/* Form login */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="phone" className="block text-[9px] font-mono font-bold uppercase tracking-wider text-brand-green-dark mb-1.5 ml-0.5">
              Nomor Handphone Aktif
            </label>
            <div className="flex rounded-md shadow-3xs border border-brand-green-dark/15 overflow-hidden bg-white focus-within:ring-2 focus-within:ring-brand-green-dark/25 focus-within:border-brand-green-dark transition-all">
              <span className="inline-flex items-center px-4 bg-stone-50 border-r border-brand-green-dark/15 text-stone-600 text-xs font-mono font-bold">
                +62
              </span>
              <div className="relative flex-1">
                <input 
                  type="text" 
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  className="w-full py-4 pl-4 pr-10 focus:outline-none text-brand-green-dark font-mono font-bold tracking-wide placeholder-stone-300 text-xs"
                  placeholder="812 3456 7890"
                />
                <Phone className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-stone-400" />
              </div>
            </div>
            {error && <p className="text-xs text-rose-600 mt-1.5 ml-0.5 font-sans font-medium">{error}</p>}
          </div>

          <button 
            type="submit"
            className="w-full bg-brand-green-dark text-white font-mono uppercase tracking-wider text-xs font-bold rounded-md py-4 hover:bg-brand-green-dark/95 active:scale-95 transition-all shadow-3xs flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>Masuk ke Akun Anda</span>
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-brand-green-dark/15"></div>
          </div>
          <div className="relative flex justify-center text-[9px] font-mono font-semibold tracking-wider text-brand-green-light uppercase">
            <span className="bg-brand-bg px-4">LALUAN ALTERNATIF</span>
          </div>
        </div>

        {/* Google Authentication */}
        <button 
          onClick={() => onLogin('81234567890')}
          className="w-full bg-white border border-brand-green-dark/15 text-brand-green-dark font-mono uppercase tracking-wider text-[10px] font-bold rounded-md py-3.5 hover:bg-stone-50 active:scale-95 transition-all shadow-3xs flex items-center justify-center space-x-2.5 cursor-pointer"
        >
          <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          <span>Otorisasi dengan Google</span>
        </button>

        {/* Footer */}
        <div className="mt-10 text-center space-y-5">
          <p className="text-xs text-[#55605C] font-semibold">
            Belum terdaftar sebagai pedagang?{' '}
            <button 
              onClick={onGoToRegister}
              className="text-brand-orange font-bold hover:underline cursor-pointer ml-1 block mt-1 sm:inline sm:mt-0"
            >
              Registrasi Akun Baru
            </button>
          </p>

          <button 
            type="button"
            className="inline-flex items-center justify-center space-x-1.5 text-[9px] font-mono font-bold tracking-widest text-[#55605C] hover:text-brand-green-dark transition-colors py-1.5 px-3.5 rounded-md border border-brand-green-dark/15 hover:bg-stone-50 cursor-pointer uppercase"
          >
            <HelpCircle className="w-3.5 h-3.5 text-brand-orange" />
            <span>Butuh Bantuan?</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
