export const BASE_PATH = '/api';

export const DB_NAME = 'blockchain_test';

export const IS_PROD = process.env.NODE_ENV === 'production';
export const IS_DEV = process.env.NODE_ENV === 'development';

export enum ROLES {
  ADMIN = 1,
  PRODUCER = 2,
  SECONDARY_PRODUCER = 3,
  CONSUMER = 4,
  RECYCLER = 5,
}
