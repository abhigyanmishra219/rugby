'use client';

import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin, Calendar } from 'lucide-react';
import { GalleryItem } from '@/data/types';

interface LightboxModalProps {
  item: GalleryItem | null;
  items: GalleryItem[];
  onClose: () => void;
  onSelect: (item: GalleryItem) => void;
}

export default function LightboxModal({
  item,
  items,
  onClose,
  onSelect
}: LightboxModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!item) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item]);

  if (!item) return null;

  const currentIndex = items.findIndex((i) => i.id === item.id);

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + items.length) % items.length;
    onSelect(items[prevIndex]);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % items.length;
    onSelect(items[nextIndex]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close image viewer"
        className="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev button */}
      <button
        onClick={handlePrev}
        aria-label="Previous image"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/60 hover:bg-emerald-600/80 text-white transition-all border border-white/10"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Next button */}
      <button
        onClick={handleNext}
        aria-label="Next image"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/60 hover:bg-emerald-600/80 text-white transition-all border border-white/10"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Main Image & Caption Container */}
      <div className="max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center">
        <div className="relative rounded-lg overflow-hidden max-h-[75vh] shadow-2xl border border-emerald-900/50">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-auto max-h-[75vh] object-contain"
          />
        </div>

        <div className="mt-4 text-center max-w-2xl px-4">
          <div className="inline-block px-2.5 py-0.5 rounded bg-[#008F65] border border-[#008F65] text-[10px] font-black uppercase tracking-wider text-white mb-2 shadow-xs">
            {item.category}
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">
            {item.title}
          </h3>
          <div className="flex items-center justify-center space-x-4 text-xs text-zinc-400 mt-1">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-orange-400" />
              {item.location}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              {item.date}
            </span>
            <span>•</span>
            <span>{currentIndex + 1} of {items.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
