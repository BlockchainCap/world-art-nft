import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface NFTModalProps {
  nft: {
    id: number;
    name: string;
    image: string;
    tokenId?: string;
  };
  onClose: () => void;
}

export const NFTModal: React.FC<NFTModalProps> = ({ nft, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg max-w-2xl w-full mx-4">
        <div className="flex justify-end mb-2">
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 mb-4 md:mb-0 md:mr-4">
            <Image src={nft.image} alt={nft.name} width={500} height={500} className="rounded-lg w-full h-auto" />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-2xl font-bold mb-2">{nft.name}</h2>
            <p className="mb-2">ID: {nft.id}</p>
            {nft.tokenId && (
              <p className="mb-4">
                Token ID: {nft.tokenId}
              </p>
            )}
            <Link href={`https://etherscan.io/token/${nft.tokenId}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
              View Onchain
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};