"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Explore() {
  const [collections, setCollections] = useState([
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

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % collections.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [collections.length]);

  return (
    <div className="p-4 pb-16 max-w-6xl mx-auto min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center">Explore Collections</h1>
      
      {/* Featured Collection Carousel */}
      <div className="relative h-96 mb-12 overflow-hidden rounded-xl">
        {collections.map((collection, index) => (
          <motion.div
            key={collection.id}
            className="absolute w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentIndex ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <img src={collection.image} alt={collection.name} className="w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
              <h2 className="text-3xl font-bold mb-2">{collection.name}</h2>
              <p className="text-lg mb-4">{collection.description}</p>
              <Link href={`/explore/${collection.id}`} className="bg-white text-black px-6 font-bold py-2 rounded-full hover:bg-opacity-80 transition-colors">
                View Collection
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* All Collections Grid */}
      <h2 className="text-2xl font-semibold mb-6">All Collections</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection) => (
          <Link
            key={collection.id}
            href={`/explore/${collection.id}`}
            className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <img src={collection.image} alt={collection.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{collection.name}</h3>
              <p className="text-gray-400 text-sm">{collection.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
