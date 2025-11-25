// lib/types.ts
export type ContainerStatus = 'On Board' | 'Arrived' | 'Customs Clearance' | 'Released' | 'Closed' | 'Hold';

export interface Container {
  id: string;
  container_no: string;
  consignee: string;
  destination_port: string; // ✨ 新增：目的港
  cargo_desc: string;
  status: ContainerStatus;
  etd: string;
  lfd: string;
  file_url?: string;
  file_name?: string;
  created_at: string;
}