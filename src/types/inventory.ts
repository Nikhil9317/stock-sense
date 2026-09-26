export type UserRole = 'manager' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  badgeNumber: string;
  warehouseId: string;
}

export type ProductCategory = 
  | 'Raw Materials'
  | 'Finished Goods'
  | 'Components & Spares'
  | 'Packaging Materials'
  | 'Chemicals & Consumables'
  | 'Hardware & Tools';

export type UnitOfMeasure = 'Units' | 'kg' | 'Meters' | 'Boxes' | 'Liters' | 'Sets' | 'Packs';

export interface LocationStock {
  locationId: string;
  locationName: string;
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: ProductCategory;
  unitOfMeasure: UnitOfMeasure;
  minStockLevel: number; // Reordering rule threshold
  maxStockLevel?: number;
  totalStock: number;
  stockByLocation: Record<string, number>; // locationId -> quantity
  unitPrice: number;
  description?: string;
  lastUpdated: string;
}

export interface WarehouseLocation {
  id: string;
  code: string;
  name: string;
  warehouseName: string;
  type: 'Storage' | 'Production' | 'Shipping' | 'Receiving' | 'Quality Control';
  capacityLimit: number;
  currentOccupancy: number;
}

export type OperationType = 'receipt' | 'delivery' | 'internal' | 'adjustment';
export type OperationStatus = 'draft' | 'waiting' | 'ready' | 'done' | 'canceled';

export interface OperationItem {
  productId: string;
  productName: string;
  sku: string;
  unitOfMeasure: UnitOfMeasure;
  quantity: number; // Expected or requested
  countedQuantity?: number; // Used for physical inventory adjustments
}

export interface StockOperation {
  id: string;
  code: string; // REC-001, DEL-002, INT-003, ADJ-004
  type: OperationType;
  status: OperationStatus;
  sourceLocation: string; // e.g. "Vendor: Steel Corp" or "Main Store"
  destinationLocation: string; // e.g. "Main Store" or "Customer: Metro Builders"
  partnerName?: string; // Vendor name for Receipts, Customer name for Deliveries
  items: OperationItem[];
  scheduledDate: string;
  createdAt: string;
  completedAt?: string;
  notes?: string;
  createdBy: string;
  validatedBy?: string;
}

export interface MoveLedgerEntry {
  id: string;
  timestamp: string;
  productId: string;
  productName: string;
  sku: string;
  movementType: 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT';
  quantity: number;
  unitOfMeasure: UnitOfMeasure;
  sourceLocation: string;
  destinationLocation: string;
  referenceCode: string;
  operatorName: string;
  operatorRole: UserRole;
  notes?: string;
}

export interface NotificationAlert {
  id: string;
  type: 'low_stock' | 'pending_action' | 'system';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

export interface DashboardFilterState {
  documentType: 'all' | OperationType;
  status: 'all' | OperationStatus;
  warehouse: 'all' | string;
  category: 'all' | ProductCategory;
  searchQuery: string;
}
