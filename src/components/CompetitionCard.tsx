'use client';

import React from 'react';
import { MapPin, Trophy, Users, ArrowRight, Calendar, Shield } from 'lucide-react';
import { Competition } from '@/data/types';

interface CompetitionCardProps {
  competition: Competition;
}

export default function CompetitionCard({ competition }: CompetitionCardProps) {
  const isCompleted = competition.status === 'Completed';

  return (
    <div className="group rounded-xl bg-white border border-[#E1E8E3] hover:border-[#008F65] hover:shadow-md transition-all duration-300 p-5 sm:p-6 flex flex-col justify-between shadow-xs relative overflow-hidden">
      {/* Top Accent Strip */}
      <div className={`absolute top-0 inset-x-0 h-1 ${isCompleted ? 'bg-zinc-300' : 'bg-gradient-to-r from-[#008F65] via-[#00B889] to-[#FF7900]'}`}></div>

      <div>
        {/* Date block & status pill */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex flex-col items-center justify-center bg-[#EAF7F1] border border-[#008F65]/20 rounded-lg px-3.5 py-2 text-center min-w-[65px] shadow-xs group-hover:scale-105 transition-transform">
              <span className="text-xl sm:text-2xl font-black text-[#17211D] leading-none tracking-tight">
                {competition.dayDisplay}
              </span>
              <span className="text-[10px] font-black uppercase text-[#008F65] tracking-wider mt-0.5">
                {competition.monthDisplay}
              </span>
            </div>
            <div>
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#EAF7F1] text-[#008F65] border border-[#008F65]/20">
                {competition.format}
              </span>
              <div className="text-[11px] font-semibold text-[#5F6B65] mt-1">
                {competition.category}
              </div>
            </div>
          </div>

          <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded tracking-wider border ${
            competition.status === 'Live / Ongoing' 
              ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
              : competition.status === 'Completed'
              ? 'bg-[#F5F7F5] text-[#5F6B65] border-[#E1E8E3]'
              : 'bg-[#EAF7F1] text-[#008F65] border-[#008F65]/30'
          }`}>
            {competition.status}
          </span>
        </div>

        {/* Title & subtitle */}
        <h3 className="text-lg sm:text-xl font-black text-[#17211D] group-hover:text-[#008F65] transition-colors leading-snug uppercase mb-2">
          <a href={`/competitions?id=${competition.id}`}>
            {competition.name}
          </a>
        </h3>

        <p className="text-xs text-[#5F6B65] line-clamp-2 mb-4 leading-relaxed">
          {competition.description}
        </p>

        {/* Venue and Location Details */}
        <div className="space-y-1.5 py-3 border-y border-[#E1E8E3] text-xs text-[#5F6B65]">
          <div className="flex items-center space-x-2">
            <MapPin className="w-3.5 h-3.5 text-[#FF7900] shrink-0" />
            <span className="font-semibold text-[#17211D]">{competition.venue}</span>
          </div>
          <div className="flex items-center justify-between text-[#5F6B65] pl-5 text-[11px]">
            <span>{competition.location}</span>
            <span className="text-[#008F65] font-semibold">{competition.registeredTeamsCount} Teams</span>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="pt-4 flex items-center justify-between">
        <a
          href={`/competitions?id=${competition.id}`}
          className="text-xs font-black uppercase tracking-wider text-[#FF7900] hover:text-[#008F65] flex items-center gap-1.5 transition-colors group/cta"
        >
          <span>VIEW DETAILS</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/cta:translate-x-1 transition-transform" />
        </a>

        <a
          href="/register"
          className="text-[11px] font-bold text-[#5F6B65] hover:text-[#008F65] transition-colors"
        >
          Team Entry →
        </a>
      </div>
    </div>
  );
}
