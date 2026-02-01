
import { GoogleGenAI, Type } from "@google/genai";

export async function processInvoiceWithAI(base64Image: string) {
  // Always use a named parameter for initialization and obtain API key directly from process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image,
          },
        },
        {
          text: "Extract information from this purchase invoice. Identify: Vendor name, Date, Invoice Number, Total Amount, and a list of items with description, quantity, and unit price. Return only JSON.",
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          vendor: { type: Type.STRING },
          date: { type: Type.STRING },
          invoice_number: { type: Type.STRING },
          total: { type: Type.NUMBER },
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                description: { type: Type.STRING },
                quantity: { type: Type.NUMBER },
                price: { type: Type.NUMBER },
              },
              required: ["description", "quantity", "price"],
            }
          }
        },
        required: ["vendor", "total", "items"],
      },
    },
  });

  // Extract text output using the .text property directly, which is a getter not a method
  const text = response.text;
  return JSON.parse(text || '{}');
}
