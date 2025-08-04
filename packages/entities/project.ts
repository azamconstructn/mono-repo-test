export type Measurement = "US" | "Metric";
export type Status = "Draft" | "PendingApproval" | "Approved" | "Rejected";


export type ProjectType =
  | 'Residential' | 'Pipeline' | 'Road' | 'Solar' | 'Building'
  | 'Commercial' | 'Healthcare' | 'Infrastructure'
  | 'Industrial' | 'Data Center' | 'Airport';

export interface Project {
  name: string;
  nickName?: string;
  type: ProjectType;
  measurement: Measurement;
  referenceId?: string;
  status: Status;
  company: String;          // ref → Company
  location: { lat: number; lng: number };
  timeZone?: string;
  isLive?: boolean;
  createdAt: Date;
  updatedAt: Date;
  approvalAt?: Date;

}
