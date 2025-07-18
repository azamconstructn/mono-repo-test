import { ProjectValue, Status, Measurement } from "./project";
import { Address, Contact } from "./address";
import { Location } from "./location";
import { UtmLocation } from "./utmLocation";
import { UserRole } from "./user-role";

export interface ProjectDetails {
  project: string;
  nickName?: string;
  type: string;
  measurement: Measurement;
  referenceId?: string;
  description?: string;
  email?: string;
  contact?: Contact;
  location?: Location;
  utm?: UtmLocation;
  projectValue?: ProjectValue;
  approval_At?: Date;
  users?: UserRole[];
  address?: Address;
  logo?: string;
  metaDetails?: object;
}
