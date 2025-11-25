// lib/types.ts
export type ContainerStatus = 'On Board' | 'Arrived' | 'Customs Clearance' | 'Released' | 'Closed' | 'Hold';

export interface Container {
  id: string;
  container_no: string;
  consignee: string;
  cargo_desc: string; // 新增：货物描述
  broker: string;
  status: ContainerStatus;
  etd: string;
  eta: string;
  lfd: string;
  file_url?: string;  // 新增：文件链接
  file_name?: string; // 新增：文件名
  created_at: string;
}