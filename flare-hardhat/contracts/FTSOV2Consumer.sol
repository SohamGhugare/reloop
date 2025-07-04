// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import {TestFtsoV2Interface} from "@flarenetwork/flare-periphery-contracts/coston2/TestFtsoV2Interface.sol";
import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston2/ContractRegistry.sol";
import {IFeeCalculator} from "@flarenetwork/flare-periphery-contracts/coston2/IFeeCalculator.sol";

contract FtsoV2Consumer {
    bytes21 public constant flrUsdId =
        0x01464c522f55534400000000000000000000000000; // "FLR/USD"

    function getFlrUsdPrice() external view returns (uint256, int8, uint64) {
        /* THIS IS A TEST METHOD, in production use: ftsoV2 = ContractRegistry.getFtsoV2(); */
        TestFtsoV2Interface ftsoV2 = ContractRegistry.getTestFtsoV2();
        /* Your custom feed consumption logic. In this example the values are just returned. */
        return ftsoV2.getFeedById(flrUsdId);
    }
}
