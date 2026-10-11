'use client';

import React from 'react';
import { Shield, MapPin, Award, ArrowRight } from 'lucide-react';
import { Player } from '@/data/types';

interface PlayerCardProps {
  player: Player;
  onSelect?: (player: Player) => void;
}

export default function PlayerCard({ player, onSelect }: PlayerCardProps) {
  return (
    <div className="group rounded-xl overflow-hidden bg-white border border-[#E1E8E3] hover:border-[#008F65] hover:shadow-md transition-all duration-300 shadow-xs flex flex-col justify-between">
      {/* Player Image with Jersey Number overlay */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#F5F7F5]">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url(${player.imageUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

        {/* Jersey Number Stamp */}
        <div className="absolute top-3 right-3 w-10 h-10 rounded-lg bg-white/95 border border-[#E1E8E3] backdrop-blur-md flex items-center justify-center shadow-xs">
          <span className="text-base font-black text-[#FF7900]">
            #{player.jerseyNumber}
          </span>
        </div>

        {/* Position Tag */}
        <div className="absolute bottom-3 left-3">
          <span className="inline-block px-2.5 py-1 rounded bg-[#008F65] shadow-xs text-[10px] font-black uppercase tracking-wider text-white">
            {player.position}
          </span>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center space-x-1.5 text-xs text-[#FF7900] font-bold uppercase tracking-wider mb-1">
            <MapPin className="w-3 h-3 text-[#FF7900] shrink-0" />
            <span>{player.district} District</span>
          </div>

          <h3 className="text-lg font-black text-[#17211D] group-hover:text-[#008F65] transition-colors uppercase leading-snug">
            {player.name}
          </h3>

          <p className="text-xs text-[#5F6B65] line-clamp-1 mt-0.5">
            {player.team}
          </p>
        </div>

        {/* Mini Stats Grid */}
        <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-lg bg-[#F5F7F5] border border-[#E1E8E3] text-center">
          <div>
            <div className="text-[10px] text-[#5F6B65] font-bold uppercase">CAPS</div>
            <div className="text-xs font-black text-[#17211D]">{player.caps}</div>
          </div>
          <div>
            <div className="text-[10px] text-[#5F6B65] font-bold uppercase">TRIES</div>
            <div className="text-xs font-black text-[#FF7900]">{player.tries}</div>
          </div>
          <div>
            <div className="text-[10px] text-[#5F6B65] font-bold uppercase">POINTS</div>
            <div className="text-xs font-black text-[#008F65]">{player.points}</div>
          </div>
        </div>

        {/* CTA */}
        <div className="pt-2 border-t border-[#E1E8E3] flex items-center justify-between">
          <button
            onClick={() => onSelect ? onSelect(player) : window.location.href = `/players?id=${player.id}`}
            className="w-full py-2 rounded bg-[#EAF7F1] hover:bg-[#008F65] hover:text-white border border-[#008F65]/20 text-[#008F65] text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
          >
            <span>VIEW PLAYER PROFILE</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
