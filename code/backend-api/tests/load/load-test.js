import http from 'k6/http';
import { check, sleep } from 'k6';

// TEST CONFIGURATION
const BASE_URL = 'http://localhost:8080/api/blockchain-test';
// Replace with a valid Firebase token (Recyler role) before running the test (tokens are valid for 1 hour and only can be obtained on the frontend).
const FIREBASE_TOKEN =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6IjNmOWEwNTBkYzRhZTgyOGMyODcxYzMyNTYzYzk5ZDUwMjc3ODRiZTUiLCJ0eXAiOiJKV1QifQ.eyJyb2xlIjo1LCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vYmxvY2tjaGFpbi10aGVzaXMtZWY3MTQiLCJhdWQiOiJibG9ja2NoYWluLXRoZXNpcy1lZjcxNCIsImF1dGhfdGltZSI6MTc0NjI5MzgxNSwidXNlcl9pZCI6InZ2ODMxNVFWb01VZ1VsTnZabWtxa1BqQXEzUzIiLCJzdWIiOiJ2djgzMTVRVm9NVWdVbE52Wm1rcWtQakFxM1MyIiwiaWF0IjoxNzQ2Mjk3OTI0LCJleHAiOjE3NDYzMDE1MjQsImVtYWlsIjoicmVjeWNsZXIxNEB0ZXNpcy5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsicmVjeWNsZXIxNEB0ZXNpcy5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.uyVPvtgdmkHj3lcgmA1Tb6xykQQPVJtP1avxGeNk6jKfC-16ArkfgEmTuYvEvn9bpGUv5FxFpu7DL2KMlfX4exxy_Y2rsAUxQDMcImz9hvSPbgRDnQLGyhdhQ3TgOekGQ9LxPB3lnjn4rPVRHCjXI29m-o7GdNCSU9How_8uLksfakoZmOzDHdNLOio-utQdMFNaqLOi5xwufakLFfoddO3ieUQxXR7w3Cuq3chCW0dTRAGaQ5W5Jizjaasl7WHIdC8kh4OSaT6eJXHZqKLYBNOUHHrTARLFThrzMwC50FWwOqxYb4uJP7t3JsSfMj2Me4Agje2BgXNQDgxVJl3ZGQ';
const VIRTUAL_USERS = 200;
const RAMP_UP_TIME = '30s';
const TEST_DURATION = '1m';
const RAMP_DOWN_TIME = '30s';
const MAX_RESPONSE_TIME = 500; // milliseconds.
const MAX_FAILURE_RATE = 0.01; // 1%

// Common headers for authenticated requests
const AUTH_HEADERS = {
  Authorization: `Bearer ${FIREBASE_TOKEN}`,
  'Content-Type': 'application/json',
};

export const options = {
  stages: [
    { duration: RAMP_UP_TIME, target: VIRTUAL_USERS }, // Ramp up to VIRTUAL_USERS
    { duration: TEST_DURATION, target: VIRTUAL_USERS }, // Maintain VIRTUAL_USERS
    { duration: RAMP_DOWN_TIME, target: 0 }, // Ramp down to 0
  ],
  thresholds: {
    http_req_duration: [`p(95)<${MAX_RESPONSE_TIME}`], // 95% of requests must complete below MAX_RESPONSE_TIME
    http_req_failed: [`rate<${MAX_FAILURE_RATE}`], // Less than MAX_FAILURE_RATE requests can fail
  },
};

export default function () {
  // Test public tracking endpoint (no auth required)
  const trackingResponse = http.get(`${BASE_URL}/tracking/waste-bottle/1`);
  check(trackingResponse, {
    'tracking status is 200': (r) => r.status === 200,
  });

  // Test user info endpoint (requires Firebase token)
  const userResponse = http.get(`${BASE_URL}/auth/user`, {
    headers: AUTH_HEADERS,
  });
  check(userResponse, {
    'user info status is 200': (r) => r.status === 200,
  });

  // Test authenticated bottles endpoint
  const bottlesResponse = http.get(`${BASE_URL}/recycler/bottles`, {
    headers: AUTH_HEADERS,
  });
  check(bottlesResponse, {
    'bottles status is 200': (r) => r.status === 200,
  });

  sleep(1); // Wait 1 second between requests
}
