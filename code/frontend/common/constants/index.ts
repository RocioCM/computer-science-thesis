export const CLIENT_BASE_ROUTE =
  typeof window !== 'undefined' ? window.location.origin : '';

export const ENVIRONMENT = process.env.NODE_ENV;
export const isDevelopment = ENVIRONMENT === 'development';
export const isProduction = ENVIRONMENT === 'production';
export const VM_ENVIRONMENT = isDevelopment
  ? 'development'
  : process.env.NEXT_PUBLIC_VM_ENV || 'unknown-environment';

/** This variable is used to determine if the code is running on the server side.
 * True when server side rendering, false when client side. */
export const isServerSide = typeof window === 'undefined';

/** This is the Frontend base path, it is used to build and deploy the application. */
export const basePath = process.env.basePath ?? '';

const TEST_URL = 'https://test.lila.com.ar';
const LOCAL_URL = 'http://localhost:8080';

// This is the Backend base url, it is used to make requests to the API.
// WARNING: This BASE_PATH variable is only available on the server side.
// All these url values on the client side are not reliable and may differ from the server side.
export const BASE_URL = isProduction
  ? process.env.BASE_PATH ?? 'https://lila.com.ar' // DON'T CHANGE THIS LINE.
  : LOCAL_URL; // You can change this line during development.

export const API_BASE_URL = BASE_URL + '/api/blockchain-test';

export const HTTP_STATUS = {
  ok: 200,
  created: 201,
  found: 302,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  methodNotAllowed: 405,
  conflict: 409,
  internalServerError: 500,
};

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
