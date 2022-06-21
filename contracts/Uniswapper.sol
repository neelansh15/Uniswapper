// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;

import "./IUniswapV2Router02.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Goerli
contract Uniswapper {
    address public uniswapRouter02 =
        0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    address public usdc = 0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C;

    IUniswapV2Router02 private router;

    constructor() {
        router = IUniswapV2Router02(uniswapRouter02);
    }

    function ethAddress() external view returns (address) {
        return router.WETH();
    }

    function uniswapFactory() external view returns (address) {
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
        external
        payable
    {
        address[] memory path = new address[](2);
        path[0] = router.WETH();
        path[1] = usdc;
        router.swapExactETHForTokens{value: msg.value}(
            amountOutMin,
            path,
            msg.sender,
            deadline
        );
    }
}
