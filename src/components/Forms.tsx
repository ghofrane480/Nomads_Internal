import React, { useState, useEffect } from "react";
import { User, Hostel } from "../types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { 
  User as UserIcon, 
  CreditCard, 
  Globe, 
  ShieldCheck, 
  Share2, 
  Calendar, 
  Moon, 
  Bed, 
  DollarSign, 
  FileText,
  Lock,
  ChevronDown
} from "lucide-react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const NATIONALITIES = [
  "Tunisienne", "Française", "Italienne", "Allemande", "Britannique", 
  "Américaine", "Libyenne", "Algérienne", "Marocaine", "Espagnole",
  "Canadienne", "Suisse", "Belge", "Autre"
];

const ROOMS = ["Sidi Bou Said", "Dougga", "Carthage", "Matmata", "El Jem", "Kairouan", "Dorm A", "Dorm B"];
const BEDS = ["Lit A", "Lit B", "Lit C", "Lit D", "Lit E", "Lit F"];
const SOURCES = ["Booking.com", "Direct (Walk-in)", "Téléphone", "Instagram", "Expedia", "Airbnb"];

interface ReservationFormProps {
  user: User;
  selectedHostel: Hostel;
  onCancel: () => void;
  onSubmit: (data: any) => void;
}

export function ReservationForm({ user, selectedHostel, onCancel, onSubmit }: ReservationFormProps) {
  const [formData, setFormData] = useState({
    guestName: '',
    passportNumber: '',
    nationality: 'Tunisienne',
    status: 'Pending',
    source: 'Booking.com',
    checkIn: new Date().toISOString().split('T')[0],
    nights: 1,
    checkOut: '',
    room: selectedHostel.name.toUpperCase(),
    bed: 'Lit A',
    priceTND: 0,
    priceEuro: 0,
    notes: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (formData.checkIn && formData.nights >= 0) {
      const checkInDate = new Date(formData.checkIn);
      const checkOutDate = new Date(checkInDate);
      checkOutDate.setDate(checkInDate.getDate() + Number(formData.nights));
      setFormData(prev => ({ ...prev, checkOut: checkOutDate.toISOString().split('T')[0] }));
    }
  }, [formData.checkIn, formData.nights]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.confirmPassword !== user.password) {
      alert("Mot de passe incorrect");
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto px-1 pr-3 scrollbar-custom">
      {/* Client Info Section */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
          <UserIcon className="w-3 h-3" /> Informations sur le client
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-stone-600 dark:text-stone-400 px-1">Nom du Guest</label>
            <input 
              required
              type="text" 
              value={formData.guestName}
              onChange={(e) => setFormData(p => ({ ...p, guestName: e.target.value }))}
              placeholder="Ex: Jean Dupont"
              className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl py-2.5 px-4 text-xs dark:text-white outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-stone-600 dark:text-stone-400 px-1">Numéro de passeport</label>
            <input 
              required
              type="text" 
              value={formData.passportNumber}
              onChange={(e) => setFormData(p => ({ ...p, passportNumber: e.target.value }))}
              placeholder="X00000000"
              className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl py-2.5 px-4 text-xs dark:text-white outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-stone-600 dark:text-stone-400 px-1">Nationalité</label>
            <select 
              value={formData.nationality}
              onChange={(e) => setFormData(p => ({ ...p, nationality: e.target.value }))}
              className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl py-2.5 px-4 text-xs dark:text-white outline-none focus:ring-2 focus:ring-brand-primary"
            >
              {NATIONALITIES.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-stone-600 dark:text-stone-400 px-1">Statut</label>
            <select 
              value={formData.status}
              onChange={(e) => setFormData(p => ({ ...p, status: e.target.value }))}
              className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl py-2.5 px-4 text-xs dark:text-white outline-none focus:ring-2 focus:ring-brand-primary font-bold text-orange-500"
            >
              <option value="Pending">Pending (En attente)</option>
              <option value="Confirmed">Confirmed (Confirmé)</option>
              <option value="Checked-in">Checked-in</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-stone-600 dark:text-stone-400 px-1">Source</label>
            <select 
              value={formData.source}
              onChange={(e) => setFormData(p => ({ ...p, source: e.target.value }))}
              className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl py-2.5 px-4 text-xs dark:text-white outline-none focus:ring-2 focus:ring-brand-primary"
            >
              {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Stay Details */}
      <div className="space-y-4 pt-4 border-t border-stone-100 dark:border-white/5">
        <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
          <Calendar className="w-3 h-3" /> Détails du séjour
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-stone-600 dark:text-stone-400 px-1">Arrivée (Check In)</label>
            <input 
              required
              type="date" 
              value={formData.checkIn}
              onChange={(e) => setFormData(p => ({ ...p, checkIn: e.target.value }))}
              className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl py-2.5 px-4 text-xs dark:text-white outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-stone-600 dark:text-stone-400 px-1">Nombre de nuits</label>
            <div className="relative">
              <input 
                required
                type="number" 
                min="1"
                value={formData.nights}
                onChange={(e) => setFormData(p => ({ ...p, nights: Number(e.target.value) }))}
                className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl py-2.5 px-4 text-xs dark:text-white outline-none focus:ring-2 focus:ring-brand-primary"
              />
              <Moon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-stone-600 dark:text-stone-400 px-1">Départ (Check Out)</label>
            <input 
              required
              type="date" 
              value={formData.checkOut}
              onChange={(e) => setFormData(p => ({ ...p, checkOut: e.target.value }))}
              className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl py-2.5 px-4 text-xs dark:text-white outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>
        </div>
      </div>

      {/* Room Selection */}
      <div className="space-y-4 pt-4 border-t border-stone-100 dark:border-white/5">
        <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
          <Bed className="w-3 h-3" /> Informations sur la chambre
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-stone-600 dark:text-stone-400 px-1">Chambre</label>
            <div className="relative">
              <input 
                readOnly
                type="text" 
                value={formData.room}
                className="w-full bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-white/5 rounded-xl py-2.5 px-4 text-xs dark:text-white font-bold"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-stone-600 dark:text-stone-400 px-1">Choix du lit</label>
            <select 
              value={formData.bed}
              onChange={(e) => setFormData(p => ({ ...p, bed: e.target.value }))}
              className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl py-2.5 px-4 text-xs dark:text-white outline-none focus:ring-2 focus:ring-brand-primary"
            >
              {BEDS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="space-y-4 pt-4 border-t border-stone-100 dark:border-white/5">
        <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
          <DollarSign className="w-3 h-3" /> Tarification
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-stone-600 dark:text-stone-400 px-1">Prix Total (TND)</label>
            <div className="relative">
              <input 
                required
                type="number" 
                value={formData.priceTND}
                onChange={(e) => setFormData(p => ({ ...p, priceTND: Number(e.target.value) }))}
                className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl py-2.5 px-4 text-xs dark:text-white outline-none focus:ring-2 focus:ring-brand-primary font-bold"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-stone-400">TND</span>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-stone-600 dark:text-stone-400 px-1">Prix Total (Euro)</label>
            <div className="relative">
              <input 
                required
                type="number" 
                value={formData.priceEuro}
                onChange={(e) => setFormData(p => ({ ...p, priceEuro: Number(e.target.value) }))}
                className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl py-2.5 px-4 text-xs dark:text-white outline-none focus:ring-2 focus:ring-brand-primary font-bold"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-stone-400">€</span>
            </div>
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-stone-600 dark:text-stone-400 px-1">Notes</label>
          <textarea 
            value={formData.notes}
            onChange={(e) => setFormData(p => ({ ...p, notes: e.target.value }))}
            placeholder="Remarques éventuelles..."
            className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl py-2.5 px-4 text-xs dark:text-white outline-none focus:ring-2 focus:ring-brand-primary min-h-[80px] resize-none"
          />
        </div>
      </div>

      {/* Internal Management */}
      <div className="space-y-4 pt-4 border-t border-stone-100 dark:border-white/5 bg-stone-50/50 dark:bg-white/[0.02] -mx-8 px-8 py-6">
        <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
          <ShieldCheck className="w-3 h-3" /> Gestion interne
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-stone-600 dark:text-stone-400 px-1">Réservation créée par</label>
            <div className="w-full bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-white/5 rounded-xl py-2.5 px-4 text-xs dark:text-stone-300 font-bold flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
               {user.name}
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-brand-primary uppercase tracking-widest px-1 flex items-center gap-1">
              <Lock className="w-2.5 h-2.5" /> Mot de passe de confirmation
            </label>
            <input 
              required
              type="password" 
              value={formData.confirmPassword}
              onChange={(e) => setFormData(p => ({ ...p, confirmPassword: e.target.value }))}
              placeholder="••••••••"
              className="w-full bg-white dark:bg-stone-900 border-2 border-brand-primary/20 rounded-xl py-2.5 px-4 text-xs dark:text-white outline-none focus:ring-2 focus:ring-brand-primary shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4 sticky bottom-0 bg-white dark:bg-[#141414] py-4 -mx-8 px-8 border-t border-stone-100 dark:border-white/5">
        <button 
          type="button"
          onClick={onCancel}
          className="flex-1 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 py-3.5 rounded-xl font-bold text-xs hover:bg-stone-200 transition-colors"
        >
          Annuler
        </button>
        <button 
          type="submit"
          className="flex-1 bg-brand-primary text-white py-3.5 rounded-xl font-bold text-xs shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          Confirmer la réservation
        </button>
      </div>
    </form>
  );
}

interface ExpenseFormProps {
  user: User;
  onCancel: () => void;
  onSubmit: (data: any) => void;
}

export function ExpenseForm({ user, onCancel, onSubmit }: ExpenseFormProps) {
  const [formData, setFormData] = useState({
    label: '',
    amount: '',
    cashDate: new Date().toISOString().split('T')[0],
    paidBy: user.name,
    password: '',
    note: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== user.password) {
      alert("Mot de passe incorrect");
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-stone-600 dark:text-stone-400 px-1 uppercase tracking-widest">Libellé</label>
          <input 
            required
            type="text" 
            value={formData.label}
            onChange={(e) => setFormData(p => ({ ...p, label: e.target.value }))}
            placeholder="Ex: Facture Electricité Mai"
            className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl py-3 px-4 text-xs dark:text-white outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-stone-600 dark:text-stone-400 px-1 uppercase tracking-widest">Montant (TND)</label>
            <div className="relative">
              <input 
                required
                type="number" 
                value={formData.amount}
                onChange={(e) => setFormData(p => ({ ...p, amount: e.target.value }))}
                placeholder="0.00"
                className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl py-3 px-4 text-xs dark:text-white outline-none focus:ring-2 focus:ring-brand-primary font-bold"
              />
              <DollarSign className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-stone-600 dark:text-stone-400 px-1 uppercase tracking-widest">Date de la caisse</label>
            <input 
              required
              type="date" 
              value={formData.cashDate}
              onChange={(e) => setFormData(p => ({ ...p, cashDate: e.target.value }))}
              className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl py-3 px-4 text-xs dark:text-white outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-stone-600 dark:text-stone-400 px-1 uppercase tracking-widest">Payé par</label>
          <input 
            required
            type="text" 
            value={formData.paidBy}
            onChange={(e) => setFormData(p => ({ ...p, paidBy: e.target.value }))}
            className="w-full bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-white/5 rounded-xl py-3 px-4 text-xs dark:text-stone-300 font-bold outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-brand-primary uppercase tracking-widest px-1 flex items-center gap-1">
            <Lock className="w-2.5 h-2.5" /> Mot de passe
          </label>
          <input 
            required
            type="password" 
            value={formData.password}
            onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))}
            placeholder="••••••••"
            className="w-full bg-white dark:bg-stone-900 border-2 border-brand-primary/20 rounded-xl py-3 px-4 text-xs dark:text-white outline-none focus:ring-2 focus:ring-brand-primary shadow-sm"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-stone-600 dark:text-stone-400 px-1 uppercase tracking-widest">Note</label>
          <textarea 
            value={formData.note}
            onChange={(e) => setFormData(p => ({ ...p, note: e.target.value }))}
            placeholder="Notes complémentaires..."
            className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl py-3 px-4 text-xs dark:text-white outline-none focus:ring-2 focus:ring-brand-primary min-h-[100px] resize-none"
          />
        </div>
      </div>

      <div className="flex gap-4 pt-6 border-t border-stone-100 dark:border-white/5">
        <button 
          type="button"
          onClick={onCancel}
          className="flex-1 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 py-3.5 rounded-xl font-bold text-xs hover:bg-stone-200 transition-colors"
        >
          Annuler
        </button>
        <button 
          type="submit"
          className="flex-1 bg-brand-primary text-white py-3.5 rounded-xl font-bold text-xs shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          Enregistrer la dépense
        </button>
      </div>
    </form>
  );
}

interface PaymentFormProps {
  user: User;
  onCancel: () => void;
  onSubmit: (data: any) => void;
}

export function PaymentForm({ user, onCancel, onSubmit }: PaymentFormProps) {
  const [formData, setFormData] = useState({
    reservation: '',
    amount: '',
    paymentMethod: 'Espèce',
    extrasAmount: '0',
    status: 'Complète',
    receivedBy: user.name,
    password: '',
    note: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== user.password) {
      alert("Mot de passe incorrect");
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-stone-600 dark:text-stone-400 px-1 uppercase tracking-widest">Réservation</label>
          <div className="relative">
            <input 
              required
              type="text" 
              value={formData.reservation}
              onChange={(e) => setFormData(p => ({ ...p, reservation: e.target.value }))}
              placeholder="Rechercher un client ou n° résa..."
              className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl py-3 px-4 text-xs dark:text-white outline-none focus:ring-2 focus:ring-brand-primary"
            />
            <UserIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-stone-600 dark:text-stone-400 px-1 uppercase tracking-widest">Montant (TND)</label>
            <input 
              required
              type="number" 
              value={formData.amount}
              onChange={(e) => setFormData(p => ({ ...p, amount: e.target.value }))}
              placeholder="0.00"
              className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl py-3 px-4 text-xs dark:text-white outline-none focus:ring-2 focus:ring-brand-primary font-bold"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-stone-600 dark:text-stone-400 px-1 uppercase tracking-widest">Méthode de paiement</label>
            <select 
              value={formData.paymentMethod}
              onChange={(e) => setFormData(p => ({ ...p, paymentMethod: e.target.value }))}
              className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl py-3 px-4 text-xs dark:text-white outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value="Espèce">Espèce</option>
              <option value="Devise">Devise</option>
              <option value="Carte">Carte Bancaire</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-stone-600 dark:text-stone-400 px-1 uppercase tracking-widest">Montant des Extras</label>
            <input 
              type="number" 
              value={formData.extrasAmount}
              onChange={(e) => setFormData(p => ({ ...p, extrasAmount: e.target.value }))}
              className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl py-3 px-4 text-xs dark:text-white outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-stone-600 dark:text-stone-400 px-1 uppercase tracking-widest">Status</label>
            <select 
              value={formData.status}
              onChange={(e) => setFormData(p => ({ ...p, status: e.target.value }))}
              className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl py-3 px-4 text-xs dark:text-white outline-none focus:ring-2 focus:ring-brand-primary font-bold"
            >
              <option value="Complète">Complète</option>
              <option value="Partiel">Partiel</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-stone-600 dark:text-stone-400 px-1 uppercase tracking-widest">Reçu par</label>
          <div className="w-full bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-white/5 rounded-xl py-3 px-4 text-xs dark:text-stone-300 font-bold flex items-center gap-2">
             <ShieldCheck className="w-4 h-4 text-green-500" />
             {formData.receivedBy}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-brand-primary uppercase tracking-widest px-1 flex items-center gap-1">
            <Lock className="w-2.5 h-2.5" /> Mot de passe
          </label>
          <input 
            required
            type="password" 
            value={formData.password}
            onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))}
            placeholder="••••••••"
            className="w-full bg-white dark:bg-stone-900 border-2 border-brand-primary/20 rounded-xl py-3 px-4 text-xs dark:text-white outline-none focus:ring-2 focus:ring-brand-primary shadow-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-stone-600 dark:text-stone-400 px-1 uppercase tracking-widest">Note</label>
          <textarea 
            value={formData.note}
            onChange={(e) => setFormData(p => ({ ...p, note: e.target.value }))}
            placeholder="Détails du paiement..."
            className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl py-3 px-4 text-xs dark:text-white outline-none focus:ring-2 focus:ring-brand-primary min-h-[80px] resize-none"
          />
        </div>
      </div>

      <div className="flex gap-4 pt-6 border-t border-stone-100 dark:border-white/5">
        <button 
          type="button"
          onClick={onCancel}
          className="flex-1 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 py-3.5 rounded-xl font-bold text-xs hover:bg-stone-200 transition-colors"
        >
          Annuler
        </button>
        <button 
          type="submit"
          className="flex-1 bg-brand-primary text-white py-3.5 rounded-xl font-bold text-xs shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          Enregistrer le paiement
        </button>
      </div>
    </form>
  );
}
