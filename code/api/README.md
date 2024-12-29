# Thesis Blockchain API

This REST API is used to interact with Consent's blockchain database. The contracts deployed on the blockchain are available on [this other repo](https://github.com/LilahSolutions/consend-blockchain) and deployed on an EVM-compatible blockchain network.

Current contract deployed on Optimism Sepolia: https://sepolia-optimistic.etherscan.io/address/0x4E140E9bA3a8c4b4551783D66A276b6Ad29B5CC0#readContract

(This address is subject to change and should be updated on .env file of this project for the API to work properly).

## API Endpoints

The list of available endpoints are exactly the same as the ones available on the contract. As a general review, these are the main functions available:

- `createConsent`: Creates a new consent record on the blockchain.
- `getConsent`: Retrieves a consent record from the blockchain.
- `joinConsent`: Adds a new participant to a consent record.
- `getConsentParticipants`: Retrieves the list of participants of a consent record.
- `getConsentIntegrityHash`: Retrieves the integrity hash of a consent record to verify its authenticity.

## Environment configuration

The API requires the following environment variables to be set:

```
PRIVATE_KEY=""
PROVIDER_URL=""
CONTRACT_ADDRESS=""
```

- `PRIVATE_KEY`: The private key of the account that will interact with the blockchain. This account must have enough funds on the network to pay for the gas fees of the transactions. It must be the same address that deployed the contract because the owner of the contract is the only one that can interact with it.
- `PROVIDER_URL`: The URL of the blockchain provider. This can be a local node or a public node. Check [Credentials](https://www.notion.so/Credenciales-4eb3bb23c4624ec69bb75ea29ecd1107) for information on Infura account or other providers credentials. This is the url of the blockchain network node that the API will use to interact with the blockchain.
- `CONTRACT_ADDRESS`: The address of the deployed contract on the blockchain. This address is the one that will be used to interact with the contract, you can find it on the contract's deployment transaction.

## New contract deployment

Each time you deploy a new contract, you must update the `CONTRACT_ADDRESS` environment variable with the new contract address.

If you modify the contract's functions, you must update the contract's ABI on the [src/infrastructure/constants/index.ts](./src/infrastructure/constants/index.ts) file.

If you changed the deployer's address, you must update the `PRIVATE_KEY` environment variable with the new private key too.

You usually configure the RCP Node Provider (PROVIDER_URL) once, but if you change the provider, you must update the environment variable too. For example, to configure an Infura provider, you should:

1. Create an accout on [Infura](https://app.infura.io/).
2. Create a new API KEY and configure the network(s) you want to use.
3. Copy the URL of the network you want to use (e.g. `https://mainnet.infura.io/v3/your-api-key`) and paste it in the `PROVIDER_URL` environment variable.

## Running the API

This API is a Node.js application that uses Express.js to handle the HTTP requests.

To run the API for the first time, you must install the dependencies:

```bash
npm install
```

Then, you can run the API with:

```bash
npm run start:dev
```

This will start the API on the port 8080 by default. You can change the port on the [./src/infrastructure/constants/index.ts](./src/infrastructure/constants/index.ts) file.

To run the API in production mode, you can use the following command:

```bash
npm run start:prod
```
