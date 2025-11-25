import DashboardTable from "@/components/DashboardTable";
import { Ship } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 p-8">
      {/* 顶部的标题栏 */}
      <header className="max-w-7xl mx-auto mb-8 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded text-white">
          <Ship size={24} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Swiftport Dashboard</h1>
      </header>
      
      {/* 主要内容区域：放置我们的表格组件 */}
      <div className="max-w-7xl mx-auto">
        <DashboardTable />
      </div>
    </main>
  );
}