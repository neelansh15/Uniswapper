import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { formatEther, formatUnits, parseEther, parseUnits } from "ethers/lib/utils";
import { ethers } from "hardhat";
import { Uniswapper } from "../typechain";

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
    const ethAddress = await uniswapper.ethAddress()
    console.log("Got ETH address", ethAddress)
    expect(ethAddress.toLowerCase()).to.equal("0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6")

    const factoryAddress = await uniswapper.uniswapFactory()
    console.log("Got uniswap factory address", factoryAddress)
    expect(factoryAddress.toLowerCase()).to.equal("0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f")
  });

  it("Should Swap given ETH to USDC", async function () {
    const usdcBalance = +formatUnits(await uniswapper.getUSDCBalanceOf(await account0.getAddress()), 6)
    console.log("Initial USDC balance", usdcBalance)

    const result = await uniswapper.swapETHForUSDC(parseUnits('0.01', 6), +new Date + 10000, {
      value: parseEther('1')
    })
    await result.wait()

    const usdcBalanceFinal = +formatUnits(await uniswapper.getUSDCBalanceOf(await account0.getAddress()), 6)
    console.log("Final USDC balance", usdcBalanceFinal)

    expect(usdcBalanceFinal).to.be.greaterThan(usdcBalance)
  })
});
