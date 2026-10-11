import React from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  FileText, 
  Hash, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2, 
  Users
} from 'lucide-react';
import { AssociationInfo } from '@/data/types';

interface AssociationInfoCardProps {
  data: AssociationInfo;
  variant: 'office' | 'registration';
}

export default function AssociationInfoCard({ data, variant }: AssociationInfoCardProps) {
  if (variant === 'office') {
    return (
      <div className="bg-[#f0f7fd] border border-sky-100 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow h-full">
        <div className="space-y-6">
          {/* Card Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-sky-200/60">
            <div className="w-11 h-11 rounded-xl bg-sky-100 border border-sky-200 flex items-center justify-center text-emerald-800 shrink-0 shadow-xs">
              <Building2 className="w-5 h-5 text-emerald-800" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800">
                Official Secretariat
              </span>
              <h3 className="text-lg sm:text-xl font-black text-[#0f2744] uppercase tracking-tight">
                Office & Contact Information
              </h3>
            </div>
          </div>

          {/* Key Officials In Office */}
          <div className="bg-white/80 border border-sky-200/70 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-800">
              <Users className="w-4 h-4 text-emerald-700" />
              <span>Key Officials in Office</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <span className="block text-[11px] font-bold text-slate-500 uppercase">President</span>
                <span className="text-sm font-black text-slate-900">{data.president}</span>
              </div>
              <div>
                <span className="block text-[11px] font-bold text-slate-500 uppercase">General Secretary</span>
                <span className="text-sm font-black text-slate-900">{data.generalSecretary}</span>
              </div>
              <div>
                <span className="block text-[11px] font-bold text-slate-500 uppercase">Treasurer</span>
                <span className="text-sm font-black text-slate-900">{data.treasurer}</span>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Registered Office Address</span>
            </div>
            <p className="text-sm font-semibold text-slate-900 pl-6 leading-relaxed">
              {data.address}
            </p>
          </div>

          {/* Contact Numbers */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Contact Numbers</span>
            </div>
            <div className="pl-6 flex flex-wrap items-center gap-2">
              {data.contacts.map((contact, idx) => (
                <React.Fragment key={contact.value}>
                  <a
                    href={`tel:${contact.value}`}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white border border-sky-200 text-emerald-800 hover:text-emerald-950 hover:border-emerald-600 text-xs sm:text-sm font-black tracking-wide shadow-xs transition-colors"
                  >
                    {contact.display}
                  </a>
                  {idx < data.contacts.length - 1 && (
                    <span className="text-slate-400 font-bold text-sm">/</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              <Mail className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Official Email</span>
            </div>
            <div className="pl-6">
              <a
                href={`mailto:${data.email}`}
                className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white border border-sky-200 text-emerald-800 hover:text-emerald-950 hover:border-emerald-600 text-xs sm:text-sm font-bold break-all shadow-xs transition-colors"
              >
                {data.email}
              </a>
            </div>
          </div>
        </div>

        {/* Card Footer note */}
        <div className="pt-5 mt-6 border-t border-sky-200/50 flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <span>Official Secretariat & Administrative Office</span>
          <span className="font-bold text-emerald-800">Roorkee, Haridwar</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f0f7fd] border border-sky-100 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow h-full">
      <div className="space-y-6">
        {/* Card Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-sky-200/60">
          <div className="w-11 h-11 rounded-xl bg-sky-100 border border-sky-200 flex items-center justify-center text-emerald-800 shrink-0 shadow-xs">
            <ShieldCheck className="w-5 h-5 text-emerald-800" />
          </div>
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800">
              Statutory Accreditation
            </span>
            <h3 className="text-lg sm:text-xl font-black text-[#0f2744] uppercase tracking-tight">
              Registration Details
            </h3>
          </div>
        </div>

        {/* Registration Act */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Registration Act</span>
          </div>
          <div className="pl-6">
            <span className="text-sm sm:text-base font-black text-slate-900">
              {data.registrationAct}
            </span>
          </div>
        </div>

        {/* Registration Number */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Hash className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Registration Number</span>
          </div>
          <div className="pl-6">
            <div className="inline-block bg-white border border-sky-200 rounded-lg px-3.5 py-2 shadow-xs max-w-full">
              <span className="font-mono font-black text-sm sm:text-base text-slate-900 tracking-wider break-all select-all">
                {data.registrationNumber}
              </span>
            </div>
          </div>
        </div>

        {/* Registration Date */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Calendar className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Registration Date</span>
          </div>
          <div className="pl-6">
            <span className="text-sm sm:text-base font-black text-slate-900">
              {data.registrationDate}
            </span>
          </div>
        </div>

        {/* Compliance Box */}
        <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200/80 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-950 leading-relaxed font-medium">
            Officially sanctioned state sports society governed under the Society Registration Act, 1860, empowered to organize, regulate, and sanction rugby tournaments and provincial player selections across Uttarakhand.
          </div>
        </div>
      </div>

      {/* Card Footer note */}
      <div className="pt-5 mt-6 border-t border-sky-200/50 flex items-center justify-between text-[11px] text-slate-500 font-medium">
        <span>State of Uttarakhand Jurisdiction</span>
        <span className="font-bold text-emerald-800">Govt. Verified Society</span>
      </div>
    </div>
  );
}
