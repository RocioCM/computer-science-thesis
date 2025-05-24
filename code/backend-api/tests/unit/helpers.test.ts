import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as firebaseAdmin from 'firebase-admin';
import { ethers } from 'ethers';
import express from 'express';

import { Authenticate, initializeAdmin } from 'src/pkg/helpers/authHelper';
import blockchainHelper, { ABI } from 'src/pkg/helpers/blockchainHelper';
import { getEnv } from 'src/pkg/helpers/env';
import logger from 'src/pkg/helpers/logger';
import middlewareHelper from 'src/pkg/helpers/middlewareHelper';
import requestHelper from 'src/pkg/helpers/requestHelper';
import responseHelper from 'src/pkg/helpers/responseHelper';
import { User } from 'src/modules/auth/domain/user';
import {
  cleanupTestDatabase,
  setupTestEnvironment,
  teardownTestEnvironment,
} from '../utils';
import { ROLES } from 'src/pkg/constants';

// Mock ethers
jest.mock('ethers', () => ({
  ethers: {
    JsonRpcProvider: jest.fn().mockImplementation(() => ({
      getTransactionCount: jest.fn().mockResolvedValue(1),
    })),
    Contract: jest.fn().mockImplementation(() => ({
      interface: { parseLog: jest.fn().mockImplementation((log: any) => log) },
      getFunction: jest.fn(),
    })),
    Wallet: jest.fn().mockImplementation(() => ({
      address: '0xMockAddress',
      provider: {
        getTransactionCount: jest.fn().mockResolvedValue(1),
      },
    })),
    Result: Array,
    ContractTransactionResponse: jest.fn().mockImplementation(() => ({
      wait: jest.fn().mockResolvedValue({
        logs: [],
      }),
    })),
  },
}));

describe('Helpers', () => {
  beforeAll(async () => {
    await setupTestEnvironment();
  });

  beforeEach(async () => {
    await cleanupTestDatabase();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await teardownTestEnvironment();
  });

  describe('authHelper', () => {
    it('should initialize Firebase Admin SDK successfully', async () => {
      await expect(initializeAdmin()).resolves.not.toThrow();
      expect(firebaseAdmin.credential.cert).toHaveBeenCalled();
      expect(firebaseAdmin.initializeApp).toHaveBeenCalled();
    });

    it('should reject initialization when Firebase config is invalid', async () => {
      jest.spyOn(JSON, 'parse').mockImplementationOnce(() => {
        throw new Error('Invalid JSON');
      });
      await expect(initializeAdmin()).rejects.toThrow('Invalid JSON');
    });

    it('should authenticate user with valid token', async () => {
      const mockReq = {
        headers: { authorization: 'Bearer valid-token' },
      } as Request;
      const result = await Authenticate(mockReq);

      expect(result.ok).toBe(true);
      expect(result.status).toBe(StatusCodes.OK);
      expect(result.data).toBeDefined();
    });

    it('should authenticate user with role-specific token', async () => {
      const mockReq = {
        headers: { authorization: 'Bearer userWithId-userRole-PRODUCER' },
      } as Request;
      const result = await Authenticate(mockReq, ROLES.PRODUCER);

      expect(result.ok).toBe(true);
      expect(result.status).toBe(StatusCodes.OK);
      expect(result.data).toBeDefined();
      expect(firebaseAdmin.auth().verifyIdToken).toHaveBeenCalledWith(
        'userWithId-userRole-PRODUCER',
      );
    });

    it('should return unauthorized when token is invalid', async () => {
      const mockReq = {
        headers: { authorization: 'Bearer invalid-token' },
      } as Request;
      const result = await Authenticate(mockReq);

      expect(result.ok).toBe(false);
      expect(result.status).toBe(StatusCodes.UNAUTHORIZED);
      expect(result.data).toBeNull();
    });

    it('should return unauthorized when no token is provided', async () => {
      const mockReq = { headers: {} } as Request;
      const result = await Authenticate(mockReq);

      expect(result.ok).toBe(false);
      expect(result.status).toBe(StatusCodes.UNAUTHORIZED);
      expect(result.data).toBeNull();
    });

    it('should return forbidden when user role does not match allowed role', async () => {
      // The mock in jest.setup.ts creates a PRODUCER user with this auth token
      const mockReq = {
        headers: { authorization: 'Bearer userWithId-userRole-PRODUCER' },
      } as Request;
      const result = await Authenticate(mockReq, ROLES.RECYCLER); // Require RECYCLER role

      expect(result.ok).toBe(false);
      expect(result.status).toBe(StatusCodes.FORBIDDEN);
      expect(result.data).toBeNull();
    });

    it('should accept multiple roles', async () => {
      // The mock in jest.setup.ts creates a PRODUCER user (role 1)
      const mockReq = {
        headers: { authorization: 'Bearer userWithId-userRole-PRODUCER' },
      } as Request;
      const result = await Authenticate(mockReq, [1, 2, 3]); // Multiple roles including PRODUCER (1)

      expect(result.ok).toBe(true);
      expect(result.status).toBe(StatusCodes.OK);
      expect(result.data).toBeDefined();
    });

    it('should accept any authenticated user when no roles are specified', async () => {
      // The mock in jest.setup.ts creates a PRODUCER user (role 1)
      const mockReq = {
        headers: { authorization: 'Bearer userWithId-userRole-PRODUCER' },
      } as Request;
      const result = await Authenticate(mockReq); // No roles specified

      expect(result.ok).toBe(true);
      expect(result.status).toBe(StatusCodes.OK);
      expect(result.data).toBeDefined();
    });

    it('should handle user with no custom claims', async () => {
      // Mock a user without any claims
      jest.spyOn(firebaseAdmin.auth(), 'getUser').mockResolvedValueOnce({
        uid: 'no-claims-user',
        customClaims: undefined, // User without claims
      } as any);

      const mockReq = {
        headers: { authorization: 'Bearer valid-token' },
      } as Request;
      const result = await Authenticate(mockReq, 1); // Require a role

      expect(result.ok).toBe(false);
      expect(result.status).toBe(StatusCodes.FORBIDDEN);
      expect(result.data).toBeNull();
    });

    it('should handle user with empty custom claims', async () => {
      // Mock a user with empty claims object
      jest.spyOn(firebaseAdmin.auth(), 'getUser').mockResolvedValueOnce({
        uid: 'empty-claims-user',
        customClaims: {}, // Empty claims object
      } as any);

      const mockReq = {
        headers: { authorization: 'Bearer valid-token' },
      } as Request;
      const result = await Authenticate(mockReq, 1); // Require a role

      expect(result.ok).toBe(false);
      expect(result.status).toBe(StatusCodes.FORBIDDEN);
      expect(result.data).toBeNull();
    });
  });

  describe('blockchainHelper', () => {
    const mockAbi: ABI = [
      {
        type: 'function',
        name: 'testMethod',
        inputs: [{ internalType: 'uint256', name: 'id', type: 'uint256' }],
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'testComplexMethod',
        inputs: [{ internalType: 'uint256', name: 'id', type: 'uint256' }],
        outputs: [
          { internalType: 'uint256', name: 'id', type: 'uint256' },
          { internalType: 'string', name: 'name', type: 'string' },
          {
            internalType: 'tuple[]',
            name: 'complexField',
            type: 'tuple[]',
            components: [
              { internalType: 'string', name: 'sub1', type: 'string' },
              { internalType: 'string', name: 'sub2', type: 'string' },
            ],
          },
        ],
        stateMutability: 'view',
      },
      {
        type: 'function',
        name: 'testEmptyMethod',
        inputs: [],
        outputs: [],
        stateMutability: 'view',
      },
      {
        type: 'event',
        name: 'TestEvent',
        inputs: [
          {
            internalType: 'uint256',
            name: 'id',
            type: 'uint256',
            indexed: true,
          },
          {
            internalType: 'string',
            name: 'value',
            type: 'string',
            indexed: false,
          },
        ],
      },
    ];

    it('should call contract method successfully', async () => {
      const mockLogs = [
        { name: 'TestEvent', args: [BigInt(123), '0x123', 'extra-param'] },
        { name: 'UknownEvent', args: ['this event should be ignored'] },
      ];
      const mockReceipt = { logs: mockLogs };
      const mockContract = new ethers.Contract('', []);

      mockContract.getFunction = jest.fn().mockReturnValue(
        jest.fn().mockResolvedValue({
          wait: jest.fn().mockResolvedValue(mockReceipt),
        }),
      );

      // @ts-ignore - We're mocking the static method
      ethers.Contract.mockImplementation(() => mockContract);

      const result = await blockchainHelper.callContractMethod(
        '0xContractAddress',
        mockAbi,
        'testMethod',
      );

      expect(result.ok).toBe(true);
      expect(result.data).toStrictEqual([
        { name: 'TestEvent', args: [123, '0x123', 'extra-param'] },
      ]);
      expect(mockContract.getFunction).toHaveBeenCalledWith('testMethod');
    });

    it('should handle transaction successful with malformed receipt', async () => {
      const mockLogs = [
        { name: 'TestEvent', args: [BigInt(123), '0x123', 'extra-param'] },
      ];
      const mockReceipt = { logs: mockLogs };
      const mockContract = new ethers.Contract('', []);

      mockContract.interface.parseLog = jest.fn().mockImplementation(() => {
        throw new Error('');
      });
      mockContract.getFunction = jest.fn().mockReturnValue(
        jest.fn().mockResolvedValue({
          wait: jest.fn().mockResolvedValue(mockReceipt),
        }),
      );

      // @ts-ignore - We're mocking the static method
      ethers.Contract.mockImplementation(() => mockContract);

      const result = await blockchainHelper.callContractMethod(
        '0xContractAddress',
        mockAbi,
        'testMethod',
      );

      expect(result.ok).toBe(true);
      expect(result.data).toStrictEqual([]);
      expect(mockContract.getFunction).toHaveBeenCalledWith('testMethod');
    });

    it('should handle transaction failed with no receipt', async () => {
      const mockContract = new ethers.Contract('', []);

      mockContract.getFunction = jest.fn().mockReturnValue(
        jest.fn().mockResolvedValue({
          wait: jest.fn().mockResolvedValue(null),
        }),
      );

      // @ts-ignore - We're mocking the static method
      ethers.Contract.mockImplementation(() => mockContract);

      const result = await blockchainHelper.callContractMethod(
        '0xContractAddress',
        mockAbi,
        'testMethod',
      );

      expect(result.ok).toBe(false);
      expect(result.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.data).toBeNull();
      expect(mockContract.getFunction).toHaveBeenCalledWith('testMethod');
    });

    it('should handle contract call errors', async () => {
      const mockContract = new ethers.Contract('', []);
      mockContract.getFunction = jest
        .fn()
        .mockReturnValue(jest.fn().mockRejectedValue(new Error('')));

      // @ts-ignore - We're mocking the static method
      ethers.Contract.mockImplementation(() => mockContract);

      const result = await blockchainHelper.callContractMethod(
        '0xContractAddress',
        mockAbi,
        'testMethod',
      );

      expect(result.ok).toBe(false);
      expect(result.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.data).toBe('Internal server error');
    });

    it('should call pure contract method successfully', async () => {
      const mockContract = new ethers.Contract('', []);
      mockContract.getFunction = jest
        .fn()
        .mockReturnValue(jest.fn().mockResolvedValue(BigInt(123)));

      // @ts-ignore - We're mocking the static method
      ethers.Contract.mockImplementation(() => mockContract);

      const result = await blockchainHelper.callPureContractMethod(
        '0xContractAddress',
        mockAbi,
        'testMethod',
      );

      expect(result.ok).toBe(true);
      expect(result.status).toBe(StatusCodes.OK);
      expect(result.data).toBe(123);
    });

    it('should format complex contract responses', async () => {
      const mockContract = new ethers.Contract('', []);
      mockContract.getFunction = jest
        .fn()
        .mockReturnValue(
          jest
            .fn()
            .mockResolvedValue([BigInt(456), 'test-name', [['foo', 'bar']]]),
        );

      // @ts-ignore - We're mocking the static method
      ethers.Contract.mockImplementation(() => mockContract);

      const result = await blockchainHelper.callPureContractMethod(
        '0xContractAddress',
        mockAbi,
        'testComplexMethod',
      );

      expect(result.ok).toBe(true);
      expect(result.status).toBe(StatusCodes.OK);
      expect(result.data).toEqual({
        id: 456,
        name: 'test-name',
        complexField: [{ sub1: 'foo', sub2: 'bar' }],
      });
    });

    it('should handle pure contract call errors', async () => {
      const mockContract = new ethers.Contract('', []);

      mockContract.getFunction = jest
        .fn()
        .mockReturnValue(jest.fn().mockRejectedValue(new Error('')));

      // @ts-ignore - We're mocking the static method
      ethers.Contract.mockImplementation(() => mockContract);

      const result = await blockchainHelper.callPureContractMethod(
        '0xContractAddress',
        mockAbi,
        'testMethod',
      );

      expect(result.ok).toBe(false);
      expect(result.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.data).toBe('Internal server error');
    });

    it('should handle successful call method with no outputs', async () => {
      const mockContract = new ethers.Contract('', []);
      mockContract.getFunction = jest
        .fn()
        .mockReturnValue(
          jest.fn().mockResolvedValue([BigInt(456), 'test-name']),
        );

      // @ts-ignore - We're mocking the static method
      ethers.Contract.mockImplementation(() => mockContract);

      const result = await blockchainHelper.callPureContractMethod(
        '0xContractAddress',
        mockAbi,
        'testEmptyMethod',
      );

      expect(result.ok).toBe(true);
      expect(result.status).toBe(StatusCodes.OK);
      expect(result.data).toBeNull();
    });

    it('should handle call to unknown method', async () => {
      const mockContract = new ethers.Contract('', []);
      mockContract.getFunction = jest
        .fn()
        .mockReturnValue(
          jest.fn().mockResolvedValue([BigInt(456), 'test-name']),
        );

      // @ts-ignore - We're mocking the static method
      ethers.Contract.mockImplementation(() => mockContract);

      const result = await blockchainHelper.callPureContractMethod(
        '0xContractAddress',
        mockAbi,
        'unknownMethod',
      );

      expect(result.ok).toBe(false);
      expect(result.status).toBe(StatusCodes.NOT_FOUND);
      expect(result.data).toBeNull();
    });
  });

  describe('env helper', () => {
    it('should get environment variable', () => {
      const value = getEnv('NODE_ENV');
      expect(value).toBe('test'); // NODE_ENV is set to 'test' by default in Jest environment
    });

    it('should return default value when environment variable is not set', () => {
      const value = getEnv('NONEXISTENT_VAR', 'default-value');
      expect(value).toBe('default-value');
    });
  });

  describe('logger', () => {
    it('should log messages at different levels', () => {
      // Spy on global console methods
      const consoleSpy = jest.spyOn(console, 'log');
      const consoleErrorSpy = jest.spyOn(console, 'error');

      logger.info('Info message');

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[INFO] Info message'),
      );

      logger.success('Success message');

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[SUCCESS] Success message'),
      );

      logger.error(new Error('Error message'));

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR]'),
        expect.any(Error),
      );

      logger.warn('Warning message');

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[WARN] Warning message'),
      );

      // Debug message should only be logged in non-production environments (development and test)
      logger.debug('Debug message');

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[DEBUG] Debug message'),
      );

      consoleSpy.mockRestore(); // Restore the original console.log
      consoleErrorSpy.mockRestore(); // Restore the original console.error
    });
  });

  describe('middlewareHelper', () => {
    it('should apply async handler middleware to router', () => {
      const router = {
        get: jest.fn().mockReturnThis(),
        post: jest.fn().mockReturnThis(),
        put: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
      } as unknown as Router;

      const unwrappedRouter = { ...router };

      middlewareHelper.applyAsyncHandlerMiddleware(router);

      // Check that each method is wrapped
      const path = '/test';
      const handler = async (_req: Request, _res: Response) => {};

      // Call the wrapped methods
      router.get(path, handler);
      router.post(path, handler);
      router.put(path, handler);
      router.delete(path, handler);

      // Check methods are wrapped
      expect(router.get).toBeInstanceOf(Function);
      expect(router.post).toBeInstanceOf(Function);
      expect(router.put).toBeInstanceOf(Function);
      expect(router.delete).toBeInstanceOf(Function);

      // Check wrapped handler is called
      expect(unwrappedRouter.get).toHaveBeenCalledWith(
        path,
        expect.any(Function),
      );
      expect(unwrappedRouter.post).toHaveBeenCalledWith(
        path,
        expect.any(Function),
      );
      expect(unwrappedRouter.put).toHaveBeenCalledWith(
        path,
        expect.any(Function),
      );
      expect(unwrappedRouter.delete).toHaveBeenCalledWith(
        path,
        expect.any(Function),
      );
    });

    it('should catch errors in async handlers', async () => {
      const router = express.Router();
      const mockNext = jest.fn();
      const mockReq = {} as Request;
      const mockRes = {} as Response;

      // Create a function that always throws
      const errorHandler = async () => {
        throw new Error('Test error');
      };

      // Apply the middleware
      middlewareHelper.applyAsyncHandlerMiddleware(router);

      // Get the wrapper created by the middleware
      const wrappedHandler = router.get('/', errorHandler);

      // Call the wrapped handler
      await wrappedHandler(mockReq, mockRes, mockNext);

      // Expect next to be called with the error
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('requestHelper', () => {
    it('should get bearer token from authorization header', () => {
      const req = {
        headers: {
          authorization: 'Bearer test-token',
        },
      } as Request;

      const token = requestHelper.getAuthToken(req);
      expect(token).toBe('test-token');
    });

    it('should get plain token from authorization header', () => {
      const req = {
        headers: {
          authorization: 'plain-test-token',
        },
      } as Request;

      const token = requestHelper.getAuthToken(req);
      expect(token).toBe('plain-test-token');
    });

    it('should return empty string when no authorization header', () => {
      const req = { headers: {} } as Request;
      const token = requestHelper.getAuthToken(req);
      expect(token).toBe('');
    });

    it('should return empty string when no bearer token', () => {
      const req = {
        headers: {
          authorization: 'Bearer ',
        },
      } as Request;
      const token = requestHelper.getAuthToken(req);
      expect(token).toBe('');
    });

    it('should parse unsigned integer correctly', () => {
      expect(requestHelper.parseUint('123')).toBe(123);
      expect(requestHelper.parseUint('123.12')).toBe(123);
      expect(requestHelper.parseUint('0')).toBe(0);
      expect(requestHelper.parseUint('-123')).toBeNull();
      expect(requestHelper.parseUint('abc')).toBeNull();
      expect(requestHelper.parseUint(null)).toBeNull();
      expect(requestHelper.parseUint(NaN)).toBeNull();
    });

    it('should parse and validate request body', async () => {
      const body = {
        id: 1,
        firebaseUid: 'test-firebase-uid',
        email: 'test@example.com',
        blockchainId: '0x1234567890abcdef',
        userName: 'testuser',
        managerName: 'testmanager',
        phone: '1234567890',
      };

      const result = await requestHelper.parseBody(body, User);

      expect(result.ok).toBe(true);
      expect(result.status).toBe(StatusCodes.OK);
      expect(result.data).toEqual(body);
    });

    it('should parse and validate request body with optional fields', async () => {
      const body = {
        id: 1,
        firebaseUid: 'test-firebase-uid',
        email: 'test@example.com',
        blockchainId: '0x1234567890abcdef',
        userName: '', // optional field
        managerName: null, // optional field
        phone: undefined, // optional field
      };

      const result = await requestHelper.parseBody(body, User);

      expect(result.ok).toBe(true);
      expect(result.status).toBe(StatusCodes.OK);
      expect(result.data).toEqual(body);
    });

    it('should return validation errors', async () => {
      const body = {
        id: 'invalid type',
        firebaseUid: null, // Mandatory field
        email: 'invalid email',
        blockchainId: '0x1234567890abcdef',
        userName: '', // optional field
        managerName: null, // optional field
        phone: undefined, // optional field
      };

      const result = await requestHelper.parseBody(body, User);

      expect(result.ok).toBe(false);
      expect(result.status).toBe(StatusCodes.BAD_REQUEST);
      expect(result.data).toContain('id must be an integer number');
      expect(result.data).toContain('firebaseUid must be a string');
      expect(result.data).toContain('email must be an email');
    });
  });

  describe('responseHelper', () => {
    it('should build a successful response', () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      responseHelper.build(res, StatusCodes.OK, { data: 'test' });

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        status: StatusCodes.OK,
        data: { data: 'test' },
      });
    });

    it('should build an error response', () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      responseHelper.build(res, StatusCodes.NOT_FOUND);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        status: StatusCodes.NOT_FOUND,
        data: null,
      });
    });

    it('should set data to null when not provided', () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      responseHelper.build(res, StatusCodes.OK);

      expect(res.json).toHaveBeenCalledWith({
        status: StatusCodes.OK,
        data: null,
      });
    });
  });
});
