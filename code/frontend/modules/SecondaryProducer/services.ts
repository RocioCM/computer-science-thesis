import request from '@/common/services/request';
import { SecondaryProducer } from './types';

const SecondaryProducerServices = {
  get: () => request<SecondaryProducer>('/SecondaryProducer'),
};

export default SecondaryProducerServices;
