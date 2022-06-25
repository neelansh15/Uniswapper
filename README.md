# Uniswapper
Testing on a local hardhat fork of the Goerli Testnet. All Uniswap and Token addresses used are specifically for Goerli.  

Swapping 1 ETH for the maximum possible amount of [USDC](https://goerli.etherscan.io/token/0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C) using [Uniswap V2 Router 02](https://docs.uniswap.org/protocol/V2/reference/smart-contracts/router-02#swapexactethfortokens).  
Adding Liquidity to WETH-USDC pool on Uniswap by supplying just ETH.  

<img width="633" alt="image" src="https://user-images.githubusercontent.com/53081208/175785673-4d4ce1ca-922f-412c-8152-3fcaf93f5a87.png">

Current iteration with 
1) Swap for ETH → USDC
2) Add Liquidity to WETH-USDC pool by only supplying ETH  

is deployed to: https://goerli.etherscan.io/address/0xF5ca8778edab3C08897791A37c03AE0ccE525115


**Example transaction of adding liquidity with Uniswapper:** https://goerli.etherscan.io/tx/0x218f6c49bf327d3edc68f322c36d496001710b3bd89083ce6d0704d38d7f3af2  

Result:  
<img width="716" alt="image" src="https://user-images.githubusercontent.com/53081208/175786506-6f035f7e-6c86-4c53-854e-d95c14a06183.png">


# Advanced Sample Hardhat Project

This project demonstrates an advanced Hardhat use case, integrating other tools commonly used alongside Hardhat in the ecosystem.

The project comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts. It also comes with a variety of other tools, preconfigured to work with the project code.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
npx hardhat help
REPORT_GAS=true npx hardhat test
npx hardhat coverage
npx hardhat run scripts/deploy.ts
TS_NODE_FILES=true npx ts-node scripts/deploy.ts
npx eslint '**/*.{js,ts}'
npx eslint '**/*.{js,ts}' --fix
npx prettier '**/*.{json,sol,md}' --check
npx prettier '**/*.{json,sol,md}' --write
npx solhint 'contracts/**/*.sol'
npx solhint 'contracts/**/*.sol' --fix
```

# Etherscan verification

To try out Etherscan verification, you first need to deploy a contract to an Ethereum network that's supported by Etherscan, such as Ropsten.

In this project, copy the .env.example file to a file named .env, and then edit it to fill in the details. Enter your Etherscan API key, your Ropsten node URL (eg from Alchemy), and the private key of the account which will send the deployment transaction. With a valid .env file in place, first deploy your contract:

```shell
hardhat run --network ropsten scripts/sample-script.ts
```

Then, copy the deployment address and paste it in to replace `DEPLOYED_CONTRACT_ADDRESS` in this command:

```shell
npx hardhat verify --network ropsten DEPLOYED_CONTRACT_ADDRESS "Hello, Hardhat!"
```

# Performance optimizations

For faster runs of your tests and scripts, consider skipping ts-node's type checking by setting the environment variable `TS_NODE_TRANSPILE_ONLY` to `1` in hardhat's environment. For more details see [the documentation](https://hardhat.org/guides/typescript.html#performance-optimizations).
