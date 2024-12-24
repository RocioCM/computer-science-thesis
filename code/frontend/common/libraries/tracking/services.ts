import { API_METRICS_BASE_URL } from './constants';
import { isDevelopment } from '@/common/constants';

/** Disable tracking in development mode.*/
const TRACKING_DISABLED = isDevelopment && true; // Switch this value to false to enable tracking in development mode.

/** Sends analytics data to the backend. */
const AnalyticsServices = {
  post: async (payload: any) => {
    try {
      return; // Completely disable tracking.
      // Only send analytics in production.
      // Send analytics directly to backend, not to the NextJS' API route.
      await fetch(
        `${
          TRACKING_DISABLED ? '/DEV/disabled-metrics' : API_METRICS_BASE_URL
        }/metrics`,
        {
          headers: { 'Content-Type': 'application/json' },
          method: 'post',
          mode: 'cors',
          body: JSON.stringify(payload),
        }
      );
    } catch {
      // Do nothing
    }
  },
};

export default AnalyticsServices;
