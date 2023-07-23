// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./Token.sol";

contract DexWAP {
    IERC20 public tokenA;
    IERC20 public tokenB;
    IERC20 public tokenC;

    constructor() {
        tokenA = new Token("tokenA", "TKNA", 1_000_000 * 1E18, msg.sender);

        tokenB = new Token("tokenB", "TKNB", 1_000_000 * 1E18, msg.sender);

        tokenC = new Token("tokenC", "TKNC", 1_000_000 * 1E18, address(this));
    }

    function swap(address token_, uint256 amount) external {
        _swap(address(token_), amount);
    }

    function unswap(address token_, uint256 amount) external {
        _unswap(address(token_), amount);
    }

    function swapAforC(uint256 amount) external {
        _swap(address(tokenA), amount);
    }

    function swapBforC(uint256 amount) external {
        _swap(address(tokenB), amount);
    }

    function unswapCforA(uint256 amount) external {
        _unswap(address(tokenA), amount);
    }

    function unswapCforB(uint256 amount) external {
        _unswap(address(tokenB), amount);
    }

    function _swap(address token_, uint256 amount) private {
        require(
            IERC20(token_).transferFrom(msg.sender, address(this), amount),
            "ERC20: Error on transfer"
        );
        require(tokenC.transfer(msg.sender, amount), "Error");
    }

    function _unswap(address token_, uint256 amount) private {
        require(
            tokenC.transferFrom(msg.sender, address(this), amount),
            "ERC20: Error on transfer"
        );
        require(
            IERC20(token_).transfer(msg.sender, amount),
            "ERC20: Error on transfer"
        );
    }

    function getTokenABalance() public view returns (uint256) {
        return tokenA.balanceOf(address(this));
    }

    function getTokenBBalance() public view returns (uint256) {
        return tokenB.balanceOf(address(this));
    }

    function getTokenCBalance() public view returns (uint256) {
        return tokenC.balanceOf(address(this));
    }
}
