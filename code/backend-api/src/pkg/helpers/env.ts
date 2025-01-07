export function getEnv(key: string, defaultValue: string = ''): string {
  return process.env[key] || defaultValue;
}

export function isProduction() {
  return getEnv('NODE_ENV') === 'production';
}
