
import React, { useState } from 'react';
import { processInvoiceWithAI } from '../services/gemini';

const Purchases: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      setImagePreview(reader.result as string);
      
      try {
        const data = await processInvoiceWithAI(base64);
        setExtractedData(data);
      } catch (error) {
        console.error("AI Processing failed", error);
        alert("Error al procesar la factura con IA.");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      <header>
        <h2 className="text-3xl font-bold text-gray-800">Compras y OCR</h2>
        <p className="text-gray-500">Carga facturas y extrae información automáticamente con Gemini AI</p>
      </header>

      <div className="bg-white p-8 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center space-y-4 hover:border-primary/50 transition-colors">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-3xl">📄</div>
        <div className="text-center">
          <p className="font-semibold text-lg">Subir Factura de Proveedor</p>
          <p className="text-sm text-gray-400">JPG, PNG o PDF (se procesará la primera página)</p>
        </div>
        <input 
          type="file" 
          id="invoice-upload" 
          className="hidden" 
          accept="image/*"
          onChange={handleFileUpload}
          disabled={loading}
        />
        <label 
          htmlFor="invoice-upload"
          className={`cursor-pointer bg-primary text-white px-6 py-2 rounded-lg font-bold shadow-lg hover:bg-primary/90 transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Procesando con IA...' : 'Seleccionar Archivo'}
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {imagePreview && (
          <div className="bg-white p-4 rounded-xl border shadow-sm">
            <h3 className="font-bold mb-4 text-gray-400 uppercase text-xs tracking-wider">Vista Previa</h3>
            <img src={imagePreview} alt="Invoice preview" className="w-full h-auto rounded-lg shadow-inner" />
          </div>
        )}

        {extractedData && (
          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg text-primary">Información Extraída</h3>
              <span className="bg-success/10 text-success px-2 py-1 rounded text-xs font-bold uppercase">Escaneado Exitoso</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400">Proveedor</p>
                <p className="font-bold">{extractedData.vendor}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Fecha</p>
                <p className="font-bold">{extractedData.date || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Total</p>
                <p className="font-bold text-2xl text-secondary">${extractedData.total.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Num. Factura</p>
                <p className="font-bold">{extractedData.invoice_number || 'S/N'}</p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-xs text-gray-400 mb-3">Ítems Identificados</p>
              <ul className="space-y-2">
                {extractedData.items?.map((item: any, idx: number) => (
                  <li key={idx} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                    <span>{item.description} ({item.quantity})</span>
                    <span className="font-mono font-bold">${item.price.toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button className="w-full bg-success text-white py-3 rounded-lg font-bold hover:brightness-110 shadow-lg">
              Confirmar y Registrar en Inventario
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Purchases;
