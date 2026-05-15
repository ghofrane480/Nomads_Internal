/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Reservations from "./components/Reservations";
import Financials from "./components/Financials";
import UserManagement from "./components/UserManagement";
import Settings from "./components/Settings";
import { User as UserType } from "./types";
import { hostels, mockReservations, mockCashFlow, initialUsers } from "./mockData";
import { 
  ChevronDown, 
  MapPin, 
  Bell, 
  TrendingUp, 
  User, 
  Lock, 
  EyeOff,
  Sun,
  Moon,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedHostelId, setSelectedHostelId] = useState(hostels[0].id);
  const [darkMode, setDarkMode] = useState(false);

  const selectedHostel = useMemo(() => 
    hostels.find(h => h.id === selectedHostelId) || hostels[0], 
  [selectedHostelId]);

  const canEdit = useMemo(() => {
    if (!currentUser) return false;
    if (currentUser.role === 'manager') return true;
    if (currentUser.role === 'admin_tunis' && selectedHostelId === '2') return true;
    if (currentUser.role === 'admin_sousse' && selectedHostelId === '1') return true;
    return false;
  }, [currentUser, selectedHostelId]);

  const handleLogin = () => {
    const user = initialUsers.find(u => u.username === loginForm.username && u.password === loginForm.password);
    if (user) {
      setCurrentUser(user);
      setLoginError('');
      // Auto-select allowed hostel if not manager
      if (user.role === 'admin_tunis') setSelectedHostelId('2');
      if (user.role === 'admin_sousse') setSelectedHostelId('1');
    } else {
      setLoginError('Identifiants incorrects');
    }
  };

  const filteredReservations = useMemo(() => 
    mockReservations.filter(r => r.hostelId === selectedHostelId), 
  [selectedHostelId]);

  const filteredCashFlow = useMemo(() => 
    mockCashFlow.filter(c => c.hostelId === selectedHostelId), 
  [selectedHostelId]);

  const stats = useMemo(() => {
    const revenue = filteredReservations.reduce((acc, r) => acc + r.amount, 0);
    const expenses = filteredCashFlow.filter(c => c.type === 'expense').reduce((acc, c) => acc + c.amount, 0);
    return {
      occupancyRate: 0, 
      totalRevenue: revenue,
      totalExpenses: expenses,
      netProfit: revenue - expenses
    };
  }, [filteredReservations, filteredCashFlow]);

  if (!currentUser) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${darkMode ? 'dark bg-[#0a0a0a]' : 'bg-stone-50'}`}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-[#111111] rounded-[32px] p-10 shadow-xl shadow-black/5 dark:shadow-black/20 border border-stone-100 dark:border-white/5 max-w-md w-full text-center space-y-8 relative overflow-hidden"
        >
          <div className="absolute top-4 right-4">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 bg-stone-100 dark:bg-stone-900 rounded-full text-stone-500 hover:scale-110 transition-all font-bold"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex justify-center">
            <div className="w-24 h-24 bg-brand-dark rounded-full flex items-center justify-center text-white overflow-hidden shadow-2xl p-0 border-4 border-white dark:border-stone-800">
              <img 
                src="https://lh3.googleusercontent.com/d/1fhSDbhLQIdXLzS1Y7pSpfPqeHwSvPRN0" 
                alt="Nomads Logo"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (e.target as HTMLImageElement).parentElement!.innerHTML = '<span class="text-3xl font-bold">N</span>';
                }}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-brand-dark dark:text-white">Bon retour !</h1>
            <p className="text-sm text-stone-500 uppercase tracking-widest font-bold text-[10px]">Connectez-vous à votre compte</p>
          </div>

          <div className="space-y-4 text-left">
            {loginError && (
              <div className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 p-3 rounded-xl flex items-center gap-2 text-xs font-bold border border-red-100 dark:border-red-900/40">
                <AlertCircle className="w-4 h-4" />
                {loginError}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-600 dark:text-stone-400 block uppercase tracking-wider">Nom d'utilisateur <span className="text-brand-primary">*</span></label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-brand-primary transition-colors">
                  <User className="w-4 h-4" />
                </div>
                <input 
                  type="text" 
                  value={loginForm.username}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="manager ou admin_tunis"
                  className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-brand-primary outline-none text-stone-900 dark:text-white transition-all shadow-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-600 dark:text-stone-400 block uppercase tracking-wider">Mot de passe <span className="text-brand-primary">*</span></label>
              <div className="relative group text-stone-900 dark:text-white transition-all shadow-sm">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-brand-primary transition-colors">
                   <Lock className="w-4 h-4" />
                </div>
                <input 
                  type="password" 
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-brand-primary outline-none transition-all shadow-sm"
                />
              </div>
            </div>
          </div>

          <button 
            onClick={handleLogin}
            className="w-full bg-brand-primary text-white rounded-xl py-4 font-bold text-sm shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            Se connecter au tableau de bord
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-[#0a0a0a]' : 'bg-stone-50'}`}>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={() => setCurrentUser(null)}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        user={currentUser}
      />
      
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-white dark:bg-[#111111] border-b border-stone-200 dark:border-white/5 flex items-center justify-between px-8 sticky top-0 z-20 transition-colors">
          <div className="flex items-center gap-4">
             <div className="p-2 bg-stone-100 dark:bg-stone-900 rounded-xl text-stone-400">
               <MapPin className="w-5 h-5" />
             </div>
             <div>
               <div className="text-[10px] font-bold tracking-widest text-stone-400 uppercase">Établissement actuel</div>
               <div className="flex items-center gap-2">
                 <select 
                   value={selectedHostelId}
                   onChange={(e) => setSelectedHostelId(e.target.value)}
                   className="font-bold text-stone-900 dark:text-white text-sm bg-transparent border-none p-0 focus:ring-0 cursor-pointer appearance-none outline-none pr-8 bg-no-repeat bg-right transition-colors"
                   style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundSize: '16px' }}
                 >
                   {hostels.map(h => (
                     <option key={h.id} value={h.id} className="dark:bg-[#111111] transition-colors">{h.name}</option>
                   ))}
                 </select>
               </div>
             </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 hover:bg-stone-50 dark:hover:bg-white/[0.03] rounded-full transition-all">
              <Bell className="w-5 h-5 text-stone-400" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-brand-primary rounded-full border-2 border-white dark:border-[#111111]"></span>
            </button>
            <div className="h-8 w-px bg-stone-200 dark:bg-white/10"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-stone-900 dark:text-white">{currentUser.name}</div>
                <div className="text-[10px] font-bold text-stone-400 uppercase">
                  {currentUser.role === 'manager' ? 'Super Manager' : 'Administrateur'}
                </div>
              </div>
              <div className="w-9 h-9 bg-brand-dark rounded-full flex items-center justify-center overflow-hidden shadow-sm border border-stone-200 dark:border-white/10">
                <img 
                  src="https://lh3.googleusercontent.com/d/1fhSDbhLQIdXLzS1Y7pSpfPqeHwSvPRN0" 
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 max-w-7xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + selectedHostelId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "dashboard" && (
                <Dashboard stats={stats} selectedHostel={selectedHostel} canEdit={canEdit} user={currentUser} />
              )}
              {activeTab === "reservations" && (
                <Reservations reservations={filteredReservations} canEdit={canEdit} />
              )}
              {activeTab === "finance" && (
                <Financials cashFlow={filteredCashFlow} canEdit={canEdit} />
              )}
              {activeTab === "users" && currentUser.role === 'manager' && (
                <UserManagement />
              )}
              {activeTab === "settings" && (
                <Settings user={currentUser} />
              )}
              {(activeTab === "clients" || activeTab === "stats") && (
                <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
                  <div className="p-6 bg-stone-100 dark:bg-stone-900 rounded-full">
                    <TrendingUp className="w-12 h-12 text-stone-300 dark:text-stone-700" />
                  </div>
                  <h3 className="text-xl font-medium text-stone-900 dark:text-white">Section en cours de développement</h3>
                  <p className="text-sm text-stone-500 max-w-md">Cette fonctionnalité sera disponible dans la prochaine version de la plateforme Nomads.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

