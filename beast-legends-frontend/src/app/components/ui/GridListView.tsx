"use client";
import React, { useEffect, useRef, useState } from "react";

interface CardData {
  id: number | string;
  name: string;
  image: string;
  price: number;
  rarity: string;
  attributes: Record<string, string>;
  listing: any;
  [key: string]: any; // Allow for additional properties
}

interface GridListViewProps {
  data: CardData[];
  columns?: number;
  renderCard?: (item: CardData, isListView: boolean) => React.ReactNode;
  className?: string;
}

const GridListView: React.FC<GridListViewProps> = ({
  data,
  columns = 4,
  renderCard,
  className = "",
}) => {

  // Default card renderer
  const defaultRenderCard = (item: CardData) => (
    <div className="w-full h-full p-4 flex flex-col justify-between">
      <div className="flex flex-col items-start">
        <h3 className="text-white text-lg font-semibold">{item.name}</h3>
        <span className="text-gray-400 text-sm">{item.description}</span>
      </div>
      <div className="flex flex-col items-start gap-1 mt-auto">
        <button className="bg-gray-800 text-white text-xs px-2 py-1 rounded">Variable</button>
        <button className="bg-gray-800 text-white text-xs px-2 py-1 rounded mt-1">Property</button>
      </div>
    </div>
  );

  return (
    <div className={`${className}`}>
        {/* Grid View */}
        <div 
          className="grid gap-6"
          style={{ 
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          }}
        >
          {data.map((item) => (
            <div
              key={item.id}
              className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors duration-200"
              style={{ 
                width: '100%',
                height: 'auto', // Allow height to be determined by content
              }}
            >
              {renderCard ? renderCard(item, false) : defaultRenderCard(item)}
            </div>
          ))}
        </div>
    </div>
  );
};

export default GridListView; 