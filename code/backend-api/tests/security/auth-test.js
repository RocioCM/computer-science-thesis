import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = 'https://test.lila.com.ar/api/blockchain-test';
// Replace with a valid Firebase token (Recyler role) before running the test (tokens are valid for 1 hour and only can be obtained on the frontend).
const VALID_RECYCLER_TOKEN =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6IjNmOWEwNTBkYzRhZTgyOGMyODcxYzMyNTYzYzk5ZDUwMjc3ODRiZTUiLCJ0eXAiOiJKV1QifQ.eyJyb2xlIjo1LCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vYmxvY2tjaGFpbi10aGVzaXMtZWY3MTQiLCJhdWQiOiJibG9ja2NoYWluLXRoZXNpcy1lZjcxNCIsImF1dGhfdGltZSI6MTc0NjI5MzgxNSwidXNlcl9pZCI6InZ2ODMxNVFWb01VZ1VsTnZabWtxa1BqQXEzUzIiLCJzdWIiOiJ2djgzMTVRVm9NVWdVbE52Wm1rcWtQakFxM1MyIiwiaWF0IjoxNzQ2Mjk3OTI0LCJleHAiOjE3NDYzMDE1MjQsImVtYWlsIjoicmVjeWNsZXIxNEB0ZXNpcy5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsicmVjeWNsZXIxNEB0ZXNpcy5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.uyVPvtgdmkHj3lcgmA1Tb6xykQQPVJtP1avxGeNk6jKfC-16ArkfgEmTuYvEvn9bpGUv5FxFpu7DL2KMlfX4exxy_Y2rsAUxQDMcImz9hvSPbgRDnQLGyhdhQ3TgOekGQ9LxPB3lnjn4rPVRHCjXI29m-o7GdNCSU9How_8uLksfakoZmOzDHdNLOio-utQdMFNaqLOi5xwufakLFfoddO3ieUQxXR7w3Cuq3chCW0dTRAGaQ5W5Jizjaasl7WHIdC8kh4OSaT6eJXHZqKLYBNOUHHrTARLFThrzMwC50FWwOqxYb4uJP7t3JsSfMj2Me4Agje2BgXNQDgxVJl3ZGQ';

// Test cases for authentication and authorization
export default function () {
  // Test 1: Access protected endpoint without token
  const noTokenResponse = http.get(`${BASE_URL}/recycler/bottles`);
  check(noTokenResponse, {
    'protected endpoint without token should return 401': (r) =>
      r.status === 401,
  });

  // Test 2: Access protected endpoint with invalid token
  const invalidTokenResponse = http.get(`${BASE_URL}/recycler/bottles`, {
    headers: {
      Authorization: 'Bearer invalid_token',
      'Content-Type': 'application/json',
    },
  });
  check(invalidTokenResponse, {
    'protected endpoint with invalid token should return 401': (r) =>
      r.status === 401,
  });

  // Test 3: Access endpoint with expired token
  const expiredTokenResponse = http.get(`${BASE_URL}/recycler/bottles`, {
    headers: {
      Authorization:
        'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjNmOWEwNTBkYzRhZTgyOGMyODcxYzMyNTYzYzk5ZDUwMjc3ODRiZTUiLCJ0eXAiOiJKV1QifQ.eyJyb2xlIjo1LCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vYmxvY2tjaGFpbi10aGVzaXMtZWY3MTQiLCJhdWQiOiJibG9ja2NoYWluLXRoZXNpcy1lZjcxNCIsImF1dGhfdGltZSI6MTc0NjI5MzgxNSwidXNlcl9pZCI6InZ2ODMxNVFWb01VZ1VsTnZabWtxa1BqQXEzUzIiLCJzdWIiOiJ2djgzMTVRVm9NVWdVbE52Wm1rcWtQakFxM1MyIiwiaWF0IjoxNzQ2MjkzODE1LCJleHAiOjE3NDYyOTc0MTUsImVtYWlsIjoicmVjeWNsZXIxNEB0ZXNpcy5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsicmVjeWNsZXIxNEB0ZXNpcy5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.PoH-whZ5pWHjv9d6ePfm6EtJ-ACV3DSim_Fy6tWV9cGhBYvop_TzDGwvdqPRQuTiN19ya045eBdQ_1k0-n6X17_qMSbQQl4yC9gLN7texcXkPyzsrVUXKSiC63cf84qQ3c_kPVy1SnojxTpO7djSdsa3zUuPrTqXUM_tPd6HeDku8meOS2z6HsP_81ITrDXo0sOlcn-LVlVrviX9IQ7VDjsngPLgJd0SCNDxOCfWIp9kgkTNeJ4FSuDGDXt5L-TzuKvctVSbKhKRwzpWAmRJHnuxyVt1CrrtMyO_4C7JkUd7ERJxkuGtjdMR2YODWcdGdN9jf2gohg7TjifaRBwOeg',
      'Content-Type': 'application/json',
    },
  });
  check(expiredTokenResponse, {
    'protected endpoint with expired token should return 401': (r) =>
      r.status === 401,
  });

  // Test 4: Access endpoint with wrong role token
  const wrongRoleResponse = http.get(`${BASE_URL}/recycler/bottles`, {
    headers: {
      Authorization: VALID_RECYCLER_TOKEN,
      'Content-Type': 'application/json',
    },
  });
  check(wrongRoleResponse, {
    'protected endpoint with wrong role should return 403': (r) =>
      r.status === 403,
  });
}
