// components/StatusBadge.tsx
import { cn } from "@/lib/utils";
import { ContainerStatus } from "@/lib/types";

// 映射表：左边是数据库存的英文，右边是显示的中文
const statusMap: Record<ContainerStatus, string> = {
  'On Board': '已装船',
  'Arrived': '已到港',
  'Customs Clearance': '清关中',
  'Released': '已放行',
  'Closed': '已结案',
  'Hold': '查验/扣留',
};

const statusStyles: Record<ContainerStatus, string> = {
  'On Board': 'bg-blue-100 text-blue-700 border-blue-200',
  'Arrived': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Customs Clearance': 'bg-purple-100 text-purple-700 border-purple-200',
  'Released': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Closed': 'bg-gray-100 text-gray-600 border-gray-200',
  'Hold': 'bg-red-100 text-red-700 border-red-200',
};

export default function StatusBadge({ status }: { status: ContainerStatus }) {
  return (
    <span className={cn(
      "px-2.5 py-0.5 rounded-full text-xs font-bold border shadow-sm",
      statusStyles[status] || 'bg-gray-100 text-gray-800'
    )}>
      {statusMap[status] || status}
    </span>
  );
}