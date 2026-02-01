
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const mockData = [
  { name: 'Lun', ventas: 4000, pedidos: 24 },
  { name: 'Mar', ventas: 3000, pedidos: 18 },
  { name: 'Mie', ventas: 5000, pedidos: 28 },
  { name: 'Jue', ventas: 4500, pedidos: 25 },
  { name: 'Vie', ventas: 6000, pedidos: 35 },
  { name: 'Sab', ventas: 8000, pedidos: 42 },
  { name: 'Dom', ventas: 7000, pedidos: 38 },
];

const StatCard = ({ title, value, icon, trend, trendType }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>
      <div className="p-3 bg-gray-50 rounded-lg text-xl">{icon}</div>
    </div>
    <div className="mt-4 flex items-center gap-1">
      <span className={`text-xs font-bold ${trendType === 'up' ? 'text-success' : 'text-error'}`}>
        {trend}
      </span>
      <span className="text-xs text-gray-400">vs mes pasado</span>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Panel de Control</h2>
          <p className="text-gray-500">Resumen operativo de la panadería</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border flex items-center gap-2">
          <span className="w-3 h-3 bg-success rounded-full animate-pulse"></span>
          <span className="text-sm font-medium">Realtime activo</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Ventas Hoy" value="$12,450" icon="💰" trend="+12%" trendType="up" />
        <StatCard title="Pedidos" value="28" icon="📦" trend="+5%" trendType="up" />
        <StatCard title="Producción Quesadillas" value="840" icon="🥐" trend="-2%" trendType="down" />
        <StatCard title="Insumos Críticos" value="3" icon="⚠️" trend="Alert" trendType="down" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Tendencia de Ventas (Semanal)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData}>
                <defs>
                  <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E40AF" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#1E40AF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <Tooltip />
                <Area type="monotone" dataKey="ventas" stroke="#1E40AF" strokeWidth={3} fillOpacity={1} fill="url(#colorVentas)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Volumen de Pedidos por Día</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="pedidos" fill="#EA580C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold">Insumos con Stock Bajo</h3>
          <button className="text-primary text-sm font-semibold hover:underline">Gestionar Compras</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-gray-400 text-sm font-medium">
                <th className="pb-3 px-2">Insumo</th>
                <th className="pb-3 px-2">Stock Actual</th>
                <th className="pb-3 px-2">Min. Requerido</th>
                <th className="pb-3 px-2">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="py-4 px-2 font-medium">Harina Especial</td>
                <td className="py-4 px-2">120 kg</td>
                <td className="py-4 px-2">200 kg</td>
                <td className="py-4 px-2">
                  <span className="bg-error/10 text-error px-2 py-1 rounded-full text-xs font-bold uppercase">Crítico</span>
                </td>
              </tr>
              <tr>
                <td className="py-4 px-2 font-medium">Azúcar Blanca</td>
                <td className="py-4 px-2">45 kg</td>
                <td className="py-4 px-2">50 kg</td>
                <td className="py-4 px-2">
                  <span className="bg-warning/10 text-warning px-2 py-1 rounded-full text-xs font-bold uppercase">Bajo</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
