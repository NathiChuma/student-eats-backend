export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isAvailable: boolean;
  addOns?: AddOn[];
}

export interface Vendor {
  id: string;
  storeCode: string;
  storeName: string;
  category: string;
  isOpen: boolean;
  estimatedPrepTime: number;
  isBusy: boolean;
  description: string;
  rating?: number;
  menuItems: MenuItem[];
}

export interface BankAccount {
  accountName: string;
  accountNumber: string;
  bankName: string;
}

export interface VendorRecord {
  id: string;
  storeCode: string;
  storeName: string;
  email: string;
  phone: string;
  category: string;
  passwordHash: string;
  isOpen: boolean;
  isBusy: boolean;
  description: string;
  estimatedPrepTime: number;
  bankAccount: BankAccount;
  createdAt: string;
}

export interface VendorPublicData {
  id: string;
  storeCode: string;
  storeName: string;
  email: string;
  phone: string;
  category: string;
  bankAccount: BankAccount;
}

export interface Student {
  fullName: string;
  studentNumber: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export type OrderStatus = "pending" | "preparing" | "ready" | "collected";

export interface CartItem {
  id: string;
  vendorId: string;
  menuItemId: string;
  menuItemName: string;
  price: number;
  quantity: number;
  addOns?: { id: string; name: string; price: number }[];
}

export interface Order {
  id: string;
  userEmail: string;
  vendorId: string;
  vendorName: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  paymentReference: string;
}

export interface VendorStats {
  totalOrders: number;
  pendingOrders: number;
  readyOrders: number;
  revenue: number;
  completedToday: number;
}

export interface ApiErrorResponse {
  error: string;
}
