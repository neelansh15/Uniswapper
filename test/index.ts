import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { formatEther, formatUnits, parseEther, parseUnits } from "ethers/lib/utils";
import { ethers } from "hardhat";
import { Uniswapper } from "../typechain";
import ERC20 from '@uniswap/v2-core/build/IERC20.json'

// Goerli
describe("Uniswapper", function () {

  let uniswapper: Uniswapper
  let account0: SignerWithAddress
  this.beforeAll(async function () {
    const Uniswapper = await ethers.getContractFactory("Uniswapper");
    uniswapper = await Uniswapper.deploy();
    await uniswapper.deployed();
  })

  it("Should display user's ETH balance", async function () {
    const [owner] = await ethers.getSigners()
    account0 = owner
    const balance = +formatEther(await account0.getBalance())
    console.log("User ETH balance", balance)
    expect(balance).to.be.greaterThan(0)
  })

  it("Should return uniswap weth and factory address", async function () {
    const ethAddress = await uniswapper.weth()
    console.log("Got ETH address", ethAddress)
    expect(ethAddress.toLowerCase()).to.equal("0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6")

    const factoryAddress = await uniswapper.routerFactory()
    console.log("Got uniswap factory address", factoryAddress)
    expect(factoryAddress.toLowerCase()).to.equal("0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f")
  });

  it("Should Swap given ETH to USDC", async function () {
    const usdcBalance = +formatUnits(await uniswapper.getUSDCBalanceOf(await account0.getAddress()), 6)
    console.log("Initial USDC balance", usdcBalance)

    const balance = +formatEther(await account0.getBalance())
    console.log("Initial ETH balance", balance)

    const result = await uniswapper.swapETHForUSDC(await account0.getAddress(), parseEther('1'), parseUnits('0.01', 6), +new Date + 10000, {
      value: parseEther('1')
    })
    await result.wait()

    const usdcBalanceFinal = +formatUnits(await uniswapper.getUSDCBalanceOf(await account0.getAddress()), 6)
    console.log("Final USDC balance", usdcBalanceFinal)

    const balanceFinal = +formatEther(await account0.getBalance())
    console.log("Final ETH balance", balanceFinal)

    expect(usdcBalanceFinal).to.be.greaterThan(usdcBalance)
    expect(balanceFinal).to.be.lessThan(balance)
  })

  it("Should return weth-usdc pair reserves", async function () {
    let reserves = await uniswapper.getReserves()

    const reserve0 = +formatUnits(reserves[0]) // WETH
    const reserve1 = +formatUnits(reserves[1], 6) // USDC

    console.log("Got pair reserves", {
      reserve0, reserve1
    })
  })

  /**
   * It should automatically swap the sent ETH into proportion for the pool and Add Liquidity in exchange for LP tokens
   * NOTE: Important that we're sending ETH and the erc20 token is WETH. Uniswap considers WETH as ETH so the pool is ETH-USDC in the end
   */
  it("Should Add Liquidity in exchange for LP tokens", async function () {
    const usdc = new ethers.Contract('0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C', ERC20.abi, account0)

    const deadline = +new Date + 10000000

    // Initial balances
    const initialLPT = +formatEther(await uniswapper.lptBalanceOf(await account0.getAddress()))
    console.log("User's Initial LPT balance", initialLPT)

    const initialContractETH = +formatUnits(await uniswapper.provider.getBalance(uniswapper.address))
    console.log("Contract's Initial ETH balance", initialContractETH)

    const initialContractUSDC = +formatUnits(await usdc.balanceOf(uniswapper.address), 6)
    console.log("Contract's Initial USDC balance", initialContractUSDC)

    // Main
    const result = await uniswapper.addLiquidity(deadline, { value: parseEther('0.1') })
    await result.wait()

    // Final balances
    const finalLPT = +formatEther(await uniswapper.lptBalanceOf(await account0.getAddress()))
    console.log("User's Final LPT balance", finalLPT)

    const finalContractUSDC = +formatUnits(await usdc.balanceOf(uniswapper.address), 6)
    console.log("Contract's Final USDC balance", finalContractUSDC)

    const finalContractETH = +formatUnits(await uniswapper.provider.getBalance(uniswapper.address))
    console.log("Contract's Final ETH balance", finalContractETH)

    const usdcBalanceFinal = +formatUnits(await uniswapper.getUSDCBalanceOf(await account0.getAddress()), 6)
    console.log("User's final USDC balance", usdcBalanceFinal)

  })
});
