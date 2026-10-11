'use client';

import React from 'react';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';
import { NewsItem } from '@/data/types';

interface NewsCardProps {
  news: NewsItem;
  variant?: 'featured' | 'standard' | 'compact';
}

export default function NewsCard({ news, variant = 'standard' }: NewsCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'TOURNAMENT':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'TEAM UPDATE':
        return 'bg-[#EAF7F1] text-[#008F65] border-[#008F65]/30';
      case 'PLAYER':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'DEVELOPMENT':
        return 'bg-emerald-50 text-[#008F65] border-emerald-200';
      case 'SELECTION':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-[#F5F7F5] text-[#5F6B65] border-[#E1E8E3]';
    }
  };

  if (variant === 'featured') {
    return (
      <div className="group relative rounded-xl overflow-hidden bg-white border border-[#E1E8E3] hover:border-[#008F65] hover:shadow-lg transition-all duration-300 shadow-xs flex flex-col justify-end min-h-[440px] lg:min-h-[500px]">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url(${news.imageUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#17211D]/95 via-[#17211D]/75 to-transparent" />

        {/* Content */}
        <div className="relative z-10 p-6 sm:p-8 flex flex-col justify-end space-y-3.5">
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <span className={`px-2.5 py-1 rounded text-[11px] font-black uppercase tracking-wider border ${getCategoryColor(news.category)} shadow-xs`}>
              {news.category}
            </span>
            <div className="flex items-center text-slate-200 text-xs gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#00B889]" />
              <span>{news.date}</span>
            </div>
            <span className="text-slate-400">•</span>
            <div className="flex items-center text-slate-200 text-xs gap-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-[#FF7900]" />
              <span>{news.readTime}</span>
            </div>
          </div>

          <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white group-hover:text-[#00B889] transition-colors leading-tight">
            <a href={`/news?id=${news.id}`}>
              {news.title}
            </a>
          </h3>

          <p className="text-slate-200 text-xs sm:text-sm line-clamp-2 leading-relaxed">
            {news.excerpt}
          </p>

          <div className="pt-2 flex items-center justify-between border-t border-white/20">
            <span className="text-xs text-slate-300 font-medium">
              By <span className="text-white font-semibold">{news.author}</span> • {news.authorRole}
            </span>
            <a
              href={`/news?id=${news.id}`}
              className="inline-flex items-center space-x-1.5 text-xs font-black uppercase tracking-wider text-[#FF7900] hover:text-[#00B889] group-hover:translate-x-1 transition-all"
            >
              <span>READ MORE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group rounded-xl overflow-hidden bg-white border border-[#E1E8E3] hover:border-[#008F65] hover:shadow-md transition-all duration-300 flex flex-col shadow-xs">
      <div className="relative aspect-[16/10] overflow-hidden bg-[#F5F7F5]">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url(${news.imageUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
        <span className={`absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${getCategoryColor(news.category)} backdrop-blur-md shadow-xs`}>
          {news.category}
        </span>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-[11px] text-[#5F6B65] font-medium">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#008F65]" />
              <span>{news.date}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#5F6B65]" />
              <span>{news.readTime}</span>
            </div>
          </div>

          <h3 className="text-base font-extrabold text-[#17211D] group-hover:text-[#008F65] transition-colors leading-snug line-clamp-2">
            <a href={`/news?id=${news.id}`}>
              {news.title}
            </a>
          </h3>

          <p className="text-[#5F6B65] text-xs line-clamp-2 leading-relaxed">
            {news.excerpt}
          </p>
        </div>

        <div className="pt-3 border-t border-[#E1E8E3] flex items-center justify-between">
          <span className="text-[11px] text-[#5F6B65] truncate max-w-[140px]">
            {news.author}
          </span>
          <a
            href={`/news?id=${news.id}`}
            className="inline-flex items-center space-x-1 text-xs font-bold text-[#FF7900] hover:text-[#008F65] transition-colors"
          >
            <span>READ MORE</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
}
