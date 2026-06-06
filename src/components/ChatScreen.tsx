import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Paperclip, Send, MoreVertical, Check, MessageSquare, AlertCircle, 
  Smartphone, Cpu, History, RefreshCw, CheckCheck, Info, Radio, Settings, ShieldCheck
} from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatScreenProps {
  chats: ChatMessage[];
  onSendMessage?: (text: string) => void;
  onAcceptAgreement?: (fee: number) => void;
  onDeclineAgreement?: () => void;
}

export default function ChatScreen({ 
  chats: initialChats,
  onSendMessage,
  onAcceptAgreement,
  onDeclineAgreement
}: ChatScreenProps) {
  const [activeTab, setActiveTab] = useState<'buyer' | 'whatsapp' | 'logs'>('buyer');
  const [serverChats, setServerChats] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [typedBuyerMsg, setTypedBuyerMsg] = useState('');
  const [typedSellerMsg, setTypedSellerMsg] = useState('');
  const [isPolling, setIsPolling] = useState(true);
  const [isResetting, setIsResetting] = useState(false);

  const buyerThreadEnd = useRef<HTMLDivElement>(null);
  const sellerThreadEnd = useRef<HTMLDivElement>(null);

  // Sync Chats & Logs from Server
  const fetchGatewayState = async () => {
    try {
      const response = await fetch('/api/whatsapp/chats');
      if (response.ok) {
        const data = await response.json();
        setServerChats(data.chats || []);
        setLogs(data.logs || []);
      }
    } catch (error) {
      console.error("Failed to fetch WhatsApp gateway state:", error);
    }
  };

  // Poll server state every 2 seconds for real-time synchronization
  useEffect(() => {
    fetchGatewayState();
    
    let interval: NodeJS.Timeout | null = null;
    if (isPolling) {
      interval = setInterval(() => {
        fetchGatewayState();
      }, 2000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPolling]);

  // Scroll to bottom when conversations update
  useEffect(() => {
    if (activeTab === 'buyer') {
      buyerThreadEnd.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (activeTab === 'whatsapp') {
      sellerThreadEnd.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [serverChats, activeTab]);

  // Handle Buyer Send (Tumbasna App)
  const handleBuyerSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedBuyerMsg.trim()) return;

    const textToSend = typedBuyerMsg;
    setTypedBuyerMsg('');

    // Pre-insert locally for responsive UX
    const timeNow = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    setServerChats(prev => [
      ...prev,
      { id: `m-temp-${Date.now()}`, sender: 'buyer', text: textToSend, time: timeNow }
    ]);

    try {
      const response = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToSend, time: timeNow })
      });
      if (response.ok) {
        const data = await response.json();
        setServerChats(data.chats);
        setLogs(data.logs);
      }
    } catch (error) {
      console.error("Error sending buyer message:", error);
    }
  };

  // Handle Supplier WhatsApp Send (Simulated WhatsApp Interface)
  const handleSellerSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedSellerMsg.trim()) return;

    const textToSend = typedSellerMsg;
    setTypedSellerMsg('');

    // Pre-insert locally
    const timeNow = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    setServerChats(prev => [
      ...prev,
      { id: `m-temp-sel-${Date.now()}`, sender: 'seller', text: textToSend, time: timeNow }
    ]);

    try {
      const response = await fetch('/api/whatsapp/incoming-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToSend, time: timeNow })
      });
      if (response.ok) {
        const data = await response.json();
        setServerChats(data.chats);
        setLogs(data.logs);
      }
    } catch (error) {
      console.error("Error sending supplier WhatsApp reply:", error);
    }
  };

  // Buyer Perform Action (Accept/Decline custom offer)
  const handleAgreementAction = async (action: 'accepted' | 'declined', messageId: string) => {
    try {
      const response = await fetch('/api/whatsapp/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, id: messageId })
      });
      if (response.ok) {
        const data = await response.json();
        setServerChats(data.chats);
        setLogs(data.logs);
      }
    } catch (error) {
      console.error("Error updating negotiation document agreement:", error);
    }
  };

  const handleResetGatewayPrank = async () => {
    setIsResetting(true);
    try {
      const response = await fetch('/api/whatsapp/reset', { method: 'POST' });
      if (response.ok) {
        const data = await response.json();
        setServerChats(data.chats);
        setLogs(data.logs);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full bg-stone-50 overflow-hidden font-sans"
    >
      {/* Tab Segment Controls for WhatsApp Gateway Sync Experiment */}
      <div className="bg-emerald-900 px-3 pt-2 pb-2 text-white shrink-0 shadow-sm border-b border-white/10">
        <div className="flex items-center justify-between pb-1.5">
          <div className="flex items-center space-x-1.5">
            <Cpu className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest font-black uppercase text-emerald-100">WhatsApp Gateway Sync</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[8px] font-mono bg-emerald-500/30 text-emerald-300 font-extrabold px-1.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center space-x-1">
              <span className="w-1 h-1 bg-emerald-400 rounded-full animate-ping" />
              <span>Real-Time</span>
            </span>
            <button 
              onClick={handleResetGatewayPrank}
              disabled={isResetting}
              className="text-[8px] font-mono font-bold bg-white/10 hover:bg-white/20 px-1.5 py-0.5 rounded transition-all active:scale-95"
            >
              {isResetting ? 'Resetting...' : 'Reset'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1.5 pt-1.5">
          <button
            onClick={() => setActiveTab('buyer')}
            className={`py-1.5 rounded text-[10px] font-extrabold transition-all cursor-pointer text-center ${
              activeTab === 'buyer'
                ? 'bg-white text-emerald-900 shadow-md font-bold'
                : 'bg-emerald-950/60 text-emerald-200 hover:bg-emerald-950/80 hover:text-white'
            }`}
          >
            💬 TumbasNa (Buyer)
          </button>
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`py-1.5 rounded text-[10px] font-extrabold transition-all cursor-pointer text-center flex items-center justify-center space-x-1 ${
              activeTab === 'whatsapp'
                ? 'bg-white text-emerald-900 shadow-md font-bold'
                : 'bg-emerald-950/60 text-emerald-200 hover:bg-emerald-950/80 hover:text-white'
            }`}
          >
            <Smartphone className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>WA Supplier</span>
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`py-1.5 rounded text-[10px] font-extrabold transition-all cursor-pointer text-center flex items-center justify-center space-x-1 ${
              activeTab === 'logs'
                ? 'bg-white text-emerald-900 shadow-md font-bold'
                : 'bg-emerald-950/60 text-emerald-200 hover:bg-emerald-950/80 hover:text-white'
            }`}
          >
            <History className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>Log Router</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* TAB 1: BUYER PREVIEW INSIDE TUMBASNA APP */}
        {activeTab === 'buyer' && (
          <motion.div
            key="buyer"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex flex-col flex-1 min-h-0"
          >
            {/* Header: PT Agro Nusantara detail with WhatsApp connection label */}
            <header className="bg-white border-b border-stone-100 px-4.5 py-3 flex items-center justify-between z-10 shrink-0">
              <div className="flex items-center space-x-3 text-left">
                <div className="relative w-10 h-10 rounded-full border border-stone-100 overflow-hidden bg-stone-50">
                  <img
                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=150"
                    alt="PT. Agro Nusantara"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-[#1a381e] leading-tight flex items-center space-x-1">
                    <span>PT. Agro Nusantara</span>
                    <span className="text-[8px] bg-emerald-50 text-emerald-700 border border-emerald-200 rounded px-1 font-bold font-mono">MITRA WA</span>
                  </h2>
                  <div className="flex items-center space-x-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9.5px] text-stone-400 font-extrabold uppercase tracking-wide">WhatsApp Gateway Terhubung</span>
                  </div>
                </div>
              </div>
              <button className="text-stone-400 hover:bg-stone-50 p-2 rounded-full transition-colors cursor-pointer">
                <MoreVertical className="w-4.5 h-4.5" />
              </button>
            </header>

            {/* Verification & Sync Info alert box */}
            <div className="bg-[#f2faf3] px-4 py-2 border-b border-emerald-100 flex items-center space-x-2 shrink-0">
              <CheckCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <p className="text-[10px] text-emerald-800 font-bold leading-normal text-left">
                Semua balasan supplier langsung dikirim via WhatsApp Business dan disinkronkan ke layar Anda.
              </p>
            </div>

            {/* Embedded dynamic pinned Product */}
            <div className="bg-white border-b border-stone-100 p-3 flex items-center space-x-3 shrink-0">
              <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-stone-150 bg-stone-50">
                <img
                  src="https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=150"
                  alt="Beras Pandan Wangi"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-xs font-black text-stone-800 leading-none">Beras Premium Pandan Wangi 50kg</h3>
                <p className="text-[10.5px] font-bold text-brand-orange mt-1">Rp 650.000 / karung</p>
              </div>
            </div>

            {/* Chat Thread Viewport */}
            <div className="flex-1 overflow-y-auto p-4.5 space-y-4 bg-stone-50">
              <div className="flex justify-center">
                <span className="bg-stone-200/70 text-stone-500 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                  TERHUBUNG VIA WHATSAPP GATEWAY
                </span>
              </div>

              {serverChats.map((msg) => {
                const isMe = msg.sender === 'buyer';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col space-y-1 ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[82%] rounded-[18px] px-4 py-3 text-xs font-semibold leading-relaxed shadow-3xs ${
                        isMe
                          ? 'bg-brand-green-dark text-white rounded-br-xs text-left shadow-sm shadow-brand-green-dark/15'
                          : 'bg-white text-stone-800 border border-stone-100 rounded-bl-xs text-left shadow-xs'
                      }`}
                    >
                      <p className="font-sans font-medium whitespace-pre-wrap">{msg.text}</p>
                      
                      <div
                        className={`text-[8.5px] font-bold mt-1.5 flex items-center space-x-1.5 justify-end uppercase tracking-wider ${
                          isMe ? 'text-emerald-300' : 'text-stone-400 font-mono'
                        }`}
                      >
                        {!isMe && <span className="bg-stone-100 text-stone-500 px-1 rounded text-[7.5px] font-bold">WHATSAPP</span>}
                        <span>{msg.time}</span>
                        {isMe && <CheckCheck className="w-3.5 h-3.5 text-emerald-300 ml-0.5 shrink-0" />}
                      </div>
                    </div>

                    {/* Pending Agreement Card below supplier message */}
                    {!isMe && msg.isActionRequired && msg.actionStatus === 'pending' && (
                      <div className="bg-white rounded-xl p-4 border border-brand-green-dark/15 shadow-md max-w-[85%] space-y-3 text-left ml-1 mt-1 font-sans">
                        <div className="flex items-center space-x-1.5 text-brand-orange font-bold text-[9.5px] uppercase tracking-wider">
                          <AlertCircle className="w-4 h-4 shrink-0 text-brand-orange" />
                          <span>Butuh Konfirmasi Tambahan</span>
                        </div>
                        <p className="text-[11px] text-stone-600 font-medium leading-relaxed">
                          Biaya tambahan ongkir khusus sebesar <strong>Rp {msg.additionalFee?.toLocaleString('id-ID')}</strong> akan ditambahkan ke tagihan invoice Anda.
                        </p>
                        <div className="flex space-x-2 pt-1">
                          <button
                            onClick={() => handleAgreementAction('declined', msg.id)}
                            className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold py-2 rounded-lg text-[11px] transition-transform active:scale-95 cursor-pointer"
                          >
                            Tolak
                          </button>
                          <button
                            onClick={() => handleAgreementAction('accepted', msg.id)}
                            className="flex-1 bg-[#1a381e] hover:bg-emerald-950 text-white font-bold py-2 rounded-lg text-[11px] transition-transform active:scale-95 cursor-pointer shadow-sm"
                          >
                            Setujui
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Display user accepted */}
                    {!isMe && msg.isActionRequired && msg.actionStatus === 'accepted' && (
                      <div className="text-[9.5px] text-emerald-700 font-black bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 shadow-3xs ml-1 mt-1 flex items-center space-x-1">
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>ANDA MENYETUJUI PENAWARAN (DIPROSES)</span>
                      </div>
                    )}

                    {/* Display user declined */}
                    {!isMe && msg.isActionRequired && msg.actionStatus === 'declined' && (
                      <div className="text-[9.5px] text-rose-700 font-black bg-rose-50 px-3 py-1.5 rounded-full border border-rose-200 shadow-3xs ml-1 mt-1 flex items-center space-x-1">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                        <span>REVISI / PENAWARAN ONGKIR DITOLAK</span>
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={buyerThreadEnd} />
            </div>

            {/* Buyer message input form */}
            <form
              onSubmit={handleBuyerSend}
              className="bg-white border-t border-stone-100 px-4 py-3 flex items-center space-x-2.5 shrink-0 shadow-sm"
            >
              <button
                type="button"
                className="text-stone-400 hover:text-stone-700 transition-colors p-2 rounded-full hover:bg-stone-50 shrink-0 cursor-pointer"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              <input
                type="text"
                value={typedBuyerMsg}
                onChange={(e) => setTypedBuyerMsg(e.target.value)}
                placeholder="Kirim pesan langsung ke WhatsApp Seller..."
                className="flex-1 bg-stone-50 border border-stone-200 rounded-full px-4 py-2.5 text-xs text-stone-800 placeholder-stone-400 font-bold focus:outline-none focus:ring-1 focus:ring-brand-green-light focus:bg-white"
              />

              <button
                type="submit"
                className="bg-brand-orange hover:bg-amber-600 text-white w-9 h-9 rounded-full flex items-center justify-center shadow-md shrink-0 transition-transform active:scale-90 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}

        {/* TAB 2: SIMULATED WHATSAPP USER VIEW OF THE SUPPLIER */}
        {activeTab === 'whatsapp' && (
          <motion.div
            key="whatsapp"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex flex-col flex-1 min-h-0 bg-[#e5ddd5] text-stone-800"
          >
            {/* WhatsApp App Mockup Header */}
            <div className="bg-[#075e54] text-white px-4 py-2.5 flex items-center justify-between shrink-0 shadow-md">
              <div className="flex items-center space-x-2.5 text-left">
                <div className="relative w-9 h-9 rounded-full bg-emerald-800 overflow-hidden border border-white/20">
                  <img
                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=150"
                    alt="PT. Agro Nusantara Representative"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xs font-black leading-tight flex items-center space-x-1">
                    <span>PT. Agro Nusantara</span>
                  </h3>
                  <p className="text-[9.5px] text-emerald-200 font-bold">WhatsApp Business • Aktif</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-[10px] bg-emerald-900 border border-emerald-600 text-[#25d366] font-mono px-2 py-0.5 rounded font-black uppercase">
                  ACTIVE SYNC
                </span>
              </div>
            </div>

            {/* Simulated WhatsApp notification alert */}
            <div className="bg-[#128c7e] text-emerald-50 text-[10px] py-1.5 px-3 text-center border-b border-emerald-950/20 shrink-0 flex items-center justify-center space-x-1.5 font-bold">
              <Smartphone className="w-3.5 h-3.5 stroke-[2] text-[#25d366]" />
              <span>Simulasi WhatsApp Supplier (Ketik balasan untuk dikirim balik ke Pembeli)</span>
            </div>

            {/* WA Chat Log panel styled with classic WhatsApp background */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat bg-[size:360px]">
              
              <div className="flex justify-center">
                <span className="bg-[#d1f4cc]/90 text-stone-700 text-[9px] font-black tracking-wider px-3 py-1 rounded-md text-center shadow-3xs max-w-[90%] font-mono">
                  🔒 PENGIRIMAN DIGITAL TERENKRIPSI TUMBASNA WA GATEWAY
                </span>
              </div>

              {serverChats.map((msg) => {
                const isSeller = msg.sender === 'seller';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isSeller ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[78%] rounded-lg p-2.5 text-xs font-semibold leading-normal shadow-3xs text-left ${
                        isSeller
                          ? 'bg-[#dcf8c6] text-stone-900 rounded-tr-none'
                          : 'bg-white text-stone-900 rounded-tl-none'
                      }`}
                    >
                      {/* Embed simulation wrapper signature for buyer message routed */}
                      {!isSeller && (
                        <div className="text-[8.5px] text-emerald-800 font-black mb-1 flex items-center space-x-1">
                          <Cpu className="w-3 h-3 shrink-0" />
                          <span>Diteruskan dari Aplikasi TumbasNa:</span>
                        </div>
                      )}
                      
                      <p className="font-sans font-medium whitespace-pre-wrap">{msg.text}</p>
                      
                      <div className="text-[8px] text-stone-400 font-bold mt-1 text-right flex items-center justify-end space-x-1 font-mono">
                        <span>{msg.time}</span>
                        {isSeller && <CheckCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                      </div>
                    </div>

                    {/* Interactive state action detail mockup */}
                    {!isSeller && msg.isActionRequired && (
                      <div className="mt-1 bg-white/95 rounded p-2 text-[9.5px] border border-stone-200 text-stone-600 text-left font-sans italic">
                        Minta tambahan biaya: <strong className="text-brand-orange">Rp {msg.additionalFee?.toLocaleString('id-ID')}</strong> (Status: <span className="font-bold underline uppercase">{msg.actionStatus}</span>)
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={sellerThreadEnd} />
            </div>

            {/* WA Mockup Input form */}
            <form
              onSubmit={handleSellerSend}
              className="bg-[#f4f0ec] border-t border-stone-200 px-3 py-2.5 flex items-center space-x-2 shrink-0"
            >
              <input
                type="text"
                value={typedSellerMsg}
                onChange={(e) => setTypedSellerMsg(e.target.value)}
                placeholder="Ketik sebagai Supplier (Sampaikan ke Pembeli)..."
                className="flex-1 bg-white border border-stone-200 rounded-full px-4 py-2 text-xs placeholder-sans text-stone-800 placeholder-stone-400 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-700 font-sans shadow-3xs"
              />

              <button
                type="submit"
                className="bg-[#075e54] hover:bg-emerald-950 text-white w-9 h-9 rounded-full flex items-center justify-center shadow shrink-0 cursor-pointer transition-transform active:scale-95"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </form>
          </motion.div>
        )}

        {/* TAB 3: GATEWAY TECHNICAL INTERACTION LOGS */}
        {activeTab === 'logs' && (
          <motion.div
            key="logs"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex flex-col flex-1 min-h-0 bg-stone-900 text-emerald-400 p-4 font-mono text-left space-y-4"
          >
            <div className="flex items-center justify-between border-b border-stone-800 pb-2 shrink-0">
              <div className="flex items-center space-x-2">
                <Radio className="w-4 h-4 text-emerald-500 animate-ping" />
                <h3 className="text-xs font-black uppercase text-emerald-300">Live Gateway Telemetry</h3>
              </div>
              <span className="text-[10px] bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded text-emerald-500 font-black">
                STATUS: SYNCED
              </span>
            </div>

            {/* Network topology design visualization */}
            <div className="bg-stone-950 p-3 rounded border border-stone-800 space-y-2 text-[10px] leading-relaxed select-none shrink-0 text-stone-300">
              <div className="flex items-center justify-between text-[9px] text-stone-500 font-bold uppercase tracking-wider">
                <span>Rute Aliran Data Gateway WA</span>
                <span>Port: 3000 (Local)</span>
              </div>
              <div className="flex items-center justify-around py-1.5 font-semibold text-center text-xs">
                <span className="bg-[#1a381e] text-[#c9e7cd] px-2 py-1 rounded border border-emerald-900 text-[10px]">
                  TumbasNa App
                </span>
                <span className="text-emerald-500 font-bold">&#10141;</span>
                <span className="bg-stone-800 text-stone-300 px-2 py-1 rounded border border-stone-700 text-[10px]">
                  Express Port Router
                </span>
                <span className="text-[#25d366] font-bold">&#10141;</span>
                <span className="bg-[#075e54] text-white px-2 py-1 rounded border border-emerald-950 text-[10px]">
                  WhatsApp Web API
                </span>
              </div>
              <div className="text-[9.5px] italic text-[#25d366] space-y-1 mt-1 font-bold">
                <p>⚡ Kecepatan Refleksi Sync: &lt; 50ms</p>
                <p>✓ Status Webhook: OK (HTTP 200)</p>
              </div>
            </div>

            {/* Logs List viewport */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-[10px] font-mono leading-relaxed max-h-[290px] scrollbar-none">
              {logs.map((log) => (
                <div key={log.id} className="p-2 bg-stone-950 rounded border border-stone-800/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500 font-bold">[{log.time}]</span>
                    <span className={`text-[8.5px] font-black uppercase px-1.5 py-0.2 rounded ${
                      log.type === 'incoming' 
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' 
                        : log.type === 'action'
                        ? 'bg-amber-950 text-amber-400 border border-amber-900'
                        : 'bg-blue-950 text-blue-400 border border-blue-900'
                    }`}>
                      {log.type}
                    </span>
                  </div>
                  <p className="text-stone-300 font-medium">{log.text}</p>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-stone-800 text-stone-500 text-[9px] font-semibold text-center shrink-0">
              Memonitor data webhooks secara dinamis dari server lokal.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
