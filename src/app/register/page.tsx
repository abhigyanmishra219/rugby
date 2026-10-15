'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  Shield, 
  Printer, 
  Sparkles, 
  Flame, 
  Check,
  AlertCircle,
  Award,
  Briefcase,
  UserCheck,
  Users
} from 'lucide-react';
import rugbyLogo from '@/images/rubgylogo.png';
import OfficialRegistrationForm, { OfficialType } from '@/components/OfficialRegistrationForm';

export type RegistrationRole = 'PLAYER' | 'COACH' | 'MANAGER' | 'REFEREE';

function RegisterPageContent() {
  const searchParams = useSearchParams();
  const initialRoleParam = searchParams.get('role') || searchParams.get('type') || 'PLAYER';
  const validInitialRole: RegistrationRole = ['COACH', 'MANAGER', 'REFEREE'].includes(initialRoleParam.toUpperCase())
    ? (initialRoleParam.toUpperCase() as RegistrationRole)
    : 'PLAYER';

  const [roleType, setRoleType] = useState<RegistrationRole>(validInitialRole);

  useEffect(() => {
    const roleParam = searchParams.get('role') || searchParams.get('type');
    if (roleParam && ['PLAYER', 'COACH', 'MANAGER', 'REFEREE'].includes(roleParam.toUpperCase())) {
      setRoleType(roleParam.toUpperCase() as RegistrationRole);
    }
  }, [searchParams]);

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [generatedId, setGeneratedId] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form State - Steps 1 & 2 only
  const [formData, setFormData] = useState({
    // Step 1: Personal Details
    fullName: '',
    fatherName: '',
    dob: '',
    district: '',
    contactNumber: '',
    email: '',
    nsrsId: '',

    // Step 2: Address & Emergency Details
    address: '',
    emergencyContact: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const todayStr = new Date().toISOString().split('T')[0];

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full Name is required';
      }

      if (!formData.fatherName.trim()) {
        newErrors.fatherName = "Father's Name is required";
      }

      if (!formData.dob) {
        newErrors.dob = 'Date of birth (DOB) is required';
      } else {
        const selectedDate = new Date(formData.dob);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate > today) {
          newErrors.dob = 'Date of birth cannot be in the future';
        }
      }

      if (!formData.district) {
        newErrors.district = 'Please select your Uttarakhand district';
      }

      // Indian mobile number validation (10 digits starting with 6-9, optionally prefixed with +91, 91 or 0)
      const cleanPhone = formData.contactNumber.replace(/[\s\-()]/g, '');
      const indianPhoneRegex = /^(\+91|91|0)?[6-9]\d{9}$/;
      if (!formData.contactNumber.trim()) {
        newErrors.contactNumber = 'Contact number is required';
      } else if (!indianPhoneRegex.test(cleanPhone)) {
        newErrors.contactNumber = 'Please enter a valid 10-digit Indian mobile number (e.g., 9876543210 or +91 98765 43210)';
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email.trim()) {
        newErrors.email = 'Email address is required';
      } else if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address (e.g., player@example.com)';
      }

      // NSRS ID is optional
    }

    if (step === 2) {
      if (!formData.address.trim()) {
        newErrors.address = 'Residential address is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok && result.success && result.registration?.registrationId) {
        setGeneratedId(result.registration.registrationId);
        setIsCompleted(true);
      } else {
        setSubmitError(result.error || result.message || 'Failed to submit player registration. Please try again.');
      }
    } catch (err: any) {
      setSubmitError(err?.message || 'Network error occurred while connecting to the server. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const districtsList = [
    'Dehradun', 'Haridwar', 'Nainital', 'Udham Singh Nagar',
    'Pauri Garhwal', 'Almora', 'Tehri Garhwal', 'Chamoli',
    'Uttarkashi', 'Rudraprayag', 'Pithoragarh', 'Bageshwar', 'Champawat'
  ];

  return (
    <div className="py-12 sm:py-20 space-y-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <section className="relative rounded-2xl overflow-hidden bg-[#F5F7F5] border border-[#E1E8E3] p-8 sm:p-12 shadow-sm text-center">
        <div className="max-w-2xl mx-auto space-y-4 relative z-10 flex flex-col items-center">
          {/* Official Association Logo */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-black border-2 border-[#008F65]/40 shadow-lg overflow-hidden p-1 flex items-center justify-center">
            <Image
              src={rugbyLogo}
              alt="Uttarakhand Rugby Association Official Logo"
              width={96}
              height={96}
              priority
              className="w-full h-full object-contain rounded-xl"
            />
          </div>

          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-[#EAF7F1] border border-[#008F65]/20 text-[#008F65] text-xs font-black tracking-widest uppercase">
            <Flame className="w-3.5 h-3.5 text-[#FF7900]" />
            <span>OFFICIAL STATE REGISTRATION PORTAL</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#17211D] uppercase tracking-tight leading-tight">
            JOIN <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#008F65] to-[#00B889]">UTTARAKHAND RUGBY ASSOCIATION</span>
          </h1>

          <p className="text-sm sm:text-base text-[#5F6B65] font-normal leading-relaxed max-w-xl">
            Register as a player, coach, manager, or referee with the Uttarakhand Rugby Association.
          </p>
        </div>
      </section>

      {/* Role Selection Tabs */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-[#5F6B65]">
            SELECT REGISTRATION CATEGORY
          </span>
          <span className="text-[11px] font-bold text-[#008F65]">
            4 Official Roles
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            {
              id: 'PLAYER' as RegistrationRole,
              title: 'Player Registration',
              subtitle: 'State athletes & junior players',
              icon: Users,
            },
            {
              id: 'COACH' as RegistrationRole,
              title: 'Coach Registration',
              subtitle: 'Technical coaches & trainers',
              icon: Award,
            },
            {
              id: 'MANAGER' as RegistrationRole,
              title: 'Manager Registration',
              subtitle: 'Club & team administrators',
              icon: Briefcase,
            },
            {
              id: 'REFEREE' as RegistrationRole,
              title: 'Referee Registration',
              subtitle: 'Match officials & adjudicators',
              icon: UserCheck,
            },
          ].map((role) => {
            const Icon = role.icon;
            const isSelected = roleType === role.id;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => setRoleType(role.id)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#EAF7F1] border-[#008F65] shadow-xs ring-2 ring-[#008F65]/20'
                    : 'bg-white border-[#E1E8E3] hover:border-[#008F65]/40 hover:bg-[#FAFBF9]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-[#008F65] text-white'
                        : 'bg-[#F5F7F5] text-[#5F6B65]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-[#008F65]" />
                  )}
                </div>
                <div>
                  <h3
                    className={`text-xs sm:text-sm font-black uppercase tracking-wide leading-tight ${
                      isSelected ? 'text-[#008F65]' : 'text-[#17211D]'
                    }`}
                  >
                    {role.title}
                  </h3>
                  <p className="text-[11px] text-[#5F6B65] mt-0.5 line-clamp-1">
                    {role.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Role Form Rendering */}
      {roleType !== 'PLAYER' ? (
        <OfficialRegistrationForm roleType={roleType} onSelectRole={setRoleType} />
      ) : !isCompleted ? (
        <div className="space-y-8">
          {/* Stepper Wizard Indicator - 3 Steps */}
          <div className="p-4 rounded-xl bg-white border border-[#E1E8E3] shadow-xs">
            <div className="text-center pb-3 border-b border-[#E1E8E3] mb-4">
              <h2 className="text-xl sm:text-2xl font-black text-[#17211D] uppercase tracking-tight">
                PLAYER REGISTRATION
              </h2>
              <p className="text-xs text-[#5F6B65] mt-0.5">
                Uttarakhand Rugby Association official player enrollment form.
              </p>
            </div>
            <div className="flex items-center justify-between max-w-xl mx-auto text-xs font-bold uppercase">
              {[
                { step: 1, label: 'Player Details' },
                { step: 2, label: 'Address & Guardian' },
                { step: 3, label: 'Review & Submit' }
              ].map((s, idx) => (
                <div key={s.step} className="flex items-center">
                  <div className="flex flex-col items-center space-y-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-all ${
                      currentStep === s.step
                        ? 'bg-[#FF7900] text-white ring-4 ring-[#FF7900]/20'
                        : currentStep > s.step
                        ? 'bg-[#008F65] text-white'
                        : 'bg-[#F5F7F5] border border-[#E1E8E3] text-[#5F6B65]'
                    }`}>
                      {currentStep > s.step ? <Check className="w-4 h-4" /> : s.step}
                    </div>
                    <span className="text-[10px] hidden sm:block text-[#5F6B65]">{s.label}</span>
                  </div>
                  {idx < 2 && (
                    <div className={`w-14 sm:w-28 h-0.5 mx-2 sm:mx-4 ${currentStep > s.step ? 'bg-[#008F65]' : 'bg-[#E1E8E3]'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Registration Form Card */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-10 rounded-2xl bg-white border border-[#E1E8E3] shadow-xs space-y-6">
            {submitError && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Step 1: Personal Info */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="border-b border-[#E1E8E3] pb-3">
                  <h3 className="text-lg font-black text-[#17211D] uppercase">Step 1: Player Information</h3>
                  <p className="text-xs text-[#5F6B65]">
                    Please provide official player details matching your sports records and state affiliation.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Row 1: Full Name | Father's Name */}
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
                      placeholder="e.g., Rohit Singh Rawat"
                      className={`w-full px-3 py-2.5 rounded bg-white border text-xs text-[#17211D] placeholder-[#5F6B65] focus:outline-none transition-colors ${
                        errors.fullName ? 'border-rose-500 focus:border-rose-500' : 'border-[#E1E8E3] focus:border-[#008F65] focus:ring-1 focus:ring-[#008F65]'
                      }`}
                    />
                    {errors.fullName && <p className="text-rose-600 text-[11px] mt-1">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#17211D] uppercase block mb-1">
                      Father's Name *
                    </label>
                    <input
                      type="text"
                      value={formData.fatherName}
                      onChange={(e) => {
                        setFormData({ ...formData, fatherName: e.target.value });
                        if (errors.fatherName) setErrors({ ...errors, fatherName: '' });
                      }}
                      placeholder="e.g., Surendra Singh Rawat"
                      className={`w-full px-3 py-2.5 rounded bg-white border text-xs text-[#17211D] placeholder-[#5F6B65] focus:outline-none transition-colors ${
                        errors.fatherName ? 'border-rose-500 focus:border-rose-500' : 'border-[#E1E8E3] focus:border-[#008F65] focus:ring-1 focus:ring-[#008F65]'
                      }`}
                    />
                    {errors.fatherName && <p className="text-rose-600 text-[11px] mt-1">{errors.fatherName}</p>}
                  </div>

                  {/* Row 2: Date of Birth | District */}
                  <div>
                    <label className="text-xs font-bold text-[#17211D] uppercase block mb-1">
                      Date of Birth (DOB) *
                    </label>
                    <input
                      type="date"
                      max={todayStr}
                      value={formData.dob}
                      onChange={(e) => {
                        setFormData({ ...formData, dob: e.target.value });
                        if (errors.dob) setErrors({ ...errors, dob: '' });
                      }}
                      className={`w-full px-3 py-2.5 rounded bg-white border text-xs text-[#17211D] focus:outline-none transition-colors ${
                        errors.dob ? 'border-rose-500 focus:border-rose-500' : 'border-[#E1E8E3] focus:border-[#008F65] focus:ring-1 focus:ring-[#008F65]'
                      }`}
                    />
                    {errors.dob && <p className="text-rose-600 text-[11px] mt-1">{errors.dob}</p>}
                  </div>

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
                      {districtsList.map((dist) => (
                        <option key={dist} value={dist}>
                          {dist} District
                        </option>
                      ))}
                    </select>
                    {errors.district && <p className="text-rose-600 text-[11px] mt-1">{errors.district}</p>}
                  </div>

                  {/* Row 3: Contact Number | Email Address */}
                  <div>
                    <label className="text-xs font-bold text-[#17211D] uppercase block mb-1">
                      Contact Number *
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
                      placeholder="e.g., player@example.com"
                      className={`w-full px-3 py-2.5 rounded bg-white border text-xs text-[#17211D] placeholder-[#5F6B65] focus:outline-none transition-colors ${
                        errors.email ? 'border-rose-500 focus:border-rose-500' : 'border-[#E1E8E3] focus:border-[#008F65] focus:ring-1 focus:ring-[#008F65]'
                      }`}
                    />
                    {errors.email && <p className="text-rose-600 text-[11px] mt-1">{errors.email}</p>}
                  </div>

                  {/* Row 4: NSRS ID (full width) */}
                  <div className="sm:col-span-2">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-[#17211D] uppercase">
                        NSRS ID
                      </label>
                      <span className="text-[10px] text-[#5F6B65] font-semibold uppercase">Optional</span>
                    </div>
                    <input
                      type="text"
                      value={formData.nsrsId}
                      onChange={(e) => setFormData({ ...formData, nsrsId: e.target.value })}
                      placeholder="National Sports Repository System ID (e.g., NSRS-UK-XXXXX)"
                      className="w-full px-3 py-2.5 rounded bg-white border border-[#E1E8E3] text-xs text-[#17211D] placeholder-[#5F6B65] focus:outline-none focus:border-[#008F65] focus:ring-1 focus:ring-[#008F65]"
                    />
                    <p className="text-[11px] text-[#5F6B65] mt-1">
                      Leave blank if an NSRS ID has not been issued to you yet.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Address & Emergency Details */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="border-b border-[#E1E8E3] pb-3">
                  <h3 className="text-lg font-black text-[#17211D] uppercase">Step 2: Address & Emergency Details</h3>
                  <p className="text-xs text-[#5F6B65]">Provide your verified residential address and emergency guardian details.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-[#17211D] uppercase block mb-1">Residential Address *</label>
                    <textarea
                      rows={2}
                      value={formData.address}
                      onChange={(e) => {
                        setFormData({ ...formData, address: e.target.value });
                        if (errors.address) setErrors({ ...errors, address: '' });
                      }}
                      placeholder="House / Flat No., Street, Locality, Tehsil, Pincode"
                      className={`w-full px-3 py-2 rounded bg-white border text-xs text-[#17211D] placeholder-[#5F6B65] focus:outline-none transition-colors ${
                        errors.address ? 'border-rose-500 focus:border-rose-500' : 'border-[#E1E8E3] focus:border-[#008F65] focus:ring-1 focus:ring-[#008F65]'
                      }`}
                    />
                    {errors.address && <p className="text-rose-600 text-[11px] mt-1">{errors.address}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-[#17211D] uppercase block mb-1">Emergency Contact Person & Phone</label>
                    <input
                      type="text"
                      value={formData.emergencyContact}
                      onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                      placeholder="e.g., Parent/Guardian Name & Mobile Number"
                      className="w-full px-3 py-2.5 rounded bg-white border border-[#E1E8E3] text-xs text-[#17211D] placeholder-[#5F6B65] focus:outline-none focus:border-[#008F65] focus:ring-1 focus:ring-[#008F65]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Review & Submit */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="border-b border-[#E1E8E3] pb-3">
                  <h3 className="text-lg font-black text-[#17211D] uppercase">Step 3: Review & Submit</h3>
                  <p className="text-xs text-[#5F6B65]">Verify your details before generating your official registration badge.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#F5F7F5] p-5 rounded-xl border border-[#E1E8E3]">
                  <div>
                    <span className="text-[#5F6B65] uppercase text-[10px] block">Full Name:</span>
                    <span className="text-[#17211D] font-bold">{formData.fullName || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="text-[#5F6B65] uppercase text-[10px] block">Father's Name:</span>
                    <span className="text-[#17211D] font-bold">{formData.fatherName || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="text-[#5F6B65] uppercase text-[10px] block">Date of Birth (DOB):</span>
                    <span className="text-[#17211D] font-bold">{formData.dob || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="text-[#5F6B65] uppercase text-[10px] block">District:</span>
                    <span className="text-[#008F65] font-bold">{formData.district ? `${formData.district} District` : 'Not selected'}</span>
                  </div>
                  <div>
                    <span className="text-[#5F6B65] uppercase text-[10px] block">Contact Number:</span>
                    <span className="text-[#17211D] font-bold">{formData.contactNumber || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="text-[#5F6B65] uppercase text-[10px] block">Email Address:</span>
                    <span className="text-[#17211D] font-bold">{formData.email || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="text-[#5F6B65] uppercase text-[10px] block">Residential Address:</span>
                    <span className="text-[#17211D] font-bold">{formData.address || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="text-[#5F6B65] uppercase text-[10px] block">Emergency Contact:</span>
                    <span className="text-[#17211D] font-bold">{formData.emergencyContact || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="text-[#5F6B65] uppercase text-[10px] block">NSRS ID:</span>
                    <span className="text-[#FF7900] font-mono font-bold">{formData.nsrsId || 'Not assigned / Pending'}</span>
                  </div>
                  <div>
                    <span className="text-[#5F6B65] uppercase text-[10px] block">Category:</span>
                    <span className="text-[#FF7900] font-bold">{roleType} REGISTRATION</span>
                  </div>
                </div>
              </div>
            )}

            {/* Form Controls */}
            <div className="pt-4 border-t border-[#E1E8E3] flex items-center justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-5 py-2.5 rounded-lg bg-[#F5F7F5] hover:bg-zinc-200 text-[#17211D] border border-[#E1E8E3] font-bold text-xs uppercase flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>
              ) : (
                <div />
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-lg bg-[#008F65] hover:bg-[#007553] text-white font-black text-xs uppercase flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                >
                  <span>Continue Step {currentStep + 1}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 rounded-lg bg-[#008F65] hover:bg-[#007553] text-white font-black text-xs uppercase flex items-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span>Submitting Player Registration...</span>
                  ) : (
                    <>
                      <span>SUBMIT PLAYER REGISTRATION</span>
                      <Sparkles className="w-4 h-4 text-white" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      ) : (
        /* Successful Submission Message & Pending Review Acknowledgment */
        <div className="rounded-2xl bg-white border border-[#E1E8E3] p-8 sm:p-12 shadow-sm text-center space-y-6 animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-full bg-[#EAF7F1] border border-[#008F65]/30 text-[#008F65] flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div className="max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] font-black uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full inline-block">
              REGISTRATION SUBMITTED • AWAITING REVIEW
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#17211D] uppercase tracking-tight">
              PLAYER REGISTRATION RECEIVED
            </h2>
            <p className="text-sm sm:text-base text-[#17211D] font-medium mt-3 leading-relaxed">
              Your player registration has been submitted successfully to the Uttarakhand Rugby Association. Your registration will be reviewed by the association.
            </p>
            <p className="text-xs text-[#5F6B65] leading-relaxed">
              Your player record is currently awaiting administrative review and approval. An administrator from Uttarakhand Rugby Association will review your application.
            </p>
          </div>

          {/* Digital Athlete ID Acknowledgment Badge */}
          <div className="max-w-md mx-auto rounded-xl bg-gradient-to-br from-[#EAF7F1] via-white to-[#F5F7F5] border-2 border-[#008F65] p-6 shadow-md text-left space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#008F65]/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-[#E1E8E3] pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded bg-black p-0.5 border border-[#008F65]/30 overflow-hidden flex items-center justify-center shrink-0">
                  <Image
                    src={rugbyLogo}
                    alt="Uttarakhand Rugby Association Logo"
                    width={28}
                    height={28}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-xs font-black text-[#17211D] uppercase">UTTARAKHAND RUGBY ASSOCIATION</span>
              </div>
              <span className="text-[10px] font-mono text-[#FF7900] font-bold">{generatedId}</span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-lg bg-[#008F65] flex items-center justify-center text-white font-black text-xl shadow-xs shrink-0">
                {formData.fullName ? formData.fullName.charAt(0) : 'U'}
              </div>
              <div>
                <h4 className="text-lg font-black text-[#17211D] uppercase leading-snug">
                  {formData.fullName || 'Registered Player'}
                </h4>
                {formData.fatherName && (
                  <div className="text-xs text-[#5F6B65]">
                    S/O / D/O: <span className="font-semibold text-[#17211D]">{formData.fatherName}</span>
                  </div>
                )}
                <div className="text-xs text-[#008F65] font-semibold mt-0.5">
                  PLAYER REGISTRATION • PENDING REVIEW
                </div>
                <div className="text-[11px] text-[#5F6B65]">
                  {formData.district} District
                </div>
                {formData.nsrsId && (
                  <div className="text-[10px] text-[#FF7900] font-mono mt-0.5">
                    NSRS ID: {formData.nsrsId}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-[#E1E8E3] grid grid-cols-2 gap-2 text-[10px]">
              <div>
                <span className="text-[#5F6B65] uppercase block">Affiliation:</span>
                <span className="text-[#17211D] font-bold truncate block">{formData.district ? `${formData.district} District Squad` : 'State Pool'}</span>
              </div>
              <div>
                <span className="text-[#5F6B65] uppercase block">Status:</span>
                <span className="text-amber-700 font-bold">Awaiting Review</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-6 py-3 rounded-lg bg-[#008F65] hover:bg-[#007553] text-white font-bold text-xs uppercase flex items-center space-x-2 shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>PRINT REGISTRATION SLIP</span>
            </button>

            <button
              onClick={() => {
                setFormData({
                  fullName: '',
                  fatherName: '',
                  dob: '',
                  district: '',
                  contactNumber: '',
                  email: '',
                  nsrsId: '',
                  address: '',
                  emergencyContact: '',
                });
                setSubmitError(null);
                setIsCompleted(false);
                setCurrentStep(1);
              }}
              className="px-6 py-3 rounded-lg bg-[#F5F7F5] hover:bg-zinc-200 border border-[#E1E8E3] text-[#17211D] font-bold text-xs uppercase cursor-pointer"
            >
              Register Another Member
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-4 border-[#008F65]/20 border-t-[#008F65] rounded-full animate-spin" />
          <p className="text-xs font-bold text-[#5F6B65] uppercase tracking-wider">
            Loading registration portal...
          </p>
        </div>
      }
    >
      <RegisterPageContent />
    </Suspense>
  );
}

