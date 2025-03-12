"use client";
import React, { useEffect, useRef, useState } from "react";

interface CardData {
  id: number | string;
  name: string;
  description: string;
  [key: string]: any; // Allow for additional properties
}

interface GridListViewProps {
  data: CardData[];
  columns?: number;
  cardWidth?: number;
  renderCard?: (item: CardData, isListView: boolean) => React.ReactNode;
  className?: string;
}

const GridListView: React.FC<GridListViewProps> = ({
  data,
  columns = 4,
  cardWidth = 300, // Default width for a 2:3 ratio
  renderCard,
  className = "",
}) => {
  const [isListView, setIsListView] = useState(false);

  // Default card renderer
  const defaultRenderCard = (item: CardData, isListView: boolean) => (
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
      <div className="flex justify-end items-center gap-4 mb-6">
        <button 
          className={`flex justify-center items-center w-10 h-10 rounded-full border border-slate-500 p-2 cursor-pointer text-slate-500 transition-colors duration-300 outline-none bg-transparent hover:bg-slate-800 hover:text-white ${!isListView ? 'bg-slate-800 text-white' : ''}`}
          onClick={() => setIsListView(false)}
          disabled={!isListView}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z" />
          </svg>
        </button>
        <button 
          className={`flex justify-center items-center w-10 h-10 rounded-full border border-slate-500 p-2 cursor-pointer text-slate-500 transition-colors duration-300 outline-none bg-transparent hover:bg-slate-800 hover:text-white ${isListView ? 'bg-slate-800 text-white' : ''}`}
          onClick={() => setIsListView(true)}
          disabled={isListView}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
          </svg>
        </button>
      </div>
      
      {isListView ? (
        // List View
        <div className="flex flex-col gap-4">
          {data.map((item) => (
            <div
              key={item.id}
              className="w-full bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors duration-200"
              style={{ height: '150px' }}
            >
              {renderCard ? renderCard(item, true) : defaultRenderCard(item, true)}
            </div>
          ))}
        </div>
      ) : (
        // Grid View
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
                maxWidth: `${cardWidth}px`
              }}
            >
              {renderCard ? renderCard(item, false) : defaultRenderCard(item, false)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GridListView; 