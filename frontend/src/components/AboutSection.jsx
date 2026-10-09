import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Compass, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  MapPin, 
  Award,
  ArrowUpRight
} from 'lucide-react';

export default function AboutSection({ onExploreClick }) {
  const highlights = [
    {
      icon: <Building2 className="w-6 h-6 text-iris-600" />,
      title: "Golden Ratio Architecture",
      desc: "Every residence in our 80-property catalogue is selected for structural harmony, natural light infusion, and pristine glass craftsmanship."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-iris-600" />,
      title: "Real-Time Exclusivity Lock",
      desc: "When a property is secured by a buyer or renter, our SQLite engine instantly updates its status to SOLD or RENTED, preventing duplicate acquisition."
    },
    {
      icon: <Award className="w-6 h-6 text-iris-600" />,
      title: "Verified Direct Sellers",
      desc: "Inspect full seller credentials, phone numbers, ratings, and agencies prior to submitting formal enquiries with automated confirmation."
    },
    {
      icon: <MapPin className="w-6 h-6 text-iris-600" />,
      title: "80 Prime Global Destinations",
      desc: "Interactive geospatial discovery across 5 distinct categories: Residential Condos, Commercial Towers, Warehouses, Farmhouses, and Beach Houses."
    }
  ];

  return (
    <section id="about-section" className="py-20 lg:py-28 bg-white relative overflow-hidden border-t border-b border-neutral-200/50">
      
      {/* Background Decorative Rings */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-iris-50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-ivory-200/60 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-iris-50 border border-iris-200 text-iris-700 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>About PropFind</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 tracking-tight leading-tight">
            Redefining Luxury Property Discovery With Complete Integrity
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 leading-relaxed font-normal">
            PropFind was conceived to bring architectural clarity to high-end real estate. From panoramic sea-view villas with infinity pools to clean glassy metropolitan towers, we eliminate noise and provide direct, verified connections between discerning buyers and sellers.
          </p>
        </div>

        {/* 4 Feature Cards (Golden Ratio Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {highlights.map((item, idx) => (
            <div
              key={idx}
              className="glass-card p-6 sm:p-7 rounded-3xl border border-neutral-200/80 bg-ivory-50/50 flex flex-col justify-between hover:border-iris-300 transition-all group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-iris-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-neutral-900 group-hover:text-iris-700 transition-colors">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-sm text-neutral-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-200/50 flex items-center text-xs font-semibold text-iris-600 group-hover:translate-x-1 transition-transform">
                <span>Certified Standard</span>
                <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>
          ))}
        </div>

        {/* Architectural Showcase Banner */}
        <div className="mt-14 glass-panel p-6 sm:p-10 rounded-3xl border border-iris-200/60 shadow-lg bg-gradient-to-r from-ivory-50 via-white to-iris-50/40">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8">
              <span className="text-xs font-bold text-iris-600 uppercase tracking-widest">
                Curated Standards
              </span>
              <h3 className="mt-1 text-2xl sm:text-3xl font-extrabold text-neutral-900 font-display">
                Engineered for Serious Buyers & Verified Institutional Sellers
              </h3>
              <p className="mt-3 text-sm sm:text-base text-neutral-600 leading-relaxed max-w-2xl">
                Whether you are searching for an oceanfront infinity pool sanctuary in Malibu, an executive glass tower in Silicon Valley, or an 18-acre vineyard in Napa, PropFind provides comprehensive side-by-side spec comparisons, interactive map plotting, and direct enquiry channels.
              </p>
              
              <div className="mt-6 flex flex-wrap gap-4 text-xs font-bold text-neutral-800">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-neutral-200 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 80 Pre-vetted Properties
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-neutral-200 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Direct Seller Email Dispatch
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-neutral-200 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> SQLite Persistence
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-6 bg-white rounded-2xl border border-iris-100 shadow-sm">
              <span className="text-4xl sm:text-5xl font-black text-iris-600 font-display">
                $480M+
              </span>
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider mt-1">
                Portfolio Valuation
              </span>
              <p className="text-xs text-neutral-600 mt-2">
                Available across 80 prime locations worldwide.
              </p>
              <button
                onClick={onExploreClick}
                className="mt-5 w-full py-2.5 px-4 rounded-xl bg-iris-600 hover:bg-iris-700 text-white text-xs font-bold transition-all shadow-sm"
              >
                Explore All 80 Listings
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
