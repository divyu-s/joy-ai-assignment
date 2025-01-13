export enum ROLE {
  ROOT = 'Root',
  ADMIN = 'Admin',
  MANAGER = 'Manager',
  CALLER = 'Caller',
}

export const ROLE_MAPPING = {
  Root: 'ROOT',
  Admin: 'ADMIN',
  Manager: 'MANAGER',
  Caller: 'CALLER',
};

export interface Error {
  row: number;
  email: string;
  name: string;
  role: string;
  reportsTo: any;
  type: string;
}

export const APP_CONSTANT = {
  GENERAL_ERROR: 'generalError',
  ADDITIONAL_ERROR: 'additionalError',
  MULTIPLE_PARENT: 'multipleParent',
  CYCLE_ERROR: 'cycleError',
  ADDITIONAL_CYCLE_ERROR: 'additionalCycleError',
};
