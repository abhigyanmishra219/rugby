import React from 'react';
import { Shield, Award } from 'lucide-react';
import { CommitteeMember } from '@/data/types';

interface CommitteeMemberCardProps {
  member: CommitteeMember;
}

export default function CommitteeMemberCard({ member }: CommitteeMemberCardProps) {
  const isPresident = member.role.toLowerCase() === 'president';
  const isGeneralSecretary = member.role.toLowerCase() === 'general secretary';
  const isTreasurer = member.role.toLowerCase() === 'treasurer';
  const isKeyOfficer = isPresident || isGeneralSecretary || isTreasurer || member.isExecutive;

  return (
    <div className="bg-white border border-slate-200/90 hover:border-emerald-500/60 hover:shadow-md transition-all rounded-2xl p-6 flex flex-col justify-between shadow-xs group relative overflow-hidden">
      {/* Top accent line */}
      <div className={`h-1 w-full absolute top-0 left-0 transition-colors ${
        isPresident 
          ? 'bg-gradient-to-r from-amber-500 via-emerald-600 to-emerald-800' 
          : isKeyOfficer 
          ? 'bg-gradient-to-r from-emerald-700 to-[#0f2744]' 
          : 'bg-slate-200 group-hover:bg-emerald-600'
      }`} />

      <div className="space-y-4 pt-1">
        {/* Top row: Avatar & Role Badge */}
        <div className="flex items-center justify-between gap-3">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-800 via-emerald-900 to-[#0f2744] text-white flex items-center justify-center font-black text-lg tracking-wider border-2 border-emerald-100/90 shadow-inner shrink-0 group-hover:scale-105 transition-transform">
            <span>{member.initials}</span>
          </div>

          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
            isPresident
              ? 'bg-amber-100 text-amber-900 border border-amber-300'
              : isKeyOfficer
              ? 'bg-[#0f2744] text-white shadow-xs'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          }`}>
            {isPresident && <Award className="w-3.5 h-3.5 text-amber-600" />}
            {member.role}
          </span>
        </div>

        {/* Name */}
        <div>
          <h4 className="text-lg font-black text-[#0f2744] uppercase tracking-tight group-hover:text-emerald-800 transition-colors">
            {member.name}
          </h4>
          <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mt-1">
            <Shield className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>Uttarakhand Rugby Association</span>
          </div>
        </div>
      </div>

      {/* Card Footer Tag */}
      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
        <span>{member.isExecutive ? 'Office Bearer' : 'Executive Committee'}</span>
        <span className="text-emerald-700 font-bold">State Federation</span>
      </div>
    </div>
  );
}
