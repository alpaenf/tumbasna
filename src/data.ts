import { Product, Order, ChatMessage } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
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
  {
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
  {
    id: 'p3',
    name: 'Apel Malang Segar',
    price: 25000,
    unit: '2 kg',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=400',
    seller: 'Kebun Subur Jaya',
    category: 'Buah-buahan',
    isVerified: true,
    stock: 30
  },
  {
    id: 'p4',
    name: 'Beras Organik Mentik Susu',
    price: 18000,
    unit: '5 kg',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400',
    seller: 'Lumbung Tani Makmur',
    category: 'Sembako',
    isVerified: true,
    stock: 120
  },
  {
    id: 'p5',
    name: 'Paket Sayur Hijau',
    price: 35000,
    unit: '1 paket',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=400',
    seller: 'Kebun Subur Jaya',
    category: 'Sayur Fresh',
    isVerified: true,
    stock: 15
  },
  {
    id: 'p6',
    name: 'Beras Premium Pandan Wangi 50kg',
    price: 650000,
    unit: 'karung 50kg',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400',
    seller: 'PT. Agro Nusantara',
    category: 'Sembako',
    isVerified: true,
    stock: 50
  },
  {
    id: 'p7',
    name: 'Beras Premium Rojolele',
    price: 252000,
    unit: '10 kg',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=400',
    seller: 'Koperasi Tani Makmur',
    category: 'Sembako',
    isVerified: true,
    stock: 40
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'TMB-98273645',
    merchant: 'Koperasi Tani Makmur',
    items: [
      {
        product: MOCK_PRODUCTS[6], // Beras Premium Rojolele
        quantity: 1
      }
    ],
    subtotal: 252000,
    ongkir: 0, // dynamic
    biayaAdmin: 0,
    totalPayment: 252000,
    paymentMethod: 'QRIS',
    status: 'Sedang Dikirim',
    orderDate: '12 Okt 2023',
    trackingHistory: [
      {
        status: 'Pesanan Diterima',
        description: 'Konfirmasi penerimaan untuk menyelesaikan pesanan.',
        time: '',
        completed: false
      },
      {
        status: 'Pesanan Dalam Pengiriman',
        description: 'Kurir sedang menuju alamat pengiriman Anda.',
        time: '12 Okt 2023, 10:30 WIB',
        completed: true
      },
      {
        status: 'Konfirmasi Penjual',
        description: 'Penjual telah mengonfirmasi dan menyiapkan pesanan.',
        time: '11 Okt 2023, 15:45 WIB',
        completed: true
      },
      {
        status: 'Pembayaran Berhasil',
        description: 'Pembayaran sebesar Rp 252.000 telah diverifikasi.',
        time: '11 Okt 2023, 15:40 WIB',
        completed: true
      }
    ],
    supplyChainInfo: {
      harvestLocation: 'Desa Sukamaju, Cianjur',
      harvestDate: '01 Okt 2023',
      plantingDate: '15 Jun 2023',
      pesticideInfo: 'Bebas Pestisida Kimia Berbahaya (Organik)',
      fertilizerInfo: 'Pupuk Kompos Organik Terstandar Tumbasna'
    }
  },
  {
    id: 'TMB-10254620',
    merchant: 'Kebun Subur Jaya',
    items: [
      {
        product: MOCK_PRODUCTS[2], // Apel Malang Segar
        quantity: 1
      }
    ],
    subtotal: 50000,
    ongkir: 10000,
    biayaAdmin: 2000,
    totalPayment: 62000,
    paymentMethod: 'COD',
    status: 'Sedang Dikirim',
    orderDate: '12 Okt 2023',
    trackingHistory: [
      {
        status: 'Dalam Pengiriman',
        description: 'Sedang diantarkan oleh kurir lokal.',
        time: '12 Okt 2023, 14:00 WIB',
        completed: true
      },
      {
        status: 'Siap Dikirim',
        description: 'Pesanan diserahkan ke kurir.',
        time: '12 Okt 2023, 09:00 WIB',
        completed: true
      }
    ]
  },
  {
    id: 'TMB-48592039',
    merchant: 'Lumbung Tani Makmur',
    items: [
      {
        product: MOCK_PRODUCTS[3], // Beras Organik Mentik Susu
        quantity: 1
      }
    ],
    subtotal: 90000,
    ongkir: 15000,
    biayaAdmin: 2000,
    totalPayment: 107000,
    paymentMethod: 'QRIS',
    status: 'Menunggu Pembayaran',
    orderDate: '15 Okt 2023',
    paymentTimeLimit: '11:45:20'
  },
  {
    id: 'TMB-30192834',
    merchant: 'Kebun Subur Jaya',
    items: [
      {
        product: MOCK_PRODUCTS[4], // Paket Sayur Hijau
        quantity: 1
      }
    ],
    subtotal: 35000,
    ongkir: 10000,
    biayaAdmin: 2000,
    totalPayment: 47000,
    paymentMethod: 'COD',
    status: 'Selesai',
    orderDate: '05 Okt 2023'
  }
];

export const INITIAL_CHATS: ChatMessage[] = [
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
