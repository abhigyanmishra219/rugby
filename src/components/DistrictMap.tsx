'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Users, Trophy, Shield, Building, Award, ChevronRight } from 'lucide-react';
import { DistrictData } from '@/data/types';
import { districtsData } from '@/data/districts';

export default function DistrictMap() {
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictData>(districtsData[0]);
  const [filterDivision, setFilterDivision] = useState<'ALL' | 'Garhwal' | 'Kumaon'>('ALL');
  const [playerCount, setPlayerCount] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/players/count')
      .then(r => r.json())
      .then(d => {
        if (d.success && typeof d.count === 'number') {
          setPlayerCount(d.count);
        }
      })
      .catch(() => {});
  }, []);

  const filteredDistricts = districtsData.filter(d => 
    filterDivision === 'ALL' ? true : d.division === filterDivision
  );

  return (
    <div className="rounded-2xl bg-white border border-[#E1E8E3] p-6 sm:p-8 lg:p-10 shadow-md relative overflow-hidden">
      {/* Decorative subtle ambient background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#008F65]/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Header controls & Division filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-[#E1E8E3]">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-[#008F65] mb-2">
            <span className="w-2 h-2 rounded-full bg-[#FF7900] animate-pulse"></span>
            <span>DEVBHOOMI RUGBY NETWORK</span>
          </div>
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#17211D] uppercase tracking-tight">
            13 DISTRICTS • 2 DIVISIONS • ONE RUGBY FAMILY
          </h3>
          <p className="text-xs sm:text-sm text-[#5F6B65] mt-1 max-w-xl">
            Click any district to explore grassroots development, registered clubs, active athletes, and regional tournament grounds.
          </p>
        </div>

        {/* Division Filter Tabs */}
        <div className="flex items-center space-x-2 bg-[#F5F7F5] p-1.5 rounded-lg border border-[#E1E8E3] self-start md:self-auto">
          {(['ALL', 'Garhwal', 'Kumaon'] as const).map((div) => (
            <button
              key={div}
              onClick={() => setFilterDivision(div)}
              className={`px-3 py-1.5 rounded text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                filterDivision === div
                  ? 'bg-[#008F65] text-white shadow-xs'
                  : 'text-[#5F6B65] hover:text-[#17211D]'
              }`}
            >
              {div === 'ALL' ? 'ALL 13 DISTRICTS' : `${div} DIVISION`}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
        {/* Left Side: District Grid & Visual Nodes */}
        <div className="lg:col-span-7 space-y-4">
          <div className="text-xs font-black text-[#5F6B65] uppercase tracking-wider flex items-center justify-between">
            <span>SELECT DISTRICT ({filteredDistricts.length})</span>
            <span className="text-[#FF7900] text-[11px]">ACTIVE NODES</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {filteredDistricts.map((district) => {
              const isSelected = selectedDistrict.id === district.id;
              return (
                <button
                  key={district.id}
                  onClick={() => setSelectedDistrict(district)}
                  className={`p-3 rounded-lg text-left transition-all duration-200 border flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-[#EAF7F1] border-[#008F65] text-[#17211D] shadow-xs scale-[1.02]'
                      : 'bg-[#F5F7F5] border-[#E1E8E3] text-[#17211D] hover:border-[#008F65] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <span className="text-[10px] font-black uppercase text-[#008F65] px-1.5 py-0.5 rounded bg-white border border-[#E1E8E3]">
                      {district.division}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-[#FF7900] ring-4 ring-[#FF7900]/20' : 'bg-[#008F65]'}`}></span>
                  </div>
                  <div className="font-black text-xs sm:text-sm uppercase tracking-tight text-[#17211D] truncate">
                    {district.name}
                  </div>
                  <div className="text-[11px] text-[#5F6B65] mt-1 flex items-center justify-between">
                    <span>{district.clubsCount} Clubs</span>
                    <span className="text-[#008F65] font-semibold">{district.registeredPlayers} Pl.</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Stats Ribbon */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#E1E8E3]">
            <div className="p-3 rounded-lg bg-[#F5F7F5] border border-[#E1E8E3] text-center">
              <div className="text-lg font-black text-[#17211D]">45+</div>
              <div className="text-[10px] font-bold text-[#5F6B65] uppercase">AFFILIATED CLUBS</div>
            </div>
            <div className="p-3 rounded-lg bg-[#F5F7F5] border border-[#E1E8E3] text-center">
              <div className="text-lg font-black text-[#008F65]">
                {playerCount !== null ? playerCount : '—'}
              </div>
              <div className="text-[10px] font-bold text-[#5F6B65] uppercase">APPROVED PLAYERS</div>
            </div>
            <div className="p-3 rounded-lg bg-[#F5F7F5] border border-[#E1E8E3] text-center">
              <div className="text-lg font-black text-[#FF7900]">28</div>
              <div className="text-[10px] font-bold text-[#5F6B65] uppercase">REGIONAL ACADEMIES</div>
            </div>
          </div>
        </div>

        {/* Right Side: Active District Detailed Spotlight Card */}
        <div className="lg:col-span-5">
          <div className="h-full rounded-xl bg-[#F5F7F5] border border-[#E1E8E3] p-6 flex flex-col justify-between shadow-xs relative">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#E1E8E3] pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#FF7900] bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                    {selectedDistrict.division} DIVISION HQ
                  </span>
                  <h4 className="text-2xl font-black text-[#17211D] uppercase tracking-tight mt-1.5">
                    {selectedDistrict.name}
                  </h4>
                </div>
                <div className="w-12 h-12 rounded-lg bg-[#EAF7F1] border border-[#008F65]/20 flex items-center justify-center text-[#008F65]">
                  <MapPin className="w-6 h-6 text-[#FF7900]" />
                </div>
              </div>

              <p className="text-xs text-[#5F6B65] leading-relaxed">
                {selectedDistrict.description}
              </p>

              {/* District Key Metrics */}
              <div className="grid grid-cols-2 gap-3 py-2">
                <div className="p-3 rounded-lg bg-white border border-[#E1E8E3]">
                  <div className="flex items-center space-x-1.5 text-[#5F6B65] text-xs mb-1">
                    <Shield className="w-3.5 h-3.5 text-[#008F65]" />
                    <span>Clubs & Units</span>
                  </div>
                  <div className="text-xl font-black text-[#17211D]">{selectedDistrict.clubsCount}</div>
                </div>

                <div className="p-3 rounded-lg bg-white border border-[#E1E8E3]">
                  <div className="flex items-center space-x-1.5 text-[#5F6B65] text-xs mb-1">
                    <Users className="w-3.5 h-3.5 text-[#FF7900]" />
                    <span>Registered Players</span>
                  </div>
                  <div className="text-xl font-black text-[#008F65]">{selectedDistrict.registeredPlayers}</div>
                </div>

                <div className="p-3 rounded-lg bg-white border border-[#E1E8E3]">
                  <div className="flex items-center space-x-1.5 text-[#5F6B65] text-xs mb-1">
                    <Building className="w-3.5 h-3.5 text-[#00B889]" />
                    <span>School Academies</span>
                  </div>
                  <div className="text-xl font-black text-[#17211D]">{selectedDistrict.academiesCount}</div>
                </div>

                <div className="p-3 rounded-lg bg-white border border-[#E1E8E3]">
                  <div className="flex items-center space-x-1.5 text-[#5F6B65] text-xs mb-1">
                    <Trophy className="w-3.5 h-3.5 text-[#FF7900]" />
                    <span>Annual Events</span>
                  </div>
                  <div className="text-xl font-black text-[#17211D]">{selectedDistrict.annualEvents}</div>
                </div>
              </div>

              {/* District Venues & Spotlight */}
              <div className="space-y-2 pt-2 border-t border-[#E1E8E3] text-xs">
                <div>
                  <span className="text-[11px] font-bold text-[#5F6B65] uppercase block mb-1">KEY TOURNAMENT GROUNDS:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedDistrict.keyGrounds.map((ground) => (
                      <span key={ground} className="px-2 py-0.5 rounded bg-white border border-[#E1E8E3] text-[#17211D] text-[11px]">
                        {ground}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-[11px] font-bold text-[#5F6B65] uppercase block">DISTRICT SPOTLIGHT PLAYER:</span>
                  <span className="text-xs font-black text-[#FF7900]">
                    {selectedDistrict.spotlightPlayer}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <a
                href="/register"
                className="w-full py-2.5 rounded-lg bg-[#008F65] hover:bg-[#007553] text-white font-black uppercase text-xs tracking-wider transition-all flex items-center justify-center space-x-1.5 shadow-xs"
              >
                <span>REGISTER WITH {selectedDistrict.name.toUpperCase()} RUGBY</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
