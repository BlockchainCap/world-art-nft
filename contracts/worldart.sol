// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WorldArtNFT is ERC721A, Ownable {
    string public immutable appId;
    uint256 public immutable endTime;

    mapping(uint256 => bool) public nullifierHashes;
    mapping(uint256 => string) private _tokenURIs;

    event TokenURIUpdated(uint256 indexed tokenId, string newUri);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _endTime,
        string memory _appId
    ) ERC721A(_name, _symbol) {
        endTime = _endTime;
        appId = _appId;
    }

    function mint(
        address to,
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof,
        string memory tokenURI
    ) public onlyOwner {
        require(block.timestamp <= endTime, "Minting period has ended");
        require(!nullifierHashes[nullifierHash], "Already minted");

        // Note: World ID verification would typically happen here.
        // For this contract, we're just checking the nullifier hash.

        nullifierHashes[nullifierHash] = true;

        uint256 tokenId = _nextTokenId();
        _mint(to, 1);
        _setTokenURI(tokenId, tokenURI);
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal {
        _tokenURIs[tokenId] = _tokenURI;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        return _tokenURIs[tokenId];
    }

    function updateTokenURI(uint256 tokenId, string memory newURI) public onlyOwner {
        require(_exists(tokenId), "Token does not exist");
        _setTokenURI(tokenId, newURI);
        emit TokenURIUpdated(tokenId, newURI);
    }

    function transferContractOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner is the zero address");
        _transferOwnership(newOwner);
        emit OwnershipTransferred(owner(), newOwner);
    }
}
