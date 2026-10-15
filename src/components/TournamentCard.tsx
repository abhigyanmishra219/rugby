'use client';

import React, { useMemo } from 'react';
import { Calendar, Clock, MapPin, Trophy, Users, ShieldCheck } from 'lucide-react';
import { UpcomingTournament, getTournamentStatus } from '@/data/tournaments';

interface TournamentCardProps {
  tournament: UpcomingTournament;
}

export default function TournamentCard({ tournament }: TournamentCardProps) {
  // Compute dynamic IST status
  const currentStatus = useMemo(() => {
    return getTournamentStatus(
      tournament.startDate,
      tournament.endDate,
      '08:00',
      '17:00'
    );
  }, [tournament.startDate, tournament.endDate]);

  const isLive = currentStatus === 'LIVE';
  const isCompleted = currentStatus === 'COMPLETED';

  return (
    <div
      id={`tournament-${tournament.id}`}
      className="group rounded-2xl bg-white border border-[#E1E8E3] hover:border-[#008F65] hover:shadow-lg transition-all duration-300 p-5 shadow-xs flex flex-col justify-between relative overflow-hidden"
    >
      {/* Subtle Top Brand Accent Strip */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#008F65] via-[#00B889] to-[#FF7900]" />

      {/* 1. Header: Organizer & Dynamic Status Badge */}
      <div className="pb-3 border-b border-[#E1E8E3]/80 space-y-2">
        <div className="flex items-center justify-between gap-2.5">
          {/* Organizer Badge */}
          <div className="flex items-center space-x-1.5 min-w-0 flex-1">
            <Trophy className="w-4 h-4 text-[#FF7900] shrink-0" />
            <span
              className="font-bold text-[11px] text-[#5F6B65] uppercase tracking-wide truncate"
              title={tournament.organizer}
            >
              {tournament.organizer}
            </span>
          </div>

          {/* Status Badge */}
          <span
            className={`shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap ${
              isLive
                ? 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse'
                : isCompleted
                ? 'bg-zinc-100 text-zinc-600 border border-zinc-200'
                : 'bg-[#EAF7F1] text-[#008F65] border border-[#008F65]/30'
            }`}
          >
            {currentStatus}
          </span>
        </div>
      </div>

      {/* 2. Main Tournament Body: Name, Date & Venue */}
      <div className="py-4 space-y-3.5">
        {/* Prominent Tournament Name */}
        <div>
          <h3 className="text-base sm:text-lg font-black text-[#17211D] uppercase leading-tight tracking-tight group-hover:text-[#008F65] transition-colors">
            {tournament.name.toUpperCase()}
          </h3>
        </div>

        {/* Prominent Date Banner */}
        <div className="flex items-center space-x-2.5 bg-[#F5F7F5] border border-[#E1E8E3] rounded-xl px-3 py-2">
          <div className="w-8 h-8 rounded-lg bg-[#EAF7F1] border border-[#008F65]/20 flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4 text-[#008F65]" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-[#5F6B65] uppercase tracking-wider">
              OFFICIAL DATES
            </div>
            <div className="text-xs sm:text-sm font-black text-[#17211D] uppercase tracking-wide">
              {tournament.dateDisplayUpper}
            </div>
          </div>
        </div>

        {/* Venue with Pin */}
        <div className="flex items-start space-x-2 text-xs text-[#17211D] font-semibold">
          <span className="text-[#FF7900] text-sm leading-none shrink-0 mt-0.5">📍</span>
          <span className="leading-snug" title={tournament.venue}>
            {tournament.venueShort}
          </span>
        </div>

        {/* Categories & Time Block */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-dashed border-[#E1E8E3]">
          {/* Categories */}
          <div className="flex items-center space-x-2 bg-[#FAFBF9] rounded-lg p-2 border border-[#E1E8E3]/60">
            <Users className="w-3.5 h-3.5 text-[#008F65] shrink-0" />
            <div className="text-[11px] leading-tight min-w-0">
              <span className="font-black text-[#17211D]">Categories: </span>
              <span className="text-[#5F6B65] font-bold">{tournament.categoriesDisplay}</span>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-center space-x-2 bg-[#FAFBF9] rounded-lg p-2 border border-[#E1E8E3]/60">
            <Clock className="w-3.5 h-3.5 text-[#FF7900] shrink-0" />
            <div className="text-[11px] leading-tight min-w-0">
              <span className="font-black text-[#17211D]">Time: </span>
              <span className="text-[#5F6B65] font-bold">{tournament.timeDisplay}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Footer Meta */}
      <div className="pt-3 border-t border-[#E1E8E3]/80 flex items-center justify-between text-[11px] text-[#5F6B65]">
        <div className="flex items-center space-x-1.5 text-[#008F65] font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          <span>Official State Event</span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#5F6B65]">
          Haridwar, UK
        </span>
      </div>
    </div>
  );
}
