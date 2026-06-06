import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, MapPin, ClipboardList, Truck, DollarSign, Wallet } from 'lucide-react';
import { OrderItem } from '../types';

interface CheckoutScreenProps {
  cart: OrderItem[];
  onPayNow: (paymentMethod: 'QRIS' | 'COD', totalSum: number, ongkir: number) => void;
  onBack: () => void;
}

export default function CheckoutScreen({ cart, onPayNow, onBack }: CheckoutScreenProps) {
  // Shipping Method selection: 'reguler' (Rp 15.000) or 'cod' (Rp 0 / free with cod fee as admin maybe)
  // Let's match the exact screenshot numbers:
  // Subtotal Produk: Rp 55.000
  // Ongkos Kirim: Rp 15.000 (this is used in the screenshot's 'Rincian Pembayaran' sum, though the method cards list 'Rp 10.000' and 'Rp 0'. Let's let the user toggle 'Ekspedisi Reguler' which adds Rp 15.000, or 'COD' which adds Rp 0, so that selecting Ekspedisi Reguler gives exactly Rp 72.000 total as shown in the screenshot!)
  const [shippingMethod, setShippingMethod] = useState<'reguler' | 'cod'>('reguler');

  // Let's calculate prices based on cart. If cart is empty, we mock the 2 items from the screenshot.
  const hasItems = cart.length > 0;
  
  const displayItems = hasItems ? cart : [
    {
      product: {
        id: 'p1',
        name: 'Selada Hidroponik Premium',
        price: 25000,
        unit: '1 kg',
        image: 'https://images.unsplash.com/photo-1556801712-76c8eb07bbc9?auto=format&fit=crop&q=80&w=400',
        seller: 'Kebun Subur Jaya',
        category: 'Sayur Fresh',
        isVerified: true,
        stock: 45
      },
      quantity: 1
    },
    {
      product: {
        id: 'p2',
        name: 'Kentang Dieng Super',
        price: 30000,
        unit: '2 kg',
        image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=400',
        seller: 'Tani Jaya Mandiri',
        category: 'Umbi-umbian',
        isVerified: true,
        stock: 80
      },
      quantity: 1
    }
  ];

  const subtotalProducts = displayItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const ongkosKirim = shippingMethod === 'reguler' ? 15000 : 0;
  const biayaAdmin = 2000;
  const totalPembayaran = subtotalProducts + ongkosKirim + biayaAdmin;

  const handlePaymentSubmit = () => {
    const pMethod = shippingMethod === 'reguler' ? 'QRIS' : 'COD';
    onPayNow(pMethod, totalPembayaran, ongkosKirim);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col h-full bg-brand-bg relative overflow-hidden"
    >
      {/* Sticky top app bar */}
      <header className="sticky top-0 bg-brand-bg border-b-2 border-brand-green-dark/15 flex items-center justify-between px-4 h-14 z-10">
        <button 
          onClick={onBack}
          className="text-brand-green-dark hover:bg-stone-100 transition-colors p-2 rounded-md flex items-center justify-center active:scale-95 duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-serif font-bold text-center flex-1 mr-8 text-brand-green-dark text-base">Rincian Checkout</h1>
      </header>

      {/* Main body wrapper */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* Alamat Pengiriman section */}
        <div className="bg-white rounded-md border border-brand-green-dark/15 p-4 space-y-3 shadow-3xs text-left">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 text-brand-green-dark font-bold text-xs uppercase tracking-wider font-mono">
              <MapPin className="w-4 h-4 text-brand-orange shrink-0" />
              <span>ALAMAT PENGIRIMAN</span>
            </div>
            <button className="text-brand-orange hover:underline font-mono uppercase tracking-wider font-bold text-[10px] transition-all">
              Ubah
            </button>
          </div>

          <div className="border-l-2 border-brand-green-dark pl-3.5 space-y-1 text-stone-700 text-xs leading-relaxed">
            <p className="font-bold text-brand-green-dark font-sans text-sm">Bapak Budi Santoso</p>
            <p className="text-brand-green-light font-medium">
              Jl. Pertanian Raya No. 45, Desa Makmur Jaya, Kec. Subur, Kabupaten Agrikultur, Jawa Barat 12345
            </p>
            <p className="text-brand-green-dark font-mono font-bold mt-1 text-[11px]">0812-3456-7890</p>
          </div>
        </div>

        {/* Pesanan Anda (Products listing) */}
        <div className="bg-white rounded-md border border-brand-green-dark/15 p-4 shadow-3xs space-y-3.5 text-left">
          <div className="flex items-center space-x-2 text-brand-green-dark font-mono font-bold text-xs uppercase tracking-wider border-b border-brand-green-dark/10 pb-2.5">
            <ClipboardList className="w-4.5 h-4.5 text-brand-green-light shrink-0" />
            <span>PESANAN ANDA ({displayItems.length} BARANG)</span>
          </div>

          <div className="space-y-4">
            {displayItems.map((item, index) => (
              <div key={index} className="flex space-x-3.5 items-center">
                {/* Image */}
                <div className="w-14 h-14 bg-slate-50 rounded-md overflow-hidden shrink-0 border border-brand-green-dark/10">
                  <img 
                    src={item.product.image} 
                    alt={item.product.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Details */}
                <div className="flex-1 min-w-0 flex justify-between items-center">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-brand-green-dark truncate pr-2 leading-tight">
                      {item.product.name}
                    </h4>
                    <p className="text-[10px] font-mono tracking-wider text-brand-green-light font-bold uppercase">{item.product.unit}</p>
                    <p className="text-xs font-mono font-bold text-brand-orange">
                      Rp {item.product.price.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <span className="text-xs font-mono text-brand-green-dark font-bold bg-brand-bg px-2 py-1 rounded shrink-0 border border-brand-green-dark/10">
                    x{item.quantity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Metode Pengiriman section */}
        <div className="bg-white rounded-md border border-brand-green-dark/15 p-4 shadow-3xs space-y-3.5 text-left">
          <div className="flex items-center space-x-2 text-brand-green-dark font-mono font-bold text-xs uppercase tracking-wider">
            <Truck className="w-4.5 h-4.5 text-brand-green-light shrink-0" />
            <span>METODE PENGIRIMAN</span>
          </div>

          <div className="space-y-2.5">
            {/* Reguler Radio option */}
            <div 
              onClick={() => setShippingMethod('reguler')}
              className={`border rounded-md p-3.5 flex items-center justify-between cursor-pointer transition-all ${
                shippingMethod === 'reguler' 
                  ? 'border-brand-green-dark bg-stone-50 border-2 shadow-xs' 
                  : 'border-brand-green-dark/10 hover:border-brand-green-dark/30'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  shippingMethod === 'reguler' ? 'border-brand-green-dark' : 'border-stone-300'
                }`}>
                  {shippingMethod === 'reguler' && <span className="w-2 h-2 rounded-full bg-brand-green-dark" />}
                </span>
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-brand-green-dark leading-none font-sans">Ekspedisi Reguler</span>
                  <p className="text-[10px] text-brand-green-light font-semibold leading-none mt-1">Tiba besok, 1-2 hari kerja</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-brand-green-dark">Rp 10.000</span>
            </div>

            {/* COD Radio option */}
            <div 
              onClick={() => setShippingMethod('cod')}
              className={`border rounded-md p-3.5 flex items-center justify-between cursor-pointer transition-all ${
                shippingMethod === 'cod' 
                  ? 'border-brand-green-dark bg-stone-50 border-2 shadow-xs' 
                  : 'border-brand-green-dark/10 hover:border-brand-green-dark/30'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  shippingMethod === 'cod' ? 'border-brand-green-dark' : 'border-stone-300'
                }`}>
                  {shippingMethod === 'cod' && <span className="w-2 h-2 rounded-full bg-brand-green-dark" />}
                </span>
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-brand-green-dark leading-none font-sans">Cash on Delivery (COD)</span>
                  <p className="text-[10px] text-brand-green-light font-semibold leading-none mt-1">Bayar saat barang sampai</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-brand-green-light">Rp 0</span>
            </div>
          </div>
        </div>

        {/* Rincian Pembayaran section */}
        <div className="bg-white rounded-md border border-brand-green-dark/15 p-4 shadow-3xs space-y-3.5 text-left">
          <div className="flex items-center space-x-2 text-brand-green-dark font-mono font-bold text-xs uppercase tracking-wider border-b border-brand-green-dark/10 pb-2 flex-wrap">
            <ClipboardList className="w-4 h-4 text-brand-green-light shrink-0" />
            <span className="ml-1">RINCIAN PEMBAYARAN</span>
          </div>

          <div className="space-y-2 text-xs font-medium text-stone-700">
            <div className="flex justify-between items-center text-brand-green-light">
              <span>Subtotal Produk ({displayItems.length} Barang)</span>
              <span className="font-mono font-bold text-brand-green-dark">Rp {subtotalProducts.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between items-center text-brand-green-light">
              <span>Ongkos Kirim</span>
              <span className="font-mono font-bold text-brand-green-dark">Rp {ongkosKirim.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between items-center text-brand-green-light">
              <span>Biaya Admin</span>
              <span className="font-mono font-bold text-brand-green-dark">Rp {biayaAdmin.toLocaleString('id-ID')}</span>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-dashed border-brand-green-dark/15 text-sm font-extrabold text-brand-green-dark">
              <span className="font-sans font-bold text-brand-green-dark">Total Pembayaran</span>
              <span className="text-base font-mono font-bold text-brand-orange">Rp {totalPembayaran.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Sticky Bottom Bill Bar */}
      <div className="bg-white border-t-2 border-brand-green-dark/15 px-5 py-4 flex items-center justify-between z-25 shrink-0 shadow-md">
        <div className="space-y-0.5 text-left">
          <span className="text-[10px] font-mono tracking-wider text-brand-green-light uppercase font-bold">TOTAL TAGIHAN</span>
          <div className="text-lg font-mono font-bold text-brand-orange">
            Rp {totalPembayaran.toLocaleString('id-ID')}
          </div>
        </div>

        <button
          onClick={handlePaymentSubmit}
          className="bg-brand-green-dark hover:bg-brand-green-dark/95 text-white font-mono uppercase tracking-wider text-xs font-bold rounded-md px-6 py-4 cursor-pointer"
        >
          Konfirmasi Bayar
        </button>
      </div>

    </motion.div>
  );
}
