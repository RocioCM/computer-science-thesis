import request from './request';
import { HTTP_STATUS, basePath } from '@/common/constants';

// Mocking the getSession function from @common/utils/auth
jest.mock('../libraries/auth/session', () => ({
  getSession: jest.fn().mockReturnValue('token'),
}));

describe('request function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls API route when not server side', async () => {
    (global as any).fetch = jest.fn().mockResolvedValue({
      status: HTTP_STATUS.ok,
      json: async () => ({ data: { test: 'success' } }),
    });
    const result = await request('/test');
    expect(result.ok).toBeTruthy();
    expect(fetch).toHaveBeenCalledWith(
      `${basePath}/api/test`,
      expect.any(Object)
    );
  });

  it('returns error object on non-200 response', async () => {
    (global as any).fetch = jest.fn().mockResolvedValue({
      status: HTTP_STATUS.unauthorized,
      json: async () => ({ data: { message: 'Unauthorized' } }),
    });
    const result = await request('/fail');
    expect(result.ok).toBeFalsy();
    expect(result.status).toBe(HTTP_STATUS.unauthorized);
  });

  it('handles exceptions safely', async () => {
    (global as any).fetch = jest
      .fn()
      .mockRejectedValue(new Error('Network fail'));
    const result = await request('/exception');
    expect(result.ok).toBeFalsy();
    expect(result.data).toBeNull();
  });

  it('defaults to null data', async () => {
    (global as any).fetch = jest.fn().mockResolvedValue({
      status: HTTP_STATUS.ok,
      json: async () => ({}),
    });
    const result = await request('/null');
    expect(result.ok).toBeTruthy();
    expect(result.data).toBeNull();
  });

  it('sends bearer authorization header', async () => {
    (global as any).fetch = jest.fn().mockResolvedValue({
      status: HTTP_STATUS.ok,
      json: async () => ({ data: { test: 'success' } }),
    });

    const result = await request('/test');
    expect(result.ok).toBeTruthy();
    expect(fetch).toHaveBeenCalledWith(
      `${basePath}/api/test`,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer token',
        }),
      })
    );
  });
});
