import { ABI } from 'src/pkg/helpers/blockchainHelper';

export const CONTRACT_ABI: ABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_recycledMaterialContract',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'batchId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'ProductBatchCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'batchId',
        type: 'uint256',
      },
    ],
    name: 'ProductBatchDeleted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'batchId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'string',
        name: 'trackingCode',
        type: 'string',
      },
    ],
    name: 'ProductBatchUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'batchId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'quantity',
        type: 'uint256',
      },
    ],
    name: 'ProductBottlesRecycled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'productBatchId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'soldBatchId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'quantity',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'buyer',
        type: 'address',
      },
    ],
    name: 'ProductBottlesSold',
    type: 'event',
  },
  {
    inputs: [],
    name: 'contractOwner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'quantity', type: 'uint256' },
      { internalType: 'uint256', name: 'originBaseBatchId', type: 'uint256' },
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'string', name: 'createdAt', type: 'string' },
    ],
    name: 'createProductBottlesBatch',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'batchId', type: 'uint256' }],
    name: 'deleteTrackingCode',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'string', name: 'trackingCode', type: 'string' }],
    name: 'getProductBottleByCode',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'id', type: 'uint256' },
          { internalType: 'uint256', name: 'quantity', type: 'uint256' },
          {
            internalType: 'uint256',
            name: 'availableQuantity',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'originBaseBatchId',
            type: 'uint256',
          },
          { internalType: 'string', name: 'trackingCode', type: 'string' },
          { internalType: 'address', name: 'owner', type: 'address' },
          { internalType: 'string', name: 'createdAt', type: 'string' },
          { internalType: 'string', name: 'deletedAt', type: 'string' },
        ],
        internalType: 'struct ProductBottlesBatch',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256[]', name: 'indexes', type: 'uint256[]' }],
    name: 'getProductBottlesList',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'id', type: 'uint256' },
          { internalType: 'uint256', name: 'quantity', type: 'uint256' },
          {
            internalType: 'uint256',
            name: 'availableQuantity',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'originBaseBatchId',
            type: 'uint256',
          },
          { internalType: 'string', name: 'trackingCode', type: 'string' },
          { internalType: 'address', name: 'owner', type: 'address' },
          { internalType: 'string', name: 'createdAt', type: 'string' },
          { internalType: 'string', name: 'deletedAt', type: 'string' },
        ],
        internalType: 'struct ProductBottlesBatch[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'nextProductBatchId',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'nextSoldBatchId',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'id', type: 'uint256' }],
    name: 'productBottles',
    outputs: [
      { internalType: 'uint256', name: 'id', type: 'uint256' },
      { internalType: 'uint256', name: 'quantity', type: 'uint256' },
      { internalType: 'uint256', name: 'availableQuantity', type: 'uint256' },
      { internalType: 'uint256', name: 'originBaseBatchId', type: 'uint256' },
      { internalType: 'string', name: 'trackingCode', type: 'string' },
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'string', name: 'createdAt', type: 'string' },
      { internalType: 'string', name: 'deletedAt', type: 'string' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'batchId', type: 'uint256' },
      { internalType: 'uint256', name: 'quantity', type: 'uint256' },
    ],
    name: 'recycleProductBottles',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'batchId', type: 'uint256' }],
    name: 'rejectBaseBottles',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'batchId', type: 'uint256' },
      { internalType: 'uint256', name: 'quantity', type: 'uint256' },
      { internalType: 'address', name: 'buyer', type: 'address' },
      { internalType: 'string', name: 'createdAt', type: 'string' },
    ],
    name: 'sellProductBottle',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_baseBottlesBatchContract',
        type: 'address',
      },
    ],
    name: 'setBaseBottlesBatchContract',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'id', type: 'uint256' }],
    name: 'soldBottles',
    outputs: [
      { internalType: 'uint256', name: 'id', type: 'uint256' },
      { internalType: 'uint256', name: 'quantity', type: 'uint256' },
      {
        internalType: 'uint256',
        name: 'originProductBatchId',
        type: 'uint256',
      },
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'string', name: 'createdAt', type: 'string' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'string', name: 'trackingCode', type: 'string' }],
    name: 'trackingCodeToBatchId',
    outputs: [
      { internalType: 'uint256', name: 'productBatchId', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'batchId', type: 'uint256' },
      { internalType: 'string', name: 'code', type: 'string' },
    ],
    name: 'updateTrackingCode',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
