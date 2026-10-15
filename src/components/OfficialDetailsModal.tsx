'use client';

import React from 'react';
import { X, Shield, Calendar, Phone, Mail, MapPin, Award, Briefcase, UserCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export interface OfficialRecordDetail {
  _id: string;
  registrationId: string;
  type: 'COACH' | 'MANAGER' | 'REFEREE';
  fullName: string;
  email: string;
  contactNumber: string;
  district: string;
  address: string;
  level: 'Level 1' | 'Level 2' | 'Level 3';
  fatherName?: string;
  experienceYears?: string;
  organization?: string;
  isQualificationVerified?: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'DELETED';
  approvedBy?: string;
  approvedById?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedById?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

interface OfficialDetailsModalProps {
  official: OfficialRecordDetail | null;
  onClose: () => void;
  onApprove?: (id: string) => void;
  onReject?: (official: OfficialRecordDetail) => void;
}

export default function OfficialDetailsModal({
  official,
  onClose,
  onApprove,
  onReject,
}: OfficialDetailsModalProps) {
  if (!official) return null;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const isApproved = official.status === 'APPROVED';
  const isPending = official.status === 'PENDING';
  const isRejected = official.status === 'REJECTED';

  const roleTitle = official.type === 'COACH' ? 'Coach' : official.type === 'MANAGER' ? 'Manager' : 'Referee';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl bg-white border border-[#E1E8E3] shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#E1E8E3]">
          <div>
            <div className="flex items-center space-x-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                isApproved
                  ? 'bg-[#EAF7F1] text-[#008F65] border border-[#008F65]/30'
                  : isPending
                  ? 'bg-amber-50 text-amber-800 border border-amber-300'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                {official.status}
              </span>
              <span className="font-mono text-xs font-bold text-[#5F6B65]">
                {official.registrationId}
              </span>
            </div>
            <h2 className="text-xl font-black text-[#17211D] uppercase mt-1">
              {official.fullName}
            </h2>
            <p className="text-xs text-[#5F6B65]">
              Uttarakhand Rugby Association • {roleTitle} Profile
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-[#5F6B65] hover:text-[#17211D] p-1 rounded-lg hover:bg-[#F5F7F5] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Qualification Level Banner */}
        <div className="p-4 rounded-xl bg-[#F5F7F5] border border-[#E1E8E3] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#5F6B65] uppercase tracking-wider">
              DECLARED QUALIFICATION LEVEL
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-[#008F65] border border-[#008F65]/20 font-black text-xs">
              {official.level}
            </span>
          </div>
          <p className="text-[11px] text-[#5F6B65] leading-relaxed">
            Applicant has declared certification at <span className="font-bold text-[#17211D]">{official.level}</span>.
            {official.isQualificationVerified ? (
              <span className="text-[#008F65] font-semibold block mt-0.5">
                ✓ Formally verified by state technical directorate.
              </span>
            ) : (
              <span className="text-[#FF7900] font-medium block mt-0.5">
                * Pending formal technical credentials audit.
              </span>
            )}
          </p>
        </div>

        {/* Detailed Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-[10px] text-[#5F6B65] uppercase font-bold block mb-0.5">EMAIL ADDRESS</span>
            <div className="flex items-center space-x-1.5 font-medium text-[#17211D]">
              <Mail className="w-3.5 h-3.5 text-[#008F65] shrink-0" />
              <span className="truncate">{official.email}</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] text-[#5F6B65] uppercase font-bold block mb-0.5">MOBILE NUMBER</span>
            <div className="flex items-center space-x-1.5 font-medium text-[#17211D]">
              <Phone className="w-3.5 h-3.5 text-[#008F65] shrink-0" />
              <span>{official.contactNumber}</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] text-[#5F6B65] uppercase font-bold block mb-0.5">DISTRICT</span>
            <div className="flex items-center space-x-1.5 font-medium text-[#17211D]">
              <MapPin className="w-3.5 h-3.5 text-[#FF7900] shrink-0" />
              <span>{official.district} District</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] text-[#5F6B65] uppercase font-bold block mb-0.5">YEARS OF EXPERIENCE</span>
            <div className="font-medium text-[#17211D]">
              {official.experienceYears || 'Not specified'}
            </div>
          </div>

          {official.fatherName && (
            <div>
              <span className="text-[10px] text-[#5F6B65] uppercase font-bold block mb-0.5">FATHER'S NAME</span>
              <div className="font-medium text-[#17211D]">{official.fatherName}</div>
            </div>
          )}

          {official.organization && (
            <div>
              <span className="text-[10px] text-[#5F6B65] uppercase font-bold block mb-0.5">AFFILIATED CLUB / ACADEMY</span>
              <div className="font-medium text-[#17211D]">{official.organization}</div>
            </div>
          )}

          <div className="sm:col-span-2">
            <span className="text-[10px] text-[#5F6B65] uppercase font-bold block mb-0.5">RESIDENTIAL / OFFICIAL ADDRESS</span>
            <div className="font-medium text-[#17211D] leading-relaxed">{official.address}</div>
          </div>
        </div>

        {/* Audit Trail Block */}
        <div className="pt-4 border-t border-[#E1E8E3] space-y-2 text-xs">
          <span className="text-[10px] font-bold text-[#5F6B65] uppercase tracking-wider block">
            ADMINISTRATIVE AUDIT LOG
          </span>
          <div className="p-3 rounded-lg bg-[#FAFBF9] border border-[#E1E8E3] space-y-1.5 text-[11px] text-[#5F6B65]">
            <div className="flex justify-between">
              <span>Submitted On:</span>
              <span className="font-medium text-[#17211D]">{formatDate(official.createdAt)}</span>
            </div>
            {isApproved && (
              <>
                <div className="flex justify-between">
                  <span>Approved By:</span>
                  <span className="font-bold text-[#008F65]">{official.approvedBy || 'Admin'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Approved At:</span>
                  <span className="font-medium text-[#17211D]">{formatDate(official.approvedAt)}</span>
                </div>
              </>
            )}
            {isRejected && (
              <>
                <div className="flex justify-between">
                  <span>Rejected By:</span>
                  <span className="font-bold text-rose-600">{official.rejectedBy || 'Admin'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rejected At:</span>
                  <span className="font-medium text-[#17211D]">{formatDate(official.rejectedAt)}</span>
                </div>
                {official.rejectionReason && (
                  <div className="pt-1 border-t border-[#E1E8E3] text-rose-700">
                    <span className="font-bold">Reason: </span>
                    {official.rejectionReason}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-2 border-t border-[#E1E8E3] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#F5F7F5] hover:bg-[#E1E8E3] text-[#17211D] text-xs font-bold uppercase transition-colors"
          >
            Close
          </button>

          <div className="flex items-center space-x-2">
            {isPending && onReject && (
              <button
                onClick={() => {
                  onClose();
                  onReject(official);
                }}
                className="px-4 py-2 rounded-lg bg-white border border-rose-300 hover:bg-rose-50 text-rose-600 text-xs font-black uppercase tracking-wider transition-colors"
              >
                Reject
              </button>
            )}
            {isPending && onApprove && (
              <button
                onClick={() => {
                  onClose();
                  onApprove(official._id);
                }}
                className="px-4 py-2 rounded-lg bg-[#008F65] hover:bg-[#007A56] text-white text-xs font-black uppercase tracking-wider shadow-xs transition-colors"
              >
                Approve {roleTitle}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
