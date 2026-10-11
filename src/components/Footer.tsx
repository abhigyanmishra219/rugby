'use client';

import React, { useState } from 'react';
import {
  Shield,
  MapPin,
  Mail,
  Phone,
  ArrowRight,
  CheckCircle,
  Award,
  Globe
} from 'lucide-react';
import SocialLinks from '@/components/SocialLinks';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const districtsList = [
    'Dehradun', 'Haridwar', 'Nainital', 'Udham Singh Nagar',
    'Pauri Garhwal', 'Almora', 'Tehri Garhwal', 'Chamoli',
    'Uttarkashi', 'Rudraprayag', 'Pithoragarh', 'Bageshwar', 'Champawat'
  ];

  return (
    <footer className="bg-[#F5F7F5] border-t border-[#E1E8E3] text-[#5F6B65] relative overflow-hidden">
      {/* Mountain & Grid Background Glow */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#008F65]/30 to-transparent"></div>
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[250px] bg-[#008F65]/5 blur-[120px] pointer-events-none"></div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-[#E1E8E3]">
          {/* Column 1: Federation Identity & Motto */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#008F65] to-[#03150d] p-0.5 flex items-center justify-center shadow-md">
                <div className="w-full h-full bg-[#071710] rounded-[6px] flex items-center justify-center">
                  <Shield className="w-6 h-6 text-[#00B889]" />
                </div>
              </div>
              <div>
                <span className="font-black text-xl text-[#17211D] tracking-tight">RUGBY UTTARAKHAND</span>
                <p className="text-[11px] font-semibold text-[#008F65] uppercase tracking-widest">
                  State Governing Sports Organization
                </p>
              </div>
            </div>

            <p className="text-[#17211D] text-sm font-semibold italic border-l-2 border-[#FF7900] pl-3">
              “Growing Rugby. Developing People. Building Champions.”
            </p>

            <p className="text-[#5F6B65] text-xs leading-relaxed">
              Official state rugby association governing, promoting, and advancing rugby union, rugby sevens, and grassroots youth participation across all 13 districts of Uttarakhand, India.
            </p>

            <div className="pt-2">
              <SocialLinks />
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-black text-[#17211D] uppercase tracking-wider border-b border-[#E1E8E3] pb-2">
              FEDERATION
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li><a href="/about" className="hover:text-[#008F65] transition-colors">About Association</a></li>
              <li><a href="/about#leadership" className="hover:text-[#008F65] transition-colors">Executive Committee</a></li>
            </ul>
          </div>

          {/* Column 3: District Development Coverage */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-black text-[#17211D] uppercase tracking-wider border-b border-[#E1E8E3] pb-2">
              DISTRICT AFFILIATIONS
            </h4>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-xs">
              {districtsList.map((district) => (
                <a
                  key={district}
                  href={`/#districts`}
                  className="text-[#5F6B65] hover:text-[#008F65] transition-colors flex items-center gap-1 truncate"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#008F65]"></span>
                  <span>{district}</span>
                </a>
              ))}
            </div>
            <div className="pt-2 text-[11px] font-semibold text-[#008F65]">
              Garhwal & Kumaon Divisional Rugby Networks
            </div>
          </div>

          {/* Column 4: Newsletter & Direct Contacts */}

        </div>

        {/* Bottom Bar: Affiliation Logos, Legal & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#5F6B65]">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center space-x-1 text-[#008F65] font-semibold">
              <Award className="w-3.5 h-3.5" />
              <span>Affiliated to Rugby India (IRFU)</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1 text-[#5F6B65]">
              <Globe className="w-3.5 h-3.5 text-[#008F65]" />
              <span>Recognized by Uttarakhand Olympic Association</span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <a href="#" className="hover:text-[#17211D] transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-[#17211D] transition-colors">Terms & Conditions</a>
            <span>•</span>
            <a href="#" className="hover:text-[#17211D] transition-colors">Anti-Doping Policy</a>
          </div>

          <div className="text-center md:text-right">
            © {new Date().getFullYear()} Rugby Uttarakhand. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
