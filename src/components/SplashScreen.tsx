import React from 'react';
import { motion } from 'motion/react';
import { Sprout, ShieldCheck, TrendingUp, ChevronRight, Leaf } from 'lucide-react';
import logoImg from '../image/logo.png';

interface SplashScreenProps {
  onContinue: () => void;
  onEnterAdmin?: () => void;
}

export default function SplashScreen({ onContinue, onEnterAdmin }: SplashScreenProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex flex-col justify-between h-full pb-10 pt-16 px-6 overflow-hidden bg-gradient-to-b from-[#FAF8F5] to-[#F1EFE9] text-[#1C201E]"
    >
      {/* Structural Ambient Background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green-light/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-40 h-40 bg-brand-orange/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Section: Branding & Identity */}
      <div className="flex flex-col items-center text-center z-10 space-y-5">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white px-6 py-3 rounded-lg border border-stone-200/50 shadow-3xs flex items-center justify-center max-w-[280px]"
        >
          <img 
            alt="TumbasNa Logo" 
            src={logoImg} 
            className="h-10 object-contain"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        <div className="space-y-1">
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.1 }}
            className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-[#5F6A64]"
          >
            Sistem Kolaborasi Niaga Agropolitan
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="h-0.5 w-12 bg-brand-orange mx-auto my-2 rounded-full"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xs font-serif italic text-brand-green-dark"
          >
            "Menghubungkan langsung hasil bumi berkualitas dengan pelaku UMKM"
          </motion.p>
        </div>
      </div>

      {/* Middle Section: Elegant Professional Value Propositions */}
      <div className="w-full max-w-sm px-2 z-10 space-y-4">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.35 }}
          className="text-center font-mono text-[9px] font-bold uppercase tracking-widest text-[#5F6A64]"
        >
          Keuntungan Ekosistem TumbasNa
        </motion.p>

        <div className="space-y-3">
          {/* Pillar 1 */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-md border border-stone-200/60 p-3.5 flex items-start space-x-3.5 shadow-3xs hover:border-brand-green-light/30 transition-all"
          >
            <div className="w-9 h-9 rounded bg-[#EFF6F0] flex items-center justify-center border border-brand-green-light/10 text-brand-green-dark shrink-0">
              <Sprout className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div className="text-left space-y-0.5">
              <h4 className="text-xs font-sans font-bold text-brand-green-dark">Langsung Dari Petani</h4>
              <p className="text-[10.5px] text-stone-500 leading-normal">
                Memangkas rantai distribusi demi harga adil bagi petani lokal & pengadaan hemat bagi UMKM.
              </p>
            </div>
          </motion.div>

          {/* Pillar 2 */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-md border border-stone-200/60 p-3.5 flex items-start space-x-3.5 shadow-3xs hover:border-brand-green-light/30 transition-all"
          >
            <div className="w-9 h-9 rounded bg-[#FDF6F0] flex items-center justify-center border border-brand-orange/10 text-brand-orange shrink-0">
              <ShieldCheck className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div className="text-left space-y-0.5">
              <h4 className="text-xs font-sans font-bold text-brand-green-dark font-sans">Transaksi Aman & Transparan</h4>
              <p className="text-[10.5px] text-stone-500 leading-normal">
                Terproteksi oleh sistem pembayaran bersama terverifikasi di setiap pemesanan hasil bumi.
              </p>
            </div>
          </motion.div>

          {/* Pillar 3 */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-md border border-stone-200/60 p-3.5 flex items-start space-x-3.5 shadow-3xs hover:border-brand-green-light/30 transition-all"
          >
            <div className="w-9 h-9 rounded bg-[#EEF2F6] flex items-center justify-center border-blue-100 text-blue-600 shrink-0">
              <TrendingUp className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div className="text-left space-y-0.5">
              <h4 className="text-xs font-sans font-bold text-brand-green-dark">Kemandirian Agribisnis</h4>
              <p className="text-[10.5px] text-stone-500 leading-normal">
                Membantu pertumbuhan usaha melalui kepastian pasokan bahan baku segar berskala konsisten.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Action Area */}
      <div className="flex flex-col items-center space-y-3 z-10 w-full">
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          onClick={onContinue}
          className="w-full max-w-sm bg-brand-green-dark text-white rounded-md pr-5 pl-6 py-3.5 flex items-center justify-between border-b-4 border-brand-green-dark hover:-translate-y-0.5 active:translate-y-0.5 transition-all shadow-[0_4px_12px_rgba(33,53,43,0.15)] font-sans font-bold text-xs uppercase tracking-wider group cursor-pointer"
        >
          <span>Masuk ke Marketplace</span>
          <div className="flex items-center space-x-1">
            <span className="text-[10px] opacity-75 font-mono lowercase">tumbasna</span>
            <ChevronRight className="w-4.5 h-4.5 transition-transform group-hover:translate-x-1" />
          </div>
        </motion.button>

        {onEnterAdmin && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            onClick={onEnterAdmin}
            className="w-full max-w-sm bg-brand-green-dark/10 hover:bg-brand-green-dark/20 text-brand-green-dark rounded-md py-3 font-sans font-bold text-xs uppercase tracking-wider transition-all border border-brand-green-dark/20 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>Masuk Sebagai Admin HQ</span>
          </motion.button>
        )}

        {/* Footer Pill Status Badge */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center space-x-2 bg-stone-200/40 text-brand-green-dark text-[9px] font-mono tracking-widest uppercase px-4 py-1.5 rounded-full border border-stone-200/50"
        >
          <Leaf className="w-3.5 h-3.5 text-brand-green-light animate-spin-slow shrink-0" />
          <span>PRODUK PETANI MITRA TERFERIFIKASI • V2.2</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

