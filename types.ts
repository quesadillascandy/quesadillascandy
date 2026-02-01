
export enum UserRole {
  ADMIN = 'admin',
  PROD_MANAGER = 'gerente_produccion',
  FINANCIAL_ANALYST = 'analista_financiero',
  WHOLESALE = 'mayorista',
  RETAIL = 'minorista',
  EXPORT = 'exportacion'
}

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  phone_number?: string;
  avatar_url?: string;
}

export enum CustomerType {
  WHOLESALE = 'Mayorista',
  RETAIL = 'Minorista',
  EXPORT = 'Exportación'
}

export enum OrderStatus {
  PENDIENTE = 'PENDIENTE',
  CONFIRMADO = 'CONFIRMADO',
  EN_PRODUCCION = 'EN_PRODUCCION',
  LISTO_ENTREGA = 'LISTO_ENTREGA',
  EN_RUTA = 'EN_RUTA',
  ENTREGADO = 'ENTREGADO',
  COBRADO = 'COBRADO',
  CANCELADO = 'CANCELADO'
}

export interface Product {
  id: string;
  name: string;
  recipe_id?: string; // Link to recipe
  prices: {
    [key in UserRole]?: number;
  };
}

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface Order {
  id: string;
  user_id: string;
  user_name: string;
  user_role: UserRole;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  notes?: string;
  delivery_date: string;
  created_at: string;
  updated_at: string;
  payment_method?: string;
  received_by?: string;
  source?: 'app' | 'whatsapp';
}

export enum InventoryItemType {
  RAW_MATERIAL = 'MATERIA_PRIMA',
  SUPPLY = 'INSUMO'
}

export enum MovementType {
  IN = 'ENTRADA',
  OUT = 'SALIDA',
  ADJUST = 'AJUSTE'
}

export interface InventoryBatch {
  id: string;
  item_id: string;
  batch_number: string;
  quantity_initial: number;
  quantity_current: number;
  expiry_date: string;
  cost_unit: number;
  created_at: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  type: InventoryItemType;
  category: 'PERECEDERO' | 'NO_PERECEDERO' | 'ACTIVO';
  unit: string;
  stock_current: number;
  stock_min: number;
  stock_max: number;
  cost_avg: number;
  last_price: number;
  location?: string;
  batches?: InventoryBatch[]; 
}

export interface InventoryMovement {
  id: string;
  item_id: string;
  type: MovementType;
  quantity: number;
  unit_price?: number;
  total_cost?: number;
  reason: string;
  user_id: string;
  user_name: string;
  batch_id?: string; // Link to specific batch if applicable
  created_at: string;
  stock_after: number;
}

export interface InventoryAlert {
  id: string;
  item_id: string;
  item_name: string;
  type: 'LOW_STOCK' | 'CRITICAL_STOCK' | 'EXPIRY_WARNING' | 'EXPIRED';
  message: string;
  severity: 'warning' | 'error';
  created_at: string;
  days_remaining?: number;
}

// --- RECIPES MODULE ---

export interface RecipeIngredient {
  id: string;
  recipe_id: string;
  inventory_item_id: string;
  inventory_item_name: string;
  quantity: number; // Quantity per yield
  unit: string;
  waste_pct: number; // Percentage 0-100
}

export interface RecipeCost {
  id: string;
  recipe_id: string;
  concept: string; // e.g., "Mano de Obra", "Gas"
  amount: number;
  is_per_unit: boolean; // true = per unit, false = per batch
}

export interface Recipe {
  id: string;
  product_id: string;
  name: string;
  version: number;
  yield: number; // How many units does this recipe make?
  prep_time_minutes: number;
  instructions?: string;
  ingredients: RecipeIngredient[];
  costs: RecipeCost[];
  is_active: boolean;
  last_updated: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  table_name: string;
  record_id: string;
  old_data?: any;
  new_data?: any;
  created_at: string;
}
