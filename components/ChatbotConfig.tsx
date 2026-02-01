
import React, { useState } from 'react';

const ChatbotConfig: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [token, setToken] = useState('');
  const [phoneId, setPhoneId] = useState('');

  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-gray-800 uppercase tracking-tighter">Configuración de Chatbot</h2>
          <p className="text-gray-500 font-medium italic">Automatiza la toma de pedidos mediante la API de Meta</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border px-4">
          <span className="text-xs font-black uppercase text-gray-400">Estado:</span>
          <span className={`h-3 w-3 rounded-full ${isActive ? 'bg-success animate-pulse' : 'bg-gray-300'}`}></span>
          <span className={`text-xs font-black uppercase ${isActive ? 'text-success' : 'text-gray-400'}`}>
            {isActive ? 'Activo' : 'Desactivado'}
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna de Credenciales */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-2">
              <span className="text-2xl">🔑</span> CREDENCIALES DE META
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">WhatsApp Phone ID</label>
                <input 
                  type="text" 
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 transition-all font-mono text-sm"
                  placeholder="Ej: 1059384729384"
                  value={phoneId}
                  onChange={(e) => setPhoneId(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">System User Access Token (Permanente)</label>
                <input 
                  type="password" 
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 transition-all font-mono text-sm"
                  placeholder="EAAB..."
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                />
              </div>
              <button 
                onClick={() => setIsActive(!isActive)}
                className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl ${
                  isActive ? 'bg-gray-100 text-gray-400 hover:bg-error/10 hover:text-error' : 'bg-primary text-white hover:brightness-110 shadow-orange-200'
                }`}
              >
                {isActive ? 'Desactivar Conexión' : 'Vincular y Activar Bot'}
              </button>
            </div>
          </div>

          <div className="bg-[#25D366]/5 border border-[#25D366]/20 p-8 rounded-3xl">
            <h3 className="text-lg font-black text-[#128C7E] mb-4 flex items-center gap-2">
              <span className="text-2xl">🔗</span> WEBHOOK ENDPOINT
            </h3>
            <p className="text-sm text-[#128C7E]/70 font-medium mb-4">
              Copia esta URL y pégala en la configuración de Webhooks de tu App de Meta (Dashboard de Desarrolladores).
            </p>
            <div className="bg-white p-4 rounded-2xl border border-[#25D366]/30 flex justify-between items-center group cursor-pointer" onClick={() => alert("Copiado al portapapeles")}>
              <code className="text-xs font-mono text-[#128C7E]">https://candy-api.vercel.app/webhooks/whatsapp</code>
              <span className="text-xl group-hover:scale-125 transition-transform">📋</span>
            </div>
          </div>
        </div>

        {/* Columna de Instrucciones */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#78350F] to-black p-8 rounded-3xl text-white shadow-2xl">
            <h3 className="text-xl font-black uppercase tracking-tighter mb-6">Guía Candy Bot</h3>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <span className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">1</span>
                <p className="text-xs text-white/80 leading-relaxed font-medium">Crea una cuenta en <b>Meta for Developers</b>.</p>
              </li>
              <li className="flex gap-4">
                <span className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">2</span>
                <p className="text-xs text-white/80 leading-relaxed font-medium">Configura el producto <b>WhatsApp</b> en tu App.</p>
              </li>
              <li className="flex gap-4">
                <span className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">3</span>
                <p className="text-xs text-white/80 leading-relaxed font-medium">Agrega un <b>Webhook</b> con el evento "messages".</p>
              </li>
              <li className="flex gap-4">
                <span className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">4</span>
                <p className="text-xs text-white/80 leading-relaxed font-medium">Usa la misma clave de <b>Gemini</b> para que el bot entienda los pedidos.</p>
              </li>
            </ul>
            <div className="mt-8 pt-6 border-t border-white/10">
               <a href="https://developers.facebook.com/docs/whatsapp/cloud-api" target="_blank" className="text-[10px] font-black uppercase tracking-widest text-[#FDE047] hover:underline">Ver Documentación de Meta →</a>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-dashed border-gray-200 text-center">
            <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Canal de Soporte</p>
            <p className="text-sm font-bold text-gray-800">¿Necesitas ayuda con la API?</p>
            <p className="text-xs text-gray-500 mb-4">Contacta a tu arquitecto de software</p>
            <button className="text-primary text-xs font-black uppercase tracking-widest hover:underline">Abrir Ticket</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotConfig;
