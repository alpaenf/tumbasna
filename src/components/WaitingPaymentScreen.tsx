import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, HelpCircle, Hourglass, Clock, Download, CheckSquare, Copy, Clipboard } from 'lucide-react';
import logoImg from '../image/logo.png';

interface WaitingPaymentScreenProps {
  orderId: string;
  totalPayment: number;
  merchant: string;
  onVerifySuccess: () => void;
  onCancelOrder: () => void;
  onBack: () => void;
}

export default function WaitingPaymentScreen({
  orderId,
  totalPayment,
  merchant,
  onVerifySuccess,
  onCancelOrder,
  onBack
}: WaitingPaymentScreenProps) {
  const [timeLeft, setTimeLeft] = useState(887); // 14:47 is 887 seconds
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const copyId = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="flex flex-col h-full bg-brand-bg pb-12 overflow-y-auto text-[#1C201E]"
    >
      {/* Top Header Bar */}
      <header className="sticky top-0 bg-brand-bg border-b-2 border-brand-green-dark/15 flex items-center justify-between px-4 h-14 z-10">
        <button 
          onClick={onBack}
          className="text-brand-green-dark hover:bg-stone-100 transition-colors p-2 rounded-md flex items-center justify-center active:scale-95 duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <img 
          alt="TumbasNa Logo" 
          src={logoImg}
          className="h-7 object-contain mix-blend-multiply"
          referrerPolicy="no-referrer"
        />
        <button className="text-brand-green-dark hover:bg-stone-100 p-2 rounded-md flex items-center justify-center">
          <HelpCircle className="w-5 h-5" />
        </button>
      </header>

      {/* Main waiting content block */}
      <div className="p-5 flex flex-col items-center flex-1 space-y-6 max-w-sm mx-auto w-full">
        
        {/* Hourglass container */}
        <div className="w-14 h-14 bg-white border border-brand-green-dark/20 rounded flex items-center justify-center text-brand-orange shadow-3xs">
          <Hourglass className="w-6 h-6 animate-spin duration-[4000ms]" />
        </div>

        {/* Title narrative */}
        <div className="text-center space-y-2">
          <h2 className="text-base font-serif font-bold text-brand-green-dark">Menunggu Pembayaran</h2>
          <p className="text-xs text-brand-green-light max-w-[280px] mx-auto leading-relaxed font-sans font-medium">
            Selesaikan pembayaran sebelum waktu habis. Setelah sukses, dana akan disimpan aman di sistem kliring TumbasNa.
          </p>
        </div>

        {/* Real Countdown timer badge */}
        <div className="bg-rose-50 border border-rose-300 text-rose-800 px-4.5 py-1.5 rounded flex items-center space-x-2 text-xs font-mono font-bold shadow-3xs">
          <Clock className="w-4 h-4 text-rose-600 animate-[pulse_1.5s_infinite]" />
          <span>{formatTime(timeLeft)}</span>
        </div>

        {/* QRIS interactive Card block */}
        <div className="bg-white rounded-md border border-brand-green-dark/15 p-5 shadow-3xs text-center w-full space-y-4">
          <span className="text-xs font-serif font-bold text-brand-green-dark tracking-wide block">GERBANG QRIS TERINTEGRASI</span>
          
          {/* Fake QR code glowing container */}
          <div className="relative aspect-square max-w-[180px] mx-auto bg-white rounded-md p-3 border-2 border-brand-green-dark overflow-hidden flex items-center justify-center">
            {/* Ambient scanning light */}
            <div className="absolute top-0 inset-x-0 h-1 bg-brand-orange opacity-40 rounded-full shadow-[0_0_8px_#E38144] animate-[bounce_3s_infinite]" />
            <img 
              src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=TUMBASNA-PAYMENT-QRIS" 
              alt="QRIS QR Code" 
              className="w-full h-full object-contain filter invert-0 contrast-125"
            />
          </div>

          <p className="text-[10px] text-brand-green-light font-sans font-medium leading-normal max-w-[240px] mx-auto">
            Scan QR code ini memakai aplikasi e-wallet (Gopay/OVO) maupun mobile banking andalan Anda.
          </p>

          <button 
            type="button"
            className="inline-flex items-center space-x-1.5 text-[10px] font-mono uppercase tracking-wider text-brand-orange hover:underline justify-center font-bold"
          >
            <Download className="w-4 h-4" />
            <span>Unduh QR Code</span>
          </button>
        </div>

        {/* Detail Pesanan block */}
        <div className="bg-white rounded-md border border-brand-green-dark/15 p-4.5 shadow-3xs text-left w-full space-y-3 font-semibold text-xs text-[#1C201E]">
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#E38144] block">SPESIFIKASI TAGIHAN</span>
          
          <div className="flex justify-between items-center py-1">
            <span className="text-brand-green-light font-medium">No. Referensi</span>
            <button 
              onClick={copyId}
              className="flex items-center space-x-1 hover:text-brand-orange transition-colors"
            >
              <span className="font-mono font-bold text-brand-green-dark text-[11px]">{orderId}</span>
              {copied ? <span className="text-[9px] text-emerald-600">Disalin</span> : <Copy className="w-3.5 h-3.5 text-brand-green-light" />}
            </button>
          </div>

          <div className="flex justify-between items-center py-1 border-t border-brand-green-dark/10">
            <span className="text-brand-green-light font-medium">Mitra Kelompok Tani</span>
            <span className="font-serif font-bold text-brand-green-dark">{merchant}</span>
          </div>

          <div className="flex justify-between items-center py-1 border-t border-brand-green-dark/10">
            <span className="text-brand-green-light font-medium">Deposit Pembeli</span>
            <span className="font-mono font-bold text-brand-green-dark">Rp 1.250.000</span>
          </div>

          <div className="flex justify-between items-center pt-2.5 border-t border-brand-green-dark/15 text-sm font-bold text-brand-green-dark">
            <span className="font-serif">Total Pembayaran</span>
            <span className="text-brand-orange font-mono">Rp {totalPayment.toLocaleString('id-ID')}</span>
          </div>
        </div>

        {/* Actions button group */}
        <div className="w-full space-y-3 pt-2">
          <button
            onClick={onVerifySuccess}
            className="w-full bg-brand-green-dark hover:bg-brand-green-dark/95 text-white font-mono uppercase tracking-wider text-xs font-bold rounded-md py-4 shadow-3xs cursor-pointer block"
          >
            Cek Status Pembayaran
          </button>
          
          <button
            onClick={onCancelOrder}
            className="w-full bg-stone-50 hover:bg-stone-100 text-brand-green-dark border border-brand-green-dark/10 font-mono uppercase tracking-wider text-[10px] font-bold rounded-md py-3.5 cursor-pointer block"
          >
            Batalkan Transaksi
          </button>
        </div>

      </div>

    </motion.div>
  );
}
