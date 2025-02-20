// SPDX-License-Identifier: MIT

pragma solidity >=0.8.2 <0.9.0;

struct ProductBottlesBatch {
  uint256 id;
  uint256 quantity;
  uint256 availableQuantity;
  uint256 originBaseBatchId;
  string trackingCode;
  address owner;
  string createdAt;
  string deletedAt;
}

struct SoldProductBatch {
  uint256 id;
  uint256 quantity;
  uint256 originProductBatchId;
  address owner;
  string createdAt;
}

interface BaseBottlesBatchContract {
  function rejectSoldBaseBottles(uint256 batchId, uint256 quantity) external;
}

interface RecycledMaterialContract {
  function recycleBaseBottles(uint256 baseBatchId, uint256 quantity) external;
}

contract ProductBottlesBatchContract {
  address public contractOwner;
  mapping(uint256 id => ProductBottlesBatch) public productBottles;
  uint256 public nextProductBatchId = 1;
  mapping(uint256 id => SoldProductBatch) public soldBottles;
  uint256 public nextSoldBatchId = 1;
  mapping(string trackingCode => uint256 productBatchId)
    public trackingCodeToBatchId;

  BaseBottlesBatchContract private baseBottlesBatchContract;
  RecycledMaterialContract private recycledMaterialContract;

  event ProductBatchCreated(uint256 indexed batchId, address indexed owner);
  event ProductBatchUpdated(
    uint256 indexed batchId,
    string indexed trackingCode
  );
  event ProductBatchDeleted(uint256 indexed batchId);
  event ProductBottlesRecycled(uint256 indexed batchId, uint256 quantity);
  event ProductBottlesSold(
    uint256 indexed batchId,
    uint256 quantity,
    address buyer
  );

  modifier onlyContractOwner() {
    require(msg.sender == contractOwner, 'Unauthorized');
    _;
  }

  modifier onlyAuthorizedCreator() {
    require(
      msg.sender == contractOwner ||
        msg.sender == address(baseBottlesBatchContract),
      'Unauthorized'
    );
    _;
  }

  constructor(address _recycledMaterialContract) {
    recycledMaterialContract = RecycledMaterialContract(
      _recycledMaterialContract
    );
    contractOwner = msg.sender;
  }

  function setBaseBottlesBatchContract(
    address _baseBottlesBatchContract
  ) external onlyContractOwner {
    baseBottlesBatchContract = BaseBottlesBatchContract(
      _baseBottlesBatchContract
    );
  }

  function createProductBottlesBatch(
    uint256 quantity,
    uint256 originBaseBatchId,
    address owner,
    string memory createdAt
  ) external onlyAuthorizedCreator {
    ProductBottlesBatch memory newProductBatch = ProductBottlesBatch({
      id: nextProductBatchId,
      quantity: quantity,
      availableQuantity: quantity,
      originBaseBatchId: originBaseBatchId,
      trackingCode: '',
      owner: owner,
      createdAt: createdAt,
      deletedAt: ''
    });

    productBottles[nextProductBatchId] = newProductBatch;
    emit ProductBatchCreated(nextProductBatchId, owner);
    nextProductBatchId++;
  }

  function updateTrackingCode(
    uint256 batchId,
    string memory code
  ) external onlyContractOwner {
    ProductBottlesBatch storage productBatch = productBottles[batchId];
    require(productBatch.id != 0, 'Product batch does not exist');
    require(
      bytes(productBatch.deletedAt).length == 0,
      'Product batch already deleted'
    );
    require(
      productBatch.availableQuantity == productBatch.quantity,
      'Product batch already sold'
    );
    require(trackingCodeToBatchId[code] == 0, 'Tracking code already in use');

    if (bytes(productBatch.trackingCode).length > 0) {
      // If the product batch already has a tracking code, remove it from the mapping.
      trackingCodeToBatchId[productBatch.trackingCode] = 0;
    }

    // Update the tracking code and add it to the mapping.
    productBottles[batchId].trackingCode = code;
    trackingCodeToBatchId[code] = batchId;
    emit ProductBatchUpdated(batchId, code);
  }

  function deleteTrackingCode(uint256 batchId) external onlyContractOwner {
    ProductBottlesBatch storage productBatch = productBottles[batchId];
    require(productBatch.id != 0, 'Product batch does not exist');
    require(
      productBatch.availableQuantity == productBatch.quantity,
      'Product batch already sold'
    );
    require(
      bytes(productBatch.deletedAt).length == 0,
      'Product batch already deleted'
    );

    // Remove the tracking code from the mapping.
    trackingCodeToBatchId[productBatch.trackingCode] = 0;
    productBottles[batchId].trackingCode = '';
    emit ProductBatchUpdated(batchId, '');
  }

  function getProductBottlesList(
    uint256[] memory indexes
  ) external view returns (ProductBottlesBatch[] memory) {
    ProductBottlesBatch[] memory batches = new ProductBottlesBatch[](
      indexes.length
    );
    for (uint256 i = 0; i < indexes.length; i++) {
      batches[i] = productBottles[indexes[i]];
    }
    return batches;
  }

  function rejectBaseBottles(uint256 batchId) external onlyContractOwner {
    ProductBottlesBatch storage productBatch = productBottles[batchId];
    require(
      bytes(productBatch.deletedAt).length == 0,
      'Product batch already deleted'
    );
    productBottles[batchId].deletedAt = productBatch.createdAt;

    baseBottlesBatchContract.rejectSoldBaseBottles(
      productBatch.originBaseBatchId,
      productBatch.quantity
    );
    emit ProductBatchDeleted(batchId);
  }

  function recycleProductBottles(
    uint256 batchId,
    uint256 quantity
  ) external onlyContractOwner {
    ProductBottlesBatch storage productBatch = productBottles[batchId];
    require(
      productBatch.availableQuantity >= quantity,
      'Insufficient quantity in batch'
    );
    require(
      bytes(productBatch.deletedAt).length == 0,
      'Product batch already deleted'
    );

    recycledMaterialContract.recycleBaseBottles(
      productBatch.originBaseBatchId,
      quantity
    );
    productBottles[batchId].quantity -= quantity;
    productBottles[batchId].availableQuantity -= quantity;
    emit ProductBottlesRecycled(batchId, quantity);
  }

  function sellProductBottle(
    uint256 batchId,
    uint256 quantity,
    address buyer,
    string memory createdAt
  ) external onlyContractOwner {
    ProductBottlesBatch storage productBatch = productBottles[batchId];
    require(
      productBatch.availableQuantity >= quantity,
      'Insufficient quantity in batch'
    );
    require(
      bytes(productBatch.deletedAt).length == 0,
      'Product batch already deleted'
    );

    productBottles[batchId].availableQuantity -= quantity;
    soldBottles[nextSoldBatchId] = SoldProductBatch({
      id: nextSoldBatchId,
      quantity: quantity,
      originProductBatchId: batchId,
      owner: buyer,
      createdAt: createdAt
    });
    nextSoldBatchId++;
    emit ProductBottlesSold(batchId, quantity, buyer);
  }

  function getProductBottleByCode(
    string memory trackingCode
  ) external view returns (ProductBottlesBatch memory) {
    uint256 batchId = trackingCodeToBatchId[trackingCode];
    require(batchId != 0, 'Product batch does not exist');
    return productBottles[batchId];
  }
}
