import React from 'react';
import { Phone, Mail, MapPin, Building, ShieldCheck, ArrowUpRight, Clock } from 'lucide-react';
import Logo from './Logo';

export default function ContactStrip() {
  return (
    <div className="w-full bg-gradient-to-r from-iris-950 via-iris-900 to-indigo-950 text-white py-8 border-t border-iris-800/60 shadow-2xl relative overflow-hidden">
      
      {/* Decorative ambient Iris light */}
      <div className="absolute top-0 right-1/3 w-96 h-32 bg-iris-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Logo & Platform Tagline */}
          <div className="lg:col-span-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Logo size="md" light={true} showTagline={true} />
            <div className="hidden sm:block h-10 w-[1px] bg-iris-800/80 mx-1"></div>
            <div className="text-xs text-iris-200/80">
              <span className="font-semibold text-white block">Executive Owner & Advisory Strip</span>
              <span>Direct Property Holder Line</span>
            </div>
          </div>

          {/* Contact Details: Phone, Email, Office Address */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 pt-4 lg:pt-0 border-t lg:border-t-0 border-iris-800/80">
            
            {/* 1. Phone Number */}
            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/10 hover:border-iris-400 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-iris-700/60 text-iris-200 flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] uppercase font-bold text-iris-300 block tracking-wider">
                  Owner / Desk Phone
                </span>
                <a 
                  href="tel:+18007767346" 
                  className="text-xs sm:text-sm font-bold text-white hover:text-iris-300 transition-colors truncate block"
                >
                  +1 (800) 776-7346
                </a>
              </div>
            </div>

            {/* 2. Email Address */}
            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/10 hover:border-iris-400 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-iris-700/60 text-iris-200 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] uppercase font-bold text-iris-300 block tracking-wider">
                  Official Email
                </span>
                <a 
                  href="mailto:owner.desk@propfind.luxury" 
                  className="text-xs sm:text-sm font-bold text-white hover:text-iris-300 transition-colors truncate block"
                >
                  owner.desk@propfind.luxury
                </a>
              </div>
            </div>

            {/* 3. Office Located Address */}
            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/10 hover:border-iris-400 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-iris-700/60 text-iris-200 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] uppercase font-bold text-iris-300 block tracking-wider">
                  Office Location
                </span>
                <p className="text-xs font-semibold text-white truncate">
                  742 Iris Blvd, Suite 1200, SF, CA
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Micro Strip */}
        <div className="mt-6 pt-4 border-t border-iris-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-iris-400 gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>PropFind Global Escrow Network • 80 Destinations Synchronized with SQLite</span>
          </div>
          <div className="flex items-center gap-4">
            <span>© 2026 PropFind Inc. All Rights Reserved.</span>
            <span className="hidden sm:inline">•</span>
            <span className="text-iris-300">White • Ivory • Iris Theme</span>
          </div>
        </div>
      </div>
    </div>
  );
}
