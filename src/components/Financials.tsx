import React from "react";
import { Plus, Download, TrendingUp, TrendingDown, Tag } from "lucide-react";
import { CashFlow } from "../types";
import { formatCurrency } from "../lib/loanUtils";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FinancialsProps {
  cashFlow: CashFlow[];
  canEdit: boolean;
}

export default function Financials({ cashFlow, canEdit }: FinancialsProps) {
  const totalIncome = cashFlow.filter(c => c.type === 'income').reduce((acc, c) => acc + c.amount, 0);
  const totalExpense = cashFlow.filter(c => c.type === 'expense').reduce((acc, c) => acc + c.amount, 0);

  const handleAdd = () => {
    if (!canEdit) {
      alert("Accès en lecture seule. Seul le manager ou l'administrateur de cet établissement peut enregistrer des transactions.");
      return;
    }
    alert("Ouverture du formulaire de transaction...");
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-white transition-colors">Suivi financier</h2>
          <p className="text-sm text-stone-500">Gestion des revenus et dépenses opérationnelles</p>
        </div>
        <div className="flex gap-3">
           <button className="bg-white dark:bg-[#141414] border border-stone-200 dark:border-stone-800 rounded-full px-6 py-3 text-sm font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-900 transition-all flex items-center gap-2 shadow-sm">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button 
            onClick={handleAdd}
            className={cn(
              "rounded-full px-6 py-3 text-sm font-bold shadow-lg transition-all flex items-center gap-2",
              canEdit 
                ? "bg-brand-primary text-white shadow-brand-primary/20 hover:scale-[1.02] active:scale-95" 
                : "bg-stone-100 text-stone-400 cursor-not-allowed"
            )}
          >
            <Plus className="w-4 h-4" /> Nouvelle transaction
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#141414] rounded-[32px] p-8 border border-stone-200 dark:border-white/5 shadow-sm flex items-center justify-between overflow-hidden relative group transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-110 transition-transform">
             <TrendingUp className="w-24 h-24 text-green-600" />
          </div>
          <div className="space-y-1 relative z-10">
             <span className="text-[10px] font-bold tracking-widest text-green-600/60 uppercase">Total revenus</span>
             <div className="text-3xl font-bold text-stone-900 dark:text-white tracking-tight">{formatCurrency(totalIncome)}</div>
          </div>
          <div className="w-14 h-14 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-400 border border-green-100 dark:border-green-900/30 relative z-10 transition-colors">
            <TrendingUp className="w-7 h-7" />
          </div>
        </div>
        <div className="bg-white dark:bg-[#141414] rounded-[32px] p-8 border border-stone-200 dark:border-white/5 shadow-sm flex items-center justify-between overflow-hidden relative group transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-110 transition-transform">
             <TrendingDown className="w-24 h-24 text-red-600" />
          </div>
          <div className="space-y-1 relative z-10">
             <span className="text-[10px] font-bold tracking-widest text-red-600/60 uppercase">Total dépenses</span>
             <div className="text-3xl font-bold text-stone-900 dark:text-white tracking-tight">{formatCurrency(totalExpense)}</div>
          </div>
           <div className="w-14 h-14 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 relative z-10 transition-colors">
            <TrendingDown className="w-7 h-7" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#141414] rounded-3xl border border-stone-200 dark:border-white/5 overflow-hidden shadow-sm transition-colors">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-stone-100 dark:border-white/5 bg-stone-50/50 dark:bg-stone-900/40">
              <th className="px-6 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Date</th>
              <th className="px-6 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Catégorie</th>
              <th className="px-6 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Description</th>
              <th className="px-6 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest text-right">Montant</th>
            </tr>
          </thead>
          <tbody>
            {cashFlow.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center gap-2">
                     <Tag className="w-8 h-8 text-stone-200 dark:text-stone-800" />
                     <p className="text-stone-500 font-bold">Aucune transaction enregistrée</p>
                     <p className="text-stone-400 text-[10px]">Les revenus et dépenses apparaîtront ici</p>
                  </div>
                </td>
              </tr>
            ) : cashFlow.map((item) => (
              <tr key={item.id} className="border-b border-stone-50 dark:border-white/5 hover:bg-stone-50/30 dark:hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-4 text-xs font-semibold font-mono text-stone-400 dark:text-stone-500">{item.date}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-white/5 text-stone-600 dark:text-stone-400 text-[10px] font-bold transition-colors">
                    <Tag className="w-3 h-3 opacity-40" />
                    {item.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-stone-600 dark:text-stone-300 transition-colors">{item.description}</td>
                <td className={cn(
                  "px-6 py-4 text-sm font-bold text-right",
                  item.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'
                )}>
                  {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
