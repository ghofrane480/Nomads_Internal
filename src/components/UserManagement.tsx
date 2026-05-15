import React, { useState } from "react";
import { UserPlus, Shield, User as UserIcon, MoreHorizontal, Key } from "lucide-react";
import { User } from "../types";
import { initialUsers } from "../mockData";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(initialUsers);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'manager': return <span className="px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 text-[10px] font-bold border border-purple-200 dark:border-purple-900/30">Super Manager</span>;
      case 'admin_tunis': return <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold border border-blue-200 dark:border-blue-900/30">Admin Tunis</span>;
      case 'admin_sousse': return <span className="px-2 py-0.5 rounded-md bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-[10px] font-bold border border-orange-200 dark:border-orange-900/30">Admin Sousse</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-white transition-colors">Gestion des utilisateurs</h2>
          <p className="text-sm text-stone-500">Créez et gérez les comptes administrateurs de vos établissements</p>
        </div>
        <button 
          onClick={() => alert("Fonctionnalité de création en cours d'implémentation...")}
          className="bg-brand-primary text-white rounded-full px-6 py-3 text-sm font-bold shadow-lg shadow-brand-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Ajouter un administrateur
        </button>
      </div>

      <div className="bg-white dark:bg-[#111111] rounded-[32px] border border-stone-200 dark:border-white/5 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-50/50 dark:bg-stone-900/40 border-b border-stone-100 dark:border-white/5">
              <th className="px-6 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest text-left">Utilisateur</th>
              <th className="px-6 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest text-left">Rôle / Permission</th>
              <th className="px-6 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest text-left">Identifiant</th>
              <th className="px-6 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-xs">
            {users.map((u) => (
              <tr key={u.id} className="border-b border-stone-50 dark:border-white/5 hover:bg-stone-50/30 dark:hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-stone-900 dark:text-stone-200">{u.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {getRoleBadge(u.role)}
                </td>
                <td className="px-6 py-4 font-mono text-stone-500 dark:text-stone-400">
                  {u.username}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => alert(`Réinitialiser le mot de passe pour ${u.username}`)}
                      className="p-2 text-stone-400 hover:text-brand-primary transition-colors"
                      title="Changer mot de passe"
                    >
                      <Key className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="p-8 bg-brand-dark rounded-[32px] text-white space-y-4">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-brand-primary" />
          </div>
          <h3 className="text-lg font-bold">Sécurité & Permissions</h3>
          <p className="text-xs text-stone-400 leading-relaxed">
            Les administrateurs locaux ne peuvent modifier que les données de leur propre établissement. 
            Le mode "Lecture Seule" est activé automatiquement lorsqu'ils consultent l'autre établissement.
          </p>
        </div>
        <div className="p-8 bg-stone-100 dark:bg-[#151515] rounded-[32px] border border-stone-200 dark:border-white/5 space-y-4">
          <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center">
             <Key className="w-6 h-6 text-brand-primary" />
          </div>
          <h3 className="text-lg font-bold text-stone-900 dark:text-white">Audit des accès</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Toutes les modifications effectuées sont tracées avec l'identifiant de l'administrateur, 
            garantissant une transparence totale sur la gestion de vos deux auberges.
          </p>
        </div>
      </div>
    </div>
  );
}
