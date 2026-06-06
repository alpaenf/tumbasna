import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Create the shared Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  } catch (error) {
    console.error("Failed to initialize Google Gen AI client:", error);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoint for AI Smart Recommendation
  app.post("/api/recommendations", async (req, res) => {
    const { user = { location: 'Desa Makmur, Cianjur', category: 'Sayuran Organik & Umbi-umbian', expendituresMonth: 'Rp 4.250.000' } } = req.body;

    const fallbackRecommendations = {
      alert: {
        title: "Prediksi Harga Cabai & Kentang",
        text: "Harga Kentang Dieng Super diprediksi naik sebesar 12% dalam 7 hari ke depan karena penurunan pasokan regional di Jawa Barat. Disarankan mengamankan stok sekarang via Tani Jaya Mandiri.",
        productId: "p2"
      },
      bestSupplier: {
        title: "Supplier Terdekat & Terhemat",
        text: "Kebun Subur Jaya di Cianjur Utara berjarak 4.2 km menawarkan harga terbaik Rp 25.000/kg untuk Selada Hidroponik Premium dengan tingkat keberhasilan pengiriman mencapai 99.2%.",
        productId: "p1"
      },
      coPurchases: [
        {
          title: "Pembelian Bersama Hemat Ongkir",
          text: "Mitra kuliner sejenis Anda biasanya membeli Beras Organik Mentik Susu bersama dengan Paket Sayur Hijau. Membeli keduanya menghemat biaya logistik penanganan hingga Rp 12.000.",
          productIds: ["p4", "p5"]
        }
      ],
      weeklyStockEstimate: {
        businessType: user.category || "Sayuran Organik & Umbi-umbian",
        estimate: "Berdasarkan jenis usaha kuliner Anda, analisis AI menyarankan ketersediaan stok mingguan pengaman sebesar: 5 paket Paket Sayur Hijau dan 10 kg Kentang Dieng Super.",
        recommendedProducts: [
          { id: "p5", quantity: 5 },
          { id: "p2", quantity: 5 }
        ]
      }
    };

    if (!ai) {
      console.log("No GEMINI_API_KEY found, returning fallback smart recommendations");
      return res.status(200).json({ ...fallbackRecommendations, source: 'fallback' });
    }

    try {
      const systemInstruction = `
        You are the AI Smart Business Assistant for Tumbasna, a B2B agricultural commerce platform in Indonesia connecting farmers/suppliers (Kebun Subur Jaya, Tani Jaya Mandiri, Lumbung Tani Makmur) with MSMEs (UMKM) like local restaurants, catering, or grocery stores.
        Your goal is to parse the user's business profile and run calculations to return personalized, smart, highly professional, and actionable business procurement advice in Indonesian.

        You must output a JSON object matching this structure EXACTLY:
        {
          "alert": {
            "title": "string (Short header e.g. Prediksi Lonjakan Harga)",
            "text": "string (A concise warning like: Harga Kentang Dieng Super diprediksi naik dalam 7 hari ke depan karena cuaca, disarankan beli sekarang)",
            "productId": "string (Must be either p1, p2, p3, p4, or p5)"
          },
          "bestSupplier": {
            "title": "string (e.g. Supplier Rekomendasi Terdekat)",
            "text": "string (Outlining why Kebun Subur Jaya or Tani Jaya Mandiri is the best, referencing shipping speed, success rates, or closest km distance)",
            "productId": "string (Must be either p1, p2, p3, p4, or p5)"
          },
          "coPurchases": [
            {
              "title": "string (e.g., Sering Dibeli Bersamaan)",
              "text": "string (Explain how buying Beras and Paket Sayur Hijau together from certain suppliers helps optimize truck logistics and saves costs)",
              "productIds": ["string", "string"]
            }
          ],
          "weeklyStockEstimate": {
            "businessType": "string",
            "estimate": "string (An estimation of their weekly ingredients stock needs, e.g. Berdasarkan usaha Anda, estimasi kebutuhan Kentang Dieng minggu ini adalah 15 kg)",
            "recommendedProducts": [
              { "id": "string", "quantity": 5 }
            ]
          }
        }

        Use these exact products from the catalog catalog for recommendations. Your ID strings must EXACTLY match one of p1, p2, p3, p4, or p5:
        - Product 'p1': 'Selada Hidroponik Premium' (price: 25000, unit: '1 kg', seller: 'Kebun Subur Jaya', category: 'Sayur Fresh', stock: 45)
        - Product 'p2': 'Kentang Dieng Super' (price: 30000, unit: '2 kg', seller: 'Tani Jaya Mandiri', category: 'Umbi-umbian', stock: 80)
        - Product 'p3': 'Apel Malang Segar' (price: 25000, unit: '2 kg', seller: 'Kebun Subur Jaya', category: 'Buah-buahan', stock: 30)
        - Product 'p4': 'Beras Organik Mentik Susu' (price: 18000, unit: '5 kg', seller: 'Lumbung Tani Makmur', category: 'Sembako', stock: 120)
        - Product 'p5': 'Paket Sayur Hijau' (price: 35000, unit: '1 paket', seller: 'Kebun Subur Jaya', category: 'Sayur Fresh', stock: 15)

        Consider the user's business context:
        - Business Name: ${user.businessName || 'Mitra UMKM'}
        - Location: ${user.location || 'Desa Makmur, Cianjur'}
        - Business Category: ${user.category || 'Sayuran Organik'}
        - Expenditures this month: ${user.expendituresMonth || 'Rp 4.250.000'}

        Keep the Indonesian language professional, helpful, polite, and encouraging. Never expose raw code or JSON syntax in fields other than structured JSON.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: "Generate procurement recommendations for the active user.",
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              alert: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  text: { type: Type.STRING },
                  productId: { type: Type.STRING }
                },
                required: ["title", "text", "productId"]
              },
              bestSupplier: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  text: { type: Type.STRING },
                  productId: { type: Type.STRING }
                },
                required: ["title", "text", "productId"]
              },
              coPurchases: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    text: { type: Type.STRING },
                    productIds: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING }
                    }
                  },
                  required: ["title", "text", "productIds"]
                }
              },
              weeklyStockEstimate: {
                type: Type.OBJECT,
                properties: {
                  businessType: { type: Type.STRING },
                  estimate: { type: Type.STRING },
                  recommendedProducts: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        quantity: { type: Type.INTEGER }
                      },
                      required: ["id", "quantity"]
                    }
                  }
                },
                required: ["businessType", "estimate", "recommendedProducts"]
              }
            },
            required: ["alert", "bestSupplier", "coPurchases", "weeklyStockEstimate"]
          }
        }
      });

      const responseText = response.text || "";
      const resultJson = JSON.parse(responseText.trim());
      res.status(200).json({ ...resultJson, source: 'gemini' });

    } catch (e: any) {
      console.error("Failed to generate recommendations with Gemini:", e);
      res.status(200).json({ ...fallbackRecommendations, source: 'error-fallback', error: e.message });
    }
  });

  // WhatsApp Gateway Sync State
  let whatsappChats = [
    {
      id: 'm1',
      sender: 'seller',
      text: 'Halo! Ya, Beras Pandan Wangi stoknya masih aman untuk pesanan 20 karung.',
      time: '09:41'
    },
    {
      id: 'm2',
      sender: 'buyer',
      text: 'Bagus. Apakah bisa dikirim besok pagi ke gudang di Jakarta Barat?',
      time: '09:45'
    },
    {
      id: 'm3',
      sender: 'seller',
      text: 'Bisa pak, tapi ada tambahan biaya ongkos kirim Rp 150.000 karena di luar rute reguler kami hari ini. Apakah setuju?',
      time: '09:48',
      isActionRequired: true,
      actionStatus: 'pending',
      additionalFee: 150000
    }
  ];

  let whatsappLogs = [
    { id: 1, time: '09:41', type: 'incoming', text: 'WhatsApp message received from Supplier: "Halo! Ya, Beras..."' },
    { id: 2, time: '09:45', type: 'outgoing', text: 'Forwarded Buyer message to WhatsApp: "Bagus. Apakah bisa..."' },
    { id: 3, time: '09:48', type: 'incoming', text: 'WhatsApp message received from Supplier: "Bisa pak, tapi ada..."' }
  ];

  // API returns chats and gateway logs
  app.get("/api/whatsapp/chats", (req, res) => {
    res.json({ chats: whatsappChats, logs: whatsappLogs });
  });

  // Buyer sends message from Tumbasna
  app.post("/api/whatsapp/send", (req, res) => {
    const { text, time } = req.body;
    if (!text) return res.status(400).json({ error: "Pesan kosong" });

    const newMsg = {
      id: `m-${Date.now()}`,
      sender: 'buyer',
      text: text,
      time: time || new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    whatsappChats.push(newMsg);

    // Add log
    whatsappLogs.push({
      id: Date.now(),
      time: newMsg.time,
      type: 'outgoing',
      text: `Gateway API: Forwarded buyer message to Supplier WhatsApp (+62 822-1133-5577): "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}"`
    });

    // Simulate auto response from supplier WhatsApp occasionally if user types specific triggers
    const lower = text.toLowerCase();
    setTimeout(() => {
      let reply = "";
      if (lower.includes("konfirmasi") || lower.includes("kirim") || lower.includes("kapan")) {
        reply = "Besok jam 9 pagi dijadwalkan jalan ya pak. Driver kami akan hubungi bapak sebelum berangkat.";
      } else if (lower.includes("diskon") || lower.includes("harga") || lower.includes("nego")) {
        reply = "Ini harga pasaran terbaik pak, namun kami beri free packing goni ramah lingkungan.";
      } else if (lower.includes("kualitas") || lower.includes("bagus") || lower.includes("residu") || lower.includes("bbpom")) {
        reply = "Produk kami dijamin lolos uji mutu BBPOM dan bersertifikat pupuk organik resmi.";
      } else if (lower.includes("halo") || lower.includes("pagi") || lower.includes("siang")) {
        reply = "Halo pak! Ada yang bisa kami bantu mengenai pesanan atau pengiriman beras hari ini?";
      }

      if (reply) {
        const autoReplyMsg = {
          id: `m-auto-${Date.now()}`,
          sender: 'seller',
          text: reply,
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        };
        whatsappChats.push(autoReplyMsg);
        whatsappLogs.push({
          id: Date.now() + 1,
          time: autoReplyMsg.time,
          type: 'incoming',
          text: `Gateway Webhook: Syncing incoming WhatsApp message from Supplier (+62 822-1133-5577): "${reply}"`
        });
      }
    }, 1500);

    res.json({ success: true, chats: whatsappChats, logs: whatsappLogs });
  });

  // Supplier replies from WhatsApp Simulation Panel
  app.post("/api/whatsapp/incoming-reply", (req, res) => {
    const { text, time } = req.body;
    if (!text) return res.status(400).json({ error: "Pesan kosong" });

    const newMsg = {
      id: `m-${Date.now()}`,
      sender: 'seller',
      text: text,
      time: time || new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    whatsappChats.push(newMsg);

    whatsappLogs.push({
      id: Date.now(),
      time: newMsg.time,
      type: 'incoming',
      text: `Gateway Webhook: Syncing incoming WhatsApp message from Supplier (+62 822-1133-5577): "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}"`
    });

    res.json({ success: true, chats: whatsappChats, logs: whatsappLogs });
  });

  // Action (Agree / Decline add-on fee)
  app.post("/api/whatsapp/action", (req, res) => {
    const { action, id } = req.body; // 'accepted' or 'declined'
    
    whatsappChats = whatsappChats.map(msg => {
      if (msg.isActionRequired && (msg.id === id || (!id && msg.id === 'm3'))) {
        return { ...msg, actionStatus: action };
      }
      return msg;
    });

    whatsappLogs.push({
      id: Date.now(),
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      type: 'action',
      text: `Gateway Notification: Buyer action performed on Agreement fee: Status set to "${action.toUpperCase()}"`
    });

    res.json({ success: true, chats: whatsappChats, logs: whatsappLogs });
  });

  // Clear / Reset chats and logs
  app.post("/api/whatsapp/reset", (req, res) => {
    whatsappChats = [
      {
        id: 'm1',
        sender: 'seller',
        text: 'Halo! Ya, Beras Pandan Wangi stoknya masih aman untuk pesanan 20 karung.',
        time: '09:41'
      },
      {
        id: 'm2',
        sender: 'buyer',
        text: 'Bagus. Apakah bisa dikirim besok pagi ke gudang di Jakarta Barat?',
        time: '09:45'
      },
      {
        id: 'm3',
        sender: 'seller',
        text: 'Bisa pak, tapi ada tambahan biaya ongkos kirim Rp 150.000 karena di luar rute reguler kami hari ini. Apakah setuju?',
        time: '09:48',
        isActionRequired: true,
        actionStatus: 'pending',
        additionalFee: 150000
      }
    ];

    whatsappLogs = [
      { id: 1, time: '09:41', type: 'incoming', text: 'WhatsApp message received from Supplier: "Halo! Ya, Beras..."' },
      { id: 2, time: '09:45', type: 'outgoing', text: 'Forwarded Buyer message to WhatsApp: "Bagus. Apakah bisa..."' },
      { id: 3, time: '09:48', type: 'incoming', text: 'WhatsApp message received from Supplier: "Bisa pak, tapi ada..."' }
    ];

    res.json({ success: true, chats: whatsappChats, logs: whatsappLogs });
  });

  // API endpoint for AI Smart Chat Assistant
  app.post("/api/assistant-chat", async (req, res) => {
    const { message = "", user = { location: 'Desa Makmur, Cianjur', category: 'Sayuran Organik & Umbi-umbian' } } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "Pesan tidak boleh kosong." });
    }

    if (!ai) {
      console.log("No GEMINI_API_KEY found, returning fallback response");
      let reply = "Saya siap membantu mengoptimalkan rantai pasok Anda! Namun, kunci API Gemini belum terkonfigurasi di Settings > Secrets.";
      const msgLower = message.toLowerCase();
      if (msgLower.includes("harga") || msgLower.includes("pasar") || msgLower.includes("tren")) {
        reply = "Berdasarkan rilis dinas pangan regional Cianjur minggu ini, kelompok komoditas holtikultura (Selada & Paket Sayuran) dalam kondisi stabil, sedangkan komoditas kentang mengalami sedikit lonjakan 12% karena hambatan jalur logistik pegunungan.";
      } else if (msgLower.includes("selada") || msgLower.includes("kebun ") || msgLower.includes("subur")) {
        reply = "Kebun Subur Jaya adalah supplier sayur hidroponik mitra terverifikasi yang berjarak hanya 4.2 km. Keunggulan mereka adalah lolos uji ambang batas residu kimia BBPOM dan rating pengiriman 99%.";
      } else if (msgLower.includes("stok") || msgLower.includes("restock") || msgLower.includes("kebutuhan")) {
        reply = `Untuk pelaku UMKM di bidang ${user.category || 'Sayuran Organik'} seperti Anda, AI memprediksi kebutuhan restock bahan pelengkap (selada, kentang) paling efisien dilakukan setiap 4 hari untuk menjaga kesegaran tingkat tinggi (Freshness score > 94%).`;
      } else if (msgLower.includes("pangan") || msgLower.includes("bagus") || msgLower.includes("rekomendasi")) {
        reply = "Saya merekomendasikan melakukan pembelian Selada Premium dari Kebun Subur Jaya karena jarak antar gudang sangat efisien (hanya 4.2 km), menghemat ongkir dan menjaga kesegaran barang.";
      }
      return res.status(200).json({ reply });
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `User message: "${message}"\n\nContext:\nUser Business Name: ${user.businessName}, Location: ${user.location}, Category: ${user.category}, expenditures: ${user.expendituresMonth}.\n\nKeep the response highly realistic, action-oriented, professional, and friendly in Indonesian. Under 3 sentences. No markdown formatting or code blocks - output plain text.`,
      });
      res.status(200).json({ reply: (response.text || "").trim() });
    } catch (e: any) {
      console.error("Gemini Chat assistant failed:", e);
      res.status(200).json({ reply: `Maaf pak, terjadi kesalahan teknis saat menghubungi asisten AI: ${e.message}` });
    }
  });

  // Serve static files and route fallback in production, or enable Vite HMR proxy in dev
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
