export interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  image: string;
  seller: string;
  category: string;
  isVerified: boolean;
  stock: number;
}

export interface OrderItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  merchant: string;
  items: OrderItem[];
  subtotal: number;
  ongkir: number;
  biayaAdmin: number;
  totalPayment: number;
  paymentMethod: 'QRIS' | 'COD';
  status: 'Menunggu Pembayaran' | 'Sedang Dikirim' | 'Selesai' | 'Dibatalkan';
  paymentTimeLimit?: string; // e.g. "14:47" timer or date
  orderDate: string; // e.g. "12 Okt 2023" or "5 Jun 2026"
  trackingHistory?: {
    status: string;
    description: string;
    time: string;
    completed: boolean;
  }[];
  supplyChainInfo?: {
    harvestLocation: string;
    harvestDate: string;
    plantingDate: string;
    pesticideInfo: string;
    fertilizerInfo: string;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'buyer' | 'seller';
  text: string;
  time: string;
  isProductOffer?: boolean;
  offerProduct?: {
    name: string;
    price: number;
    unit: string;
    image: string;
  };
  isActionRequired?: boolean;
  actionStatus?: 'pending' | 'accepted' | 'declined';
  additionalFee?: number;
}

export type ViewScreen = 
  | 'splash'
  | 'login'
  | 'register'
  | 'home'
  | 'pasar'
  | 'checkout'
  | 'waiting-payment'
  | 'success-payment'
  | 'detail-pesanan'
  | 'daftar-pesanan'
  | 'chat'
  | 'akun';

export interface AIRecommendation {
  alert: {
    title: string;
    text: string;
    productId: string;
  };
  bestSupplier: {
    title: string;
    text: string;
    productId: string;
  };
  coPurchases: {
    title: string;
    text: string;
    productIds: string[];
  }[];
  weeklyStockEstimate: {
    businessType: string;
    estimate: string;
    recommendedProducts: {
      id: string;
      quantity: number;
    }[];
  };
}
