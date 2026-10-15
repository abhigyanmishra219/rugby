'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  CheckCircle,
  AlertCircle,
  Shield,
  Printer,
  Sparkles,
  ArrowRight,
  UserCheck,
  Award,
  Briefcase,
  HelpCircle,
} from 'lucide-react';
import rugbyLogo from '@/images/rubgylogo.png';

export type OfficialType = 'COACH' | 'MANAGER' | 'REFEREE';

interface OfficialRegistrationFormProps {
  roleType: OfficialType;
  onSelectRole?: (role: 'PLAYER' | 'COACH' | 'MANAGER' | 'REFEREE') => void;
}

const DISTRICTS_LIST = [
  'Dehradun', 'Haridwar', 'Nainital', 'Udham Singh Nagar',
  'Pauri Garhwal', 'Almora', 'Tehri Garhwal', 'Chamoli',
  'Uttarkashi', 'Rudraprayag', 'Pithoragarh', 'Bageshwar', 'Champawat'
];

export default function OfficialRegistrationForm({ roleType, onSelectRole }: OfficialRegistrationFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    contactNumber: '',
    fatherName: '', // Optional for coach
    district: '',
    address: '',
    level: '',
    experienceYears: '',
    organization: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [registrationResult, setRegistrationResult] = useState<any>(null);

  const roleMeta = {
    COACH: {
      title: 'COACH REGISTRATION',
      subtitle: 'Official registration for head coaches, tactical mentors, and grassroots development trainers.',
      levelLabel: 'Coaching Level *',
      experienceLabel: 'Years of Coaching Experience (Optional)',
      orgLabel: 'Current Club / Academy / Institution (Optional)',
      icon: Award,
      badgeColor: 'text-[#008F65] bg-[#EAF7F1] border-[#008F65]/30',
      idPrefix: 'RU-COA',
    },
    MANAGER: {
      title: 'MANAGER REGISTRATION',
      subtitle: 'Official registration for club managers, district team coordinators, and rugby administrative leaders.',
      levelLabel: 'Manager Level *',
      experienceLabel: 'Years of Experience (Optional)',
      orgLabel: 'Current Club / Academy / Institution (Optional)',
      icon: Briefcase,
      badgeColor: 'text-[#0284C7] bg-[#F0F9FF] border-[#0284C7]/30',
      idPrefix: 'RU-MGR',
    },
    REFEREE: {
      title: 'REFEREE REGISTRATION',
      subtitle: 'Official registration for match referees, assistant referees, and certified technical adjudicators.',
      levelLabel: 'Referee Level *',
      experienceLabel: 'Years of Refereeing Experience (Optional)',
      orgLabel: 'Current Association / Club (Optional)',
      icon: UserCheck,
      badgeColor: 'text-[#D97706] bg-[#FFFBEB] border-[#D97706]/30',
      idPrefix: 'RU-REF',
    },
  }[roleType];

  const validate = () => {
    const newErrors: Record<string, string> = {};

    // Full Name
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Contact Number (Indian mobile number regex)
    const cleanPhone = formData.contactNumber.replace(/[\s\-()]/g, '');
    const indianPhoneRegex = /^(\+91|91|0)?[6-9]\d{9}$/;
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Mobile number is required';
    } else if (!indianPhoneRegex.test(cleanPhone)) {
      newErrors.contactNumber = 'Please enter a valid 10-digit Indian mobile number (e.g. 9876543210)';
    }

    // District
    if (!formData.district) {
      newErrors.district = 'Please select your Uttarakhand district';
    }

    // Address
    if (!formData.address.trim()) {
      newErrors.address = 'Residential / Official address is required';
    }

    // Level
    if (!formData.level) {
      newErrors.level = 'Please select your declared qualification level';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        type: roleType,
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        contactNumber: formData.contactNumber.trim(),
        district: formData.district,
        address: formData.address.trim(),
        level: formData.level,
        fatherName: roleType === 'COACH' ? formData.fatherName.trim() : undefined,
        experienceYears: formData.experienceYears.trim() || undefined,
        organization: formData.organization.trim() || undefined,
      };

      const res = await fetch('/api/officials/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success && data.registration) {
        setRegistrationResult(data.registration);
        setIsCompleted(true);
      } else {
        setSubmitError(data.error || data.message || 'Registration failed. Please review your details and try again.');
      }
    } catch (err: any) {
      setSubmitError(err?.message || 'Network error occurred while connecting to the server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      contactNumber: '',
      fatherName: '',
      district: '',
      address: '',
      level: '',
      experienceYears: '',
      organization: '',
    });
    setErrors({});
    setSubmitError(null);
    setIsCompleted(false);
    setRegistrationResult(null);
  };

  const RoleIcon = roleMeta.icon;

  // Render Confirmation Slip
  if (isCompleted && registrationResult) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="p-6 sm:p-10 rounded-2xl bg-white border border-[#E1E8E3] shadow-md text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#EAF7F1] border-2 border-[#008F65] flex items-center justify-center mx-auto text-[#008F65]">
            <CheckCircle className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${roleMeta.badgeColor}`}>
              {roleType} REGISTRATION SUBMITTED
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#17211D] uppercase tracking-tight">
              APPLICATION AWAITING REVIEW
            </h2>
            <p className="text-xs sm:text-sm text-[#5F6B65] max-w-lg mx-auto">
              Your registration has been successfully recorded in the Uttarakhand Rugby Association database. It is currently awaiting administrative credential verification.
            </p>
          </div>

          {/* Official Slip Card */}
          <div id="official-registration-slip" className="max-w-xl mx-auto rounded-xl border border-[#E1E8E3] bg-[#F5F7F5] p-6 text-left space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E1E8E3]">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-black border border-[#008F65] p-0.5 overflow-hidden flex items-center justify-center shrink-0">
                  <Image
                    src={rugbyLogo}
                    alt="Logo"
                    width={40}
                    height={40}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-xs font-black text-[#17211D] uppercase">UTTARAKHAND RUGBY ASSOCIATION</h3>
                  <p className="text-[10px] text-[#5F6B65]">Official Registration Acknowledgement</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-amber-50 border border-amber-300 text-amber-800 text-[10px] font-black uppercase tracking-wider">
                PENDING
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-[#5F6B65] uppercase font-bold block">REGISTRATION ID</span>
                <span className="font-mono font-black text-[#008F65] text-sm">{registrationResult.registrationId}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#5F6B65] uppercase font-bold block">SUBMITTED ON</span>
                <span className="font-bold text-[#17211D]">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#5F6B65] uppercase font-bold block">FULL NAME</span>
                <span className="font-bold text-[#17211D] uppercase">{registrationResult.fullName}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#5F6B65] uppercase font-bold block">CATEGORY</span>
                <span className="font-bold text-[#17211D] uppercase">{registrationResult.type}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#5F6B65] uppercase font-bold block">DECLARED LEVEL</span>
                <span className="font-bold text-[#FF7900]">{registrationResult.level}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#5F6B65] uppercase font-bold block">DISTRICT</span>
                <span className="font-bold text-[#17211D]">{registrationResult.district} District</span>
              </div>
              <div>
                <span className="text-[10px] text-[#5F6B65] uppercase font-bold block">MOBILE NUMBER</span>
                <span className="font-medium text-[#17211D]">{registrationResult.contactNumber}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#5F6B65] uppercase font-bold block">EMAIL ADDRESS</span>
                <span className="font-medium text-[#17211D] truncate block">{registrationResult.email}</span>
              </div>
              {registrationResult.organization && (
                <div className="col-span-2">
                  <span className="text-[10px] text-[#5F6B65] uppercase font-bold block">ORGANIZATION / CLUB</span>
                  <span className="font-medium text-[#17211D]">{registrationResult.organization}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#E1E8E3] text-[10px] text-[#5F6B65] leading-relaxed">
              <span className="font-bold text-[#17211D]">Verification Notice: </span>
              Declared qualification credentials are confirmed only upon formal review by the state technical directorate. Please retain your registration ID for future reference.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => window.print()}
              className="px-5 py-2.5 rounded-xl bg-white border border-[#E1E8E3] hover:border-[#008F65] text-[#17211D] text-xs font-black uppercase tracking-wider flex items-center space-x-2 shadow-xs cursor-pointer transition-colors"
            >
              <Printer className="w-4 h-4 text-[#008F65]" />
              <span>PRINT REGISTRATION SLIP</span>
            </button>

            <button
              onClick={handleReset}
              className="px-5 py-2.5 rounded-xl bg-[#008F65] hover:bg-[#007A56] text-white text-xs font-black uppercase tracking-wider flex items-center space-x-2 shadow-xs cursor-pointer transition-colors"
            >
              <span>SUBMIT ANOTHER REGISTRATION</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render Registration Form
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Form Card */}
      <div className="p-6 sm:p-10 rounded-2xl bg-white border border-[#E1E8E3] shadow-xs space-y-6">
        {/* Form Title & Subtitle */}
        <div className="border-b border-[#E1E8E3] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <RoleIcon className="w-5 h-5 text-[#008F65]" />
              <h2 className="text-xl sm:text-2xl font-black text-[#17211D] uppercase tracking-tight">
                {roleMeta.title}
              </h2>
            </div>
            <p className="text-xs text-[#5F6B65] max-w-xl">
              {roleMeta.subtitle}
            </p>
          </div>
          <span className={`self-start sm:self-center px-3 py-1 rounded text-[11px] font-black uppercase tracking-wider border ${roleMeta.badgeColor}`}>
            STATE ENROLLMENT
          </span>
        </div>

        {submitError && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{submitError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Section: Personal Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="text-xs font-bold text-[#17211D] uppercase block mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => {
                  setFormData({ ...formData, fullName: e.target.value });
                  if (errors.fullName) setErrors({ ...errors, fullName: '' });
                }}
                placeholder="e.g., Rajesh Kumar Sharma"
                className={`w-full px-3 py-2.5 rounded bg-white border text-xs text-[#17211D] placeholder-[#5F6B65] focus:outline-none transition-colors ${
                  errors.fullName ? 'border-rose-500 focus:border-rose-500' : 'border-[#E1E8E3] focus:border-[#008F65] focus:ring-1 focus:ring-[#008F65]'
                }`}
              />
              {errors.fullName && <p className="text-rose-600 text-[11px] mt-1">{errors.fullName}</p>}
            </div>

            {/* Email Address */}
            <div>
              <label className="text-xs font-bold text-[#17211D] uppercase block mb-1">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                placeholder="e.g., coach@example.com"
                className={`w-full px-3 py-2.5 rounded bg-white border text-xs text-[#17211D] placeholder-[#5F6B65] focus:outline-none transition-colors ${
                  errors.email ? 'border-rose-500 focus:border-rose-500' : 'border-[#E1E8E3] focus:border-[#008F65] focus:ring-1 focus:ring-[#008F65]'
                }`}
              />
              {errors.email && <p className="text-rose-600 text-[11px] mt-1">{errors.email}</p>}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="text-xs font-bold text-[#17211D] uppercase block mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                value={formData.contactNumber}
                onChange={(e) => {
                  setFormData({ ...formData, contactNumber: e.target.value });
                  if (errors.contactNumber) setErrors({ ...errors, contactNumber: '' });
                }}
                placeholder="e.g., 9876543210 or +91 98765 43210"
                className={`w-full px-3 py-2.5 rounded bg-white border text-xs text-[#17211D] placeholder-[#5F6B65] focus:outline-none transition-colors ${
                  errors.contactNumber ? 'border-rose-500 focus:border-rose-500' : 'border-[#E1E8E3] focus:border-[#008F65] focus:ring-1 focus:ring-[#008F65]'
                }`}
              />
              {errors.contactNumber && <p className="text-rose-600 text-[11px] mt-1">{errors.contactNumber}</p>}
            </div>

            {/* Father's Name (Supported for Coach) */}
            {roleType === 'COACH' ? (
              <div>
                <label className="text-xs font-bold text-[#17211D] uppercase block mb-1">
                  Father's Name (Optional)
                </label>
                <input
                  type="text"
                  value={formData.fatherName}
                  onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                  placeholder="e.g., Surendra Sharma"
                  className="w-full px-3 py-2.5 rounded bg-white border border-[#E1E8E3] text-xs text-[#17211D] placeholder-[#5F6B65] focus:outline-none focus:border-[#008F65] focus:ring-1 focus:ring-[#008F65] transition-colors"
                />
              </div>
            ) : (
              <div>
                <label className="text-xs font-bold text-[#17211D] uppercase block mb-1">
                  District *
                </label>
                <select
                  value={formData.district}
                  onChange={(e) => {
                    setFormData({ ...formData, district: e.target.value });
                    if (errors.district) setErrors({ ...errors, district: '' });
                  }}
                  className={`w-full px-3 py-2.5 rounded bg-white border text-xs text-[#17211D] focus:outline-none transition-colors ${
                    errors.district ? 'border-rose-500 focus:border-rose-500' : 'border-[#E1E8E3] focus:border-[#008F65] focus:ring-1 focus:ring-[#008F65]'
                  }`}
                >
                  <option value="">Select Uttarakhand District</option>
                  {DISTRICTS_LIST.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist} District
                    </option>
                  ))}
                </select>
                {errors.district && <p className="text-rose-600 text-[11px] mt-1">{errors.district}</p>}
              </div>
            )}

            {/* District for Coach (since Father's Name took the 4th slot) */}
            {roleType === 'COACH' && (
              <div>
                <label className="text-xs font-bold text-[#17211D] uppercase block mb-1">
                  District *
                </label>
                <select
                  value={formData.district}
                  onChange={(e) => {
                    setFormData({ ...formData, district: e.target.value });
                    if (errors.district) setErrors({ ...errors, district: '' });
                  }}
                  className={`w-full px-3 py-2.5 rounded bg-white border text-xs text-[#17211D] focus:outline-none transition-colors ${
                    errors.district ? 'border-rose-500 focus:border-rose-500' : 'border-[#E1E8E3] focus:border-[#008F65] focus:ring-1 focus:ring-[#008F65]'
                  }`}
                >
                  <option value="">Select Uttarakhand District</option>
                  {DISTRICTS_LIST.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist} District
                    </option>
                  ))}
                </select>
                {errors.district && <p className="text-rose-600 text-[11px] mt-1">{errors.district}</p>}
              </div>
            )}

            {/* Address */}
            <div className={roleType === 'COACH' ? '' : 'sm:col-span-2'}>
              <label className="text-xs font-bold text-[#17211D] uppercase block mb-1">
                Residential / Postal Address *
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => {
                  setFormData({ ...formData, address: e.target.value });
                  if (errors.address) setErrors({ ...errors, address: '' });
                }}
                placeholder="e.g., 42 Canal Road, Ballupur, Dehradun"
                className={`w-full px-3 py-2.5 rounded bg-white border text-xs text-[#17211D] placeholder-[#5F6B65] focus:outline-none transition-colors ${
                  errors.address ? 'border-rose-500 focus:border-rose-500' : 'border-[#E1E8E3] focus:border-[#008F65] focus:ring-1 focus:ring-[#008F65]'
                }`}
              />
              {errors.address && <p className="text-rose-600 text-[11px] mt-1">{errors.address}</p>}
            </div>
          </div>

          {/* Section: Qualification & Experience */}
          <div className="pt-4 border-t border-[#E1E8E3] space-y-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#FF7900]" />
              <h3 className="text-xs font-black uppercase text-[#17211D] tracking-wider">
                Professional Qualification & Experience
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Level Dropdown */}
              <div>
                <label className="text-xs font-bold text-[#17211D] uppercase block mb-1">
                  {roleMeta.levelLabel}
                </label>
                <select
                  value={formData.level}
                  onChange={(e) => {
                    setFormData({ ...formData, level: e.target.value });
                    if (errors.level) setErrors({ ...errors, level: '' });
                  }}
                  className={`w-full px-3 py-2.5 rounded bg-white border text-xs text-[#17211D] focus:outline-none transition-colors ${
                    errors.level ? 'border-rose-500 focus:border-rose-500' : 'border-[#E1E8E3] focus:border-[#008F65] focus:ring-1 focus:ring-[#008F65]'
                  }`}
                >
                  <option value="">Select Level</option>
                  <option value="Level 1">Level 1</option>
                  <option value="Level 2">Level 2</option>
                  <option value="Level 3">Level 3</option>
                </select>
                {errors.level && <p className="text-rose-600 text-[11px] mt-1">{errors.level}</p>}
              </div>

              {/* Years of Experience */}
              <div>
                <label className="text-xs font-bold text-[#17211D] uppercase block mb-1">
                  {roleMeta.experienceLabel}
                </label>
                <input
                  type="text"
                  value={formData.experienceYears}
                  onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                  placeholder="e.g., 3 Years"
                  className="w-full px-3 py-2.5 rounded bg-white border border-[#E1E8E3] text-xs text-[#17211D] placeholder-[#5F6B65] focus:outline-none focus:border-[#008F65] focus:ring-1 focus:ring-[#008F65] transition-colors"
                />
              </div>

              {/* Organization / Club */}
              <div>
                <label className="text-xs font-bold text-[#17211D] uppercase block mb-1">
                  {roleMeta.orgLabel}
                </label>
                <input
                  type="text"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  placeholder="e.g., Doon Valley RFC / DPS"
                  className="w-full px-3 py-2.5 rounded bg-white border border-[#E1E8E3] text-xs text-[#17211D] placeholder-[#5F6B65] focus:outline-none focus:border-[#008F65] focus:ring-1 focus:ring-[#008F65] transition-colors"
                />
              </div>
            </div>

            {/* Qualification Level Notice */}
            <div className="p-3.5 rounded-xl bg-[#F5F7F5] border border-[#E1E8E3] flex items-start gap-2.5 text-xs text-[#5F6B65]">
              <HelpCircle className="w-4 h-4 text-[#008F65] shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <span className="font-bold text-[#17211D]">Declared Qualification Policy: </span>
                The level chosen reflects your declared certification. The Uttarakhand Rugby Association displays qualification levels as verified only once formal review and credential validation are concluded by the state technical directorate.
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-[#E1E8E3] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-[11px] text-[#5F6B65]">
              By submitting this form, you confirm that the declared information is accurate and agree to association policies.
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl bg-[#008F65] hover:bg-[#007A56] text-white text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2 shadow-sm disabled:opacity-50 cursor-pointer transition-all"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>SUBMITTING REGISTRATION...</span>
                </>
              ) : (
                <>
                  <span>SUBMIT {roleType} REGISTRATION</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
