"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Explore() {
  const [collections, setCollections] = useState([
    {
      id: "unique-humans",
      name: "Unique Humans",
      image: "/UH_rectangle.png",
      description: "Unique digital collectibles living on the World blockchain.",
    },
    {
      id: "pudgy-penguins",
      name: "Pudgy Penguins",
      image: "/pudgy-penguins/pudgy-penguins-0.jpeg",
      description: "A delightful collection of adorable penguin NFTs.",
    },
    {
      id: "cubes",
      name: "Cubes",
      image: "/cubes.jpg",
      description: "Unique digital collectibles living on the World blockchain.",
    },
    {
      id: "circles",
      name: "Circles",
      image: "/circle.jpg",
      description: "The premier community for the World blockchain.",
    },
    // add more collections here
  ]);

  return (
    <div className="flex flex-col items-center min-h-screen px-4">
      <div className="w-full flex justify-start">
        <Link href="/" className="px-4 rounded-full text-md font-medium font-twk-lausanne transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 mb-6 bg-white text-black focus:ring-black">
          Back
        </Link>
      </div>
      
      <h1 className="text-4xl font-semi-bold font-twk-lausanne text-center text-custom-black mb-6">
        Explore Collections
      </h1>
      
      <p className="text-md font-extralight text-center text-custom-black mb-4 max-w-xl px-4">
        Discover and explore unique digital collectibles on the World blockchain.
      </p>

      <hr className="w-11/12 max-w-md border-t border-custom-white mb-6 mt-2 mx-8" />

      <motion.div 
        className="grid grid-cols-2 gap-6 w-full max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {collections.map((collection) => (
          <motion.div
            key={collection.id}
            className="bg-white overflow-hidden duration-300 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href={`/explore/${collection.id}`}>
              <img src={collection.image} alt={collection.name} className="w-full h-48 object-cover" />
              <div className="py-4">
                <h2 className="text-md font-semibold mb-2 text-custom-black">{collection.name}</h2>
                <p className="text-sm text-gray-600 mb-2">{collection.description}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

