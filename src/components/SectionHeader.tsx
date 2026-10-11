import React from 'react';
import { ArrowRight } from 'lucide-react';

interface SectionHeaderProps {
  badge?: string;
  title: string;
  highlightedTitle?: string;
  subtitle?: string;
  linkText?: string;
  linkHref?: string;
  align?: 'left' | 'center';
  lightMode?: boolean;
}

export default function SectionHeader({
  badge,
  title,
  highlightedTitle,
  subtitle,
  linkText,
  linkHref,
  align = 'left',
  lightMode = true
}: SectionHeaderProps) {
  return (
    <div className={`flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 ${align === 'center' ? 'text-center md:items-center' : ''}`}>
      <div className={`max-w-2xl ${align === 'center' ? 'mx-auto' : ''}`}>
        {badge && (
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded bg-[#EAF7F1] border border-[#008F65]/20 text-[#008F65] text-xs font-black tracking-widest uppercase mb-3 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF7900] animate-pulse"></span>
            <span>{badge}</span>
          </div>
        )}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight leading-tight text-[#17211D]">
          {title}{' '}
          {highlightedTitle && (
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#008F65] to-[#00B889]">
              {highlightedTitle}
            </span>
          )}
        </h2>
        {subtitle && (
          <p className="mt-2 text-sm sm:text-base font-normal leading-relaxed text-[#5F6B65]">
            {subtitle}
          </p>
        )}
      </div>

      {linkText && linkHref && (
        <a
          href={linkHref}
          className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#008F65] hover:text-[#FF7900] group transition-colors shrink-0 pb-1"
        >
          <span>{linkText}</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform text-[#FF7900]" />
        </a>
      )}
    </div>
  );
}
