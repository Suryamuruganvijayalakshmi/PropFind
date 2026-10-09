import React from 'react';
import { 
  Heart, 
  Scale, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  ShieldCheck, 
  Star, 
  Mail, 
  Eye, 
  Lock,
  Sparkles,
  Waves,
  Building
} from 'lucide-react';

export default function PropertyCard({
  property,
  isFavorite,
  onToggleFavorite,
  isCompared,
  onToggleCompare,
  onViewDetails,
  onSendEnquiry,
  onDirectBuy
}) {
  const isAvailable = property.status === 'available';
  const isSoldOrRented = !isAvailable;

  const formatPrice = (price, listingType) => {
    if (listingType === 'rent') {
      return `$${price.toLocaleString()}/mo`;
    }
    return `$${price.toLocaleString()}`;
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'beach_house': return 'Beach House';
      case 'residential': return 'Residential';
      case 'commercial': return 'Commercial';
      case 'warehouse': return 'Warehouse';
      case 'farmhouse': return 'Farmhouse';
      default: return type;
    }
  };

  return (
    <div className={`glass-card rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between group relative ${
      isSoldOrRented 
        ? 'border-neutral-300/80 bg-neutral-50/70 opacity-95' 
        : 'border-neutral-200/90 bg-white hover:border-iris-300 shadow-sm hover:shadow-xl'
    }`}>
      
      {/* Top Media Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
        <img
          src={property.image_url}
          alt={property.title}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isSoldOrRented ? 'grayscale-[30%]' : 'group-hover:scale-105'
          }`}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-transparent to-black/30 pointer-events-none" />

        {/* Top Floating Left: Category & Listing Type */}
        <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-1.5 z-10">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/95 text-neutral-900 shadow-xs backdrop-blur-xs">
            {getTypeLabel(property.property_type)}
          </span>
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-xs backdrop-blur-xs ${
            property.listing_type === 'rent'
              ? 'bg-amber-500 text-white'
              : 'bg-iris-600 text-white'
          }`}>
            {property.listing_type === 'rent' ? 'For Rent' : 'For Sale'}
          </span>
        </div>

        {/* Top Floating Right: Save Heart & Compare Buttons */}
        <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 z-10">
          {/* Compare Toggle */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(property);
            }}
            title={isCompared ? "Remove from comparison" : "Add to comparison"}
            className={`p-2 rounded-full backdrop-blur-md transition-all shadow-sm ${
              isCompared
                ? 'bg-iris-600 text-white scale-110 shadow-iris-600/30'
                : 'bg-white/85 text-neutral-700 hover:bg-white hover:text-iris-600'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
          </button>

          {/* Favorite Toggle */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(property.id);
            }}
            title={isFavorite ? "Remove from saved" : "Save to favorites"}
            className={`p-2 rounded-full backdrop-blur-md transition-all shadow-sm ${
              isFavorite
                ? 'bg-rose-500 text-white scale-110 shadow-rose-500/30'
                : 'bg-white/85 text-neutral-700 hover:bg-white hover:text-rose-600'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Availability Status Ribbon */}
        {isSoldOrRented ? (
          <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-[1px] flex items-center justify-center pointer-events-none z-10">
            <div className="px-4 py-2 rounded-2xl bg-rose-600/95 text-white shadow-2xl border border-white/30 flex items-center gap-2 transform -rotate-3 scale-105">
              <Lock className="w-4 h-4" />
              <span className="font-extrabold uppercase tracking-widest text-xs">
                {property.status === 'rented' ? 'LEASED / RENTED' : 'SOLD / SECURED'}
              </span>
            </div>
          </div>
        ) : (
          <div className="absolute bottom-3 left-3.5 z-10">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/90 text-white backdrop-blur-xs shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              AVAILABLE NOW
            </span>
          </div>
        )}

        {/* Price Tag Overlay (Bottom Right) */}
        <div className="absolute bottom-3 right-3.5 z-10">
          <span className="px-3 py-1 rounded-xl bg-neutral-950/80 text-white font-extrabold text-sm backdrop-blur-md border border-white/20 shadow-sm">
            {formatPrice(property.price, property.listing_type)}
          </span>
        </div>
      </div>

      {/* Card Content & Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        
        <div>
          {/* Location Line */}
          <div className="flex items-center gap-1.5 text-neutral-500 text-xs mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-iris-600 shrink-0" />
            <span className="truncate font-medium">{property.location}</span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onViewDetails(property)}
            className="text-base font-bold text-neutral-900 group-hover:text-iris-600 transition-colors line-clamp-1 cursor-pointer"
          >
            {property.title}
          </h3>

          {/* Short Description */}
          <p className="mt-1.5 text-xs text-neutral-500 line-clamp-2 leading-relaxed">
            {property.description}
          </p>

          {/* Key Specs Bar (Beds, Baths, Sqft) */}
          <div className="mt-3.5 py-2.5 px-3 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-between text-xs text-neutral-700">
            {property.bedrooms > 0 ? (
              <div className="flex items-center gap-1.5">
                <Bed className="w-3.5 h-3.5 text-neutral-400" />
                <span className="font-semibold">{property.bedrooms} Beds</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-neutral-400" />
                <span className="font-semibold">Prime Commercial</span>
              </div>
            )}

            {property.bathrooms > 0 && (
              <div className="flex items-center gap-1.5">
                <Bath className="w-3.5 h-3.5 text-neutral-400" />
                <span className="font-semibold">{property.bathrooms} Baths</span>
              </div>
            )}

            <div className="flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-neutral-400" />
              <span className="font-semibold">{property.sqft.toLocaleString()} sqft</span>
            </div>
          </div>

          {/* Highlight Amenities Tag */}
          <div className="mt-2.5 flex flex-wrap gap-1">
            {property.amenities?.slice(0, 3).map((am, i) => (
              <span key={i} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-iris-50 text-iris-700">
                {am}
              </span>
            ))}
            {property.amenities?.length > 3 && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-neutral-100 text-neutral-500">
                +{property.amenities.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Seller Info & Action Buttons */}
        <div className="mt-4 pt-3.5 border-t border-neutral-100">
          
          {/* Seller Preview Badge */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <img
                src={property.seller_avatar}
                alt={property.seller_name}
                className="w-7 h-7 rounded-full object-cover border border-iris-200"
              />
              <div className="text-left">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-neutral-900 truncate max-w-[110px]">{property.seller_name}</span>
                  {property.seller_verified && (
                    <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" title="Verified Seller" />
                  )}
                </div>
                <span className="text-[10px] text-neutral-400 truncate block max-w-[120px]">{property.seller_agency}</span>
              </div>
            </div>

            <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-lg bg-amber-50 text-amber-700 text-[11px] font-bold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{property.seller_rating || 4.9}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            
            {/* 1. Quick View / Inspect Details */}
            <button
              type="button"
              onClick={() => onViewDetails(property)}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-neutral-200 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 text-xs font-bold transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-neutral-500" />
              <span>Inspect</span>
            </button>

            {/* 2. Send Enquiry Button */}
            <button
              type="button"
              onClick={() => onSendEnquiry(property)}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-iris-600 hover:bg-iris-700 text-white text-xs font-bold transition-all shadow-xs"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Enquire</span>
            </button>

          </div>

          {/* Direct Buy / Lease Button (Locking Availability) */}
          <div className="mt-2">
            {isAvailable ? (
              <button
                type="button"
                onClick={() => onDirectBuy(property)}
                className="w-full py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200/80 transition-colors flex items-center justify-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>{property.listing_type === 'rent' ? 'Lease Now (Instant Lock)' : 'Acquire Property (Instant Lock)'}</span>
              </button>
            ) : (
              <div className="w-full py-1.5 rounded-xl bg-neutral-100 text-neutral-400 text-[11px] font-semibold text-center border border-neutral-200 flex items-center justify-center gap-1 cursor-not-allowed">
                <Lock className="w-3 h-3" />
                <span>Locked • Unavailable for Acquisition</span>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
