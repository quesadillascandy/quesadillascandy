
import React, { useState } from 'react';
import { UserRole } from '../../types';

export const LoginForm = ({ onLogin }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="bg-white/90 p-8 rounded-3xl shadow-2xl w-full backdrop-blur-md border border-white/50 animate-scaleIn">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3 animate-bounce">☕</div>
        <h2 className="text-2xl font-black text-gray-800 tracking-tighter uppercase">Panel Administrativo</h2>
        <div className="h-1 w-12 bg-[#EA580C] mx-auto mt-2 rounded-full"></div>
      </div>
      <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onLogin(email, password); }}>
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-[0.2em] ml-1">Email de Usuario</label>
          <input 
            type="email" 
            className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:ring-4 focus:ring-[#EA580C]/20 focus:border-[#EA580C] outline-none transition-all font-medium text-gray-700 bg-gray-50/50"
            placeholder="admin@pro.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-[0.2em] ml-1">Contraseña</label>
          <input 
            type="password" 
            className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:ring-4 focus:ring-[#EA580C]/20 focus:border-[#EA580C] outline-none transition-all font-medium text-gray-700 bg-gray-50/50"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="w-full bg-[#EA580C] text-white py-5 rounded-2xl font-black uppercase tracking-[0.1em] hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-orange-500/30 text-sm">
          Ingresar al Sistema
        </button>
      </form>
    </div>
  );
};

export const RegisterForm = ({ onRegister }: any) => {
  const [formData, setFormData] = useState({ full_name: '', email: '', password: '', role: UserRole.RETAIL });

  return (
    <div className="bg-white/90 p-8 rounded-3xl shadow-2xl w-full backdrop-blur-md border border-white/50 animate-scaleIn">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-gray-800 tracking-tighter uppercase">Registro de Clientes</h2>
        <p className="text-[10px] text-[#EA580C] font-black uppercase tracking-[0.2em] mt-1">Nuevos Mayoristas y Minoristas</p>
      </div>
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onRegister(formData); }}>
        <input 
          placeholder="Nombre Completo" 
          className="w-full px-5 py-4 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#EA580C]/20 bg-gray-50/50" 
          onChange={e => setFormData({...formData, full_name: e.target.value})}
        />
        <input 
          placeholder="Email" 
          className="w-full px-5 py-4 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#EA580C]/20 bg-gray-50/50" 
          onChange={e => setFormData({...formData, email: e.target.value})}
        />
        <input 
          type="password" 
          placeholder="Crea tu contraseña" 
          className="w-full px-5 py-4 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#EA580C]/20 bg-gray-50/50" 
          onChange={e => setFormData({...formData, password: e.target.value})}
        />
        <div className="relative">
          <select 
            className="w-full px-5 py-4 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#EA580C]/20 bg-gray-50/50 font-bold text-gray-600 appearance-none"
            onChange={e => setFormData({...formData, role: e.target.value as UserRole})}
          >
            <option value={UserRole.RETAIL}>Venta Minorista</option>
            <option value={UserRole.WHOLESALE}>Vendedor Mayorista</option>
            <option value={UserRole.EXPORT}>Exportación Especial</option>
          </select>
          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#EA580C]">▼</div>
        </div>
        <button className="w-full bg-[#EA580C] text-white py-5 rounded-2xl font-black uppercase tracking-[0.1em] hover:brightness-110 shadow-xl transition-all mt-4 text-sm">
          Confirmar Registro
        </button>
      </form>
    </div>
  );
};
