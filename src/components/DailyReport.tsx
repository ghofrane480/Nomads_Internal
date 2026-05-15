import React from "react";
import { 
  FileText, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  Settings2,
  Printer,
  Download,
  Calendar,
  AlertCircle,
  ArrowRightLeft
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ReportSectionProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

function ReportSection({ title, children, icon }: ReportSectionProps) {
  return (
    <div className="bg-white dark:bg-[#111111] rounded-2xl border border-stone-200 dark:border-white/5 overflow-hidden shadow-sm h-full">
      <div className="bg-stone-50/50 dark:bg-stone-900/40 px-6 py-3 border-b border-stone-100 dark:border-white/5 flex items-center gap-2">
        {icon && <div className="text-brand-primary">{icon}</div>}
        <h3 className="text-[10px] font-bold text-stone-900 dark:text-stone-300 uppercase tracking-widest">{title}</h3>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

function ReportItem({ label, value, subtext, color }: { label: string, value: string, subtext?: string, color?: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-stone-50 dark:border-white/5 last:border-0">
      <div className="space-y-0.5">
        <div className="text-xs text-stone-500 dark:text-stone-400">{label}</div>
        {subtext && <div className="text-[9px] text-stone-400 font-medium">{subtext}</div>}
      </div>
      <div className={cn("text-xs font-bold", color || "text-stone-900 dark:text-stone-200")}>
        {value}
      </div>
    </div>
  );
}

export default function DailyReport() {
  const today = "Vendredi 15 Mai 2026";
  
  return (
    <div className="space-y-6 max-h-[85vh] overflow-y-auto pr-2 scrollbar-custom pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 bg-white dark:bg-[#141414] py-4 z-10">
        <div>
          <div className="flex items-center gap-2 text-brand-primary mb-1">
            <FileText className="w-5 h-5" />
            <h2 className="text-xl font-bold tracking-tight text-stone-900 dark:text-white transition-colors">Rapport caisse journalière</h2>
          </div>
          <p className="text-xs text-stone-400 flex items-center gap-2">
            <Calendar className="w-3 h-3" /> {today}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-3 bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-700 transition-all hover:scale-105 active:scale-95" title="Imprimer">
            <Printer className="w-4 h-4" />
          </button>
          <button className="p-3 bg-brand-primary text-white rounded-xl shadow-lg shadow-brand-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span className="text-xs font-bold">Export PDF</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Paiements (NET) */}
        <ReportSection title="Paiements (NET)" icon={<DollarSign className="w-4 h-4" />}>
          <div className="space-y-1">
            <ReportItem label="Espèces (TND)" value="0.000 TND" />
            <ReportItem label="Virement (EUR)" value="0.00 €" />
            <ReportItem label="Carte (TND/EUR/USD)" value="0.000 TND" />
            <div className="mt-4 pt-4 border-t border-stone-200 dark:border-white/10">
              <h4 className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-2">Totaux par devise</h4>
              <ReportItem label="Total TND" value="0.000 TND" color="text-brand-primary" />
              <ReportItem label="Total EUR" value="0.00 €" color="text-brand-primary" />
              <ReportItem label="Total USD" value="0.00 $" color="text-brand-primary" />
            </div>
          </div>
        </ReportSection>

        {/* Échanges */}
        <ReportSection title="Échanges" icon={<RefreshCw className="w-4 h-4" />}>
          <div className="space-y-1">
            <ReportItem label="Entrées (devise reçue)" value="0.00 € / $" />
            <ReportItem label="Sorties TND (cash donné)" value="0.000 TND" color="text-red-500" />
            <div className="mt-6 p-4 bg-orange-50 dark:bg-brand-primary/5 rounded-xl border border-orange-100 dark:border-brand-primary/10">
               <div className="flex items-start gap-2">
                 <AlertCircle className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                 <p className="text-[10px] text-orange-800 dark:text-stone-400 leading-relaxed font-medium">
                   Les échanges de devises impactent le solde net en espèces TND.
                 </p>
               </div>
            </div>
          </div>
        </ReportSection>

        {/* Ajustements */}
        <ReportSection title="Ajustements" icon={<Settings2 className="w-4 h-4" />}>
          <div className="space-y-1">
            <ReportItem label="Ajustements créés" value="0" subtext="Aujourd'hui" />
            <ReportItem label="Ajustements imputés" value="0" subtext="Aujourd'hui" />
            <div className="mt-4 pt-4 border-t border-stone-200 dark:border-white/10">
              <h4 className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-2">Totaux imputés</h4>
              <ReportItem label="Total TND" value="0.000 TND" />
              <ReportItem label="Total EUR" value="0.00 €" />
              <ReportItem label="Total USD" value="0.00 $" />
            </div>
          </div>
        </ReportSection>

        {/* Dépenses & retours */}
        <ReportSection title="Dépenses & retours" icon={<TrendingDown className="w-4 h-4" />}>
          <div className="space-y-1">
            <ReportItem label="Dépenses imputées" value="0" />
            <ReportItem label="Total dépenses (TND)" value="0.000 TND" color="text-red-500" />
            <ReportItem label="Total retours imputés" value="0.000 TND" color="text-green-500" />
            <div className="mt-4 pt-4 border-t-2 border-stone-100 dark:border-white/5">
              <ReportItem label="Dépenses nettes (TND)" value="0.000 TND" color="text-brand-primary" />
            </div>
          </div>
        </ReportSection>

        {/* Solde net du jour */}
        <ReportSection title="Solde net du jour" icon={<TrendingUp className="w-4 h-4" />}>
          <div className="space-y-1">
            <ReportItem label="Espèces (TND)" value="0.000 TND" color="text-stone-900 dark:text-white" />
            <ReportItem label="Virement (EUR)" value="0.00 €" />
            <ReportItem label="Carte (Multi)" value="0.000 TND" />
            <ReportItem label="USD" value="0.00 $" />
          </div>
        </ReportSection>

        {/* Extras & Taux */}
        <div className="space-y-6">
          <ReportSection title="Extras" icon={<TrendingUp className="w-4 h-4" />}>
            <div className="space-y-1">
              <ReportItem label="Réservés (TND)" value="0.000 TND" />
              <ReportItem label="Payés (TND)" value="0.000 TND" color="text-green-500" />
            </div>
          </ReportSection>
          
          <div className="p-6 bg-brand-dark rounded-2xl text-white space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Taux de change</h4>
              <ArrowRightLeft className="w-4 h-4 text-brand-primary" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                 <span className="text-xs">1 € = </span>
                 <span className="text-xs font-bold text-brand-primary">3.400 TND</span>
              </div>
              <div className="flex items-center justify-between">
                 <span className="text-xs">1 $ = </span>
                 <span className="text-xs font-bold text-brand-primary">2.880 TND</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-8 bg-stone-50 dark:bg-stone-900/40 rounded-3xl border border-stone-200 dark:border-white/5 text-center space-y-2">
         <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Fin du rapport journalier</p>
         <p className="text-[9px] text-stone-500">Généré automatiquement par NOMADS PMS • Identifiant session: {Math.random().toString(36).substring(7).toUpperCase()}</p>
      </div>
    </div>
  );
}
