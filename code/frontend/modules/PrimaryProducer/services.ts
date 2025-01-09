import request from '@/common/services/request';
import { PrimaryProducer } from './types';

const PrimaryProducerServices = {
  get: () => request<PrimaryProducer>('/PrimaryProducer'),
};

export default PrimaryProducerServices;
