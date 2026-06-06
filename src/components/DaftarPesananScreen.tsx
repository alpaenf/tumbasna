import React from 'react';
import { motion } from 'motion/react';
import { Truck, Clock, CheckCircle2, RefreshCw, ShoppingCart, Info } from 'lucide-react';
import { Order } from '../types';
import logoImg from '../image/logo.png';

interface DaftarPesananScreenProps {
  orders: Order[];
  onTrackOrder: (orderId: string) => void;
  onPayOrder: (order: Order) => void;
  onReorder: (order: Order) => void;
}

export default function DaftarPesananScreen({
  orders,
  onTrackOrder,
  onPayOrder,
  onReorder
}: DaftarPesananScreenProps) {
  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Sedang Dikirim':
        return (
          <div className="flex items-center space-x-1.5 bg-white text-brand-orange text-[9px] font-mono tracking-wider font-bold uppercase px-2.5 py-1 rounded border border-brand-orange/25">
            <Truck className="w-3 h-3" />
            <span>DIKIRIM</span>
          </div>
        );
      case 'Menunggu Pembayaran':
        return (
          <div className="flex items-center space-x-1.5 bg-[#FAF7F2] text-amber-800 text-[9px] font-mono tracking-wider font-bold uppercase px-2.5 py-1 rounded border border-amber-600/25 animate-pulse">
            <Clock className="w-3 h-3 text-amber-700" />
            <span>MENUNGGU BAYAR</span>
          </div>
        );
      case 'Selesai':
        return (
          <div className="flex items-center space-x-1.5 bg-[#FAF7F2] text-brand-green-dark text-[9px] font-mono tracking-wider font-bold uppercase px-2.5 py-1 rounded border border-brand-green-dark/25">
            <CheckCircle2 className="w-3 h-3 text-brand-green-dark" />
            <span>SELESAI</span>
          </div>
        );
      case 'Dibatalkan':
        return (
          <div className="flex items-center space-x-1.5 bg-white text-stone-500 text-[9px] font-mono tracking-wider font-bold uppercase px-2.5 py-1 rounded border border-stone-300">
            <Info className="w-3 h-3" />
            <span>DIBATALKAN</span>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full pb-20 bg-brand-bg overflow-y-auto text-[#1C201E]"
    >
      {/* Top Header Bar */}
      <header className="sticky top-0 bg-brand-bg border-b-2 border-brand-green-dark/15 px-5 py-3.5 flex items-center justify-between z-10 shadow-3xs">
        <div className="w-8 h-8 rounded-full overflow-hidden border border-brand-green-dark/25">
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" alt="Budi" className="w-full h-full object-cover" />
        </div>
        <img 
          alt="TumbasNa Logo" 
          src={logoImg}
          className="h-7 object-contain mix-blend-multiply"
          referrerPolicy="no-referrer"
        />
        <div className="w-8 h-8" /> {/* Spacer */}
      </header>

      {/* Hero title info */}
      <div className="px-5 pt-5 pb-3 text-left">
        <h2 className="text-xl font-serif font-bold tracking-tight text-brand-green-dark mb-1">Riwayat Transaksi</h2>
        <p className="text-xs text-brand-green-light font-sans font-medium">Lacak status pesanan dan komoditas belanja aktif Anda.</p>
        <div className="border-b border-brand-green-dark/15 w-full mt-4" />
      </div>

      {/* Orders stack List */}
      <div className="px-5 space-y-4 pb-12">
        {orders.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <ShoppingCart className="w-12 h-12 text-brand-green-light/30 mx-auto stroke-[1.2]" />
            <p className="text-xs font-mono uppercase tracking-wider font-semibold text-brand-green-light">Anda belum memiliki berkas pesanan</p>
          </div>
        ) : (
          orders.map(order => {
            // Pick first item as lead representation display metadata
            const leadItem = order.items[0];
            if (!leadItem) return null;

            return (
              <div
                key={order.id}
                className="bg-white border border-brand-green-dark/15 rounded-md p-5 space-y-4 hover:border-brand-green-dark/30 transition-all shadow-3xs group text-left"
              >
                
                {/* Badge layout and date stamp */}
                <div className="flex justify-between items-center flex-wrap gap-2">
                  {getStatusBadge(order.status)}
                  <span className="text-[10px] font-mono text-brand-green-light font-semibold">{order.orderDate}</span>
                </div>

                {/* Main Product Info block snippet inline */}
                <div className="flex space-x-3.5 items-center">
                  <div className="w-14 h-14 bg-stone-50 rounded-md overflow-hidden shrink-0 border border-brand-green-dark/10">
                    <img
                      src={leadItem.product.image}
                      alt={leadItem.product.name}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform"
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-0.5">
                    <h3 className="font-serif font-bold text-sm text-brand-green-dark truncate">{leadItem.product.name}</h3>
                    <p className="text-[10px] font-mono text-brand-green-light font-semibold leading-none">
                      {leadItem.quantity} {leadItem.product.unit} x Rp {leadItem.product.price.toLocaleString('id-ID')}
                    </p>
                    <p className="text-[10px] font-sans font-bold text-brand-orange leading-none pt-1">Mitra: {order.merchant}</p>
                  </div>
                </div>

                {/* Line Separator dotted */}
                <div className="border-t border-dashed border-brand-green-dark/15" />

                {/* Foot layout billing and context triggers */}
                <div className="flex justify-between items-center flex-wrap gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-brand-green-light font-mono tracking-wider uppercase font-bold block">Total Belanja</span>
                    <span className="text-sm font-mono font-bold text-brand-orange">
                      Rp {order.totalPayment.toLocaleString('id-ID')}
                    </span>
                  </div>

                  {/* Dynamic action buttons based on status inside images */}
                  {order.status === 'Sedang Dikirim' && (
                    <button
                      onClick={() => onTrackOrder(order.id)}
                      className="bg-brand-green-dark text-white font-mono uppercase tracking-wider text-[10px] px-4 py-2 rounded-md hover:bg-brand-green-dark/95 transition-all cursor-pointer"
                    >
                      Lacak Jalan
                    </button>
                  )}

                  {order.status === 'Menunggu Pembayaran' && (
                    <div className="flex items-center space-x-2">
                      {order.paymentTimeLimit && (
                        <div className="bg-stone-50 border border-brand-green-dark/15 text-stone-700 text-[9px] font-mono font-bold px-2 py-1.5 rounded">
                          Sisa {order.paymentTimeLimit}
                        </div>
                      )}
                      <button
                        onClick={() => onPayOrder(order)}
                        className="bg-brand-orange hover:bg-brand-orange/95 text-white font-mono uppercase tracking-wider font-bold text-[10px] px-4 py-2.5 rounded shadow-sm cursor-pointer"
                      >
                        Bayar Ke Kasir
                      </button>
                    </div>
                  )}

                  {order.status === 'Selesai' && (
                    <button
                      onClick={() => onReorder(order)}
                      className="bg-transparent border border-brand-green-dark text-brand-green-dark hover:bg-brand-green-dark/5 font-mono uppercase tracking-wider text-[10px] px-4 py-2 rounded-md font-bold transition-all cursor-pointer flex items-center space-x-1.5"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Beli Lagi</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

    </motion.div>
  );
}
