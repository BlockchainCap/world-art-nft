// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WorldArtNFT is ERC721A, Ownable {
    uint256 public immutable endTime;

    mapping(uint256 => bool) public nullifierHashes;
    mapping(uint256 => string) private _tokenURIs;

    event TokenURIUpdated(uint256 indexed tokenId, string newUri);

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _endTime,
        address initialOwner
    ) ERC721A(_name, _symbol) Ownable(initialOwner) {
        endTime = _endTime;
    }

    function mint(
        address to,
        uint256 nullifierHash,
        string memory _tokenURI
    ) public onlyOwner {
        require(block.timestamp <= endTime, "Minting period has ended");
        require(!nullifierHashes[nullifierHash], "Already minted");

        // Note: World ID verification would typically happen here.
        // For this contract, we're just checking the nullifier hash.

        nullifierHashes[nullifierHash] = true;

        uint256 tokenId = _nextTokenId();
        _mint(to, 1);
        _setTokenURI(tokenId, _tokenURI);
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
        transferOwnership(newOwner);
    }

    function getOwnedTokens(address owner) public view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(owner);
        uint256[] memory result = new uint256[](tokenCount);
        uint256 index = 0;
        uint256 totalSupply = totalSupply();

        for (uint256 tokenId = 0; tokenId < totalSupply; tokenId++) {
            if (ownerOf(tokenId) == owner) {
                result[index] = tokenId;
                index++;
            }
        }
        return result;
    }
}
