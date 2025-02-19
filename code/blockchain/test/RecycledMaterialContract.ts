import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Signer } from 'ethers';
import { BaseBottlesBatchContract } from '../typechain/contracts/BaseBottlesBatchContract.sol/BaseBottlesBatchContract';
import { RecycledMaterialContract } from '../typechain/contracts/RecycledMaterialContract.sol/RecycledMaterialContract';
import { deployAllContracts } from './utils';

describe('RecycledMaterialContract', function () {
  let recycleContract: RecycledMaterialContract;
  let baseBatchContract: BaseBottlesBatchContract;
  let owner: Signer;
  let addr1: Signer;
  let addr2: Signer;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const contracts = await deployAllContracts();
    recycleContract = contracts.recycleContract;
    baseBatchContract = contracts.baseBatchContract;
  });

  describe('Deployment', function () {
    it('Should set the right owner', async function () {
      expect(await recycleContract.contractOwner()).to.equal(
        await owner.getAddress(),
      );
    });

    it('Should revert when setting base batch contract address from non-owner', async function () {
      const contractAddress = await baseBatchContract.getAddress();
      await expect(
        recycleContract
          .connect(addr1)
          .setBaseBottlesBatchContract(contractAddress),
      ).to.be.revertedWith('Unauthorized');
    });

    it('Should revert when setting product batch contract address from non-owner', async function () {
      const contractAddress = await baseBatchContract.getAddress();
      await expect(
        recycleContract
          .connect(addr1)
          .setProductBottlesBatchContract(contractAddress),
      ).to.be.revertedWith('Unauthorized');
    });
  });

  describe('createWasteBottle', function () {
    it('Should create a new WasteBottle', async function () {
      const trackingCode = '12345';
      const bottleOwner = await addr1.getAddress();
      const creator = await addr2.getAddress();
      const createdAt = '2025-01-01T00:00:00';

      const tx = await recycleContract.createWasteBottle(
        trackingCode,
        bottleOwner,
        creator,
        createdAt,
      );

      const expectedBottleId = 1;
      await expect(tx)
        .to.emit(recycleContract, 'WasteBottleCreated')
        .withArgs(expectedBottleId, bottleOwner);

      const bottle = await recycleContract.wasteBottles(expectedBottleId);
      expect(bottle.id).to.equal(expectedBottleId);
      expect(bottle.trackingCode).to.equal(trackingCode);
      expect(bottle.owner).to.equal(bottleOwner);
      expect(bottle.creator).to.equal(creator);
      expect(bottle.recycledBatchId).to.equal(0);
      expect(bottle.createdAt).to.equal(createdAt);
      expect(bottle.deletedAt).to.equal('');
    });

    it('Should revert when creating WasteBottle by non-owner', async function () {
      const trackingCode = '12345';
      const bottleOwner = await addr1.getAddress();
      const creator = await addr2.getAddress();
      const createdAt = '2025-01-01T00:00:00';

      await expect(
        recycleContract
          .connect(addr1)
          .createWasteBottle(trackingCode, bottleOwner, creator, createdAt),
      ).to.be.revertedWith('Unauthorized');
    });
  });

  describe('deleteWasteBottle', function () {
    beforeEach(async function () {
      // Create a WasteBottle for deletion
      const trackingCode = '12345';
      const bottleOwner = await addr1.getAddress();
      const creator = await addr2.getAddress();
      const createdAt = '2025-01-01T00:00:00';

      await recycleContract.createWasteBottle(
        trackingCode,
        bottleOwner,
        creator,
        createdAt,
      );
    });

    it('Should delete an existing WasteBottle', async function () {
      const bottleId = 1;
      const deletedAt = '2025-02-02T00:00:00';

      const tx = await recycleContract.deleteWasteBottle(bottleId, deletedAt);
      await expect(tx)
        .to.emit(recycleContract, 'WasteBottleDeleted')
        .withArgs(bottleId);

      const bottle = await recycleContract.wasteBottles(bottleId);
      expect(bottle.deletedAt).to.equal(deletedAt);
    });

    it('Should revert when deleting a non-existent WasteBottle', async function () {
      const nonExistentBottleId = 999;
      const deletedAt = '2025-02-02T00:00:00';

      await expect(
        recycleContract.deleteWasteBottle(nonExistentBottleId, deletedAt),
      ).to.be.revertedWith('Bottle does not exist');
    });

    it('Should revert when deleting an already deleted WasteBottle', async function () {
      const bottleId = 1;
      const deletedAt = '2025-02-02T00:00:00';

      // Delete the bottle for the first time
      await recycleContract.deleteWasteBottle(bottleId, deletedAt);

      // Attempt to delete the bottle again
      await expect(
        recycleContract.deleteWasteBottle(bottleId, '2025-03-03T00:00:00'),
      ).to.be.revertedWith('Bottle already deleted');
    });

    it('Should revert when deleting a recycled WasteBottle', async function () {
      const bottleId = 1;
      const deletedAt = '2025-02-02T00:00:00';

      // Create a RecycledMaterialBatch and recycle the bottle
      await recycleContract.createRecycledMaterialBatch(
        500,
        'Large',
        'Glass',
        'Silica',
        'Extra Info',
        await addr2.getAddress(),
        '2025-01-01T00:00:00',
      );
      await recycleContract.addWasteBottleToBatch(1, bottleId);

      // Attempt to delete the recycled bottle
      await expect(
        recycleContract.deleteWasteBottle(bottleId, deletedAt),
      ).to.be.revertedWith('Bottle already recycled');
    });

    it('Should revert when deleting a WasteBottle from an unauthorized account', async function () {
      const bottleId = 1;
      const deletedAt = '2025-02-02T00:00:00';

      await expect(
        recycleContract.connect(addr1).deleteWasteBottle(bottleId, deletedAt),
      ).to.be.revertedWith('Unauthorized');
    });
  });

  describe('createRecycledMaterialBatch', function () {
    it('Should create a new RecycledMaterialBatch', async function () {
      const weight = 500;
      const size = 'Medium';
      const materialType = 'Plastic';
      const composition = 'Polyethylene';
      const extraInfo = 'Recycled from bottles';
      const creator = await addr1.getAddress();
      const createdAt = '2025-01-01T00:00:00';

      const tx = await recycleContract.createRecycledMaterialBatch(
        weight,
        size,
        materialType,
        composition,
        extraInfo,
        creator,
        createdAt,
      );

      const expectedBatchId = 1;
      await expect(tx)
        .to.emit(recycleContract, 'RecycledMaterialBatchCreated')
        .withArgs(expectedBatchId, creator);

      const batch = await recycleContract.recycledMaterials(expectedBatchId);
      expect(batch.id).to.equal(expectedBatchId);
      expect(batch.weight).to.equal(weight);
      expect(batch.size).to.equal(size);
      expect(batch.materialType).to.equal(materialType);
      expect(batch.composition).to.equal(composition);
      expect(batch.extraInfo).to.equal(extraInfo);
      expect(batch.buyerOwner).to.equal(ethers.ZeroAddress);
      expect(batch.creator).to.equal(creator);
      expect(batch.createdAt).to.equal(createdAt);
      expect(batch.deletedAt).to.equal('');
      const wasteBottleIds = await recycleContract.getWasteBottleIdsForBatch(
        expectedBatchId,
      );
      expect(wasteBottleIds.length).to.equal(0);
    });

    it('Should revert when creating RecycledMaterialBatch by non-owner', async function () {
      const weight = 500;
      const size = 'Medium';
      const materialType = 'Plastic';
      const composition = 'Polyethylene';
      const extraInfo = 'Recycled from bottles';
      const creator = await addr1.getAddress();
      const createdAt = '2025-01-01T00:00:00';

      await expect(
        recycleContract
          .connect(addr1)
          .createRecycledMaterialBatch(
            weight,
            size,
            materialType,
            composition,
            extraInfo,
            creator,
            createdAt,
          ),
      ).to.be.revertedWith('Unauthorized');
    });
  });

  describe('addWasteBottleToBatch', function () {
    beforeEach(async function () {
      // Create a WasteBottle and a RecycledMaterialBatch
      const trackingCode = '12345;';
      const bottleOwner = await addr1.getAddress();
      const creator = await addr2.getAddress();
      const createdAt = '2025-01-01T00:00:00';

      await recycleContract.createWasteBottle(
        trackingCode,
        bottleOwner,
        creator,
        createdAt,
      );

      await recycleContract.createRecycledMaterialBatch(
        500,
        'Large',
        'Glass',
        'Silica',
        'Extra Info',
        creator,
        createdAt,
      );
    });

    it('Should add a WasteBottle to a RecycledMaterialBatch', async function () {
      const batchId = 1;
      const bottleId = 1;

      const tx = await recycleContract.addWasteBottleToBatch(batchId, bottleId);
      await expect(tx).to.not.be.reverted;

      const bottle = await recycleContract.wasteBottles(bottleId);
      expect(bottle.recycledBatchId).to.equal(batchId);

      const batch = await recycleContract.recycledMaterials(batchId);
      const wasteBottleIds = await recycleContract.getWasteBottleIdsForBatch(
        batchId,
      );
      expect(wasteBottleIds.length).to.equal(1);
      expect(wasteBottleIds[0]).to.equal(bottleId);
    });

    it('Should revert when adding a WasteBottle to a non-existent batch', async function () {
      const nonExistentBatchId = 999;
      const bottleId = 1;

      await expect(
        recycleContract.addWasteBottleToBatch(nonExistentBatchId, bottleId),
      ).to.be.revertedWith('Batch does not exist');
    });

    it('Should revert when adding a non-existent WasteBottle to a batch', async function () {
      const batchId = 1;
      const nonExistentBottleId = 999;

      await expect(
        recycleContract.addWasteBottleToBatch(batchId, nonExistentBottleId),
      ).to.be.revertedWith('Bottle does not exist');
    });

    it('Should revert when adding a already recycled WasteBottle to a batch', async function () {
      const batchId = 1;
      const bottleId = 1;

      // Add the bottle to the batch for the first time
      await recycleContract.addWasteBottleToBatch(batchId, bottleId);

      // Attempt to add the same bottle again
      await expect(
        recycleContract.addWasteBottleToBatch(batchId, bottleId),
      ).to.be.revertedWith('Bottle already recycled');
    });

    it('Should revert when adding WasteBottle to a batch from an unauthorized account', async function () {
      const batchId = 1;
      const bottleId = 1;

      await expect(
        recycleContract.connect(addr1).addWasteBottleToBatch(batchId, bottleId),
      ).to.be.revertedWith('Unauthorized');
    });
  });

  describe('removeWasteBottleFromBatch', function () {
    beforeEach(async function () {
      // Create a WasteBottle and a RecycledMaterialBatch, then add the bottle to the batch
      const trackingCode = '12345';
      const bottleOwner = await addr1.getAddress();
      const creator = await addr2.getAddress();
      const createdAt = '2025-01-01T00:00:00';

      await recycleContract.createWasteBottle(
        trackingCode,
        bottleOwner,
        creator,
        createdAt,
      );

      await recycleContract.createRecycledMaterialBatch(
        500,
        'Large',
        'Glass',
        'Silica',
        'Extra Info',
        creator,
        createdAt,
      );

      await recycleContract.addWasteBottleToBatch(1, 1);
    });

    it('Should remove a WasteBottle from a RecycledMaterialBatch', async function () {
      const batchId = 1;
      const bottleId = 1;

      // Create a second WasteBottle and then add the bottle to the batch.
      const trackingCode = '12345';
      const bottleOwner = await addr1.getAddress();
      const creator = await addr2.getAddress();
      const createdAt = '2025-01-01T00:00:00';

      await recycleContract.createWasteBottle(
        trackingCode,
        bottleOwner,
        creator,
        createdAt,
      );
      await recycleContract.addWasteBottleToBatch(1, 2);

      const tx = await recycleContract.removeWasteBottleFromBatch(
        batchId,
        bottleId,
      );
      await expect(tx).to.not.be.reverted;

      const bottle = await recycleContract.wasteBottles(bottleId);
      expect(bottle.recycledBatchId).to.equal(0);

      const wasteBottleIds = await recycleContract.getWasteBottleIdsForBatch(
        batchId,
      );
      expect(wasteBottleIds.length).to.equal(1);

      const recyclingBatchBottles =
        await recycleContract.getWasteBottleIdsForBatch(1);
      expect(recyclingBatchBottles.length).to.be.equal(1);
      expect(recyclingBatchBottles[0]).to.be.equal(2);
    });

    it('Should revert when removing a WasteBottle from a non-existent batch', async function () {
      const nonExistentBatchId = 999;
      const bottleId = 1;

      await expect(
        recycleContract.removeWasteBottleFromBatch(
          nonExistentBatchId,
          bottleId,
        ),
      ).to.be.revertedWith('Batch does not exist');
    });

    it('Should revert when removing a non-existent WasteBottle from a batch', async function () {
      const batchId = 1;
      const nonExistentBottleId = 999;

      await expect(
        recycleContract.removeWasteBottleFromBatch(
          batchId,
          nonExistentBottleId,
        ),
      ).to.be.revertedWith('Bottle does not exist');
    });

    it('Should revert when removing a WasteBottle that is not in the batch', async function () {
      const batchId = 1;
      const bottleId = 1;

      // Remove the bottle for the first time
      await recycleContract.removeWasteBottleFromBatch(batchId, bottleId);

      // Attempt to remove the same bottle again
      await expect(
        recycleContract.removeWasteBottleFromBatch(batchId, bottleId),
      ).to.be.revertedWith('Bottle not in batch');
    });

    it('Should revert when removing a WasteBottle from an unauthorized account', async function () {
      const batchId = 1;
      const bottleId = 1;

      await expect(
        recycleContract
          .connect(addr1)
          .removeWasteBottleFromBatch(batchId, bottleId),
      ).to.be.revertedWith('Unauthorized');
    });
  });

  describe('updateRecycledMaterialBatch', function () {
    beforeEach(async function () {
      // Create a RecycledMaterialBatch for updating
      const weight = 500;
      const size = 'Large';
      const materialType = 'Glass';
      const composition = 'Silica';
      const extraInfo = 'Extra Info';
      const creator = await addr1.getAddress();
      const createdAt = '2025-01-01T00:00:00';

      await recycleContract.createRecycledMaterialBatch(
        weight,
        size,
        materialType,
        composition,
        extraInfo,
        creator,
        createdAt,
      );
    });

    it('Should update an existing RecycledMaterialBatch', async function () {
      const batchId = 1;
      const newWeight = 600;
      const newSize = 'Extra Large';
      const newMaterialType = 'Plastic';
      const newComposition = 'Polyethylene';
      const newExtraInfo = 'Updated Extra Info';

      const tx = await recycleContract.updateRecycledMaterialBatch(
        batchId,
        newWeight,
        newSize,
        newMaterialType,
        newComposition,
        newExtraInfo,
      );
      await expect(tx)
        .to.emit(recycleContract, 'RecycledMaterialBatchUpdated')
        .withArgs(batchId);

      const batch = await recycleContract.recycledMaterials(batchId);
      expect(batch.weight).to.equal(newWeight);
      expect(batch.size).to.equal(newSize);
      expect(batch.materialType).to.equal(newMaterialType);
      expect(batch.composition).to.equal(newComposition);
      expect(batch.extraInfo).to.equal(newExtraInfo);
    });

    it('Should revert when updating a non-existent RecycledMaterialBatch', async function () {
      const nonExistentBatchId = 999;
      const newWeight = 600;
      const newSize = 'Extra Large';
      const newMaterialType = 'Plastic';
      const newComposition = 'Polyethylene';
      const newExtraInfo = 'Updated Extra Info';

      await expect(
        recycleContract.updateRecycledMaterialBatch(
          nonExistentBatchId,
          newWeight,
          newSize,
          newMaterialType,
          newComposition,
          newExtraInfo,
        ),
      ).to.be.revertedWith('Batch does not exist');
    });

    it('Should revert when updating a deleted RecycledMaterialBatch', async function () {
      const batchId = 1;
      const newWeight = 600;
      const newSize = 'Extra Large';
      const newMaterialType = 'Plastic';
      const newComposition = 'Polyethylene';
      const newExtraInfo = 'Updated Extra Info';
      const deletedAt = '2025-02-02T00:00:00';

      // Delete the batch
      await recycleContract.deleteRecycledMaterialBatch(batchId, deletedAt);

      await expect(
        recycleContract.updateRecycledMaterialBatch(
          batchId,
          newWeight,
          newSize,
          newMaterialType,
          newComposition,
          newExtraInfo,
        ),
      ).to.be.revertedWith('Batch already deleted');
    });

    it('Should revert when updating a sold RecycledMaterialBatch', async function () {
      const batchId = 1;
      const newWeight = 600;
      const newSize = 'Extra Large';
      const newMaterialType = 'Plastic';
      const newComposition = 'Polyethylene';
      const newExtraInfo = 'Updated Extra Info';
      const buyerOwner = await addr2.getAddress();

      // Sell the batch
      await recycleContract.sellRecycledMaterialBatch(batchId, buyerOwner);

      await expect(
        recycleContract.updateRecycledMaterialBatch(
          batchId,
          newWeight,
          newSize,
          newMaterialType,
          newComposition,
          newExtraInfo,
        ),
      ).to.be.revertedWith('Batch already sold');
    });

    it('Should revert when deleting from an unauthorized account', async function () {
      const batchId = 1;
      const newWeight = 600;
      const newSize = 'Extra Large';
      const newMaterialType = 'Plastic';
      const newComposition = 'Polyethylene';
      const newExtraInfo = 'Updated Extra Info';

      await expect(
        recycleContract
          .connect(addr1)
          .updateRecycledMaterialBatch(
            batchId,
            newWeight,
            newSize,
            newMaterialType,
            newComposition,
            newExtraInfo,
          ),
      ).to.be.revertedWith('Unauthorized');
    });
  });

  describe('deleteRecycledMaterialBatch', function () {
    beforeEach(async function () {
      // Create a RecycledMaterialBatch for deletion
      const weight = 500;
      const size = 'Large';
      const materialType = 'Glass';
      const composition = 'Silica';
      const extraInfo = 'Extra Info';
      const creator = await addr1.getAddress();
      const createdAt = '2025-01-01T00:00:00';

      await recycleContract.createRecycledMaterialBatch(
        weight,
        size,
        materialType,
        composition,
        extraInfo,
        creator,
        createdAt,
      );
    });

    it('Should delete an existing RecycledMaterialBatch', async function () {
      const batchId = 1;
      const deletedAt = '2025-02-02T00:00:00';

      const tx = await recycleContract.deleteRecycledMaterialBatch(
        batchId,
        deletedAt,
      );
      await expect(tx)
        .to.emit(recycleContract, 'RecycledMaterialBatchDeleted')
        .withArgs(batchId);

      const batch = await recycleContract.recycledMaterials(batchId);
      expect(batch.deletedAt).to.equal(deletedAt);
    });

    it('Should revert when deleting a non-existent RecycledMaterialBatch', async function () {
      const nonExistentBatchId = 999;
      const deletedAt = '2025-02-02T00:00:00';

      await expect(
        recycleContract.deleteRecycledMaterialBatch(
          nonExistentBatchId,
          deletedAt,
        ),
      ).to.be.revertedWith('Batch does not exist');
    });

    it('Should revert when deleting an already deleted RecycledMaterialBatch', async function () {
      const batchId = 1;
      const deletedAt = '2025-02-02T00:00:00';

      // Delete the batch for the first time
      await recycleContract.deleteRecycledMaterialBatch(batchId, deletedAt);

      // Attempt to delete the batch again
      await expect(
        recycleContract.deleteRecycledMaterialBatch(
          batchId,
          '2025-03-03T00:00:00',
        ),
      ).to.be.revertedWith('Batch already deleted');
    });

    it('Should revert when deleting a sold RecycledMaterialBatch', async function () {
      const batchId = 1;
      const deletedAt = '2025-02-02T00:00:00';
      const buyerOwner = await addr2.getAddress();

      // Sell the batch
      await recycleContract.sellRecycledMaterialBatch(batchId, buyerOwner);

      await expect(
        recycleContract.deleteRecycledMaterialBatch(batchId, deletedAt),
      ).to.be.revertedWith('Batch already sold');
    });

    it('Should revert when deleting from an unauthorized account', async function () {
      const batchId = 1;
      const deletedAt = '2025-02-02T00:00:00';

      await expect(
        recycleContract
          .connect(addr1)
          .deleteRecycledMaterialBatch(batchId, deletedAt),
      ).to.be.revertedWith('Unauthorized');
    });
  });

  describe('getWasteBottlesList', function () {
    it('Should retrieve a list of WasteBottles', async function () {
      // Create multiple WasteBottles
      await recycleContract.createWasteBottle(
        '12345',
        await addr1.getAddress(),
        await addr2.getAddress(),
        '2025-01-01T00:00:00',
      );
      await recycleContract.createWasteBottle(
        '67890',
        await addr1.getAddress(),
        await addr2.getAddress(),
        '2025-01-02T00:00:00',
      );
      await recycleContract.createWasteBottle(
        '54321',
        await addr1.getAddress(),
        await addr2.getAddress(),
        '2025-01-03T00:00:00',
      );

      const bottles = await recycleContract.getWasteBottlesList([1, 3]);
      expect(bottles.length).to.equal(2);
      expect(bottles[0].id).to.equal(1);
      expect(bottles[0].trackingCode).to.equal('12345');
      expect(bottles[1].id).to.equal(3);
      expect(bottles[1].trackingCode).to.equal('54321');
    });

    it('Should return an empty array if no indexes provided', async function () {
      const bottles = await recycleContract.getWasteBottlesList([]);
      expect(bottles.length).to.equal(0);
    });

    it('Should handle non-existent WasteBottle IDs gracefully', async function () {
      // Create a WasteBottle
      await recycleContract.createWasteBottle(
        '12345',
        await addr1.getAddress(),
        await addr2.getAddress(),
        '2025-01-01T00:00:00',
      );

      const bottles = await recycleContract.getWasteBottlesList([1, 999]);
      expect(bottles.length).to.equal(2);
      expect(bottles[0].id).to.equal(1);
      expect(bottles[1].id).to.equal(0); // Default struct values for non-existent bottle
    });
  });

  describe('getRecycledMaterialBatchesList', function () {
    it('Should retrieve a list of RecycledMaterialBatches', async function () {
      // Create multiple RecycledMaterialBatches
      await recycleContract.createRecycledMaterialBatch(
        500,
        'Large',
        'Glass',
        'Silica',
        'Extra Info',
        await addr1.getAddress(),
        '2025-01-01T00:00:00',
      );
      await recycleContract.createRecycledMaterialBatch(
        600,
        'Medium',
        'Plastic',
        'Polyethylene',
        'Additional Info',
        await addr1.getAddress(),
        '2025-01-02T00:00:00',
      );
      await recycleContract.createRecycledMaterialBatch(
        700,
        'Small',
        'Metal',
        'Aluminum',
        'More Info',
        await addr1.getAddress(),
        '2025-01-03T00:00:00',
      );

      const batches = await recycleContract.getRecycledMaterialBatchesList([
        1, 3,
      ]);
      expect(batches.length).to.equal(2);
      expect(batches[0].id).to.equal(1);
      expect(batches[0].weight).to.equal(500);
      expect(batches[1].id).to.equal(3);
      expect(batches[1].weight).to.equal(700);
    });

    it('Should return an empty array if no indexes provided', async function () {
      const batches = await recycleContract.getRecycledMaterialBatchesList([]);
      expect(batches.length).to.equal(0);
    });

    it('Should handle non-existent RecycledMaterialBatch IDs gracefully', async function () {
      // Create a RecycledMaterialBatch
      await recycleContract.createRecycledMaterialBatch(
        500,
        'Large',
        'Glass',
        'Silica',
        'Extra Info',
        await addr1.getAddress(),
        '2025-01-01T00:00:00',
      );

      const batches = await recycleContract.getRecycledMaterialBatchesList([
        1, 999,
      ]);
      expect(batches.length).to.equal(2);
      expect(batches[0].id).to.equal(1);
      expect(batches[1].id).to.equal(0); // Default struct values for non-existent batch
    });
  });

  describe('recycleBaseBottles', function () {
    beforeEach(async function () {
      // Create a BaseBottlesBatch to recycle
      const baseBatchId = 1;
      const bottleType = {
        weight: 10,
        color: 'Green',
        thickness: 2,
        shapeType: 'Round',
        originLocation: 'Factory',
        extraInfo: 'None',
        composition: 'Glass',
      };

      // Assuming BaseBottlesBatchContract has a createBaseBottlesBatch function
      await baseBatchContract.createBaseBottlesBatch(
        100,
        bottleType,
        await addr1.getAddress(),
        '2025-01-01T00:00:00',
      );
    });

    it('Should revert when recycling base bottles from non-owner', async function () {
      const baseBatchId = 1;
      const quantity = 10;

      await expect(
        recycleContract.recycleBaseBottles(baseBatchId, quantity),
      ).to.be.revertedWith('Unauthorized');
    });
  });

  describe('sellRecycledMaterialBatch', function () {
    beforeEach(async function () {
      // Create a RecycledMaterialBatch for selling
      const weight = 500;
      const size = 'Large';
      const materialType = 'Glass';
      const composition = 'Silica';
      const extraInfo = 'Extra Info';
      const creator = await addr1.getAddress();
      const createdAt = '2025-01-01T00:00:00';

      await recycleContract.createRecycledMaterialBatch(
        weight,
        size,
        materialType,
        composition,
        extraInfo,
        creator,
        createdAt,
      );
    });

    it('Should sell a RecycledMaterialBatch correctly', async function () {
      const batchId = 1;
      const buyerOwner = await addr2.getAddress();

      const tx = await recycleContract.sellRecycledMaterialBatch(
        batchId,
        buyerOwner,
      );
      await expect(tx).to.not.be.reverted;

      const batch = await recycleContract.recycledMaterials(batchId);
      expect(batch.buyerOwner).to.equal(buyerOwner);
    });

    it('Should revert when selling from an unauthorized address', async function () {
      const batchId = 1;
      const buyerOwner = await addr2.getAddress();

      await expect(
        recycleContract
          .connect(addr1)
          .sellRecycledMaterialBatch(batchId, buyerOwner),
      ).to.be.revertedWith('Unauthorized');
    });

    it('Should revert when selling a non-existent RecycledMaterialBatch', async function () {
      const nonExistentBatchId = 999;
      const buyerOwner = await addr2.getAddress();

      await expect(
        recycleContract.sellRecycledMaterialBatch(
          nonExistentBatchId,
          buyerOwner,
        ),
      ).to.be.revertedWith('Batch does not exist');
    });

    it('Should revert when selling an already sold RecycledMaterialBatch', async function () {
      const batchId = 1;
      const buyerOwner = await addr2.getAddress();

      // Sell the batch for the first time
      await recycleContract.sellRecycledMaterialBatch(batchId, buyerOwner);

      // Attempt to sell the batch again
      await expect(
        recycleContract.sellRecycledMaterialBatch(batchId, buyerOwner),
      ).to.be.revertedWith('Batch already sold');
    });

    it('Should revert when selling a deleted RecycledMaterialBatch', async function () {
      const batchId = 1;
      const buyerOwner = await addr2.getAddress();
      const deletedAt = '2025-02-02T00:00:00';

      // Delete the batch
      await recycleContract.deleteRecycledMaterialBatch(batchId, deletedAt);

      await expect(
        recycleContract.sellRecycledMaterialBatch(batchId, buyerOwner),
      ).to.be.revertedWith('Batch already deleted');
    });
  });
});
