const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const blockchainDir = path.resolve(__dirname, '../../blockchain');
const backendDir = path.resolve(__dirname, '../');
const addressesPath = path.join(blockchainDir, 'addresses.json');
const envTestPath = path.join(backendDir, '.env.test');

// 1. Start local Hardhat node
console.log('Starting local Hardhat node...');
const nodeProcess = spawn('npx', ['hardhat', 'node'], {
  cwd: blockchainDir,
  detached: true,
  stdio: 'ignore',
  shell: true,
});
nodeProcess.unref();

// Wait for node to be ready
function waitForNodeReady() {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      try {
        execSync('curl --silent http://localhost:8545');
        clearInterval(interval);
        resolve();
      } catch {
        // keep waiting
      }
    }, 1000);
  });
}

(async () => {
  await waitForNodeReady();
  console.log('Local node ready. Deploying contracts...');
  // 2. Deploy contracts
  execSync('npm run deployLocal', { cwd: blockchainDir, stdio: 'inherit' });

  // 3. Copy addresses and private key to .env.test
  const addresses = JSON.parse(fs.readFileSync(addressesPath, 'utf-8'));
  // Get the first private key from local node
  const accounts = [
    {
      privateKey:
        'ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
    },
  ];
  const privateKey = accounts[0].privateKey;
  const envContent = `NODE_ENV=test\nPROVIDER_URL=http://localhost:8545\nPRIVATE_KEY=${privateKey}\nBASE_BATCH_CONTRACT_ADDRESS=${addresses.BASE_BATCH_CONTRACT_ADDRESS}\nPRODUCT_BATCH_CONTRACT_ADDRESS=${addresses.PRODUCT_BATCH_CONTRACT_ADDRESS}\nRECYCLING_CONTRACT_ADDRESS=${addresses.RECYCLING_CONTRACT_ADDRESS}\n`;
  fs.writeFileSync(envTestPath, envContent);
  console.log('.env.test updated with addresses and private key.');
  // 4. Run integration tests
  console.log('Running integration tests...');
  try {
    execSync(
      'npx jest tests/integration --no-coverage --runInBand --testTimeout=30000',
      {
        cwd: backendDir,
        stdio: 'inherit',
      },
    );
  } finally {
    // 5. Kill the local node process
    process.kill(-nodeProcess.pid);
    console.log('Local Hardhat node stopped.');
  }
})();
