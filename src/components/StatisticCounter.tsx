'use client';

import React, { useState, useEffect, useRef } from 'react';
import { LucideIcon } from 'lucide-react';

interface StatisticCounterProps {
  value: number;
  suffix?: string;
  label: string;
  sublabel?: string;
  icon?: LucideIcon;
  isLoading?: boolean;
}

export default function StatisticCounter({
  value,
  suffix,
  label,
  sublabel,
  icon: Icon,
  isLoading = false,
}: StatisticCounterProps) {
  const [count, setCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || value === 0) {
      setCount(value);
      setHasAnimated(true);
      return;
    }

    // Use IntersectionObserver to animate when entering viewport
    let observer: IntersectionObserver | null = null;

    const startAnimation = () => {
      let startTime: number | null = null;
      const duration = 1200; // 1.2 seconds

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out expo curve for smooth organic deceleration
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentCount = Math.round(easeOut * value);

        setCount(currentCount);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(value); // Guarantee exact final number
          setHasAnimated(true);
        }
      };

      requestAnimationFrame(animate);
    };

    if (typeof IntersectionObserver !== 'undefined' && containerRef.current && !hasAnimated) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            startAnimation();
            observer?.disconnect();
          }
        },
        { threshold: 0.2 }
      );
      observer.observe(containerRef.current);
    } else {
      startAnimation();
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, [value, isLoading, hasAnimated]);

  return (
    <div
      ref={containerRef}
      className="relative p-6 rounded-2xl bg-white border border-[#E1E8E3] hover:border-[#008F65] hover:shadow-lg transition-all duration-300 group shadow-xs"
    >
      <div className="flex items-start justify-between mb-4">
        {Icon && (
          <div className="w-11 h-11 rounded-xl bg-[#EAF7F1] border border-[#008F65]/20 flex items-center justify-center text-[#008F65] group-hover:bg-[#008F65] group-hover:text-white group-hover:scale-105 transition-all">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div className="w-2.5 h-2.5 rounded-full bg-[#008F65] group-hover:bg-[#FF7900] transition-colors" />
      </div>

      <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#17211D] tracking-tight leading-none mb-2 flex items-baseline">
        {isLoading ? (
          <span className="inline-block h-10 w-20 bg-[#F5F7F5] rounded animate-pulse" />
        ) : (
          <span>{count}</span>
        )}
        {!isLoading && suffix && (
          <span className="text-[#FF7900] ml-1 text-2xl sm:text-3xl font-black">{suffix}</span>
        )}
      </div>

      <div className="text-xs sm:text-sm font-black text-[#008F65] uppercase tracking-wider">
        {label}
      </div>

      {sublabel && (
        <div className="text-xs text-[#5F6B65] mt-1.5 font-medium leading-relaxed">
          {sublabel}
        </div>
      )}
    </div>
  );
}
