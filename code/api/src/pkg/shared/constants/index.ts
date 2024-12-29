export const PORT = Number(process.env.PORT) || 8080;

export const BASE_PATH = ''; // Unused at the moment as we have only one API module

export const CONSENT_API_PATH = 'consent';

export const CONTRACT_ABI = [
  { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'consentId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'userId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string[]',
        name: 'activities',
        type: 'string[]',
      },
    ],
    name: 'ActivitiesUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'consentId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'creatorId',
        type: 'uint256',
      },
    ],
    name: 'ConsentCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'consentId',
        type: 'uint256',
      },
    ],
    name: 'ConsentDeleted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'consentId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'userId',
        type: 'uint256',
      },
    ],
    name: 'ConsentJoined',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'consentId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'userId',
        type: 'uint256',
      },
    ],
    name: 'ConsentRejected',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'consentId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'userId',
        type: 'uint256',
      },
    ],
    name: 'ConsentRevoked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'consentId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'integrityHash',
        type: 'bytes32',
      },
    ],
    name: 'IntegrityHashUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'consentId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'userId',
        type: 'uint256',
      },
    ],
    name: 'UserInvited',
    type: 'event',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'consents',
    outputs: [
      { internalType: 'uint256', name: 'id', type: 'uint256' },
      { internalType: 'bool', name: 'active', type: 'bool' },
      { internalType: 'uint256', name: 'creatorId', type: 'uint256' },
      { internalType: 'bytes32', name: 'integrityHash', type: 'bytes32' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'consentId', type: 'uint256' },
      { internalType: 'uint256', name: 'creatorId', type: 'uint256' },
      { internalType: 'string[]', name: 'creatorActivities', type: 'string[]' },
    ],
    name: 'createConsent',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'consentId', type: 'uint256' }],
    name: 'deleteConsent',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'consentId', type: 'uint256' },
      { internalType: 'uint256', name: 'userId', type: 'uint256' },
    ],
    name: 'getActivities',
    outputs: [{ internalType: 'string[]', name: '', type: 'string[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'consentId', type: 'uint256' },
      { internalType: 'uint256', name: 'userId', type: 'uint256' },
    ],
    name: 'getConsentUser',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'userId', type: 'uint256' },
          { internalType: 'enum Status', name: 'status', type: 'uint8' },
          { internalType: 'string[]', name: 'activities', type: 'string[]' },
        ],
        internalType: 'struct ConsentUser',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'consentId', type: 'uint256' }],
    name: 'getContentIntegrityHash',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'consentId', type: 'uint256' }],
    name: 'getUsers',
    outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'consentId', type: 'uint256' },
      { internalType: 'uint256', name: 'userId', type: 'uint256' },
      { internalType: 'string[]', name: 'activities', type: 'string[]' },
    ],
    name: 'joinConsent',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'consentId', type: 'uint256' },
      { internalType: 'uint256', name: 'userId', type: 'uint256' },
    ],
    name: 'rejectConsent',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'consentId', type: 'uint256' },
      { internalType: 'uint256', name: 'userId', type: 'uint256' },
    ],
    name: 'revokeConsent',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'consentId', type: 'uint256' },
      { internalType: 'uint256', name: 'userId', type: 'uint256' },
      { internalType: 'string[]', name: 'activities', type: 'string[]' },
    ],
    name: 'updateActivities',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
