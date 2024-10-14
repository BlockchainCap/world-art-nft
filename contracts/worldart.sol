// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@worldcoin/world-id-contracts/src/interfaces/IWorldID.sol";

contract WorldArtNFT is ERC721A, Ownable {
    IWorldID public immutable worldId;
    uint256 public immutable externalNullifierHash;
    uint256 public immutable groupId;
    uint256 public immutable endTime;

    mapping(uint256 => bool) public nullifierHashes;
    mapping(uint256 => string) private _tokenURIs;

    event TokenURIUpdated(uint256 indexed tokenId, string newUri);

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _endTime,
        IWorldID _worldId,
        uint256 _groupId,
        string memory _actionId
    ) ERC721A(_name, _symbol) {
        endTime = _endTime;
        worldId = _worldId;
        groupId = _groupId;
        externalNullifierHash = abi.encodePacked(abi.encodePacked(_actionId).hashToField(), groupId).hashToField();
    }

    function mint(
        address signal,
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof,
        string memory tokenURI
    ) public onlyOwner {
        require(block.timestamp <= endTime, "Minting period has ended");
        require(!nullifierHashes[nullifierHash], "Already minted");

        worldId.verifyProof(
            root,
            groupId,
            abi.encodePacked(signal).hashToField(),
            nullifierHash,
            externalNullifierHash,
            proof
        );

        nullifierHashes[nullifierHash] = true;

        uint256 tokenId = _nextTokenId();
        _mint(signal, 1);
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
}

