import React from 'react';
import { Calendar, Clock, MapPin, Trophy, Shield } from 'lucide-react';
import { MatchFixture } from '@/data/types';

interface MatchCardProps {
  match: MatchFixture;
}

function formatMatchDate(dateStr: string) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const year = parts[0];
    const monthIndex = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if (months[monthIndex]) {
      return `${day} ${months[monthIndex]} ${year}`;
    }
  }
  return dateStr;
}

export default function MatchCard({ match }: MatchCardProps) {
  const isFinished = match.status === 'Full Time';
  const isLive = match.status === 'Live';

  return (
    <div className="group rounded-2xl bg-white border border-[#E1E8E3] hover:border-[#008F65] hover:shadow-lg transition-all duration-300 p-5 shadow-xs flex flex-col justify-between">
      {/* 1. Tournament Header & Status */}
      <div className="pb-3.5 border-b border-[#E1E8E3]/80 space-y-2">
        <div className="flex items-center justify-between gap-2.5">
          {/* Tournament Name */}
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <Trophy className="w-4 h-4 text-[#FF7900] shrink-0" />
            <span
              className="font-black text-xs text-[#17211D] uppercase tracking-wide truncate"
              title={match.tournament}
            >
              {match.tournament}
            </span>
          </div>

          {/* Status Badge */}
          <span
            className={`shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap ${
              isLive
                ? 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse'
                : isFinished
                ? 'bg-[#EAF7F1] text-[#008F65] border border-[#008F65]/30'
                : 'bg-emerald-50 text-[#008F65] border border-[#008F65]/25'
            }`}
          >
            {match.status}
          </span>
        </div>

        {/* Round / Stage & Division Sub-bar */}
        <div className="flex items-center justify-between gap-2 text-[11px]">
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#FF7900]/10 text-[#FF7900] font-black text-[10px] uppercase tracking-wider truncate max-w-[65%]">
            {match.round}
          </span>
          <span className="text-[10px] font-bold text-[#5F6B65] uppercase tracking-wider shrink-0">
            {match.category}
          </span>
        </div>
      </div>

      {/* 2. Teams & Scoreboard Display */}
      <div className="py-5 flex items-center justify-between gap-3">
        {/* Home Team */}
        <div className="flex-1 min-w-0 text-center sm:text-right flex flex-col items-center sm:items-end">
          <div className="w-8 h-8 rounded-full bg-[#F5F7F5] border border-[#E1E8E3] group-hover:border-[#008F65]/40 flex items-center justify-center mb-1.5 shrink-0 transition-colors">
            <Shield className="w-4 h-4 text-[#008F65]" />
          </div>
          <h4
            className="text-xs sm:text-sm font-black text-[#17211D] uppercase leading-tight line-clamp-2"
            title={match.homeTeam}
          >
            {match.homeTeam}
          </h4>
        </div>

        {/* Center VS / Score Badge */}
        <div className="shrink-0 w-24 py-2 px-1.5 rounded-xl bg-[#F5F7F5] border border-[#E1E8E3] text-center shadow-xs">
          {isFinished ? (
            <div className="flex items-center justify-center space-x-1.5 font-black text-xl sm:text-2xl leading-none">
              <span className={match.homeScore! > match.awayScore! ? 'text-[#008F65]' : 'text-[#17211D]'}>
                {match.homeScore}
              </span>
              <span className="text-[#5F6B65]/60 text-base font-bold">:</span>
              <span className={match.awayScore! > match.homeScore! ? 'text-[#008F65]' : 'text-[#17211D]'}>
                {match.awayScore}
              </span>
            </div>
          ) : isLive ? (
            <div className="flex items-center justify-center space-x-1.5 font-black text-xl leading-none text-rose-600">
              <span>{match.homeScore ?? 0}</span>
              <span className="text-rose-400 text-base">:</span>
              <span>{match.awayScore ?? 0}</span>
            </div>
          ) : (
            <div className="font-black text-sm text-[#FF7900] tracking-wider leading-none">
              VS
            </div>
          )}
          <span className="inline-flex items-center justify-center gap-1 text-[9px] font-bold text-[#5F6B65] uppercase tracking-wider block mt-1.5 whitespace-nowrap">
            {!isFinished && <Clock className="w-2.5 h-2.5 shrink-0 text-[#5F6B65]" />}
            {isFinished ? 'FINAL' : match.time}
          </span>
        </div>

        {/* Away Team */}
        <div className="flex-1 min-w-0 text-center sm:text-left flex flex-col items-center sm:items-start">
          <div className="w-8 h-8 rounded-full bg-[#F5F7F5] border border-[#E1E8E3] group-hover:border-[#FF7900]/40 flex items-center justify-center mb-1.5 shrink-0 transition-colors">
            <Shield className="w-4 h-4 text-[#FF7900]" />
          </div>
          <h4
            className="text-xs sm:text-sm font-black text-[#17211D] uppercase leading-tight line-clamp-2"
            title={match.awayTeam}
          >
            {match.awayTeam}
          </h4>
        </div>
      </div>

      {/* 3. Match Meta (Date, Venue) & Highlight */}
      <div className="pt-3 border-t border-[#E1E8E3]/80 space-y-2">
        <div className="flex items-center justify-between gap-2 text-xs text-[#5F6B65]">
          <div className="flex items-center space-x-1.5 min-w-0 flex-1">
            <MapPin className="w-3.5 h-3.5 text-[#FF7900] shrink-0" />
            <span className="truncate" title={match.venue}>
              {match.venue}
            </span>
          </div>
          <div className="flex items-center space-x-1.5 shrink-0 whitespace-nowrap font-medium text-[#17211D]">
            <Calendar className="w-3.5 h-3.5 text-[#008F65] shrink-0" />
            <span>{formatMatchDate(match.date)}</span>
          </div>
        </div>

        {match.highlight && (
          <div className="pt-2 border-t border-dashed border-[#E1E8E3] flex items-center gap-1.5 text-[11px] text-[#008F65] font-semibold min-w-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#008F65] shrink-0" />
            <span className="truncate italic" title={match.highlight}>
              {match.highlight}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
