import React, { useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  TrendingDown,
  PieChart as PieIcon,
  BrainCircuit,
  Hotel,
  Bed,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Search,
  MoreHorizontal,
  MessageSquare
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";
import { motion, AnimatePresence } from "motion/react";
import { DashboardStats, Hostel, User } from "../types";
import { formatCurrency } from "../lib/loanUtils";
import { ReservationForm, ExpenseForm, PaymentForm } from "./Forms";
import DailyReport from "./DailyReport";
import MonthlyReport from "./MonthlyReport";

interface DashboardProps {
  stats: DashboardStats;
  selectedHostel: Hostel;
  canEdit: boolean;
  user: User;
}

export default function Dashboard({ stats, selectedHostel, canEdit, user }: DashboardProps) {
  const [activeAction, setActiveAction] = useState<string | null>(null);
  
  const trendData = [
    { name: 'Lun', occ: 0 },
    { name: 'Mar', occ: 0 },
    { name: 'Mer', occ: 0 },
    { name: 'Jeu', occ: 0 },
    { name: 'Ven', occ: 0 },
    { name: 'Sam', occ: 0 },
    { name: 'Dim', occ: 0 },
  ];

  const handleAction = (action: string) => {
    if (!canEdit && action !== 'rapport') {
      alert("Accès en lecture seule. Vous ne pouvez pas modifier les données de cet établissement.");
      return;
    }
    setActiveAction(action);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 items-center mb-8">
        <button 
          onClick={() => handleAction('réservation')}
          className={cn(
            "rounded-xl px-5 py-3 text-xs font-bold transition-all flex items-center gap-2 shadow-lg",
            canEdit 
              ? "bg-brand-primary text-white shadow-brand-primary/10 hover:scale-[1.02] active:scale-95" 
              : "bg-stone-100 text-stone-400 cursor-not-allowed"
          )}
        >
          <Bed className="w-4 h-4" /> Ajouter une réservation
        </button>
        <button 
          onClick={() => handleAction('dépense')}
          className={cn(
            "border rounded-xl px-5 py-3 text-xs font-bold transition-all flex items-center gap-2 shadow-sm",
            canEdit
              ? "bg-white dark:bg-[#141414] border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-900"
              : "bg-stone-50 dark:bg-stone-900 border-stone-100 dark:border-stone-800 text-stone-400 cursor-not-allowed"
          )}
        >
          <TrendingDown className="w-4 h-4" /> Ajouter une dépense
        </button>
        <button 
          onClick={() => handleAction('paiement')}
          className={cn(
            "border rounded-xl px-5 py-3 text-xs font-bold transition-all flex items-center gap-2 shadow-sm",
            canEdit
              ? "bg-white dark:bg-[#141414] border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-900"
              : "bg-stone-50 dark:bg-stone-900 border-stone-100 dark:border-stone-800 text-stone-400 cursor-not-allowed"
          )}
        >
          <TrendingUp className="w-4 h-4" /> Ajouter un paiement
        </button>
        <div className="h-8 w-px bg-stone-200 dark:bg-stone-800 mx-2 hidden lg:block"></div>
        <div className="flex items-center gap-6">
          <button 
            onClick={() => handleAction('rapport')}
            className="text-stone-400 hover:text-brand-primary text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
          >
            <PieIcon className="w-3.5 h-3.5" /> Rapport Caisse
          </button>
          <button 
            onClick={() => handleAction('calendrier')}
            className="text-stone-400 hover:text-brand-primary text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
          >
            <Calendar className="w-3.5 h-3.5" /> Rapport Mensuel
          </button>
        </div>
        <button 
          onClick={() => alert('Statistiques mensuelles en cours de génération...')}
          className="text-stone-400 hover:text-brand-primary text-xs font-bold transition-colors"
        >
          Statistiques mensuelles
        </button>
      </div>

      <AnimatePresence>
        {activeAction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveAction(null)}
              className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={cn(
                "relative bg-white dark:bg-[#141414] rounded-[32px] w-full overflow-hidden shadow-2xl border border-stone-100 dark:border-white/5",
                activeAction === 'réservation' ? "max-w-3xl" : activeAction === 'rapport' || activeAction === 'calendrier' ? "max-w-[90vw] lg:max-w-6xl" : "max-w-lg"
              )}
            >
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-stone-900 dark:text-white capitalize">
                      {activeAction === 'rapport' ? 'Rapport Journalier' : activeAction === 'calendrier' ? 'Disponibilité Mensuelle' : `Nouveau ${activeAction}`}
                    </h3>
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-1">{selectedHostel.name}</p>
                  </div>
                  <button onClick={() => setActiveAction(null)} className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-2">
                    <ChevronDown className={cn("w-5 h-5 transition-transform", activeAction === 'rapport' ? "rotate-90" : "")} />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {activeAction === 'réservation' ? (
                    <ReservationForm 
                      user={user} 
                      selectedHostel={selectedHostel} 
                      onCancel={() => setActiveAction(null)} 
                      onSubmit={(data) => {
                        console.log("Submit Reservation:", data);
                        alert("Réservation enregistrée avec succès !");
                        setActiveAction(null);
                      }} 
                    />
                  ) : activeAction === 'dépense' ? (
                    <ExpenseForm 
                      user={user} 
                      onCancel={() => setActiveAction(null)} 
                      onSubmit={(data) => {
                        console.log("Submit Expense:", data);
                        alert("Dépense enregistrée avec succès !");
                        setActiveAction(null);
                      }} 
                    />
                  ) : activeAction === 'paiement' ? (
                    <PaymentForm 
                      user={user} 
                      onCancel={() => setActiveAction(null)} 
                      onSubmit={(data) => {
                        console.log("Submit Payment:", data);
                        alert("Paiement enregistré avec succès !");
                        setActiveAction(null);
                      }} 
                    />
                  ) : activeAction === 'rapport' ? (
                    <DailyReport />
                  ) : activeAction === 'calendrier' ? (
                    <MonthlyReport />
                  ) : (
                    <div className="space-y-6">
                      <div className="p-12 bg-stone-50 dark:bg-stone-900 rounded-2xl border-2 border-dashed border-stone-200 dark:border-stone-800 text-center text-xs">
                        <p className="text-stone-500">Le formulaire de {activeAction} est en cours de création.</p>
                      </div>
                      <div className="flex gap-4">
                        <button 
                          onClick={() => setActiveAction(null)}
                          className="flex-1 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 py-3 rounded-xl font-bold text-xs"
                        >
                          Annuler
                        </button>
                        <button 
                          onClick={() => setActiveAction(null)}
                          className="flex-1 bg-brand-primary text-white py-3 rounded-xl font-bold text-xs shadow-lg shadow-brand-primary/20"
                        >
                          Confirmer
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Taux d'occupation" 
          value={`${stats.occupancyRate}%`} 
          trend="0%" 
          positive={true} 
        />
        <StatCard 
          label="Revenus mensuels" 
          value={formatCurrency(stats.totalRevenue)} 
          trend="0%" 
          positive={true} 
        />
        <StatCard 
          label="Dépenses" 
          value={formatCurrency(stats.totalExpenses)} 
          trend="0%" 
          positive={true} 
        />
        <StatCard 
          label="Profit net" 
          value={formatCurrency(stats.netProfit)} 
          trend="0%" 
          positive={true} 
        />
      </div>

      {/* Planning Controls */}
      <div className="bg-white dark:bg-[#141414] rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6 transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-stone-100 dark:hover:bg-stone-900 rounded-lg text-stone-400">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-bold text-stone-900 dark:text-stone-100 bg-stone-100 dark:bg-stone-900 px-4 py-2 rounded-xl">Semaine précédente</span>
            <button className="p-2 hover:bg-stone-100 dark:hover:bg-stone-900 rounded-lg text-stone-400">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
             <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input type="text" value="15/05/2026" readOnly className="pl-10 pr-4 py-2 bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800 rounded-xl text-[10px] font-bold w-41 outline-none text-stone-900 dark:text-stone-100 transition-colors" />
             </div>
             <button className="bg-brand-primary text-white px-6 py-2 rounded-xl text-[10px] font-bold flex items-center gap-2 shadow-lg shadow-brand-primary/10">
               <Search className="w-3 h-3" /> Recherche
             </button>
             <span className="text-xs font-bold text-stone-900 dark:text-stone-100 bg-stone-100 dark:bg-stone-800 px-4 py-2 rounded-xl cursor-default transition-colors">Semaine suivante</span>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {['Mar 12 mai', 'Mer 13 mai', 'Jeu 14 mai', 'Ven 15 mai', 'Sam 16 mai', 'Dim 17 mai', 'Lun 18 mai'].map((day) => (
            <button 
              key={day}
              className={cn(
                "flex-1 min-w-[120px] py-3 px-4 rounded-xl text-[10px] font-bold tracking-wider transition-all border",
                day.includes('Ven 15') 
                  ? "bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/20" 
                  : "bg-white dark:bg-stone-900 text-stone-400 border-stone-100 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700"
              )}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Occupancy Table List */}
      <div className="space-y-4">
        <div className="bg-brand-primary text-white rounded-2xl px-6 py-3 flex items-center gap-3 shadow-lg shadow-brand-primary/10">
           <span className="text-xs font-bold">Chambres occupées au vendredi 15 mai 2026</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="p-12 border-2 border-dashed border-stone-200 dark:border-white/5 rounded-3xl flex flex-col items-center justify-center text-center space-y-2">
            <Hotel className="w-10 h-10 text-stone-200 dark:text-stone-800" />
            <p className="text-sm font-bold text-stone-500">Aucune activité pour aujourd'hui</p>
            <p className="text-[10px] text-stone-400">Les arrivées et départs apparaîtront ici</p>
          </div>
        </div>
      </div>

      {/* Main Stats Chart */}
      <div className="bg-white dark:bg-[#141414] rounded-3xl p-8 border border-stone-200 dark:border-stone-800 shadow-sm transition-colors">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-base font-bold tracking-tight text-stone-900 dark:text-white">Occupation hebdomadaire</h3>
            <p className="text-xs text-stone-400">Evolution du taux d'occupation sur les 7 derniers jours</p>
          </div>
        </div>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorOcc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" className="opacity-10" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} tick={{fill: '#94a3b8'}} />
              <YAxis axisLine={false} tickLine={false} fontSize={10} tick={{fill: '#94a3b8'}} />
              <Tooltip 
                 contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.3)', fontSize: '10px', backgroundColor: '#1c1c1c', color: '#fff' }}
                 itemStyle={{ color: '#fff' }}
              />
              <Area 
                type="monotone" 
                dataKey="occ" 
                stroke="#f97316" 
                fillOpacity={1} 
                fill="url(#colorOcc)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Floating Chatbot Button - Improved Size & Style */}
      <button 
        onClick={() => alert('Chatbot Nomads en cours de chargement...')}
        className="fixed bottom-6 right-6 z-40 bg-brand-dark dark:bg-brand-primary text-brand-primary dark:text-white p-3 rounded-xl shadow-2xl hover:scale-110 active:scale-95 transition-all group flex items-center gap-2 border border-white/10"
      >
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-bold text-[10px] whitespace-nowrap">Assistant</span>
        <MessageSquare className="w-5 h-5" />
      </button>
    </div>
  );
}

function OccupancySection({ name, rows }: { name: string, rows: any[] }) {
  return (
    <div className="bg-white dark:bg-[#141414] rounded-2xl border border-stone-200 dark:border-white/5 shadow-sm overflow-hidden transition-colors">
      <div className="bg-stone-50 dark:bg-stone-900/40 px-6 py-2 border-b border-stone-200 dark:border-white/5 flex items-center gap-2">
        <h4 className="text-[9px] font-bold text-stone-600 dark:text-stone-400 tracking-wider transition-all uppercase">{name}</h4>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#141414] dark:bg-black/40 text-white text-[8px] font-bold tracking-widest">
            <tr>
              <th className="px-5 py-3 font-semibold uppercase">Actions</th>
              <th className="px-5 py-3 font-semibold uppercase">Client</th>
              <th className="px-5 py-3 font-semibold uppercase">Statut</th>
              <th className="px-5 py-3 font-semibold uppercase">Dates</th>
              <th className="px-5 py-3 text-center font-semibold uppercase">Nuits</th>
              <th className="px-5 py-3 font-semibold uppercase">Chambre</th>
              <th className="px-5 py-3 text-right font-semibold uppercase">Total</th>
            </tr>
          </thead>
          <tbody className="text-[10px]">
            {rows.map((row, idx) => (
              <tr key={idx} className="border-b border-stone-100 dark:border-white/5 hover:bg-stone-50 dark:hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-3">
                  <div className="flex gap-1.5">
                    <button 
                      onClick={() => alert(`Modifier la réservation de ${row.client}`)}
                      className="bg-orange-500 text-white p-1 rounded-md shadow-sm hover:scale-105 transition-transform"
                    >
                      <TrendingUp className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={() => alert(`Supprimer la réservation de ${row.client}`)}
                      className="bg-red-500 text-white p-1 rounded-md shadow-sm hover:scale-105 transition-transform"
                    >
                      <TrendingDown className="w-3 h-3" />
                    </button>
                  </div>
                </td>
                <td className="px-5 py-3 font-bold text-stone-800 dark:text-stone-200">{row.client}</td>
                <td className="px-5 py-3 text-[9px]">
                  <span className={cn(
                    "px-2 py-0.5 rounded font-bold border transition-colors",
                    row.status === "Confirmé" ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-100 dark:border-green-900/30" : "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-orange-100 dark:border-orange-900/30"
                  )}>
                    {row.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-stone-500 dark:text-stone-400 font-medium whitespace-nowrap">
                  {row.checkIn} <span className="opacity-30">→</span> {row.checkOut}
                </td>
                <td className="px-5 py-3 text-center font-bold text-stone-600 dark:text-stone-300">{row.nights}</td>
                <td className="px-5 py-3 text-stone-400 dark:text-stone-500 font-medium">{row.room}</td>
                <td className="px-5 py-3 text-right font-bold text-stone-900 dark:text-white text-[8.5px] whitespace-nowrap">{row.total}.00 €</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ label, value, trend, positive }: { label: string, value: string, trend: string, positive: boolean }) {
  return (
    <div className="bg-white dark:bg-[#141414] rounded-3xl p-6 border border-stone-200 dark:border-white/5 shadow-sm space-y-2 group hover:border-brand-primary/50 transition-all">
      <span className="text-[9px] font-bold tracking-widest text-stone-400 group-hover:text-brand-primary/60 transition-colors uppercase">{label}</span>
      <div className="flex items-end justify-between">
        <div className="text-2xl font-bold tracking-tight text-stone-900 dark:text-white">{value}</div>
        <div className={cn(
          "flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full transition-colors",
          positive ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20" : "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20"
        )}>
          {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trend}
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}
