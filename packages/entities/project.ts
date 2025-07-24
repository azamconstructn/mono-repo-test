import { Address, Contact } from "./address";
import { Location } from "./location";
import { UtmLocation } from "./utmLocation";

export type Measurement = "US" | "Metric";
export type Status = "Draft" | "PendingApproval" | "Approved" | "Rejected";
export type Metric = "$" | "SF";

export interface ProjectValue {
  metric: Metric;
  value: number;
}

export interface Project {
  name: string;
  // nickName?: string;
  // type: string;
  // measurement: measurement;
  // referenceId?: string;
  // users?: UserRole[];
  status: Status;
  // description?: string;
  // email?: string;
  // contact?: Contact;
  // address?: Address;
  // location: location;
  // utm: utmLocation;
  coverPhoto?: string;
  // logo?: string;
  company: string;
  // snapshotCount?: number;
  // structureCount?: num/ber;
  // latestSnapshotDate?: Date;
  timeZone?: string;
  // metaDetails?: object;
  // approval_At?: Date;
  isLive?: boolean;
  // projectValue?: ProjectValue;
  createdAt: Date;
  updatedAt: Date;
}
