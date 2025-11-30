import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { CostingResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const calculateRecipeCost = async (recipeInput: string): Promise<CostingResult> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: recipeInput,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recipeName: { type: Type.STRING },
            ingredients: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  quantity: { type: Type.STRING, description: "e.g., 500g" },
                  unitPrice: { type: Type.STRING, description: "e.g., 50 PHP / kg" },
                  cost: { type: Type.NUMBER, description: "Total cost for this ingredient in PHP" }
                }
              }
            },
            totalIngredientCost: { type: Type.NUMBER },
            laborHours: { type: Type.NUMBER, description: "Estimated preparation hours" },
            laborCost: { type: Type.NUMBER, description: "Calculated labor cost based on rate" },
            overheadCost: { type: Type.NUMBER, description: "Estimated overheads" },
            totalProductionCost: { type: Type.NUMBER },
            yieldEstimate: { type: Type.NUMBER, description: "Number of pieces produced" },
            yieldUnit: { type: Type.STRING, description: "Unit of yield, e.g., 'cookies', 'slices'" },
            costPerPiece: { type: Type.NUMBER },
            suggestedSellingPriceMarkup: { type: Type.NUMBER, description: "Price based on markup %" },
            suggestedSellingPriceMargin: { type: Type.NUMBER, description: "Price based on profit margin %" },
            markupPercentage: { type: Type.NUMBER, description: "The markup percentage used" },
            profitMarginPercentage: { type: Type.NUMBER, description: "The profit margin percentage used" },
            notes: { type: Type.STRING, description: "Brief explanation of assumptions or tips" }
          },
          required: [
            "recipeName",
            "ingredients",
            "totalIngredientCost",
            "laborCost",
            "overheadCost",
            "totalProductionCost",
            "yieldEstimate",
            "costPerPiece",
            "suggestedSellingPriceMarkup",
            "suggestedSellingPriceMargin"
          ]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(text) as CostingResult;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};