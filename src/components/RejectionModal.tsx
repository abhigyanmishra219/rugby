'use client';

import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface RejectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  applicantName: string;
  applicantRole: string;
  registrationId: string;
  isProcessing?: boolean;
}

export default function RejectionModal({
  isOpen,
  onClose,
  onConfirm,
  applicantName,
  applicantRole,
  registrationId,
  isProcessing = false,
}: RejectionModalProps) {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onConfirm(reason);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-white border border-[#E1E8E3] shadow-2xl p-6 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#E1E8E3]">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#17211D] uppercase">
                Confirm Application Rejection
              </h3>
              <p className="text-[11px] text-[#5F6B65]">
                {applicantRole} • {registrationId}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="text-[#5F6B65] hover:text-[#17211D] p-1 rounded-lg hover:bg-[#F5F7F5] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-xs text-[#17211D]">
            Are you sure you want to reject the application for{' '}
            <span className="font-bold">{applicantName}</span>?
          </p>

          <p className="text-[11px] text-[#5F6B65] leading-relaxed">
            The status will be updated to <span className="font-bold text-rose-600">REJECTED</span> with an administrative audit trail. The record will remain archived for administrative review and will not be permanently deleted.
          </p>

          {/* Optional Rejection Reason */}
          <div>
            <label className="text-xs font-bold text-[#17211D] uppercase block mb-1">
              Rejection Reason (Optional)
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Incomplete credentials, does not meet state affiliation criteria, duplicate application..."
              className="w-full px-3 py-2 rounded-lg bg-white border border-[#E1E8E3] text-xs text-[#17211D] placeholder-[#5F6B65] focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-2.5 pt-2 border-t border-[#E1E8E3]">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2 rounded-lg bg-[#F5F7F5] hover:bg-[#E1E8E3] text-[#17211D] text-xs font-bold uppercase transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isProcessing}
              className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 shadow-xs cursor-pointer transition-colors disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Rejecting...</span>
                </>
              ) : (
                <span>Confirm Rejection</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
