import React, { useState } from "react";
import { Key, Save, Lock, AlertCircle } from "lucide-react";
import { User } from "../types";

interface SettingsProps {
  user: User;
}

export default function Settings({ user }: SettingsProps) {
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [success, setSuccess] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      alert("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    setPasswords({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-white transition-colors">Paramètres du compte</h2>
        <p className="text-sm text-stone-500">Gérez votre sécurité et vos identifiants de connexion</p>
      </div>

      <div className="bg-white dark:bg-[#111111] rounded-[32px] p-8 border border-stone-200 dark:border-white/5 shadow-sm space-y-8">
        <div className="flex items-center gap-4 pb-8 border-b border-stone-100 dark:border-white/5">
          <div className="w-16 h-16 bg-brand-dark rounded-2xl flex items-center justify-center text-white text-xl font-bold">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="text-lg font-bold text-stone-900 dark:text-white">{user.name}</div>
            <div className="text-xs text-stone-400 font-bold uppercase tracking-wider">{user.role.replace('_', ' ')}</div>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-6">
          <h3 className="text-sm font-bold flex items-center gap-2 text-stone-900 dark:text-white">
            <Lock className="w-4 h-4 text-brand-primary" />
            Changer le mot de passe
          </h3>

          {success && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-xl text-xs font-bold border border-green-100 dark:border-green-900/30 flex items-center gap-2">
              <Save className="w-4 h-4" />
              Mot de passe mis à jour avec succès !
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">Mot de passe actuel</label>
              <input 
                type="password" 
                required
                value={passwords.current}
                onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-brand-primary dark:text-white transition-all shadow-sm"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">Nouveau mot de passe</label>
                <input 
                  type="password" 
                  required
                  value={passwords.new}
                   onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                  className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-brand-primary dark:text-white transition-all shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">Confirmer nouveau</label>
                <input 
                  type="password" 
                  required
                  value={passwords.confirm}
                  onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                  className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-brand-primary dark:text-white transition-all shadow-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              type="submit"
              className="bg-brand-primary text-white px-8 py-3 rounded-xl text-xs font-bold shadow-lg shadow-brand-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Mettre à jour le mot de passe
            </button>
          </div>
        </form>
      </div>

      <div className="flex items-start gap-4 p-6 bg-stone-100 dark:bg-stone-900/50 rounded-2xl border border-stone-200 dark:border-stone-800">
        <AlertCircle className="w-5 h-5 text-stone-400 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs font-bold text-stone-900 dark:text-white">Sécurité du compte</p>
          <p className="text-[10px] text-stone-500 leading-relaxed">
            Pour des raisons de sécurité, nous vous recommandons de choisir un mot de passe robuste combinant des lettres, des chiffres et des caractères spéciaux. Vos identifiants sont strictement personnels.
          </p>
        </div>
      </div>
    </div>
  );
}
