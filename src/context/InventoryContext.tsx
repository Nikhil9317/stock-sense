import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  Product,
  WarehouseLocation,
  StockOperation,
  MoveLedgerEntry,
  User,
  UserRole,
  NotificationAlert,
  DashboardFilterState,
  OperationType,
  OperationStatus,
} from '../types/inventory';

interface InventoryContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  products: Product[];
  locations: WarehouseLocation[];
  operations: StockOperation[];
  moveLedger: MoveLedgerEntry[];
  notifications: NotificationAlert[];
  filters: DashboardFilterState;
  
  // Actions
  setFilters: React.Dispatch<React.SetStateAction<DashboardFilterState>>;
  login: (email: string, role: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  sendOTP: (email: string) => Promise<string>;
  verifyOTP: (otpCode: string) => boolean;
  
  addProduct: (productData: Omit<Product, 'id' | 'lastUpdated'>) => void;
  updateProduct: (id: string, productData: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  createOperation: (opData: Omit<StockOperation, 'id' | 'createdAt' | 'code'>) => StockOperation;
  updateOperationStatus: (id: string, status: OperationStatus) => void;
  validateOperation: (id: string) => { success: boolean; message: string };
  cancelOperation: (id: string) => void;
  
  performAdjustment: (
    productId: string,
    locationId: string,
    countedQty: number,
    notes: string
  ) => void;
  
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  resetDemoData: () => void;
  exportLedgerCSV: () => void;
}

// Initial Mock Warehouses/Locations
const initialLocations: WarehouseLocation[] = [
  {
    id: 'loc-main',
    code: 'WH1-MAIN',
    name: 'Main Store / Central Depot',
    warehouseName: 'Central Logistics Facility (Warehouse 1)',
    type: 'Storage',
    capacityLimit: 10000,
    currentOccupancy: 4520,
  },
  {
    id: 'loc-prod',
    code: 'WH1-PROD',
    name: 'Production Floor',
    warehouseName: 'Central Logistics Facility (Warehouse 1)',
    type: 'Production',
    capacityLimit: 5000,
    currentOccupancy: 2150,
  },
  {
    id: 'loc-rack-a',
    code: 'WH1-RACK-A',
    name: 'Rack A - Pallet Staging',
    warehouseName: 'Central Logistics Facility (Warehouse 1)',
    type: 'Storage',
    capacityLimit: 3000,
    currentOccupancy: 1800,
  },
  {
    id: 'loc-rack-b',
    code: 'WH1-RACK-B',
    name: 'Rack B - Component Binning',
    warehouseName: 'Central Logistics Facility (Warehouse 1)',
    type: 'Storage',
    capacityLimit: 3000,
    currentOccupancy: 950,
  },
  {
    id: 'loc-wh2',
    code: 'WH2-DISP',
    name: 'Warehouse 2 - Regional Hub',
    warehouseName: 'Northern Distribution Hub (Warehouse 2)',
    type: 'Shipping',
    capacityLimit: 8000,
    currentOccupancy: 3100,
  },
];

// Initial Mock Products
const initialProducts: Product[] = [
  {
    id: 'prod-001',
    name: 'Structural Steel Rods 12mm',
    sku: 'STL-ROD-12M',
    category: 'Raw Materials',
    unitOfMeasure: 'kg',
    minStockLevel: 500,
    maxStockLevel: 5000,
    totalStock: 1450,
    stockByLocation: {
      'loc-main': 1000,
      'loc-prod': 350,
      'loc-rack-a': 100,
      'loc-rack-b': 0,
      'loc-wh2': 0,
    },
    unitPrice: 85.50,
    description: 'High-tensile Grade 500D reinforced steel rods for manufacturing.',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'prod-002',
    name: 'Ergonomic Executive Office Chairs',
    sku: 'CHR-EX-BLK',
    category: 'Finished Goods',
    unitOfMeasure: 'Units',
    minStockLevel: 25,
    maxStockLevel: 200,
    totalStock: 82,
    stockByLocation: {
      'loc-main': 50,
      'loc-prod': 0,
      'loc-rack-a': 12,
      'loc-rack-b': 0,
      'loc-wh2': 20,
    },
    unitPrice: 4200.00,
    description: 'Finished mesh-back high swivel chairs with lumbar support.',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'prod-003',
    name: 'Industrial Microcontroller STM32',
    sku: 'CMP-MCU-32',
    category: 'Components & Spares',
    unitOfMeasure: 'Units',
    minStockLevel: 100,
    maxStockLevel: 2000,
    totalStock: 85, // Low stock!
    stockByLocation: {
      'loc-main': 25,
      'loc-prod': 60,
      'loc-rack-a': 0,
      'loc-rack-b': 0,
      'loc-wh2': 0,
    },
    unitPrice: 340.00,
    description: '32-bit ARM Cortex M4 microcontroller chip for automation boards.',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'prod-004',
    name: 'Heavy Duty Corrugated Boxes 50x50',
    sku: 'PKG-BOX-50',
    category: 'Packaging Materials',
    unitOfMeasure: 'Boxes',
    minStockLevel: 200,
    maxStockLevel: 3000,
    totalStock: 1200,
    stockByLocation: {
      'loc-main': 800,
      'loc-prod': 100,
      'loc-rack-a': 0,
      'loc-rack-b': 300,
      'loc-wh2': 0,
    },
    unitPrice: 45.00,
    description: 'Triple-wall cardboard shipping boxes suitable for bulk freight.',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'prod-005',
    name: 'Hydraulic Oil Grade ISO VG 46',
    sku: 'CHM-OIL-VG46',
    category: 'Chemicals & Consumables',
    unitOfMeasure: 'Liters',
    minStockLevel: 150,
    maxStockLevel: 1000,
    totalStock: 400,
    stockByLocation: {
      'loc-main': 250,
      'loc-prod': 150,
      'loc-rack-a': 0,
      'loc-rack-b': 0,
      'loc-wh2': 0,
    },
    unitPrice: 195.00,
    description: 'Premium anti-wear hydraulic fluid for warehouse lifts and presses.',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'prod-006',
    name: 'Heavy Copper Wire Spools 2.5mm',
    sku: 'HW-CBL-CU25',
    category: 'Hardware & Tools',
    unitOfMeasure: 'Meters',
    minStockLevel: 300,
    maxStockLevel: 4000,
    totalStock: 180, // Low stock!
    stockByLocation: {
      'loc-main': 100,
      'loc-prod': 80,
      'loc-rack-a': 0,
      'loc-rack-b': 0,
      'loc-wh2': 0,
    },
    unitPrice: 62.00,
    description: 'Pure copper electrical wiring spool for industrial installations.',
    lastUpdated: new Date().toISOString(),
  },
];

// Initial Stock Operations
const initialOperations: StockOperation[] = [
  {
    id: 'op-101',
    code: 'REC-2026-001',
    type: 'receipt',
    status: 'done',
    sourceLocation: 'Vendor: Apex Steel & Metallurgy Ltd',
    destinationLocation: 'loc-main',
    partnerName: 'Apex Steel Ltd',
    items: [
      {
        productId: 'prod-001',
        productName: 'Structural Steel Rods 12mm',
        sku: 'STL-ROD-12M',
        unitOfMeasure: 'kg',
        quantity: 500,
      }
    ],
    scheduledDate: '2026-09-20',
    createdAt: '2026-09-20T09:15:00Z',
    completedAt: '2026-09-20T10:30:00Z',
    notes: 'Initial stock intake verified by Gate Inspection Officer.',
    createdBy: 'Nikhil (Inventory Manager)',
    validatedBy: 'Nikhil (Inventory Manager)',
  },
  {
    id: 'op-102',
    code: 'REC-2026-002',
    type: 'receipt',
    status: 'ready',
    sourceLocation: 'Vendor: Global Chipset Suppliers',
    destinationLocation: 'loc-main',
    partnerName: 'Global Chipset Suppliers',
    items: [
      {
        productId: 'prod-003',
        productName: 'Industrial Microcontroller STM32',
        sku: 'CMP-MCU-32',
        unitOfMeasure: 'Units',
        quantity: 500,
      }
    ],
    scheduledDate: '2026-09-26',
    createdAt: '2026-09-25T14:20:00Z',
    notes: 'Urgent restocking for microcontrollers. Shipments arrived at bay 4.',
    createdBy: 'Rajesh Kumar (Warehouse Staff)',
  },
  {
    id: 'op-103',
    code: 'DEL-2026-011',
    type: 'delivery',
    status: 'waiting',
    sourceLocation: 'loc-main',
    destinationLocation: 'Customer: Metro Infrastructures Govt Project',
    partnerName: 'Metro Infrastructures Corp',
    items: [
      {
        productId: 'prod-002',
        productName: 'Ergonomic Executive Office Chairs',
        sku: 'CHR-EX-BLK',
        unitOfMeasure: 'Units',
        quantity: 10,
      }
    ],
    scheduledDate: '2026-09-27',
    createdAt: '2026-09-26T08:00:00Z',
    notes: 'Sales Order SO-9942 - Govt Office Fitting.',
    createdBy: 'Nikhil (Inventory Manager)',
  },
  {
    id: 'op-104',
    code: 'INT-2026-004',
    type: 'internal',
    status: 'done',
    sourceLocation: 'loc-main',
    destinationLocation: 'loc-prod',
    items: [
      {
        productId: 'prod-001',
        productName: 'Structural Steel Rods 12mm',
        sku: 'STL-ROD-12M',
        unitOfMeasure: 'kg',
        quantity: 100,
      }
    ],
    scheduledDate: '2026-09-22',
    createdAt: '2026-09-22T11:00:00Z',
    completedAt: '2026-09-22T11:45:00Z',
    notes: 'Transfer to Production Floor Rack A for active assembly.',
    createdBy: 'Rajesh Kumar (Warehouse Staff)',
    validatedBy: 'Nikhil (Inventory Manager)',
  },
  {
    id: 'op-105',
    code: 'ADJ-2026-001',
    type: 'adjustment',
    status: 'done',
    sourceLocation: 'loc-main',
    destinationLocation: 'loc-main',
    items: [
      {
        productId: 'prod-001',
        productName: 'Structural Steel Rods 12mm',
        sku: 'STL-ROD-12M',
        unitOfMeasure: 'kg',
        quantity: 3,
        countedQuantity: 1447,
      }
    ],
    scheduledDate: '2026-09-24',
    createdAt: '2026-09-24T16:00:00Z',
    completedAt: '2026-09-24T16:05:00Z',
    notes: 'Stock adjustment: 3 kg damaged steel rods written off following physical audit.',
    createdBy: 'Nikhil (Inventory Manager)',
    validatedBy: 'Nikhil (Inventory Manager)',
  }
];

// Initial Move Ledger
const initialLedger: MoveLedgerEntry[] = [
  {
    id: 'led-001',
    timestamp: '2026-09-20T10:30:00Z',
    productId: 'prod-001',
    productName: 'Structural Steel Rods 12mm',
    sku: 'STL-ROD-12M',
    movementType: 'IN',
    quantity: 500,
    unitOfMeasure: 'kg',
    sourceLocation: 'Vendor: Apex Steel & Metallurgy Ltd',
    destinationLocation: 'Main Store / Central Depot',
    referenceCode: 'REC-2026-001',
    operatorName: 'Nikhil',
    operatorRole: 'manager',
    notes: 'Vendor Receipt validated successfully.',
  },
  {
    id: 'led-002',
    timestamp: '2026-09-22T11:45:00Z',
    productId: 'prod-001',
    productName: 'Structural Steel Rods 12mm',
    sku: 'STL-ROD-12M',
    movementType: 'TRANSFER',
    quantity: 100,
    unitOfMeasure: 'kg',
    sourceLocation: 'Main Store / Central Depot',
    destinationLocation: 'Production Floor',
    referenceCode: 'INT-2026-004',
    operatorName: 'Rajesh Kumar',
    operatorRole: 'staff',
    notes: 'Internal move to assembly rack.',
  },
  {
    id: 'led-003',
    timestamp: '2026-09-24T16:05:00Z',
    productId: 'prod-001',
    productName: 'Structural Steel Rods 12mm',
    sku: 'STL-ROD-12M',
    movementType: 'ADJUSTMENT',
    quantity: 3,
    unitOfMeasure: 'kg',
    sourceLocation: 'Main Store / Central Depot',
    destinationLocation: 'Main Store / Central Depot',
    referenceCode: 'ADJ-2026-001',
    operatorName: 'Nikhil',
    operatorRole: 'manager',
    notes: 'Physical count mismatch - 3 kg damaged steel written off.',
  },
];

// Initial Notifications
const initialNotifications: NotificationAlert[] = [
  {
    id: 'notif-1',
    type: 'low_stock',
    title: 'Low Stock Alert: Microcontroller STM32',
    message: 'Current total stock (85 Units) is below minimum threshold (100 Units).',
    timestamp: new Date().toISOString(),
    isRead: false,
  },
  {
    id: 'notif-2',
    type: 'low_stock',
    title: 'Low Stock Alert: Copper Wire Spools',
    message: 'Current total stock (180 Meters) is below minimum threshold (300 Meters).',
    timestamp: new Date().toISOString(),
    isRead: false,
  },
  {
    id: 'notif-3',
    type: 'pending_action',
    title: 'Pending Receipt REC-2026-002 Ready',
    message: '500 Units of STM32 Microcontrollers ready for verification & dock intake.',
    timestamp: new Date().toISOString(),
    isRead: false,
  }
];

const defaultUser: User = {
  id: 'usr-9317',
  name: 'Nikhil',
  email: 'nikhil9317@gov-ims.in',
  role: 'manager',
  department: 'Central Stock & Inventory Directorate',
  badgeNumber: 'GOV-IMS-9317',
  warehouseId: 'loc-main',
};

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(defaultUser);
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('stocksense_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [locations] = useState<WarehouseLocation[]>(initialLocations);

  const [operations, setOperations] = useState<StockOperation[]>(() => {
    const saved = localStorage.getItem('stocksense_operations');
    return saved ? JSON.parse(saved) : initialOperations;
  });

  const [moveLedger, setMoveLedger] = useState<MoveLedgerEntry[]>(() => {
    const saved = localStorage.getItem('stocksense_ledger');
    return saved ? JSON.parse(saved) : initialLedger;
  });

  const [notifications, setNotifications] = useState<NotificationAlert[]>(() => {
    const saved = localStorage.getItem('stocksense_notifs');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [filters, setFilters] = useState<DashboardFilterState>({
    documentType: 'all',
    status: 'all',
    warehouse: 'all',
    category: 'all',
    searchQuery: '',
  });

  // Sync to localstorage
  useEffect(() => {
    localStorage.setItem('stocksense_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('stocksense_operations', JSON.stringify(operations));
  }, [operations]);

  useEffect(() => {
    localStorage.setItem('stocksense_ledger', JSON.stringify(moveLedger));
  }, [moveLedger]);

  useEffect(() => {
    localStorage.setItem('stocksense_notifs', JSON.stringify(notifications));
  }, [notifications]);

  // Actions
  const login = (email: string, role: UserRole) => {
    const name = email.split('@')[0].replace('.', ' ').toUpperCase();
    setCurrentUser({
      id: `usr-${Date.now()}`,
      name: name || 'Nikhil (Manager)',
      email: email || 'nikhil9317@gov-ims.in',
      role,
      department: role === 'manager' ? 'Central Stock & Inventory Directorate' : 'Warehouse Operational Staff',
      badgeNumber: `GOV-IMS-${Math.floor(1000 + Math.random() * 9000)}`,
      warehouseId: 'loc-main',
    });
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchRole = (role: UserRole) => {
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        role,
        department: role === 'manager' ? 'Central Stock & Inventory Directorate' : 'Warehouse Operational Staff',
      });
    }
  };

  const sendOTP = async (_email: string): Promise<string> => {
    // Generate simulated OTP
    const mockOTP = '9317';
    return mockOTP;
  };

  const verifyOTP = (otpCode: string): boolean => {
    return otpCode === '9317' || otpCode === '123456';
  };

  const addProduct = (productData: Omit<Product, 'id' | 'lastUpdated'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      lastUpdated: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);

    // Add alert if added with stock < min
    if (newProduct.totalStock <= newProduct.minStockLevel) {
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          type: 'low_stock',
          title: `Low Stock Alert: ${newProduct.name}`,
          message: `Product created with stock level (${newProduct.totalStock} ${newProduct.unitOfMeasure}) below minimum limit (${newProduct.minStockLevel}).`,
          timestamp: new Date().toISOString(),
          isRead: false,
        },
        ...prev,
      ]);
    }
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              ...productData,
              lastUpdated: new Date().toISOString(),
            }
          : p
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const createOperation = (opData: Omit<StockOperation, 'id' | 'createdAt' | 'code'>): StockOperation => {
    const typePrefixes: Record<OperationType, string> = {
      receipt: 'REC',
      delivery: 'DEL',
      internal: 'INT',
      adjustment: 'ADJ',
    };
    const seq = Math.floor(100 + Math.random() * 900);
    const year = new Date().getFullYear();
    const code = `${typePrefixes[opData.type]}-${year}-${seq}`;

    const newOp: StockOperation = {
      ...opData,
      id: `op-${Date.now()}`,
      code,
      createdAt: new Date().toISOString(),
      createdBy: currentUser ? `${currentUser.name} (${currentUser.role})` : 'System Admin',
    };

    setOperations((prev) => [newOp, ...prev]);
    return newOp;
  };

  const updateOperationStatus = (id: string, status: OperationStatus) => {
    setOperations((prev) =>
      prev.map((op) => (op.id === id ? { ...op, status } : op))
    );
  };

  const validateOperation = (id: string): { success: boolean; message: string } => {
    const op = operations.find((o) => o.id === id);
    if (!op) return { success: false, message: 'Operation not found' };
    if (op.status === 'done') return { success: false, message: 'Operation is already validated and completed.' };

    // Perform validation logic depending on type
    const updatedProducts = [...products];
    const newLedgerEntries: MoveLedgerEntry[] = [];
    const now = new Date().toISOString();

    for (const item of op.items) {
      const prodIndex = updatedProducts.findIndex((p) => p.id === item.productId);
      if (prodIndex === -1) continue;

      const product = { ...updatedProducts[prodIndex] };
      const locationStocks = { ...product.stockByLocation };

      if (op.type === 'receipt') {
        // Incoming Stock -> Increase total and destination location stock
        const destId = op.destinationLocation;
        const currentLocQty = locationStocks[destId] || 0;
        locationStocks[destId] = currentLocQty + item.quantity;
        product.totalStock += item.quantity;
        product.stockByLocation = locationStocks;
        product.lastUpdated = now;

        const destLocName = locations.find((l) => l.id === destId)?.name || destId;

        newLedgerEntries.push({
          id: `led-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          timestamp: now,
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          movementType: 'IN',
          quantity: item.quantity,
          unitOfMeasure: product.unitOfMeasure,
          sourceLocation: op.sourceLocation,
          destinationLocation: destLocName,
          referenceCode: op.code,
          operatorName: currentUser?.name || 'System Operator',
          operatorRole: currentUser?.role || 'manager',
          notes: op.notes || `Received ${item.quantity} ${product.unitOfMeasure} from ${op.partnerName || op.sourceLocation}`,
        });
      } else if (op.type === 'delivery') {
        // Outgoing Stock -> Check stock availability first!
        const srcId = op.sourceLocation;
        const currentLocQty = locationStocks[srcId] || 0;

        if (currentLocQty < item.quantity && product.totalStock < item.quantity) {
          return {
            success: false,
            message: `Insufficient stock for ${product.name} (SKU: ${product.sku}). Available: ${product.totalStock} ${product.unitOfMeasure}, Requested: ${item.quantity} ${product.unitOfMeasure}.`,
          };
        }

        // Deduct from location and total
        locationStocks[srcId] = Math.max(0, currentLocQty - item.quantity);
        product.totalStock = Math.max(0, product.totalStock - item.quantity);
        product.stockByLocation = locationStocks;
        product.lastUpdated = now;

        const srcLocName = locations.find((l) => l.id === srcId)?.name || srcId;

        newLedgerEntries.push({
          id: `led-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          timestamp: now,
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          movementType: 'OUT',
          quantity: item.quantity,
          unitOfMeasure: product.unitOfMeasure,
          sourceLocation: srcLocName,
          destinationLocation: op.destinationLocation,
          referenceCode: op.code,
          operatorName: currentUser?.name || 'System Operator',
          operatorRole: currentUser?.role || 'manager',
          notes: op.notes || `Dispatched ${item.quantity} ${product.unitOfMeasure} to ${op.partnerName || op.destinationLocation}`,
        });
      } else if (op.type === 'internal') {
        // Internal Transfer -> Source decrease, Destination increase (total stock unchanged!)
        const srcId = op.sourceLocation;
        const destId = op.destinationLocation;

        const srcQty = locationStocks[srcId] || 0;
        const destQty = locationStocks[destId] || 0;

        if (srcQty < item.quantity) {
          return {
            success: false,
            message: `Insufficient location stock at source for ${product.name}. Available at location: ${srcQty}, Requested: ${item.quantity}.`,
          };
        }

        locationStocks[srcId] = srcQty - item.quantity;
        locationStocks[destId] = destQty + item.quantity;
        product.stockByLocation = locationStocks;
        product.lastUpdated = now;

        const srcName = locations.find((l) => l.id === srcId)?.name || srcId;
        const destName = locations.find((l) => l.id === destId)?.name || destId;

        newLedgerEntries.push({
          id: `led-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          timestamp: now,
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          movementType: 'TRANSFER',
          quantity: item.quantity,
          unitOfMeasure: product.unitOfMeasure,
          sourceLocation: srcName,
          destinationLocation: destName,
          referenceCode: op.code,
          operatorName: currentUser?.name || 'System Operator',
          operatorRole: currentUser?.role || 'manager',
          notes: op.notes || `Moved ${item.quantity} ${product.unitOfMeasure} from ${srcName} to ${destName}`,
        });
      }

      // Check if stock dropped below threshold
      if (product.totalStock <= product.minStockLevel) {
        setNotifications((prev) => [
          {
            id: `notif-${Date.now()}-${Math.random()}`,
            type: 'low_stock',
            title: `Low Stock Alert: ${product.name}`,
            message: `Stock level fell to ${product.totalStock} ${product.unitOfMeasure} (Min limit: ${product.minStockLevel}).`,
            timestamp: now,
            isRead: false,
          },
          ...prev,
        ]);
      }

      updatedProducts[prodIndex] = product;
    }

    // Update state
    setProducts(updatedProducts);
    setMoveLedger((prev) => [...newLedgerEntries, ...prev]);
    setOperations((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o,
              status: 'done',
              completedAt: now,
              validatedBy: currentUser ? `${currentUser.name} (${currentUser.role})` : 'System Inspector',
            }
          : o
      )
    );

    return {
      success: true,
      message: `Operation ${op.code} validated successfully! Stock levels updated.`,
    };
  };

  const cancelOperation = (id: string) => {
    setOperations((prev) =>
      prev.map((op) => (op.id === id ? { ...op, status: 'canceled' } : op))
    );
  };

  const performAdjustment = (
    productId: string,
    locationId: string,
    countedQty: number,
    notes: string
  ) => {
    const productIndex = products.findIndex((p) => p.id === productId);
    if (productIndex === -1) return;

    const product = { ...products[productIndex] };
    const locationStocks = { ...product.stockByLocation };
    const currentLocQty = locationStocks[locationId] || 0;
    const difference = countedQty - currentLocQty;

    locationStocks[locationId] = countedQty;
    product.stockByLocation = locationStocks;
    product.totalStock = Math.max(0, product.totalStock + difference);
    product.lastUpdated = new Date().toISOString();

    const locName = locations.find((l) => l.id === locationId)?.name || locationId;
    const now = new Date().toISOString();
    const adjCode = `ADJ-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    // Add operation entry
    const newOp: StockOperation = {
      id: `op-${Date.now()}`,
      code: adjCode,
      type: 'adjustment',
      status: 'done',
      sourceLocation: locName,
      destinationLocation: locName,
      items: [
        {
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          unitOfMeasure: product.unitOfMeasure,
          quantity: Math.abs(difference),
          countedQuantity: countedQty,
        },
      ],
      scheduledDate: new Date().toISOString().split('T')[0],
      createdAt: now,
      completedAt: now,
      notes: notes || `Physical stock count adjustment. (${difference >= 0 ? '+' : ''}${difference} ${product.unitOfMeasure})`,
      createdBy: currentUser ? `${currentUser.name} (${currentUser.role})` : 'System Auditor',
      validatedBy: currentUser ? `${currentUser.name} (${currentUser.role})` : 'System Auditor',
    };

    const newLedgerEntry: MoveLedgerEntry = {
      id: `led-${Date.now()}`,
      timestamp: now,
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      movementType: 'ADJUSTMENT',
      quantity: Math.abs(difference),
      unitOfMeasure: product.unitOfMeasure,
      sourceLocation: locName,
      destinationLocation: locName,
      referenceCode: adjCode,
      operatorName: currentUser?.name || 'Stock Inspector',
      operatorRole: currentUser?.role || 'manager',
      notes: `Adjustment (${difference >= 0 ? '+' : ''}${difference} ${product.unitOfMeasure}): ${notes}`,
    };

    const updatedProducts = [...products];
    updatedProducts[productIndex] = product;

    setProducts(updatedProducts);
    setOperations((prev) => [newOp, ...prev]);
    setMoveLedger((prev) => [newLedgerEntry, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const resetDemoData = () => {
    localStorage.removeItem('stocksense_products');
    localStorage.removeItem('stocksense_operations');
    localStorage.removeItem('stocksense_ledger');
    localStorage.removeItem('stocksense_notifs');
    setProducts(initialProducts);
    setOperations(initialOperations);
    setMoveLedger(initialLedger);
    setNotifications(initialNotifications);
  };

  const exportLedgerCSV = () => {
    const headers = ['Timestamp', 'Reference', 'Product Name', 'SKU', 'Type', 'Quantity', 'Unit', 'Source', 'Destination', 'Operator', 'Role', 'Notes'];
    const rows = moveLedger.map((l) => [
      l.timestamp,
      l.referenceCode,
      `"${l.productName.replace(/"/g, '""')}"`,
      l.sku,
      l.movementType,
      l.quantity,
      l.unitOfMeasure,
      `"${l.sourceLocation.replace(/"/g, '""')}"`,
      `"${l.destinationLocation.replace(/"/g, '""')}"`,
      `"${l.operatorName.replace(/"/g, '""')}"`,
      l.operatorRole,
      `"${(l.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `StockSense_Ledger_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <InventoryContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        products,
        locations,
        operations,
        moveLedger,
        notifications,
        filters,
        setFilters,
        login,
        logout,
        switchRole,
        sendOTP,
        verifyOTP,
        addProduct,
        updateProduct,
        deleteProduct,
        createOperation,
        updateOperationStatus,
        validateOperation,
        cancelOperation,
        performAdjustment,
        markNotificationAsRead,
        clearAllNotifications,
        resetDemoData,
        exportLedgerCSV,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
