import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, HelpCircle, MapPin, Truck, ShieldCheck, CheckCircle2, ChevronRight, X, Sparkles, Sprout, Calendar, Shield } from 'lucide-react';
import { Order } from '../types';

interface DetailPesananScreenProps {
  order: Order;
  onConfirmReceived: (orderId: string) => void;
  onBack: () => void;
}

export default function DetailPesananScreen({
  order,
  onConfirmReceived,
  onBack
}: DetailPesananScreenProps) {
  const [showTraceModal, setShowTraceModal] = useState(false);

  const getStatusBadgeStyles = (status: Order['status']) => {
    switch (status) {
      case 'Menunggu Pembayaran':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Sedang Dikirim':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Selesai':
        return 'bg-slate-50 text-slate-700 border-slate-100';
      case 'Dibatalkan':
        return 'bg-rose-50 text-rose-700 border-rose-100';
    }
  };

  const getSupplyChainInfo = () => {
    return order.supplyChainInfo || {
      harvestLocation: 'Desa Agro Lestari, Cianjur',
      harvestDate: '02 Mei 2026',
      plantingDate: '10 Jan 2026',
      pesticideInfo: 'Minim Pestisida Kimia',
      fertilizerInfo: 'Pupuk Kandang & Kompos Terverifikasi'
    };
  };

  const scInfo = getSupplyChainInfo();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col h-full bg-brand-bg relative overflow-hidden text-[#1C201E]"
    >
      {/* Top app bar */}
      <header className="bg-brand-bg border-b-2 border-brand-green-dark/15 flex items-center justify-between px-4 h-14 z-10 shrink-0">
        <div className="flex items-center space-x-1">
          <button 
            onClick={onBack}
            className="text-brand-green-dark hover:bg-stone-100 transition-colors p-2 rounded-md flex items-center justify-center active:scale-95 duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
        <h1 className="font-serif font-bold text-center flex-1 mr-4 text-brand-green-dark text-base">Lacak Pengiriman</h1>
        <button className="text-brand-green-dark hover:bg-stone-100 p-2 rounded-md flex items-center justify-center">
          <HelpCircle className="w-5 h-5" />
        </button>
      </header>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* Core ID & status segment */}
        <div className="bg-white rounded-md border border-brand-green-dark/15 p-4 shadow-3xs space-y-4 text-left">
          <div className="flex justify-between items-center">
            <div className="space-y-0.5">
              <span className="text-[9px] font-mono tracking-wider text-brand-green-light font-bold uppercase block">ID PESANAN</span>
              <p className="font-mono font-bold text-brand-green-dark text-sm">{order.id}</p>
            </div>
            
            <span className={`px-2.5 py-1 text-[9px] font-mono font-bold tracking-wider rounded border uppercase flex items-center space-x-1.5 ${getStatusBadgeStyles(order.status)}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
              <span>{order.status === 'Sedang Dikirim' ? 'DIKIRIM' : order.status === 'Menunggu Pembayaran' ? 'BELUM BAYAR' : order.status === 'Selesai' ? 'SELESAI' : 'BATAL'}</span>
            </span>
          </div>

          {/* Product card inside details */}
          <div className="pt-3 border-t border-brand-green-dark/10 space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex space-x-3 items-center">
                <div className="w-14 h-14 bg-stone-50 rounded-md overflow-hidden shrink-0 border border-brand-green-dark/10">
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-serif font-bold text-brand-green-dark truncate leading-tight">{item.product.name}</h4>
                  <p className="text-[10px] text-brand-green-light font-semibold mt-0.5">Petani Mitra: {order.merchant}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[9px] font-mono tracking-wide text-brand-green-light font-bold bg-brand-bg px-2 py-0.5 rounded border border-brand-green-dark/5">
                      {item.product.unit} x {item.quantity}
                    </span>
                    <span className="text-xs font-mono font-bold text-brand-orange">
                      Rp {(item.product.price * item.quantity).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mock Map Route Tracker Satellite view */}
        {order.status === 'Sedang Dikirim' && (
          <div className="relative rounded-md overflow-hidden shadow-3xs bg-stone-900 border border-brand-green-dark/15 aspect-[16/10] flex flex-col justify-end">
            {/* Ambient Map pattern styling */}
            <div className="absolute inset-0 bg-cover bg-center opacity-70 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=600')]" />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 to-transparent" />

            {/* Simulated Satellite green fields overlay paths */}
            <svg className="absolute inset-0 w-full h-full stroke-brand-orange/60 stroke-dashed fill-none pointer-events-none" viewBox="0 0 400 200">
              <path d="M 50,150 Q 150,50 250,110 T 350,70" strokeWidth="2.5" strokeDasharray="6,4" />
            </svg>

            {/* Pins */}
            <div className="absolute left-[12%] top-[65%] -translate-y-1/2 flex flex-col items-center">
              <div className="bg-brand-green-dark text-white rounded px-2 py-0.5 text-[8px] font-mono tracking-wider font-bold mb-1 uppercase">
                LAHAN PENJUAL
              </div>
              <div className="w-8 h-8 rounded-full bg-brand-green-dark border-2 border-white shadow flex items-center justify-center text-white">
                <Truck className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="absolute left-[62%] top-[35%] -translate-y-1/2 flex flex-col items-center z-10 animate-bounce duration-[2000ms]">
              <div className="bg-brand-orange text-white rounded px-2 py-1 text-[8px] font-mono tracking-wider font-bold mb-1 uppercase flex items-center space-x-1 leading-none">
                <span className="w-1 h-1 rounded-full bg-white animate-ping" />
                <span>RUMAH ANDA</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-brand-orange border-2 border-white shadow flex items-center justify-center text-white">
                <MapPin className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Estimated Delivery details floating plate */}
            <div className="absolute bottom-3 inset-x-3 bg-white border border-brand-green-dark/15 rounded p-3 flex justify-between items-center z-20 shadow-3xs">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 bg-[#FAF7F2] border border-brand-green-dark/10 rounded flex items-center justify-center text-brand-green-dark shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 text-left">
                  <span className="text-[9px] font-mono text-brand-green-light font-bold block uppercase tracking-wider">ESTIMASI TIBA</span>
                  <span className="text-xs font-serif font-bold text-brand-green-dark leading-none">Hari ini, 14:00 - 16:00</span>
                </div>
              </div>
              <div className="text-right text-xs">
                <span className="text-[9px] font-mono text-brand-green-light font-bold block uppercase tracking-wider">KURIR MITRA</span>
                <span className="font-serif font-bold text-brand-green-dark">Sutrisno Budiman</span>
              </div>
            </div>
          </div>
        )}

        {/* Status Pengiriman Timeline Segment */}
        <div className="bg-white rounded-md border border-brand-green-dark/15 p-4 shadow-3xs space-y-4 text-left">
          <h3 className="font-serif font-bold text-brand-green-dark text-sm">Alur Pengiriman</h3>
          
          <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-brand-green-dark/10">
            
            {/* Step 1: Pesanan Diterima */}
            <div className={`relative ${order.status !== 'Selesai' ? 'opacity-40' : ''}`}>
              <span className={`absolute -left-6 top-1.5 w-2.5 h-2.5 rounded-full ring-4 ring-white z-10 bg-brand-green-light/40`} />
              <div className="space-y-1">
                <h4 className="text-xs font-serif font-bold text-brand-green-dark">Pesanan Sampai & Diterima</h4>
                <p className="text-[11px] text-stone-500 leading-normal">
                  Konfirmasi penerimaan untuk menyelesaikan transaksi & pencairan dana mitra.
                </p>
              </div>
            </div>

            {/* Step 2: Pesanan Dalam Pengiriman */}
            <div className={`relative ${order.status !== 'Sedang Dikirim' && order.status !== 'Selesai' ? 'opacity-30' : ''}`}>
              <span className={`absolute -left-7.5 top-0.5 w-5 h-5 rounded-md ring-4 ring-white z-10 flex items-center justify-center bg-brand-green-dark text-white`}>
                <Truck className="w-3 h-3 text-white" />
              </span>
              <div className="space-y-1">
                <h4 className="text-xs font-serif font-bold text-brand-green-dark">Komoditas Dalam Perjalanan</h4>
                <p className="text-[11px] text-stone-500 leading-normal">
                  Kurir sedang melakukan pengantaran jalan lingkar desa menuju alamat Anda.
                </p>
                <p className="text-[9px] font-mono font-bold text-brand-orange">12 Oktober, 10:30 WIB</p>
              </div>
            </div>

            {/* Step 3: Konfirmasi Penjual */}
            <div className="relative">
              <span className="absolute -left-6 top-1.5 w-2.5 h-2.5 rounded-full ring-4 ring-white z-10 bg-emerald-600/60" />
              <div className="space-y-1">
                <h4 className="text-xs font-serif font-bold text-brand-green-dark">Konfirmasi Mitra Kelompok Tani</h4>
                <p className="text-[11px] text-stone-500 leading-normal">
                  Penjual telah mengonfirmasi pasokan, memacking dengan aman, bersiap kirim.
                </p>
                <p className="text-[9px] font-mono font-medium text-[#C16A3E]">11 Oktober, 15:45 WIB</p>
              </div>
            </div>

            {/* Step 4: Pembayaran Berhasil */}
            <div className="relative">
              <span className="absolute -left-6 top-1.5 w-2.5 h-2.5 rounded-full ring-4 ring-white z-10 bg-emerald-600/60" />
              <div className="space-y-1">
                <h4 className="text-xs font-serif font-bold text-brand-green-dark">Pembayaran Terverifikasi</h4>
                <p className="text-[11px] text-stone-500 leading-normal">
                  Sistem pembayaran kliring TumbasNa berhasil memverifikasi jaminan pembukuan.
                </p>
                <p className="text-[9px] font-mono font-medium text-[#C16A3E]">11 Oktober, 15:40 WIB</p>
              </div>
            </div>

          </div>
        </div>

        {/* Jejak Rantai Pasok (Supply Chain Traceability Container) */}
        <div className="bg-white rounded-md border border-brand-green-dark/15 p-4 shadow-3xs space-y-3 text-left">
          <div className="flex items-center space-x-2 text-brand-green-dark font-serif font-bold text-sm">
            <ShieldCheck className="w-4.5 h-4.5 text-brand-orange shrink-0" />
            <span>Transparansi Rantai Pasok</span>
          </div>
          <p className="text-[11px] text-[#55605C] leading-relaxed font-sans">
            Komoditas ini lolos jaminan transparansi pasar: dipanen secara langsung oleh kelompok tani binaan lokal tanpa perantara broker komersial.
          </p>

          <div className="bg-stone-50 border border-brand-green-dark/10 rounded-md p-3.5 flex justify-between items-center">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 bg-brand-green-dark rounded flex items-center justify-center text-white shrink-0">
                <Sprout className="w-4 h-4 text-[#BFD7C1]" />
              </div>
              <div className="text-left space-y-0.5">
                <span className="text-[9px] font-mono text-brand-green-light font-bold block uppercase tracking-wider">LAHAN PANEN</span>
                <span className="text-xs font-serif font-bold text-brand-green-dark leading-none">{scInfo.harvestLocation}</span>
              </div>
            </div>
            <button 
              onClick={() => setShowTraceModal(true)}
              className="text-brand-orange hover:underline text-[10px] font-mono uppercase tracking-wider font-bold flex items-center shrink-0 cursor-pointer"
            >
              <span>Telusuri</span>
              <ChevronRight className="w-4 h-4 text-brand-orange ml-0.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Actions Bar */}
      {order.status === 'Sedang Dikirim' && (
        <div className="bg-white border-t-2 border-brand-green-dark/15 px-5 py-4 space-y-3 shrink-0 shadow-md text-center">
          <p className="text-[10px] text-brand-green-light font-semibold leading-normal font-sans">
            Kurir akan mengantarkan nota cetak. Konfirmasi jika fisik barang telah tiba di tangan Anda.
          </p>
          <button
            onClick={() => onConfirmReceived(order.id)}
            className="w-full bg-brand-orange hover:bg-brand-orange/95 text-white font-mono uppercase tracking-wider text-xs font-bold rounded-md py-4 shadow-sm text-center cursor-pointer block"
          >
            Konfirmasi Pesanan Selesai
          </button>
        </div>
      )}

      {/* Trace transparency detail Modal popup overlay */}
      <AnimatePresence>
        {showTraceModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-brand-bg rounded-md p-6 max-w-sm w-full border border-brand-green-dark/25 shadow-[4px_4px_0px_rgba(31,56,38,0.15)] relative text-left space-y-5"
            >
              <button 
                onClick={() => setShowTraceModal(false)}
                className="absolute right-4 top-4 p-2 rounded hover:bg-stone-100 text-stone-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-3 border-b-2 border-brand-green-dark/15 pb-4.5">
                <div className="w-10 h-10 bg-[#FAF7F2] border border-brand-green-dark/20 rounded-md flex items-center justify-center text-brand-green-dark shrink-0">
                  <ShieldCheck className="w-5 h-5 text-brand-orange" />
                </div>
                <div>
                  <h3 className="text-sm font-serif font-bold text-brand-green-dark">Verifikasi Asal-Usul</h3>
                  <p className="text-[9px] font-mono font-bold text-brand-green-light uppercase tracking-wider">TUMBASNA AGRO-TRACE PLATFORM</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Harvesting field */}
                <div className="flex items-start space-x-3.5">
                  <MapPin className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[9px] font-mono font-bold text-brand-green-light uppercase tracking-widest block">LOKASI PANEN</span>
                    <p className="text-xs font-serif font-bold text-brand-green-dark mt-0.5">{scInfo.harvestLocation}</p>
                    <p className="text-[10px] text-brand-green-light mt-0.5">Sertifikasi No. ID-9082/TANI</p>
                  </div>
                </div>

                {/* Harvesting dates */}
                <div className="flex items-start space-x-3.5">
                  <Calendar className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-mono font-bold text-brand-green-light uppercase tracking-widest block">JADWAL KRONOLOGIS</span>
                    <div className="grid grid-cols-2 gap-x-4 mt-1">
                      <div>
                        <span className="text-[9px] text-[#C16A3E] font-medium block">TANGGAL PANEN</span>
                        <p className="text-xs font-mono font-semibold text-brand-green-dark">{scInfo.harvestDate}</p>
                      </div>
                      <div>
                        <span className="text-[9px] text-[#C16A3E] font-medium block">TANGGAL TANAM</span>
                        <p className="text-xs font-mono font-semibold text-brand-green-dark">{scInfo.plantingDate}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fertilizers used */}
                <div className="flex items-start space-x-3.5">
                  <Sprout className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[9px] font-mono font-bold text-brand-green-light uppercase tracking-widest block">KOMPOSISI NUTRISI</span>
                    <p className="text-xs font-serif font-bold text-brand-green-dark mt-0.5">{scInfo.fertilizerInfo}</p>
                  </div>
                </div>

                {/* Pesticides information */}
                <div className="flex items-start space-x-3.5">
                  <Shield className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[9px] font-mono font-bold text-brand-green-light uppercase tracking-widest block">PENGENDALIAN HAMA</span>
                    <p className="text-xs font-serif font-bold text-brand-green-dark mt-0.5">{scInfo.pesticideInfo}</p>
                    <p className="text-[9.5px] font-sans font-semibold text-brand-green-dark mt-1">✓ Lolos ambang batas residu kimia BBPOM</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowTraceModal(false)}
                className="w-full bg-brand-green-dark hover:bg-brand-green-dark/95 text-white font-mono uppercase tracking-wider text-xs font-bold py-3.5 rounded-md"
              >
                Tutup Dokumen
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
