'use client';

import React from 'react';
import { ArrowRight, Shield, Users } from 'lucide-react';
import { Team } from '@/data/types';

interface TeamCardProps {
  team: Team;
}

export default function TeamCard({ team }: TeamCardProps) {
  return (
    <div className="group relative rounded-xl overflow-hidden bg-white border border-[#E1E8E3] hover:border-[#008F65] hover:shadow-lg transition-all duration-300 shadow-xs flex flex-col justify-end min-h-[360px] sm:min-h-[400px]">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-108"
        style={{ backgroundImage: `url(${team.imageUrl})` }}
      />
      
      {/* Dark Gradient Overlay for photographic contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#17211D]/95 via-[#17211D]/70 to-transparent" />

      {/* Top Badge */}
      <div className="absolute top-4 left-4 z-10">
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-white/95 backdrop-blur-md border border-[#E1E8E3] text-[10px] font-black uppercase tracking-wider text-[#008F65] shadow-xs">
          <Shield className="w-3 h-3 text-[#FF7900]" />
          <span>{team.category}</span>
        </span>
      </div>

      {/* Card Content */}
      <div className="relative z-10 p-5 sm:p-6 flex flex-col justify-end space-y-2">
        <div className="text-[11px] font-bold text-[#FF7900] uppercase tracking-widest">
          {team.nickname}
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-[#00B889] transition-colors uppercase leading-tight">
          {team.name}
        </h3>

        <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
          {team.description}
        </p>

        <div className="pt-3 border-t border-white/15 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1.5 text-slate-300">
            <Users className="w-3.5 h-3.5 text-[#00B889]" />
            <span>Squad: {team.squadSize} Players</span>
          </div>

          <a
            href={`/teams?id=${team.id}`}
            className="inline-flex items-center space-x-1 font-black uppercase tracking-wider text-xs text-white group-hover:text-[#FF7900] transition-colors"
          >
            <span>VIEW TEAM</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#FF7900]" />
          </a>
        </div>
      </div>
    </div>
  );
}
