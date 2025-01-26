import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Signer } from 'ethers';
import { ProductBottlesBatchContract } from '../typechain/contracts/ProductBottlesBatchContract.sol/ProductBottlesBatchContract';
import { deployAllContracts } from './utils';

describe('ProductBottlesBatchContract', function () {
  let productContract: ProductBottlesBatchContract;
  let owner: Signer;
  let addr1: Signer;
  let addr2: Signer;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const contracts = await deployAllContracts();
    productContract = contracts.productContract;
  });

  it('Should set the right owner', async function () {
    expect(await productContract.contractOwner()).to.equal(
      await owner.getAddress(),
    );
  });
});
