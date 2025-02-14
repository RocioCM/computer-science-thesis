// SPDX-License-Identifier: MIT

pragma solidity >=0.8.2 <0.9.0;

struct Bottle {
  uint256 weight;
  string color;
  uint256 thickness;
  string shapeType;
  string originLocation;
  string extraInfo;
  string composition;
}

struct BaseBottlesBatch {
  uint256 id;
  uint256 quantity;
  Bottle bottleType;
  address owner;
  uint256 soldQuantity;
  string createdAt;
  string deletedAt;
}

interface RecycledMaterialContract {
  function recycleBaseBottles(uint256 baseBatchId, uint256 quantity) external;
}

interface ProductBottlesBatchContract {
  function createProductBottlesBatch(
    uint256 quantity,
    uint256 originBatchId,
    address buyer,
    string memory createdAt
  ) external;
}

contract BaseBottlesBatchContract {
  mapping(uint256 id => BaseBottlesBatch) public baseBottlesBatches;
  uint256 public nextBatchId = 1;
  address public contractOwner;

  RecycledMaterialContract private recycledMaterialContract;
  ProductBottlesBatchContract private productBottlesBatchContract;

  event BaseBatchCreated(uint256 indexed batchId, address indexed owner);
  event BaseBatchUpdated(uint256 indexed batchId);
  event BaseBatchDeleted(uint256 indexed batchId);
  event BaseBottlesRecycled(uint256 indexed batchId, uint256 quantity);
  event BaseBottlesSold(
    uint256 indexed batchId,
    uint256 quantity,
    address buyer
  );
  event BaseBottlesSoldRejected(uint256 indexed batchId, uint256 quantity);

  modifier onlyContractOwner() {
    require(msg.sender == contractOwner, 'Unauthorized');
    _;
  }

  modifier onlyProductContract() {
    require(msg.sender == address(productBottlesBatchContract), 'Unauthorized');
    _;
  }

  constructor(
    address _productBottlesBatchContract,
    address _recycledMaterialContract
  ) {
    recycledMaterialContract = RecycledMaterialContract(
      _recycledMaterialContract
    );
    productBottlesBatchContract = ProductBottlesBatchContract(
      _productBottlesBatchContract
    );
    contractOwner = msg.sender;
  }

  function createBaseBottlesBatch(
    uint256 quantity,
    Bottle memory bottleType,
    address owner,
    string memory createdAt
  ) external onlyContractOwner {
    BaseBottlesBatch memory newBatch = BaseBottlesBatch({
      id: nextBatchId,
      quantity: quantity,
      bottleType: bottleType,
      owner: owner,
      soldQuantity: 0,
      createdAt: createdAt,
      deletedAt: ''
    });

    baseBottlesBatches[nextBatchId] = newBatch;
    emit BaseBatchCreated(nextBatchId, owner);
    nextBatchId++;
  }

  function updateBaseBottlesBatch(
    uint256 batchId,
    BaseBottlesBatch memory updatedBatch
  ) external onlyContractOwner {
    BaseBottlesBatch storage batch = baseBottlesBatches[batchId];
    require(bytes(batch.deletedAt).length == 0, 'Batch already deleted');

    batch.quantity = updatedBatch.quantity;
    batch.bottleType = updatedBatch.bottleType;
    emit BaseBatchUpdated(batchId);
  }

  function deleteBaseBottlesBatch(
    uint256 batchId,
    string memory deletedAt
  ) external onlyContractOwner {
    BaseBottlesBatch storage batch = baseBottlesBatches[batchId];
    require(bytes(batch.deletedAt).length == 0, 'Batch already deleted');

    baseBottlesBatches[batchId].deletedAt = deletedAt;
    emit BaseBatchDeleted(batchId);
  }

  function getBaseBottlesBatch(
    uint256 batchId
  ) external view returns (BaseBottlesBatch memory) {
    BaseBottlesBatch memory batch = baseBottlesBatches[batchId];
    require(batch.id != 0, 'Batch does not exist');

    return batch;
  }

  function getBaseBottlesList(
    uint256[] memory indexes
  ) external view returns (BaseBottlesBatch[] memory) {
    BaseBottlesBatch[] memory batches = new BaseBottlesBatch[](indexes.length);
    for (uint256 i = 0; i < indexes.length; i++) {
      batches[i] = baseBottlesBatches[indexes[i]];
    }
    return batches;
  }

  function recycleBaseBottles(
    uint256 batchId,
    uint256 quantity
  ) external onlyContractOwner {
    BaseBottlesBatch storage batch = baseBottlesBatches[batchId];
    require(
      batch.quantity - batch.soldQuantity >= quantity,
      'Insufficient quantity in batch'
    );
    require(bytes(batch.deletedAt).length == 0, 'Batch already deleted');

    batch.quantity -= quantity;
    recycledMaterialContract.recycleBaseBottles(batchId, quantity);
    emit BaseBottlesRecycled(batchId, quantity);
  }

  function sellBaseBottles(
    uint256 batchId,
    uint256 quantity,
    address buyer,
    string memory createdAt
  ) external onlyContractOwner {
    BaseBottlesBatch storage batch = baseBottlesBatches[batchId];
    require(
      batch.quantity - batch.soldQuantity >= quantity,
      'Insufficient quantity in batch'
    );
    require(bytes(batch.deletedAt).length == 0, 'Batch already deleted');

    batch.soldQuantity += quantity;
    productBottlesBatchContract.createProductBottlesBatch(
      quantity,
      batchId,
      buyer,
      createdAt
    );
    emit BaseBottlesSold(batchId, quantity, buyer);
  }

  function rejectSoldBaseBottles(
    uint256 batchId,
    uint256 quantity
  ) external onlyProductContract {
    BaseBottlesBatch storage batch = baseBottlesBatches[batchId];
    require(batch.soldQuantity >= quantity, 'Insufficient sold quantity');

    batch.soldQuantity -= quantity;
    emit BaseBottlesSoldRejected(batchId, quantity);
  }
}
