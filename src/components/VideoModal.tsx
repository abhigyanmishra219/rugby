'use client';

import React from 'react';
import { X, Play, Shield } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  videoTitle: string;
  onClose: () => void;
}

export default function VideoModal({ isOpen, videoTitle, onClose }: VideoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative max-w-4xl w-full bg-white border border-[#E1E8E3] rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#E1E8E3] bg-[#F5F7F5]">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-[#008F65]" />
            <h4 className="font-extrabold text-sm sm:text-base text-[#17211D] uppercase tracking-tight truncate max-w-md">
              {videoTitle}
            </h4>
          </div>
          <button
            onClick={onClose}
            aria-label="Close video player"
            className="p-1.5 rounded-lg bg-white border border-[#E1E8E3] text-[#5F6B65] hover:text-[#17211D] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Canvas Simulation */}
        <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&w=1200&q=80"
            alt="Video Preview"
            className="absolute inset-0 w-full h-full object-cover opacity-40 blur-xs"
          />
          <div className="relative z-10 text-center p-6 space-y-4 max-w-lg">
            <div className="w-16 h-16 rounded-full bg-[#FF7900] flex items-center justify-center mx-auto text-white shadow-xl animate-pulse">
              <Play className="w-7 h-7 ml-1" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-widest text-[#00B889] block mb-1">
                OFFICIAL MATCH HIGHLIGHTS FEED
              </span>
              <p className="text-sm text-slate-100 font-medium">
                Broadcast feed streaming from Uttarakhand State Championship 2026. High-definition match replays and tactical breakdowns.
              </p>
            </div>
            <div className="inline-flex items-center space-x-2 text-xs text-[#FF7900] bg-black/60 px-3 py-1 rounded border border-white/20">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              <span>HD 1080p • Uttarakhand Rugby Association Broadcast Archive</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="p-4 bg-[#F5F7F5] border-t border-[#E1E8E3] flex items-center justify-between text-xs text-[#5F6B65]">
          <span>Provided by State High-Performance Media Unit</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-[#008F65] hover:bg-[#007553] text-white font-bold uppercase text-xs cursor-pointer shadow-xs"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
}
