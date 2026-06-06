import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, ShoppingBag, Plus, Minus, BadgeCheck, Check } from 'lucide-react';
import { Product, OrderItem } from '../types';

interface PasarScreenProps {
  products: Product[];
  cart: OrderItem[];
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (product: Product) => void;
  onGoToCheckout: () => void;
}

export default function PasarScreen({
  products,
  cart,
  onAddToCart,
  onRemoveFromCart,
  onGoToCheckout
}: PasarScreenProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const categories = ['Semua', 'Sayur Fresh', 'Umbi-umbian', 'Buah-buahan', 'Sembako'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.seller.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getQuantityInCart = (productId: string) => {
    const item = cart.find(i => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalCartPrice = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full bg-brand-bg relative overflow-hidden"
    >
      {/* Search and filters static header */}
      <div className="bg-brand-bg px-5 pt-5 pb-4 border-b-2 border-brand-green-dark/15 sticky top-0 z-10 space-y-4">
        <h2 className="text-xl font-serif font-bold text-brand-green-dark">Arsip & Katalog Komoditas</h2>
        
        {/* Search input bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Cari sayuran, buah, beras, sup..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-brand-green-dark/15 rounded-md pl-10 pr-4 py-3 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-brand-green-light" />
        </div>

        {/* Category horizontal track */}
        <div className="flex space-x-2 overflow-x-auto pb-1 no-scrollbar -mx-5 px-5">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-md text-[10px] font-mono tracking-wider uppercase font-bold transition-all whitespace-nowrap shrink-0 border ${
                selectedCategory === category
                  ? 'bg-brand-green-dark text-white border-brand-green-dark shadow-sm'
                  : 'bg-white text-brand-green-light border-brand-green-dark/15 hover:bg-stone-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Products */}
      <div className="flex-1 overflow-y-auto px-5 py-4 pb-20">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 space-y-3">
            <ShoppingBag className="w-12 h-12 text-brand-green-light/40 stroke-[1.2]" />
            <p className="text-xs font-mono tracking-wider uppercase font-semibold text-brand-green-light">Komoditas tidak ditemukan</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map(product => {
              const qty = getQuantityInCart(product.id);
              
              return (
                <div
                  key={product.id}
                  className="bg-white border border-brand-green-dark/10 rounded-md overflow-hidden flex flex-col justify-between hover:border-brand-green-dark/30 transition-colors"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square w-full bg-slate-50 overflow-hidden group">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                    />
                    
                    {/* Verified badge */}
                    {product.isVerified && (
                      <span className="absolute top-2 left-2 bg-[#FAF7F2] text-brand-green-dark text-[8px] font-mono tracking-widest uppercase font-bold px-1.5 py-0.5 rounded border border-brand-green-dark/15">
                        VERIFIED
                      </span>
                    )}

                    {/* Quantity overlay */}
                    {qty > 0 && (
                      <div className="absolute inset-0 bg-[#1A291E]/20 backdrop-blur-[1px] flex items-center justify-center">
                        <span className="bg-brand-orange text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold ring-2 ring-white animate-scale">
                          {qty}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info Box */}
                  <div className="p-3.5 flex-1 flex flex-col justify-between text-left">
                    <div className="space-y-1">
                      {/* Merchant name */}
                      <span className="text-[9px] text-brand-green-light font-bold uppercase tracking-wider">{product.seller}</span>
                      
                      {/* Name */}
                      <h4 className="text-xs font-bold text-brand-green-dark font-sans line-clamp-2 min-h-[32px] leading-snug">
                        {product.name}
                      </h4>
                    </div>

                    {/* Price and Add/Remove buttons */}
                    <div className="mt-3.5 flex items-center justify-between space-x-1">
                      <div className="space-y-0.5 shrink-0 min-w-0">
                        <span className="text-[9px] font-mono uppercase tracking-wide text-brand-green-light font-medium block truncate">{product.unit}</span>
                        <div className="text-xs font-mono font-bold text-brand-orange whitespace-nowrap">
                          Rp {product.price.toLocaleString('id-ID')}
                        </div>
                      </div>

                      {/* Add button triggers */}
                      {qty === 0 ? (
                        <button
                          onClick={() => onAddToCart(product)}
                          className="w-8 h-8 bg-brand-green-dark hover:bg-brand-green-dark/95 rounded-md flex items-center justify-center text-white active:scale-90 cursor-pointer shrink-0"
                        >
                          <Plus className="w-4 h-4 stroke-[2]" />
                        </button>
                      ) : (
                        <div className="flex items-center space-x-1 bg-stone-50 rounded-md p-1 border border-brand-green-dark/10 shrink-0">
                          <button
                            onClick={() => onRemoveFromCart(product)}
                            className="w-5 h-5 bg-white hover:bg-stone-50 text-brand-green-dark rounded flex items-center justify-center border border-brand-green-dark/10 active:scale-95 cursor-pointer shrink-0"
                          >
                            <Minus className="w-3.5 h-3.5 stroke-[2]" />
                          </button>
                          <span className="text-xs font-mono font-bold px-1 text-brand-green-dark min-w-[12px] text-center">{qty}</span>
                          <button
                            onClick={() => onAddToCart(product)}
                            className="w-5 h-5 bg-white hover:bg-stone-50 text-brand-green-dark rounded flex items-center justify-center border border-brand-green-dark/10 active:scale-95 cursor-pointer shrink-0"
                          >
                            <Plus className="w-3.5 h-3.5 stroke-[2]" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Checkout bar when cart has items */}
      {totalCartItems > 0 && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute bottom-4 inset-x-4 max-w-sm mx-auto bg-brand-green-dark text-white rounded-md p-4 flex items-center justify-between border border-brand-green-dark shadow-[4px_4px_0px_rgba(200,90,50,0.25)] z-30"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-brand-orange rounded flex items-center justify-center border border-brand-orange/20">
              <ShoppingBag className="w-4.5 h-4.5 text-white" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-mono uppercase tracking-wider text-[#BFD7C1] font-bold">{totalCartItems} BARANG TERPILIH</p>
              <p className="text-sm font-mono font-bold text-white">Rp {totalCartPrice.toLocaleString('id-ID')}</p>
            </div>
          </div>

          <button
            onClick={onGoToCheckout}
            className="bg-brand-orange hover:bg-brand-orange/95 font-mono uppercase tracking-wider text-xs font-bold px-4 py-2.5 rounded text-white cursor-pointer"
          >
            Checkout
          </button>
        </motion.div>
      )}

    </motion.div>
  );
}
