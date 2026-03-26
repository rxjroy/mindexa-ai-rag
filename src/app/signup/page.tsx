'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShaderAnimation } from '@/components/ui/shader-animation';
import { Mail, Lock, User, AlertCircle } from 'lucide-react';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { api } from '@/lib/api';

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const resp = await api.auth.signup(email, fullName, password);
      localStorage.setItem('access_token', resp.access_token);
      localStorage.setItem('refresh_token', resp.refresh_token);
      localStorage.setItem('isAuthenticated', 'true');
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    setIsGoogleLoading(true);
    setTimeout(() => {
      setIsGoogleLoading(false);
      setError('Google signup not configured yet');
    }, 800);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-background overflow-hidden selection:bg-gold/30 selection:text-white">
      {/* Background Shader */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none mix-blend-screen opacity-60">
        <ShaderAnimation className="w-full h-full" />
      </div>
      
      {/* Background glow */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] pointer-events-none z-0" 
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md px-6 py-12"
      >
        <div className="glass shadow-2xl shadow-black/50 rounded-3xl p-8 md:p-10 border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl">
          
          <div className="flex flex-col items-center mb-8">
            <Link href="/" className="mb-6 hover:scale-105 transition-transform">
              <img src="/images/logo.png" alt="Mindexa AI" className="h-12 w-auto object-contain brightness-125" />
            </Link>
            <h1 className="text-2xl font-semibold text-white tracking-tight">Create an account</h1>
            <p className="text-gray-400 text-sm mt-2 font-light">Join us to start analyzing your documents</p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <User className="w-4 h-4" />
                </div>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="John Doe" 
                  className="w-full bg-white/[0.03] border border-white/10 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-gold/50 focus:border-gold/30 transition-all font-light placeholder:text-gray-600"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-300 ml-1">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@company.com" 
                  className="w-full bg-white/[0.03] border border-white/10 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-gold/50 focus:border-gold/30 transition-all font-light placeholder:text-gray-600"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••" 
                  className="w-full bg-white/[0.03] border border-white/10 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-gold/50 focus:border-gold/30 transition-all font-light placeholder:text-gray-600"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-center w-full">
              <AnimatedButton 
                type="submit" 
                disabled={isLoading}
                label={isLoading ? 'CREATING...' : 'SIGN UP'}
                className="w-full flex justify-center mt-2"
              />
            </div>
          </form>

          <div className="mt-8 flex items-center justify-center space-x-4">
            <span className="h-px w-full bg-white/10"></span>
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Or</span>
            <span className="h-px w-full bg-white/10"></span>
          </div>

          <button 
            type="button"
            onClick={handleGoogleSignup}
            disabled={isGoogleLoading || isLoading}
            className="w-full mt-8 bg-white/[0.03] border border-white/10 text-white font-medium rounded-xl py-3.5 flex items-center justify-center gap-3 hover:bg-white/[0.05] hover:border-white/20 transition-all focus:outline-none focus:ring-1 focus:ring-white/30 disabled:opacity-70"
          >
            {isGoogleLoading ? (
              <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </>
            )}
          </button>

          <div className="mt-8 text-center text-sm text-gray-400 font-light">
            Already have an account?{' '}
            <Link href="/login" className="text-white hover:text-gold transition-colors font-medium">
              Log in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
