import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Signer } from 'ethers';
import { ProductBottlesBatchContract } from '../typechain/contracts/ProductBottlesBatchContract.sol/ProductBottlesBatchContract';
import { RecycledMaterialContract } from '../typechain/contracts/RecycledMaterialContract.sol/RecycledMaterialContract';
import { BaseBottlesBatchContract } from '../typechain/contracts/BaseBottlesBatchContract.sol/BaseBottlesBatchContract';
import { deployAllContracts } from './utils';

describe('ProductBottlesBatchContract', function () {
  let productContract: ProductBottlesBatchContract;
  let recycleContract: RecycledMaterialContract;
  let baseBatchContract: BaseBottlesBatchContract;
  let owner: Signer;
  let addr1: Signer;
  let addr2: Signer;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const contracts = await deployAllContracts();
    productContract = contracts.productContract;
    recycleContract = contracts.recycleContract;
    baseBatchContract = contracts.baseBatchContract;
  });

  describe('Deployment', function () {
    it('Should set the right owner', async function () {
      expect(await productContract.contractOwner()).to.equal(
        await owner.getAddress(),
      );
    });
  });

  describe('createProductBottlesBatch', function () {
    it('Should create a new ProductBottlesBatch', async function () {
      const quantity = 100;
      const originBaseBatchId = 1;
      const batchOwner = await addr1.getAddress();
      const createdAt = '2025-01-01T00:00:00';

      const tx = await productContract.createProductBottlesBatch(
        quantity,
        originBaseBatchId,
        batchOwner,
        createdAt,
      );

      const expectedBatchId = 1;
      await expect(tx)
        .to.emit(productContract, 'ProductBatchCreated')
        .withArgs(expectedBatchId, batchOwner);

      const batch = await productContract.productBottles(expectedBatchId);
      expect(batch.id).to.equal(expectedBatchId);
      expect(batch.quantity).to.equal(quantity);
      expect(batch.availableQuantity).to.equal(quantity);
      expect(batch.originBaseBatchId).to.equal(originBaseBatchId);
      expect(batch.owner).to.equal(batchOwner);
      expect(batch.trackingCode).to.equal('');
      expect(batch.createdAt).to.equal(createdAt);
      expect(batch.deletedAt).to.equal('');
    });
  });

  describe('updateTrackingCode', function () {
    beforeEach(async function () {
      // Create a batch for testing
      const quantity = 100;
      const originBaseBatchId = 1;
      const batchOwner = await addr1.getAddress();
      const createdAt = '2025-01-01T00:00:00';

      await productContract.createProductBottlesBatch(
        quantity,
        originBaseBatchId,
        batchOwner,
        createdAt,
      );
    });

    it('Should update tracking code successfully', async function () {
      const batchId = 1;
      const newTrackingCode = 'TRACK123';

      const tx = await productContract.updateTrackingCode(
        batchId,
        newTrackingCode,
      );
      await expect(tx)
        .to.emit(productContract, 'ProductBatchUpdated')
        .withArgs(batchId, newTrackingCode);

      const batch = await productContract.productBottles(batchId);
      expect(batch.trackingCode).to.equal(newTrackingCode);

      const mappedBatchId = await productContract.trackingCodeToBatchId(
        newTrackingCode,
      );
      expect(mappedBatchId).to.equal(batchId);
    });

    it('Should override tracking code', async function () {
      const batchId = 1;
      const trackingCode = 'TRACK_OVERRIDE';
      const newTrackingCode = 'TRACK_OVERRIDE_NEW';

      // Assign tracking code to the batch
      await productContract.updateTrackingCode(batchId, trackingCode);

      // Update tracking code
      const tx = await productContract.updateTrackingCode(
        batchId,
        newTrackingCode,
      );
      await expect(tx)
        .to.emit(productContract, 'ProductBatchUpdated')
        .withArgs(batchId, newTrackingCode);

      const batch = await productContract.productBottles(batchId);
      expect(batch.trackingCode).to.equal(newTrackingCode);

      const mappedBatchId = await productContract.trackingCodeToBatchId(
        newTrackingCode,
      );
      expect(mappedBatchId).to.equal(batchId);
    });

    it('Should revert if tracking code already in use', async function () {
      const batchId1 = 1;
      const batchId2 = 2;
      const trackingCode = 'TRACK_DUPLICATE';

      // Create a second batch
      await productContract.createProductBottlesBatch(
        50,
        2,
        await addr2.getAddress(),
        '2025-02-02T00:00:00',
      );

      // Assign tracking code to the first batch
      await productContract.updateTrackingCode(batchId1, trackingCode);

      // Attempt to assign the same tracking code to the second batch
      await expect(
        productContract.updateTrackingCode(batchId2, trackingCode),
      ).to.be.revertedWith('Tracking code already in use');
    });

    it('Should revert when updating tracking code of a non-existent batch', async function () {
      const nonExistentBatchId = 999;
      const trackingCode = 'NONEXISTENT';

      await expect(
        productContract.updateTrackingCode(nonExistentBatchId, trackingCode),
      ).to.be.revertedWith('Product batch does not exist');
    });

    it('Should delete tracking code successfully', async function () {
      const batchId = 1;
      const trackingCode = 'TRACK_DELETE';

      // Assign tracking code to the batch
      await productContract.updateTrackingCode(batchId, trackingCode);

      const tx = await productContract.deleteTrackingCode(batchId);
      await expect(tx)
        .to.emit(productContract, 'ProductBatchUpdated')
        .withArgs(batchId, '');

      const batch = await productContract.productBottles(batchId);
      expect(batch.trackingCode).to.equal('');

      const mappedBatchId = await productContract.trackingCodeToBatchId(
        trackingCode,
      );
      expect(mappedBatchId).to.equal(0);
    });

    xit('Should revert when updating tracking code of a deleted batch', async function () {
      const batchId = 1;
      const trackingCode = 'TRACK_DELETED';

      // Delete the tracking code
      await productContract.rejectBaseBottles(batchId);

      await expect(
        productContract.updateTrackingCode(batchId, trackingCode),
      ).to.be.revertedWith('Product batch already deleted');
    });

    it('Should revert when availableQuantity != quantity', async function () {
      const batchId = 1;
      const trackingCode = 'TRACK_SOLD';

      // Sell some bottles to modify availableQuantity
      const tx = await productContract.sellProductBottle(
        batchId,
        10,
        await addr2.getAddress(),
        '2025-03-03T00:00:00',
      );
      await expect(tx)
        .to.emit(productContract, 'ProductBottlesSold')
        .withArgs(batchId, 10, await addr2.getAddress());

      const batch = await productContract.productBottles(batchId);
      expect(batch.availableQuantity).to.equal(90);

      await expect(
        productContract.updateTrackingCode(batchId, trackingCode),
      ).to.be.revertedWith('Product batch already sold');
    });
  });

  describe('deleteTrackingCode', function () {
    beforeEach(async function () {
      // Create and assign tracking code to a batch
      const quantity = 100;
      const originBaseBatchId = 1;
      const batchOwner = await addr1.getAddress();
      const createdAt = '2025-01-01T00:00:00';
      const trackingCode = 'TRACK_DELETE';

      await productContract.createProductBottlesBatch(
        quantity,
        originBaseBatchId,
        batchOwner,
        createdAt,
      );
      await productContract.updateTrackingCode(1, trackingCode);
    });

    it('Should delete tracking code successfully', async function () {
      const batchId = 1;

      const tx = await productContract.deleteTrackingCode(batchId);
      await expect(tx)
        .to.emit(productContract, 'ProductBatchUpdated')
        .withArgs(batchId, '');

      const batch = await productContract.productBottles(batchId);
      expect(batch.trackingCode).to.equal('');

      const mappedBatchId = await productContract.trackingCodeToBatchId(
        'TRACK_DELETE',
      );
      expect(mappedBatchId).to.equal(0);
    });

    it('Should revert when deleting tracking code of a non-existent batch', async function () {
      const nonExistentBatchId = 999;

      await expect(
        productContract.deleteTrackingCode(nonExistentBatchId),
      ).to.be.revertedWith('Product batch does not exist');
    });

    it('Should revert when deleting tracking code of a sold batch', async function () {
      const batchId = 1;

      // Sell some bottles to modify availableQuantity
      await productContract.sellProductBottle(
        batchId,
        10,
        await addr2.getAddress(),
        '2025-03-03T00:00:00',
      );

      await expect(
        productContract.deleteTrackingCode(batchId),
      ).to.be.revertedWith('Product batch already sold');
    });

    xit('Should revert when deleting tracking code of an already rejected/deleted batch', async function () {
      const batchId = 1;

      // Delete bottles batch by rejecting base bottles
      await productContract.rejectBaseBottles(batchId);

      // Attempt to delete tracking code again
      await expect(
        productContract.deleteTrackingCode(batchId),
      ).to.be.revertedWith('Product batch already deleted');
    });
  });

  describe('getProductBottlesList', function () {
    it('Should retrieve a list of ProductBottlesBatch', async function () {
      const quantity1 = 10;
      const originBaseBatchId1 = 1;
      const batchOwner = await addr1.getAddress();
      const createdAt1 = '2025-07-01T00:00:00';

      const quantity2 = 20;
      const originBaseBatchId2 = 2;
      const createdAt2 = '2025-07-02T00:00:00';

      const quantity3 = 30;
      const originBaseBatchId3 = 3;
      const createdAt3 = '2025-07-03T00:00:00';

      await productContract.createProductBottlesBatch(
        quantity1,
        originBaseBatchId1,
        batchOwner,
        createdAt1,
      );
      await productContract.createProductBottlesBatch(
        quantity2,
        originBaseBatchId2,
        batchOwner,
        createdAt2,
      );
      await productContract.createProductBottlesBatch(
        quantity3,
        originBaseBatchId3,
        batchOwner,
        createdAt3,
      );

      const batches = await productContract.getProductBottlesList([1, 3]);
      expect(batches.length).to.equal(2);
      expect(batches[0].id).to.equal(1);
      expect(batches[0].quantity).to.equal(quantity1);
      expect(batches[1].id).to.equal(3);
      expect(batches[1].quantity).to.equal(quantity3);
    });

    it('Should return empty array if no indexes provided', async function () {
      const batches = await productContract.getProductBottlesList([]);
      expect(batches.length).to.equal(0);
    });

    it('Should handle non-existent batch IDs gracefully', async function () {
      // Create a batch
      await productContract.createProductBottlesBatch(
        10,
        1,
        await addr1.getAddress(),
        '2025-07-01T00:00:00',
      );

      const batches = await productContract.getProductBottlesList([1, 999]);
      expect(batches.length).to.equal(2);
      expect(batches[0].id).to.equal(1);
      expect(batches[1].id).to.equal(0); // default struct values for non-existent batch
    });
  });

  describe('recycleProductBottle', function () {
    beforeEach(async function () {
      // Create a batch
      const quantity = 100;
      const originBaseBatchId = 1;
      const batchOwner = await addr1.getAddress();
      const createdAt = '2025-01-01T00:00:00';

      await productContract.createProductBottlesBatch(
        quantity,
        originBaseBatchId,
        batchOwner,
        createdAt,
      );
    });

    xit('Should recycle product bottles correctly', async function () {
      const batchId = 1;
      const recycleQuantity = 20;

      const tx = await productContract.recycleProductBottle(
        batchId,
        recycleQuantity,
      );
      await expect(tx)
        .to.emit(productContract, 'ProductBottlesRecycled')
        .withArgs(batchId, recycleQuantity);

      const batch = await productContract.productBottles(batchId);
      expect(batch.quantity).to.equal(80);
      expect(batch.availableQuantity).to.equal(80);

      // Verify that recycleBaseBottles was called in the RecycledMaterialContract
      await expect(tx)
        .to.emit(recycleContract, 'RecycleBaseBottlesCalled')
        .withArgs(1, recycleQuantity);
    });

    it('Should revert when recycling more bottles than available', async function () {
      const batchId = 1;
      const recycleQuantity = 200;

      await expect(
        productContract.recycleProductBottle(batchId, recycleQuantity),
      ).to.be.revertedWith('Insufficient quantity in batch');
    });

    xit('Should revert when recycling a rejected batch', async function () {
      const batchId = 1;
      const recycleQuantity = 10;

      // Reject the batch
      const tx = await productContract.rejectBaseBottles(batchId);
      await expect(tx)
        .to.emit(productContract, 'ProductBatchDeleted')
        .withArgs(batchId);

      const batch = await productContract.productBottles(batchId);
      expect(batch.deletedAt).to.not.equal('');

      await expect(
        productContract.recycleProductBottle(batchId, recycleQuantity),
      ).to.be.revertedWith('Product batch already deleted');
    });
  });

  describe('sellProductBottle', function () {
    beforeEach(async function () {
      // Create a batch
      const quantity = 100;
      const originBaseBatchId = 1;
      const batchOwner = await addr1.getAddress();
      const createdAt = '2025-01-01T00:00:00';

      await productContract.createProductBottlesBatch(
        quantity,
        originBaseBatchId,
        batchOwner,
        createdAt,
      );
    });

    it('Should sell product bottles correctly', async function () {
      const batchId = 1;
      const sellQuantity = 30;
      const buyer = await addr2.getAddress();
      const createdAt = '2025-03-03T00:00:00';

      const tx = await productContract.sellProductBottle(
        batchId,
        sellQuantity,
        buyer,
        createdAt,
      );
      await expect(tx)
        .to.emit(productContract, 'ProductBottlesSold')
        .withArgs(batchId, sellQuantity, buyer);

      const batch = await productContract.productBottles(batchId);
      expect(batch.availableQuantity).to.equal(70);

      const soldBatch = await productContract.soldBottles(1);
      expect(soldBatch.id).to.equal(1);
      expect(soldBatch.quantity).to.equal(sellQuantity);
      expect(soldBatch.originProductBatchId).to.equal(batchId);
      expect(soldBatch.owner).to.equal(buyer);
      expect(soldBatch.createdAt).to.equal(createdAt);
    });

    it('Should revert when selling more bottles than available', async function () {
      const batchId = 1;
      const sellQuantity = 150;
      const buyer = await addr2.getAddress();
      const createdAt = '2025-03-03T00:00:00';

      await expect(
        productContract.sellProductBottle(
          batchId,
          sellQuantity,
          buyer,
          createdAt,
        ),
      ).to.be.revertedWith('Insufficient quantity in batch');
    });

    xit('Should revert when selling from a rejected batch', async function () {
      const batchId = 1;
      const sellQuantity = 10;
      const buyer = await addr2.getAddress();
      const createdAt = '2025-03-03T00:00:00';

      // Delete the batch
      await productContract.rejectBaseBottles(batchId);

      await expect(
        productContract.sellProductBottle(
          batchId,
          sellQuantity,
          buyer,
          createdAt,
        ),
      ).to.be.revertedWith('Product batch already deleted');
    });
  });

  describe('getProductBottleByCode', function () {
    beforeEach(async function () {
      // Create and assign tracking code to a batch
      const quantity = 100;
      const originBaseBatchId = 1;
      const batchOwner = await addr1.getAddress();
      const createdAt = '2025-01-01T00:00:00';
      const trackingCode = 'TRACK_CODE_ABC';

      await productContract.createProductBottlesBatch(
        quantity,
        originBaseBatchId,
        batchOwner,
        createdAt,
      );
      await productContract.updateTrackingCode(1, trackingCode);
    });

    it('Should retrieve ProductBottlesBatch by tracking code', async function () {
      const trackingCode = 'TRACK_CODE_ABC';

      const batch = await productContract.getProductBottleByCode(trackingCode);
      expect(batch.id).to.equal(1);
      expect(batch.trackingCode).to.equal(trackingCode);
    });

    it('Should revert when tracking code does not exist', async function () {
      const nonExistentTrackingCode = 'NON_EXISTENT_CODE';

      await expect(
        productContract.getProductBottleByCode(nonExistentTrackingCode),
      ).to.be.revertedWith('Product batch does not exist');
    });
  });
});
