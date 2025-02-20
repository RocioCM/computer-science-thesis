import { ethers } from 'hardhat';
import { BaseBottlesBatchContract } from '../typechain/contracts/BaseBottlesBatchContract.sol';
import { RecycledMaterialContract } from '../typechain/contracts/RecycledMaterialContract.sol';
import { ProductBottlesBatchContract } from '../typechain/contracts/ProductBottlesBatchContract.sol';
import { BaseBottlesBatchContract__factory } from '../typechain/factories/contracts/BaseBottlesBatchContract.sol';
import { RecycledMaterialContract__factory } from '../typechain/factories/contracts/RecycledMaterialContract.sol';
import { ProductBottlesBatchContract__factory } from '../typechain/factories/contracts/ProductBottlesBatchContract.sol';
import {
  BASE_BATCH_CONTRACT_NAME,
  RECYCLE_CONTRACT_NAME,
  PRODUCT_CONTRACT_NAME,
} from './constants';

export async function deployAllContracts() {
  const RecycleFactory = (await ethers.getContractFactory(
    RECYCLE_CONTRACT_NAME,
  )) as RecycledMaterialContract__factory;
  const recycleContract: RecycledMaterialContract =
    await RecycleFactory.deploy();
  const recycleAddress = await recycleContract.getAddress();

  const ProductFactory = (await ethers.getContractFactory(
    PRODUCT_CONTRACT_NAME,
  )) as ProductBottlesBatchContract__factory;
  const productContract: ProductBottlesBatchContract =
    await ProductFactory.deploy(recycleAddress);
  const productAddress = await productContract.getAddress();

  const BaseBatchFactory = (await ethers.getContractFactory(
    BASE_BATCH_CONTRACT_NAME,
  )) as BaseBottlesBatchContract__factory;
  const baseBatchContract: BaseBottlesBatchContract =
    await BaseBatchFactory.deploy(productAddress, recycleAddress);
  const baseBatchAddress = await baseBatchContract.getAddress();

  await productContract.setBaseBottlesBatchContract(baseBatchAddress);
  await recycleContract.setBaseBottlesBatchContract(baseBatchAddress);
  await recycleContract.setProductBottlesBatchContract(productAddress);

  return {
    recycleContract,
    productContract,
    baseBatchContract,
  };
}
