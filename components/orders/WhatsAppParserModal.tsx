
import React, { useState } from 'react';
import { parseWhatsAppOrder } from '../../services/whatsappParser';
import { UserRole, OrderItem } from '../../types';
import { INITIAL_PRODUCTS } from '../../constants';

interface Props {
  onConfirm: (items: any[], notes: string, date: string, source: 'whatsapp') => void;
  onClose: () => void;
}

const WhatsAppParserModal: React.FC<Props> = ({ onConfirm, onClose }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);

  const handleParse = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const data = await parseWhatsAppOrder(text);
      setParsedData(data);
    } catch (error: any) {
      console.error('Error en Candy Sync:', error);

      // Mostrar error específico al usuario
      let errorMessage = 'No pudimos interpretar el pedido.';

      if (error.message) {
        // Si el error tiene un mensaje específico, mostrarlo
        if (error.message.includes('API Key')) {
          errorMessage = '❌ Error de Configuración\n\nFalta la API Key de Gemini.\nVerifica que esté en tu archivo .env:\nVITE_GEMINI_API_KEY=tu-key-aqui\n\nLuego reinicia el servidor (Ctrl+C y npm run dev)';
        } else if (error.message.includes('No se encontraron productos')) {
          errorMessage = '⚠️ No encontré productos\n\nIntenta ser más específico:\n"Necesito 10 quesadillas grandes y 5 pequeñas"';
        } else if (error.message.includes('quota') || error.message.includes('limit')) {
          errorMessage = '🚫 Límite de API alcanzado\n\nLa API de Gemini tiene un límite gratuito.\nIntenta de nuevo en unos minutos.';
        } else {
          errorMessage = `❌ Error: ${error.message}\n\nIntenta copiar el texto de nuevo o escríbelo de forma más clara.`;
        }
      }

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalConfirm = () => {
    // Convertir items parseados al formato que espera el sistema
    const finalItems = parsedData.items.map((item: any) => {
      const originalProduct = INITIAL_PRODUCTS.find(p => p.id === item.product_id);
      return {
        id: Math.random().toString(36).substr(2, 9),
        product_id: item.product_id,
        product_name: item.product_name || originalProduct?.name,
        quantity: item.quantity,
        unit_price: originalProduct?.prices['minorista'] || 0, // Por defecto minorista si no se conoce
        total: item.quantity * (originalProduct?.prices['minorista'] || 0)
      };
    });

    onConfirm(finalItems, parsedData.notes || '', parsedData.delivery_date, 'whatsapp');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-secondary/40 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-scaleIn my-8">
        <header className="bg-gradient-to-r from-[#25D366] to-[#128C7E] p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-3xl">💬</span>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tighter">Candy Sync</h2>
              <p className="text-white/80 text-xs font-bold uppercase tracking-widest">Importación de WhatsApp</p>
            </div>
          </div>
          <button onClick={onClose} className="text-2xl hover:rotate-90 transition-transform">×</button>
        </header>

        <div className="p-6">
          {!parsedData ? (
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Pega aquí el mensaje del cliente:</label>
              <textarea
                className="w-full h-48 p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#25D366]/20 transition-all font-medium text-gray-600 italic"
                placeholder='Ej: "Hola Candy, soy Juan. Mandame 10 quesadillas de las grandes para mañana porfa..." '
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <button
                onClick={handleParse}
                disabled={loading || !text.trim()}
                className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl transition-all flex items-center justify-center gap-2 ${loading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#25D366] text-white hover:brightness-110 active:scale-95'
                  }`}
              >
                {loading ? (
                  <>
                    <span className="animate-spin text-xl">🧁</span> Procesando con IA...
                  </>
                ) : (
                  'Analizar Pedido ✨'
                )}
              </button>
              <p className="text-[10px] text-center text-gray-400 font-medium">Nuestra IA Gemini identificará productos, cantidades y fechas automáticamente.</p>
            </div>
          ) : (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-gray-50 p-4 rounded-2xl border border-dashed border-gray-200">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Resumen Interpretado</p>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase">Cliente Detectado</p>
                      <p className="font-black text-gray-800">{parsedData.client_name || 'Desconocido'} {parsedData.client_phone && `(${parsedData.client_phone})`}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400 font-bold uppercase">Entrega</p>
                      <p className="font-black text-secondary">{parsedData.delivery_date}</p>
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <p className="text-xs text-gray-400 font-bold uppercase mb-2">Productos</p>
                    {parsedData.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center py-1">
                        <span className="text-sm font-bold text-gray-700">
                          <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded-lg mr-2">{item.quantity}</span>
                          {item.product_name}
                        </span>
                      </div>
                    ))}
                  </div>

                  {parsedData.notes && (
                    <div className="border-t pt-3 italic text-xs text-gray-500">
                      " {parsedData.notes} "
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setParsedData(null)}
                  className="flex-1 py-4 text-gray-400 font-black uppercase text-xs tracking-widest"
                >Corregir</button>
                <button
                  onClick={handleFinalConfirm}
                  className="flex-[2] bg-orange-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-orange-200 hover:brightness-110 active:scale-95 transition-all text-xs"
                >Confirmar y Guardar</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WhatsAppParserModal;
