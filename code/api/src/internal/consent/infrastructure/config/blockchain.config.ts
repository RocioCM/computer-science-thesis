import { registerAs } from '@nestjs/config';

export default registerAs('blockchain', () => ({
  providerUrl: process.env.PROVIDER_URL,
  privateKey: process.env.PRIVATE_KEY,
}));
