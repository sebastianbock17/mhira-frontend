import { Role } from './role';
import { Permission } from './permission';
import { Department } from './department';

export interface User {
  id?: number;
  workId?: string;
  firstName: string;
  username: string;
  middleName?: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  gender: string;
  birthDate: string;
  active?: boolean;
  roles?: Role[];
  departments?: Department[];
  permissions?: Permission[];
}