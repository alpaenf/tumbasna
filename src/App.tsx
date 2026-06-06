import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, ShoppingBag, ClipboardList, MessageSquare, User, 
  Sparkles, Layers, Sliders, ChevronLeft, ArrowRight, ShieldCheck, PhoneCall 
} from 'lucide-react';

// Import Types
import { ViewScreen, Product, Order, ChatMessage, OrderItem } from './types';

// Import Mock Data
import { MOCK_PRODUCTS, INITIAL_ORDERS, INITIAL_CHATS } from './data';

// Import Screen Subcomponents
import SplashScreen from './components/SplashScreen';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import HomeScreen from './components/HomeScreen';
import PasarScreen from './components/PasarScreen';
import CheckoutScreen from './components/CheckoutScreen';
import WaitingPaymentScreen from './components/WaitingPaymentScreen';
import SuccessPaymentScreen from './components/SuccessPaymentScreen';
import DetailPesananScreen from './components/DetailPesananScreen';
import DaftarPesananScreen from './components/DaftarPesananScreen';
import ChatScreen from './components/ChatScreen';
import AkunScreen from './components/AkunScreen';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  // Global States
  const [activeRole, setActiveRole] = useState<'buyer' | 'admin'>('buyer');
  const [activeScreen, setActiveScreen] = useState<ViewScreen>('splash');
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [chats, setChats] = useState<ChatMessage[]>(INITIAL_CHATS);
  
  // Active details references
  const [activeOrderId, setActiveOrderId] = useState<string>('TMB-98273645');
  const [customNews, setCustomNews] = useState<{ title: string; text: string } | null>(null);

  // User entity details
  const [user, setUser] = useState({
    businessName: 'Budi UMKM',
    ownerName: 'Bapak Budi Santoso',
    phone: '+62 812 3456 7890',
    email: 'budi.santoso@gmail.com',
    location: 'Desa Makmur, Cianjur',
    address: 'Jl. Pertanian Raya No. 45, Desa Makmur, Kec. Sukamaju, Kab. Malang',
    category: 'Sayuran Organik & Umbi-umbian',
    balance: 450000, // Rp 450.000,00 matching Akun Screen 11 image
    expendituresMonth: 'Rp 4.250.000' // matching Home Screen 2 image
  });

  // Global Toast alerts
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 11 Screens Quick Preset Loader (Excellent for user verification)
  const loadScreenPreset = (screenIndex: number) => {
    switch (screenIndex) {
      case 1: // Splash / Welcome
        setActiveScreen('splash');
        triggerToast('Memuat Visual Screen 1: Splash Welcome');
        break;
      case 2: // Home / Beranda
        setActiveScreen('home');
        setUser(prev => ({
          ...prev,
          businessName: 'Budi UMKM',
          expendituresMonth: 'Rp 4.250.000'
        }));
        triggerToast('Memuat Visual Screen 2: Beranda (Budi UMKM)');
        break;
      case 3: // Login Screen
        setActiveScreen('login');
        triggerToast('Memuat Visual Screen 3: Selamat Datang (Login)');
        break;
      case 4: // Register / Informasi Akun
        setActiveScreen('register');
        triggerToast('Memuat Visual Screen 4: Informasi Akun (Daftar Buy)');
        break;
      case 5: // Checkout Belanja
        setActiveScreen('checkout');
        // Pre-fill cart with exact items in the screenshot to match sum Rp 72.000
        setCart([
          { product: MOCK_PRODUCTS[0], quantity: 1 }, // Selada Hidroponik (25.000)
          { product: MOCK_PRODUCTS[1], quantity: 1 }  // Kentang Dieng (30.000)
        ]);
        triggerToast('Memuat Visual Screen 5: Checkout (Rp 72.000)');
        break;
      case 6: // Waiting Payment QRIS
        setActiveScreen('waiting-payment');
        setActiveOrderId('TMB-98273645');
        triggerToast('Memuat Visual Screen 6: Menunggu Pembayaran QRIS');
        break;
      case 7: // Pembayaran Berhasil Receipt
        setActiveScreen('success-payment');
        setActiveOrderId('TMB-98273645');
        triggerToast('Memuat Visual Screen 7: Pembayaran Berhasil Invoice');
        break;
      case 8: // Detail Status Pesanan (Rojolele)
        setActiveScreen('detail-pesanan');
        setActiveOrderId('TMB-98273645');
        triggerToast('Memuat Visual Screen 8: Detail Pesanan (Rojolele)');
        break;
      case 9: // Daftar Riwayat Pesanan list view
        setActiveScreen('daftar-pesanan');
        triggerToast('Memuat Visual Screen 9: Daftar Riwayat Pesanan');
        break;
      case 10: // Chat Negosiasi PT. Agro
        setActiveScreen('chat');
        triggerToast('Memuat Visual Screen 10: Chat dengan PT. Agro Nusantara');
        break;
      case 11: // Profile dashboard Akun
        setActiveScreen('akun');
        setUser(prev => ({
          ...prev,
          businessName: 'Tani Maju Sejahtera',
          balance: 450000
        }));
        triggerToast('Memuat Visual Screen 11: Akun Penjual (Top Up)');
        break;
    }
  };

  // Cart operations
  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const idx = prev.findIndex(item => item.product.id === product.id);
      if (idx !== -1) {
        const replacement = [...prev];
        replacement[idx] = { ...prev[idx], quantity: prev[idx].quantity + 1 };
        return replacement;
      }
      return [...prev, { product, quantity: 1 }];
    });
    triggerToast(`Ditambahkan ke keranjang: ${product.name}`);
  };

  const handleRemoveFromCart = (product: Product) => {
    setCart(prev => {
      const idx = prev.findIndex(item => item.product.id === product.id);
      if (idx === -1) return prev;
      
      const replacement = [...prev];
      if (prev[idx].quantity > 1) {
        replacement[idx] = { ...prev[idx], quantity: prev[idx].quantity - 1 };
        return replacement;
      }
      return prev.filter(item => item.product.id !== product.id);
    });
  };

  // Complete Payment Action triggers
  const handlePayNow = (paymentMethod: 'QRIS' | 'COD', totalSum: number, ongkir: number) => {
    // Generate new order
    const newId = `TMB-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const newOrder: Order = {
      id: newId,
      merchant: cart.length > 0 ? cart[0].product.seller : 'Koperasi Tani Makmur',
      items: cart.length > 0 ? [...cart] : [
        { product: MOCK_PRODUCTS[0], quantity: 1 },
        { product: MOCK_PRODUCTS[1], quantity: 1 }
      ],
      subtotal: totalSum - ongkir - 2000,
      ongkir,
      biayaAdmin: 2000,
      totalPayment: totalSum,
      paymentMethod,
      status: paymentMethod === 'QRIS' ? 'Menunggu Pembayaran' : 'Sedang Dikirim',
      orderDate: '6 Jun 2026',
      paymentTimeLimit: '14:59',
      trackingHistory: [
        { status: 'Pesanan Diterima', description: 'Konfirmasi penerimaan untuk menyelesaikan pesanan.', time: '', completed: false },
        { status: 'Pesanan Dalam Pengiriman', description: 'Kurir sedang menuju alamat pengiriman Anda.', time: '6 Jun 2026, 12:00 WIB', completed: true },
        { status: 'Konfirmasi Penjual', description: 'Penjual telah mengonfirmasi dan mempersiapkan hasil tani.', time: '6 Jun 2026, 10:10 WIB', completed: true },
        { status: 'Pembayaran Berhasil', description: 'Dana aman didepositokan di sistem escrow TumbasNa.', time: '6 Jun 2026, 09:40 WIB', completed: true }
      ],
      supplyChainInfo: {
        harvestLocation: 'Lahan Sukamulya, Cianjur',
        harvestDate: '01 Jun 2026',
        plantingDate: '10 Feb 2026',
        pesticideInfo: 'Lolos Residul Kimia Bebas Organik',
        fertilizerInfo: 'Kompos Hayati Standard Tumbasna'
      }
    };

    setOrders(prev => [newOrder, ...prev]);
    setActiveOrderId(newId);
    setCart([]); // Clear cart out

    if (paymentMethod === 'QRIS') {
      setActiveScreen('waiting-payment');
    } else {
      setActiveScreen('success-payment');
    }
  };

  const handleInstantCheckout = (items: { product: any; quantity: number }[]) => {
    setCart(items);
    setActiveScreen('checkout');
    triggerToast('Rekomendasi AI dimasukkan ke keranjang belanja!');
  };

  // Chat messaging operations
  const handleSendMessage = (text: string) => {
    // Client sent bubble
    const timeNow = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: 'buyer',
      text,
      time: timeNow
    };

    setChats(prev => [...prev, userMsg]);

    // Simulated response from PT. Agro Nusantara
    setTimeout(() => {
      let replyText = 'Baik Pak, pesan Anda kami sampaikan ke penanggung jawab logistik.';
      if (text.toLowerCase().includes('beras') || text.toLowerCase().includes('stok')) {
        replyText = 'Stok beras kami sangat stabil untuk minggu ini. Silakan langsung lakukan order di menu Pasar.';
      } else if (text.toLowerCase().includes('harga') || text.toLowerCase().includes('diskon')) {
        replyText = 'Untuk pembelian di atas 50 karung, kami bisa berikan potongan negosiasi khusus, silakan ajukan rinciannya pak.';
      }

      const botMsg: ChatMessage = {
        id: `m-bot-${Date.now()}`,
        sender: 'seller',
        text: replyText,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };
      setChats(prev => [...prev, botMsg]);
    }, 1500);
  };

  // Chat Agreement Offer triggers
  const handleAcceptAgreement = (fee: number) => {
    // Update Chat status
    setChats(prev => prev.map(msg => {
      if (msg.isActionRequired) {
        return { ...msg, actionStatus: 'accepted' };
      }
      return msg;
    }));

    // Append buyer positive agreement statement
    const timeNow = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    setChats(prev => [
      ...prev,
      {
        id: `m-accept-${Date.now()}`,
        sender: 'buyer',
        text: 'Saya setuju dengan tambahan ongkir Rp 150.000, tolong segera siapkan pesanannya!',
        time: timeNow
      }
    ]);

    // Update expenditures statistic and user active balance check
    setUser(prev => ({
      ...prev,
      balance: Math.max(0, prev.balance - fee)
    }));

    // Generate negotiated rice package custom order automatically!
    const customOrderId = `TMB-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const customOrder: Order = {
      id: customOrderId,
      merchant: 'PT. Agro Nusantara',
      items: [
        {
          product: MOCK_PRODUCTS[5], // Beras Pandan Wangi karung 50kg
          quantity: 20
        }
      ],
      subtotal: 13000000,
      ongkir: fee,
      biayaAdmin: 2000,
      totalPayment: 13152000,
      paymentMethod: 'QRIS',
      status: 'Sedang Dikirim',
      orderDate: '6 Jun 2026',
      trackingHistory: [
        { status: 'Pesanan Diterima', description: 'Konfirmasi barang sampai di gudang.', time: '', completed: false },
        { status: 'Pesanan Dalam Pengiriman', description: 'Armada logistik sedang mengantar ke Jakarta Barat.', time: '6 Jun 2026, 10:15 WIB', completed: true }
      ]
    };
    setOrders(prev => [customOrder, ...prev]);

    // Auto-reply success log
    setTimeout(() => {
      setChats(prev => [
        ...prev,
        {
          id: `m-bot-reply-${Date.now()}`,
          sender: 'seller',
          text: 'Terima kasih pak Budi, pembayaran tambahan telah diverifikasi dan pesanan 20 karung Beras Pandan Wangi dalam pengiriman armada logistik kami!',
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      triggerToast('Pesanan Khusus dari Chat Negosiasi telah Dibuat!');
    }, 1500);
  };

  const handleDeclineAgreement = () => {
    setChats(prev => prev.map(msg => {
      if (msg.isActionRequired) {
        return { ...msg, actionStatus: 'declined' };
      }
      return msg;
    }));

    // Append buyer decline statement
    const timeNow = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    setChats(prev => [
      ...prev,
      {
        id: `m-decline-${Date.now()}`,
        sender: 'buyer',
        text: 'Mohon maaf, ongkir tambahannya terlalu besar bagi margin UMKM saya. Bisa tolong dikurangi?',
        time: timeNow
      }
    ]);

    // Auto-reply retry negotiation
    setTimeout(() => {
      setChats(prev => [
        ...prev,
        {
          id: `m-bot-reply-${Date.now()}`,
          sender: 'seller',
          text: 'Kami memahami kondisi tersebut pak Budi. Mari kami kalkulasikan rute alternatif dengan konsolidasi truk pengiriman lain esok lusa untuk menghemat biaya.',
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1500);
  };

  // Main UI Screen Renderer Switcher Node
  const renderScreenContent = () => {
    switch (activeScreen) {
      case 'splash':
        return (
          <SplashScreen 
            onContinue={() => setActiveScreen('login')} 
            onEnterAdmin={() => {
              setActiveRole('admin');
              triggerToast('Membuka Portal Pengelola Admin Tumbasna');
            }}
          />
        );
      
      case 'login':
        return (
          <LoginScreen 
            onLogin={(phone) => {
              setUser(prev => ({ ...prev, phone: `+62 ${phone}` }));
              setActiveScreen('home');
              triggerToast('Masuk sebagai Budi UMKM');
            }} 
            onGoToRegister={() => setActiveScreen('register')}
            onBack={() => setActiveScreen('splash')}
          />
        );
      
      case 'register':
        return (
          <RegisterScreen 
            onRegister={(values) => {
              setUser(prev => ({
                ...prev,
                businessName: values.businessName,
                ownerName: 'Bapak ' + values.businessName.split(' ')[0],
                phone: `+62 ${values.phone}`,
                email: values.email || 'pembeli@tumbasna.id'
              }));
              setActiveScreen('home');
              triggerToast('Registrasi Buyer Berhasil!');
            }}
            onGoToLogin={() => setActiveScreen('login')}
            onBack={() => setActiveScreen('login')}
          />
        );
      
      case 'home':
        return (
          <HomeScreen 
            user={user}
            activeOrdersCount={orders.filter(o => o.status !== 'Selesai' && o.status !== 'Dibatalkan').length}
            onClickCekStatus={() => setActiveScreen('daftar-pesanan')}
            onClickCariProduk={() => setActiveScreen('pasar')}
            onClickDaftarPesanan={() => setActiveScreen('daftar-pesanan')}
            onNavigateToChat={() => setActiveScreen('chat')}
            onNavigateToNews={(title, text) => setCustomNews({ title, text })}
            onInstantCheckout={handleInstantCheckout}
          />
        );
      
      case 'pasar':
        return (
          <PasarScreen 
            products={MOCK_PRODUCTS.filter(p => p.id !== 'p6' && p.id !== 'p7')} // default market grid listing
            cart={cart}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            onGoToCheckout={() => setActiveScreen('checkout')}
          />
        );
      
      case 'checkout':
        return (
          <CheckoutScreen 
            cart={cart}
            onPayNow={handlePayNow}
            onBack={() => setActiveScreen('pasar')}
          />
        );
      
      case 'waiting-payment':
        const pendingOrder = orders.find(o => o.id === activeOrderId) || orders[0];
        return (
          <WaitingPaymentScreen 
            orderId={activeOrderId}
            totalPayment={pendingOrder?.totalPayment || 450000}
            merchant={pendingOrder?.merchant || 'Koperasi Tani Makmur'}
            onVerifySuccess={() => {
              // Update order status successful
              setOrders(prev => prev.map(o => {
                if (o.id === activeOrderId) {
                  return { ...o, status: 'Sedang Dikirim' };
                }
                return o;
              }));
              setActiveScreen('success-payment');
              triggerToast('Pembayaran Berhasil Terverifikasi');
            }}
            onCancelOrder={() => {
              setOrders(prev => prev.map(o => {
                if (o.id === activeOrderId) {
                  return { ...o, status: 'Dibatalkan' };
                }
                return o;
              }));
              setActiveScreen('daftar-pesanan');
              triggerToast('Pesanan berhasil dibatalkan');
            }}
            onBack={() => setActiveScreen('checkout')}
          />
        );
      
      case 'success-payment':
        const completedOrder = orders.find(o => o.id === activeOrderId) || orders[0];
        return (
          <SuccessPaymentScreen 
            orderId={activeOrderId}
            merchant={completedOrder?.merchant || 'Koperasi Tani Makmur'}
            totalPayment={completedOrder?.totalPayment || 252000}
            paymentMethod={completedOrder?.paymentMethod || 'QRIS'}
            onGoToDetails={() => setActiveScreen('detail-pesanan')}
            onGoToHome={() => setActiveScreen('home')}
          />
        );
      
      case 'detail-pesanan':
        const trackingOrder = orders.find(o => o.id === activeOrderId) || orders[0];
        return (
          <DetailPesananScreen 
            order={trackingOrder}
            onConfirmReceived={(orderId) => {
              setOrders(prev => prev.map(o => {
                if (o.id === orderId) {
                  return { ...o, status: 'Selesai' };
                }
                return o;
              }));
              setActiveScreen('daftar-pesanan');
              triggerToast('Terima kasih! Pesanan Selesai & Dana diteruskan ke Supplier.');
            }}
            onBack={() => setActiveScreen('daftar-pesanan')}
          />
        );
      
      case 'daftar-pesanan':
        return (
          <DaftarPesananScreen 
            orders={orders}
            onTrackOrder={(orderId) => {
              setActiveOrderId(orderId);
              setActiveScreen('detail-pesanan');
            }}
            onPayOrder={(order) => {
              setActiveOrderId(order.id);
              setActiveScreen('waiting-payment');
            }}
            onReorder={(order) => {
              // Populate cart
              setCart(order.items.map(item => ({ product: item.product, quantity: item.quantity })));
              setActiveScreen('checkout');
              triggerToast('Item pesanan disalin ke keranjang checkout.');
            }}
          />
        );
      
      case 'chat':
        return (
          <ChatScreen 
            chats={chats}
            onSendMessage={handleSendMessage}
            onAcceptAgreement={handleAcceptAgreement}
            onDeclineAgreement={handleDeclineAgreement}
          />
        );
      
      case 'akun':
        return (
          <AkunScreen 
            user={user}
            onTopUp={() => {
              setUser(prev => ({ ...prev, balance: prev.balance + 500000 }));
            }}
            onLogOut={() => {
              setActiveScreen('splash');
              setCart([]);
              triggerToast('Anda telah keluar dari akun');
            }}
          />
        );
      
      default:
        return <div className="text-center p-8">Screen not loaded properly</div>;
    }
  };

  // Determines whether to display the bottom tab navbar
  const isTabbedScreen = ['home', 'pasar', 'daftar-pesanan', 'chat', 'akun'].includes(activeScreen);

  if (activeRole === 'admin') {
    return (
      <AdminDashboard 
        products={MOCK_PRODUCTS} 
        orders={orders} 
        onSetOrders={setOrders} 
        onGoToBuyerApp={() => {
          setActiveRole('buyer');
          triggerToast('Beralih ke Aplikasi Pembeli (Mobile)');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-stone-900 flex flex-col lg:flex-row font-sans text-stone-800 antialiased overflow-x-hidden">
      
      {/* LEFT SIDEBAR: Developers/Demonstrators control panel - outstanding added value */}
      <div className="w-full lg:w-[360px] bg-stone-950 text-stone-200 p-6 flex flex-col justify-between shrink-0 border-b lg:border-b-0 lg:border-r border-stone-800 z-40">
        <div className="space-y-6">
          <div className="flex items-center space-x-3 pb-3 border-b border-stone-800">
            <div className="w-9 h-9 bg-brand-orange text-white rounded-xl flex items-center justify-center shadow-lg">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-wide text-white uppercase">Tumbasna Simulator</h1>
              <p className="text-[10px] text-emerald-400 font-extrabold tracking-widest uppercase">Verified Buyer Deck</p>
            </div>
          </div>

          {/* Prominent admin portals gateway panel */}
          <div className="bg-brand-green-dark/95 border border-brand-green-dark p-4 rounded-xl text-left space-y-3 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl" />
            <div>
              <span className="text-[9px] bg-brand-green-light/20 text-brand-green-light font-black px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">HQ PORTAL</span>
              <h3 className="text-xs font-black text-white mt-1 leading-normal">Dashboard Admin Enterprise</h3>
              <p className="text-[10px] text-stone-300 leading-relaxed font-semibold mt-1">
                Pusat monitoring & kelola ekosistem rantai pasok pangan digital nasional.
              </p>
            </div>
            <button
              onClick={() => {
                setActiveRole('admin');
                triggerToast('Membuka Portal Pengelola Admin Tumbasna');
              }}
              className="w-full bg-brand-green-light hover:bg-brand-green-light/90 text-white font-extrabold py-2.5 text-[10.5px] rounded-xl shadow-md transition-colors text-center cursor-pointer flex items-center justify-center space-x-2"
            >
              <span>Akses Dashboard Admin</span>
            </button>
          </div>

          {/* Quick instructions explanation */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 space-y-2 text-left leading-relaxed">
            <div className="flex items-center space-x-2 text-white font-bold text-xs">
              <Sparkles className="w-4 h-4 text-brand-orange" />
              <span>Interactive Screenshot Deck</span>
            </div>
            <p className="text-[11px] text-stone-400">
              Gunakan panel ini untuk langsung melompat ke visualisasi masing-masing halaman sesuai dengan tangkapan layar (screenshot) yang Anda kirimkan:
            </p>
          </div>

          {/* Quick Visual View buttons */}
          <div className="space-y-1.5 overflow-y-auto max-h-[420px] lg:max-h-none pr-1">
            <button 
              onClick={() => loadScreenPreset(1)}
              className={`w-full flex items-center justify-between text-left px-3 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                activeScreen === 'splash' ? 'bg-brand-orange text-white border-brand-orange shadow-md scale-[1.02]' : 'bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-800/60'
              }`}
            >
              <span>1. Splash Welcome Screen</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button 
              onClick={() => loadScreenPreset(3)}
              className={`w-full flex items-center justify-between text-left px-3 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                activeScreen === 'login' ? 'bg-brand-orange text-white border-brand-orange shadow-md scale-[1.02]' : 'bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-800/60'
              }`}
            >
              <span>2. Selamat Datang (Login)</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button 
              onClick={() => loadScreenPreset(4)}
              className={`w-full flex items-center justify-between text-left px-3 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                activeScreen === 'register' ? 'bg-brand-orange text-white border-brand-orange shadow-md scale-[1.02]' : 'bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-800/60'
              }`}
            >
              <span>3. Daftar Akun Buyer (Register)</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button 
              onClick={() => loadScreenPreset(2)}
              className={`w-full flex items-center justify-between text-left px-3 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                activeScreen === 'home' ? 'bg-brand-orange text-white border-brand-orange shadow-md scale-[1.02]' : 'bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-800/60'
              }`}
            >
              <span>4. Beranda Dashboard Buyer</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button 
              onClick={() => loadScreenPreset(5)}
              className={`w-full flex items-center justify-between text-left px-3 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                activeScreen === 'checkout' ? 'bg-brand-orange text-white border-brand-orange shadow-md scale-[1.02]' : 'bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-800/60'
              }`}
            >
              <span>5. Checkout Belanja (Rp 72rb)</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button 
              onClick={() => loadScreenPreset(6)}
              className={`w-full flex items-center justify-between text-left px-3 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                activeScreen === 'waiting-payment' ? 'bg-brand-orange text-white border-brand-orange shadow-md scale-[1.02]' : 'bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-800/60'
              }`}
            >
              <span>6. Menunggu Pembayaran QRIS</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button 
              onClick={() => loadScreenPreset(7)}
              className={`w-full flex items-center justify-between text-left px-3 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                activeScreen === 'success-payment' ? 'bg-brand-orange text-white border-brand-orange shadow-md scale-[1.02]' : 'bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-800/60'
              }`}
            >
              <span>7. Receipt / Pembayaran Sukses</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button 
              onClick={() => loadScreenPreset(8)}
              className={`w-full flex items-center justify-between text-left px-3 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                activeScreen === 'detail-pesanan' ? 'bg-brand-orange text-white border-brand-orange shadow-md scale-[1.02]' : 'bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-800/60'
              }`}
            >
              <span>8. Lacak Status Detail Pesanan</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button 
              onClick={() => loadScreenPreset(9)}
              className={`w-full flex items-center justify-between text-left px-3 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                activeScreen === 'daftar-pesanan' ? 'bg-brand-orange text-white border-brand-orange shadow-md scale-[1.02]' : 'bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-800/60'
              }`}
            >
              <span>9. Daftar Riwayat Pesanan</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button 
              onClick={() => loadScreenPreset(10)}
              className={`w-full flex items-center justify-between text-left px-3 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                activeScreen === 'chat' ? 'bg-brand-orange text-white border-brand-orange shadow-md scale-[1.02]' : 'bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-800/60'
              }`}
            >
              <span>10. Chat & Negosiasi Supplier</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button 
              onClick={() => loadScreenPreset(11)}
              className={`w-full flex items-center justify-between text-left px-3 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                activeScreen === 'akun' ? 'bg-brand-orange text-white border-brand-orange shadow-md scale-[1.02]' : 'bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-800/60'
              }`}
            >
              <span>11. Akun & Profil Bisnis UMKM</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-60" />
            </button>
          </div>
        </div>

        {/* Footer info brand */}
        <div className="hidden lg:block pt-5 border-t border-stone-800/50 text-stone-500 text-[10px] space-y-1 text-left font-semibold">
          <p>TumbasNa Platform v2.1.0</p>
          <p>© 2026 TumbasNa Inc. All rights reserved.</p>
        </div>
      </div>

      {/* CENTER PORT: Simulated mobile smartphone framed viewport */}
      <div className="flex-1 flex justify-center items-center p-3 lg:p-6 bg-stone-900 relative">
        <div className="relative w-full max-w-[420px] aspect-[9/19.5] max-h-[92vh] min-h-[640px] rounded-[42px] border-[10px] border-stone-800 bg-white shadow-2xl overflow-hidden flex flex-col">
          
          {/* Smartphone Camera Notch */}
          <div className="absolute top-2 inset-x-0 mx-auto w-32 h-6 bg-stone-800 rounded-2xl z-50 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-stone-900 mr-2 border border-slate-700" />
            <div className="w-10 h-1 bg-stone-700 rounded" />
          </div>

          {/* Core Screen Display Scrollable Viewport */}
          <div className="flex-1 overflow-hidden relative pt-6 flex flex-col h-full bg-brand-bg">
            
            {/* Active Render context */}
            <div className="flex-1 relative min-h-0">
              <div className="absolute inset-0 flex flex-col overflow-hidden">
                {renderScreenContent()}
              </div>
            </div>

            {/* Bottom Tab Navigation Bar - Matches real smartphone layouts */}
            {isTabbedScreen && (
              <nav className="bg-white border-t border-stone-100 flex justify-between px-5 py-2.5 z-40 w-full shadow-inner shrink-0">
                {/* Beranda Tab */}
                <button
                  onClick={() => setActiveScreen('home')}
                  className="flex flex-col items-center space-y-1 select-none flex-1 font-sans"
                >
                  <div className={`p-1.5 rounded-full transition-colors flex items-center justify-center ${
                    activeScreen === 'home' ? 'bg-[#c9e7cd] text-brand-green-dark w-12 h-7' : 'text-stone-400'
                  }`}>
                    <Home className="w-4.5 h-4.5" />
                  </div>
                  <span className={`text-[9.5px] font-black ${activeScreen === 'home' ? 'text-brand-green-dark font-extrabold' : 'text-stone-400 font-bold'}`}>
                    Beranda
                  </span>
                </button>

                {/* Pasar Tab */}
                <button
                  onClick={() => setActiveScreen('pasar')}
                  className="flex flex-col items-center space-y-1 select-none flex-1 font-sans"
                >
                  <div className={`p-1.5 rounded-full transition-colors flex items-center justify-center ${
                    activeScreen === 'pasar' ? 'bg-[#c9e7cd] text-brand-green-dark w-12 h-7' : 'text-stone-400'
                  }`}>
                    <ShoppingBag className="w-4.5 h-4.5" />
                  </div>
                  <span className={`text-[9.5px] font-black ${activeScreen === 'pasar' ? 'text-brand-green-dark font-extrabold' : 'text-stone-400 font-bold'}`}>
                    Pasar
                  </span>
                </button>

                {/* Pesanan Tab */}
                <button
                  onClick={() => setActiveScreen('daftar-pesanan')}
                  className="flex flex-col items-center space-y-1 select-none flex-1 font-sans"
                >
                  <div className={`p-1.5 rounded-full transition-colors flex items-center justify-center ${
                    activeScreen === 'daftar-pesanan' ? 'bg-[#c9e7cd] text-brand-green-dark w-12 h-7' : 'text-stone-400'
                  }`}>
                    <ClipboardList className="w-4.5 h-4.5" />
                  </div>
                  <span className={`text-[9.5px] font-black ${activeScreen === 'daftar-pesanan' ? 'text-brand-green-dark font-extrabold' : 'text-stone-400 font-bold'}`}>
                    Pesanan
                  </span>
                </button>

                {/* Chat Tab */}
                <button
                  onClick={() => setActiveScreen('chat')}
                  className="flex flex-col items-center space-y-1 select-none flex-1 font-sans relative"
                >
                  <div className={`p-1.5 rounded-full transition-colors flex items-center justify-center ${
                    activeScreen === 'chat' ? 'bg-[#c9e7cd] text-brand-green-dark w-12 h-7' : 'text-stone-400'
                  }`}>
                    <MessageSquare className="w-4.5 h-4.5" />
                  </div>
                  {/* Fake unread red dot indicator */}
                  <span className="absolute top-1 right-3.5 w-1.5 h-1.5 bg-rose-500 rounded-full" />
                  <span className={`text-[9.5px] font-black ${activeScreen === 'chat' ? 'text-brand-green-dark font-extrabold' : 'text-stone-400 font-bold'}`}>
                    Chat
                  </span>
                </button>

                {/* Akun Tab */}
                <button
                  onClick={() => setActiveScreen('akun')}
                  className="flex flex-col items-center space-y-1 select-none flex-1 font-sans"
                >
                  <div className={`p-1.5 rounded-full transition-colors flex items-center justify-center ${
                    activeScreen === 'akun' ? 'bg-[#c9e7cd] text-brand-green-dark w-12 h-7' : 'text-stone-400'
                  }`}>
                    <User className="w-4.5 h-4.5" />
                  </div>
                  <span className={`text-[9.5px] font-black ${activeScreen === 'akun' ? 'text-brand-green-dark font-extrabold' : 'text-stone-400 font-bold'}`}>
                    Akun
                  </span>
                </button>
              </nav>
            )}

          </div>

          {/* Global alert Toast bar (Inside the phone frame) */}
          <AnimatePresence>
            {toastMessage && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-16 left-1/2 -translate-x-1/2 bg-stone-900 border border-stone-800 text-stone-100 font-semibold px-4 py-2.5 rounded-full text-[10px] shadow-2xl z-50 flex items-center space-x-2 max-w-[85%] w-max text-center"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse shrink-0" />
                <span className="font-sans">{toastMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Custom News / Notification Pop-up Modal (Inside the phone frame) */}
          <AnimatePresence>
            {customNews && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-6"
              >
                <motion.div
                  initial={{ scale: 0.95, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, y: 20 }}
                  className="bg-white rounded-3xl p-6 max-w-[320px] w-full border border-stone-100 shadow-2xl relative text-left space-y-4"
                >
                  <div className="flex items-center space-x-2.5 text-emerald-800 font-bold">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span className="text-xs uppercase tracking-wider">TumbasNa Verified News</span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-base font-extrabold text-stone-800">{customNews.title}</h3>
                    <p className="text-xs text-stone-500 leading-relaxed font-semibold">{customNews.text}</p>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <button
                      onClick={() => {
                        setCustomNews(null);
                        setActiveScreen('chat');
                      }}
                      className="flex-1 bg-brand-green-dark hover:bg-emerald-950 text-white font-bold py-3 text-xs rounded-xl transition-all shadow-md text-center cursor-pointer flex items-center justify-center space-x-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Negosiasi di Chat</span>
                    </button>
                    <button
                      onClick={() => setCustomNews(null)}
                      className="bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-200 font-bold px-4 py-3 text-xs rounded-xl transition-all text-center cursor-pointer"
                    >
                      Tutup
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

    </div>
  );
}
