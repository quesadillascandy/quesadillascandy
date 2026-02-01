
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Purchases from './components/Purchases';
import DatabaseSchema from './components/DatabaseSchema';
import UserManagement from './components/UserManagement';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { LoginForm, RegisterForm } from './components/auth/AuthComponents';
import { usePermissions } from './hooks/usePermissions';
import { useOrders } from './hooks/useOrders';
import { useInventory } from './hooks/useInventory';
import OrderList from './components/orders/OrderList';
import OrderForm from './components/orders/OrderForm';
import OrderDetail from './components/orders/OrderDetail';
import OrdersDashboard from './components/orders/OrdersDashboard';
import InventoryList from './components/inventory/InventoryList';
import InventoryDashboard from './components/inventory/InventoryDashboard';
import MovementForm from './components/inventory/MovementForm';
import AlertsWidget from './components/inventory/AlertsWidget';
import WhatsAppParserModal from './components/orders/WhatsAppParserModal';
import ChatbotConfig from './components/ChatbotConfig';
import RecipeList from './components/recipes/RecipeList';
import RecipeDetail from './components/recipes/RecipeDetail';
import ProductionSimulator from './components/recipes/ProductionSimulator';
import NeedsCalculator from './components/recipes/NeedsCalculator';

const MainApp: React.FC = () => {
  const { profile, login, register, logout, loading: authLoading } = useAuth();
  const { can } = usePermissions();
  const { createOrder, updateStatus } = useOrders();
  const { registerMovement } = useInventory();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showRegister, setShowRegister] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showWhatsAppParser, setShowWhatsAppParser] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<any>(null);
  const [showMovementForm, setShowMovementForm] = useState<any>(null);
  
  // Recipes State
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [showSimulator, setShowSimulator] = useState<boolean>(false);

  const handleLogin = async (e: string, p: string) => {
    const success = await login(e, p);
    if (!success) {
      alert("Credenciales inválidas. Prueba con admin@pro.com / admin");
    }
  };

  const handleCreateOrder = async (items: any, notes: string, date: string, source: any = 'app') => {
    await createOrder(items, notes, date);
    setShowOrderForm(false);
    setShowWhatsAppParser(false);
    alert("¡Pedido creado exitosamente!");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EA580C]">
        <div className="text-white text-2xl font-black animate-pulse tracking-tighter">QUESADILLAS CANDY...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] hover:scale-110"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1549590143-fd585df147c9?auto=format&fit=crop&q=80&w=2000')", 
            backgroundBlendMode: 'overlay'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#EA580C]/80 via-[#F59E0B]/60 to-[#78350F]/90"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-md">
          <div className="mb-8 text-center animate-fadeIn">
            <h1 className="text-4xl font-black text-white drop-shadow-2xl uppercase tracking-tighter">
              Quesadillas <span className="text-[#FDE047]">Candy</span>
            </h1>
            <p className="text-white/80 font-medium italic mt-2 tracking-wide">La Compañía Ideal Para Cada Taza de Café</p>
          </div>

          <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-1 border border-white/20 shadow-2xl">
            {showRegister ? (
              <RegisterForm onRegister={register} />
            ) : (
              <LoginForm onLogin={handleLogin} />
            )}
          </div>

          <button 
            onClick={() => setShowRegister(!showRegister)}
            className="w-full mt-6 text-white font-black hover:text-[#FDE047] transition-all drop-shadow-md text-center bg-black/30 py-4 rounded-2xl border border-white/10 backdrop-blur-md uppercase tracking-widest text-xs"
          >
            {showRegister ? '¿Ya tienes cuenta? Ingresa' : '¿Nuevo Cliente? Regístrate aquí'}
          </button>
          
          <div className="mt-8 flex justify-center gap-6 text-white/60">
             <span className="text-xs font-bold">📞 7111-7345</span>
             <span className="text-xs font-bold">📍 Apopa, SV</span>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'orders':
        return (
          <div className="space-y-6 animate-fadeIn">
             <header className="flex justify-between items-center">
               <div>
                  <h2 className="text-3xl font-black text-gray-800 tracking-tighter uppercase">Gestión de Pedidos</h2>
                  <p className="text-gray-500 font-medium italic">Elaboración artesanal cada día</p>
               </div>
               <div className="flex gap-3">
                 {can('create_order') && (
                   <>
                    <button 
                      onClick={() => setShowWhatsAppParser(true)}
                      className="bg-[#25D366] text-white px-6 py-3 rounded-2xl font-black shadow-lg hover:scale-105 transition-all uppercase tracking-tighter text-xs flex items-center gap-2"
                    >
                      <span className="text-lg">💬</span> CANDY SYNC
                    </button>
                    <button 
                      onClick={() => setShowOrderForm(true)}
                      className="bg-[#EA580C] text-white px-6 py-3 rounded-2xl font-black shadow-lg hover:scale-105 transition-all uppercase tracking-tighter text-xs"
                    >
                      + MANUAL
                    </button>
                   </>
                 )}
               </div>
             </header>

             {can('view_financial_reports') && <OrdersDashboard />}
             
             {showWhatsAppParser && (
               <WhatsAppParserModal 
                onConfirm={handleCreateOrder} 
                onClose={() => setShowWhatsAppParser(false)} 
               />
             )}

             {showOrderForm ? (
               <OrderForm onSubmit={handleCreateOrder} onCancel={() => setShowOrderForm(false)} />
             ) : (
               <OrderList onSelect={setSelectedOrder} />
             )}

             {selectedOrder && (
               <OrderDetail 
                order={selectedOrder} 
                onClose={() => setSelectedOrder(null)} 
                onUpdateStatus={(id, status) => {
                  updateStatus(id, status);
                  setSelectedOrder(null);
                }}
               />
             )}
          </div>
        );
      case 'inventory':
        return can('manage_inventory') ? (
          <div className="space-y-6 animate-fadeIn">
             <header className="flex justify-between items-center">
               <div>
                  <h2 className="text-3xl font-black text-gray-800 tracking-tighter uppercase">Bodega Candy</h2>
                  <p className="text-gray-500 font-medium italic">Control de materia prima e insumos</p>
               </div>
             </header>
             <InventoryDashboard />
             <InventoryList 
              onSelectItem={setSelectedInventoryItem} 
              onOpenMovement={setShowMovementForm} 
             />
             {showMovementForm && (
               <MovementForm 
                item={showMovementForm} 
                onConfirm={registerMovement} 
                onClose={() => setShowMovementForm(null)} 
               />
             )}
          </div>
        ) : (
          <div className="p-12 text-center">
             <div className="text-6xl mb-4">🚫</div>
             <h3 className="text-xl font-bold text-error uppercase">Acceso Restringido</h3>
             <p className="text-gray-500 italic">No tienes permisos para ver el inventario.</p>
          </div>
        );
      case 'recipes':
        return can('view_costs') ? (
          <div className="space-y-8 animate-fadeIn">
            <header className="flex justify-between items-center">
               <div>
                  <h2 className="text-3xl font-black text-gray-800 tracking-tighter uppercase">Ingeniería de Menú</h2>
                  <p className="text-gray-500 font-medium italic">Costos precisos y estandarización de recetas</p>
               </div>
            </header>
            
            <NeedsCalculator />

            <div>
              <h3 className="text-xl font-bold text-gray-700 mb-4">Libro de Recetas</h3>
              <RecipeList onSelect={(recipe) => setSelectedRecipe(recipe)} />
            </div>

            {selectedRecipe && (
              <RecipeDetail 
                recipe={selectedRecipe} 
                onClose={() => setSelectedRecipe(null)}
                onSimulate={() => setShowSimulator(true)}
              />
            )}

            {showSimulator && selectedRecipe && (
              <ProductionSimulator 
                recipe={selectedRecipe} 
                onClose={() => setShowSimulator(false)} 
              />
            )}
          </div>
        ) : <div className="p-12 text-center text-error font-bold uppercase">Acceso Denegado</div>;
      case 'purchases':
        return can('manage_inventory') ? <Purchases /> : <div className="p-12 text-center text-error font-bold uppercase">Acceso Denegado</div>;
      case 'personnel':
        return can('manage_personnel') ? <UserManagement /> : <div className="p-12 text-center text-error font-bold uppercase">Acceso Denegado</div>;
      case 'chatbot':
        return can('admin') ? <ChatbotConfig /> : <div className="p-12 text-center text-error font-bold uppercase">Acceso Denegado</div>;
      case 'schema':
        return can('admin') ? <DatabaseSchema /> : <div className="p-12 text-center text-error font-bold uppercase">Acceso Denegado</div>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 ml-64 p-8 transition-all duration-300">
        <header className="flex justify-end mb-8 items-center gap-4 bg-white p-4 rounded-3xl shadow-sm border border-orange-50">
          <div className="text-right">
            <p className="font-black text-gray-800 leading-none tracking-tighter uppercase">{profile.full_name}</p>
            <p className="text-[10px] text-[#EA580C] font-black uppercase mt-1 tracking-[0.2em]">{profile.role.replace('_', ' ')}</p>
          </div>
          <div className="h-8 w-[1px] bg-gray-100 mx-2"></div>
          <button 
            onClick={() => logout()}
            className="bg-error/5 text-error px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-error hover:text-white transition-all shadow-sm"
          >
            Salir
          </button>
        </header>

        <div className="max-w-7xl mx-auto pb-20">
          {renderContent()}
        </div>
      </main>
      <AlertsWidget />
    </div>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <MainApp />
  </AuthProvider>
);

export default App;
