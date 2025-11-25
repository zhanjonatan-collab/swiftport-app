export type ContainerStatus = 'On Board' | 'Arrived' | 'Customs Clearance' | 'Released' | 'Closed' | 'Hold';

export interface Container {
  id: string;
  container_no: string;
  consignee: string;
  status: ContainerStatus;
  lfd: string; // ISO 日期字符串
}