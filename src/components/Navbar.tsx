'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  ChevronRight, 
  Shield, 
  Trophy, 
  Calendar, 
  Users, 
  User as UserIcon,
  FileText, 
  Image as ImageIcon, 
  Phone,
  ArrowUpRight
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
import rugbyLogo from '@/images/rubgylogo.png';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'HOME', href: '/' },
    { name: 'ABOUT', href: '/about' },
  ];

  return (
    <>
      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-[#E1E8E3] py-2.5'
            : 'bg-white border-b border-[#E1E8E3] py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo & Brand Identity */}
            <a href="/" className="flex items-center space-x-3 group">
              <div className="relative w-11 h-11 rounded-lg bg-black p-0.5 shadow-md flex items-center justify-center transform group-hover:scale-105 transition-transform overflow-hidden border border-[#008F65]/30 shrink-0">
                <Image
                  src={rugbyLogo}
                  alt="Uttarakhand Rugby Association Logo"
                  width={44}
                  height={44}
                  priority
                  className="w-full h-full object-contain rounded-[6px]"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-[#17211D] leading-none flex items-center gap-1.5">
                  UTTARAKHAND <span className="text-[#008F65]">RUGBY ASSOCIATION</span>
                </span>
                <span className="text-[10px] tracking-widest text-[#5F6B65] uppercase font-semibold mt-0.5">
                  State Governing Body • Devbhoomi
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center space-x-1 lg:space-x-1.5">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    className={`relative px-3 py-1.5 text-xs font-bold tracking-wider transition-all duration-200 rounded ${
                      isActive
                        ? 'text-[#008F65] bg-[#EAF7F1] border border-[#008F65]/20'
                        : 'text-[#17211D] hover:text-[#008F65] hover:bg-[#F5F7F5]'
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#008F65] rounded-full"></span>
                    )}
                  </a>
                );
              })}
            </nav>

            {/* Desktop Action CTA */}
            <div className="hidden lg:flex items-center space-x-3">
              {user ? (
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-[#EAF7F1] border border-[#008F65]/30 text-[#008F65] text-xs font-bold hover:bg-[#008F65] hover:text-white transition-all shadow-xs"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>{user.name}</span>
                </Link>
              ) : (
                <Link
                  href="/signin"
                  className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-[#17211D] hover:text-[#008F65] transition-colors"
                >
                  SIGN IN
                </Link>
              )}

              <a
                href="/register"
                className="relative group overflow-hidden rounded bg-[#008F65] hover:bg-[#007553] px-5 py-2 text-xs font-black uppercase tracking-wider text-white shadow-md shadow-[#008F65]/20 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  <span>JOIN RUGBY</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </a>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex items-center space-x-2 xl:hidden">
              {user ? (
                <Link
                  href="/dashboard"
                  className="bg-[#EAF7F1] text-[#008F65] border border-[#008F65]/30 text-[11px] font-black uppercase px-2.5 py-1.5 rounded tracking-wider flex items-center space-x-1"
                >
                  <UserIcon className="w-3 h-3" />
                  <span>{user.name}</span>
                </Link>
              ) : (
                <Link
                  href="/signin"
                  className="bg-[#F5F7F5] border border-[#E1E8E3] text-[#17211D] text-[11px] font-black uppercase px-2.5 py-1.5 rounded tracking-wider"
                >
                  SIGN IN
                </Link>
              )}
              <a
                href="/register"
                className="bg-[#008F65] hover:bg-[#007553] text-white text-[11px] font-black uppercase px-3 py-1.5 rounded tracking-wider flex items-center"
              >
                JOIN RUGBY
              </a>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle navigation menu"
                className="p-2 rounded-lg bg-[#F5F7F5] border border-[#E1E8E3] text-[#17211D] hover:text-[#008F65] hover:bg-[#EAF7F1] focus:outline-none transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Full-Screen Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white/98 backdrop-blur-2xl flex flex-col justify-between p-6 xl:hidden overflow-y-auto animate-in fade-in duration-200">
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-[#E1E8E3]">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-black border border-[#008F65]/30 flex items-center justify-center overflow-hidden p-0.5 shrink-0">
                  <Image
                    src={rugbyLogo}
                    alt="Uttarakhand Rugby Association Logo"
                    width={40}
                    height={40}
                    className="w-full h-full object-contain rounded-[6px]"
                  />
                </div>
                <div>
                  <h3 className="font-extrabold text-[#17211D] text-base leading-tight">UTTARAKHAND RUGBY ASSOCIATION</h3>
                  <p className="text-[10px] text-[#008F65] uppercase tracking-widest mt-0.5">Official State Association</p>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                className="p-2 text-[#5F6B65] hover:text-[#17211D] rounded-lg bg-[#F5F7F5]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="mt-6 flex flex-col space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between py-3.5 px-4 rounded-lg font-bold text-sm tracking-wider transition-all ${
                      isActive
                        ? 'bg-[#EAF7F1] text-[#008F65] border border-[#008F65]/30'
                        : 'text-[#17211D] hover:text-[#008F65] hover:bg-[#F5F7F5]'
                    }`}
                  >
                    <span>{link.name}</span>
                    <ChevronRight className={`w-4 h-4 ${isActive ? 'text-[#008F65]' : 'text-[#5F6B65]'}`} />
                  </a>
                );
              })}
            </nav>
          </div>

          <div className="pt-6 border-t border-[#E1E8E3] flex flex-col space-y-3">
            <a
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3.5 bg-[#008F65] hover:bg-[#007553] text-white text-center font-black uppercase text-sm tracking-wider rounded-lg shadow-md flex items-center justify-center space-x-2"
            >
              <span>JOIN RUGBY</span>
              <ChevronRight className="w-4 h-4" />
            </a>
            <p className="text-center text-xs text-[#5F6B65]">
              © {new Date().getFullYear()} Uttarakhand Rugby Association. Official State Sports Organization.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
