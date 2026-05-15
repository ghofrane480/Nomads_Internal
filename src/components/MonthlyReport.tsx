import React, { useState } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Calendar as CalendarIcon,
  ArrowRightLeft,
  Bed,
  Filter,
  Download
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SIMPLE_ROOMS = ["SIDI BOU SAID", "DOUGGA", "CARTHAGO", "TABARKA", "TESTOUR"];
const MULTI_ROOMS = [
  { name: "SFAX", total: 10 },
  { name: "SOUSSE", total: 4 },
  { name: "NABEUL", total: 4 },
  { name: "Camping ZONE", total: 5 },
  { name: "Staff Room", total: 2 }
];

export default function MonthlyReport() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 15)); // May 15, 2026
  const [searchQuery, setSearchQuery] = useState("");

  const daysToDisplay = 30;
  const dates = Array.from({ length: daysToDisplay }).map((_, i) => {
    const d = new Date(currentDate);
    d.setDate(currentDate.getDate() + i);
    return d;
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  };

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  return (
    <div className="space-y-6 max-h-[85vh] overflow-hidden flex flex-col pb-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#141414] py-2 z-10">
        <div>
          <div className="flex items-center gap-2 text-brand-primary mb-1">
            <CalendarIcon className="w-5 h-5" />
            <h2 className="text-xl font-bold tracking-tight text-stone-900 dark:text-white">Rapport réservations / Mois</h2>
          </div>
          <p className="text-xs text-stone-400 font-medium">
            Période: {formatDate(dates[0])} au {formatDate(dates[dates.length - 1])}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-xl p-1">
            <button 
              onClick={() => {
                const d = new Date(currentDate);
                d.setMonth(d.getMonth() - 1);
                setCurrentDate(d);
              }}
              className="p-2 hover:bg-white dark:hover:bg-stone-700 rounded-lg text-stone-500 transition-all shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="px-4 text-xs font-bold text-stone-700 dark:text-stone-300">
              {currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }).toUpperCase()}
            </div>
            <button 
              onClick={() => {
                const d = new Date(currentDate);
                d.setMonth(d.getMonth() + 1);
                setCurrentDate(d);
              }}
              className="p-2 hover:bg-white dark:hover:bg-stone-700 rounded-lg text-stone-500 transition-all shadow-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-brand-primary transition-colors" />
            <input 
              type="text"
              placeholder="Filtrer par chambre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-xs outline-none focus:ring-2 focus:ring-brand-primary/50 w-48"
            />
          </div>

          <button className="p-2.5 bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 rounded-xl hover:bg-stone-200 transition-all">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Availability Grid */}
      <div className="flex-1 overflow-auto border border-stone-200 dark:border-white/5 rounded-[32px] bg-white dark:bg-[#111111] shadow-sm custom-scrollbar">
        <table className="w-full border-collapse min-w-[1200px]">
          <thead className="sticky top-0 z-20">
            <tr className="bg-stone-50 dark:bg-stone-900 shadow-sm">
              <th className="px-6 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest text-left sticky left-0 bg-stone-50 dark:bg-stone-900 z-30 min-w-[200px] border-r border-stone-100 dark:border-white/5">
                Chambre / Lit
              </th>
              {dates.map((date, i) => (
                <th key={i} className={cn(
                  "px-2 py-3 text-[10px] font-bold text-center border-r border-stone-100 dark:border-white/5",
                  isWeekend(date) ? "bg-orange-50/50 dark:bg-orange-950/20 text-orange-600" : "text-stone-500 dark:text-stone-400"
                )}>
                  <div>{date.toLocaleDateString('fr-FR', { weekday: 'short' }).charAt(0).toUpperCase()}</div>
                  <div className="text-xs pt-1">{date.getDate()}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Simple Rooms */}
            <tr className="bg-stone-100/30 dark:bg-white/[0.02]">
              <td colSpan={dates.length + 1} className="px-6 py-2 text-[10px] font-bold text-brand-primary uppercase tracking-widest bg-stone-100/50 dark:bg-stone-900/50 sticky left-0">
                Chambres Privées
              </td>
            </tr>
            {SIMPLE_ROOMS.map(room => (
              <tr key={room} className="border-b border-stone-50 dark:border-white/5 hover:bg-stone-50/50 dark:hover:bg-white/[0.01]">
                <td className="px-6 py-4 sticky left-0 bg-white dark:bg-[#111111] z-10 border-r border-stone-100 dark:border-white/5 flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-primary shadow-sm shadow-brand-primary/40"></div>
                  <span className="text-[11px] font-bold text-stone-700 dark:text-stone-300">{room}</span>
                </td>
                {dates.map((date, i) => {
                  const isAvailable = Math.random() > 0.3; // Mock availability
                  return (
                    <td key={i} className={cn(
                      "px-2 py-4 border-r border-stone-50 dark:border-white/5 text-center",
                      isWeekend(date) && "bg-stone-50/30 dark:bg-white/[0.01]"
                    )}>
                      {isAvailable ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" strokeWidth={3} />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500 mx-auto" strokeWidth={3} />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* Multi Rooms */}
            <tr className="bg-stone-100/30 dark:bg-white/[0.02]">
              <td colSpan={dates.length + 1} className="px-6 py-2 text-[10px] font-bold text-brand-primary uppercase tracking-widest bg-stone-100/50 dark:bg-stone-900/50 sticky left-0">
                Dortoirs & Multiple
              </td>
            </tr>
            {MULTI_ROOMS.map(room => (
              <tr key={room.name} className="border-b border-stone-50 dark:border-white/5 hover:bg-stone-50/50 dark:hover:bg-white/[0.01]">
                <td className="px-6 py-4 sticky left-0 bg-white dark:bg-[#111111] z-10 border-r border-stone-100 dark:border-white/5">
                  <div className="flex items-center gap-3">
                    <Bed className="w-3.5 h-3.5 text-stone-400" />
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-stone-700 dark:text-stone-300">{room.name}</span>
                      <span className="text-[9px] text-stone-400">{room.total} LITS</span>
                    </div>
                  </div>
                </td>
                {dates.map((date, i) => {
                  const free = Math.floor(Math.random() * (room.total + 1));
                  return (
                    <td key={i} className={cn(
                      "px-2 py-4 border-r border-stone-50 dark:border-white/5 text-center",
                      isWeekend(date) && "bg-stone-50/30 dark:bg-white/[0.01]"
                    )}>
                      <span className={cn(
                        "text-[10px] font-mono font-bold",
                        free === 0 ? "text-red-500" : free === room.total ? "text-green-500" : "text-stone-600 dark:text-stone-400"
                      )}>
                        {free}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-6 px-6 py-3 bg-stone-50 dark:bg-white/5 rounded-2xl border border-stone-100 dark:border-white/5">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="w-3.5 h-3.5 text-red-500" />
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Complet</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-8 bg-brand-dark rounded-2xl p-3 text-white">
          <div className="flex items-center gap-3">
            <ArrowRightLeft className="w-3.5 h-3.5 text-brand-primary" />
            <span className="text-xs font-bold">1 € = 3.400 TND</span>
          </div>
          <div className="h-4 w-px bg-white/10"></div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold">1 $ = 2.880 TND</span>
          </div>
        </div>

        <div className="flex items-center justify-end">
           <img 
            src="https://images.unsplash.com/photo-1549443163-35541530e5d2?q=80&w=200&auto=format&fit=crop" 
            alt="Nomads Logo" 
            className="h-8 grayscale opacity-50 dark:invert transition-all"
           />
        </div>
      </div>
    </div>
  );
}
