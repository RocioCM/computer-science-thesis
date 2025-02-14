// SPDX-License-Identifier: MIT

pragma solidity >=0.8.2 <0.9.0;

import '@openzeppelin/contracts/utils/Strings.sol';

struct WasteBottle {
  uint256 id;
  uint256 trackingCode;
  address owner;
  address creator;
  uint256 recycledBatchId;
  string createdAt;
  string deletedAt;
}

struct RecycledMaterialBatch {
  uint256 id;
  uint256 weight;
  string size;
  string materialType;
  string composition;
  string extraInfo;
  address buyerOwner;
  address creator;
  uint256[] wasteBottleIds;
  string createdAt;
  string deletedAt;
}

interface BaseBottlesBatchContract {
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

  function getBaseBottlesBatch(
    uint256 id
  ) external view returns (BaseBottlesBatch memory);
}

interface ProductBottlesBatchContract {}

contract RecycledMaterialContract {
  address public contractOwner;
  mapping(uint256 id => WasteBottle) public wasteBottles;
  uint256 public nextWasteBottleId = 1;
  mapping(uint256 id => RecycledMaterialBatch) public recycledMaterials;
  uint256 public nextRecycledMaterialBatchId = 1;

  BaseBottlesBatchContract private baseBottlesBatchContract;
  ProductBottlesBatchContract private productBottlesBatchContract;

  modifier onlyContractOwner() {
    require(msg.sender == contractOwner, 'Unauthorized');
    _;
  }

  modifier onlyBaseOrProductContract() {
    require(
      msg.sender == address(baseBottlesBatchContract) ||
        msg.sender == address(productBottlesBatchContract),
      'Unauthorized'
    );
    _;
  }

  modifier onlyContractOwnerOrSelf() {
    require(
      msg.sender == contractOwner || msg.sender == address(this),
      'Unauthorized'
    );
    _;
  }

  constructor() {
    contractOwner = msg.sender;
  }

  event WasteBottleCreated(uint256 indexed bottleId, address indexed owner);
  event WasteBottleUpdated(
    uint256 indexed bottleId,
    uint256 trackingCode,
    uint256 recycledBatchId
  );
  event WasteBottleDeleted(uint256 indexed bottleId);
  event RecycledMaterialBatchCreated(
    uint256 indexed batchId,
    address indexed creator
  );
  event RecycledMaterialBatchUpdated(uint256 indexed batchId);
  event RecycledMaterialBatchDeleted(uint256 indexed batchId);

  function setBaseBottlesBatchContract(
    address _baseBottlesBatchContract
  ) external onlyContractOwner {
    baseBottlesBatchContract = BaseBottlesBatchContract(
      _baseBottlesBatchContract
    );
  }

  function setProductBottlesBatchContract(
    address _productBottlesBatchContract
  ) external onlyContractOwner {
    productBottlesBatchContract = ProductBottlesBatchContract(
      _productBottlesBatchContract
    );
  }

  function createWasteBottle(
    uint256 trackingCode,
    address owner,
    address creator,
    string memory createdAt
  ) external onlyContractOwner {
    WasteBottle memory newWasteBottle = WasteBottle(
      nextWasteBottleId,
      trackingCode,
      owner,
      creator,
      0,
      createdAt,
      ''
    );
    wasteBottles[nextWasteBottleId] = newWasteBottle;
    emit WasteBottleCreated(nextWasteBottleId, owner);
    nextWasteBottleId++;
  }

  function deleteWasteBottle(
    uint256 bottleId,
    string memory deletedAt
  ) external onlyContractOwner {
    WasteBottle storage bottle = wasteBottles[bottleId];
    require(bottle.id != 0, 'Bottle does not exist');
    require(bytes(bottle.deletedAt).length == 0, 'Bottle already deleted');
    require(bottle.recycledBatchId == 0, 'Bottle already recycled');

    wasteBottles[bottleId].deletedAt = deletedAt;
    emit WasteBottleDeleted(bottleId);
  }

  function createRecycledMaterialBatch(
    uint256 weight,
    string memory size,
    string memory materialType,
    string memory composition,
    string memory extraInfo,
    address creator,
    string memory createdAt
  ) public onlyContractOwnerOrSelf {
    RecycledMaterialBatch
      memory newRecycledMaterialBatch = RecycledMaterialBatch(
        nextRecycledMaterialBatchId,
        weight,
        size,
        materialType,
        composition,
        extraInfo,
        address(0),
        creator,
        new uint256[](0),
        createdAt,
        ''
      );
    recycledMaterials[nextRecycledMaterialBatchId] = newRecycledMaterialBatch;
    emit RecycledMaterialBatchCreated(nextRecycledMaterialBatchId, creator);
    nextRecycledMaterialBatchId++;
  }

  function addWasteBottleToBatch(
    uint256 batchId,
    uint256 bottleId
  ) external onlyContractOwner {
    RecycledMaterialBatch storage batch = recycledMaterials[batchId];
    WasteBottle storage bottle = wasteBottles[bottleId];
    require(batch.id != 0, 'Batch does not exist');
    require(bottle.id != 0, 'Bottle does not exist');
    require(bottle.recycledBatchId == 0, 'Bottle already recycled');
    bottle.recycledBatchId = batchId;
    batch.wasteBottleIds.push(bottleId);
  }

  function removeWasteBottleFromBatch(
    uint256 batchId,
    uint256 bottleId
  ) external onlyContractOwner {
    RecycledMaterialBatch storage batch = recycledMaterials[batchId];
    WasteBottle storage bottle = wasteBottles[bottleId];
    require(batch.id != 0, 'Batch does not exist');
    require(bottle.id != 0, 'Bottle does not exist');
    require(bottle.recycledBatchId == batchId, 'Bottle not in batch');
    bottle.recycledBatchId = 0;
    uint256[] memory newWasteBottleIds = new uint256[](
      batch.wasteBottleIds.length - 1
    );
    uint256 j = 0;
    for (uint256 i = 0; i < batch.wasteBottleIds.length; i++) {
      if (batch.wasteBottleIds[i] != bottleId) {
        newWasteBottleIds[j] = batch.wasteBottleIds[i];
        j++;
      }
    }
    batch.wasteBottleIds = newWasteBottleIds;
  }

  function updateRecycledMaterialBatch(
    uint256 batchId,
    uint256 weight,
    string memory size,
    string memory materialType,
    string memory composition,
    string memory extraInfo
  ) external onlyContractOwner {
    RecycledMaterialBatch storage batch = recycledMaterials[batchId];
    require(batch.id != 0, 'Batch does not exist');
    require(bytes(batch.deletedAt).length == 0, 'Batch already deleted');
    require(batch.buyerOwner == address(0), 'Batch already sold');

    batch.weight = weight;
    batch.size = size;
    batch.materialType = materialType;
    batch.composition = composition;
    batch.extraInfo = extraInfo;
    emit RecycledMaterialBatchUpdated(batchId);
  }

  function deleteRecycledMaterialBatch(
    uint256 batchId,
    string memory deletedAt
  ) external onlyContractOwner {
    RecycledMaterialBatch storage batch = recycledMaterials[batchId];
    require(batch.id != 0, 'Batch does not exist');
    require(bytes(batch.deletedAt).length == 0, 'Batch already deleted');
    require(batch.buyerOwner == address(0), 'Batch already sold');

    batch.deletedAt = deletedAt;
    emit RecycledMaterialBatchDeleted(batchId);
  }

  function getWasteBottlesList(
    uint256[] memory indexes
  ) external view returns (WasteBottle[] memory) {
    WasteBottle[] memory bottles = new WasteBottle[](indexes.length);
    for (uint256 i = 0; i < indexes.length; i++) {
      bottles[i] = wasteBottles[indexes[i]];
    }
    return bottles;
  }

  function getWasteBottleIdsForBatch(
    uint256 batchId
  ) external view returns (uint256[] memory) {
    RecycledMaterialBatch storage batch = recycledMaterials[batchId];
    return batch.wasteBottleIds;
  }

  function getRecycledMaterialBatchesList(
    uint256[] memory indexes
  ) external view returns (RecycledMaterialBatch[] memory) {
    RecycledMaterialBatch[] memory batches = new RecycledMaterialBatch[](
      indexes.length
    );
    for (uint256 i = 0; i < indexes.length; i++) {
      batches[i] = recycledMaterials[indexes[i]];
    }
    return batches;
  }

  function recycleBaseBottles(
    uint256 baseBatchId,
    uint256 quantity
  ) external onlyBaseOrProductContract {
    BaseBottlesBatchContract.BaseBottlesBatch
      memory baseBatch = baseBottlesBatchContract.getBaseBottlesBatch(
        baseBatchId
      );

    uint256 newRecycledBatchId = nextRecycledMaterialBatchId;
    this.createRecycledMaterialBatch(
      quantity * baseBatch.bottleType.weight,
      string.concat(Strings.toString(quantity), ' bottles'),
      string.concat(baseBatch.bottleType.color, ' glass'),
      baseBatch.bottleType.composition,
      baseBatch.bottleType.extraInfo,
      baseBatch.owner,
      baseBatch.createdAt
    );
    this.sellRecycledMaterialBatch(newRecycledBatchId, baseBatch.owner);
  }

  function sellRecycledMaterialBatch(
    uint256 batchId,
    address buyerOwner
  ) external onlyContractOwnerOrSelf {
    RecycledMaterialBatch storage batch = recycledMaterials[batchId];
    require(batch.id != 0, 'Batch does not exist');
    require(bytes(batch.deletedAt).length == 0, 'Batch already deleted');
    require(batch.buyerOwner == address(0), 'Batch already sold');
    recycledMaterials[batchId].buyerOwner = buyerOwner;
  }
}
