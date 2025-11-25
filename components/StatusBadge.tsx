// components/StatusBadge.tsx
import { cn } from "@/lib/utils";
import { ContainerStatus } from "@/lib/types"; // 这里引用你的 types 定义

// 定义每种状态对应的颜色样式
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
      "px-2.5 py-0.5 rounded-full text-xs font-medium border",
      // 如果遇到了未知的状态，默认显示灰色
      statusStyles[status] || 'bg-gray-100 text-gray-800'
    )}>
      {status}
    </span>
  );
}