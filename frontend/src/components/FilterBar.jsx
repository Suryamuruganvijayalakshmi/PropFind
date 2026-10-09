import React, { useState } from 'react';
import { 
  Filter, 
  RotateCcw, 
  Search, 
  MapPin, 
  Building2, 
  DollarSign, 
  Sparkles, 
  Check, 
  SlidersHorizontal,
  ChevronDown,
  Layers,
  ShieldCheck
} from 'lucide-react';

export default function FilterBar({
  filters,
  setFilters,
  onResetFilters,
  totalResults,
  allLocations = []
}) {
  const [expandedAdvanced, setExpandedAdvanced] = useState(false);

  const propertyTypes = [
    { id: 'all', label: 'All Types' },
    { id: 'beach_house', label: 'Beach House' },
    { id: 'residential', label: 'Residential' },
    { id: 'commercial', label: 'Commercial' },
    { id: 'warehouse', label: 'Warehouse' },
    { id: 'farmhouse', label: 'Farmhouse' },
  ];

  const amenityOptions = [
    'Swimming Pool',
    'Sea View',
    'Clean Glass Facade',
    'Smart Home',
    '24/7 Security',
    'Private Elevator',
    'Solar Energy',
    'Wine Cellar',
    'Gym'
  ];

  const handleTypeSelect = (typeId) => {
    setFilters(prev => ({ ...prev, property_type: typeId }));
  };

  const handleAmenityToggle = (amenity) => {
    setFilters(prev => {
      const current = prev.amenities || [];
      const exists = current.includes(amenity);
      return {
        ...prev,
        amenities: exists ? current.filter(a => a !== amenity) : [...current, amenity]
      };
    });
  };

  return (
    <div className="glass-panel p-4 sm:p-6 rounded-3xl border border-neutral-200/80 shadow-lg bg-white/95">
      
      {/* Top Bar: Search, Location, Availability, Sort */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 items-center">
        
        {/* Search Keyword */}
        <div className="lg:col-span-4 relative">
          <Search className="w-4 h-4 text-iris-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            placeholder="Search 80 homes, title, keywords..."
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-neutral-200/90 text-xs font-medium focus:border-iris-500 focus:outline-none bg-neutral-50/50"
          />
        </div>

        {/* Location Selector */}
        <div className="lg:col-span-3 relative">
          <MapPin className="w-4 h-4 text-iris-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <select
            value={filters.location || 'all'}
            onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
            className="w-full pl-9 pr-8 py-2.5 rounded-2xl border border-neutral-200/90 text-xs font-semibold focus:border-iris-500 focus:outline-none bg-neutral-50/50 appearance-none cursor-pointer truncate"
          >
            <option value="all">Global Locations (80 Destinations)</option>
            {allLocations.map((loc, idx) => (
              <option key={idx} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Availability Filter */}
        <div className="lg:col-span-3">
          <select
            value={filters.status || 'all'}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-2xl border border-neutral-200/90 text-xs font-semibold focus:border-iris-500 focus:outline-none bg-neutral-50/50 cursor-pointer"
          >
            <option value="all">Availability: All Statuses</option>
            <option value="available">🟢 Available Only (Ready to Buy/Rent)</option>
            <option value="sold">🔴 Sold / Secured Properties</option>
          </select>
        </div>

        {/* Advanced Filters Button & Reset */}
        <div className="lg:col-span-2 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setExpandedAdvanced(!expandedAdvanced)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl text-xs font-bold border transition-colors ${
              expandedAdvanced || (filters.amenities?.length > 0 || filters.min_price || filters.max_price)
                ? 'bg-iris-50 border-iris-300 text-iris-700'
                : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {filters.amenities?.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-iris-600 text-white text-[9px] flex items-center justify-center">
                {filters.amenities.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onResetFilters}
            title="Reset Filters"
            className="p-2.5 rounded-2xl border border-neutral-200 hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Property Type Category Pills */}
      <div className="mt-4 pt-3 border-t border-neutral-100 flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mr-1 hidden sm:inline">
          Category:
        </span>
        {propertyTypes.map((pt) => {
          const isActive = filters.property_type === pt.id || (!filters.property_type && pt.id === 'all');
          return (
            <button
              key={pt.id}
              onClick={() => handleTypeSelect(pt.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-iris-600 text-white shadow-xs scale-102'
                  : 'bg-neutral-100/80 text-neutral-600 hover:bg-neutral-200/70 hover:text-neutral-900'
              }`}
            >
              {pt.label}
            </button>
          );
        })}

        <div className="ml-auto text-xs font-semibold text-neutral-500">
          Showing <span className="text-iris-600 font-bold">{totalResults}</span> properties
        </div>
      </div>

      {/* Advanced Drawer: Budget Ranges & Amenities */}
      {expandedAdvanced && (
        <div className="mt-4 pt-4 border-t border-neutral-100 space-y-4 animate-in fade-in slide-in-from-top-2">
          
          {/* Budget Range Inputs */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-2">
              Budget Range (USD)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <input
                  type="number"
                  placeholder="Min Price ($)"
                  value={filters.min_price || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, min_price: e.target.value ? Number(e.target.value) : undefined }))}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-medium focus:border-iris-500 focus:outline-none"
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Max Price ($)"
                  value={filters.max_price || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, max_price: e.target.value ? Number(e.target.value) : undefined }))}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-medium focus:border-iris-500 focus:outline-none"
                />
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFilters(prev => ({ ...prev, min_price: 1000000, max_price: 6000000 }))}
                  className="px-2.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-[11px] font-semibold text-neutral-700 transition-colors"
                >
                  $1M - $6M
                </button>
                <button
                  type="button"
                  onClick={() => setFilters(prev => ({ ...prev, min_price: 6000000, max_price: 15000000 }))}
                  className="px-2.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-[11px] font-semibold text-neutral-700 transition-colors"
                >
                  $6M - $15M
                </button>
                <button
                  type="button"
                  onClick={() => setFilters(prev => ({ ...prev, min_price: 15000000, max_price: 50000000 }))}
                  className="px-2.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-[11px] font-semibold text-neutral-700 transition-colors"
                >
                  $15M+
                </button>
              </div>
            </div>
          </div>

          {/* Amenities Multi-select */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-2">
              Signature Amenities
            </label>
            <div className="flex flex-wrap gap-2">
              {amenityOptions.map((amenity) => {
                const selected = filters.amenities?.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => handleAmenityToggle(amenity)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      selected
                        ? 'bg-iris-600 text-white shadow-xs'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    {selected && <Check className="w-3 h-3" />}
                    <span>{amenity}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
