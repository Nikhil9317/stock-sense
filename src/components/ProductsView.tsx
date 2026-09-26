import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  Package, 
  Plus, 
  Search, 
  AlertTriangle, 
  Building, 
  Edit, 
  Trash2, 
  X,
  ChevronDown
} from 'lucide-react';
import type { Product, ProductCategory, UnitOfMeasure } from '../types/inventory';

export const ProductsView: React.FC = () => {
  const { products, locations, addProduct, updateProduct, deleteProduct, currentUser } = useInventory();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [expandedStockProdId, setExpandedStockProdId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Raw Materials' as ProductCategory,
    unitOfMeasure: 'Units' as UnitOfMeasure,
    minStockLevel: 50,
    unitPrice: 100,
    initialStock: 100,
    initialLocationId: 'loc-main',
    description: '',
  });

  const categories: ProductCategory[] = [
    'Raw Materials',
    'Finished Goods',
    'Components & Spares',
    'Packaging Materials',
    'Chemicals & Consumables',
    'Hardware & Tools',
  ];

  const units: UnitOfMeasure[] = ['Units', 'kg', 'Meters', 'Boxes', 'Liters', 'Sets', 'Packs'];

  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchSku = p.sku.toLowerCase().includes(q);
      if (!matchName && !matchSku) return false;
    }
    return true;
  });

  const handleSubmitNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.sku) {
      alert('Please fill out Product Name and SKU Code.');
      return;
    }

    const initialLocStocks: Record<string, number> = {};
    locations.forEach((loc) => {
      initialLocStocks[loc.id] = loc.id === formData.initialLocationId ? formData.initialStock : 0;
    });

    addProduct({
      name: formData.name,
      sku: formData.sku.toUpperCase(),
      category: formData.category,
      unitOfMeasure: formData.unitOfMeasure,
      minStockLevel: Number(formData.minStockLevel),
      totalStock: Number(formData.initialStock),
      stockByLocation: initialLocStocks,
      unitPrice: Number(formData.unitPrice),
      description: formData.description,
    });

    setShowAddModal(false);
    setFormData({
      name: '',
      sku: '',
      category: 'Raw Materials',
      unitOfMeasure: 'Units',
      minStockLevel: 50,
      unitPrice: 100,
      initialStock: 100,
      initialLocationId: 'loc-main',
      description: '',
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    updateProduct(editingProduct.id, editingProduct);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6">
      {/* Official Government Page Title Banner */}
      <div className="bg-white p-4 rounded border border-slate-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-blue-900 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Master Stock Directory
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1 font-serif">
            Product Management & Stock Levels
          </h2>
          <p className="text-xs text-slate-600">
            Define product SKUs, reordering rule limits, and track real-time stock balances across all warehouses.
          </p>
        </div>

        {/* Add Product Button (Manager only or admin) */}
        {currentUser?.role === 'manager' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="gov-btn-primary px-4 py-2 rounded text-xs uppercase tracking-wide flex items-center space-x-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>+ Create New Product</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="gov-card p-4 rounded-md flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search SKU or Product Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded font-medium focus:bg-white focus:border-blue-900"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <label className="text-xs font-bold text-slate-700 whitespace-nowrap">
            Category Filter:
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-300 rounded px-3 py-2 font-semibold text-slate-800 focus:bg-white"
          >
            <option value="all">All Categories ({products.length} Products)</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Table */}
      <div className="gov-card rounded-md overflow-hidden">
        <div className="px-4 py-3 bg-slate-100 border-b border-slate-300 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Package className="w-4 h-4 text-blue-900" />
            <h3 className="font-bold text-slate-900 text-sm">
              Registered Products ({filteredProducts.length})
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="gov-table-header">
                <th className="py-2.5 px-4">SKU / Code</th>
                <th className="py-2.5 px-4">Product Name</th>
                <th className="py-2.5 px-4">Category</th>
                <th className="py-2.5 px-4">Unit</th>
                <th className="py-2.5 px-4">Reorder Limit</th>
                <th className="py-2.5 px-4">Total Stock</th>
                <th className="py-2.5 px-4">Location Breakdown</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs font-medium text-slate-800">
              {filteredProducts.map((product) => {
                const isLowStock = product.totalStock <= product.minStockLevel;
                const isExpanded = expandedStockProdId === product.id;

                return (
                  <React.Fragment key={product.id}>
                    <tr className={`hover:bg-slate-50 transition ${isLowStock ? 'bg-red-50/40' : ''}`}>
                      <td className="py-3 px-4 font-mono font-bold text-blue-900">
                        {product.sku}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{product.name}</div>
                        {product.description && (
                          <div className="text-[11px] text-slate-500 line-clamp-1">
                            {product.description}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-slate-100 border border-slate-300 px-2 py-0.5 rounded text-[11px] text-slate-700 font-semibold">
                          {product.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-600">
                        {product.unitOfMeasure}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        Min: {product.minStockLevel} {product.unitOfMeasure}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1.5">
                          <span className={`font-black text-sm ${isLowStock ? 'text-red-700' : 'text-slate-900'}`}>
                            {product.totalStock.toLocaleString()}
                          </span>
                          {isLowStock && (
                            <span className="gov-badge-danger text-[10px] font-extrabold px-1.5 py-0.2 rounded flex items-center space-x-1">
                              <AlertTriangle className="w-3 h-3" />
                              <span>LOW</span>
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => setExpandedStockProdId(isExpanded ? null : product.id)}
                          className="text-xs text-blue-900 font-bold hover:underline flex items-center space-x-1"
                        >
                          <Building className="w-3.5 h-3.5" />
                          <span>View Locations</span>
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => setEditingProduct(product)}
                            className="p-1 text-slate-600 hover:text-blue-900 hover:bg-slate-200 rounded"
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {currentUser?.role === 'manager' && (
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete ${product.name}?`)) {
                                  deleteProduct(product.id);
                                }
                              }}
                              className="p-1 text-slate-600 hover:text-red-600 hover:bg-slate-200 rounded"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Stock Availability Breakdown by Location Drawer */}
                    {isExpanded && (
                      <tr className="bg-slate-100/70 border-b-2 border-slate-300">
                        <td colSpan={8} className="p-4">
                          <div className="bg-white p-3 rounded border border-slate-300 shadow-inner">
                            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-2 flex items-center space-x-1">
                              <Building className="w-3.5 h-3.5 text-blue-900" />
                              <span>Stock Availability Breakdown for {product.name} ({product.sku})</span>
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                              {locations.map((loc) => {
                                const qty = product.stockByLocation[loc.id] || 0;
                                return (
                                  <div key={loc.id} className="bg-slate-50 p-2.5 rounded border border-slate-200 text-xs">
                                    <div className="font-bold text-slate-800 text-[11px] truncate">{loc.name}</div>
                                    <div className="text-[10px] text-slate-500 font-mono">{loc.code}</div>
                                    <div className="mt-1 text-sm font-black text-blue-900">
                                      {qty} <span className="text-[10px] font-semibold text-slate-600">{product.unitOfMeasure}</span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create New Product */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-md shadow-2xl max-w-lg w-full border border-slate-300 overflow-hidden">
            <div className="gov-header-bg text-white px-4 py-3 flex items-center justify-between">
              <h3 className="font-bold text-sm uppercase tracking-wide flex items-center space-x-2">
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Create New Stock Product</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitNew} className="p-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. High Tensile Steel Rods"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded font-semibold focus:border-blue-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">SKU / Item Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. STL-ROD-50"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded font-mono uppercase font-bold focus:border-blue-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full p-2 border border-slate-300 rounded font-semibold"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Unit of Measure</label>
                  <select
                    value={formData.unitOfMeasure}
                    onChange={(e) => setFormData({ ...formData, unitOfMeasure: e.target.value as any })}
                    className="w-full p-2 border border-slate-300 rounded font-semibold"
                  >
                    {units.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Min Reorder Threshold</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.minStockLevel}
                    onChange={(e) => setFormData({ ...formData, minStockLevel: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Initial Intake Quantity</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.initialStock}
                    onChange={(e) => setFormData({ ...formData, initialStock: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Initial Location</label>
                  <select
                    value={formData.initialLocationId}
                    onChange={(e) => setFormData({ ...formData, initialLocationId: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded font-semibold"
                  >
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>{loc.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Unit Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.unitPrice}
                  onChange={(e) => setFormData({ ...formData, unitPrice: Number(e.target.value) })}
                  className="w-full p-2 border border-slate-300 rounded font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description / Spec Notes</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="gov-btn-secondary px-3 py-1.5 rounded"
                >
                  Cancel
                </button>
                <button type="submit" className="gov-btn-primary px-4 py-1.5 rounded">
                  Save Product Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Product */}
      {editingProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-md shadow-2xl max-w-lg w-full border border-slate-300 overflow-hidden">
            <div className="gov-header-bg text-white px-4 py-3 flex items-center justify-between">
              <h3 className="font-bold text-sm uppercase tracking-wide flex items-center space-x-2">
                <Edit className="w-4 h-4 text-amber-400" />
                <span>Edit Product: {editingProduct.name}</span>
              </h3>
              <button onClick={() => setEditingProduct(null)} className="text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Name</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">SKU Code</label>
                  <input
                    type="text"
                    value={editingProduct.sku}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Min Reorder Threshold</label>
                  <input
                    type="number"
                    value={editingProduct.minStockLevel}
                    onChange={(e) => setEditingProduct({ ...editingProduct, minStockLevel: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Unit Price (₹)</label>
                <input
                  type="number"
                  value={editingProduct.unitPrice}
                  onChange={(e) => setEditingProduct({ ...editingProduct, unitPrice: Number(e.target.value) })}
                  className="w-full p-2 border border-slate-300 rounded font-semibold"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="gov-btn-secondary px-3 py-1.5 rounded"
                >
                  Cancel
                </button>
                <button type="submit" className="gov-btn-primary px-4 py-1.5 rounded">
                  Update Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
