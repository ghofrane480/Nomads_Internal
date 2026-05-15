export type UserRole = 'manager' | 'admin_tunis' | 'admin_sousse';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  password?: string; // Only for auth logic
  name: string;
}

export interface Hostel {
  id: string;
  name: string;
  location: string;
}

export interface Reservation {
  id: string;
  customerName: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'checked-out';
  amount: number;
  hostelId: string;
}

export interface CashFlow {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string;
  description: string;
  hostelId: string;
}

export interface DashboardStats {
  occupancyRate: number;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
}
