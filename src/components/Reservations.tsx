import React from "react";
import { Calendar, Search, Filter, Plus, ChevronRight } from "lucide-react";
import { Reservation } from "../types";
import { formatCurrency } from "../lib/loanUtils";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ReservationsProps {
  reservations: Reservation[];
  canEdit: boolean;
}

export default function Reservations({ reservations, canEdit }: ReservationsProps) {
  const handleAdd = () => {
    if (!canEdit) {
      alert("Accès en lecture seule. Seul le manager ou l'administrateur de cet établissement peut ajouter des réservations.");
      return;
    }
    alert("Ouverture du formulaire de réservation...");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-white transition-colors">Liste des réservations</h2>
          <p className="text-sm text-stone-500">Gestion quotidienne des arrivées et départs</p>
        </div>
        <button 
          onClick={handleAdd}
          className={cn(
            "rounded-full px-6 py-3 text-sm font-bold shadow-lg transition-all flex items-center gap-2",
            canEdit 
              ? "bg-brand-primary text-white shadow-brand-primary/20 hover:scale-[1.02] active:scale-95" 
              : "bg-stone-100 text-stone-400 cursor-not-allowed"
          )}
        >
          <Plus className="w-4 h-4" />
          Nouvelle réservation
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input 
            type="text" 
            placeholder="Rechercher un client ou une chambre..."
            className="w-full bg-white dark:bg-[#141414] border border-stone-200 dark:border-stone-800 rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-brand-primary outline-none transition-all dark:text-white"
          />
        </div>
        <button className="bg-white dark:bg-[#141414] border border-stone-200 dark:border-stone-800 rounded-2xl px-6 flex items-center gap-2 text-sm font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors">
          <Filter className="w-4 h-4 text-stone-400" />
          Filtres
        </button>
      </div>

      <div className="bg-white dark:bg-[#141414] rounded-3xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#141414] dark:bg-black text-white text-[9px] font-bold tracking-widest">
              <tr>
                <th className="px-6 py-4 font-semibold">Client</th>
                <th className="px-6 py-4 font-semibold">Chambre / Lit</th>
                <th className="px-6 py-4 text-center font-semibold">Dates</th>
                <th className="px-6 py-4 font-semibold">Statut</th>
                <th className="px-6 py-4 text-right font-semibold">Montant</th>
                <th className="px-6 py-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="text-[11px]">
              {reservations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                       <Calendar className="w-8 h-8 text-stone-200 dark:text-stone-800" />
                       <p className="text-stone-500 font-bold">Aucune réservation pour le moment</p>
                       <p className="text-stone-400 text-[10px]">Utilisez le bouton "Nouvelle réservation" pour commencer</p>
                    </div>
                  </td>
                </tr>
              ) : reservations.map((res) => (
                <tr key={res.id} className="border-b border-stone-100 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-900/40 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-stone-900 dark:text-stone-200">{res.customerName}</div>
                    <div className="text-[10px] text-stone-400 font-mono">#{res.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-stone-600 dark:text-stone-400">{res.roomNumber}</div>
                    <div className="text-[9px] text-stone-400">Lit standard</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2 text-stone-500 dark:text-stone-400 font-medium">
                        <Calendar className="w-3 h-3 text-stone-300 dark:text-stone-700" />
                        <span>{res.checkIn} <span className="opacity-30">→</span> {res.checkOut}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={res.status} />
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-stone-900 dark:text-white text-[9px]">
                    {formatCurrency(res.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => alert(`Détails de la réservation #${res.id}`)}
                        className="p-1.5 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 rounded-md hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    'confirmed': 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-100 dark:border-green-900/30',
    'pending': 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-orange-100 dark:border-orange-900/30',
    'cancelled': 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-100 dark:border-red-900/30',
    'checked-out': 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
  };

  const labels: Record<string, string> = {
    'confirmed': 'Confirmé',
    'pending': 'En attente',
    'cancelled': 'Annulé',
    'checked-out': 'Check-out'
  };

  return (
    <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold border", styles[status])}>
      {labels[status]}
    </span>
  );
}
