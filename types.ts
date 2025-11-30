export interface Ingredient {
  name: string;
  quantity: string;
  unitPrice: string; // e.g., "150/kg"
  cost: number;
}

export interface CostingResult {
  recipeName: string;
  ingredients: Ingredient[];
  totalIngredientCost: number;
  laborHours: number;
  laborCost: number;
  overheadCost: number;
  totalProductionCost: number;
  yieldEstimate: number;
  yieldUnit: string;
  costPerPiece: number;
  suggestedSellingPriceMarkup: number;
  suggestedSellingPriceMargin: number;
  markupPercentage: number;
  profitMarginPercentage: number;
  notes: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}