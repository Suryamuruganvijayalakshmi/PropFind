import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Scale, 
  MapPin, 
  User, 
  Menu, 
  X, 
  PlusCircle, 
  Mail, 
  Home, 
  CheckCircle2,
  Building2,
  ChevronDown
} from 'lucide-react';
import Logo from './Logo';

export default function Navbar({
  listingType,
  setListingType,
  activeSection,
  setActiveSection,
  favoritesCount,
  onOpenFavorites,
  compareList,
  onOpenCompare,
  currentUser,
  onOpenAuth,
  onOpenSellerDashboard,
  onOpenBuyerDashboard
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-ivory/90 backdrop-blur-md shadow-sm border-b border-neutral-200/60 py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Left: Brand Logo */}
          <div onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Logo size="md" showTagline={true} />
          </div>

          {/* Center: Navigation & Buy/Rent Toggle */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            
            {/* Buy / Rent Pill Selector */}
            <div className="flex items-center bg-ivory-200/80 p-1 rounded-full border border-neutral-300/60 mr-2 shadow-inner">
              <button
                type="button"
                onClick={() => setListingType('buy')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  listingType === 'buy'
                    ? 'bg-iris-600 text-white shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Buy Properties
              </button>
              <button
                type="button"
                onClick={() => setListingType('rent')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  listingType === 'rent'
                    ? 'bg-iris-600 text-white shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Rent Luxury
              </button>
            </div>

            <button
              onClick={() => scrollToSection('properties-section')}
              className="px-3 py-2 rounded-lg text-sm font-medium text-neutral-700 hover:text-iris-600 hover:bg-iris-50 transition-colors"
            >
              80+ Listings
            </button>

            <button
              onClick={() => scrollToSection('map-section')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-neutral-700 hover:text-iris-600 hover:bg-iris-50 transition-colors"
            >
              <MapPin className="w-4 h-4 text-iris-600" />
              Find Location
            </button>

            <button
              onClick={() => scrollToSection('about-section')}
              className="px-3 py-2 rounded-lg text-sm font-medium text-neutral-700 hover:text-iris-600 hover:bg-iris-50 transition-colors"
            >
              About
            </button>

            <button
              onClick={() => scrollToSection('contact-section')}
              className="px-3 py-2 rounded-lg text-sm font-medium text-neutral-700 hover:text-iris-600 hover:bg-iris-50 transition-colors"
            >
              Contact
            </button>
          </nav>

          {/* Right: Actions (Compare, Favorites, Auth / Portals) */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Compare Button */}
            <button
              onClick={onOpenCompare}
              className="relative p-2.5 rounded-full text-neutral-700 hover:text-iris-600 hover:bg-iris-50 border border-neutral-200 transition-all hover:scale-105 active:scale-95"
              title="Compare Listings"
            >
              <Scale className="w-4 h-4" />
              {compareList.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-iris-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {compareList.length}
                </span>
              )}
            </button>

            {/* Saved Favorites Button */}
            <button
              onClick={onOpenFavorites}
              className="relative p-2.5 rounded-full text-neutral-700 hover:text-rose-600 hover:bg-rose-50 border border-neutral-200 transition-all hover:scale-105 active:scale-95"
              title="Saved Properties"
            >
              <Heart className={`w-4 h-4 ${favoritesCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* User Profile / Portal Selector */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 pl-3 pr-2.5 py-1.5 rounded-full border border-iris-200 bg-white/90 hover:bg-iris-50 text-neutral-800 transition-all text-xs font-semibold shadow-xs"
              >
                <div className="w-6 h-6 rounded-full overflow-hidden bg-iris-100 flex items-center justify-center border border-iris-300">
                  {currentUser?.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-3.5 h-3.5 text-iris-600" />
                  )}
                </div>
                <div className="flex flex-col text-left">
                  <span className="truncate max-w-[90px]">{currentUser ? currentUser.name.split(' ')[0] : 'Sign In'}</span>
                  <span className="text-[9px] text-iris-600 font-normal uppercase tracking-wider">
                    {currentUser ? currentUser.role : 'Account'}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-neutral-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-neutral-100">
                    <p className="text-xs font-bold text-neutral-900">{currentUser?.name}</p>
                    <p className="text-[11px] text-neutral-500 truncate">{currentUser?.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-iris-50 text-iris-700 capitalize">
                      Active: {currentUser?.role} mode
                    </span>
                  </div>

                  {currentUser?.role === 'seller' ? (
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenSellerDashboard();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-neutral-700 hover:bg-iris-50 hover:text-iris-600 text-left"
                    >
                      <Building2 className="w-4 h-4 text-iris-600" />
                      Seller Portal & My Listings
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenBuyerDashboard();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-neutral-700 hover:bg-iris-50 hover:text-iris-600 text-left"
                    >
                      <User className="w-4 h-4 text-iris-600" />
                      Buyer Profile & Inquiries
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onOpenAuth();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-neutral-700 hover:bg-iris-50 hover:text-iris-600 text-left border-t border-neutral-100"
                  >
                    <User className="w-4 h-4 text-neutral-400" />
                    Switch User / Role Login
                  </button>
                </div>
              )}
            </div>

            {/* Quick Action Button */}
            {currentUser?.role === 'seller' ? (
              <button
                onClick={onOpenSellerDashboard}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-iris-600 hover:bg-iris-700 text-white text-xs font-semibold shadow-sm transition-all hover:shadow-iris-500/20"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                List Property
              </button>
            ) : (
              <button
                onClick={() => scrollToSection('properties-section')}
                className="px-4 py-2 rounded-full bg-iris-600 hover:bg-iris-700 text-white text-xs font-semibold shadow-sm transition-all hover:shadow-iris-500/20"
              >
                Browse Homes
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenFavorites}
              className="p-2 rounded-full text-neutral-700 border border-neutral-200"
            >
              <Heart className={`w-4 h-4 ${favoritesCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-neutral-700 hover:bg-ivory-200 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-neutral-200 mt-3 px-4 pt-4 pb-6 space-y-4 animate-in slide-in-from-top-4">
          <div className="flex justify-center mb-3">
            <div className="flex items-center bg-ivory-200 p-1 rounded-full border border-neutral-300">
              <button
                onClick={() => { setListingType('buy'); setMobileMenuOpen(false); }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold ${listingType === 'buy' ? 'bg-iris-600 text-white' : 'text-neutral-600'}`}
              >
                Buy Properties
              </button>
              <button
                onClick={() => { setListingType('rent'); setMobileMenuOpen(false); }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold ${listingType === 'rent' ? 'bg-iris-600 text-white' : 'text-neutral-600'}`}
              >
                Rent Luxury
              </button>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <button
              onClick={() => scrollToSection('properties-section')}
              className="text-left px-3 py-2 rounded-lg text-sm font-semibold text-neutral-800 hover:bg-iris-50"
            >
              80+ Listings
            </button>
            <button
              onClick={() => scrollToSection('map-section')}
              className="text-left px-3 py-2 rounded-lg text-sm font-semibold text-neutral-800 hover:bg-iris-50 flex items-center gap-2"
            >
              <MapPin className="w-4 h-4 text-iris-600" />
              Interactive Location Map
            </button>
            <button
              onClick={() => scrollToSection('about-section')}
              className="text-left px-3 py-2 rounded-lg text-sm font-semibold text-neutral-800 hover:bg-iris-50"
            >
              About PropFind
            </button>
            <button
              onClick={() => scrollToSection('contact-section')}
              className="text-left px-3 py-2 rounded-lg text-sm font-semibold text-neutral-800 hover:bg-iris-50"
            >
              Contact Concierge
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenCompare(); }}
              className="text-left px-3 py-2 rounded-lg text-sm font-semibold text-neutral-800 hover:bg-iris-50 flex items-center justify-between"
            >
              <span>Compare Listings</span>
              <span className="px-2 py-0.5 rounded-full bg-iris-100 text-iris-700 text-xs">{compareList.length}</span>
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }}
              className="text-left px-3 py-2 rounded-lg text-sm font-semibold text-iris-600 hover:bg-iris-50 flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              Account & Role Switcher ({currentUser?.role})
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
