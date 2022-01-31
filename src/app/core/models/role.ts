import { Permission } from '@app/core/models/permission';

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
  updated?: Date;
  created?: Date;
}
