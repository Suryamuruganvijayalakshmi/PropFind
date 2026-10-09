import React from 'react';
import { 
  X, 
  Scale, 
  Check, 
  Minus, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  ShieldCheck, 
  Trash2,
  Eye,
  Mail
} from 'lucide-react';

export default function CompareModal({
  compareList,
  onRemoveFromCompare,
  onClearCompare,
  onClose,
  onViewDetails,
  onSendEnquiry
}) {
  if (!compareList) return null;

  const allAmenities = [
    'Swimming Pool',
    'Sea View',
    'Clean Glass Facade',
    'Smart Home',
    '24/7 Security',
    'Private Elevator',
    'Wine Cellar',
    'Solar Energy',
    'Gym'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white w-full max-w-6xl rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-6 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-iris-950 to-indigo-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-iris-800 flex items-center justify-center text-iris-200">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-iris-300 block">
                Side-by-Side Analysis
              </span>
              <h3 className="text-lg sm:text-xl font-bold font-display">
                Property Comparison Matrix ({compareList.length} Selected)
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {compareList.length > 0 && (
              <button
                onClick={onClearCompare}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-rose-500/80 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Comparison Table */}
        <div className="overflow-x-auto overflow-y-auto flex-1 p-6">
          {compareList.length === 0 ? (
            <div className="py-16 text-center text-neutral-500">
              <Scale className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
              <h4 className="text-base font-bold text-neutral-800">No properties selected for comparison</h4>
              <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                Click the comparison icon on any property card to compare features, pricing, and architecture side by side.
              </p>
            </div>
          ) : (
            <div className="min-w-[650px]">
              
              {/* Properties Grid Header */}
              <div className="grid grid-cols-5 gap-4 pb-6 border-b border-neutral-200">
                <div className="font-bold text-xs uppercase tracking-wider text-neutral-400 flex items-end pb-2">
                  Key Metrics
                </div>
                {compareList.map((p) => (
                  <div key={p.id} className="relative group bg-neutral-50 p-3 rounded-2xl border border-neutral-200/90 text-left">
                    <button
                      onClick={() => onRemoveFromCompare(p.id)}
                      className="absolute top-2 right-2 p-1 rounded-full bg-white text-neutral-400 hover:text-rose-600 shadow-xs transition-colors"
                      title="Remove"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <img
                      src={p.image_url}
                      alt={p.title}
                      className="w-full h-24 object-cover rounded-xl mb-2"
                    />
                    <h4 className="text-xs font-bold text-neutral-900 truncate">{p.title}</h4>
                    <p className="text-sm font-extrabold text-iris-700 mt-0.5">
                      {p.listing_type === 'rent' ? `$${p.price.toLocaleString()}/mo` : `$${p.price.toLocaleString()}`}
                    </p>
                    <div className="mt-2 flex gap-1">
                      <button
                        onClick={() => { onClose(); onViewDetails(p); }}
                        className="flex-1 py-1 rounded-lg bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-[10px] font-bold"
                      >
                        Inspect
                      </button>
                      <button
                        onClick={() => { onClose(); onSendEnquiry(p); }}
                        className="flex-1 py-1 rounded-lg bg-iris-600 hover:bg-iris-700 text-white text-[10px] font-bold"
                      >
                        Enquire
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Rows */}
              <div className="divide-y divide-neutral-100 text-xs">
                
                {/* Row: Status */}
                <div className="grid grid-cols-5 gap-4 py-3.5 items-center">
                  <span className="font-bold text-neutral-600">Availability</span>
                  {compareList.map((p) => (
                    <div key={p.id}>
                      {p.status === 'available' ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          Available
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px]">
                          {p.status.toUpperCase()}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Row: Property Type */}
                <div className="grid grid-cols-5 gap-4 py-3.5 items-center">
                  <span className="font-bold text-neutral-600">Property Category</span>
                  {compareList.map((p) => (
                    <span key={p.id} className="font-semibold text-neutral-800 capitalize">
                      {p.property_type.replace('_', ' ')}
                    </span>
                  ))}
                </div>

                {/* Row: Location */}
                <div className="grid grid-cols-5 gap-4 py-3.5 items-center">
                  <span className="font-bold text-neutral-600">Location</span>
                  {compareList.map((p) => (
                    <span key={p.id} className="text-neutral-700 truncate">
                      {p.location}
                    </span>
                  ))}
                </div>

                {/* Row: Bedrooms & Bathrooms */}
                <div className="grid grid-cols-5 gap-4 py-3.5 items-center">
                  <span className="font-bold text-neutral-600">Beds / Baths</span>
                  {compareList.map((p) => (
                    <span key={p.id} className="font-semibold text-neutral-800">
                      {p.bedrooms > 0 ? `${p.bedrooms} Beds / ${p.bathrooms} Baths` : 'Commercial Floorplate'}
                    </span>
                  ))}
                </div>

                {/* Row: Area Sqft */}
                <div className="grid grid-cols-5 gap-4 py-3.5 items-center">
                  <span className="font-bold text-neutral-600">Total Square Footage</span>
                  {compareList.map((p) => (
                    <span key={p.id} className="font-bold text-neutral-900">
                      {p.sqft.toLocaleString()} sq ft
                    </span>
                  ))}
                </div>

                {/* Row: Price / Sqft */}
                <div className="grid grid-cols-5 gap-4 py-3.5 items-center">
                  <span className="font-bold text-neutral-600">Price / Sq Ft</span>
                  {compareList.map((p) => (
                    <span key={p.id} className="font-bold text-iris-600">
                      ${Math.round(p.price / p.sqft).toLocaleString()}
                    </span>
                  ))}
                </div>

                {/* Row: Seller Name & Rating */}
                <div className="grid grid-cols-5 gap-4 py-3.5 items-center">
                  <span className="font-bold text-neutral-600">Verified Seller</span>
                  {compareList.map((p) => (
                    <div key={p.id} className="truncate">
                      <span className="font-bold text-neutral-900 block truncate">{p.seller_name}</span>
                      <span className="text-[10px] text-neutral-500 truncate block">{p.seller_agency}</span>
                    </div>
                  ))}
                </div>

                {/* Amenities Matrix Rows */}
                {allAmenities.map((amenity) => (
                  <div key={amenity} className="grid grid-cols-5 gap-4 py-2.5 items-center">
                    <span className="text-neutral-500 font-medium">{amenity}</span>
                    {compareList.map((p) => {
                      const hasAmenity = p.amenities?.some(a => a.toLowerCase().includes(amenity.toLowerCase()));
                      return (
                        <div key={p.id}>
                          {hasAmenity ? (
                            <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                              <Check className="w-3 h-3" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center">
                              <Minus className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}

              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
