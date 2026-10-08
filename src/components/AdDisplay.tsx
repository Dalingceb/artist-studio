// @ts-nocheck -- ported from the original app; loose typing kept as-is

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Ad } from '@/types/database';

interface AdDisplayProps {
  position: 'banner' | 'sidebar' | 'inline';
  page: string;
  className?: string;
}

const AdDisplay = ({ position, page, className = '' }: AdDisplayProps) => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    fetchAds();
  }, [position, page]);

  useEffect(() => {
    if (ads.length > 1) {
      const interval = setInterval(() => {
        setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
      }, 5000); // Rotate every 5 seconds

      return () => clearInterval(interval);
    }
  }, [ads.length]);

  const fetchAds = async () => {
    try {
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .eq('position', position)
        .eq('is_active', true)
        .or(`start_date.is.null,start_date.lte.${new Date().toISOString()}`)
        .or(`end_date.is.null,end_date.gte.${new Date().toISOString()}`)
        .contains('pages', [page])
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAds(data || []);
    } catch (error) {
      console.error('Error fetching ads:', error);
    }
  };

  if (ads.length === 0) {
    return null;
  }

  const currentAd = ads[currentAdIndex];

  const handleAdClick = () => {
    if (currentAd.link_url) {
      window.open(currentAd.link_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className={`ad-container ${className}`}>
      <div 
        className={`
          relative overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md
          ${currentAd.link_url ? 'cursor-pointer' : ''}
          ${position === 'banner' ? 'h-32 md:h-40' : ''}
          ${position === 'sidebar' ? 'h-48' : ''}
          ${position === 'inline' ? 'h-24 md:h-32' : ''}
        `}
        onClick={handleAdClick}
      >
        {currentAd.image_url && (
          <img
            src={currentAd.image_url}
            alt={currentAd.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
          <h3 className="text-white font-semibold text-sm md:text-base line-clamp-1">
            {currentAd.title}
          </h3>
          {currentAd.description && (
            <p className="text-white/90 text-xs md:text-sm line-clamp-2 mt-1">
              {currentAd.description}
            </p>
          )}
        </div>

        {ads.length > 1 && (
          <div className="absolute top-2 right-2 flex space-x-1">
            {ads.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentAdIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        <div className="absolute bottom-1 right-1 text-xs text-white/70 bg-black/30 px-1 rounded">
          Ad
        </div>
      </div>
    </div>
  );
};

export default AdDisplay;
