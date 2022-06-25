// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "./TransferHelper.sol";

// Goerli
// Operating on WETH-USDC pair
contract Uniswapper {
    address public uniswapRouter02 = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    address public uniswapFactory = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;

    address public weth;
    address public usdc = 0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C;

    IUniswapV2Router02 private router;
    IUniswapV2Factory private factory;
    IUniswapV2Pair private pair;

    constructor() {
        router = IUniswapV2Router02(uniswapRouter02);
        factory = IUniswapV2Factory(uniswapFactory);
        weth = router.WETH();

        address pairAddress = factory.getPair(weth, usdc);
        require(pairAddress != address(0), "Pair not found for the tokens");
        pair = IUniswapV2Pair(pairAddress);

        // Approve router to access this contract's WETH & USDC
        TransferHelper.safeApprove(
            weth,
            uniswapRouter02,
            2**256 - 1 // Max uint256
        );
        TransferHelper.safeApprove(
            usdc,
            uniswapRouter02,
            2**256 - 1 // Max uint256
        );
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

    function swapETHForUSDC(
        address to,
        uint256 amountIn,
        uint256 amountOutMin,
        uint256 deadline
    ) public payable {
        address[] memory path = new address[](2);
        path[0] = weth;
        path[1] = usdc;
        router.swapExactETHForTokens{value: amountIn}(
            amountOutMin,
            path,
            to,
            deadline
        );
    }

    function getReserves() public view returns (uint112, uint112) {
        (uint112 reserves0, uint112 reserves1, ) = pair.getReserves();
        return (reserves0, reserves1);
    }

    function addLiquidity(uint256 deadline) external payable {
        (uint112 reserves0, uint112 reserves1, ) = pair.getReserves();

        uint256 ethAmount = msg.value;

        uint256 amountTokenDesired = (((ethAmount / 2) * reserves1) /
            reserves0);

        swapETHForUSDC(address(this), ethAmount / 2, 0, deadline);

        router.addLiquidityETH{value: ethAmount / 2}(
            usdc,
            amountTokenDesired,
            0,
            ethAmount,
            msg.sender,
            deadline
        );

        // TODO: Refund any weth or usdc back to user
    }

    function lptBalanceOf(address _account) external view returns (uint256) {
        return pair.balanceOf(_account);
    }
}
