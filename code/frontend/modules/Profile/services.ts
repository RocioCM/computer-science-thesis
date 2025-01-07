import request from '@/common/services/request';
import { Profile } from './types';

const ProfileServices = {
  get: () => request<Profile>('/Profile'),
};

export default ProfileServices;
