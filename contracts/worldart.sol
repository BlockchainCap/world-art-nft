// SPDX-License-Identifier: MIT

// Artist: Qian Qian + Spongenuity

// Unique Humans is a generative portrait collection inspired by anonymous proof of human online. Using generative AI and coding, unique abstract portrait images are generated on World Chain for a limited time and each real human is entitled to one free edition.

pragma solidity ^0.8.9;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WorldArtNFT is ERC721A, Ownable {

    uint256 public immutable endTime;

    mapping(uint256 => bool) public nullifierHashes;
    mapping(uint256 => string) private _tokenURIs;

    event TokenURIUpdated(uint256 indexed tokenId, string newUri);

    struct NFTMetadata {
        string artist;
        string description;
    }

    mapping(uint256 => NFTMetadata) private _tokenMetadata;

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

        nullifierHashes[nullifierHash] = true;

        uint256 tokenId = _nextTokenId();
        _mint(to, 1);
        _setTokenURI(tokenId, _tokenURI);

        // Set the metadata for the newly minted token
        _tokenMetadata[tokenId] = NFTMetadata({
            artist: "Qian Qian + Spongenuity",
            description: "Unique Humans is a generative portrait collection inspired by anonymous proof of human online. Using generative AI and coding, unique abstract portrait images are generated on World Chain for a limited time and each real human is entitled to one free edition."
        });
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal {
        _tokenURIs[tokenId] = _tokenURI;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        
        NFTMetadata memory metadata = _tokenMetadata[tokenId];
        
        // Create a JSON string with the token URI and metadata
        string memory json = string(abi.encodePacked(
            '{"image": "', _tokenURIs[tokenId], '",',
            '"artist": "', metadata.artist, '",',
            '"description": "', metadata.description, '"}'
        ));

        // Encode the JSON string in base64
        string memory base64Json = Base64.encode(bytes(json));
        
        // Return the complete tokenURI
        return string(abi.encodePacked("data:application/json;base64,", base64Json));
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

// Add this helper library for Base64 encoding
library Base64 {
    string internal constant TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    function encode(bytes memory data) internal pure returns (string memory) {
        if (data.length == 0) return "";

        // Load the table into memory
        string memory table = TABLE;

        // Encoding takes 3 bytes chunks of binary data from `bytes` data parameter
        // and split into 4 numbers of 6 bits.
        // The final Base64 length should be `bytes` data length multiplied by 4/3 rounded up
        // - `data.length + 2`  -> Round up
        // - `/ 3`              -> Number of 3-bytes chunks
        // - `4 *`              -> 4 characters for each chunk
        string memory result = new string(4 * ((data.length + 2) / 3));

        assembly {
            // Prepare the lookup table (skip the first "length" byte)
            let tablePtr := add(table, 1)

            // Prepare result pointer, jump over length
            let resultPtr := add(result, 32)

            // Run over the input, 3 bytes at a time
            for {
                let dataPtr := data
                let endPtr := add(data, mload(data))
            } lt(dataPtr, endPtr) {

            } {
                // Advance 3 bytes
                dataPtr := add(dataPtr, 3)
                let input := mload(dataPtr)

                // To write each character, shift the 3 bytes (18 bits) chunk
                // 4 times in blocks of 6 bits for each character (18, 12, 6, 0)
                // and apply logical AND with 0x3F which is the number of
                // the previous character in the ASCII table prior to the Base64 Table
                // The result is then added to the table to get the character to write,
                // and finally write it in the result pointer but with a left shift
                // of 256 (1 byte) - 8 (1 ASCII char) = 248 bits

                mstore8(resultPtr, mload(add(tablePtr, and(shr(18, input), 0x3F))))
                resultPtr := add(resultPtr, 1) // Advance

                mstore8(resultPtr, mload(add(tablePtr, and(shr(12, input), 0x3F))))
                resultPtr := add(resultPtr, 1) // Advance

                mstore8(resultPtr, mload(add(tablePtr, and(shr(6, input), 0x3F))))
                resultPtr := add(resultPtr, 1) // Advance

                mstore8(resultPtr, mload(add(tablePtr, and(input, 0x3F))))
                resultPtr := add(resultPtr, 1) // Advance
            }

            // When data `bytes` is not exactly 3 bytes long
            // it is padded with `=` characters at the end
            switch mod(mload(data), 3)
            case 1 {
                mstore8(sub(resultPtr, 1), 0x3d)
                mstore8(sub(resultPtr, 2), 0x3d)
            }
            case 2 { mstore8(sub(resultPtr, 1), 0x3d) }
        }

        return result;
    }
}