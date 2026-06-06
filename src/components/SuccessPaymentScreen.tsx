import React from 'react';
import { motion } from 'motion/react';
import { X, Check } from 'lucide-react';

interface SuccessPaymentScreenProps {
  orderId: string;
  merchant: string;
  totalPayment: number;
  paymentMethod: string;
  onGoToDetails: () => void;
  onGoToHome: () => void;
}

export default function SuccessPaymentScreen({
  orderId,
  merchant,
  totalPayment,
  paymentMethod,
  onGoToDetails,
  onGoToHome
}: SuccessPaymentScreenProps) {
  const transactionTime = new Date().toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) + ' WIB';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.02 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      className="flex flex-col h-full bg-brand-bg relative overflow-hidden text-[#1C201E]"
    >
      {/* Top Header Bar */}
      <header className="bg-brand-bg border-b-2 border-brand-green-dark/15 flex items-center justify-between px-4 h-14 z-10 w-full shrink-0">
        <button 
          onClick={onGoToHome}
          className="text-brand-green-dark hover:bg-stone-100 transition-colors p-2 rounded-md flex items-center justify-center active:scale-95 duration-200"
        >
          <X className="w-5 h-5" />
        </button>
        <span className="font-serif font-bold text-brand-green-dark text-base">TumbasNa</span>
        <div className="w-9 h-9" /> {/* Spacer */}
      </header>

      {/* Main Success Content */}
      <div className="p-5 flex flex-col items-center flex-1 overflow-y-auto max-w-sm mx-auto w-full text-center space-y-6 pt-10">
        
        {/* Checkmark circle */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-brand-orange/10 animate-[ping_2s_infinite] scale-125" />
          <div className="w-16 h-16 bg-white border border-brand-green-dark/20 rounded-full shadow-3xs flex items-center justify-center text-brand-orange z-10 relative">
            <div className="w-11 h-11 bg-brand-green-dark rounded-full flex items-center justify-center text-white">
              <Check className="w-6 h-6 stroke-[2.5]" />
            </div>
          </div>
        </div>

        {/* Narrative titles */}
        <div className="space-y-2">
          <h2 className="text-lg font-serif font-bold text-brand-green-dark">Transaksi Berhasil</h2>
          <p className="text-xs text-brand-green-light font-sans leading-relaxed max-w-[280px] mx-auto font-medium">
            Terima kasih! Dana deposit Anda telah ditransfer ke sistem penampungan agrikultur terpercaya.
          </p>
        </div>

        {/* Receipt table block */}
        <div className="w-full bg-white rounded-md border border-brand-green-dark/15 p-5 shadow-3xs overflow-hidden text-left">
          <span className="text-[9px] font-mono font-bold tracking-widest text-[#E38144] block mb-3 uppercase">FAKTUR RESMI</span>
          <table className="w-full text-xs border-collapse font-sans font-semibold">
            <tbody>
              
              {/* Order ID */}
              <tr className="border-b border-brand-green-dark/10">
                <td className="py-2.5 text-brand-green-light font-medium">No. Referensi</td>
                <td className="py-2.5 text-right font-mono font-bold text-brand-green-dark">{orderId}</td>
              </tr>

              {/* Merchant name */}
              <tr className="border-b border-brand-green-dark/10">
                <td className="py-2.5 text-brand-green-light font-medium">Mitra Kelompok Tani</td>
                <td className="py-2.5 text-right font-serif font-bold text-brand-green-dark">{merchant}</td>
              </tr>

              {/* Amount */}
              <tr className="border-b border-brand-green-dark/10">
                <td className="py-2.5 text-brand-green-light font-medium">Total Nominal</td>
                <td className="py-2.5 text-right font-mono font-bold text-brand-orange">
                  Rp {totalPayment.toLocaleString('id-ID')}
                </td>
              </tr>

              {/* Method */}
              <tr className="border-b border-brand-green-dark/10">
                <td className="py-2.5 text-brand-green-light font-medium">Jalur Transfer</td>
                <td className="py-2.5 text-right font-mono font-bold text-brand-green-dark">{paymentMethod} (AgriPay)</td>
              </tr>

              {/* Time */}
              <tr className="border-b border-brand-green-dark/5">
                <td className="py-2.5 text-brand-green-light font-medium">Selesai Pada</td>
                <td className="py-2.5 text-right font-mono font-bold text-brand-green-dark text-[11px]">{transactionTime}</td>
              </tr>

            </tbody>
          </table>
        </div>

      </div>

      {/* Floating Bottom Sticky Bar Buttons */}
      <div className="bg-white border-t-2 border-brand-green-dark/15 px-5 py-4 space-y-2.5 shrink-0 shadow-md">
        <button
          onClick={onGoToDetails}
          className="w-full bg-brand-green-dark hover:bg-brand-green-dark/95 text-white font-mono uppercase tracking-wider text-xs font-bold rounded-md py-4 cursor-pointer block"
        >
          Lacak Pengiriman Kelompok Tani
        </button>

        <button
          onClick={onGoToHome}
          className="w-full bg-stone-50 hover:bg-stone-100 text-brand-green-dark border border-brand-green-dark/10 font-mono uppercase tracking-wider text-[10px] font-bold rounded-md py-3 transition-colors cursor-pointer block"
        >
          Kembali ke Katalog
        </button>
      </div>

    </motion.div>
  );
}
