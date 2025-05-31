import React, { useState, useEffect } from 'react';
import { getFLRUSDPrice, PriceData } from '../../utils/ftso';
import Image from 'next/image';

interface FLRPriceDisplayProps {
  className?: string;
}

export const FLRPriceDisplay: React.FC<FLRPriceDisplayProps> = ({ className = '' }) => {
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const fetchPrice = async () => {
    try {
      setRefreshing(true);
      setError(false);
      const data = await getFLRUSDPrice();
      setPriceData(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch FLR/USD price:', error);
      setError(true);
      setLoading(false);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPrice();
  }, []);

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-2 bg-white rounded-md border border-gray-200 shadow-sm ${className} group relative`}>
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
        This price is fetched by the FTSO protocol from Flare Network
      </div>
      <Image src="/flr-logo.svg" alt="Flare Logo" width={20} height={20} className="object-contain" />
      <span className="font-medium text-sm text-gray-600">FLR/USD</span>
      
      {/* Price Value */}
      {loading ? (
        <div className="w-16 h-5 bg-gray-200 animate-pulse rounded"></div>
      ) : error ? (
        <span className="font-medium text-red-500 text-sm">Error</span>
      ) : (
        <span className="font-bold text-gray-900">${priceData?.formattedPrice}</span>
      )}
      
      {/* Refresh Button */}
      <button 
        onClick={fetchPrice} 
        disabled={refreshing}
        className="ml-1 p-1 text-gray-400 hover:text-gray-600 rounded-full focus:outline-none"
        title="Refresh price"
      >
        <svg 
          className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
          />
        </svg>
      </button>
    </div>
  );
};

export default FLRPriceDisplay;
