import { Role } from './role';

export interface User {
  id: string;
  email: string;
  emailHash?: string;
  password: string;
  lastLogin?: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  systemUser: string;
  roles: Role[];
  updated?: Date;
  created?: Date;
}
