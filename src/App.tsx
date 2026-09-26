import React, { useState } from 'react';
import { InventoryProvider } from './context/InventoryContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { ProductsView } from './components/ProductsView';
import { OperationsView } from './components/OperationsView';
import { MoveHistoryView } from './components/MoveHistoryView';
import { WarehouseView } from './components/WarehouseView';
import { ProfileView } from './components/ProfileView';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import type { OperationType } from './types/inventory';

const MainContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [operationFilter, setOperationFilter] = useState<string>('all');
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [createModalType, setCreateModalType] = useState<OperationType | null>(null);

  const handleOpenCreateOpModal = (type: OperationType) => {
    setActiveTab('operations');
    setCreateModalType(type);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <Header 
        onOpenAuth={() => setShowAuthModal(true)} 
        setActiveTab={setActiveTab} 
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Sidebar */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          operationFilter={operationFilter}
          setOperationFilter={setOperationFilter}
        />

        {/* Main View Workspace */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <DashboardView 
              setActiveTab={setActiveTab} 
              setOperationFilter={setOperationFilter}
              onOpenCreateOpModal={handleOpenCreateOpModal}
            />
          )}

          {activeTab === 'products' && <ProductsView />}

          {activeTab === 'operations' && (
            <OperationsView 
              initialType={operationFilter}
              createModalType={createModalType}
              setCreateModalType={setCreateModalType}
            />
          )}

          {activeTab === 'ledger' && <MoveHistoryView />}

          {activeTab === 'warehouses' && <WarehouseView />}

          {activeTab === 'profile' && <ProfileView />}
        </main>
      </div>

      <Footer />

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        onSuccess={() => setActiveTab('dashboard')} 
      />
    </div>
  );
};

export function App() {
  return (
    <InventoryProvider>
      <MainContent />
    </InventoryProvider>
  );
}

export default App;
