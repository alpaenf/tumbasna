import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, Bell, FileText, ArrowUpRight, Search, Package, Image, 
  Truck, Flame, ArrowRight, TrendingDown, Sparkles, Bot, Send, 
  RefreshCw, TrendingUp, Layers, HelpCircle, Check, AlertTriangle 
} from 'lucide-react';
import { MOCK_PRODUCTS } from '../data';
import { AIRecommendation } from '../types';
import logoImg from '../image/logo.png';

interface HomeScreenProps {
  user: {
    businessName: string;
    location: string;
    category: string;
    expendituresMonth: string;
  };
  activeOrdersCount: number;
  onClickCekStatus: () => void;
  onClickCariProduk: () => void;
  onClickDaftarPesanan: () => void;
  onNavigateToChat: () => void;
  onNavigateToNews: (newsTitle: string, newsText: string) => void;
  onInstantCheckout: (items: { product: any; quantity: number }[]) => void;
}

export default function HomeScreen({
  user,
  activeOrdersCount,
  onClickCekStatus,
  onClickCariProduk,
  onClickDaftarPesanan,
  onNavigateToChat,
  onNavigateToNews,
  onInstantCheckout
}: HomeScreenProps) {
  // AI States
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'alert' | 'supplier' | 'bundle' | 'stok'>('alert');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // AI Chat Assistant States
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'assistant'; text: string }[]>([
    { 
      sender: 'assistant', 
      text: `Halo pak Budi! Saya asisten bisnis digital Tumbasna. Unit usaha Anda (${user.category}) terpantau aktif. Ada yang bisa saya bantu analisis hari ini?` 
    }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  // Fetch Recommendations on Mount
  const fetchRecommendations = async () => {
    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user }),
      });
      const data = await response.json();
      setRecommendation(data);
    } catch (error) {
      console.error("Error loading recommendations:", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [user]);

  const handleRefreshAI = () => {
    setIsRefreshing(true);
    fetchRecommendations();
  };

  // Helper to add product to instant checkout
  const buySingleProduct = (productId: string) => {
    const found = MOCK_PRODUCTS.find(p => p.id === productId);
    if (found) {
      onInstantCheckout([{ product: found, quantity: 1 }]);
    }
  };

  // Helper to buy Bundle
  const buycoPurchases = (productIds: string[]) => {
    const items = productIds.map(id => {
      const found = MOCK_PRODUCTS.find(p => p.id === id);
      return found ? { product: found, quantity: 1 } : null;
    }).filter(Boolean) as { product: any; quantity: number }[];

    if (items.length > 0) {
      onInstantCheckout(items);
    }
  };

  // Helper to Auto Restock
  const handleAutoRestock = (recommendedItems: { id: string; quantity: number }[]) => {
    const items = recommendedItems.map(item => {
      const found = MOCK_PRODUCTS.find(p => p.id === item.id);
      return found ? { product: found, quantity: item.quantity } : null;
    }).filter(Boolean) as { product: any; quantity: number }[];

    if (items.length > 0) {
      onInstantCheckout(items);
    }
  };

  // Send message to AI Smart Chat Assistant
  const handleSendChat = async () => {
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await fetch('/api/assistant-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userText, user }),
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, { sender: 'assistant', text: data.reply }]);
    } catch (err) {
      console.error("AI assistant chat error:", err);
      setChatMessages(prev => [...prev, { sender: 'assistant', text: "Mohon maaf pak Budi, koneksi logistik asisten sedang terputus sementara. Silakan coba kembali." }]);
    } finally {
      setChatLoading(false);
    }
  };

  const selectQuickQuestion = (q: string) => {
    setChatInput(q);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full bg-brand-bg overflow-y-auto pb-24"
    >
      {/* Top Header Bar */}
      <header className="sticky top-0 bg-brand-bg/95 backdrop-blur-md px-5 py-4 flex items-center justify-between z-10 border-b-2 border-brand-green-dark/15">
        <div className="flex items-center space-x-2">
          <img 
            alt="TumbasNa Logo" 
            src={logoImg}
            className="h-7 object-contain mix-blend-multiply"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex items-center space-x-3">
          <button className="relative w-9 h-9 bg-white border border-brand-green-dark/15 rounded-md flex items-center justify-center text-brand-green-dark hover:bg-stone-50 transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-brand-orange rounded-full" />
          </button>
          <div className="w-9 h-9 rounded-md border border-brand-green-dark/15 overflow-hidden bg-stone-100">
            <img 
              alt="Budi UMKM" 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* Main Content scrollable */}
      <div className="px-5 pt-5 space-y-5">
        
        {/* User Greetings & location */}
        <div className="pb-1 border-b border-brand-green-dark/10">
          <h2 className="text-2xl font-serif font-semibold text-brand-green-dark tracking-tight leading-snug">
            Selamat Pagi, <span className="font-sans font-bold italic">{user.businessName}</span>
          </h2>
          <div className="flex items-center space-x-1.5 text-brand-green-light mt-1 w-full justify-start">
            <MapPin className="w-3.5 h-3.5 text-brand-orange" />
            <span className="text-xs font-mono tracking-wider uppercase font-semibold">{user.location}</span>
          </div>
        </div>

        {/* Hero Active Orders Card */}
        <div className="bg-brand-green-dark rounded-md p-5 relative overflow-hidden text-white flex flex-col justify-between min-h-[140px] border border-brand-green-dark shadow-[4px_4px_0px_rgba(200,90,50,0.15)]">
          <div className="absolute right-2 top-2 bottom-2 w-1/4 opacity-10 pointer-events-none flex items-center justify-center">
            <Package className="w-20 h-20 stroke-[1.2]" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#BFD7C1] font-bold">Pesanan Terdaftar</span>
            <div className="text-2xl font-serif italic tracking-tight font-bold">
              {activeOrdersCount} Pesanan Aktif
            </div>
          </div>
          <button 
            onClick={onClickCekStatus}
            className="w-full bg-brand-orange hover:bg-brand-orange/90 active:scale-[0.99] transition-all text-white font-mono uppercase tracking-wider text-xs font-bold rounded-md py-3 flex items-center justify-center space-x-2 mt-4 text-center cursor-pointer border border-brand-orange"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Pantau Status</span>
          </button>
        </div>

        {/* Expenditure list */}
        <div className="grid grid-cols-1 gap-3">
          <div className="bg-white border border-brand-green-dark/15 rounded-md p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-brand-bg rounded-md flex items-center justify-center text-brand-green-light border border-brand-green-dark/10">
                <svg className="w-5 h-5 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] font-mono tracking-wider font-bold text-brand-green-light uppercase">PENGELUARAN BULAN INI</p>
                <p className="text-lg font-mono font-bold text-brand-green-dark">{user.expendituresMonth}</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI SMART RECOMMENDATIONS SECTION (THE MAIN HIGHLIGHT) */}
        <div className="bg-white border-2 border-brand-green-dark/20 rounded-xl p-4.5 space-y-4 shadow-[4px_4px_0px_rgba(30,70,32,0.06)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#c9e7cd]/30 to-transparent -mr-6 -mt-6 rounded-full blur-xl pointer-events-none" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 bg-brand-green-dark rounded-lg flex items-center justify-center shadow-md shadow-brand-green-dark/20">
                <Sparkles className="w-4 h-4 text-[#EB9728] animate-pulse" />
              </div>
              <div>
                <div className="flex items-center space-x-1">
                  <h3 className="text-xs font-black font-mono tracking-wider text-brand-green-dark uppercase">TumbasNa AI</h3>
                  <span className="text-[8px] font-bold bg-[#c9e7cd]/80 text-brand-green-dark-strong px-1.5 py-0.5 rounded-full uppercase leading-none font-mono">Pintar</span>
                </div>
                <p className="text-[9.5px] text-brand-green-light font-bold">Rekomendasi Rantai Pasok UMKM</p>
              </div>
            </div>

            <button 
              onClick={handleRefreshAI}
              disabled={isRefreshing}
              className={`text-brand-green-dark hover:text-brand-orange transition-colors cursor-pointer ${isRefreshing ? 'animate-spin opacity-50' : ''}`}
              title="Perbarui Rekomendasi"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <div className="py-6 flex flex-col justify-center items-center space-y-3">
              <div className="w-7 h-7 border-3 border-brand-green-dark border-t-[#EB9728] rounded-full animate-spin" />
              <span className="text-[10px] font-mono font-black text-brand-green-dark/70 uppercase animate-pulse tracking-wide">Menganalisis Rantai Pasok Anda...</span>
            </div>
          ) : recommendation ? (
            <div className="space-y-3.5">
              {/* Pills / Tabs navigation */}
              <div className="flex space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => setActiveTab('alert')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold font-sans tracking-wide shrink-0 transition-all cursor-pointer ${
                    activeTab === 'alert' 
                      ? 'bg-brand-orange text-white shadow-sm' 
                      : 'bg-brand-bg text-brand-green-dark-strong hover:bg-stone-100 border border-brand-green-dark/5'
                  }`}
                >
                  Tren Harga
                </button>
                <button
                  onClick={() => setActiveTab('supplier')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold font-sans tracking-wide shrink-0 transition-all cursor-pointer ${
                    activeTab === 'supplier' 
                      ? 'bg-brand-orange text-white shadow-sm' 
                      : 'bg-brand-bg text-brand-green-dark-strong hover:bg-stone-100 border border-brand-green-dark/5'
                  }`}
                >
                  Supplier Terbaik
                </button>
                <button
                  onClick={() => setActiveTab('bundle')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold font-sans tracking-wide shrink-0 transition-all cursor-pointer ${
                    activeTab === 'bundle' 
                      ? 'bg-brand-orange text-white shadow-sm' 
                      : 'bg-brand-bg text-brand-green-dark-strong hover:bg-stone-100 border border-brand-green-dark/5'
                  }`}
                >
                  Beli Bersama
                </button>
                <button
                  onClick={() => setActiveTab('stok')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold font-sans tracking-wide shrink-0 transition-all cursor-pointer ${
                    activeTab === 'stok' 
                      ? 'bg-brand-orange text-white shadow-sm' 
                      : 'bg-brand-bg text-brand-green-dark-strong hover:bg-stone-100 border border-brand-green-dark/5'
                  }`}
                >
                  Estimasi Stok
                </button>
              </div>

              {/* Tab Contents */}
              <div className="min-h-[140px] bg-brand-bg rounded-xl border border-brand-green-dark/10 p-3.5 flex flex-col justify-between">
                
                {/* 1. Price Alert Tab */}
                {activeTab === 'alert' && recommendation.alert && (
                  <div className="flex flex-col h-full justify-between space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-1.5 text-amber-600 font-bold">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-brand-orange" />
                        <h4 className="text-xs font-black font-sans text-stone-800">{recommendation.alert.title}</h4>
                      </div>
                      <p className="text-[11px] text-stone-600 font-medium leading-relaxed">
                        {recommendation.alert.text}
                      </p>
                    </div>
                    <button
                      onClick={() => buySingleProduct(recommendation.alert.productId)}
                      className="w-full bg-brand-green-dark hover:bg-emerald-950 text-white font-mono text-[10px] font-black tracking-wider uppercase py-2.5 rounded-lg transition-all flex items-center justify-center space-x-1"
                    >
                      <span>Beli Komoditas Sekarang</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* 2. Best Supplier Tab */}
                {activeTab === 'supplier' && recommendation.bestSupplier && (
                  <div className="flex flex-col h-full justify-between space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-1.5 text-brand-green-dark font-bold">
                        <Truck className="w-4 h-4 text-brand-green-dark shrink-0" />
                        <h4 className="text-xs font-black font-sans text-stone-800">{recommendation.bestSupplier.title}</h4>
                      </div>
                      <p className="text-[11px] text-stone-600 font-medium leading-relaxed">
                        {recommendation.bestSupplier.text}
                      </p>
                    </div>
                    <button
                      onClick={() => buySingleProduct(recommendation.bestSupplier.productId)}
                      className="w-full bg-brand-green-dark hover:bg-emerald-950 text-white font-mono text-[10px] font-black tracking-wider uppercase py-2.5 rounded-lg transition-all flex items-center justify-center space-x-1"
                    >
                      <span>Amankan Pasokan Terbaik</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* 3. Co-purchases Tab */}
                {activeTab === 'bundle' && recommendation.coPurchases && recommendation.coPurchases.length > 0 && (
                  <div className="flex flex-col h-full justify-between space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-1.5 text-brand-green-dark font-bold">
                        <Layers className="w-4 h-4 text-brand-green-dark shrink-0" />
                        <h4 className="text-xs font-black font-sans text-stone-800">{recommendation.coPurchases[0].title}</h4>
                      </div>
                      <p className="text-[11px] text-stone-600 font-medium leading-relaxed">
                        {recommendation.coPurchases[0].text}
                      </p>
                    </div>
                    <button
                      onClick={() => buycoPurchases(recommendation.coPurchases[0].productIds)}
                      className="w-full bg-[#EB9728] hover:bg-amber-600 text-white font-mono text-[10px] font-black tracking-wider uppercase py-2.5 rounded-lg transition-all flex items-center justify-center space-x-1 border border-[#EB9728]"
                    >
                      <span>Beli Bundling Bersama</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* 4. Stock Forecast Tab */}
                {activeTab === 'stok' && recommendation.weeklyStockEstimate && (
                  <div className="flex flex-col h-full justify-between space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-1.5 text-[#EB9728] font-bold">
                        <Bot className="w-4 h-4 text-brand-green-dark shrink-0" />
                        <h4 className="text-xs font-black font-sans text-stone-800">Defisit Stok & Kebutuhan Mingguan</h4>
                      </div>
                      <p className="text-[11px] text-stone-600 font-medium leading-relaxed">
                        {recommendation.weeklyStockEstimate.estimate}
                      </p>
                    </div>
                    <button
                      onClick={() => handleAutoRestock(recommendation.weeklyStockEstimate.recommendedProducts)}
                      className="w-full bg-brand-green-dark hover:bg-emerald-950 text-white font-mono text-[10px] font-black tracking-wider uppercase py-2.5 rounded-lg transition-all flex items-center justify-center space-x-1.5"
                    >
                      <Check className="w-3.5 h-3.5 shrink-0" />
                      <span>Eksekusi Restock Otomatis</span>
                    </button>
                  </div>
                )}

              </div>
            </div>
          ) : (
            <div className="py-6 flex flex-col justify-center items-center text-center">
              <Bot className="w-6 h-6 text-brand-green-light" />
              <p className="text-xs text-stone-400 mt-1">Gagal memuat rekomendasi otomatis.</p>
            </div>
          )}

          {/* Quick interactive assistant link inside container */}
          <div className="pt-3.5 border-t border-brand-green-dark/10 flex items-center justify-between gap-3">
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <Bot className="w-4 h-4 text-brand-green-light shrink-0" />
              <span className="text-[10px] font-semibold text-stone-500 leading-tight block truncate sm:whitespace-normal">
                Punya pertanyaan strategis bisnis kuliner mendalam?
              </span>
            </div>
            <button
              onClick={() => setChatOpen(prev => !prev)}
              className="shrink-0 bg-brand-orange/10 hover:bg-brand-orange/20 text-brand-orange px-2.5 py-1.5 rounded-lg text-[9.5px] font-mono uppercase tracking-wider font-black transition-colors cursor-pointer"
            >
              Tanya AI
            </button>
          </div>
        </div>

        {/* INTERACTIVE DIGITAL BUSINESS ASSISTANT DRAWER/CHAT PANEL */}
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="bg-white border-2 border-brand-green-dark rounded-xl p-4.5 space-y-4 shadow-xl text-left"
            >
              <div className="flex items-center justify-between border-b border-brand-green-dark/10 pb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-[#c9e7cd] text-brand-green-dark rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-brand-green-dark" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black font-sans text-stone-800">Asisten Bisnis Digital</h4>
                    <p className="text-[9px] text-brand-green-light font-bold">TumbasNa AI • Didukung Gemini</p>
                  </div>
                </div>
                <button
                  onClick={() => setChatOpen(false)}
                  className="text-stone-400 hover:text-stone-800 text-[11px] font-bold font-mono tracking-wide uppercase px-2 py-0.5 rounded-md hover:bg-stone-50 border border-stone-200 cursor-pointer"
                >
                  Tutup
                </button>
              </div>

              {/* Chat log */}
              <div className="max-h-[160px] overflow-y-auto space-y-2.5 pr-1 text-xs">
                {chatMessages.map((msg, i) => (
                  <div 
                    key={i} 
                    className={`flex flex-col space-y-0.5 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto text-right' : 'text-left'}`}
                  >
                    <span className="text-[8px] font-mono uppercase tracking-wider font-black text-stone-400">
                      {msg.sender === 'user' ? 'Anda (Budi UMKM)' : 'AI Tumbasna'}
                    </span>
                    <div className={`p-2.5 rounded-lg font-medium leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-brand-green-dark text-white rounded-tr-none' 
                        : 'bg-brand-bg text-brand-green-dark-strong rounded-tl-none border border-brand-green-dark/10'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}

                {chatLoading && (
                  <div className="flex items-center space-x-1.5 text-stone-400">
                    <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                    <span className="text-[9.5px] font-mono tracking-wide uppercase font-semibold">Berpikir ...</span>
                  </div>
                )}
              </div>

              {/* Suggestions quick prompts list */}
              <div className="space-y-1 pt-1.5 border-t border-stone-100">
                <span className="text-[8.5px] font-black uppercase text-stone-400 tracking-wider">Topik Cepat Analisis AI:</span>
                <div className="flex flex-wrap gap-1">
                  <button
                    onClick={() => selectQuickQuestion('Bagaimana prediksi tren pasar pekan ini?')}
                    className="px-2 py-1 bg-stone-50 hover:bg-stone-100 text-[9px] font-bold text-stone-600 rounded-md border border-stone-150 cursor-pointer transition-all"
                  >
                    Tren Pasar Mingguan
                  </button>
                  <button
                    onClick={() => selectQuickQuestion('Rekomendasi supplier Sayur Hidroponik terdekat')}
                    className="px-2 py-1 bg-stone-50 hover:bg-stone-100 text-[9px] font-bold text-stone-600 rounded-md border border-stone-150 cursor-pointer transition-all"
                  >
                    Cari Supplier Selada
                  </button>
                  <button
                    onClick={() => selectQuickQuestion('Berapa porsi stok pengaman makanan saya?')}
                    className="px-2 py-1 bg-stone-50 hover:bg-stone-100 text-[9px] font-bold text-stone-600 rounded-md border border-stone-150 cursor-pointer transition-all"
                  >
                    Analisis Stok Pengaman
                  </button>
                </div>
              </div>

              {/* Chat Input tool layout */}
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                  placeholder="Ketik pertanyaan bisnis di sini ..."
                  className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand-green-dark font-medium"
                />
                <button
                  onClick={handleSendChat}
                  disabled={chatLoading}
                  className="w-8 h-8 rounded-lg bg-brand-green-dark hover:bg-emerald-950 text-white flex items-center justify-center transition-all cursor-pointer shadow shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Menu grid */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={onClickCariProduk}
            className="bg-white hover:bg-stone-50 active:scale-[0.98] transition-all outline-none border border-brand-green-dark/15 rounded-md p-4 flex flex-col items-center justify-center space-y-3 text-center group cursor-pointer"
          >
            <div className="w-11 h-11 bg-brand-green-dark rounded-md flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-102">
              <Search className="w-4.5 h-4.5" />
            </div>
            <span className="text-xs uppercase tracking-wider font-mono font-bold text-brand-green-dark">Cari Produk</span>
          </button>

          <button 
            onClick={onClickDaftarPesanan}
            className="bg-white hover:bg-stone-50 active:scale-[0.98] transition-all outline-none border border-brand-green-dark/15 rounded-md p-4 flex flex-col items-center justify-center space-y-3 text-center group cursor-pointer"
          >
            <div className="w-11 h-11 bg-brand-green-dark rounded-md flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-102">
              <Package className="w-4.5 h-4.5" />
            </div>
            <span className="text-xs uppercase tracking-wider font-mono font-bold text-brand-green-dark">Daftar Pesanan</span>
          </button>
        </div>

        {/* Notifications & Info Section */}
        <div className="space-y-3 pb-6">
          <div className="flex items-center justify-between border-b border-brand-green-dark/10 pb-1.5">
            <h3 className="font-serif italic font-bold text-brand-green-dark text-base">Notifikasi & Buletin</h3>
            <button 
              onClick={onNavigateToChat}
              className="text-xs font-mono uppercase tracking-wider font-bold text-brand-orange hover:underline"
            >
              Arsip
            </button>
          </div>

          <div className="space-y-3.5">
            {/* Info supplier */}
            <div 
              onClick={() => onNavigateToNews(
                'Info Supplier Beras & Pupuk Organik Baru', 
                'Kabar gembira! Supplier Pupuk Organik terstandarisasi kini tersedia dan dapat melayani pengiriman langsung ke wilayah Anda di Cianjur. Hubungi via Chat untuk negosiasi harga khusus.'
              )}
              className="bg-white hover:bg-stone-50/50 cursor-pointer border border-brand-green-dark/15 rounded-md p-4 flex items-center justify-between transition-all"
            >
              <div className="flex items-center space-x-3.5 flex-1 min-w-0">
                <div className="w-9 h-9 bg-brand-green-dark/10 rounded-md flex items-center justify-center text-brand-green-dark shrink-0">
                  <Truck className="w-4.5 h-4.5" />
                </div>
                <div className="flex-1 min-w-0 pr-2 text-left">
                  <h4 className="text-xs font-bold text-brand-green-dark font-sans tracking-wide">Info Supplier Baru</h4>
                  <p className="text-[11px] text-brand-green-light font-medium leading-normal truncate mt-0.5">
                    Supplier Pupuk Organik tersedia di Cianjur
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-brand-green-light shrink-0" />
            </div>

            {/* Info harga */}
            <div 
              onClick={() => onNavigateToNews(
                'Koreksi Harga Bahan Pokok', 
                'Berdasarkan pantauan harian pasar Tumbasna, komoditas Cabai Merah mengalami perubahan harga dengan tren penurunan sebesar 5% hari ini karena panen melimpah di sub-wilayah Sukabumi. Waktu terbaik untuk restock!'
              )}
              className="bg-white hover:bg-stone-50/50 cursor-pointer border border-brand-green-dark/15 rounded-md p-4 flex items-center justify-between transition-all"
            >
              <div className="flex items-center space-x-3.5 flex-1 min-w-0">
                <div className="w-9 h-9 bg-brand-orange/10 rounded-md flex items-center justify-center text-brand-orange shrink-0">
                  <TrendingDown className="w-4.5 h-4.5" />
                </div>
                <div className="flex-1 min-w-0 pr-2 text-left">
                  <h4 className="text-xs font-bold text-brand-green-dark font-sans tracking-wide">Perubahan Harga Komoditas</h4>
                  <p className="text-[11px] text-brand-green-light font-medium leading-normal truncate mt-0.5">
                    Harga Cabai Merah turun 5% hari ini
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-brand-green-light shrink-0" />
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
