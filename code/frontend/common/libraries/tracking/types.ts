import { User } from '@/common/libraries/auth/types';

export type EventData = Record<string, any>;

export interface PostActionParams {
  trackType: 'view' | 'event';
  path: string;
  user: User | null;
  isBrowser: boolean;
  eventData: EventData;
}
