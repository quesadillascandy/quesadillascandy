
export const COLORS = {
  primary: '#D97706', // Ámbar intenso del flyer
  secondary: '#78350F', // Color café profundo
  success: '#059669',
  warning: '#F59E0B',
  error: '#DC2626',
};

export const STATUS_COLORS: Record<string, string> = {
  PENDIENTE: '#F59E0B',
  CONFIRMADO: '#D97706',
  EN_PRODUCCION: '#EA580C',
  LISTO_ENTREGA: '#10B981',
  EN_RUTA: '#6366F1',
  ENTREGADO: '#059669',
  COBRADO: '#064E3B',
  CANCELADO: '#DC2626',
};

export const MERMAID_DIAGRAM = `erDiagram
    profiles ||--o{ audit_logs : "genera"
    profiles ||--o{ orders : "crea"
    orders ||--|{ order_items : "contiene"
    products ||--o{ order_items : "incluido_en"
    products ||--|{ recipes : "definido_por"
    inventory_items ||--o{ inventory_movements : "tiene"
    inventory_items ||--o{ inventory_lots : "trazabilidad"
    inventory_items ||--o{ recipe_ingredients : "usado_en"
    recipes ||--|{ recipe_ingredients : "requiere"
    recipes ||--|{ recipe_costs : "incurre"
    
    inventory_items {
        uuid id PK
        text name
        text type
        decimal stock_current
        decimal cost_avg
    }
    recipes {
        uuid id PK
        uuid product_id FK
        text name
        int version
        decimal yield
    }`;

export const FULL_SQL_SCHEMA = `-- SISTEMA DE INVENTARIO Y RECETAS QUESADILLAS CANDY
CREATE TYPE inventory_item_type AS ENUM ('MATERIA_PRIMA', 'INSUMO');
CREATE TYPE movement_type AS ENUM ('ENTRADA', 'SALIDA', 'AJUSTE');

-- (Tablas de Inventario previas...)
CREATE TABLE inventory_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type inventory_item_type NOT NULL,
    category TEXT DEFAULT 'NO_PERECEDERO', 
    unit TEXT NOT NULL,
    stock_current DECIMAL(12,2) DEFAULT 0,
    stock_min DECIMAL(12,2) DEFAULT 0,
    stock_max DECIMAL(12,2) DEFAULT 0,
    cost_avg DECIMAL(12,2) DEFAULT 0,
    last_price DECIMAL(12,2) DEFAULT 0,
    location TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- NUEVAS TABLAS DE RECETAS --
CREATE TABLE recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id),
    name TEXT NOT NULL,
    version INT DEFAULT 1,
    yield DECIMAL(10,2) DEFAULT 1, -- Rendimiento
    prep_time_minutes INT,
    instructions TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE recipe_ingredients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id UUID REFERENCES recipes(id),
    inventory_item_id UUID REFERENCES inventory_items(id),
    quantity DECIMAL(12,4) NOT NULL,
    unit TEXT NOT NULL,
    waste_pct DECIMAL(5,2) DEFAULT 0 -- Merma
);

CREATE TABLE recipe_costs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id UUID REFERENCES recipes(id),
    concept TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    is_per_unit BOOLEAN DEFAULT TRUE
);
`;

export const INITIAL_INVENTORY: any[] = [
  { 
    id: 'inv-1', 
    name: 'Queso Duro Viejo', 
    type: 'MATERIA_PRIMA', 
    category: 'PERECEDERO',
    unit: 'kg', 
    stock_current: 45, 
    stock_min: 20, 
    stock_max: 100, 
    cost_avg: 4.50, 
    last_price: 4.50, 
    location: 'Cámara Fría 1',
    batches: [
      { id: 'b1', item_id: 'inv-1', batch_number: 'L-101', quantity_current: 20, expiry_date: '2023-11-20', cost_unit: 4.50 },
      { id: 'b2', item_id: 'inv-1', batch_number: 'L-102', quantity_current: 25, expiry_date: '2023-11-25', cost_unit: 4.50 }
    ]
  },
  { 
    id: 'inv-2', 
    name: 'Crema Especial', 
    type: 'MATERIA_PRIMA', 
    category: 'PERECEDERO',
    unit: 'litros', 
    stock_current: 30, 
    stock_min: 15, 
    stock_max: 60, 
    cost_avg: 4.20, 
    last_price: 4.20, 
    location: 'Cámara Fría 1',
    batches: []
  },
  { 
    id: 'inv-3', 
    name: 'Harina de Arroz', 
    type: 'MATERIA_PRIMA', 
    category: 'NO_PERECEDERO',
    unit: 'kg', 
    stock_current: 120, 
    stock_min: 200, 
    stock_max: 1000, 
    cost_avg: 0.85, 
    last_price: 0.90, 
    location: 'Bodega Secos',
    batches: []
  },
  { 
    id: 'inv-4', 
    name: 'Polvo de Hornear', 
    type: 'MATERIA_PRIMA', 
    category: 'NO_PERECEDERO',
    unit: 'kg', 
    stock_current: 10, 
    stock_min: 5, 
    stock_max: 20, 
    cost_avg: 2.50, 
    last_price: 2.50, 
    location: 'Bodega Secos',
    batches: []
  },
  { 
    id: 'inv-5', 
    name: 'Moldes Quesadilla G', 
    type: 'INSUMO', 
    category: 'ACTIVO',
    unit: 'unidades', 
    stock_current: 150, 
    stock_min: 100, 
    stock_max: 300, 
    cost_avg: 12.00, 
    last_price: 12.00, 
    location: 'Estantería B1',
    batches: []
  },
  { 
    id: 'inv-6', 
    name: 'Gas Propano', 
    type: 'INSUMO', 
    category: 'NO_PERECEDERO',
    unit: 'tanques', 
    stock_current: 2, 
    stock_min: 2, 
    stock_max: 6, 
    cost_avg: 125.00, 
    last_price: 125.00, 
    location: 'Patio',
    batches: []
  },
];

export const INITIAL_PRODUCTS: any[] = [
  {
    id: 'prod-1',
    name: 'Quesadilla Grande',
    recipe_id: 'rec-1',
    prices: {
      admin: 10,
      gerente_produccion: 10,
      analista_financiero: 10,
      mayorista: 10,
      minorista: 12,
      exportacion: 15
    }
  },
  {
    id: 'prod-2',
    name: 'Quesadilla Pequeña',
    recipe_id: 'rec-2',
    prices: {
      admin: 5,
      gerente_produccion: 5,
      analista_financiero: 5,
      mayorista: 5,
      minorista: 6,
      exportacion: 8
    }
  }
];

export const INITIAL_RECIPES: any[] = [
  {
    id: 'rec-1',
    product_id: 'prod-1',
    name: 'Quesadilla Grande Tradicional',
    version: 1,
    yield: 1, // Por unidad
    prep_time_minutes: 45,
    instructions: 'Mezclar queso y crema. Agregar harina tamizada...',
    is_active: true,
    last_updated: new Date().toISOString(),
    ingredients: [
      { id: 'ri-1', recipe_id: 'rec-1', inventory_item_id: 'inv-1', inventory_item_name: 'Queso Duro Viejo', quantity: 0.150, unit: 'kg', waste_pct: 2 },
      { id: 'ri-2', recipe_id: 'rec-1', inventory_item_id: 'inv-2', inventory_item_name: 'Crema Especial', quantity: 0.050, unit: 'litros', waste_pct: 1 },
      { id: 'ri-3', recipe_id: 'rec-1', inventory_item_id: 'inv-3', inventory_item_name: 'Harina de Arroz', quantity: 0.200, unit: 'kg', waste_pct: 5 },
      { id: 'ri-4', recipe_id: 'rec-1', inventory_item_id: 'inv-4', inventory_item_name: 'Polvo de Hornear', quantity: 0.005, unit: 'kg', waste_pct: 0 }
    ],
    costs: [
      { id: 'rc-1', recipe_id: 'rec-1', concept: 'Mano de Obra', amount: 0.50, is_per_unit: true },
      { id: 'rc-2', recipe_id: 'rec-1', concept: 'Gas Propano', amount: 0.30, is_per_unit: true },
      { id: 'rc-3', recipe_id: 'rec-1', concept: 'Electricidad', amount: 0.10, is_per_unit: true }
    ]
  }
];
