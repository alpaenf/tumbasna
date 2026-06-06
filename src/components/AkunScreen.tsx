import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, Edit3, Star, CreditCard, Phone, MapPin, 
  Tag, ChevronRight, HelpCircle, LogOut, History, Users, ArrowUpRight, Plus, Sparkles 
} from 'lucide-react';
import logoImg from '../image/logo.png';

interface AkunScreenProps {
  user: {
    businessName: string;
    ownerName: string;
    phone: string;
    email: string;
    address: string;
    category: string;
    balance: number;
  };
  onTopUp: () => void;
  onLogOut: () => void;
}

export default function AkunScreen({ user, onTopUp, onLogOut }: AkunScreenProps) {
  const [showTopUpToast, setShowTopUpToast] = useState(false);

  const handleTopUpClick = () => {
    onTopUp();
    setShowTopUpToast(true);
    setTimeout(() => setShowTopUpToast(false), 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full pb-24 bg-[#FAF9F6] overflow-y-auto"
    >
      {/* Top Header Bar */}
      <header className="sticky top-0 bg-[#FAF9F6]/90 backdrop-blur-md px-5 py-3.5 flex items-center justify-between z-10 border-b border-stone-100">
        <img 
          alt="TumbasNa Logo" 
          src={logoImg}
          className="h-7 object-contain mix-blend-multiply"
          referrerPolicy="no-referrer"
        />
        <button className="relative w-10 h-10 bg-white border border-stone-100 rounded-full flex items-center justify-center text-stone-700 shadow-sm transition-transform active:scale-95">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full" />
        </button>
      </header>

      {/* Profile Header Details block */}
      <div className="p-5 space-y-5 text-left">
        
        {/* Profile Card plate */}
        <div className="bg-white rounded-[24px] border border-stone-100 p-5 shadow-[0_4px_16px_rgba(31,56,38,0.02)] relative flex items-center space-x-4">
          <div className="relative shrink-0 w-[72px] h-[72px] rounded-full border border-stone-100 bg-stone-50 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=150" 
              alt="Avatar Profile edit" 
              className="w-full h-full object-cover"
            />
            {/* Penciled edit indicator circle layout */}
            <button className="absolute bottom-0 right-0 w-6 h-6 bg-stone-900 border-2 border-white rounded-full flex items-center justify-center text-white transition-transform active:scale-90">
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-extrabold text-stone-800 text-base truncate leading-none">
                {user.businessName}
              </h3>
              {/* UMKM badge label */}
              <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0">
                UMKM
              </span>
            </div>
            
            <p className="text-xs text-stone-400 font-bold">{user.ownerName}</p>
            
            <div className="flex items-center space-x-1 text-slate-500">
              <Star className="w-4 h-4 fill-amber-400 stroke-amber-400 shrink-0" />
              <span className="text-xs font-bold text-stone-800">4.8</span>
              <span className="text-[10px] text-stone-400 font-bold">(124 Ulasan)</span>
            </div>
          </div>
        </div>

        {/* Dual dynamic Balance / Income status cards */}
        <div className="grid grid-cols-2 gap-4">
          {/* Card 1: Saldo Aktif */}
          <div className="bg-brand-green-dark text-white rounded-2xl p-4.5 shadow-sm space-y-2 flex flex-col justify-between">
            <div className="flex items-center space-x-1.5 text-emerald-300">
              <CreditCard className="w-4 h-4" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Saldo Aktif</span>
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-extrabold text-white">
                Rp {user.balance.toLocaleString('id-ID')}
              </p>
              <p className="text-[9px] text-emerald-300/80 font-bold uppercase tracking-wider">AgriPay balance</p>
            </div>
          </div>

          {/* Card 2: Growths */}
          <div className="bg-emerald-100 text-emerald-950 rounded-2xl p-4.5 shadow-sm space-y-2 flex flex-col justify-between border border-emerald-200">
            <div className="flex items-center space-x-1.5 text-emerald-800">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="text-[11px] font-semibold uppercase tracking-wider">Omset Bulan Ini</span>
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-black text-emerald-950">Rp 12.8M</p>
              <p className="text-[9.5px] text-emerald-700 font-semibold flex items-center space-x-0.5 leading-none">
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600 inline" />
                <span>+15% dari bulan lalu</span>
              </p>
            </div>
          </div>
        </div>

        {/* Informasi Bisnis Section list */}
        <div className="space-y-3">
          <h4 className="font-extrabold text-stone-800 text-sm pl-1">Informasi Bisnis</h4>

          <div className="bg-white rounded-2xl border border-stone-100 p-4 shadow-[0_2px_12px_rgba(0,0,0,0.01)] space-y-4">
            
            {/* Phone information row */}
            <div className="flex items-center justify-between group">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-stone-500 shrink-0">
                  <Phone className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[9px] text-stone-400 font-semibold block uppercase tracking-wider">Nomor Telepon</span>
                  <p className="text-xs font-bold text-stone-700">{user.phone}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-300" />
            </div>

            {/* Address information row */}
            <div className="flex items-center justify-between group">
              <div className="flex items-center space-x-4 flex-1 min-w-0 pr-4">
                <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-stone-500 shrink-0">
                  <MapPin className="w-4.5 h-4.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] text-stone-400 font-semibold block uppercase tracking-wider">Alamat Usaha</span>
                  <p className="text-xs font-extrabold text-stone-700 truncate">{user.address}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-300" />
            </div>

            {/* Category information row */}
            <div className="flex items-center justify-between group">
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-stone-500 shrink-0">
                  <Tag className="w-4.5 h-4.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] text-stone-400 font-semibold block uppercase tracking-wider">Kategori Produk Utama</span>
                  <p className="text-xs font-bold text-stone-700 truncate">{user.category}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-300" />
            </div>

          </div>
        </div>

        {/* Bank accounts list banner */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pr-1">
            <h4 className="font-extrabold text-stone-800 text-sm">Rekening Bank</h4>
            <button className="text-xs font-bold text-emerald-700 hover:underline flex items-center space-x-1 transition-all">
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah</span>
            </button>
          </div>

          <div className="space-y-3 font-sans">
            {/* BRI Main account */}
            <div className="bg-white rounded-2xl border border-stone-100 p-4 shadow-[0_2px_12px_rgba(0,0,0,0.01)] relative overflow-hidden flex items-center justify-between">
              {/* UTAMA stamp label */}
              <div className="absolute right-0 top-0 bg-emerald-50 text-emerald-700 text-[8px] font-black px-2.5 py-1 rounded-bl-xl border-l border-b border-emerald-100 uppercase tracking-widest leading-none shrink-0">
                UTAMA
              </div>

              <div className="flex items-center space-x-3.5 text-left">
                <div className="px-3.5 py-2.5 bg-sky-50 border border-sky-100 rounded-xl flex items-center justify-center font-bold text-sky-800 select-none text-[11px] font-sans italic tracking-tight uppercase shrink-0">
                  BRI
                </div>
                <div>
                  <h5 className="text-xs font-bold text-stone-800 leading-none">Bank Rakyat Indonesia</h5>
                  <p className="text-[10px] text-stone-400 font-bold tracking-widest mt-1.5">**** **** 1234</p>
                </div>
              </div>
            </div>

            {/* BCA item Card */}
            <div className="bg-white rounded-2xl border border-stone-100 p-4 shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex items-center justify-between">
              <div className="flex items-center space-x-3.5 text-left">
                <div className="px-3.5 py-2.5 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center font-bold text-blue-800 select-none text-[11px] font-sans italic tracking-tight uppercase shrink-0">
                  BCA
                </div>
                <div>
                  <h5 className="text-xs font-bold text-stone-800 leading-none">Bank Central Asia</h5>
                  <p className="text-[10px] text-stone-400 font-bold tracking-widest mt-1.5">**** **** 5678</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Up Saldo action Button trigger */}
        <button
          onClick={handleTopUpClick}
          className="w-full bg-brand-orange hover:bg-amber-600 text-white font-extrabold text-sm rounded-xl py-4 shadow-md active:scale-95 transition-all text-center cursor-pointer block"
        >
          Top Up Saldo
        </button>

        {/* Pengaturan Lainnya */}
        <div className="space-y-3">
          <h4 className="font-extrabold text-stone-800 text-sm pl-1">Pengaturan Lainnya</h4>

          <div className="bg-white rounded-2xl border border-stone-100 shadow-[0_2px_12px_rgba(0,0,0,0.01)] overflow-hidden divide-y divide-stone-50 font-sans">
            
            {/* Riwayat Transaksi */}
            <button className="w-full px-4.5 py-3.5 hover:bg-stone-50 flex items-center justify-between transition-colors text-left font-sans">
              <div className="flex items-center space-x-3.5 text-stone-700">
                <History className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                <span className="text-xs font-bold">Riwayat Transaksi</span>
              </div>
              <ChevronRight className="w-4.5 h-4.5 text-stone-300" />
            </button>

            {/* Daftar Supplier */}
            <button className="w-full px-4.5 py-3.5 hover:bg-stone-50 flex items-center justify-between transition-colors text-left font-sans">
              <div className="flex items-center space-x-3.5 text-stone-700">
                <Users className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                <span className="text-xs font-bold">Daftar Supplier Langganan</span>
              </div>
              <ChevronRight className="w-4.5 h-4.5 text-stone-300" />
            </button>

            {/* Help desk */}
            <button className="w-full px-4.5 py-3.5 hover:bg-stone-50 flex items-center justify-between transition-colors text-left font-sans">
              <div className="flex items-center space-x-3.5 text-stone-700">
                <HelpCircle className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                <span className="text-xs font-bold">Pusat Bantuan</span>
              </div>
              <ChevronRight className="w-4.5 h-4.5 text-stone-300" />
            </button>

            {/* Keluar akun */}
            <button 
              onClick={onLogOut}
              className="w-full px-4.5 py-4 hover:bg-rose-50 flex items-center justify-between transition-colors text-left group font-sans"
            >
              <div className="flex items-center space-x-3.5 text-rose-600 font-sans font-bold text-xs">
                <LogOut className="w-4.5 h-4.5 text-rose-500 shrink-0 transition-transform group-hover:translate-x-0.5" />
                <span className="text-xs font-bold">Keluar Akun</span>
              </div>
              <ChevronRight className="w-4.5 h-4.5 text-stone-300" />
            </button>

          </div>
        </div>

      </div>

      {/* AgriPay Balance TopUp alert toast feedback */}
      <AnimatePresence>
        {showTopUpToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 inset-x-5 max-w-sm mx-auto bg-stone-900 border border-stone-800 text-white rounded-xl p-3.5 shadow-xl flex items-center space-x-3 z-50 justify-between font-bold"
          >
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4.5 h-4.5 text-emerald-400 shrink-0 animate-pulse" />
              <span className="text-xs font-semibold">Berhasil TopUp +Rp 500.000 ke Saldo AgriPay Anda!</span>
            </div>
            <button onClick={() => setShowTopUpToast(false)} className="text-xs text-stone-400 hover:text-white">OK</button>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
