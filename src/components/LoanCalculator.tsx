import React, { useState, useEffect, useMemo } from "react";
import { 
  TrendingUp, 
  PieChart, 
  Calendar, 
  Euro, 
  Calculator, 
  Table as TableIcon, 
  BrainCircuit,
  ChevronRight,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { format } from "date-fns";
import { LoanInputs, LoanResults } from "../types/loan";
import { calculateLoan, formatCurrency } from "../lib/loanUtils";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function LoanCalculator() {
  const [inputs, setInputs] = useState<LoanInputs>({
    amount: 250000,
    annualRate: 3.5,
    durationYears: 20,
    startDate: format(new Date(), "yyyy-MM-dd"),
  });

  const results = useMemo(() => calculateLoan(inputs), [inputs]);
  const [activeTab, setActiveTab] = useState<"summary" | "table" | "ai">("summary");
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const getAiAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/analyze-loan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          loanData: {
            amount: inputs.amount,
            rate: inputs.annualRate,
            durationMonths: inputs.durationYears * 12,
            monthlyPayment: results.monthlyPayment,
            totalInterest: results.totalInterest
          } 
        }),
      });
      const data = await response.json();
      setAiAnalysis(data.analysis);
      setActiveTab("ai");
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const chartData = results.amortizationSchedule.filter((_, idx) => idx % 12 === 0 || idx === results.amortizationSchedule.length - 1);
  
  const pieData = [
    { name: "Capital", value: inputs.amount, color: "#141414" },
    { name: "Intérêts", value: results.totalInterest, color: "#9e9e9e" },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans text-[#141414] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#141414]/10 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="w-5 h-5 opacity-40" />
              <span className="font-mono text-[11px] uppercase tracking-wider opacity-50">Simalateur de Prêt AMT v1.0</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-medium tracking-tight">Prêt à Amortissement</h1>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-mono text-[10px] uppercase opacity-40">Mise à jour</span>
            <span className="font-mono text-sm">{format(new Date(), "dd.MM.yyyy")}</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls - Sidebar */}
          <section className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-black/5 space-y-6">
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider opacity-60 pb-4 border-b border-black/5">
                <Euro className="w-4 h-4" /> Configuration du Prêt
              </h2>

              <div className="space-y-4">
                <InputGroup 
                  label="Montant du Capital"
                  value={inputs.amount}
                  onChange={(val) => setInputs({...inputs, amount: val})}
                  icon="€"
                  min={1000}
                  step={5000}
                />
                <InputGroup 
                  label="Taux d'Intérêt Annuel"
                  value={inputs.annualRate}
                  onChange={(val) => setInputs({...inputs, annualRate: val})}
                  icon="%"
                  min={0}
                  max={15}
                  step={0.1}
                />
                <InputGroup 
                  label="Durée du Remboursement (Années)"
                  value={inputs.durationYears}
                  onChange={(val) => setInputs({...inputs, durationYears: val})}
                  icon="AN"
                  min={1}
                  max={40}
                  step={1}
                />
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-widest opacity-40 mb-2">Date de Début</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
                    <input 
                      type="date"
                      value={inputs.startDate}
                      onChange={(e) => setInputs({...inputs, startDate: e.target.value})}
                      className="w-full bg-[#f9f9f9] border-none rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-black transition-all"
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={getAiAnalysis}
                disabled={isAnalyzing}
                className="w-full mt-6 bg-[#141414] text-white rounded-full py-4 px-6 flex items-center justify-center gap-3 font-medium hover:bg-black/90 transition-all disabled:opacity-50 group overflow-hidden"
              >
                {isAnalyzing ? (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <BrainCircuit className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <>
                    <BrainCircuit className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>Analyse Stratégique AI</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Stats Sidebar */}
            <div className="bg-[#141414] text-white rounded-3xl p-8 space-y-6">
              <div>
                <span className="text-[10px] uppercase tracking-widest opacity-50 block mb-1">Mensualité Estimée</span>
                <div className="text-4xl font-light tracking-tighter">{formatCurrency(results.monthlyPayment)}</div>
              </div>
              <div className="h-px bg-white/10" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] uppercase tracking-widest opacity-50 block mb-1">Total Intérêts</span>
                  <div className="text-lg font-medium">{formatCurrency(results.totalInterest)}</div>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-widest opacity-50 block mb-1">Coût Total</span>
                  <div className="text-lg font-medium">{formatCurrency(results.totalCost)}</div>
                </div>
              </div>
            </div>
          </section>

          {/* Main Content Area */}
          <main className="lg:col-span-8 space-y-6">
            
            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-black/5 rounded-full w-fit">
              <TabButton 
                active={activeTab === "summary"} 
                onClick={() => setActiveTab("summary")}
                icon={<PieChart className="w-4 h-4" />}
                label="Résumé & Graphiques"
              />
              <TabButton 
                active={activeTab === "table"} 
                onClick={() => setActiveTab("table")}
                icon={<TableIcon className="w-4 h-4" />}
                label="Échéancier"
              />
              {aiAnalysis && (
                <TabButton 
                  active={activeTab === "ai"} 
                  onClick={() => setActiveTab("ai")}
                  icon={<BrainCircuit className="w-4 h-4" />}
                  label="Expert AI"
                />
              )}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === "summary" && (
                <motion.div 
                  key="summary"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Distribution Pie */}
                    <div className="bg-white rounded-3xl p-6 border border-black/5 shadow-sm">
                      <h3 className="text-xs font-bold uppercase tracking-widest opacity-40 mb-6 flex items-center gap-2">
                        <PieChart className="w-3 h-3" /> Répartition du Coût
                      </h3>
                      <div className="h-64">
                         <ResponsiveContainer width="100%" height="100%">
                            <RePieChart>
                              <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {pieData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip 
                                formatter={(value: number) => formatCurrency(value)}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                              />
                              <Legend verticalAlign="bottom" />
                            </RePieChart>
                         </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Quick Insight */}
                    <div className="bg-[#f0f0f0] rounded-3xl p-8 flex flex-col justify-center">
                      <div className="text-3xl font-light tracking-tight leading-tight">
                        Pour chaque <span className="font-medium">1€</span> emprunté, vous remboursez <span className="font-medium">{((results.totalCost / inputs.amount)).toFixed(2)}€</span> au total.
                      </div>
                      <div className="mt-6 flex items-center gap-2 text-xs text-black/40 font-mono tracking-wider uppercase">
                        <Info className="w-3 h-3" /> Analyse automatique basée sur les paramètres
                      </div>
                    </div>
                  </div>

                  {/* Main Evolution Chart */}
                  <div className="bg-white rounded-3xl p-8 border border-black/5 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                       <h3 className="text-xs font-bold uppercase tracking-widest opacity-40 flex items-center gap-2">
                        <TrendingUp className="w-3 h-3" /> Évolution du Capital et des Intérêts
                      </h3>
                    </div>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                          <defs>
                            <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#141414" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#141414" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#9e9e9e" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#9e9e9e" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                          <XAxis 
                            dataKey="date" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false}
                            interval={Math.floor(chartData.length / 5)}
                          />
                          <YAxis 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false}
                            tickFormatter={(val) => `${val/1000}k`}
                          />
                          <Tooltip 
                            formatter={(val: number) => formatCurrency(val)}
                            contentStyle={{ borderRadius: '16px', border: '1px solid #f0f0f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="totalPrincipalPaid" 
                            stroke="#141414" 
                            name="Capital Remboursé"
                            fillOpacity={1} 
                            fill="url(#colorPrincipal)" 
                            strokeWidth={2}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="totalInterestPaid" 
                            stroke="#9e9e9e" 
                            name="Intérêts Cumulés"
                            fillOpacity={1} 
                            fill="url(#colorInterest)" 
                            strokeWidth={2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "table" && (
                <motion.div 
                  key="table"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden"
                >
                  <div className="overflow-x-auto max-h-[600px]">
                    <table className="w-full text-left border-collapse">
                      <thead className="sticky top-0 bg-white z-10">
                        <tr className="border-b border-black/5">
                          <th className="px-6 py-4 text-[10px] uppercase font-bold opacity-40">Mois</th>
                          <th className="px-6 py-4 text-[10px] uppercase font-bold opacity-40">Date</th>
                          <th className="px-6 py-4 text-[10px] uppercase font-bold opacity-40">Solde Restant</th>
                          <th className="px-6 py-4 text-[10px] uppercase font-bold opacity-40">Principal</th>
                          <th className="px-6 py-4 text-[10px] uppercase font-bold opacity-40">Intérêt</th>
                          <th className="px-6 py-4 text-[10px] uppercase font-bold opacity-40 text-right">Mensualité</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.amortizationSchedule.map((row) => (
                          <tr key={row.period} className="border-b border-black/[0.02] hover:bg-black/[0.01] transition-colors group">
                            <td className="px-6 py-4 font-mono text-xs opacity-40">{row.period}</td>
                            <td className="px-6 py-4 text-xs font-medium capitalize">{row.date}</td>
                            <td className="px-6 py-4 text-xs">{formatCurrency(row.remainingBalance)}</td>
                            <td className="px-6 py-4 text-xs text-green-600/80">{formatCurrency(row.principal)}</td>
                            <td className="px-6 py-4 text-xs text-red-600/60">{formatCurrency(row.interest)}</td>
                            <td className="px-6 py-4 text-xs font-bold text-right">{formatCurrency(row.payment)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {activeTab === "ai" && aiAnalysis && (
                <motion.div 
                  key="ai"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white rounded-3xl p-8 border border-black/5 shadow-sm space-y-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#141414] rounded-full flex items-center justify-center text-white">
                      <BrainCircuit className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Analyse Financière Gemini</h3>
                      <p className="text-xs opacity-50">Basée sur l'intelligence artificielle générative</p>
                    </div>
                  </div>
                  <div className="prose prose-sm max-w-none prose-headings:font-medium prose-headings:tracking-tight prose-p:leading-relaxed prose-p:text-[#141414]/80">
                    <MarkdownContent content={aiAnalysis} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </main>
        </div>
      </div>
    </div>
  );
}

function InputGroup({ label, value, onChange, icon, min, max, step }: { 
  label: string, 
  value: number, 
  onChange: (val: number) => void,
  icon: string,
  min?: number,
  max?: number,
  step?: number
}) {
  return (
    <div className="space-y-2">
      <label className="block text-[10px] uppercase font-bold tracking-widest opacity-40">{label}</label>
      <div className="relative group">
        <div className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[10px] font-bold opacity-30 group-focus-within:opacity-100 transition-opacity whitespace-nowrap">
          {icon}
        </div>
        <input 
          type="number" 
          value={value} 
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full bg-[#f9f9f9] border-none rounded-xl py-3 pl-4 pr-12 text-sm font-medium focus:ring-2 focus:ring-black transition-all outline-none"
        />
      </div>
      <input 
        type="range" 
        min={min || 0} 
        max={max || 500000} 
        step={step || 1} 
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 bg-black/5 rounded-full appearance-none cursor-pointer accent-black"
      />
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap",
        active ? "bg-white text-black shadow-sm" : "hover:bg-white/50 text-[#141414]/50"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function MarkdownContent({ content }: { content: string }) {
  // Simple markdown renderer for the example
  return (
    <div className="space-y-4">
      {content.split('\n\n').map((para, i) => {
        if (para.startsWith('#')) {
          return <h3 key={i} className="text-lg font-bold mt-6">{para.replace(/#/g, '').trim()}</h3>;
        }
        if (para.includes('* ')) {
          return (
            <ul key={i} className="list-disc pl-5 space-y-1">
              {para.split('\n').filter(line => line.includes('* ')).map((line, li) => (
                <li key={li}>{line.replace('* ', '').trim()}</li>
              ))}
            </ul>
          );
        }
        return <p key={i}>{para}</p>;
      })}
    </div>
  );
}
