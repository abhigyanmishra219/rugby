'use client';

import React from 'react';
import { 
  Shield, 
  Target, 
  Eye, 
  Award, 
  Users, 
  MapPin, 
  Calendar, 
  CheckCircle,
  FileText,
  Compass,
  ArrowRight
} from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';
import { associationInfoData, committeeMembersData } from '@/data/association';
import AssociationInfoCard from '@/components/AssociationInfoCard';
import CommitteeMemberCard from '@/components/CommitteeMemberCard';
import { districtsData } from '@/data/districts';

export default function AboutPage() {
  return (
    <div className="py-12 sm:py-20 space-y-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Hero */}
      <section className="relative rounded-2xl overflow-hidden bg-[#F5F7F5] border border-[#E1E8E3] p-8 sm:p-14 shadow-sm">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#008F65]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-3xl space-y-5 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-[#EAF7F1] border border-[#008F65]/20 text-[#008F65] text-xs font-black tracking-widest uppercase">
            <span>OFFICIAL GOVERNING BODY</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#17211D] uppercase tracking-tight leading-tight">
            ABOUT <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#008F65] to-[#00B889]">UTTARAKHAND RUGBY ASSOCIATION</span>
          </h1>
          <p className="text-sm sm:text-base text-[#5F6B65] leading-relaxed font-normal">
            The Uttarakhand Rugby Association is the apex state organization recognized by the Indian Rugby Football Union (Rugby India) and the Uttarakhand Olympic Association. We are dedicated to developing, regulating, and advancing the sport of rugby from grassroots schools in the Himalayas to the national and international stage.
          </p>
        </div>
      </section>

      {/* Who We Are & Heritage */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 space-y-5">
          <div className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-[#008F65]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF7900]"></span>
            <span>WHO WE ARE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#17211D] uppercase tracking-tight">
            Pioneering Rugby In The Land Of The Gods
          </h2>
          <div className="space-y-4 text-sm text-[#5F6B65] leading-relaxed">
            <p>
              Rugby in Uttarakhand represents more than just a competitive team sport—it embodies the inherent stamina, courage, and camaraderie of the mountain people. Established to channel the exceptional natural physical conditioning of hill youth into high-performance athletic channels, the association has grown from informal university clusters into a formally recognized state federation.
            </p>
            <p>
              Today, Uttarakhand Rugby Association governs official state championships in Rugby XVs and Olympic Rugby 7s, oversees a registered talent pool of over 2,800 athletes across 13 districts, conducts certified World Rugby coaching courses, and prepares provincial teams for National Games and All-India tournaments.
            </p>
          </div>
        </div>

        <div className="lg:col-span-6 relative">
          <div className="rounded-xl overflow-hidden aspect-[4/3] bg-[#F5F7F5] border border-[#E1E8E3] shadow-md">
            <img
              src="https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&w=1000&q=80"
              alt="Uttarakhand Rugby Association Team"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 p-4 rounded-xl bg-white border border-[#E1E8E3] max-w-xs shadow-lg hidden sm:block">
            <div className="text-xl font-black text-[#FF7900] leading-none">EST. 2018</div>
            <div className="text-[11px] font-bold text-[#5F6B65] uppercase tracking-wider mt-1">
              Affiliated with IRFU & World Rugby Standards
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision & Core Values */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 rounded-xl bg-white border border-[#E1E8E3] hover:border-[#008F65] transition-all space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-lg bg-[#EAF7F1] border border-[#008F65]/20 flex items-center justify-center text-[#008F65]">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-[#17211D] uppercase tracking-tight">OUR MISSION</h3>
          <p className="text-xs sm:text-sm text-[#5F6B65] leading-relaxed">
            To build an equitable, safe, and robust pathway that enables youth from every hill district of Uttarakhand to learn, play, and excel in rugby, while instilling lifelong values of discipline and sportsmanship.
          </p>
        </div>

        <div className="p-8 rounded-xl bg-white border border-[#E1E8E3] hover:border-[#008F65] transition-all space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-lg bg-[#EAF7F1] border border-[#008F65]/20 flex items-center justify-center text-[#FF7900]">
            <Eye className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-[#17211D] uppercase tracking-tight">OUR VISION</h3>
          <p className="text-xs sm:text-sm text-[#5F6B65] leading-relaxed">
            To establish Uttarakhand as Northern India’s preeminent powerhouse for Rugby 7s and XVs, regularly providing key players to the Indian National Teams and winning podium finishes at the National Games.
          </p>
        </div>

        <div className="p-8 rounded-xl bg-white border border-[#E1E8E3] hover:border-[#008F65] transition-all space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-lg bg-[#EAF7F1] border border-[#008F65]/20 flex items-center justify-center text-[#008F65]">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-[#17211D] uppercase tracking-tight">OUR VALUES</h3>
          <p className="text-xs sm:text-sm text-[#5F6B65] leading-relaxed">
            Integrity, Passion, Solidarity, Discipline, and Respect. We uphold World Rugby’s core ethos on and off the field, actively promoting equal access for women and disadvantaged youth.
          </p>
        </div>
      </section>

      {/* History of Rugby in the Himalayas */}
      <section className="rounded-2xl bg-[#F5F7F5] border border-[#E1E8E3] p-8 sm:p-12 shadow-sm space-y-6">
        <div className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-[#008F65]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF7900]"></span>
          <span>CHRONOLOGY & MILESTONES</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#17211D] uppercase tracking-tight">
          HISTORY OF RUGBY IN UTTARAKHAND
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4">
          <div className="p-5 rounded-lg bg-white border border-[#E1E8E3] space-y-2 shadow-xs">
            <div className="text-xl font-black text-[#FF7900]">2018</div>
            <div className="text-xs font-bold text-[#17211D] uppercase">Association Inception</div>
            <p className="text-xs text-[#5F6B65]">
              Informal inter-collegiate rugby matches organized in Dehradun and Roorkee leading to formal registration.
            </p>
          </div>

          <div className="p-5 rounded-lg bg-white border border-[#E1E8E3] space-y-2 shadow-xs">
            <div className="text-xl font-black text-[#008F65]">2020</div>
            <div className="text-xs font-bold text-[#17211D] uppercase">IRFU Recognition</div>
            <p className="text-xs text-[#5F6B65]">
              Affiliated with Rugby India and admitted to the North Zone regional rugby championships.
            </p>
          </div>

          <div className="p-5 rounded-lg bg-white border border-[#E1E8E3] space-y-2 shadow-xs">
            <div className="text-xl font-black text-[#00B889]">2023</div>
            <div className="text-xs font-bold text-[#17211D] uppercase">13-District Expansion</div>
            <p className="text-xs text-[#5F6B65]">
              Formation of Garhwal and Kumaon divisional councils, bringing certified coaches to high-altitude schools.
            </p>
          </div>

          <div className="p-5 rounded-lg bg-white border border-[#E1E8E3] space-y-2 shadow-xs">
            <div className="text-xl font-black text-[#FF7900]">2026</div>
            <div className="text-xs font-bold text-[#17211D] uppercase">National Stage</div>
            <p className="text-xs text-[#5F6B65]">
              Silver medal finish for Women’s Sevens and selection of state athletes to Senior India National Camps.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          UTTARAKHAND RUGBY ASSOCIATION & OFFICIAL LEADERSHIP
      ========================================================================= */}
      <section
        id="leadership"
        className="rounded-3xl bg-slate-50 border border-slate-200/90 p-6 sm:p-10 lg:p-12 shadow-sm relative overflow-hidden space-y-10"
      >
        {/* Decorative Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-800 via-emerald-600 to-amber-500" />

        {/* 1. Main Section Heading */}
        <div className="space-y-3 pt-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-300/80 text-emerald-900 text-xs font-black tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            <span>OFFICIAL STATE GOVERNING BODY</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#0f2744] uppercase tracking-tight">
            UTTARAKHAND RUGBY ASSOCIATION
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
            The apex state organization governing Rugby Union and Rugby Sevens in Uttarakhand, officially recognized and registered under the Society Registration Act, 1860. Affiliated with the Indian Rugby Football Union (Rugby India) and Uttarakhand Olympic Association.
          </p>
        </div>

        {/* 2. Association Information Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <AssociationInfoCard data={associationInfoData} variant="office" />
          <AssociationInfoCard data={associationInfoData} variant="registration" />
        </div>

        {/* 3. Office Bearers & Executive Committee Sub-Section */}
        <div className="pt-6 border-t border-slate-200/80 space-y-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-1.5 text-xs font-black uppercase tracking-wider text-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              <span>GOVERNANCE & LEADERSHIP</span>
            </div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0f2744] uppercase tracking-tight">
              Office Bearers & Executive Committee
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-normal">
              “The leadership and members contributing to the development of rugby across Uttarakhand.”
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {committeeMembersData.map((member) => (
              <CommitteeMemberCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      </section>

      {/* Association Governance Structure */}
      <section className="rounded-2xl bg-[#F5F7F5] border border-[#E1E8E3] p-8 sm:p-10 shadow-sm space-y-6">
        <h3 className="text-xl font-black text-[#17211D] uppercase tracking-tight">
          ASSOCIATION STRUCTURE & COMMISSIONS
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-lg bg-white border border-[#E1E8E3] space-y-1 shadow-xs">
            <span className="font-bold text-[#008F65] uppercase">HIGH PERFORMANCE COMMITTEE:</span>
            <p className="text-[#5F6B65]">Directs provincial team training, National Games preparations, and strength & conditioning protocols.</p>
          </div>
          <div className="p-4 rounded-lg bg-white border border-[#E1E8E3] space-y-1 shadow-xs">
            <span className="font-bold text-[#FF7900] uppercase">WOMEN’S DEVELOPMENT CELL:</span>
            <p className="text-[#5F6B65]">Supervises girls’ school leagues, female coach mentorship, and safety compliance across Uttarakhand.</p>
          </div>
          <div className="p-4 rounded-lg bg-white border border-[#E1E8E3] space-y-1 shadow-xs">
            <span className="font-bold text-[#008F65] uppercase">DISCIPLINARY & CODE OF CONDUCT:</span>
            <p className="text-[#5F6B65]">Ensures compliance with World Rugby regulations, anti-doping policies, and fair-play standards.</p>
          </div>
          <div className="p-4 rounded-lg bg-white border border-[#E1E8E3] space-y-1 shadow-xs">
            <span className="font-bold text-[#00B889] uppercase">DISTRICT LIAISON COUNCIL:</span>
            <p className="text-[#5F6B65]">Coordinates between all 13 recognized district sports offices, tournament sanctions, and local clubs.</p>
          </div>
          <div className="p-4 rounded-lg bg-white border border-[#E1E8E3] space-y-1 shadow-xs">
            <span className="font-bold text-[#008F65] uppercase">MEDICAL & PLAYER WELFARE:</span>
            <p className="text-[#5F6B65]">Administers concussion protocols (Head Injury Assessment) and certified pitch-side trauma care.</p>
          </div>
          <div className="p-4 rounded-lg bg-white border border-[#E1E8E3] space-y-1 shadow-xs">
            <span className="font-bold text-[#FF7900] uppercase">MATCH OFFICIALS PANEL:</span>
            <p className="text-[#5F6B65]">Educates and allocates certified referees and touch judges for all state-sanctioned matches.</p>
          </div>
        </div>
      </section>

      {/* Affiliation & Compliance Call to Action */}
      <section className="p-8 sm:p-12 rounded-2xl bg-[#EAF7F1] border border-[#008F65]/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2 max-w-xl">
          <h3 className="text-2xl font-black text-[#17211D] uppercase tracking-tight">
            AFFILIATE YOUR CLUB OR DISTRICT ACADEMY
          </h3>
          <p className="text-xs sm:text-sm text-[#5F6B65]">
            Gain official recognition, voting rights in state governance, access to certified coaches, and eligibility for state tournaments.
          </p>
        </div>
        <a
          href="/register?type=club"
          className="px-6 py-3.5 rounded-lg bg-[#008F65] hover:bg-[#007553] text-white font-black text-xs uppercase tracking-wider transition-all shadow-md shrink-0 flex items-center space-x-2"
        >
          <span>AFFILIATION PORTAL</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </section>
    </div>
  );
}
