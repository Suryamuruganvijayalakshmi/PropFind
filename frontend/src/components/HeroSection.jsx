import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  DollarSign, 
  Building, 
  Waves, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Star,
  Eye,
  SlidersHorizontal,
  Compass
} from 'lucide-react';

export default function HeroSection({
  onQuickSearch,
  listingType,
  setListingType,
  totalProperties = 80,
  onExploreClick
}) {
  const [headlineMode, setHeadlineMode] = useState(0);
  const [isFloatAnimating, setIsFloatAnimating] = useState(false);
  const [locationQuery, setLocationQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [budgetTier, setBudgetTier] = useState('all');

  // 3-Lined Headings that animate and float when clicked
  const headlineVariations = [
    {
      line1: "Curated Architectural Living.",
      line2: "Where Ocean Horizons Meet",
      line3: "Pristine Glass Pavilions.",
      subtitle: "Explore 80 meticulously verified residences, commercial landmarks, and seafront havens worldwide."
    },
    {
      line1: "Immersive Real Estate Discovery.",
      line2: "Framed In Pure Crystal Glass",
      line3: "Overlooking Coastal Tides.",
      subtitle: "Connecting discerning buyers with certified private sellers through transparent real-time acquisitions."
    },
    {
      line1: "Transcendent Modern Sanctuaries.",
      line2: "Sculpted For Quiet Distinction",
      line3: "And Endless Ocean Light.",
      subtitle: "Zero intermediaries. Real-time availability locks. Comprehensive architectural comparisons."
    }
  ];

  const currentHeadline = headlineVariations[headlineMode];

  const handleHeadlineClick = () => {
    setIsFloatAnimating(true);
    setTimeout(() => {
      setHeadlineMode((prev) => (prev + 1) % headlineVariations.length);
      setIsFloatAnimating(false);
    }, 280);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onQuickSearch({
      location: locationQuery,
      property_type: selectedType,
      budgetTier: budgetTier
    });
  };

  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-gradient-to-b from-ivory-100 via-ivory to-white">
      {/* Subtle Iris Ambient Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-iris-400/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-iris-200/20 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Floating Badge */}
        <div className="flex justify-center mb-6">
          <div 
            onClick={handleHeadlineClick}
            className="group inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-iris-200/80 shadow-xs hover:border-iris-400 cursor-pointer transition-all hover:scale-105 active:scale-95"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-iris-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-iris-600"></span>
            </span>
            <span className="text-xs font-semibold text-neutral-800 tracking-wide">
              PropFind Global Portfolio • {totalProperties} Verified Properties
            </span>
            <span className="text-[11px] text-iris-600 font-medium group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              Click to animate <Sparkles className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* 3-LINED HEADLINE WITH FLOATY CLICK ANIMATION */}
        <div 
          onClick={handleHeadlineClick}
          className="text-center max-w-4xl mx-auto cursor-pointer select-none group relative py-2"
          title="Click to trigger floaty animation"
        >
          <div className={`transition-all duration-300 transform ${isFloatAnimating ? 'opacity-0 scale-95 translate-y-3' : 'opacity-100 scale-100 translate-y-0'}`}>
            <h1 className="font-display tracking-tight text-3xl sm:text-5xl lg:text-6xl font-extrabold text-neutral-900 leading-[1.12]">
              {/* Line 1 */}
              <span className="block text-neutral-900 group-hover:text-neutral-800 transition-colors">
                {currentHeadline.line1}
              </span>
              {/* Line 2 */}
              <span className="block mt-1 sm:mt-2 text-neutral-700">
                {currentHeadline.line2}
              </span>
              {/* Line 3 with Iris Gradient */}
              <span className="block mt-1 sm:mt-2 bg-gradient-to-r from-iris-600 via-iris-500 to-indigo-700 bg-clip-text text-transparent drop-shadow-xs">
                {currentHeadline.line3}
              </span>
            </h1>
          </div>

          <p className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg text-neutral-600 max-w-2xl mx-auto font-normal leading-relaxed">
            {currentHeadline.subtitle}
          </p>

          <div className="mt-2 text-[11px] text-iris-600 font-medium tracking-wide flex items-center justify-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
            <Sparkles className="w-3 h-3 text-iris-500 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Interactive headline: Click anywhere on title for dynamic float effect</span>
          </div>
        </div>

        {/* PROPERTY HERO VISUAL CANVAS:
            Left: Sea view with swimming pool
            Right: Glassy apartment with clean glasses
        */}
        <div className="mt-10 sm:mt-12 relative max-w-6xl mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8 items-stretch">
            
            {/* LEFT SIDE: Sea View with Swimming Pool */}
            <div className="relative group rounded-3xl overflow-hidden shadow-2xl border border-white/60 bg-white/40 h-[340px] sm:h-[400px] lg:h-[440px] transition-transform duration-500 hover:-translate-y-1">
              <img
                src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=85"
                alt="Sea view with luxury infinity swimming pool"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-neutral-900/20 to-transparent" />
              
              {/* Floating Top Badge: Sea & Pool Feature */}
              <div className="absolute top-5 left-5 glass-pill px-3.5 py-1.5 rounded-full flex items-center gap-2 shadow-lg animate-float-badge">
                <Waves className="w-4 h-4 text-cyan-600" />
                <span className="text-xs font-bold text-neutral-900">Pacific Ocean Sea View</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
              </div>

              {/* Floating Bottom Card: Pool Temperature & Infinity Edge */}
              <div className="absolute bottom-5 left-5 right-5 glass-panel p-4 rounded-2xl shadow-xl flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-iris-600">Laguna Vista Villa</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800">Infinity Pool</span>
                  </div>
                  <p className="text-sm font-bold text-neutral-900 mt-0.5">82°F Heated Saltwater Pool & Oceanfront Deck</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-neutral-500 block">From</span>
                  <span className="text-base font-extrabold text-iris-700">$5,200,000</span>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: Glassy Apartment with Clean Glasses */}
            <div className="relative group rounded-3xl overflow-hidden shadow-2xl border border-white/60 bg-white/40 h-[340px] sm:h-[400px] lg:h-[440px] transition-transform duration-500 hover:-translate-y-1">
              <img
                src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=85"
                alt="Glassy apartment with clean transparent glass facades"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-neutral-900/20 to-transparent" />

              {/* Floating Top Badge: Clean Glass Architecture */}
              <div className="absolute top-5 right-5 glass-pill px-3.5 py-1.5 rounded-full flex items-center gap-2 shadow-lg animate-float-slow">
                <Building className="w-4 h-4 text-iris-600" />
                <span className="text-xs font-bold text-neutral-900">Triple-Pane Clean Glass Tower</span>
                <span className="w-1.5 h-1.5 rounded-full bg-iris-500 animate-pulse"></span>
              </div>

              {/* Floating Bottom Card: Clean Glass Specifications */}
              <div className="absolute bottom-5 left-5 right-5 glass-panel p-4 rounded-2xl shadow-xl flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-iris-600">The Lumina Penthouse</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-iris-100 text-iris-800">Acoustic Glazing</span>
                  </div>
                  <p className="text-sm font-bold text-neutral-900 mt-0.5">Floor-to-Ceiling Ultra-Clear Glass Living</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-neutral-500 block">Buy Status</span>
                  <span className="text-base font-extrabold text-iris-700">$4,850,000</span>
                </div>
              </div>
            </div>

          </div>

          {/* Central Architectural Harmony Floating Medallion */}
          <div className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 glass-card px-5 py-3 rounded-full shadow-2xl border-2 border-white items-center gap-3 animate-float-gentle">
            <div className="w-8 h-8 rounded-full bg-iris-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
              PF
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-neutral-900 leading-none">Balanced Architectural Design</p>
              <p className="text-[10px] text-neutral-500 mt-0.5">Pool & Ocean Horizon • Glass Tower Elevation</p>
            </div>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>

        </div>

        {/* QUICK DISCOVERY SEARCH & FILTER HUB (Directly below hero visual) */}
        <div className="mt-8 sm:mt-12 max-w-5xl mx-auto">
          <form 
            onSubmit={handleSearchSubmit}
            className="glass-panel p-3 sm:p-4 rounded-3xl shadow-xl border border-white/90"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-center">
              
              {/* Filter 1: Location */}
              <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-white/90 border border-neutral-200/80 focus-within:border-iris-500 transition-colors">
                <MapPin className="w-5 h-5 text-iris-600 shrink-0" />
                <div className="w-full text-left">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Location / City</label>
                  <input
                    type="text"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    placeholder="e.g. Malibu, New York, London..."
                    className="w-full text-xs font-semibold text-neutral-900 placeholder-neutral-400 focus:outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Filter 2: Property Type */}
              <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-white/90 border border-neutral-200/80 focus-within:border-iris-500 transition-colors">
                <Building className="w-5 h-5 text-iris-600 shrink-0" />
                <div className="w-full text-left">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Property Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full text-xs font-semibold text-neutral-900 focus:outline-none bg-transparent cursor-pointer"
                  >
                    <option value="all">All Types (80 Homes)</option>
                    <option value="beach_house">Beach House (Sea View)</option>
                    <option value="residential">Residential (Glass Condo)</option>
                    <option value="commercial">Commercial Tower</option>
                    <option value="farmhouse">Farmhouse & Vineyard</option>
                    <option value="warehouse">Warehouse & Logistics</option>
                  </select>
                </div>
              </div>

              {/* Filter 3: Budget Range */}
              <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-white/90 border border-neutral-200/80 focus-within:border-iris-500 transition-colors">
                <DollarSign className="w-5 h-5 text-iris-600 shrink-0" />
                <div className="w-full text-left">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Budget Range</label>
                  <select
                    value={budgetTier}
                    onChange={(e) => setBudgetTier(e.target.value)}
                    className="w-full text-xs font-semibold text-neutral-900 focus:outline-none bg-transparent cursor-pointer"
                  >
                    <option value="all">Any Price</option>
                    <option value="under_5m">Under $5,000,000</option>
                    <option value="5m_15m">$5,000,000 - $15,000,000</option>
                    <option value="ultra_luxury">$15,000,000+</option>
                    <option value="rent_under_20k">Rent: Under $20k/mo</option>
                  </select>
                </div>
              </div>

              {/* Submit CTA Button */}
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-iris-600 hover:bg-iris-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-iris-600/25 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Properties</span>
                </button>
              </div>

            </div>
          </form>
        </div>

      </div>
    </section>
  );
}
