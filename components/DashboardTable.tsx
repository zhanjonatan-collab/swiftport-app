// components/DashboardTable.tsx
'use client';

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Container } from "@/lib/types";
import StatusBadge from "./StatusBadge";
import { AlertTriangle, AlertCircle, Trash2, FileText, MapPin } from "lucide-react";
import { differenceInDays, parseISO } from "date-fns";

export default function DashboardTable() {
  const [data, setData] = useState<Container[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContainers = async () => {
    setLoading(true);
    const { data: containers, error } = await supabase
      .from('containers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) console.error('Error fetching:', error);
    else setData(containers as Container[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchContainers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除?')) return;
    const { error } = await supabase.from('containers').delete().eq('id', id);
    if (!error) setData(data.filter(item => item.id !== id));
  };

  const getRiskLevel = (lfdStr: string, status: string) => {
    if (!lfdStr || status === 'Released' || status === 'Closed') return 0;
    const diff = differenceInDays(parseISO(lfdStr), new Date());
    if (diff < 0) return 2;
    if (diff <= 3) return 1;
    return 0;
  };

  if (loading) return <div className="p-10 text-center text-gray-500">加载中...</div>;

  return (
    <div className="bg-white shadow-md border border-gray-200 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4">柜号 / 货物</th>
              <th className="px-6 py-4">客户 / 目的港</th>
              <th className="px-6 py-4">状态</th>
              <th className="px-6 py-4">文件</th>
              <th className="px-6 py-4">LFD</th>
              <th className="px-6 py-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((item) => {
              const risk = getRiskLevel(item.lfd, item.status);
              return (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  {/* 柜号 + 货物 */}
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900 text-base">{item.container_no}</div>
                    {item.cargo_desc && (
                      <div className="text-xs text-blue-600 bg-blue-50 inline-block px-1.5 py-0.5 rounded mt-1">
                        {item.cargo_desc}
                      </div>
                    )}
                  </td>

                  {/* 客户 + 目的港 (这里修改了) */}
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{item.consignee}</div>
                    {item.destination_port && (
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <MapPin size={12} />
                        {item.destination_port}
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4"><StatusBadge status={item.status} /></td>

                  <td className="px-6 py-4">
                    {item.file_url ? (
                      <a href={item.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline text-xs">
                        <FileText size={14} /> 下载
                      </a>
                    ) : <span className="text-gray-300">-</span>}
                  </td>

                  <td className="px-6 py-4">
                    {item.lfd && (
                       <div className={`flex items-center gap-1.5 ${risk === 2 ? 'text-red-600 font-bold' : risk === 1 ? 'text-amber-600' : ''}`}>
                         {risk === 2 && <AlertCircle size={16} />}
                         {risk === 1 && <AlertTriangle size={16} />}
                         {item.lfd}
                       </div>
                    )}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(item.id)} className="text-gray-400 hover:text-red-600 p-2">
                      <Trash2 size={18} />
                    </button>
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