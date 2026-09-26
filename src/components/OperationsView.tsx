import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  RefreshCw, 
  SlidersHorizontal, 
  CheckCircle2, 
  XCircle, 
  X,
  FileText,
  AlertCircle
} from 'lucide-react';
import type { OperationType, OperationStatus } from '../types/inventory';

interface OperationsViewProps {
  initialType?: string;
  createModalType?: OperationType | null;
  setCreateModalType: (type: OperationType | null) => void;
}

export const OperationsView: React.FC<OperationsViewProps> = ({
  initialType = 'all',
  createModalType,
  setCreateModalType,
}) => {
  const { 
    operations, 
    products, 
    locations, 
    createOperation, 
    validateOperation, 
    cancelOperation,
    performAdjustment,
    currentUser 
  } = useInventory();

  const [activeSubTab, setActiveSubTab] = useState<string>(initialType);

  // New Operation Modal State
  const [opType, setOpType] = useState<OperationType>('receipt');
  const [partnerName, setPartnerName] = useState('');
  const [sourceLoc, setSourceLoc] = useState('Vendor Intake');
  const [destLoc, setDestLoc] = useState('loc-main');
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  // Selected Product Items for Operation
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [itemQuantity, setItemQuantity] = useState(50);
  const [itemsList, setItemsList] = useState<Array<{ productId: string; quantity: number }>>([]);

  // Stock Adjustment Form State
  const [adjProductId, setAdjProductId] = useState(products[0]?.id || '');
  const [adjLocationId, setAdjLocationId] = useState(locations[0]?.id || '');
  const [adjCountedQty, setAdjCountedQty] = useState(100);
  const [adjReason, setAdjReason] = useState('Routine physical stock audit reconciliation');

  const filteredOps = operations.filter((op) => {
    if (activeSubTab === 'receipt') return op.type === 'receipt';
    if (activeSubTab === 'delivery') return op.type === 'delivery';
    if (activeSubTab === 'internal') return op.type === 'internal';
    if (activeSubTab === 'adjustment') return op.type === 'adjustment';
    return true;
  });

  const handleAddItem = () => {
    if (!selectedProductId || itemQuantity <= 0) return;
    const existingIndex = itemsList.findIndex((i) => i.productId === selectedProductId);
    if (existingIndex >= 0) {
      const updated = [...itemsList];
      updated[existingIndex].quantity += itemQuantity;
      setItemsList(updated);
    } else {
      setItemsList([...itemsList, { productId: selectedProductId, quantity: itemQuantity }]);
    }
  };

  const handleRemoveItem = (idx: number) => {
    setItemsList(itemsList.filter((_, i) => i !== idx));
  };

  const handleOpenCreateModal = (type: OperationType) => {
    setOpType(type);
    setItemsList([]);
    if (type === 'receipt') {
      setSourceLoc('Vendor Dock Intake');
      setDestLoc(locations[0]?.id || 'loc-main');
      setPartnerName('Apex Steel & Metallurgy Suppliers');
    } else if (type === 'delivery') {
      setSourceLoc(locations[0]?.id || 'loc-main');
      setDestLoc('Customer Dispatch Facility');
      setPartnerName('Metro Infrastructures Govt Project');
    } else if (type === 'internal') {
      setSourceLoc(locations[0]?.id || 'loc-main');
      setDestLoc(locations[1]?.id || 'loc-prod');
      setPartnerName('');
    }
    setCreateModalType(type);
  };

  const handleSubmitCreateOp = (e: React.FormEvent) => {
    e.preventDefault();
    if (itemsList.length === 0 && opType !== 'adjustment') {
      alert('Please add at least one product item to this operation.');
      return;
    }

    const compiledItems = itemsList.map((item) => {
      const prod = products.find((p) => p.id === item.productId)!;
      return {
        productId: prod.id,
        productName: prod.name,
        sku: prod.sku,
        unitOfMeasure: prod.unitOfMeasure,
        quantity: item.quantity,
      };
    });

    const newOp = createOperation({
      type: opType,
      status: 'ready',
      sourceLocation: sourceLoc,
      destinationLocation: destLoc,
      partnerName,
      items: compiledItems,
      scheduledDate,
      notes,
      createdBy: currentUser ? currentUser.name : 'Operational Officer',
    });

    setCreateModalType(null);
    alert(`Operation document ${newOp.code} created and set to READY state.`);
  };

  const handleSubmitAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjProductId || !adjLocationId) return;

    performAdjustment(adjProductId, adjLocationId, Number(adjCountedQty), adjReason);
    setCreateModalType(null);
    alert('Stock adjustment recorded successfully! Audit ledger updated.');
  };

  const getStatusBadge = (status: OperationStatus) => {
    switch (status) {
      case 'done':
        return <span className="gov-badge-success text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">Done</span>;
      case 'ready':
        return <span className="gov-badge-info text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">Ready</span>;
      case 'waiting':
        return <span className="gov-badge-warning text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">Waiting</span>;
      case 'draft':
        return <span className="bg-slate-200 text-slate-800 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase border border-slate-300">Draft</span>;
      case 'canceled':
        return <span className="gov-badge-danger text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">Canceled</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title Banner */}
      <div className="bg-white p-4 rounded border border-slate-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-blue-900 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Operational Control Center
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1 font-serif">
            Stock Operations & Workflows
          </h2>
          <p className="text-xs text-slate-600">
            Process Incoming Receipts, Customer Deliveries, Inter-location Transfers, and Physical Auditing Adjustments.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleOpenCreateModal('receipt')}
            className="gov-btn-primary px-3 py-1.5 rounded text-xs flex items-center space-x-1.5 shadow-sm"
          >
            <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-300" />
            <span>+ Create Receipt</span>
          </button>
          <button
            onClick={() => handleOpenCreateModal('delivery')}
            className="bg-sky-800 hover:bg-sky-700 text-white font-semibold px-3 py-1.5 rounded text-xs border border-sky-900 flex items-center space-x-1.5 shadow-sm"
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-sky-200" />
            <span>+ Create Delivery</span>
          </button>
          <button
            onClick={() => handleOpenCreateModal('internal')}
            className="bg-purple-900 hover:bg-purple-800 text-white font-semibold px-3 py-1.5 rounded text-xs border border-purple-950 flex items-center space-x-1.5 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5 text-purple-200" />
            <span>+ Internal Transfer</span>
          </button>
          <button
            onClick={() => handleOpenCreateModal('adjustment')}
            className="bg-amber-700 hover:bg-amber-600 text-white font-semibold px-3 py-1.5 rounded text-xs border border-amber-800 flex items-center space-x-1.5 shadow-sm"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-200" />
            <span>+ Stock Adjustment</span>
          </button>
        </div>
      </div>

      {/* Operation Tabs Navigation */}
      <div className="border-b border-slate-300 flex items-center space-x-2 bg-slate-100 p-1.5 rounded-t-md">
        <button
          onClick={() => setActiveSubTab('all')}
          className={`px-4 py-2 text-xs font-bold rounded transition ${
            activeSubTab === 'all'
              ? 'bg-blue-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          All Operations ({operations.length})
        </button>
        <button
          onClick={() => setActiveSubTab('receipt')}
          className={`px-4 py-2 text-xs font-bold rounded transition flex items-center space-x-1.5 ${
            activeSubTab === 'receipt'
              ? 'bg-blue-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-500" />
          <span>1. Receipts (Incoming)</span>
        </button>
        <button
          onClick={() => setActiveSubTab('delivery')}
          className={`px-4 py-2 text-xs font-bold rounded transition flex items-center space-x-1.5 ${
            activeSubTab === 'delivery'
              ? 'bg-blue-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <ArrowUpRight className="w-3.5 h-3.5 text-sky-500" />
          <span>2. Delivery Orders (Outgoing)</span>
        </button>
        <button
          onClick={() => setActiveSubTab('internal')}
          className={`px-4 py-2 text-xs font-bold rounded transition flex items-center space-x-1.5 ${
            activeSubTab === 'internal'
              ? 'bg-blue-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5 text-purple-500" />
          <span>3. Internal Transfers</span>
        </button>
        <button
          onClick={() => setActiveSubTab('adjustment')}
          className={`px-4 py-2 text-xs font-bold rounded transition flex items-center space-x-1.5 ${
            activeSubTab === 'adjustment'
              ? 'bg-blue-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500" />
          <span>4. Stock Adjustments</span>
        </button>
      </div>

      {/* Operations List Table */}
      <div className="gov-card rounded-b-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="gov-table-header">
                <th className="py-2.5 px-4">Document Ref</th>
                <th className="py-2.5 px-4">Operation Type</th>
                <th className="py-2.5 px-4">Partner / Supplier</th>
                <th className="py-2.5 px-4">Source → Destination</th>
                <th className="py-2.5 px-4">Line Items</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Validation Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs font-medium text-slate-800">
              {filteredOps.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 italic">
                    No active operation records for this tab category.
                  </td>
                </tr>
              ) : (
                filteredOps.map((op) => {
                  const srcName = locations.find((l) => l.id === op.sourceLocation)?.name || op.sourceLocation;
                  const destName = locations.find((l) => l.id === op.destinationLocation)?.name || op.destinationLocation;

                  return (
                    <tr key={op.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-mono font-bold text-blue-900">
                        {op.code}
                        <div className="text-[10px] text-slate-400 font-sans font-normal">
                          {new Date(op.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-3 px-4 capitalize font-semibold">
                        <span className="flex items-center space-x-1">
                          {op.type === 'receipt' && <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />}
                          {op.type === 'delivery' && <ArrowUpRight className="w-3.5 h-3.5 text-sky-600" />}
                          {op.type === 'internal' && <RefreshCw className="w-3.5 h-3.5 text-purple-600" />}
                          {op.type === 'adjustment' && <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600" />}
                          <span>{op.type}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-800 font-bold">
                        {op.partnerName || 'N/A (Internal Move)'}
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        <div className="font-semibold text-slate-900">{srcName}</div>
                        <div className="text-[11px] text-slate-500">→ {destName}</div>
                      </td>
                      <td className="py-3 px-4">
                        {op.items.map((item, idx) => (
                          <div key={idx} className="font-semibold text-slate-900">
                            {item.quantity} {item.unitOfMeasure} × {item.productName} ({item.sku})
                          </div>
                        ))}
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(op.status)}</td>
                      <td className="py-3 px-4 text-right">
                        {op.status !== 'done' && op.status !== 'canceled' ? (
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => {
                                const res = validateOperation(op.id);
                                alert(res.message);
                              }}
                              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] px-3 py-1 rounded shadow-sm transition flex items-center space-x-1"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Validate & Increase/Decrease</span>
                            </button>
                            <button
                              onClick={() => cancelOperation(op.id)}
                              className="text-red-700 hover:bg-red-50 p-1 rounded border border-red-200"
                              title="Cancel Operation"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="text-right font-mono text-[11px] text-slate-500">
                            Validated by: <span className="font-bold text-slate-700">{op.validatedBy || 'System'}</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Operation (Receipt / Delivery / Internal) */}
      {createModalType && createModalType !== 'adjustment' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-md shadow-2xl max-w-xl w-full border border-slate-300 overflow-hidden">
            <div className="gov-header-bg text-white px-4 py-3 flex items-center justify-between">
              <h3 className="font-bold text-sm uppercase tracking-wide flex items-center space-x-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>
                  Create New {opType === 'receipt' ? 'Receipt (Incoming Stock)' : opType === 'delivery' ? 'Delivery Order (Outgoing)' : 'Internal Location Transfer'}
                </span>
              </h3>
              <button onClick={() => setCreateModalType(null)} className="text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitCreateOp} className="p-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {opType === 'receipt' ? 'Vendor / Supplier Name' : opType === 'delivery' ? 'Customer / Project Name' : 'Transfer Note'}
                  </label>
                  <input
                    type="text"
                    required={opType !== 'internal'}
                    placeholder={opType === 'receipt' ? 'Apex Metallurgy Corp' : 'Metro Infra Project'}
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Scheduled Date</label>
                  <input
                    type="date"
                    required
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Source Location</label>
                  {opType === 'receipt' ? (
                    <input
                      type="text"
                      value={sourceLoc}
                      onChange={(e) => setSourceLoc(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded bg-slate-50 font-semibold"
                    />
                  ) : (
                    <select
                      value={sourceLoc}
                      onChange={(e) => setSourceLoc(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded font-semibold"
                    >
                      {locations.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name} ({loc.code})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Destination Location</label>
                  {opType === 'delivery' ? (
                    <input
                      type="text"
                      value={destLoc}
                      onChange={(e) => setDestLoc(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded bg-slate-50 font-semibold"
                    />
                  ) : (
                    <select
                      value={destLoc}
                      onChange={(e) => setDestLoc(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded font-semibold"
                    >
                      {locations.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name} ({loc.code})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Line Item Selection Area */}
              <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-2">
                <label className="block font-bold text-slate-800 uppercase tracking-wide">
                  Add Line Items to Operation Document
                </label>
                <div className="flex items-center space-x-2">
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="flex-1 p-2 border border-slate-300 rounded font-semibold"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.sku}) - Stock: {p.totalStock} {p.unitOfMeasure}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min="1"
                    value={itemQuantity}
                    onChange={(e) => setItemQuantity(Number(e.target.value))}
                    className="w-24 p-2 border border-slate-300 rounded font-semibold"
                  />

                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="gov-btn-primary px-3 py-2 rounded whitespace-nowrap font-bold"
                  >
                    + Add Item
                  </button>
                </div>

                {/* Items Added Table */}
                {itemsList.length > 0 && (
                  <div className="mt-2 border border-slate-300 rounded overflow-hidden bg-white">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-200 text-slate-800 font-bold">
                        <tr>
                          <th className="p-2">Product Name</th>
                          <th className="p-2">SKU</th>
                          <th className="p-2">Qty</th>
                          <th className="p-2 text-right">Remove</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {itemsList.map((item, idx) => {
                          const p = products.find((pr) => pr.id === item.productId)!;
                          return (
                            <tr key={idx}>
                              <td className="p-2 font-bold">{p?.name}</td>
                              <td className="p-2 font-mono">{p?.sku}</td>
                              <td className="p-2 font-bold">{item.quantity} {p?.unitOfMeasure}</td>
                              <td className="p-2 text-right">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveItem(idx)}
                                  className="text-red-600 hover:underline font-bold text-[11px]"
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Remarks / Operation Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded"
                  placeholder="Gate pass number, inspector notes, batch details..."
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setCreateModalType(null)}
                  className="gov-btn-secondary px-3 py-1.5 rounded"
                >
                  Cancel
                </button>
                <button type="submit" className="gov-btn-primary px-4 py-1.5 rounded">
                  Create Document & Ready
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Stock Adjustment (Reconcile Physical Count vs System) */}
      {createModalType === 'adjustment' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-md shadow-2xl max-w-lg w-full border border-slate-300 overflow-hidden">
            <div className="gov-header-bg text-white px-4 py-3 flex items-center justify-between">
              <h3 className="font-bold text-sm uppercase tracking-wide flex items-center space-x-2">
                <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                <span>Physical Inventory Stock Adjustment</span>
              </h3>
              <button onClick={() => setCreateModalType(null)} className="text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitAdjustment} className="p-4 space-y-3 text-xs">
              <div className="bg-amber-50 p-2.5 rounded border border-amber-300 text-amber-900 text-[11px] flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Physical adjustments directly overwrite recorded stock counts to match physical inventory audits. All adjustments are logged into the permanent Stock Ledger audit trail.
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Product *</label>
                <select
                  value={adjProductId}
                  onChange={(e) => setAdjProductId(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded font-semibold text-slate-900"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.sku}) - Recorded System Total: {p.totalStock} {p.unitOfMeasure}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Audit Location *</label>
                <select
                  value={adjLocationId}
                  onChange={(e) => setAdjLocationId(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded font-semibold text-slate-900"
                >
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} ({loc.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Actual Counted Physical Quantity *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={adjCountedQty}
                  onChange={(e) => setAdjCountedQty(Number(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded font-bold text-sm text-blue-900 focus:border-blue-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Reason for Adjustment / Audit Note *</label>
                <textarea
                  rows={2}
                  required
                  value={adjReason}
                  onChange={(e) => setAdjReason(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded"
                  placeholder="Damaged stock write-off, count mismatch, sample usage..."
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setCreateModalType(null)}
                  className="gov-btn-secondary px-3 py-1.5 rounded"
                >
                  Cancel
                </button>
                <button type="submit" className="gov-btn-primary px-4 py-1.5 rounded bg-amber-800 border-amber-900 hover:bg-amber-900">
                  Execute Adjustment & Log Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
