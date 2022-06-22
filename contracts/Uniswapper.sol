// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";

// Goerli
// Operating on WETH-USDC pair
contract Uniswapper {
    address public uniswapRouter02 = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    address public uniswapFactory = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;

    address public weth;
    address public usdc = 0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C;

    IUniswapV2Router02 private router;
    IUniswapV2Factory private factory;

    constructor() {
        router = IUniswapV2Router02(uniswapRouter02);
        factory = IUniswapV2Factory(uniswapFactory);
        weth = router.WETH();
    }

    function routerFactory() external view returns (address) {
        return router.factory();
    }

    function getUSDCBalanceOf(address _account)
        external
        view
        returns (uint256)
    {
        IERC20 usdcToken = IERC20(usdc);
        return usdcToken.balanceOf(_account);
    }

    function swapETHForUSDC(uint256 amountOutMin, uint256 deadline)
        public
        payable
    {
        address[] memory path = new address[](2);
        path[0] = weth;
        path[1] = usdc;
        router.swapExactETHForTokens{value: msg.value}(
            amountOutMin,
            path,
            msg.sender,
            deadline
        );
    }

    function getReserves() external view returns (uint112, uint112) {
        address pairAddress = factory.getPair(weth, usdc);
        require(pairAddress != address(0), "Pair not found for the tokens");
        IUniswapV2Pair pair = IUniswapV2Pair(pairAddress);
        (uint112 reserves0, uint112 reserves1, ) = pair.getReserves();

        return (reserves0, reserves1);
    }
}
