// app/page.tsx
'use client';

import { useState } from "react";
import DashboardTable from "@/components/DashboardTable";
import NewContainerForm from "@/components/NewContainerForm";
import { Ship, PlusCircle } from "lucide-react";

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); 

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-8">
      {/* 顶部导航栏 */}
      <header className="max-w-7xl mx-auto mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2.5 rounded-lg text-white shadow-lg shadow-blue-600/20">
            <Ship size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Swiftport</h1>
            <p className="text-xs text-slate-500">Customs Brokerage Dashboard</p>
          </div>
        </div>
        
        {/* 新增按钮 */}
        <button 
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg hover:bg-slate-800 transition-all shadow-md active:scale-95 font-medium"
        >
          <PlusCircle size={18} />
          New Shipment
        </button>
      </header>
      
      {/* 表格区域 */}
      <div className="max-w-7xl mx-auto">
        {/* key={refreshKey} 是一个小技巧：当 refreshKey 变化时，表格会自动刷新数据 */}
        <DashboardTable key={refreshKey} />
      </div>

      {/* 弹窗组件 (只有 showForm 为 true 时才显示) */}
      {showForm && (
        <NewContainerForm 
          onClose={() => setShowForm(false)} 
          onCustomSuccess={() => setRefreshKey(prev => prev + 1)} 
        />
      )}
    </main>
  );
}