import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Signer } from 'ethers';
import {
  BaseBottlesBatchContract,
  BaseBottlesBatchStruct,
  BottleStruct,
} from '../typechain/contracts/BaseBottlesBatchContract.sol/BaseBottlesBatchContract';

import { deployAllContracts } from './utils';

describe('BaseBottlesBatchContract', function () {
  let baseBatchContract: BaseBottlesBatchContract;
  let owner: Signer;
  let addr1: Signer;
  let addr2: Signer;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const contracts = await deployAllContracts();
    baseBatchContract = contracts.baseBatchContract;
  });

  it('Should set the right owner', async function () {
    expect(await baseBatchContract.contractOwner()).to.equal(
      await owner.getAddress(),
    );
  });

  it('Should create a new BaseBottlesBatch', async function () {
    const bottleType: BottleStruct = {
      weight: 500,
      color: 'verde',
      thickness: 12,
      shapeType: 'cuello alto',
      originLocation: 'Mendoza',
      extraInfo: '{}',
      composition:
        '[{"name": "vidrio", "amount": 100, "measureUnit": "percentage"}]',
    };
    const tx = await baseBatchContract.createBaseBottlesBatch(
      100,
      bottleType,
      await addr1.getAddress(),
      '2025-01-01T00:00:00',
    );
    await expect(tx)
      .to.emit(baseBatchContract, 'BaseBatchCreated')
      .withArgs(1, await addr1.getAddress());

    const batch = await baseBatchContract.baseBottlesBatches(1);
    expect(batch.quantity).to.equal(100);
    expect(batch.owner).to.equal(await addr1.getAddress());
    expect(batch.deletedAt).to.equal('');
  });

  it('Should update an existing BaseBottlesBatch', async function () {
    // First create batch
    const bottleType: BottleStruct = {
      weight: 500,
      color: 'verde',
      thickness: 12,
      shapeType: 'cuello alto',
      originLocation: 'Mendoza',
      extraInfo: '{}',
      composition:
        '[{"name": "vidrio", "amount": 100, "measureUnit": "percentage"}]',
    };
    await baseBatchContract.createBaseBottlesBatch(
      50,
      bottleType,
      await addr1.getAddress(),
      '2025-02-02T00:00:00',
    );

    // Then update batch
    const updatedBatch: BaseBottlesBatchStruct = {
      id: 1,
      quantity: 75,
      bottleType: {
        weight: 600,
        color: 'azul',
        thickness: 12,
        shapeType: 'cuello alto',
        originLocation: 'Mendoza',
        extraInfo: '{"status": "updated"}',
        composition:
          '[{"name": "vidrio", "amount": 100, "measureUnit": "percentage"}]',
      },
      owner: await addr1.getAddress(),
      soldQuantity: 0,
      createdAt: '2025-02-02T00:00:00',
      deletedAt: '',
    };

    const tx = await baseBatchContract.updateBaseBottlesBatch(1, updatedBatch);
    await expect(tx).to.emit(baseBatchContract, 'BaseBatchUpdated').withArgs(1);

    const batch = await baseBatchContract.baseBottlesBatches(1);
    expect(batch.quantity).to.equal(75);
    expect(batch.bottleType.color).to.equal('azul');
  });

  it('Should not update a deleted batch', async function () {
    const bottleType: BottleStruct = {
      weight: 500,
      color: 'verde',
      thickness: 12,
      shapeType: 'cuello alto',
      originLocation: 'Mendoza',
      extraInfo: '{}',
      composition:
        '[{"name": "vidrio", "amount": 100, "measureUnit": "percentage"}]',
    };
    await baseBatchContract.createBaseBottlesBatch(
      50,
      bottleType,
      await addr1.getAddress(),
      '2025-02-02T00:00:00',
    );

    await baseBatchContract.deleteBaseBottlesBatch(1, '2025-03-03T00:00:00');

    const updatedBatch: BaseBottlesBatchStruct = {
      id: 1,
      quantity: 75,
      bottleType,
      owner: await addr1.getAddress(),
      soldQuantity: 3,
      createdAt: '2025-02-02T00:00:00',
      deletedAt: '',
    };

    await expect(
      baseBatchContract.updateBaseBottlesBatch(1, updatedBatch),
    ).to.be.revertedWith('Batch already deleted');
  });

  it('Should delete a BaseBottlesBatch', async function () {
    const bottleType: BottleStruct = {
      weight: 500,
      color: 'verde',
      thickness: 12,
      shapeType: 'cuello alto',
      originLocation: 'Mendoza',
      extraInfo: '{}',
      composition:
        '[{"name": "vidrio", "amount": 100, "measureUnit": "percentage"}]',
    };
    await baseBatchContract.createBaseBottlesBatch(
      30,
      bottleType,
      await addr2.getAddress(),
      '2025-04-04T00:00:00',
    );

    const tx = await baseBatchContract.deleteBaseBottlesBatch(
      1,
      '2025-05-05T00:00:00',
    );
    await expect(tx).to.emit(baseBatchContract, 'BaseBatchDeleted').withArgs(1);

    const batch = await baseBatchContract.baseBottlesBatches(1);
    expect(batch.deletedAt).to.equal('2025-05-05T00:00:00');
  });

  it('Should not delete an already deleted batch', async function () {
    const bottleType: BottleStruct = {
      weight: 500,
      color: 'verde',
      thickness: 12,
      shapeType: 'cuello alto',
      originLocation: 'Mendoza',
      extraInfo: '{}',
      composition:
        '[{"name": "vidrio", "amount": 100, "measureUnit": "percentage"}]',
    };
    await baseBatchContract.createBaseBottlesBatch(
      30,
      bottleType,
      await addr2.getAddress(),
      '2025-04-04T00:00:00',
    );
    await baseBatchContract.deleteBaseBottlesBatch(1, '2025-05-05T00:00:00');
    await expect(
      baseBatchContract.deleteBaseBottlesBatch(1, '2025-06-06T00:00:00'),
    ).to.be.revertedWith('Batch already deleted');
  });

  it('Should retrieve a list of BaseBottlesBatches', async function () {
    const bottleType: BottleStruct = {
      weight: 500,
      color: 'verde',
      thickness: 12,
      shapeType: 'cuello alto',
      originLocation: 'Mendoza',
      extraInfo: '{}',
      composition:
        '[{"name": "vidrio", "amount": 100, "measureUnit": "percentage"}]',
    };
    // Create multiple batches
    for (let i = 0; i < 3; i++) {
      await baseBatchContract.createBaseBottlesBatch(
        10 + i,
        bottleType,
        await addr1.getAddress(),
        `2025-07-0${i + 1}T00:00:00`,
      );
    }

    const batches = await baseBatchContract.getBaseBottlesList([1, 3]);
    expect(batches.length).to.equal(2);
    expect(batches[0].id).to.equal(1);
    expect(batches[1].id).to.equal(3);
  });

  xit('Should recycle base bottles correctly', async function () {
    const bottleType = {
      weight: 300,
      color: 'brown',
      thickness: 10,
      shapeType: 'hexagon',
      originLocation: 'Depot',
      extraInfo: 'none',
      composition: 'plastic',
    };
    await baseBatchContract.createBaseBottlesBatch(
      100,
      bottleType,
      await addr1.getAddress(),
      '2025-08-08T00:00:00',
    );

    // Reciclar parte de la cantidad
    const tx = await baseBatchContract.recycleBaseBottles(1, 20);
    await expect(tx)
      .to.emit(baseBatchContract, 'BaseBottlesRecycled')
      .withArgs(1, 20);

    const batch = await baseBatchContract.baseBottlesBatches(1);
    expect(batch.quantity).to.equal(80);
  });

  it('Should not recycle more bottles than available', async function () {
    const bottleType: BottleStruct = {
      weight: 500,
      color: 'verde',
      thickness: 12,
      shapeType: 'cuello alto',
      originLocation: 'Mendoza',
      extraInfo: '{}',
      composition:
        '[{"name": "vidrio", "amount": 100, "measureUnit": "percentage"}]',
    };
    await baseBatchContract.createBaseBottlesBatch(
      10,
      bottleType,
      await addr1.getAddress(),
      '2025-08-08T00:00:00',
    );

    await expect(
      baseBatchContract.recycleBaseBottles(1, 20),
    ).to.be.revertedWith('Insufficient quantity in batch');
  });

  it('Should not recycle a deleted batch', async function () {
    const bottleType: BottleStruct = {
      weight: 500,
      color: 'verde',
      thickness: 12,
      shapeType: 'cuello alto',
      originLocation: 'Mendoza',
      extraInfo: '{}',
      composition:
        '[{"name": "vidrio", "amount": 100, "measureUnit": "percentage"}]',
    };
    await baseBatchContract.createBaseBottlesBatch(
      50,
      bottleType,
      await addr1.getAddress(),
      '2025-09-09T00:00:00',
    );
    await baseBatchContract.deleteBaseBottlesBatch(1, '2025-10-10T00:00:00');

    await expect(
      baseBatchContract.recycleBaseBottles(1, 10),
    ).to.be.revertedWith('Batch already deleted');
  });

  xit('Should sell base bottles correctly', async function () {
    const bottleType = {
      weight: 250,
      color: 'transparent',
      thickness: 7,
      shapeType: 'cylinder',
      originLocation: 'Site',
      extraInfo: 'info',
      composition: 'glass',
    };
    await baseBatchContract.createBaseBottlesBatch(
      100,
      bottleType,
      await addr1.getAddress(),
      '2025-11-11T00:00:00',
    );

    const buyerAddress = await addr2.getAddress();
    const tx = await baseBatchContract.sellBaseBottles(
      1,
      30,
      buyerAddress,
      '2025-12-12T00:00:00',
    );
    await expect(tx)
      .to.emit(baseBatchContract, 'BaseBottlesSold')
      .withArgs(1, 30, buyerAddress);

    const batch = await baseBatchContract.baseBottlesBatches(1);
    expect(batch.soldQuantity).to.equal(30);
  });

  it('Should not sell more bottles than available', async function () {
    const bottleType: BottleStruct = {
      weight: 500,
      color: 'verde',
      thickness: 12,
      shapeType: 'cuello alto',
      originLocation: 'Mendoza',
      extraInfo: '{}',
      composition:
        '[{"name": "vidrio", "amount": 100, "measureUnit": "percentage"}]',
    };
    await baseBatchContract.createBaseBottlesBatch(
      20,
      bottleType,
      await addr1.getAddress(),
      '2025-11-11T00:00:00',
    );

    await expect(
      baseBatchContract.sellBaseBottles(
        1,
        30,
        await addr2.getAddress(),
        '2025-12-12T00:00:00',
      ),
    ).to.be.revertedWith('Insufficient quantity in batch');
  });

  it('Should not sell from a deleted batch', async function () {
    const bottleType: BottleStruct = {
      weight: 500,
      color: 'verde',
      thickness: 12,
      shapeType: 'cuello alto',
      originLocation: 'Mendoza',
      extraInfo: '{}',
      composition:
        '[{"name": "vidrio", "amount": 100, "measureUnit": "percentage"}]',
    };
    await baseBatchContract.createBaseBottlesBatch(
      50,
      bottleType,
      await addr1.getAddress(),
      '2025-11-11T00:00:00',
    );
    await baseBatchContract.deleteBaseBottlesBatch(1, '2025-12-12T00:00:00');

    await expect(
      baseBatchContract.sellBaseBottles(
        1,
        10,
        await addr2.getAddress(),
        '2025-12-12T00:00:00',
      ),
    ).to.be.revertedWith('Batch already deleted');
  });
});
