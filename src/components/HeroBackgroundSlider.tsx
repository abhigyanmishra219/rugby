'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

// Local authentic rugby assets from src/images/
import imgKotdwarSquad from '@/images/Screenshot 2026-10-09 101150.png';
import imgMatchAction from '@/images/Screenshot 2026-10-09 101211.png';
import imgLeadershipAwards from '@/images/Screenshot 2026-10-09 101528.png';
import imgAssociationCheer from '@/images/Screenshot 2026-10-09 101542.png';
import imgGroundContingent from '@/images/Screenshot 2026-10-09 100944.png';

interface Slide {
  id: string;
  image: typeof imgKotdwarSquad;
  alt: string;
  objectPosition?: string;
}

const HERO_SLIDES: Slide[] = [
  {
    id: 'slide-kotdwar-squad',
    image: imgKotdwarSquad,
    alt: 'Uttarakhand Rugby Association state squad and coaching staff on pitch at Kotdwar',
    objectPosition: 'center 40%',
  },
  {
    id: 'slide-match-action',
    image: imgMatchAction,
    alt: 'Live rugby match gameplay with Uttarakhand athletes running and passing ball',
    objectPosition: 'center 35%',
  },
  {
    id: 'slide-leadership-awards',
    image: imgLeadershipAwards,
    alt: 'Uttarakhand Rugby Association annual ceremony and leadership felicitation',
    objectPosition: 'center 30%',
  },
  {
    id: 'slide-association-cheer',
    image: imgAssociationCheer,
    alt: 'Uttarakhand Rugby Association team celebration and state championship honors',
    objectPosition: 'center 35%',
  },
  {
    id: 'slide-ground-contingent',
    image: imgGroundContingent,
    alt: 'Uttarakhand rugby players and officials assembled at Kotdwar ground',
    objectPosition: 'center 45%',
  },
];

export default function HeroBackgroundSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const currentIndexRef = useRef(0);

  // Sync ref with currentIndex
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  // Automatic 10,000ms (10 seconds) interval rotation
  useEffect(() => {
    const intervalId = setInterval(() => {
      const prev = currentIndexRef.current;
      const next = (prev + 1) % HERO_SLIDES.length;
      currentIndexRef.current = next;
      setPreviousIndex(prev);
      setCurrentIndex(next);
    }, 10000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Clear previous slide from layering after 1.5s crossfade transition finishes
  useEffect(() => {
    if (previousIndex === null) return;
    const timeoutId = setTimeout(() => {
      setPreviousIndex(null);
    }, 1500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [previousIndex]);

  return (
    <div 
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0"
      aria-hidden="true"
    >
      {HERO_SLIDES.map((slide, index) => {
        const isCurrent = index === currentIndex;
        const isPrevious = index === previousIndex;

        // Layering logic:
        // Current slide is at z-index 2 fading in.
        // Previous slide remains solid at z-index 1 underneath during crossfade to eliminate blank/dark flash.
        // Inactive slides stay at z-index 0 with opacity 0.
        const zIndex = isCurrent ? 2 : isPrevious ? 1 : 0;
        const isVisible = isCurrent || isPrevious;

        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1200 ease-in-out motion-reduce:transition-none ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ zIndex }}
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              priority={index === 0}
              sizes="100vw"
              quality={85}
              style={{
                objectFit: 'cover',
                objectPosition: slide.objectPosition || 'center center',
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
