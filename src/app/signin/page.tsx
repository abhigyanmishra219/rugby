'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import rugbyLogo from '@/images/rubgylogo.png';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, user } = useUser();
  const router = useRouter();

  // If already logged in, redirect to logged in page
  React.useEffect(() => {
    if (user) {
      router.replace('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const res = await login(email, password);

    if (res.success) {
      router.push('/dashboard');
    } else {
      setError(res.message || 'Invalid credentials. Please verify your email and password.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#F5F7F5] via-white to-[#F5F7F5] relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#008F65]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#FF7900]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header & Logo */}
        <div className="text-center space-y-3 flex flex-col items-center">
          <div className="w-14 h-14 rounded-xl bg-black border border-[#008F65]/30 p-0.5 shadow-md overflow-hidden flex items-center justify-center">
            <Image
              src={rugbyLogo}
              alt="Uttarakhand Rugby Association Logo"
              width={56}
              height={56}
              priority
              className="w-full h-full object-contain rounded-lg"
            />
          </div>

          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#EAF7F1] border border-[#008F65]/20 text-[#008F65] text-xs font-black tracking-widest uppercase">
            <span>MEMBER PORTAL</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-[#17211D] uppercase tracking-tight">
            SIGN <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#008F65] to-[#00B889]">IN</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#5F6B65] max-w-sm mx-auto">
            Access your official Uttarakhand Rugby Association account and dashboard.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-[#E1E8E3] p-7 sm:p-9 shadow-xl space-y-6">
          {error && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-700 flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Field 1: Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#17211D] uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5F6B65]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E1E8E3] focus:border-[#008F65] focus:ring-2 focus:ring-[#008F65]/20 outline-none text-sm text-[#17211D] bg-[#F5F7F5] focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Field 2: Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#17211D] uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5F6B65]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-[#E1E8E3] focus:border-[#008F65] focus:ring-2 focus:ring-[#008F65]/20 outline-none text-sm text-[#17211D] bg-[#F5F7F5] focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#5F6B65] hover:text-[#17211D] transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-[#008F65] hover:bg-[#007452] active:scale-[0.99] text-white font-black text-xs uppercase tracking-widest shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
