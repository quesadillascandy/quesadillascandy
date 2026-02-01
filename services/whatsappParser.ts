
import { GoogleGenAI, Type } from "@google/genai";
import { INITIAL_PRODUCTS } from "../constants";

export async function parseWhatsAppOrder(text: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const today = new Date().toISOString().split('T')[0];
  
  const productContext = INITIAL_PRODUCTS.map(p => `- ${p.name} (ID: ${p.id})`).join('\n');

  const prompt = `
    Eres un asistente experto para "Quesadillas Candy". Tu tarea es convertir un mensaje de WhatsApp en un pedido estructurado.
    
    FECHA DE HOY: ${today}
    CATÁLOGO DISPONIBLE:
    ${productContext}

    INSTRUCCIONES:
    1. Identifica el nombre o teléfono del cliente si aparecen.
    2. Identifica los productos y cantidades. Mapea los nombres a los IDs del catálogo.
    3. Interpreta fechas relativas como "mañana", "el lunes", "pasado mañana" y conviértelas a formato YYYY-MM-DD.
    4. Si no hay fecha, asume la fecha de mañana.
    5. Extrae notas adicionales (ej: "sin ajonjolí", "pago con tarjeta").

    RESPONDE SOLO EN JSON con este esquema:
    {
      "client_name": string,
      "client_phone": string,
      "items": [ { "product_id": string, "product_name": string, "quantity": number } ],
      "delivery_date": string,
      "notes": string
    }
    
    MENSAJE DE WHATSAPP:
    "${text}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            client_name: { type: Type.STRING },
            client_phone: { type: Type.STRING },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  product_id: { type: Type.STRING },
                  product_name: { type: Type.STRING },
                  quantity: { type: Type.NUMBER }
                },
                required: ["product_id", "quantity"]
              }
            },
            delivery_date: { type: Type.STRING },
            notes: { type: Type.STRING }
          },
          required: ["items", "delivery_date"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("WhatsApp Parsing failed", error);
    throw error;
  }
}
