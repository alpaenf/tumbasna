import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, LineChart, Map, Package, ShoppingCart, Users, Search, Filter, 
  MapPin, LogOut, ChevronRight, Lock, Mail, Server, ClipboardList, TrendingUp, 
  TrendingDown, CheckCircle, Clock, Truck, ShieldAlert, CornerDownRight, HandCoins,
  RefreshCw, Menu, X, ArrowUpRight, HelpCircle, AlertTriangle, Building, Globe
} from 'lucide-react';
import { Product, Order } from '../types';
import logoImg from '../image/logo.png';

// Let's model rich master data for the Region map & stock
interface RegionData {
  id: string;
  name: string;
  stockLevel: 'abundant' | 'low';
  activeSuppliers: number;
  totalStockValue: number;
  totalStockTons: number;
  commodities: { name: string; stock: number; trend: 'up' | 'down' }[];
  trendData: number[]; // 5 days trend points
}

const REGION_DB: RegionData[] = [
  {
    id: 'banyumas',
    name: 'Banyumas',
    stockLevel: 'abundant',
    activeSuppliers: 18,
    totalStockValue: 245000000,
    totalStockTons: 124,
    commodities: [
      { name: 'Beras Pandan Wangi', stock: 45, trend: 'up' },
      { name: 'Bawang Merah', stock: 32, trend: 'up' },
      { name: 'Cabai Rawit', stock: 27, trend: 'down' },
      { name: 'Kentang Dieng', stock: 20, trend: 'up' }
    ],
    trendData: [85, 92, 104, 115, 124]
  },
  {
    id: 'purbalingga',
    name: 'Purbalingga',
    stockLevel: 'abundant',
    activeSuppliers: 14,
    totalStockValue: 180000000,
    totalStockTons: 95,
    commodities: [
      { name: 'Beras Rojolele', stock: 40, trend: 'up' },
      { name: 'Selada Hidroponik', stock: 15, trend: 'up' },
      { name: 'Tomat Jeruk', stock: 25, trend: 'up' },
      { name: 'Cabai Merah Keriting', stock: 15, trend: 'down' }
    ],
    trendData: [70, 78, 85, 89, 95]
  },
  {
    id: 'banjarnegara',
    name: 'Banjarnegara',
    stockLevel: 'low',
    activeSuppliers: 9,
    totalStockValue: 85000000,
    totalStockTons: 38,
    commodities: [
      { name: 'Kentang Dieng', stock: 22, trend: 'up' },
      { name: 'Cabai Rawit', stock: 5, trend: 'down' },
      { name: 'Selada Hidroponik', stock: 3, trend: 'down' },
      { name: 'Bawang Merah', stock: 8, trend: 'down' }
    ],
    trendData: [62, 55, 48, 42, 38]
  },
  {
    id: 'cilacap',
    name: 'Cilacap',
    stockLevel: 'abundant',
    activeSuppliers: 22,
    totalStockValue: 310000000,
    totalStockTons: 162,
    commodities: [
      { name: 'Beras Mentik Susu', stock: 75, trend: 'up' },
      { name: 'Cabai Rawit', stock: 38, trend: 'up' },
      { name: 'Tomat Organik', stock: 29, trend: 'up' },
      { name: 'Bawang Merah', stock: 20, trend: 'down' }
    ],
    trendData: [140, 145, 150, 158, 162]
  },
  {
    id: 'kebumen',
    name: 'Kebumen',
    stockLevel: 'low',
    activeSuppliers: 7,
    totalStockValue: 74000000,
    totalStockTons: 29,
    commodities: [
      { name: 'Beras Rojolele', stock: 12, trend: 'down' },
      { name: 'Bawang Putih', stock: 8, trend: 'down' },
      { name: 'Cabai Rawit', stock: 4, trend: 'down' },
      { name: 'Jagung Pipil', stock: 5, trend: 'up' }
    ],
    trendData: [45, 41, 35, 32, 29]
  }
];

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  onSetOrders?: React.Dispatch<React.SetStateAction<Order[]>>;
  onGoToBuyerApp: () => void;
}

export default function AdminDashboard({ products, orders, onSetOrders, onGoToBuyerApp }: AdminDashboardProps) {
  // Authentication State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [emailInput, setEmailInput] = useState('admin@tumbasna.id');
  const [passwordInput, setPasswordInput] = useState('tumbasna2026');
  const [loginError, setLoginError] = useState('');

  // Routing State
  const [currentMenu, setCurrentMenu] = useState<'overview' | 'map' | 'commodities' | 'transactions'>('overview');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedRegionId, setSelectedRegionId] = useState<string>('banyumas');

  // Mobile navigation
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Search & Filters state for Commodity List
  const [comSearch, setComSearch] = useState('');
  const [comRegion, setComRegion] = useState('all');
  const [comStockStatus, setComStockStatus] = useState('all'); // all, rich (>20), depleted (<=20)
  const [comPriceSort, setComPriceSort] = useState('all'); // all, asc, desc

  // Search & Filters state for Transactions List
  const [txSearch, setTxSearch] = useState('');
  const [txStatus, setTxStatus] = useState('all');
  const [txRegion, setTxRegion] = useState('all');

  // Interactive activity simulation state
  const [recentActivities, setRecentActivities] = useState([
    { id: 1, type: 'tx_new', text: 'Transaksi baru senilai Rp 13.150.000 menunggu validasi QRIS escrow', region: 'Banyumas', time: 'Baru saja' },
    { id: 2, type: 'stock_low', text: 'Stok Cabai Rawit di Kebumen kritis di bawah 5 ton', region: 'Kebumen', time: '5 mnt lalu' },
    { id: 3, type: 'supplier_new', text: 'Supplier Beras "Sari Bumi" terdaftar di Purbalingga', region: 'Purbalingga', time: '18 mnt lalu' },
    { id: 4, type: 'tx_success', text: 'Dana escrow Rp 72.000 berhasil dicarikan ke PT. Agro Nusantara', region: 'Banyumas', time: '1 jam lalu' },
    { id: 5, type: 'stock_up', text: 'Banyumas menambah pasokan Beras Pandan Wangi sebanyak 10 ton', region: 'Banyumas', time: '2 jam lalu' }
  ]);

  // Handle Login Admin validation
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim() === 'admin@tumbasna.id' && passwordInput === 'tumbasna2026') {
      setIsAdminLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Email atau password salah. Silakan coba lagi.');
    }
  };

  // Synchronise order updates
  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    if (onSetOrders) {
      onSetOrders(prev => prev.map(o => {
        if (o.id === orderId) {
          // Sync tracking history milestones
          let tracking = [...(o.trackingHistory || [])];
          if (newStatus === 'Selesai') {
            tracking = tracking.map(t => t.status === 'Pesanan Diterima' ? { ...t, completed: true, time: 'Hari ini' } : t);
          }
          return { ...o, status: newStatus, trackingHistory: tracking };
        }
        return o;
      }));
    }
    // Add real-time log
    const updatedOrder = orders.find(o => o.id === orderId);
    if (updatedOrder) {
      const logText = `Status Transaksi ${orderId} diubah menjadi: ${newStatus}`;
      const newAct = {
        id: Date.now(),
        type: 'tx_success',
        text: logText,
        region: 'Banyumas',
        time: 'Baru saja'
      };
      setRecentActivities(prev => [newAct, ...prev]);
    }
  };

  // Calculated statistics across all live simulated orders
  const kpiTotalCount = orders.length;
  const kpiTotalValue = orders.reduce((sum, o) => sum + o.totalPayment, 0);
  const kpiCountSuppliers = 31; // static verified + live dynamic
  const kpiCountBuyers = 45;
  const kpiActiveCommodities = products.length;

  return (
    <div className="font-poppins min-h-screen bg-[#FAF9F5] text-stone-800 antialiased flex flex-col">
      
      {/* LOGIN VIEW */}
      {!isAdminLoggedIn ? (
        <div className="flex-1 flex flex-col lg:flex-row min-h-0 bg-stone-50 overflow-hidden">
          {/* Cover / Supply chain illustration details */}
          <div className="hidden lg:flex lg:w-1/2 bg-[#1A291E] p-12 text-white flex-col justify-between relative overflow-hidden text-left">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#5B7A60]/10 rounded-full blur-3xl -ml-32 -mb-32" />

            <div className="flex items-center space-x-2.5 z-10">
              <span className="w-2.5 h-2.5 rounded-full bg-[#5B7A60] animate-ping" />
              <span className="text-xs font-bold tracking-widest uppercase text-emerald-300 font-mono">Enterprise Level Portal</span>
            </div>

            <div className="space-y-6 z-10 max-w-lg my-auto">
              <h2 className="text-4xl font-extrabold leading-tight text-white tracking-tight">
                Integrasi & Monitoring Kedaulatan Pangan Wilayah
              </h2>
              <p className="text-sm text-stone-300 leading-relaxed font-normal">
                Sistem dashboard monitoring rantai pasok pintar Tumbasna memadukan pencatatan digital transaksi, persebaran stok wilayah Banyumas Raya, dan pengendalian harga pangan nasional dalam genggaman Anda.
              </p>

              {/* Grid visual stats teaser */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
                <div>
                  <div className="text-xl font-black text-[#5B7A60]">Banyumas</div>
                  <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Lahan Mandiri Utama</div>
                </div>
                <div>
                  <div className="text-xl font-black text-[#C85A32]">5 Kabupaten</div>
                  <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Wilayah Sinergi</div>
                </div>
                <div>
                  <div className="text-xl font-black text-white">99.8%</div>
                  <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Akurasi Telemetri</div>
                </div>
              </div>
            </div>

            <div className="text-xs text-stone-400 z-10 font-medium">
              Tumbasna Supply Chain Command © 2026 • Bersertifikasi Bank Indonesia & BBPOM
            </div>
          </div>

          {/* Form Login Admin */}
          <div className="flex-1 flex items-center justify-center p-6 bg-white font-sans">
            <div className="max-w-md w-full text-left space-y-6 p-4">
              <div className="space-y-4">
                <div className="flex items-center max-w-[130px]">
                  <img 
                    alt="TumbasNa Logo" 
                    src={logoImg} 
                    className="h-8 object-contain mix-blend-multiply"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-stone-900 tracking-tight">Login Portal Admin</h3>
                  <p className="text-xs text-stone-500 mt-1 font-medium">
                    Gunakan kredensial yang ditentukan sistem untuk mengakses instalan dashboard berskala nasional ini.
                  </p>
                </div>
              </div>

              {loginError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-3.5 text-xs font-semibold flex items-center space-x-2">
                  <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-stone-600 block uppercase tracking-wide">Email Administrator</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="admin@tumbasna.id"
                      className="w-full bg-stone-50 border border-stone-200 text-stone-850 rounded-xl pl-10 pr-4 py-3 text-xs font-semibold placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1A291E] focus:bg-white transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-stone-600 block uppercase tracking-wide">Kata Sandi</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type="password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-stone-50 border border-stone-200 text-stone-850 rounded-xl pl-10 pr-4 py-3 text-xs font-semibold placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1A291E] focus:bg-white transition-all"
                      required
                    />
                  </div>
                  <div className="text-right text-[10px] text-stone-400 font-bold mt-1">
                    Kredensial Demo: <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-600">tumbasna2026</code>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#1A291E] hover:bg-emerald-950 text-white font-extrabold py-3.5 text-xs rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
                >
                  <Server className="w-4 h-4" />
                  <span>Masuk Monitoring Hub</span>
                </button>
              </form>

              <div className="border-t border-stone-100 pt-6 text-center text-xs text-stone-400 font-semibold space-y-2">
                <p>Apakah Anda mencari dashboard Pembeli/Umbi?</p>
                <button
                  onClick={onGoToBuyerApp}
                  className="text-[#1A291E] hover:text-[#5B7A60] font-bold underline cursor-pointer inline-flex items-center space-x-1"
                >
                  <span>Buka Mobile Smartphone Buyer</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* CORE ENTERPRISE PORTAL INTERFACE WITH SIDEBAR & LARGE MAIN VIEW */
        <div className="flex-1 flex flex-col md:flex-row min-h-0 bg-stone-50">
          
          {/* SIDEBAR FOR DESKTOP / FIXED DRAWER */}
          <aside className={`w-64 bg-[#C85A32] shrink-0 text-stone-100 border-r border-white/10 md:flex flex-col justify-between select-none z-30 transition-all ${
            isSidebarOpen ? 'fixed inset-y-0 left-0 bg-[#C85A32] flex' : 'hidden md:flex'
          }`}>
            <div className="flex flex-col flex-1">
              
              {/* Brand Logo & Mode Switcher in Sidebar */}
              <div className="p-4 border-b border-white/10 flex flex-col space-y-3 bg-black/10 text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center justify-center shrink-0">
                    <img 
                      alt="TumbasNa Logo" 
                      src={logoImg} 
                      className="h-5.5 object-contain brightness-0 invert"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[9px] bg-white/20 text-white font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                      HQ Admin
                    </span>
                    {/* Dedicated mobile close drawer button */}
                    <button 
                      onClick={() => setIsSidebarOpen(false)}
                      className="md:hidden text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                      title="Tutup Menu"
                    >
                      <X className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>
                <button 
                  onClick={onGoToBuyerApp}
                  className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-1.5 px-3 text-[10px] rounded-lg transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <RefreshCw className="w-3 h-3 animate-spin-hover" />
                  <span>Masuk Mode Pembeli</span>
                </button>
              </div>

              {/* Profile card area */}
              <div className="p-5 border-b border-white/10 flex items-center space-x-3 text-left">
                <div className="w-10 h-10 rounded-full bg-stone-700 overflow-hidden border-2 border-white/30">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" 
                    alt="Admin Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-black leading-tight text-white">Anindya Putri</h4>
                  <p className="text-[10px] text-stone-200/90 font-extrabold uppercase mt-0.5 tracking-wider">Super Administrator</p>
                </div>
              </div>

              {/* Navigation lists */}
              <nav className="p-4 space-y-1 text-left flex-1 font-sans">
                <button
                  onClick={() => { setCurrentMenu('overview'); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                    currentMenu === 'overview' 
                      ? 'bg-white/15 text-white shadow-xs border-l-4 border-white' 
                      : 'hover:bg-white/5 text-stone-200 hover:text-white'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 shrink-0" />
                  <span>Dashboard Utama</span>
                </button>

                <button
                  onClick={() => { setCurrentMenu('map'); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                    currentMenu === 'map' 
                      ? 'bg-white/15 text-white shadow-xs border-l-4 border-white' 
                      : 'hover:bg-white/5 text-stone-200 hover:text-white'
                  }`}
                >
                  <Map className="w-4 h-4 shrink-0" />
                  <span>Peta Komoditas</span>
                </button>

                <button
                  onClick={() => { setCurrentMenu('commodities'); setIsSidebarOpen(false); setSelectedProductId(null); }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                    currentMenu === 'commodities' 
                      ? 'bg-white/15 text-white shadow-xs border-l-4 border-white' 
                      : 'hover:bg-white/5 text-stone-200 hover:text-white'
                  }`}
                >
                  <Package className="w-4 h-4 shrink-0" />
                  <span>Menu Komoditas</span>
                </button>

                <button
                  onClick={() => { setCurrentMenu('transactions'); setIsSidebarOpen(false); setSelectedOrderId(null); }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                    currentMenu === 'transactions' 
                      ? 'bg-white/15 text-white shadow-xs border-l-4 border-white' 
                      : 'hover:bg-white/5 text-stone-200 hover:text-white'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4 shrink-0" />
                  <span>Riwayat Transaksi</span>
                </button>
              </nav>
            </div>

            {/* Logout panel footer */}
            <div className="p-4 border-t border-white/10 text-left">
              <button
                onClick={() => setIsAdminLoggedIn(false)}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold text-rose-200 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span>Keluar Sesi HQ</span>
              </button>
            </div>
          </aside>

          {/* MOBILE TOGGLE FOR SIDEBAR */}
          <div className="md:hidden bg-white/95 backdrop-blur border-b border-stone-200 px-4 py-3 flex items-center justify-between shrink-0">
            <button 
              onClick={() => setIsSidebarOpen(prev => !prev)}
              className="text-stone-700 hover:bg-stone-100 p-2 rounded-lg cursor-pointer"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="text-xs font-black uppercase text-stone-900 font-sans tracking-wider">
              {currentMenu === 'overview' && 'Dashboard Utama'}
              {currentMenu === 'map' && 'Peta Komoditas'}
              {currentMenu === 'commodities' && 'Menu Komoditas'}
              {currentMenu === 'transactions' && 'Riwayat Transaksi'}
            </div>
            <div className="w-6" /> {/* Balance placeholder */}
          </div>

          {/* MAIN WORKING AREA (LARGE AREA) */}
          <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
            
            {/* 1. MENU: DASHBOARD UTAMA (OVERVIEW) */}
            {currentMenu === 'overview' && (
              <div className="space-y-6 text-left">
                {/* Heading info */}
                <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-stone-200/80 gap-3">
                  <div>
                    <h2 className="text-2xl font-black text-stone-900 tracking-tight">Kondisi Ekosistem Pangan Purbalingga & Banyumas</h2>
                    <p className="text-xs text-stone-500 mt-1 font-medium">Data real-time yang disinkronisasi langsung dari transaksi Koperasi, Supplier, dan Usaha Mikro.</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono bg-emerald-150 text-[#1A291E] border border-emerald-300 px-3 py-1.5 rounded-full font-extrabold flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      <span>Live Transaksi</span>
                    </span>
                  </div>
                </div>

                {/* KPI CARDS (Professional Stats) */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
                  {/* KPI 1 */}
                  <div className="bg-white rounded-2xl p-4 border border-stone-200/60 shadow-xs relative overflow-hidden flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] text-stone-400 font-extrabold uppercase tracking-wider">Total Transaksi</div>
                      <div className="text-xl md:text-2xl font-extrabold text-[#1A291E] mt-1.5">{kpiTotalCount} Pesanan</div>
                    </div>
                    <div className="text-[10px] text-emerald-600 font-semibold mt-2.5 flex items-center space-x-1">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>+12% Jam Ini</span>
                    </div>
                  </div>

                  {/* KPI 2 */}
                  <div className="bg-white rounded-2xl p-4 border border-stone-200/60 shadow-xs relative overflow-hidden flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] text-stone-400 font-extrabold uppercase tracking-wider">Total Nilai Transaksi</div>
                      <div className="text-xl md:text-2xl font-extrabold text-[#1A291E] mt-1.5">Rp {kpiTotalValue.toLocaleString('id-ID')}</div>
                    </div>
                    <div className="text-[10px] text-emerald-600 font-semibold mt-2.5 flex items-center space-x-1">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>Sistem Escrow Aktif</span>
                    </div>
                  </div>

                  {/* KPI 3 */}
                  <div className="bg-white rounded-2xl p-4 border border-stone-200/60 shadow-xs relative overflow-hidden flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] text-stone-400 font-extrabold uppercase tracking-wider">Total Supplier Aktif</div>
                      <div className="text-xl md:text-2xl font-extrabold text-[#1A291E] mt-1.5">{kpiCountSuppliers} Mitra</div>
                    </div>
                    <div className="text-[10px] text-stone-500 font-semibold mt-2.5 flex items-center space-x-1">
                      <Building className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>Tani Mandiri Swadaya</span>
                    </div>
                  </div>

                  {/* KPI 4 */}
                  <div className="bg-white rounded-2xl p-4 border border-stone-200/60 shadow-xs relative overflow-hidden flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] text-stone-400 font-extrabold uppercase tracking-wider">Total Buyer Terdaftar</div>
                      <div className="text-xl md:text-2xl font-extrabold text-[#1A291E] mt-1.5">{kpiCountBuyers} UMKM</div>
                    </div>
                    <div className="text-[10px] text-[#C85A32] font-bold mt-2.5 flex items-center space-x-1">
                      <Users className="w-3.5 h-3.5 shrink-0" />
                      <span>Kuliner & Pengusaha</span>
                    </div>
                  </div>

                  {/* KPI 5 */}
                  <div className="bg-white rounded-2xl p-4 border border-stone-200/60 shadow-xs relative overflow-hidden flex flex-col justify-between col-span-2 lg:col-span-1">
                    <div>
                      <div className="text-[10px] text-stone-400 font-extrabold uppercase tracking-wider">Komoditas Aktif</div>
                      <div className="text-xl md:text-2xl font-extrabold text-[#1A291E] mt-1.5">{kpiActiveCommodities} Produk</div>
                    </div>
                    <div className="text-[10px] text-blue-600 font-semibold mt-2.5 flex items-center space-x-1">
                      <Globe className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>Banyumas Jaya</span>
                    </div>
                  </div>
                </div>

                {/* GRAPHICS & INTERACTIVE DATA GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                  {/* Daily transactions line chart / Best selling commodities */}
                  <div className="bg-white rounded-2xl p-5 border border-stone-200/60 shadow-xs lg:col-span-8 space-y-6">
                    <div>
                      <h4 className="text-sm font-black text-stone-900 flex items-center space-x-2">
                        <LineChart className="w-4 h-4 text-[#1A291E]" />
                        <span>Arus Transaksi & Nilai Penjualan Kolektif</span>
                      </h4>
                      <p className="text-[11px] text-stone-400 font-bold uppercase mt-1">Minggu ini • Nilai Rupiah Efektif Harian</p>
                    </div>

                    {/* Rich custom clean SVG Line Chart representing transaksi harian */}
                    <div className="h-44 w-full relative pt-2">
                      <svg className="w-full h-full min-h-[160px]" viewBox="0 0 500 160" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#5B7A60" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#5B7A60" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        {/* Grid lines */}
                        <line x1="0" y1="40" x2="500" y2="40" stroke="#f1f1f1" strokeWidth="1" />
                        <line x1="0" y1="80" x2="500" y2="80" stroke="#f1f1f1" strokeWidth="1" />
                        <line x1="0" y1="120" x2="500" y2="120" stroke="#f1f1f1" strokeWidth="1" />
                        {/* Shaded Area */}
                        <path d="M 0 160 L 0 120 L 100 90 L 200 135 L 300 45 L 400 85 L 500 30 L 500 160 Z" fill="url(#chartGrad)" />
                        {/* Main Path representing Rp */}
                        <path d="M 0 120 L 100 90 L 200 135 L 300 45 L 400 85 L 500 30" fill="none" stroke="#5B7A60" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        {/* Highlight Nodes */}
                        <circle cx="100" cy="90" r="4.5" fill="#1A291E" stroke="#5B7A60" strokeWidth="1.5" />
                        <circle cx="300" cy="45" r="4.5" fill="#1A291E" stroke="#5B7A60" strokeWidth="1.5" />
                        <circle cx="500" cy="30" r="4.5" fill="#C85A32" stroke="white" strokeWidth="2" />
                      </svg>
                      {/* X axes labels */}
                      <div className="flex justify-between text-[10px] text-stone-400 font-extrabold mt-2 font-mono uppercase tracking-wide">
                        <span>Senin</span>
                        <span>Selasa</span>
                        <span>Rabu</span>
                        <span>Kamis</span>
                        <span>Jumat</span>
                        <span className="text-[#C85A32]">Sabtu (Live)</span>
                      </div>
                    </div>

                    {/* Best selling commodity bar metrics */}
                    <div className="border-t border-stone-100 pt-5 space-y-4">
                      <div>
                        <h5 className="text-xs font-black uppercase text-stone-500 tracking-wide">Komoditas Beras & Sayuran Terlaris</h5>
                        <p className="text-[10px] text-stone-400 font-bold mt-1">Dihitung dari total metrik ton (t) yang tersalurkan</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-bold">
                            <span>Beras Pandan Wangi</span>
                            <span className="text-brand-orange">45.2 t</span>
                          </div>
                          <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-[#1A291E] h-full" style={{ width: '85%' }} />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-bold">
                            <span>Kentang Dieng Super</span>
                            <span className="text-brand-orange">28.4 t</span>
                          </div>
                          <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-[#5B7A60] h-full" style={{ width: '58%' }} />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-bold">
                            <span>Bawang Merah</span>
                            <span className="text-brand-orange">19.1 t</span>
                          </div>
                          <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-[#32506E] h-full" style={{ width: '42%' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity Live Feeds & Quick Support Info */}
                  <div className="bg-white rounded-2xl p-5 border border-stone-200/60 shadow-xs lg:col-span-4 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
                        <h4 className="text-xs font-black uppercase text-stone-500 tracking-wider flex items-center space-x-1.5">
                          <Clock className="w-4 h-4 text-[#C85A32] shrink-0" />
                          <span>Aktivitas Real-Time</span>
                        </h4>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      </div>

                      <div className="space-y-3.5">
                        {recentActivities.map((act) => (
                          <div key={act.id} className="text-xs font-semibold leading-relaxed text-stone-700 flex space-x-2 items-start border-b border-stone-50/50 pb-2.5 last:border-0 last:pb-0">
                            <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                              act.type.startsWith('tx') ? 'bg-[#32506E]' : act.type.startsWith('stock') ? 'bg-rose-500 animate-ping' : 'bg-[#5B7A60]'
                            }`} />
                            <div className="flex-1">
                              <p className="font-medium text-stone-800">{act.text}</p>
                              <div className="flex items-center space-x-2 mt-1 text-[9.5px] font-bold text-stone-400">
                                <span className="bg-stone-50 px-1 py-0.2 rounded border border-stone-200">{act.region}</span>
                                <span>{act.time}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Regional Status Summary */}
                    <div className="mt-5 pt-4 border-t border-stone-100 bg-[#FAF9F5] p-3 rounded-xl border border-stone-200/60">
                      <h5 className="text-[10px] font-black uppercase text-stone-500 tracking-widest leading-none mb-1.5">Wilayah Penopang Utama</h5>
                      <span className="text-[11px] font-medium leading-relaxed block text-stone-600">
                        Keamanan stok ketersediaan pangan di <strong>Purbalingga & Banjarnegara</strong> terpantau stabil dengan surplus pada Beras & Kentang.
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            )}


            {/* 2. MENU: PETA KOMODITAS (INTERACTIVE AREA & SELECTION) */}
            {currentMenu === 'map' && (
              <div className="space-y-6 text-left">
                {/* Upper info row */}
                <div>
                  <h2 className="text-2xl font-black text-stone-900 tracking-tight">Peta Distribusi & Ketersediaan Komoditas</h2>
                  <p className="text-xs text-stone-500 mt-1 font-medium">Klik pada salah satu kabupaten untuk memperoleh informasi ketersediaan stok, jumlah supplier terdaftar, dan estimasi ketahanan stok wilayah.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Digital Map Canvas SVG Indicator */}
                  <div className="bg-white rounded-2xl p-5 border border-stone-200/60 shadow-xs lg:col-span-8 flex flex-col items-center">
                    <div className="w-full flex items-center justify-between border-b border-stone-100 pb-3 mb-4 shrink-0">
                      <span className="text-xs font-black text-[#1A291E] uppercase tracking-wider flex items-center space-x-1.5">
                        <Map className="w-4.5 h-4.5 text-[#5B7A60]" />
                        <span>Sistem Koordinat Banyumas Raya</span>
                      </span>
                      <div className="flex space-x-3 text-[10px] font-extrabold">
                        <div className="flex items-center space-x-1">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#5B7A60]" />
                          <span>Stok Melimpah</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                          <span>Stok Menipis (Kritis)</span>
                        </div>
                      </div>
                    </div>

                    {/* Vector Map Simulation with custom styled polygons corresponding to Purbalingga-Banyumas */}
                    <div className="w-full aspect-[4/3] max-h-[380px] bg-[#FAF9F5] rounded-xl border border-stone-150 relative flex items-center justify-center p-4 overflow-hidden select-none">
                      
                      {/* Let's generate a stunning, professional SVG mockup of the region with clickable regions! */}
                      <svg viewBox="0 0 500 360" className="w-full h-full max-w-[450px]">
                        
                        {/* Cilacap (South-West) */}
                        <g 
                          onClick={() => setSelectedRegionId('cilacap')}
                          className="cursor-pointer group transition-all"
                        >
                          <polygon 
                            points="30,120 120,120 180,240 100,340 20,330 20,190" 
                            fill={selectedRegionId === 'cilacap' ? '#5B7A60' : '#a2d681'} 
                            stroke={selectedRegionId === 'cilacap' ? '#1A291E' : '#FAF9F5'}
                            strokeWidth={selectedRegionId === 'cilacap' ? '3' : '2'}
                            className="transition-colors hover:opacity-90"
                          />
                          <text x="65" y="220" className="text-[12px] font-black fill-stone-800 pointer-events-none uppercase tracking-widest font-sans">Cilacap</text>
                          {/* Dot indicator */}
                          <circle cx="105" cy="240" r="5" fill="#1A291E" stroke="#5B7A60" strokeWidth="2" className="animate-pulse" />
                        </g>

                        {/* Banyumas (Center) */}
                        <g 
                          onClick={() => setSelectedRegionId('banyumas')}
                          className="cursor-pointer group transition-all"
                        >
                          <polygon 
                            points="120,120 230,120 250,220 180,240" 
                            fill={selectedRegionId === 'banyumas' ? '#5B7A60' : '#bfe8a5'} 
                            stroke={selectedRegionId === 'banyumas' ? '#1A291E' : '#FAF9F5'}
                            strokeWidth={selectedRegionId === 'banyumas' ? '3' : '2'}
                            className="transition-colors hover:opacity-90"
                          />
                          <text x="145" y="180" className="text-[12px] font-black fill-stone-800 pointer-events-none uppercase tracking-widest font-sans">Banyumas</text>
                          {/* Dot indicator */}
                          <circle cx="210" cy="170" r="5" fill="#1A291E" stroke="#5B7A60" strokeWidth="2" className="animate-pulse" />
                        </g>

                        {/* Purbalingga (North-Center) */}
                        <g 
                          onClick={() => setSelectedRegionId('purbalingga')}
                          className="cursor-pointer group transition-all"
                        >
                          <polygon 
                            points="210,10 320,10 310,130 230,120" 
                            fill={selectedRegionId === 'purbalingga' ? '#5B7A60' : '#a0db7a'} 
                            stroke={selectedRegionId === 'purbalingga' ? '#1A291E' : '#FAF9F5'}
                            strokeWidth={selectedRegionId === 'purbalingga' ? '3' : '2'}
                            className="transition-colors hover:opacity-90"
                          />
                          <text x="225" y="70" className="text-[11px] font-black fill-stone-800 pointer-events-none uppercase tracking-widest font-sans">Purbalingga</text>
                          {/* Dot indicator */}
                          <circle cx="270" cy="90" r="5" fill="#1A291E" stroke="#5B7A60" strokeWidth="2" className="animate-pulse" />
                        </g>

                        {/* Banjarnegara (East) */}
                        <g 
                          onClick={() => setSelectedRegionId('banjarnegara')}
                          className="cursor-pointer group transition-all"
                        >
                          <polygon 
                            points="320,10 440,30 420,150 310,130" 
                            fill={selectedRegionId === 'banjarnegara' ? '#C85A32' : '#f5c687'} 
                            stroke={selectedRegionId === 'banjarnegara' ? '#1A291E' : '#FAF9F5'}
                            strokeWidth={selectedRegionId === 'banjarnegara' ? '3' : '2'}
                            className="transition-colors hover:opacity-90"
                          />
                          <text x="325" y="85" className="text-[10px] font-black fill-white pointer-events-none uppercase tracking-wider font-sans">Banjarnegara</text>
                          {/* Dot indicator for critical (low stock) */}
                          <circle cx="390" cy="110" r="5" fill="none" stroke="red" strokeWidth="2" className="animate-ping" />
                          <circle cx="390" cy="110" r="4.5" fill="red" />
                        </g>

                        {/* Kebumen (South-East) */}
                        <g 
                          onClick={() => setSelectedRegionId('kebumen')}
                          className="cursor-pointer group transition-all"
                        >
                          <polygon 
                            points="310,130 420,150 460,280 340,300" 
                            fill={selectedRegionId === 'kebumen' ? '#C85A32' : '#faca91'} 
                            stroke={selectedRegionId === 'kebumen' ? '#1A291E' : '#FAF9F5'}
                            strokeWidth={selectedRegionId === 'kebumen' ? '3' : '2'}
                            className="transition-colors hover:opacity-90"
                          />
                          <text x="350" y="220" className="text-[12px] font-black fill-white pointer-events-none uppercase tracking-widest font-sans">Kebumen</text>
                          {/* Dot indicator for critical (low stock) */}
                          <circle cx="410" cy="230" r="5" fill="none" stroke="red" strokeWidth="2" className="animate-ping" />
                          <circle cx="410" cy="230" r="4.5" fill="red" />
                        </g>

                      </svg>
                      
                      <div className="absolute top-2 left-2 bg-stone-900/10 hover:bg-stone-900/20 rounded-lg p-2 text-[10px] font-semibold text-stone-600">
                        *Klik area pada peta wilayah untuk navigasi info detail.
                      </div>
                    </div>
                  </div>

                  {/* Panel detail for the selected Region */}
                  {(() => {
                    const r = REGION_DB.find(reg => reg.id === selectedRegionId) || REGION_DB[0];
                    return (
                      <div className="bg-white rounded-2xl p-5 border border-stone-200/60 shadow-xs lg:col-span-4 space-y-5">
                        
                        {/* Heading summary */}
                        <div className="border-b border-stone-100 pb-3 text-left">
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] uppercase font-bold text-stone-400">DETAIL WILAYAH MONITORING</span>
                            <span className={`text-[8.5px] font-mono px-2 py-0.5 rounded-full font-black uppercase ${
                              r.stockLevel === 'abundant' ? 'bg-[#5B7A60]/10 text-emerald-700 border border-emerald-300' : 'bg-rose-50 text-rose-700 border border-rose-300'
                            }`}>
                              {r.stockLevel === 'abundant' ? 'Sangat Aman' : 'Stok Menurun'}
                            </span>
                          </div>
                          <h3 className="text-xl font-black text-stone-900 mt-1">Kabupaten {r.name}</h3>
                          <p className="text-[11px] text-stone-500 mt-1 font-medium">Mitra supplier terafiliasi aktif: <strong>{r.activeSuppliers} kelompok tani</strong>.</p>
                        </div>

                        {/* Statistics Grid */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-stone-50 p-3 rounded-xl border border-stone-150">
                            <p className="text-[9.5px] text-stone-400 font-extrabold uppercase tracking-wider">Volume Stok Total</p>
                            <p className="text-lg font-black text-[#1A291E] mt-0.5">{r.totalStockTons} Ton</p>
                          </div>
                          <div className="bg-stone-50 p-3 rounded-xl border border-stone-150">
                            <p className="text-[9.5px] text-stone-400 font-extrabold uppercase tracking-wider">Valuasi Ekonomi</p>
                            <p className="text-sm font-black text-brand-orange mt-1.5">Rp {r.totalStockValue.toLocaleString('id-ID')}</p>
                          </div>
                        </div>

                        {/* List of prominent commodities in region */}
                        <div className="space-y-2.5 text-left">
                          <h4 className="text-xs font-black uppercase text-stone-500 tracking-wider">Ketersediaan Komoditas Utama</h4>
                          <div className="space-y-2">
                            {r.commodities.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center bg-[#FAF9F5] border border-stone-150 px-3 py-2 rounded-xl text-xs font-bold text-stone-700">
                                <span className="text-stone-800">{item.name}</span>
                                <div className="flex items-center space-x-2.5">
                                  <span>{item.stock} Ton</span>
                                  {item.trend === 'up' ? (
                                    <TrendingUp className="w-4.5 h-4.5 text-emerald-650 shrink-0" />
                                  ) : (
                                    <TrendingDown className="w-4.5 h-4.5 text-rose-500 shrink-0" />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Region stock trend chart */}
                        <div className="pt-2 border-t border-stone-100 text-left">
                          <h5 className="text-[10px] font-black uppercase text-stone-500 tracking-wider">Tren Ketahanan Stok Beras (5 Pekan)</h5>
                          <div className="flex h-12 items-end space-x-2 pt-3">
                            {r.trendData.map((val, idx) => {
                              const maxVal = Math.max(...r.trendData);
                              const heightPct = (val / maxVal) * 100;
                              return (
                                <div key={idx} className="flex-1 flex flex-col items-center space-y-1">
                                  <div 
                                    className="w-full bg-[#1A291E] hover:bg-[#5B7A60] rounded-xs transition-all cursor-pointer relative" 
                                    style={{ height: `${heightPct}%`, minHeight: '15%' }}
                                    title={`Tonase: ${val} t`}
                                  />
                                  <span className="text-[7.5px] font-extrabold text-stone-400 font-mono tracking-widest uppercase">W{idx+1}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                      </div>
                    );
                  })()}

                </div>
              </div>
            )}


            {/* 3. MENU: KOMODITAS (PRODUCT & STOCK CONTROLS) */}
            {currentMenu === 'commodities' && (
              <div className="space-y-6 text-left">
                {/* Routing headers */}
                <div>
                  <h2 className="text-2xl font-black text-stone-900 tracking-tight">Katalog & Ketersediaan Komoditas Wilayah</h2>
                  <p className="text-xs text-stone-500 mt-1 font-medium">Gunakan tab filter kustom di bawah ini untuk mencari, menyortir harga rata-rata, dan memantau stok bahan pangan strategis harian.</p>
                </div>

                {/* Search / filter header bars */}
                <div className="bg-white p-4.5 rounded-2xl border border-stone-200/60 shadow-xs flex flex-col md:flex-row gap-3">
                  <div className="relative flex-1 min-w-0">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Search className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={comSearch}
                      onChange={(e) => setComSearch(e.target.value)}
                      placeholder="Cari komoditas atau supplier pangan..."
                      className="w-full bg-[#FAF9F5] border border-stone-200 text-stone-800 rounded-xl pl-9 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#1A291E]"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {/* Region Filter Dropdown element */}
                    <div className="flex items-center space-x-1.5 min-w-[120px]">
                      <span className="text-[10px] font-extrabold uppercase text-stone-400">Wilayah:</span>
                      <select
                        value={comRegion}
                        onChange={(e) => setComRegion(e.target.value)}
                        className="bg-[#FAF9F5] border border-stone-200 text-stone-800 rounded-xl px-2.5 py-2.5 text-xs font-bold focus:outline-none"
                      >
                        <option value="all">Semua Wilayah</option>
                        <option value="Cianjur">Cianjur</option>
                        <option value="Sukabumi">Sukabumi</option>
                        <option value="Malang">Malang</option>
                        <option value="Magelang">Magelang</option>
                        <option value="Purbalingga">Purbalingga</option>
                        <option value="Banyumas">Banyumas</option>
                      </select>
                    </div>

                    {/* Stock status filter dropdown */}
                    <div className="flex items-center space-x-1.5 min-w-[110px]">
                      <span className="text-[10px] font-extrabold uppercase text-stone-400">Kategori Stok:</span>
                      <select
                        value={comStockStatus}
                        onChange={(e) => setComStockStatus(e.target.value)}
                        className="bg-[#FAF9F5] border border-stone-200 text-stone-800 rounded-xl px-2.5 py-2.5 text-xs font-bold focus:outline-none"
                      >
                        <option value="all">Semua Stok</option>
                        <option value="rich">Melimpah (&gt;20)</option>
                        <option value="depleted">Kritis (&lt;=20)</option>
                      </select>
                    </div>

                    {/* Sort Price filter drops */}
                    <div className="flex items-center space-x-1.5 min-w-[100px]">
                      <span className="text-[10px] font-extrabold uppercase text-stone-400">Harga:</span>
                      <select
                        value={comPriceSort}
                        onChange={(e) => setComPriceSort(e.target.value)}
                        className="bg-[#FAF9F5] border border-stone-200 text-stone-800 rounded-xl px-2.5 py-2.5 text-xs font-bold focus:outline-none"
                      >
                        <option value="all">Normal</option>
                        <option value="asc">Terendah - Tertinggi</option>
                        <option value="desc">Tertinggi - Terendah</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Filter and render grid/tables */}
                {(() => {
                  let filtered = products.filter(p => {
                    const matchesSearch = p.name.toLowerCase().includes(comSearch.toLowerCase()) || 
                                          p.seller.toLowerCase().includes(comSearch.toLowerCase());
                    const matchesRegion = comRegion === 'all' || p.seller.includes(comRegion);
                    const matchesStock = comStockStatus === 'all' || 
                        (comStockStatus === 'rich' ? p.stock > 20 : p.stock <= 20);
                    return matchesSearch && matchesRegion && matchesStock;
                  });

                  if (comPriceSort === 'asc') {
                    filtered = [...filtered].sort((a, b) => a.price - b.price);
                  } else if (comPriceSort === 'desc') {
                    filtered = [...filtered].sort((a, b) => b.price - a.price);
                  }

                  return (
                    <div className="space-y-6">
                      <div className="bg-white rounded-2xl border border-stone-200/60 shadow-xs overflow-hidden">
                        
                        {/* Desktop View Table */}
                        <div className="hidden sm:block overflow-x-auto">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="bg-[#FAF9F5] border-b border-stone-200/80 text-stone-500 font-extrabold uppercase tracking-wide">
                                <th className="p-4">Komoditas</th>
                                <th className="p-4">Supplier / Mitra</th>
                                <th className="p-4 text-right">Harga Satuan</th>
                                <th className="p-4 text-center">Volume Stok</th>
                                <th className="p-4">Status Mutu</th>
                                <th className="p-4"></th>
                              </tr>
                            </thead>
                            <tbody>
                              {filtered.map((p) => (
                                <tr key={p.id} className="border-b border-stone-100 hover:bg-stone-50/70 font-semibold text-stone-700">
                                  <td className="p-4 flex items-center space-x-3">
                                    <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover border border-stone-100" />
                                    <div>
                                      <p className="font-extrabold text-[#1A291E]">{p.name}</p>
                                      <p className="text-[10px] text-stone-400 font-bold mt-0.5">{p.category}</p>
                                    </div>
                                  </td>
                                  <td className="p-4 text-stone-600">
                                    <p className="text-stone-850 font-black">{p.seller}</p>
                                    <p className="text-[9.5px] text-stone-400 mt-0.5 flex items-center">
                                      <MapPin className="w-3 h-3 text-[#5B7A60] mr-0.5" />
                                      Cianjur/Purbalingga
                                    </p>
                                  </td>
                                  <td className="p-4 text-right text-brand-orange font-extrabold text-[12.5px]">
                                    Rp {p.price.toLocaleString('id-ID')}
                                  </td>
                                  <td className="p-4 text-center">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                                      p.stock > 20 ? 'bg-emerald-50 text-[#1A291E] border border-emerald-250' : 'bg-rose-50 text-rose-700 border border-rose-250'
                                    }`}>
                                      {p.stock} {p.unit}
                                    </span>
                                  </td>
                                  <td className="p-4">
                                    <span className="text-[9.5px] bg-brand-accent-blue/10 text-brand-accent-blue font-bold px-2 py-0.5 rounded border border-brand-accent-blue/15">
                                      BBPOM Lolos
                                    </span>
                                  </td>
                                  <td className="p-4 text-right">
                                    <button 
                                      onClick={() => setSelectedProductId(p.id)}
                                      className="bg-stone-900 hover:bg-stone-800 text-white font-extrabold px-3 py-1.5 rounded-lg text-[10.5px] cursor-pointer"
                                    >
                                      Detail Pergerakan
                                    </button>
                                  </td>
                                </tr>
                              ))}
                              {filtered.length === 0 && (
                                <tr>
                                  <td colSpan={6} className="text-center p-12 text-stone-400 font-bold">
                                    Tidak ditemukan komoditas pangan yang sesuai dengan filter.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>

                        {/* Mobile View Card Layout */}
                        <div className="sm:hidden p-4 space-y-4">
                          {filtered.map((p) => (
                            <div key={p.id} className="bg-[#FAF9F5] border border-stone-150 rounded-xl p-4 space-y-3 font-semibold text-xs relative">
                              <span className="absolute top-4 right-4 text-[10px] bg-[#32506E]/15 text-[#32506E] border border-[#32506E]/20 px-2 py-0.5 rounded-full font-black">
                                BBPOM OK
                              </span>

                              <div className="flex items-center space-x-3 text-left">
                                <img src={p.image} alt={p.name} className="w-12 h-12 rounded-lg object-cover border border-stone-200" />
                                <div>
                                  <h4 className="font-extrabold text-stone-850 text-sm leading-tight">{p.name}</h4>
                                  <p className="text-[10px] text-stone-400 uppercase tracking-wider font-extrabold mt-0.5">{p.category}</p>
                                </div>
                              </div>

                              <div className="flex justify-between items-center bg-white border border-stone-150 p-2.5 rounded-lg">
                                <div>
                                  <p className="text-[9px] text-stone-400 uppercase font-bold">Mitra Supplier</p>
                                  <p className="font-black text-stone-700">{p.seller}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-[9px] text-stone-400 uppercase font-bold">Harga Rata-Rata</p>
                                  <p className="font-extrabold text-brand-orange">Rp {p.price.toLocaleString('id-ID')}</p>
                                </div>
                              </div>

                              <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-1">
                                  <span className="text-[10px] text-stone-500 font-bold">Volume:</span>
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                                    p.stock > 20 ? 'bg-emerald-50 text-[#1A291E] border border-emerald-250' : 'bg-rose-50 text-rose-700 border border-rose-250'
                                  }`}>
                                    {p.stock} {p.unit}
                                  </span>
                                </div>

                                <button 
                                  onClick={() => setSelectedProductId(p.id)}
                                  className="bg-stone-900 hover:bg-stone-800 text-white font-extrabold px-3 py-1.5 rounded-lg text-[10px] cursor-pointer"
                                >
                                  Detail Pergerakan
                                </button>
                              </div>
                            </div>
                          ))}
                          {filtered.length === 0 && (
                            <p className="text-stone-400 font-bold text-center text-xs py-8">Tidak ditemukan data pangan.</p>
                          )}
                        </div>

                      </div>

                      {/* Detail overlay panel if product selected */}
                      <AnimatePresence>
                        {selectedProductId && (() => {
                          const p = products.find(prod => prod.id === selectedProductId);
                          if (!p) return null;
                          return (
                            <motion.div
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 15 }}
                              className="bg-white p-6 rounded-2xl border border-stone-200 shadow-md space-y-6"
                            >
                              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                                <div>
                                  <span className="text-[10px] font-black uppercase text-[#C85A32]">HISTORIS DETIL PRODUK</span>
                                  <h3 className="text-lg font-black text-stone-900 mt-1">{p.name}</h3>
                                </div>
                                <button
                                  onClick={() => setSelectedProductId(null)}
                                  className="text-stone-400 hover:bg-stone-100 p-1.5 rounded-full"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Price Trend (Interactive Line Chart Mock) */}
                                <div className="space-y-3">
                                  <h4 className="text-xs font-black uppercase text-[#1A291E] tracking-wider">Pergerakan Harga Harian (2 Pekan)</h4>
                                  <div className="bg-[#FAF9F5] border border-stone-150 p-4 rounded-xl flex flex-col justify-between h-36">
                                    <div className="flex justify-between items-center text-[10px] text-stone-400 font-bold">
                                      <span>Maks: Rp {(p.price + 5000).toLocaleString('id-ID')}</span>
                                      <span className="text-emerald-500 font-bold flex items-center">
                                        <TrendingUp className="w-3 h-3 mr-0.5" />
                                        +2.5%
                                      </span>
                                    </div>
                                    <div className="h-16 w-full relative pt-2">
                                      {/* Mini custom SVG sparkline */}
                                      <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                                        <path d="M 0 25 L 20 20 L 40 22 L 60 12 L 80 15 L 100 5" fill="none" stroke="#C85A32" strokeWidth="2" strokeLinecap="round" />
                                        <circle cx="100" cy="5" r="2.5" fill="#1A291E" stroke="#C85A32" strokeWidth="1" />
                                      </svg>
                                    </div>
                                    <div className="flex justify-between text-[8px] text-stone-400 font-mono font-bold uppercase mt-1">
                                      <span>24 Mei</span>
                                      <span>06 Juni (Hari ini)</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Stock distribution list per region */}
                                <div className="space-y-3">
                                  <h4 className="text-xs font-black uppercase text-[#1A291E] tracking-wider">Distribusi Volume Stok</h4>
                                  <div className="bg-[#FAF9F5] border border-stone-150 p-4 rounded-xl space-y-2.5 text-xs font-bold h-36 overflow-y-auto">
                                    <div className="flex justify-between">
                                      <span className="text-stone-500">Banyumas Utama</span>
                                      <span className="text-stone-850">{(p.stock * 0.5).toFixed(0)} {p.unit}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-stone-500">Purbalingga Pasokan</span>
                                      <span className="text-stone-850">{(p.stock * 0.3).toFixed(0)} {p.unit}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-stone-500">Banjarnegara Pasokan</span>
                                      <span className="text-stone-850">{(p.stock * 0.2).toFixed(0)} {p.unit}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Availability Analysis forecast */}
                                <div className="space-y-3">
                                  <h4 className="text-xs font-black uppercase text-[#1A291E] tracking-wider">Prediksi Ketersediaan Stok</h4>
                                  <div className="bg-[#1A291E] text-[#c9e7cd] border border-stone-900 p-4 rounded-xl space-y-2.5 text-xs font-bold h-36 flex flex-col justify-between">
                                    <span className="text-[11px] font-medium leading-relaxed block text-stone-250 italic">
                                      "Berdasarkan pola pemesanan harian UMKM dan laju pengiriman logistik, stok ketersediaan pangan aman untuk <strong>14 hari ke depan</strong> tanpa lonjakan harga residu."
                                    </span>
                                    <div className="text-[9.5px] uppercase font-mono tracking-widest text-[#5B7A60]">
                                      KEAMANAN: TINGGI (Surplus)
                                    </div>
                                  </div>
                                </div>

                              </div>
                            </motion.div>
                          );
                        })()}
                      </AnimatePresence>

                    </div>
                  );
                })()}

              </div>
            )}


            {/* 4. MENU: TRANSAKSI (ORDERS & CORE TIMELINE DETAILS) */}
            {currentMenu === 'transactions' && (
              <div className="space-y-6 text-left">
                {/* Router description headers */}
                <div>
                  <h2 className="text-2xl font-black text-[#1A291E] tracking-tight">Riwayat & Monitoring Transaksi Escrow</h2>
                  <p className="text-xs text-stone-500 mt-1 font-medium">Lacak dana penjualan, rubah milestones status pengiriman logistik, serta tinjau pencairan real-time dana escrow.</p>
                </div>

                {/* Filters Row */}
                <div className="bg-white p-4.5 rounded-2xl border border-stone-200/60 shadow-xs flex flex-col md:flex-row gap-3">
                  <div className="relative flex-1 min-w-0">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Search className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={txSearch}
                      onChange={(e) => setTxSearch(e.target.value)}
                      placeholder="Cari ID transaksi, pembeli, produk, atau supplier..."
                      className="w-full bg-[#FAF9F5] border border-stone-200 text-stone-850 rounded-xl pl-9 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#1A291E]"
                    />
                  </div>

                  <div className="flex gap-2.5 flex-wrap">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[10px] font-extrabold uppercase text-stone-400">Status:</span>
                      <select
                        value={txStatus}
                        onChange={(e) => setTxStatus(e.target.value)}
                        className="bg-[#FAF9F5] border border-stone-200 text-stone-800 rounded-xl px-2.5 py-2.5 text-xs font-bold focus:outline-none"
                      >
                        <option value="all">Semua Status</option>
                        <option value="Menunggu Pembayaran">Menunggu Bayar</option>
                        <option value="Dana Ditahan">Dana Ditahan</option>
                        <option value="Sedang Dikirim">Dikirim</option>
                        <option value="Selesai">Selesai / Cair</option>
                        <option value="Dibatalkan">Refund</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Table implementation rendering responsively */}
                {(() => {
                  const filtered = orders.filter(o => {
                    const matchesSearch = o.id.toLowerCase().includes(txSearch.toLowerCase()) ||
                                          o.merchant.toLowerCase().includes(txSearch.toLowerCase()) ||
                                          (o.items && o.items[0]?.product.name.toLowerCase().includes(txSearch.toLowerCase()));
                    const matchesStatus = txStatus === 'all' || o.status === txStatus;
                    return matchesSearch && matchesStatus;
                  });

                  return (
                    <div className="space-y-6">
                      <div className="bg-white rounded-2xl border border-stone-200/60 shadow-xs overflow-hidden">
                        
                        {/* Desktop layout */}
                        <div className="hidden sm:block overflow-x-auto">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="bg-[#FAF9F5] border-b border-stone-200/80 text-stone-500 font-extrabold uppercase tracking-wide">
                                <th className="p-4">ID Transaksi</th>
                                <th className="p-4">Pembeli / Buyer</th>
                                <th className="p-4">Produk Utama</th>
                                <th className="p-4 text-right">Nilai Rupiah</th>
                                <th className="p-4">Tanggal Masuk</th>
                                <th className="p-4 text-center">Status Jual-Beli</th>
                                <th className="p-4"></th>
                              </tr>
                            </thead>
                            <tbody>
                              {filtered.map((o) => (
                                <tr key={o.id} className="border-b border-stone-100 hover:bg-stone-50/70 font-semibold text-stone-700">
                                  <td className="p-4 font-black text-stone-900 font-mono">
                                    {o.id}
                                  </td>
                                  <td className="p-4">
                                    <p className="font-extrabold text-stone-850">Budi Santoso (UMKM)</p>
                                    <p className="text-[9.5px] text-stone-400 font-bold uppercase mt-0.5 mt-1 font-mono">Cianjur Raya</p>
                                  </td>
                                  <td className="p-4 text-stone-600 max-w-[150px] truncate">
                                    {o.items && o.items[0] ? o.items[0].product.name : 'Sembako Beras Kombinasi'}
                                  </td>
                                  <td className="p-4 text-right text-brand-orange font-extrabold text-sm">
                                    Rp {o.totalPayment.toLocaleString('id-ID')}
                                  </td>
                                  <td className="p-4 text-stone-400 font-bold uppercase font-mono text-[9px] tracking-wide">
                                    {o.orderDate}
                                  </td>
                                  <td className="p-4 text-center">
                                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase font-mono ${
                                      o.status === 'Selesai' 
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-300' 
                                        : o.status === 'Menunggu Pembayaran'
                                        ? 'bg-amber-50 text-amber-700 border border-amber-300'
                                        : o.status === 'Dibatalkan'
                                        ? 'bg-rose-50 text-rose-700 border border-rose-300'
                                        : 'bg-blue-50 text-blue-700 border border-blue-300'
                                    }`}>
                                      {o.status}
                                    </span>
                                  </td>
                                  <td className="p-4 text-right">
                                    <button
                                      onClick={() => setSelectedOrderId(o.id)}
                                      className="bg-stone-900 hover:bg-stone-800 text-white font-extrabold px-3 py-1.5 rounded-lg text-[10px] cursor-pointer"
                                    >
                                      Ubah Milestone
                                    </button>
                                  </td>
                                </tr>
                              ))}
                              {filtered.length === 0 && (
                                <tr>
                                  <td colSpan={7} className="text-center p-12 text-stone-400 font-bold">
                                    Tidak ditemukan transaksi escrow yang sesuai filter.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>

                        {/* Mobile card-view layout */}
                        <div className="sm:hidden p-4 space-y-4">
                          {filtered.map((o) => (
                            <div key={o.id} className="bg-[#FAF9F5] border border-stone-150 rounded-xl p-4 space-y-3 font-semibold text-xs text-left relative">
                              <div className="flex justify-between items-center border-b border-stone-100 pb-2">
                                <span className="font-extrabold font-mono text-[#1A291E]">{o.id}</span>
                                <span className={`px-2.5 py-0.5 rounded text-[8.5px] font-black uppercase font-mono ${
                                  o.status === 'Selesai' 
                                    ? 'bg-emerald-50 text-emerald-750' 
                                    : o.status === 'Menunggu Pembayaran'
                                    ? 'bg-amber-50 text-amber-750'
                                    : 'bg-blue-50 text-blue-750'
                                }`}>
                                  {o.status}
                                </span>
                              </div>

                              <div className="space-y-1">
                                <p className="text-[10px] text-stone-400 font-bold uppercase">Pembeli & Pengiriman</p>
                                <p className="font-extrabold text-stone-850">Bapak Budi Santoso</p>
                                <p className="text-stone-500 text-[10.5px]">Item: {o.items && o.items[0] ? o.items[0].product.name : 'Sembako Tani'}</p>
                              </div>

                              <div className="flex justify-between items-center pt-1.5">
                                <span className="text-stone-500 font-mono text-[9.5px] uppercase">{o.orderDate}</span>
                                <span className="text-brand-orange font-extrabold text-sm">
                                  Rp {o.totalPayment.toLocaleString('id-ID')}
                                </span>
                              </div>

                              <button
                                onClick={() => setSelectedOrderId(o.id)}
                                className="w-full bg-stone-900 text-white font-extrabold py-2 rounded-lg text-[10px] mt-1 cursor-pointer text-center"
                              >
                                Tinjau Detil Milestone
                              </button>
                            </div>
                          ))}
                          {filtered.length === 0 && (
                            <p className="text-stone-400 font-bold text-center text-xs py-8">Tidak ditemukan pesanan.</p>
                          )}
                        </div>

                      </div>

                      {/* Detail Transaction Overlay for specific timeline review */}
                      <AnimatePresence>
                        {selectedOrderId && (() => {
                          const o = orders.find(ord => ord.id === selectedOrderId);
                          if (!o) return null;
                          return (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.98 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.98 }}
                              className="bg-white p-6 rounded-2xl border border-stone-200 shadow-lg space-y-6 text-left"
                            >
                              <div className="flex items-center justify-between border-b border-stone-105 pb-3 shrink-0">
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-[10px] uppercase font-bold text-stone-400">TRANSAKSI ESCROW LOG</span>
                                    <span className="bg-stone-950 text-white text-[8px] font-mono px-1.5 py-0.2 rounded">
                                      ID: {o.id}
                                    </span>
                                  </div>
                                  <h3 className="text-base font-black text-stone-900 mt-1">Detail Timeline Alur Distribusi</h3>
                                </div>
                                <button
                                  onClick={() => setSelectedOrderId(null)}
                                  className="text-stone-400 hover:bg-stone-50 p-2 rounded-full cursor-pointer"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Supplier & Buyer info summary */}
                                <div className="space-y-4">
                                  <div className="bg-[#FAF9F5] border border-stone-150 rounded-xl p-4 space-y-4 text-xs font-semibold">
                                    <div className="flex items-center space-x-2 text-[#1A291E]">
                                      <Users className="w-4.5 h-4.5" />
                                      <span className="text-[11px] font-black uppercase tracking-wider">Identitas Mitra Jaringan</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3.5 pt-1.5 text-stone-700">
                                      <div>
                                        <p className="text-[10px] text-stone-400 uppercase font-bold leading-normal">Pembeli / Buyer</p>
                                        <p className="font-extrabold text-[#1A291E] mt-0.5">Budi Santoso (UMKM)</p>
                                        <p className="text-stone-450 text-[10px] leading-relaxed">Cianjur, Jawa Barat</p>
                                      </div>
                                      <div>
                                        <p className="text-[10px] text-stone-400 uppercase font-bold leading-normal">Mitra Supplier</p>
                                        <p className="font-extrabold text-[#1A291E] mt-0.5">{o.merchant}</p>
                                        <p className="text-stone-450 text-[10px] leading-relaxed">Gudang Logistik Utama</p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Ordered items details */}
                                  <div className="bg-[#FAF9F5] border border-stone-150 rounded-xl p-4 space-y-3.5 text-xs font-semibold">
                                    <p className="text-[11px] font-black text-[#1A291E] uppercase tracking-wider">Rincian Komoditas</p>
                                    <div className="space-y-3 pt-1">
                                      {o.items ? o.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-stone-700">
                                          <div className="text-left">
                                            <p className="font-extrabold text-stone-900">{item.product.name}</p>
                                            <p className="text-[10.5px] text-stone-400 mt-0.5">{item.quantity} x Rp {item.product.price.toLocaleString('id-ID')}</p>
                                          </div>
                                          <span className="font-extrabold text-[#1A291E]">Rp {(item.quantity * item.product.price).toLocaleString('id-ID')}</span>
                                        </div>
                                      )) : (
                                        <p className="text-stone-400">Komoditas Beras Kombinasi (50kg)</p>
                                      )}
                                    </div>
                                    <div className="border-t border-stone-200/80 pt-3 flex justify-between items-center text-xs font-bold text-stone-800">
                                      <span>Total Tagihan Jual-Beli:</span>
                                      <span className="text-brand-orange text-sm font-extrabold">Rp {o.totalPayment.toLocaleString('id-ID')}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Timeline milestone controls & update statuses */}
                                <div className="space-y-4">
                                  <h4 className="text-xs font-black uppercase text-[#1A291E] tracking-wider">Status Milestones Kemitraan</h4>
                                  
                                  {/* Timeline visual graphics */}
                                  <div className="space-y-3.5 pl-4 relative before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
                                    
                                    <div className="flex items-start space-x-3 text-xs text-left relative">
                                      <div className="absolute -left-4 w-3.5 h-3.5 bg-brand-orange border border-white rounded-full mt-1.5" />
                                      <div>
                                        <p className="font-extrabold text-stone-850">Pembayaran QRIS / COD</p>
                                        <p className="text-[10px] text-stone-400 mt-0.5 uppercase tracking-wide font-mono font-bold leading-normal">
                                          {o.status === 'Menunggu Pembayaran' ? 'MENUNGGU VERIFIKASI QRIS' : 'LUNAS (VERIFIED DANA ESCROW)'}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex items-start space-x-3 text-xs text-left relative">
                                      <div className={`absolute -left-4 w-3.5 h-3.5 border border-white rounded-full mt-1.5 ${
                                        ['Sedang Dikirim', 'Selesai'].includes(o.status) ? 'bg-[#5B7A60]' : 'bg-stone-200'
                                      }`} />
                                      <div>
                                        <p className="font-extrabold text-stone-850">Proses Supplier & Pengiriman Logistik</p>
                                        <p className="text-[10px] text-stone-400 mt-0.5 leading-normal">Armada pengantar logistik sedang mengudara.</p>
                                      </div>
                                    </div>

                                    <div className="flex items-start space-x-3 text-xs text-left relative">
                                      <div className={`absolute -left-4 w-3.5 h-3.5 border border-white rounded-full mt-1.5 ${
                                        o.status === 'Selesai' ? 'bg-[#1A291E]' : 'bg-stone-200'
                                      }`} />
                                      <div>
                                        <p className="font-extrabold text-stone-850">Barang Diterima & Dana Dicairkan</p>
                                        <p className="text-[10px] text-stone-400 mt-0.5 leading-normal">Selesaikan transaksi untuk mentransfer kas escrow.</p>
                                      </div>
                                    </div>

                                  </div>

                                  {/* Update action controls directly */}
                                  <div className="p-4.5 bg-[#FAF9F5] border border-stone-200/60 rounded-xl space-y-3">
                                    <p className="text-[11px] font-extrabold uppercase text-stone-500 tracking-wider mb-2">Tindakan Admin Escrow</p>
                                    <div className="flex space-x-2">
                                      <button
                                        onClick={() => handleUpdateOrderStatus(o.id, 'Menunggu Pembayaran')}
                                        className={`flex-1 text-[10px] font-bold py-2 rounded-lg text-center cursor-pointer ${
                                          o.status === 'Menunggu Pembayaran' ? 'bg-amber-500 text-white' : 'bg-stone-100 text-stone-600'
                                        }`}
                                      >
                                        Set Menunggu Bayar
                                      </button>
                                      <button
                                        onClick={() => handleUpdateOrderStatus(o.id, 'Sedang Dikirim')}
                                        className={`flex-1 text-[10px] font-bold py-2 rounded-lg text-center cursor-pointer ${
                                          o.status === 'Sedang Dikirim' ? 'bg-blue-600 text-white' : 'bg-stone-100 text-stone-600'
                                        }`}
                                      >
                                        Set Dikirim
                                      </button>
                                      <button
                                        onClick={() => handleUpdateOrderStatus(o.id, 'Selesai')}
                                        className={`flex-1 text-[10px] font-bold py-2 rounded-lg text-center cursor-pointer ${
                                          o.status === 'Selesai' ? 'bg-emerald-700 text-white' : 'bg-stone-100 text-stone-600'
                                        }`}
                                      >
                                        Selesaikan & Cairkan
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* MONITORING DANA PANEL AT THE BOTTOM OF TRANS DETAILS */}
                              <div className="bg-[#1f3826]/5 rounded-2xl p-5 border border-[#1f3826]/12 space-y-3.5">
                                <div className="flex items-center space-x-2 text-[#1A291E]">
                                  <HandCoins className="w-5 h-5 text-[#5B7A60]" />
                                  <h4 className="text-xs font-black uppercase tracking-widest text-[#1A291E]">Sistem Pengendalian Aliran Dana Jaminan (Escrow)</h4>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5 text-xs font-semibold">
                                  <div className="p-3 bg-white rounded-xl border border-stone-150 flex flex-col justify-between">
                                    <div>
                                      <span className="text-[10px] text-stone-400 font-extrabold uppercase">1. Dana Escrow Ditahan</span>
                                      <span className="text-xs font-black text-[#1A291E] mt-1 block">Rp {o.status !== 'Selesai' && o.status !== 'Dibatalkan' ? o.totalPayment.toLocaleString('id-ID') : 'Rp 0'}</span>
                                    </div>
                                    <span className="text-[8.5px] text-stone-400 mt-2 italic font-medium leading-normal block">Mengamankan dana hingga barang bermutu sampai.</span>
                                  </div>

                                  <div className="p-3 bg-white rounded-xl border border-stone-150 flex flex-col justify-between">
                                    <div>
                                      <span className="text-[10px] text-stone-400 font-extrabold uppercase">2. Dana Bersih Cair</span>
                                      <span className="text-xs font-black text-emerald-700 mt-1 block">Rp {o.status === 'Selesai' ? o.totalPayment.toLocaleString('id-ID') : 'Rp 0'}</span>
                                    </div>
                                    <span className="text-[8.5px] text-stone-400 mt-2 italic font-medium leading-normal block">Diteruskan ke dompet kas saldo mitra supplier.</span>
                                  </div>

                                  <div className="p-3 bg-white rounded-xl border border-stone-150 flex flex-col justify-between">
                                    <div>
                                      <span className="text-[10px] text-stone-400 font-extrabold uppercase">3. Total Jaminan Refund</span>
                                      <span className="text-xs font-black text-rose-700 mt-1 block">Rp {o.status === 'Dibatalkan' ? o.totalPayment.toLocaleString('id-ID') : 'Rp 0'}</span>
                                    </div>
                                    <span className="text-[8.5px] text-stone-400 mt-2 italic font-medium leading-normal block">Kompensasi mutlak dibalikan ke kas saldo UMKM.</span>
                                  </div>
                                </div>
                              </div>

                            </motion.div>
                          );
                        })()}
                      </AnimatePresence>

                    </div>
                  );
                })()}

              </div>
            )}

          </main>
        </div>
      )}

    </div>
  );
}
