import { v4 as uuidv4 } from 'uuid';
import AnalyticsServices from './services';
import { APP_NAME, APP_KEYNAME } from './constants';
import { EventData, PostActionParams } from './types';
import { User } from '@/common/libraries/auth/types';
import { isServerSide } from '@/common/constants';

/**
 * Returns the complete pathname of the view or event.
 * This pathname is built using app name, view path and event path.
 * @param viewPath path name of the tracked screen/view or the screen the event belongs to.
 * @param eventPath path name of the tracked event.
 * @returns complete pathname.
 */
const getPath = (viewPath: string, eventPath = ''): string => {
  const appPath = APP_KEYNAME;
  const params = [viewPath, eventPath].filter((p) => p);
  const path = `${appPath}${params.length ? params.join('/') : ''}`;
  return path;
};

/**
 * Returns an object containing the necessary user info to attach to the track
 * @param user user object provided by the auth library.
 * @returns user info.
 */
const getUserInfo = (user: User | null = null) => {
  const { sessionToken = '', id = 0 } = user || {};
  let trackingId = localStorage.getItem('sessionId');
  if (!trackingId) {
    trackingId = localStorage.getItem('sessionId') || uuidv4();
    localStorage.setItem('sessionId', trackingId);
  }
  return { userId: id, userToken: sessionToken, trackingId };
};

/**
 * Returns the operating system of the client
 * @returns {string} platform.
 */
const getPlatform = (): string => {
  const { userAgent } = navigator || {};
  if (/android/i.test(userAgent)) return 'Android';
  if (/iPad|iPhone|iPod/.test(userAgent)) return 'iOS';
  if (/windows/i.test(userAgent)) return 'Windows';
  if (/mac/i.test(userAgent)) return 'macOS';
  if (/linux/i.test(userAgent)) return 'Linux';
  return 'unknown';
};

/**
 * Returns an object containing the necessary application and system info to attach to the track
 * @param isBrowser indicates if the platform is a browser.
 * @returns environment info.
 */
const getEnvInfo = (isBrowser: boolean) => {
  const now = new Date();
  const data = {
    application: APP_NAME,
    timeStamp: now.toISOString(),
    deviceInfo: 'unknown',
    platform: 'server',
  };

  if (!isServerSide) {
    data.platform = isBrowser ? `web-${getPlatform()}` : getPlatform();
    data.deviceInfo = `${window.innerWidth}x${window.innerHeight}`;
  }
  return data;
};

/**
 * Formats event data to the desired format to send it to the tracking API.
 * @param data event data not formatted.
 * @param config settings to format the event data.
 * @returns an object with the event data formatted.
 */
const getEventData = (
  data: EventData,
  config: string | string[] | string[][]
) => {
  const shortenData = (d: any) => (typeof d === 'string' ? d.slice(0, 50) : d); // Avoid sending large strings, for example, in innerText.

  const eventData: EventData = {};
  // Case 1.
  if (typeof config === 'string') eventData[config] = shortenData(data);
  else
    config.forEach((prop) => {
      if (typeof prop === 'string')
        eventData[prop] = shortenData(data[prop]); // Case 2.
      else eventData[prop[1]] = shortenData(data[prop[0]]); // Case 3.
    });
  return eventData;
};

/**
 * Formats and attaches extra information to the tracker and sends it to the API.
 * @param {PostActionParams} data data associated to the tracked event or screen.
 */
const postAction = async ({
  trackType,
  path,
  user,
  isBrowser,
  eventData,
}: PostActionParams) => {
  const payload = {
    trackType,
    path,
    eventData,
    ...getUserInfo(user),
    ...getEnvInfo(isBrowser),
  };
  const res = await AnalyticsServices.post(payload);
  return res;
};

export { getPath, getEventData, postAction };
