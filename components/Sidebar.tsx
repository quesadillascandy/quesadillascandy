
import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Panel Control', icon: '📊' },
    { id: 'orders', label: 'Pedidos', icon: '🛒' },
    { id: 'inventory', label: 'Inventario', icon: '📦' },
    { id: 'recipes', label: 'Recetas y Costos', icon: '🧑‍🍳' },
    { id: 'purchases', label: 'Compras / OCR', icon: '📄' },
    { id: 'personnel', label: 'Personal', icon: '👥' },
    { id: 'chatbot', label: 'WhatsApp Bot', icon: '🤖' },
    { id: 'schema', label: 'Arquitectura DB', icon: '🛠️' },
  ];

  return (
    <div className="w-64 bg-secondary text-white h-screen fixed left-0 top-0 flex flex-col shadow-xl z-30">
      <div className="p-6 border-b border-white/10 flex flex-col items-center">
        <div className="w-16 h-16 bg-white rounded-full mb-3 flex items-center justify-center text-3xl shadow-lg">
          🧁
        </div>
        <h1 className="text-xl font-black tracking-tighter text-center uppercase">
          Quesadillas <span className="text-primary italic">Candy</span>
        </h1>
      </div>
      
      <nav className="flex-1 mt-6 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full text-left px-6 py-4 flex items-center gap-3 transition-colors ${
              activeTab === item.id ? 'bg-primary text-white border-r-4 border-white font-bold' : 'hover:bg-white/10'
            }`}
          >
            <span>{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 bg-black/20 text-xs text-white/50 text-center">
        7111-7345 • Quesadillas Candy
      </div>
    </div>
  );
};

export default Sidebar;
