'use client';

import React from 'react';
import {
  CheckCircle,
  Clock,
  Eye,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Shield,
  Award,
  Briefcase,
  UserCheck,
  MapPin,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { OfficialRecordDetail } from './OfficialDetailsModal';

interface OfficialTableProps {
  type: 'COACH' | 'MANAGER' | 'REFEREE';
  status: 'APPROVED' | 'PENDING' | 'REJECTED' | 'DELETED';
  officials: OfficialRecordDetail[];
  totalMatching: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onViewDetails: (official: OfficialRecordDetail) => void;
  onApprove: (id: string, name: string) => void;
  onReject: (official: OfficialRecordDetail) => void;
  processingId: string | null;
}

export default function OfficialTable({
  type,
  status,
  officials,
  totalMatching,
  currentPage,
  pageSize,
  totalPages,
  isLoading,
  onPageChange,
  onViewDetails,
  onApprove,
  onReject,
  processingId,
}: OfficialTableProps) {
  const roleName = type === 'COACH' ? 'Coach' : type === 'MANAGER' ? 'Manager' : 'Referee';
  const levelColumnTitle = type === 'COACH' ? 'Coaching Level' : type === 'MANAGER' ? 'Manager Level' : 'Referee Level';

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'OF';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-4 border-[#008F65]/20 border-t-[#008F65] rounded-full animate-spin" />
        <span className="text-xs font-bold uppercase tracking-wider text-[#5F6B65]">
          Loading {roleName.toLowerCase()} records from MongoDB...
        </span>
      </div>
    );
  }

  if (officials.length === 0) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-[#F5F7F5] border border-[#E1E8E3] flex items-center justify-center mx-auto text-[#5F6B65]">
          {type === 'COACH' ? <Award className="w-7 h-7" /> : type === 'MANAGER' ? <Briefcase className="w-7 h-7" /> : <UserCheck className="w-7 h-7" />}
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-black text-[#17211D] uppercase">
            No {status.toLowerCase()} {roleName.toLowerCase()}s found
          </h3>
          <p className="text-xs text-[#5F6B65] max-w-sm mx-auto">
            {status === 'PENDING'
              ? `There are no new ${roleName.toLowerCase()} registrations awaiting review at this time.`
              : `No approved ${roleName.toLowerCase()} records found matching your filters.`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#FAFBF9] border-b border-[#E1E8E3] text-[#5F6B65] font-black uppercase text-[10px] tracking-wider">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Mobile Number</th>
              <th className="py-3 px-4">District</th>
              <th className="py-3 px-4">{levelColumnTitle}</th>
              <th className="py-3 px-4">Experience</th>
              <th className="py-3 px-4">Registration Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E1E8E3]">
            {officials.map((official) => {
              const isProcessing = processingId === official._id;
              const isPending = official.status === 'PENDING';
              const isApproved = official.status === 'APPROVED';

              return (
                <tr key={official._id} className="hover:bg-[#F9FBFA] transition-colors">
                  {/* Name & ID */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#EAF7F1] text-[#008F65] font-black flex items-center justify-center text-xs shrink-0 border border-[#008F65]/20">
                        {getInitials(official.fullName)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-[#17211D] text-xs truncate max-w-[160px]">
                          {official.fullName}
                        </div>
                        <div className="font-mono text-[10px] text-[#5F6B65]">
                          {official.registrationId}
                        </div>
                        {official.organization && (
                          <div className="text-[10px] text-[#008F65] truncate max-w-[160px]">
                            {official.organization}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-[#17211D] font-medium">
                    {official.email}
                  </td>

                  {/* Mobile Number */}
                  <td className="py-3.5 px-4 whitespace-nowrap font-medium text-[#17211D]">
                    {official.contactNumber}
                  </td>

                  {/* District */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-[#5F6B65]">
                    {official.district}
                  </td>

                  {/* Level Badge */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#FAFBF9] text-[#17211D] font-bold text-[11px] border border-[#E1E8E3]">
                      {official.level}
                    </span>
                  </td>

                  {/* Experience */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-[#5F6B65]">
                    {official.experienceYears || '—'}
                  </td>

                  {/* Registration Date */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-[#5F6B65]">
                    {formatDate(official.createdAt)}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        isApproved
                          ? 'bg-[#EAF7F1] text-[#008F65] border border-[#008F65]/30'
                          : isPending
                          ? 'bg-amber-50 text-amber-800 border border-amber-300'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {official.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-1.5">
                      {/* View Details */}
                      <button
                        onClick={() => onViewDetails(official)}
                        className="px-2.5 py-1 rounded bg-[#F5F7F5] hover:bg-[#EAF7F1] text-[#17211D] hover:text-[#008F65] border border-[#E1E8E3] font-bold text-[10px] uppercase transition-colors cursor-pointer"
                        title="View Complete Profile"
                      >
                        View
                      </button>

                      {/* Approve (For Pending) */}
                      {isPending && (
                        <button
                          onClick={() => onApprove(official._id, official.fullName)}
                          disabled={isProcessing}
                          className="px-2.5 py-1 rounded bg-[#008F65] hover:bg-[#007A56] text-white font-bold text-[10px] uppercase transition-colors flex items-center space-x-1 shadow-xs cursor-pointer disabled:opacity-50"
                          title="Approve Registration"
                        >
                          <Check className="w-3 h-3" />
                          <span>Approve</span>
                        </button>
                      )}

                      {/* Reject Button (Opens Rejection Modal with optional reason) */}
                      {(isPending || isApproved) && (
                        <button
                          onClick={() => onReject(official)}
                          disabled={isProcessing}
                          className="px-2.5 py-1 rounded bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 hover:border-rose-400 font-bold text-[10px] uppercase transition-colors flex items-center space-x-1 cursor-pointer disabled:opacity-50"
                          title="Reject Registration"
                        >
                          <X className="w-3 h-3" />
                          <span>Reject</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-[#E1E8E3] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5F6B65]">
          <div>
            Showing <span className="font-bold text-[#17211D]">{(currentPage - 1) * pageSize + 1}</span> to{' '}
            <span className="font-bold text-[#17211D]">
              {Math.min(currentPage * pageSize, totalMatching)}
            </span>{' '}
            of <span className="font-bold text-[#17211D]">{totalMatching}</span> records
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-1.5 rounded-lg border border-[#E1E8E3] hover:bg-[#F5F7F5] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 font-bold text-[#17211D]">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-lg border border-[#E1E8E3] hover:bg-[#F5F7F5] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
