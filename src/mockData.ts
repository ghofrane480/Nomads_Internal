import { Hostel, Reservation, CashFlow, User } from "./types";

export const hostels: Hostel[] = [
  { id: '1', name: 'Nomads Sousse', location: 'Sousse, Tunisie' },
  { id: '2', name: 'Nomads Tunis', location: 'Tunis, Tunisie' },
];

export const initialUsers: User[] = [
  { id: 'u1', username: 'manager', role: 'manager', name: 'Manager Nomads', password: 'password123' },
  { id: 'u2', username: 'admin_tunis', role: 'admin_tunis', name: 'Admin Tunis', password: 'password-tunis' },
  { id: 'u3', username: 'admin_sousse', role: 'admin_sousse', name: 'Admin Sousse', password: 'password-sousse' },
];

export const mockReservations: Reservation[] = [];

export const mockCashFlow: CashFlow[] = [];
