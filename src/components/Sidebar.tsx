import React from "react";
import { 
  BarChart3, 
  Users, 
  Bed, 
  Wallet, 
  Settings, 
  LayoutDashboard,
  LogOut,
  Moon,
  Sun
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { User } from "../types";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  user: User;
}

export default function Sidebar({ activeTab, setActiveTab, onLogout, darkMode, toggleDarkMode, user }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'reservations', label: 'Réservations', icon: Bed },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'finance', label: 'Finance', icon: Wallet },
    { id: 'stats', label: 'Statistiques', icon: BarChart3 },
  ];

  // Only managers can see the Users Management tab
  if (user.role === 'manager') {
    menuItems.push({ id: 'users', label: 'Utilisateurs', icon: Users });
  }

  // Everyone can see settings to change password
  menuItems.push({ id: 'settings', label: 'Paramètres', icon: Settings });

  return (
    <aside className="w-64 bg-white dark:bg-[#111111] border-r border-stone-200 dark:border-white/5 flex flex-col h-screen sticky top-0 group transition-colors">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-brand-dark rounded-xl flex items-center justify-center overflow-hidden border border-white/10 shadow-lg">
            <img 
              src="https://lh3.googleusercontent.com/d/1fhSDbhLQIdXLzS1Y7pSpfPqeHwSvPRN0" 
              alt="Logo"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).parentElement!.innerHTML = '<span class="text-white font-bold text-xl">N</span>';
              }}
            />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-brand-dark dark:text-white">Nomads</h1>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left",
                activeTab === item.id 
                  ? "bg-brand-primary/10 text-brand-primary dark:bg-brand-primary/20" 
                  : "text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-50 dark:hover:bg-white/[0.03]"
              )}
            >
              <item.icon className={cn("w-4 h-4 transition-colors", activeTab === item.id ? "text-brand-primary" : "text-stone-400 dark:text-stone-600")} />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-8 space-y-4">
        <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-black rounded-full border border-stone-200 dark:border-white/5 transition-colors">
           <button 
             onClick={() => darkMode && toggleDarkMode()}
             className={cn(
              "flex-1 py-1.5 rounded-full flex justify-center transition-all",
              !darkMode ? "bg-white dark:bg-[#111111] shadow-sm" : "opacity-40"
             )}
           >
             <Sun className="w-3.5 h-3.5 text-stone-600 dark:text-stone-300" />
           </button>
           <button 
             onClick={() => !darkMode && toggleDarkMode()}
             className={cn(
              "flex-1 py-1.5 rounded-full flex justify-center transition-all",
              darkMode ? "bg-white dark:bg-[#111111] shadow-sm" : "opacity-40"
             )}
           >
             <Moon className="w-3.5 h-3.5 text-stone-600 dark:text-stone-300" />
           </button>
        </div>
        
        <div className="pt-4 border-t border-stone-100 dark:border-white/5 transition-colors">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Se déconnecter
          </button>
        </div>
      </div>
    </aside>
  );
}
