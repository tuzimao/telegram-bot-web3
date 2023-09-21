// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract LotteryManager is IERC721Receiver, ReentrancyGuard {
    using SafeMath for uint256;
    using Counters for Counters.Counter;
    using Address for address payable;

    struct Lottery {
        address nftContract;
        uint256 tokenId;
        address sender;
        address[] ticketHolders;
        bool isOpen;
    }

    Counters.Counter private _lotteryIds;
    mapping(uint256 => Lottery) public lotteries;
    uint256 public constant TICKET_PRICE = 0.0001 ether;
    uint256 public constant MAX_TICKETS = 10;

    event LotteryCreated(uint256 indexed lotteryId, address indexed sender, address nftContract, uint256 tokenId);
    event TicketPurchased(uint256 indexed lotteryId, address indexed buyer, uint256 numberOfTickets);
    event LotteryClosed(uint256 indexed lotteryId, address winner, uint256 tokenId);

    function buyTickets(uint256 lotteryId, uint256 numberOfTickets) external payable nonReentrant {
        require(lotteries[lotteryId].isOpen, "Lottery is not open");
        require(msg.value == TICKET_PRICE.mul(numberOfTickets), "Incorrect Ether sent");
        require(lotteries[lotteryId].ticketHolders.length.add(numberOfTickets) <= MAX_TICKETS, "Exceeds ticket limit");

        for (uint256 i = 0; i < numberOfTickets; i++) {
            lotteries[lotteryId].ticketHolders.push(msg.sender);
        }

        emit TicketPurchased(lotteryId, msg.sender, numberOfTickets);

        if (lotteries[lotteryId].ticketHolders.length == MAX_TICKETS) {
            _closeLottery(lotteryId);
        }
    }

    function triggerLottery(uint256 lotteryId) external {
        require(lotteries[lotteryId].sender == msg.sender, "Only the NFT sender can trigger this");
        require(lotteries[lotteryId].isOpen, "Lottery is already closed");

        _closeLottery(lotteryId);
    }

    function _closeLottery(uint256 lotteryId) private {
        uint256 winnerIndex = uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty))) % lotteries[lotteryId].ticketHolders.length;
        address winner = lotteries[lotteryId].ticketHolders[winnerIndex];

        IERC721(lotteries[lotteryId].nftContract).safeTransferFrom(address(this), winner, lotteries[lotteryId].tokenId);
        payable(lotteries[lotteryId].sender).sendValue(TICKET_PRICE.mul(lotteries[lotteryId].ticketHolders.length));

        lotteries[lotteryId].isOpen = false;

        emit LotteryClosed(lotteryId, winner, lotteries[lotteryId].tokenId);
    }

    function getOpenLotteries() external view returns (uint256[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i <= _lotteryIds.current(); i++) {
            if (lotteries[i].isOpen) {
                count++;
            }
        }

        uint256[] memory openLotteries = new uint256[](count);
        uint256 index = 0;
        for (uint256 i = 1; i <= _lotteryIds.current(); i++) {
            if (lotteries[i].isOpen) {
                openLotteries[index] = i;
                index++;
            }
        }

        return openLotteries;
    }

    function onERC721Received(address, address from, uint256 tokenId, bytes memory) public virtual override returns (bytes4) {
        _lotteryIds.increment();
        uint256 newLotteryId = _lotteryIds.current();

        lotteries[newLotteryId] = Lottery({
        nftContract: msg.sender,
        tokenId: tokenId,
        sender: from,
        ticketHolders: new address[](0),
        isOpen: true
        });

        emit LotteryCreated(newLotteryId, from, msg.sender, tokenId);

        return this.onERC721Received.selector;
    }
}