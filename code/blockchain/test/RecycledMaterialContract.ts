import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Signer } from 'ethers';
import { RecycledMaterialContract } from '../typechain/contracts/RecycledMaterialContract.sol/RecycledMaterialContract';
import { deployAllContracts } from './utils';

describe('RecycledMaterialContract', function () {
  let recycleContract: RecycledMaterialContract;
  let owner: Signer;
  let addr1: Signer;
  let addr2: Signer;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const contracts = await deployAllContracts();
    recycleContract = contracts.recycleContract;
  });

  it('Should set the right owner', async function () {
    expect(await recycleContract.contractOwner()).to.equal(
      await owner.getAddress(),
    );
  });
});
