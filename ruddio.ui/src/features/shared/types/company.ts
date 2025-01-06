import { IUserProfile } from "./auth-user";

export interface ICompany {
  id: string;
  name: string;
  description: string;
  image: string;
  members?: IUserProfile[];
  rolesToSpecialists?: IUserRoleToCompany[];
}

export interface IUserRoleToCompany {
  companyId: string;
  userId: string;
  roleId: string;
}
