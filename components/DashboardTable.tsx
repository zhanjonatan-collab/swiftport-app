// components/DashboardTable.tsx
'use client';

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient"; // 引入我们刚才创建的客户端
import { Container } from "@/lib/types";
import StatusBadge from "./StatusBadge";
import { AlertTriangle, AlertCircle } from "lucide-react";
import { differenceInDays, parseISO } from "date-fns";

export default function DashboardTable() {
  const [data, setData] = useState<Container[]>([]);
  const [loading, setLoading] = useState(true);

  // 获取数据的函数
  useEffect(() => {
    const fetchContainers = async () => {
      const { data: containers, error } = await supabase
        .from('containers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) console.error('Error fetching:', error);
      else setData(containers as Container[]);
      
      setLoading(false);
    };

    fetchContainers();
  }, []);

  // 风险计算辅助函数
  const getRiskLevel = (lfdStr: string, status: string) => {
    if (!lfdStr || status === 'Released' || status === 'Closed') return 0;
    const diff = differenceInDays(parseISO(lfdStr), new Date());
    if (diff < 0) return 2; // 过期
    if (diff <= 3) return 1; // 警告
    return 0;
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading containers...</div>;

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4">Container No.</th>
              <th className="px-6 py-4">Consignee</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">LFD</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((item) => {
              const risk = getRiskLevel(item.lfd, item.status);
              return (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{item.container_no}</td>
                  <td className="px-6 py-4">{item.consignee}</td>
                  <td className="px-6 py-4"><StatusBadge status={item.status} /></td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-2 ${risk === 2 ? 'text-red-600 font-bold' : risk === 1 ? 'text-amber-600' : ''}`}>
                      {risk === 2 && <AlertCircle className="w-4 h-4" />}
                      {item.lfd}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}