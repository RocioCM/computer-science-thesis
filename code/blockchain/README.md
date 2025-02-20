# Consend Blockchain

## Network

We use the Optimistic Ethereum network for this project. You can find more information about it [here](https://optimism.io/). You can find network configuration in the [hardhat.config.js](./hardhat.config.js) file.

- Testnet: Optimism Sepolia
- Mainnet: Optimism Mainnet

Both networks use same Etherscan API key (env variable ETHERSCAN_API_KEY) for contract verification. The private key for the deployment account is stored in the .env file. The account should have enough funds on the network to deploy the contracts.

## Development

### Install dependencies

```bash
npm install
```

### Compile contracts

```bash
npm run compile
```

### Run tests

```bash
npm run test
```

First time you run the tests or to update typescript types of your contracts to add new tests, run:

```bash
npx hardhat typechain
```

### Run coverage

```bash
npm run coverage
```

### Run and deploy to local node

First run the local node:

```bash
npm run node
```

Then deploy the contracts in another terminal:

```bash
npm run compile
npm run deployLocal
```

### Deploy and verify contracts

```bash
npm run deployTest
# or for production:
npm run deployProd
```

After deployment, you have to update contract address and ABI in the API. You can find the API on [the backend-api repo](../backend-api/package.json). Elsecase, the application will continue working with an old contract.

# Sample Tasks

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.ts
```
