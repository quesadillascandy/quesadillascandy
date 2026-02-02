
import { GoogleGenerativeAI } from "@google/generative-ai";
import { INITIAL_PRODUCTS } from "../constants";

export async function parseWhatsAppOrder(text: string) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('API Key de Gemini no configurada. Agrega VITE_GEMINI_API_KEY en tu archivo .env');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-exp-1206" });

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
      "client_name": "nombre del cliente o null",
      "client_phone": "teléfono o null",
      "items": [ { "product_id": "id del producto", "product_name": "nombre", "quantity": número } ],
      "delivery_date": "YYYY-MM-DD",
      "notes": "notas adicionales o vacío"
    }
    
    MENSAJE DE WHATSAPP:
    "${text}"

    Responde ÚNICAMENTE con el JSON, sin texto adicional.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    console.log('Respuesta de Gemini:', responseText);

    // Limpiar respuesta por si viene con markdown
    const cleanText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const parsed = JSON.parse(cleanText);

    // Validar que tenga items
    if (!parsed.items || parsed.items.length === 0) {
      throw new Error('No se encontraron productos en el mensaje');
    }

    return parsed;
  } catch (error: any) {
    console.error("WhatsApp Parsing failed", error);
    console.error("Error details:", error.message);
    throw new Error('No pudimos interpretar el pedido. Intenta copiar el texto de nuevo.');
  }
}
