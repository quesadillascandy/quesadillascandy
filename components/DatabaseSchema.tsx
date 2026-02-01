
import React, { useState } from 'react';
import { FULL_SQL_SCHEMA, MERMAID_DIAGRAM } from '../constants';

const DatabaseSchema: React.FC = () => {
  const [copying, setCopying] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(FULL_SQL_SCHEMA);
    setCopying(true);
    setTimeout(() => setCopying(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Arquitectura de Base de Datos</h2>
          <p className="text-gray-500">Esquema SQL y Entidad-Relación diseñado para Supabase</p>
        </div>
        <button 
          onClick={handleCopy}
          className="bg-primary text-white px-4 py-2 rounded-lg font-medium shadow hover:bg-primary/90"
        >
          {copying ? '✅ Copiado' : '📋 Copiar SQL'}
        </button>
      </header>

      <div className="bg-white p-8 rounded-xl border shadow-sm">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span className="text-blue-500">📊</span> Diagrama ER (Lógica Mermaid)
        </h3>
        <div className="bg-gray-50 p-6 rounded-lg overflow-x-auto">
          <pre className="text-xs font-mono text-gray-600 leading-relaxed">
            {MERMAID_DIAGRAM}
          </pre>
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl shadow-2xl overflow-hidden border-4 border-gray-800">
        <div className="flex items-center gap-2 p-3 bg-gray-800 border-b border-gray-700">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="ml-2 text-xs text-gray-400 font-mono">init_schema.sql</span>
        </div>
        <div className="p-6 h-[500px] overflow-y-auto custom-scrollbar">
          <pre className="text-sm font-mono text-emerald-400 leading-relaxed">
            {FULL_SQL_SCHEMA}
          </pre>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h4 className="font-bold text-blue-800 mb-2">Escalabilidad</h4>
          <p className="text-sm text-blue-700">Diseñado para soportar +50 vendedores mediante partición lógica y RLS optimizado.</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
          <h4 className="font-bold text-orange-800 mb-2">Seguridad</h4>
          <p className="text-sm text-orange-700">RLS configurado por roles (Admin, Seller, Accounting) para protección total de datos.</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <h4 className="font-bold text-green-800 mb-2">Costeo</h4>
          <p className="text-sm text-green-700">Relación 1:N entre productos e ingredientes para cálculo automático de márgenes.</p>
        </div>
      </div>
    </div>
  );
};

export default DatabaseSchema;
