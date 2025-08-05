import { Status, Measurement } from "./project";
import { Address, Contact } from "./address";
import { Location } from "./location";
import { UtmLocation } from "./utmLocation";
import { UserRole } from "./user-role";

export type Metric = "$" | "SF";

export interface ProjectValue {
  metric: Metric;
  value: number;
}
export interface ProjectDetails {
  project: String;
  description?: string;
  contact?: { name?: string; phone?: string; email?: string };
  address?: Record<string, string>;
  email?: string;
  utm?: { easting?: number; northing?: number; zone?: string };
  coverPhoto?: string;
  logo?: string;
  // meta fields
  dashboardURL?: string;
  reportURL?: string;
  reportLocation?: string;
  projectIntend?: string;           // enum if available
  startDate?: Date;
  mlOps?: boolean;
  isPursuitProject?: boolean;
  projectValue?: { metric: string; value: number };

}
