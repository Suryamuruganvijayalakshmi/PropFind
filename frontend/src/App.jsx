import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import FilterBar from './components/FilterBar';
import PropertyGrid from './components/PropertyGrid';
import MapExplorer from './components/MapExplorer';
import PropertyDetailModal from './components/PropertyDetailModal';
import EnquiryModal from './components/EnquiryModal';
import CompareModal from './components/CompareModal';
import AuthModal from './components/AuthModal';
import SellerDashboardModal from './components/SellerDashboardModal';
import BuyerDashboardModal from './components/BuyerDashboardModal';
import ContactStrip from './components/ContactStrip';
import MouseFollower from './components/MouseFollower';
import { api } from './services/api';
import { CheckCircle2, AlertCircle, X, Sparkles } from 'lucide-react';

export default function App() {
  // Properties State
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listingType, setListingType] = useState('buy'); // 'buy' or 'rent'

  // User Authentication State (Default: Sarah Jenkins, Buyer)
  const [currentUser, setCurrentUser] = useState({
    id: 1,
    name: "Sarah Jenkins",
    email: "sarah.buyer@propfind.com",
    role: "buyer",
    phone: "+1 (555) 234-8901",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
  });

  // Filters State
  const [filters, setFilters] = useState({
    search: '',
    location: 'all',
    property_type: 'all',
    status: 'all',
    amenities: [],
    min_price: undefined,
    max_price: undefined,
  });

  // Favorites & Compare State
  const [favorites, setFavorites] = useState([]);
  const [compareList, setCompareList] = useState([]);

  // Modals & Drawers State
  const [detailProperty, setDetailProperty] = useState(null);
  const [enquiryProperty, setEnquiryProperty] = useState(null);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [sellerDashboardOpen, setSellerDashboardOpen] = useState(false);
  const [buyerDashboardOpen, setBuyerDashboardOpen] = useState(false);

  // Floating Toast Notification State
  const [toast, setToast] = useState(null);

  // Initial Data Fetch
  useEffect(() => {
    fetchProperties();
    loadFavorites();
  }, []);

  const showToast = (toastObj) => {
    setToast(toastObj);
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const data = await api.getProperties();
      setProperties(data || []);
    } catch (err) {
      console.error('Failed to fetch properties:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const favs = await api.getFavorites(currentUser?.id || 1);
      setFavorites(favs || []);
    } catch (err) {
      console.error('Failed to fetch favorites:', err);
    }
  };

  // Extract all unique locations for the filter dropdown
  const allLocations = useMemo(() => {
    const locSet = new Set(properties.map(p => p.location));
    return Array.from(locSet).sort();
  }, [properties]);

  // Client Filter Logic
  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      // 1. Listing Type (Buy vs Rent)
      if (listingType && p.listing_type !== listingType) {
        return false;
      }

      // 2. Search query (title, location, address, description)
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(query);
        const matchesLocation = p.location.toLowerCase().includes(query);
        const matchesAddress = p.address.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        if (!matchesTitle && !matchesLocation && !matchesAddress && !matchesDesc) {
          return false;
        }
      }

      // 3. Location filter
      if (filters.location && filters.location !== 'all') {
        if (!p.location.toLowerCase().includes(filters.location.toLowerCase())) {
          return false;
        }
      }

      // 4. Property Category Type
      if (filters.property_type && filters.property_type !== 'all') {
        if (p.property_type !== filters.property_type) {
          return false;
        }
      }

      // 5. Availability Status
      if (filters.status && filters.status !== 'all') {
        if (p.status !== filters.status) {
          return false;
        }
      }

      // 6. Min & Max Budget
      if (filters.min_price && p.price < filters.min_price) {
        return false;
      }
      if (filters.max_price && p.price > filters.max_price) {
        return false;
      }

      // 7. Amenities Match
      if (filters.amenities && filters.amenities.length > 0) {
        const propAmenitiesLower = (p.amenities || []).map(a => a.toLowerCase());
        const hasAll = filters.amenities.every(req =>
          propAmenitiesLower.some(pa => pa.includes(req.toLowerCase()))
        );
        if (!hasAll) return false;
      }

      return true;
    });
  }, [properties, listingType, filters]);

  // Handle Favorites Toggle
  const handleToggleFavorite = async (propertyId) => {
    try {
      const res = await api.toggleFavorite(propertyId, currentUser?.id || 1);
      const targetProp = properties.find(p => p.id === propertyId);
      if (res.favorited) {
        if (targetProp && !favorites.some(f => f.id === propertyId)) {
          setFavorites(prev => [...prev, targetProp]);
        }
        showToast({
          title: "Added to Favorites",
          message: `Saved "${targetProp?.title || 'Property'}" to your private portfolio.`
        });
      } else {
        setFavorites(prev => prev.filter(f => f.id !== propertyId));
        showToast({
          title: "Removed from Favorites",
          message: `Removed from your saved portfolio.`
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Compare Toggle
  const handleToggleCompare = (property) => {
    setCompareList(prev => {
      const exists = prev.some(p => p.id === property.id);
      if (exists) {
        showToast({
          title: "Removed from Comparison",
          message: `Removed "${property.title}" from side-by-side matrix.`
        });
        return prev.filter(p => p.id !== property.id);
      } else {
        if (prev.length >= 4) {
          showToast({
            title: "Comparison Limit Reached",
            message: "You can compare up to 4 properties side by side for optimal layout."
          });
          return prev;
        }
        showToast({
          title: "Added to Comparison",
          message: `Added "${property.title}". Click Compare on top right to view.`
        });
        return [...prev, property];
      }
    });
  };

  // Direct Acquire / Buy Handler with strict Availability Lock
  const handleDirectBuy = async (property) => {
    try {
      const res = await api.buyProperty(property.id, {
        buyer_id: currentUser?.id || 1,
        buyer_name: currentUser?.name || 'Sarah Jenkins'
      });

      if (res.success && res.property) {
        // Update local state immediately so property is locked as SOLD/RENTED
        setProperties(prev => prev.map(p => p.id === property.id ? res.property : p));
        if (detailProperty?.id === property.id) {
          setDetailProperty(res.property);
        }
        showToast({
          title: "Acquisition Confirmed & Locked!",
          message: `Property "${property.title}" is now secured exclusively by ${currentUser.name}. Status updated to ${res.property.status.toUpperCase()} and locked from other buyers.`
        });
      }
    } catch (err) {
      alert(err.message || 'Error acquiring property');
    }
  };

  // Reset Filters
  const handleResetFilters = () => {
    setFilters({
      search: '',
      location: 'all',
      property_type: 'all',
      status: 'all',
      amenities: [],
      min_price: undefined,
      max_price: undefined,
    });
  };

  // Quick Hero Search Handler
  const handleHeroQuickSearch = ({ location, property_type, budgetTier }) => {
    let minP = undefined;
    let maxP = undefined;
    if (budgetTier === 'under_5m') { maxP = 5000000; }
    else if (budgetTier === '5m_15m') { minP = 5000000; maxP = 15000000; }
    else if (budgetTier === 'ultra_luxury') { minP = 15000000; }
    else if (budgetTier === 'rent_under_20k') { setListingType('rent'); maxP = 20000; }

    setFilters(prev => ({
      ...prev,
      search: location || prev.search,
      property_type: property_type || 'all',
      min_price: minP,
      max_price: maxP
    }));

    // Scroll smoothly to properties section
    const elem = document.getElementById('properties-section');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-ivory text-neutral-900 font-sans relative selection:bg-iris-500 selection:text-white">
      
      {/* Luxury Interactive Mouse Follower */}
      <MouseFollower />

      {/* Floating Notification Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm glass-panel p-4 rounded-2xl shadow-2xl border border-iris-200 animate-in slide-in-from-bottom-5 duration-200 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-iris-100 text-iris-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-neutral-900">{toast.title}</h4>
            <p className="text-[11px] text-neutral-600 leading-tight mt-0.5">{toast.message}</p>
          </div>
          <button onClick={() => setToast(null)} className="text-neutral-400 hover:text-neutral-600 p-0.5">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. Header Navigation */}
      <Navbar
        listingType={listingType}
        setListingType={setListingType}
        favoritesCount={favorites.length}
        onOpenFavorites={() => setBuyerDashboardOpen(true)}
        compareList={compareList}
        onOpenCompare={() => setCompareModalOpen(true)}
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenSellerDashboard={() => setSellerDashboardOpen(true)}
        onOpenBuyerDashboard={() => setBuyerDashboardOpen(true)}
      />

      <main>
        {/* 2. Hero Section (3-line floaty animated headline + left sea view with swimming pool + right clean glass apartment) */}
        <HeroSection
          onQuickSearch={handleHeroQuickSearch}
          listingType={listingType}
          setListingType={setListingType}
          totalProperties={properties.length}
          onExploreClick={() => {
            const el = document.getElementById('properties-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 3. About Section (Directly below Hero Section as requested) */}
        <AboutSection
          onExploreClick={() => {
            const el = document.getElementById('properties-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 4. Contact Section (Directly below About Section as requested) */}
        <ContactSection onShowNotification={showToast} />

        {/* 5. Filter Bar Hub & 80 Properties Grid with 3-dots pagination */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <FilterBar
            filters={filters}
            setFilters={setFilters}
            onResetFilters={handleResetFilters}
            totalResults={filteredProperties.length}
            allLocations={allLocations}
          />
        </div>

        <PropertyGrid
          properties={filteredProperties}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          compareList={compareList}
          onToggleCompare={handleToggleCompare}
          onViewDetails={(prop) => setDetailProperty(prop)}
          onSendEnquiry={(prop) => setEnquiryProperty(prop)}
          onDirectBuy={handleDirectBuy}
          onResetFilters={handleResetFilters}
        />

        {/* 6. Geospatial Map Discovery ("Find Location" with 80 plotted locations) */}
        <MapExplorer
          properties={properties}
          onViewDetails={(prop) => setDetailProperty(prop)}
          onSendEnquiry={(prop) => setEnquiryProperty(prop)}
        />
      </main>

      {/* 7. Contact Strip at the very bottom (Owner phone, email, office address, logo) */}
      <ContactStrip />

      {/* MODALS */}
      {/* Property Details Modal */}
      {detailProperty && (
        <PropertyDetailModal
          property={detailProperty}
          onClose={() => setDetailProperty(null)}
          isFavorite={favorites.some(f => f.id === detailProperty.id)}
          onToggleFavorite={handleToggleFavorite}
          isCompared={compareList.some(c => c.id === detailProperty.id)}
          onToggleCompare={handleToggleCompare}
          onSendEnquiry={(prop) => setEnquiryProperty(prop)}
          onDirectBuy={handleDirectBuy}
        />
      )}

      {/* Enquiry Modal (Shows seller details first, customer inputs, mailing dispatch) */}
      {enquiryProperty && (
        <EnquiryModal
          property={enquiryProperty}
          currentUser={currentUser}
          onClose={() => setEnquiryProperty(null)}
          onSuccessNotification={showToast}
        />
      )}

      {/* Property Comparison Modal */}
      {compareModalOpen && (
        <CompareModal
          compareList={compareList}
          onRemoveFromCompare={(id) => setCompareList(prev => prev.filter(p => p.id !== id))}
          onClearCompare={() => setCompareList([])}
          onClose={() => setCompareModalOpen(false)}
          onViewDetails={(prop) => setDetailProperty(prop)}
          onSendEnquiry={(prop) => setEnquiryProperty(prop)}
        />
      )}

      {/* Dual Buyer / Seller Auth Modal */}
      {authModalOpen && (
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            showToast({
              title: "Signed In Successfully",
              message: `Welcome, ${user.name} (${user.role.toUpperCase()} Portal Active)`
            });
          }}
        />
      )}

      {/* Seller Portal Modal */}
      {sellerDashboardOpen && (
        <SellerDashboardModal
          isOpen={sellerDashboardOpen}
          onClose={() => setSellerDashboardOpen(false)}
          currentUser={currentUser}
          allProperties={properties}
          onPropertyUpdated={(updatedProp) => {
            setProperties(prev => prev.map(p => p.id === updatedProp.id ? updatedProp : p));
            showToast({
              title: "Property Availability Updated",
              message: `Status updated for "${updatedProp.title}"`
            });
          }}
          onPropertyAdded={(newProp) => {
            setProperties(prev => [newProp, ...prev]);
            showToast({
              title: "Property Successfully Listed",
              message: `Added "${newProp.title}" to active portfolio.`
            });
          }}
        />
      )}

      {/* Buyer Portal Modal */}
      {buyerDashboardOpen && (
        <BuyerDashboardModal
          isOpen={buyerDashboardOpen}
          onClose={() => setBuyerDashboardOpen(false)}
          currentUser={currentUser}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          allProperties={properties}
          onViewDetails={(prop) => setDetailProperty(prop)}
        />
      )}

    </div>
  );
}
