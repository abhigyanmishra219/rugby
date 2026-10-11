'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield,
  ArrowRight,
  ChevronDown,
  Calendar,
  Trophy,
  Users,
  MapPin,
  Sparkles,
  Award,
  Flame,
  Target,
  CheckCircle2,
  Zap,
  Activity,
  Layers,
  HeartHandshake
} from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';
import CompetitionCard from '@/components/CompetitionCard';
import MatchCard from '@/components/MatchCard';
import StatisticCounter from '@/components/StatisticCounter';
import HeroBackgroundSlider from '@/components/HeroBackgroundSlider';
import Image from 'next/image';
import uwillgetLogo from '@/images/logo/logo.jpeg';
import imgKotdwarSquad from '@/images/Screenshot 2026-10-09 101150.png';

import { competitionsData } from '@/data/competitions';
import { matchesData } from '@/data/matches';

function HeroCounter({ value, isLoading }: { value: number; isLoading?: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isLoading) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || value === 0) {
      setCount(value);
      return;
    }

    let startTime: number | null = null;
    const duration = 1200;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(easeOut * value));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    requestAnimationFrame(animate);
  }, [value, isLoading]);

  if (isLoading) {
    return <span className="inline-block w-12 h-7 bg-white/20 rounded animate-pulse" />;
  }

  return <span>{count.toLocaleString()}</span>;
}

export default function HomePage() {
  const [matchTab, setMatchTab] = useState<'UPCOMING' | 'RESULTS' | 'FIXTURES'>('UPCOMING');
  const [playerCount, setPlayerCount] = useState<number | null>(null);
  const [isLoadingCount, setIsLoadingCount] = useState(true);

  // Fetch actual dynamic registered player count from MongoDB
  useEffect(() => {
    let isMounted = true;
    async function fetchPlayerCount() {
      try {
        const res = await fetch('/api/players/count');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.success && typeof data.count === 'number') {
            setPlayerCount(data.count);
          }
        }
      } catch (err) {
        console.error('Error fetching player count:', err);
      } finally {
        if (isMounted) {
          setIsLoadingCount(false);
        }
      }
    }

    fetchPlayerCount();
    return () => {
      isMounted = false;
    };
  }, []);

  const upcomingMatches = matchesData.filter((m) => m.status === 'Upcoming');
  const resultMatches = matchesData.filter((m) => m.status === 'Full Time');
  const allFixtures = matchesData;

  const displayedMatches =
    matchTab === 'UPCOMING' ? upcomingMatches :
      matchTab === 'RESULTS' ? resultMatches : allFixtures;

  return (
    <div className="space-y-24 sm:space-y-32">
      {/* =========================================================================
          1. HERO SECTION (Cinematic Rugby Action + Uttarakhand Energy)
      ========================================================================= */}
      <section className="relative min-h-[92vh] lg:min-h-screen flex items-center justify-center overflow-hidden">
        {/* Automatic Hero Background Image Slider (10s rotation with smooth crossfade) */}
        <HeroBackgroundSlider />

        {/* Controlled Dark Gradients & Himalayan Tint Overlay for guaranteed text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/55 pointer-events-none z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none z-[1]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,143,101,0.25),transparent_60%)] pointer-events-none z-[1]" />

        {/* Bottom edge fade */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#FFFFFF]/30 to-transparent pointer-events-none z-[1]" />

        {/* Hero Content Box */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-left w-full">
          <div className="max-w-3xl space-y-6">
            {/* Top State Badge */}
            <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-black/60 border border-white/20 backdrop-blur-md text-[#00B889] text-xs font-black tracking-widest uppercase shadow-lg">
              <span className="w-2 h-2 rounded-full bg-[#FF7900] animate-ping"></span>
              <span>STATE GOVERNING BODY • UTTARAKHAND, INDIA</span>
            </div>

            {/* Federation Title */}
            <div className="text-[#FF7900] font-black text-sm sm:text-base tracking-widest uppercase flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#FF7900]" />
              <span>RUGBY UTTARAKHAND</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight uppercase leading-[1.05] drop-shadow-md">
              BUILDING THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-amber-300">FUTURE OF RUGBY</span> IN UTTARAKHAND
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-100 font-normal leading-relaxed max-w-2xl">
              Developing players, strengthening teams, and creating high-performance opportunities across the Garhwal and Kumaon Himalayas.
            </p>

            {/* CTAs */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href="#about-rugby"
                className="relative group overflow-hidden px-8 py-4 rounded-lg bg-[#008F65] hover:bg-[#007553] text-white font-black text-sm uppercase tracking-wider shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <span>EXPLORE RUGBY</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="/register"
                className="px-8 py-4 rounded-lg bg-black/50 hover:bg-black/70 border border-white/30 text-white font-black text-sm uppercase tracking-wider backdrop-blur-md transition-all flex items-center gap-2 hover:border-[#FF7900]"
              >
                <span>JOIN THE MOVEMENT</span>
                <Flame className="w-4 h-4 text-[#FF7900]" />
              </a>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="mt-14 pt-8 border-t border-white/20 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white">
                <HeroCounter value={playerCount ?? 0} isLoading={isLoadingCount} />
              </div>
              <div className="text-xs font-bold text-[#00B889] uppercase tracking-wider mt-0.5">APPROVED ATHLETES</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white">13 / 13</div>
              <div className="text-xs font-bold text-[#FF7900] uppercase tracking-wider mt-0.5">DISTRICTS ACTIVE</div>
            </div>
          </div>
        </div>

        {/* Subtle Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center space-y-1.5 opacity-80 hover:opacity-100 transition-opacity">
          <span className="text-[10px] font-bold text-slate-200 uppercase tracking-widest">SCROLL TO DISCOVER</span>
          <ChevronDown className="w-4 h-4 text-[#00B889] animate-bounce" />
        </div>
      </section>

      {/* =========================================================================
          2. SCOREBOARD & FIXTURES TICKER / RESULTS COMPONENT
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-30">
        <div className="rounded-2xl bg-white border border-[#E1E8E3] p-5 sm:p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-[#E1E8E3] gap-4">
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-[#FF7900]" />
              <span className="text-sm font-black text-[#17211D] uppercase tracking-wider">
                MATCH SCOREBOARD & FIXTURES
              </span>
            </div>

            {/* Tab Controls */}
            <div className="flex items-center space-x-1.5 bg-[#F5F7F5] p-1 rounded-lg border border-[#E1E8E3]">
              {(['UPCOMING', 'RESULTS', 'FIXTURES'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setMatchTab(tab)}
                  className={`px-3 py-1.5 rounded text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${matchTab === tab
                    ? 'bg-[#008F65] text-white shadow-xs'
                    : 'text-[#5F6B65] hover:text-[#17211D]'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedMatches.slice(0, 3).map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      </section>


      {/* =========================================================================
          4. UPCOMING COMPETITIONS & TOURNAMENT ACTION
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="CALENDAR 2026-27"
          title="UPCOMING"
          highlightedTitle="ACTION"
          subtitle="Witness high-voltage rugby across Dehradun, Haldwani, Haridwar, and mountain stadium venues."
          linkText="VIEW ALL COMPETITIONS"
          linkHref="/competitions"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {competitionsData.slice(0, 3).map((comp) => (
            <CompetitionCard key={comp.id} competition={comp} />
          ))}
        </div>
      </section>

      {/* =========================================================================
          7. RUGBY IN UTTARAKHAND (Storytelling Split Layout + Counters)
      ========================================================================= */}
      <section id="about-rugby" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: Himalayan Mountain / Action Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#E1E8E3] shadow-xl aspect-[4/5] bg-[#F5F7F5]">
              <Image
                src={imgKotdwarSquad}
                alt="Rugby in Uttarakhand Himalayas"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-[#E1E8E3] shadow-md">
                <span className="text-[#FF7900] text-xs font-black uppercase tracking-wider block mb-1">
                  MOUNTAIN RESILIENCE
                </span>
                <p className="text-xs text-[#17211D] font-medium">
                  “The altitude gives our players the lungs; the mountains give them the heart.”
                </p>
              </div>
            </div>
          </div>

          {/* Right: Narrative Story & Statistics */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-[#008F65]">
              <span className="w-2 h-2 rounded-full bg-[#FF7900]"></span>
              <span>HERITAGE & DEVELOPMENT</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#17211D] uppercase tracking-tight leading-tight">
              RUGBY IN <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#008F65] to-[#00B889]">UTTARAKHAND</span>
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-[#5F6B65] font-normal leading-relaxed">
              <p>
                From the bustling sports grounds of Dehradun and Roorkee to high-altitude schools nestled in Chamoli and Pithoragarh, rugby has found natural home in Uttarakhand. The state’s youth possess an innate physical toughness and endurance forged by mountain topography.
              </p>
              <p>
                Founded to govern and professionalize the sport, the Rugby Association of Uttarakhand is committed to building an all-inclusive sporting pyramid. Our focus spans equal access for girls and boys, structured coach certifications, and state-of-the-art conditioning to challenge the very best teams in India.
              </p>
            </div>

            {/* Animated Counters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4">
              <StatisticCounter
                value={playerCount ?? 0}
                isLoading={isLoadingCount}
                label="APPROVED PLAYERS"
                sublabel="Athletes across senior, youth & grassroots pathways"
                icon={Users}
              />
              <StatisticCounter
                value={13}
                label="Districts Covered"
                sublabel="All 13 Garhwal & Kumaon districts active in state rugby"
                icon={MapPin}
              />
            </div>

            <div className="pt-2">
              <a
                href="/about"
                className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-[#008F65] hover:text-[#FF7900] transition-colors"
              >
                <span>READ COMPLETE FEDERATION HISTORY</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>


      {/* =========================================================================
          9. GET INTO RUGBY (Formats & Beginner Pathways)
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="PATHWAY FOR EVERYONE"
          title="GET INTO"
          highlightedTitle="RUGBY"
          subtitle="Explore the different formats of rugby played across schools, universities, and elite leagues in Uttarakhand."
          linkText="JOIN AS BEGINNER"
          linkHref="/register"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Rugby 7s */}
          <div className="rounded-xl overflow-hidden bg-white border border-[#E1E8E3] hover:border-[#008F65] hover:shadow-md transition-all p-5 flex flex-col justify-between shadow-xs">
            <div className="space-y-3">
              <div className="aspect-video rounded-lg overflow-hidden bg-[#F5F7F5] relative">
                <img
                  src="https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&w=600&q=80"
                  alt="Rugby 7s"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#FF7900] text-white text-[10px] font-black uppercase">
                  OLYMPIC FORMAT
                </span>
              </div>
              <h3 className="text-lg font-black text-[#17211D] uppercase">RUGBY 7s</h3>
              <p className="text-xs text-[#5F6B65] leading-relaxed">
                Fast-paced seven-player format emphasizing breathtaking speed, agility, and open-field running over two 7-minute halves.
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-[#E1E8E3]">
              <a href="/register?format=7s" className="text-xs font-bold text-[#008F65] hover:text-[#FF7900] flex items-center gap-1">
                <span>Learn & Register</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Card 2: Rugby XVs */}
          <div className="rounded-xl overflow-hidden bg-white border border-[#E1E8E3] hover:border-[#008F65] hover:shadow-md transition-all p-5 flex flex-col justify-between shadow-xs">
            <div className="space-y-3">
              <div className="aspect-video rounded-lg overflow-hidden bg-[#F5F7F5] relative">
                <img
                  src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80"
                  alt="Rugby XVs"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#008F65] text-white text-[10px] font-black uppercase">
                  TRADITIONAL FORMAT
                </span>
              </div>
              <h3 className="text-lg font-black text-[#17211D] uppercase">RUGBY XVs</h3>
              <p className="text-xs text-[#5F6B65] leading-relaxed">
                Traditional fifteen-player rugby union combining forward scrums, lineouts, tactical kicking, and endurance across 80 minutes.
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-[#E1E8E3]">
              <a href="/register?format=15s" className="text-xs font-bold text-[#008F65] hover:text-[#FF7900] flex items-center gap-1">
                <span>Learn & Register</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Card 3: Touch Rugby */}
          <div className="rounded-xl overflow-hidden bg-white border border-[#E1E8E3] hover:border-[#008F65] hover:shadow-md transition-all p-5 flex flex-col justify-between shadow-xs">
            <div className="space-y-3">
              <div className="aspect-video rounded-lg overflow-hidden bg-[#F5F7F5] relative">
                <img
                  src="https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80"
                  alt="Touch Rugby"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#00B889] text-white text-[10px] font-black uppercase">
                  NON-CONTACT
                </span>
              </div>
              <h3 className="text-lg font-black text-[#17211D] uppercase">TOUCH RUGBY</h3>
              <p className="text-xs text-[#5F6B65] leading-relaxed">
                Skill-focused, non-contact format ideal for beginners, mixed-gender community games, schools, and corporate leagues.
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-[#E1E8E3]">
              <a href="/register?format=touch" className="text-xs font-bold text-[#008F65] hover:text-[#FF7900] flex items-center gap-1">
                <span>Learn & Register</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Card 4: Grassroots */}
          <div className="rounded-xl overflow-hidden bg-white border border-[#E1E8E3] hover:border-[#008F65] hover:shadow-md transition-all p-5 flex flex-col justify-between shadow-xs">
            <div className="space-y-3">
              <div className="aspect-video rounded-lg overflow-hidden bg-[#F5F7F5] relative">
                <img
                  src="https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=600&q=80"
                  alt="Grassroots Rugby"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#FF7900] text-white text-[10px] font-black uppercase">
                  COMMUNITY & YOUTH
                </span>
              </div>
              <h3 className="text-lg font-black text-[#17211D] uppercase">GRASSROOTS</h3>
              <p className="text-xs text-[#5F6B65] leading-relaxed">
                Start your journey from age 7 upwards. Free tag rugby clinics, certified mentor sessions, and district school festivals.
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-[#E1E8E3]">
              <a href="/register?format=grassroots" className="text-xs font-bold text-[#008F65] hover:text-[#FF7900] flex items-center gap-1">
                <span>Learn & Register</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          10. DEVELOPMENT PROGRAMS (Next Gen Talent, Coaches, Referees)
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="EDUCATION & CAPACITY BUILDING"
          title="DEVELOPING THE"
          highlightedTitle="NEXT GENERATION"
          subtitle="Comprehensive pathways ensuring safe play, technical refereeing, elite coaching, and gender equality."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-white border border-[#E1E8E3] hover:border-[#008F65] hover:shadow-md transition-all space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-lg bg-[#EAF7F1] border border-[#008F65]/20 flex items-center justify-center text-[#008F65]">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-[#17211D] uppercase">PLAYER DEVELOPMENT</h3>
            <p className="text-xs text-[#5F6B65] leading-relaxed">
              High-altitude training methodology, position-specific skill sessions, sports nutrition guidance, and mental conditioning camps.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-[#E1E8E3] hover:border-[#008F65] hover:shadow-md transition-all space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-lg bg-[#EAF7F1] border border-[#008F65]/20 flex items-center justify-center text-[#FF7900]">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-[#17211D] uppercase">COACH DEVELOPMENT</h3>
            <p className="text-xs text-[#5F6B65] leading-relaxed">
              World Rugby certified Level 1 and Level 2 coaching courses for school teachers and physical education instructors across Uttarakhand.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-[#E1E8E3] hover:border-[#008F65] hover:shadow-md transition-all space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-lg bg-[#EAF7F1] border border-[#008F65]/20 flex items-center justify-center text-[#008F65]">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-[#17211D] uppercase">REFEREE DEVELOPMENT</h3>
            <p className="text-xs text-[#5F6B65] leading-relaxed">
              Building a state panel of match officials with continuous training on player safety protocols, scrum safety, and match laws.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-[#E1E8E3] hover:border-[#008F65] hover:shadow-md transition-all space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-lg bg-[#EAF7F1] border border-[#008F65]/20 flex items-center justify-center text-[#00B889]">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-[#17211D] uppercase">GRASSROOTS DEVELOPMENT</h3>
            <p className="text-xs text-[#5F6B65] leading-relaxed">
              Equipping rural hill schools with standard match gear, tag belts, and organizing regional festivals for young athletes.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-[#E1E8E3] hover:border-[#008F65] hover:shadow-md transition-all space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-lg bg-[#EAF7F1] border border-[#008F65]/20 flex items-center justify-center text-[#FF7900]">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-[#17211D] uppercase">WOMEN’S RUGBY INITIATIVE</h3>
            <p className="text-xs text-[#5F6B65] leading-relaxed">
              Targeted mentorship camps, leadership workshops, and dedicated tournaments for adolescent girls and university women in the state.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-[#E1E8E3] hover:border-[#008F65] hover:shadow-md transition-all space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-lg bg-[#EAF7F1] border border-[#008F65]/20 flex items-center justify-center text-[#008F65]">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-[#17211D] uppercase">YOUTH RUGBY PATHWAY</h3>
            <p className="text-xs text-[#5F6B65] leading-relaxed">
              Structured age-grade progression: U14 Tag Rugby to U18 full-contact state squads, creating a reliable pipeline to national colors.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          13. SPONSOR & TECHNOLOGY PARTNER (UwillGet)
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl sm:rounded-3xl bg-[#F5F7F5] border border-[#E1E8E3] p-8 sm:p-14 lg:p-16 shadow-md text-center relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#008F65]/5 rounded-full blur-[90px] pointer-events-none" />

          {/* 1. Eyebrow Label */}
          <div className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-[#008F65] mb-3 sm:mb-4 relative z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF7900]" />
            <span>OUR SPONSOR</span>
          </div>

          {/* 2. Main Heading */}
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#17211D] uppercase tracking-tight mb-3 sm:mb-4 relative z-10">
            PROUDLY SUPPORTED BY UWILLGET
          </h3>

          {/* 3. Short Supporting Description */}
          <p className="text-xs sm:text-sm md:text-base text-[#5F6B65] max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed font-normal relative z-10">
            Empowering Rugby Uttarakhand through digital innovation, technology, and support for the growth of rugby.
          </p>

          {/* 4. Large, Centered UwillGet Logo in Tasteful Container */}
          <div className="flex flex-col items-center justify-center relative z-10">
            <a
              href="https://uwillget.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit UwillGet website"
              className="group block relative p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white shadow-md border border-[#E1E8E3] hover:border-[#008F65] hover:shadow-lg hover:scale-[1.02] transition-all duration-300 max-w-[240px] sm:max-w-[280px] md:max-w-[320px] w-full"
            >
              <div className="relative w-full aspect-square">
                <Image
                  src={uwillgetLogo}
                  alt="UwillGet Logo"
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
            </a>

            {/* 5. Sponsor Name and Relationship Label Underneath */}
            <div className="mt-5 sm:mt-6 space-y-1 text-center">
              <h4 className="text-lg sm:text-xl md:text-2xl font-black text-[#17211D] uppercase tracking-tight">
                UwillGet
              </h4>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#008F65]">
                Technology Partner & Sponsor
              </p>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}
