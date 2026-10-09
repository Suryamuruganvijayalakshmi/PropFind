import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Star, 
  Heart, 
  Scale, 
  Check, 
  Lock, 
  Sparkles, 
  Building2, 
  Calendar,
  Share2,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PropertyDetailModal({
  property,
  onClose,
  isFavorite,
  onToggleFavorite,
  isCompared,
  onToggleCompare,
  onSendEnquiry,
  onDirectBuy
}) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [buyingProcess, setBuyingProcess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!property) return null;

  const images = property.gallery && property.gallery.length > 0 
    ? property.gallery 
    : [property.image_url];

  const isAvailable = property.status === 'available';

  const formatPrice = (price, type) => {
    if (type === 'rent') return `$${price.toLocaleString()}/mo`;
    return `$${price.toLocaleString()}`;
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleAcquire = async () => {
    setBuyingProcess(true);
    try {
      await onDirectBuy(property);
      // Trigger festive luxury confetti
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error(err);
    } finally {
      setBuyingProcess(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-6 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Top Floating Actions */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          {/* Share */}
          <button
            onClick={handleShare}
            className="p-2.5 rounded-full bg-white/90 hover:bg-white text-neutral-700 shadow-md transition-all backdrop-blur-xs"
            title="Copy Link"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Compare */}
          <button
            onClick={() => onToggleCompare(property)}
            className={`p-2.5 rounded-full shadow-md transition-all backdrop-blur-xs ${
              isCompared 
                ? 'bg-iris-600 text-white' 
                : 'bg-white/90 hover:bg-white text-neutral-700'
            }`}
            title="Compare Property"
          >
            <Scale className="w-4 h-4" />
          </button>

          {/* Favorite */}
          <button
            onClick={() => onToggleFavorite(property.id)}
            className={`p-2.5 rounded-full shadow-md transition-all backdrop-blur-xs ${
              isFavorite 
                ? 'bg-rose-500 text-white' 
                : 'bg-white/90 hover:bg-white text-neutral-700 hover:text-rose-600'
            }`}
            title="Save Favorite"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/90 hover:bg-white text-neutral-700 shadow-md transition-all backdrop-blur-xs"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1">
          
          {/* Main Gallery Display */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9] bg-neutral-900">
            <img
              src={images[selectedImageIndex] || property.image_url}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent pointer-events-none" />

            {/* Bottom Status & Price Ribbon inside image */}
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between z-10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-iris-600 text-white text-[10px] font-bold uppercase tracking-wider">
                    {property.property_type.replace('_', ' ')}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/90 text-neutral-900 text-[10px] font-bold uppercase tracking-wider">
                    {property.listing_type === 'rent' ? 'For Lease' : 'For Sale'}
                  </span>
                  {isAvailable ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                      Available
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      {property.status.toUpperCase()}
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white font-display drop-shadow-sm">
                  {property.title}
                </h2>
                <p className="text-xs text-neutral-300 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-iris-400" />
                  <span>{property.address} • {property.location}</span>
                </p>
              </div>

              <div className="text-right bg-neutral-900/80 backdrop-blur-md p-3 rounded-2xl border border-white/20">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">Listed Value</span>
                <span className="text-xl sm:text-2xl font-black text-white font-display">
                  {formatPrice(property.price, property.listing_type)}
                </span>
              </div>
            </div>
          </div>

          {/* Gallery Thumbnails (if multiple) */}
          {images.length > 1 && (
            <div className="flex gap-2 p-3 bg-neutral-100 overflow-x-auto border-b border-neutral-200">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                    selectedImageIndex === idx ? 'border-iris-600 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Details Content Container */}
          <div className="p-6 sm:p-8 space-y-8">
            
            {/* Specs Quick Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-center">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Bedrooms</span>
                <span className="text-base font-extrabold text-neutral-900 flex items-center justify-center gap-1 mt-0.5">
                  <Bed className="w-4 h-4 text-iris-600" />
                  {property.bedrooms > 0 ? `${property.bedrooms} Beds` : 'Executive Suite'}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Bathrooms</span>
                <span className="text-base font-extrabold text-neutral-900 flex items-center justify-center gap-1 mt-0.5">
                  <Bath className="w-4 h-4 text-iris-600" />
                  {property.bathrooms > 0 ? `${property.bathrooms} Baths` : 'Multiple'}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Living Area</span>
                <span className="text-base font-extrabold text-neutral-900 flex items-center justify-center gap-1 mt-0.5">
                  <Maximize2 className="w-4 h-4 text-iris-600" />
                  {property.sqft.toLocaleString()} sqft
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Est. Price / SqFt</span>
                <span className="text-base font-extrabold text-iris-700 mt-0.5 block">
                  ${Math.round(property.price / property.sqft).toLocaleString()}
                </span>
              </div>
            </div>

            {/* About Property Description */}
            <div>
              <h3 className="text-base font-bold text-neutral-900 font-display mb-2">
                Architectural Synopsis & Features
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Complete Signature Amenities */}
            <div>
              <h3 className="text-base font-bold text-neutral-900 font-display mb-3">
                Signature Amenities & Infrastructure
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {property.amenities?.map((am, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-ivory-100 border border-neutral-200/60 text-xs font-semibold text-neutral-800">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{am}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* VERIFIED SELLER CREDENTIALS CARD */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-iris-50 via-white to-ivory-50 border border-iris-200 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                
                <div className="flex items-center gap-3.5">
                  <img
                    src={property.seller_avatar}
                    alt={property.seller_name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-base font-bold text-neutral-900">{property.seller_name}</h4>
                      {property.seller_verified && (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Seller
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 font-medium">{property.seller_agency}</p>
                    <div className="flex items-center gap-3 text-[11px] text-neutral-600 mt-1">
                      <span className="flex items-center gap-1 font-bold text-amber-700">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {property.seller_rating || 4.9} (52 reviews)
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-iris-600 font-semibold">
                        <Clock className="w-3 h-3" /> Responds under 1 hr
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap sm:flex-col gap-2 w-full sm:w-auto">
                  <a
                    href={`tel:${property.seller_phone}`}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-neutral-200 hover:border-iris-400 text-neutral-800 text-xs font-bold transition-colors shadow-2xs"
                  >
                    <Phone className="w-3.5 h-3.5 text-iris-600" />
                    <span>{property.seller_phone}</span>
                  </a>
                  <a
                    href={`mailto:${property.seller_email}`}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-neutral-200 hover:border-iris-400 text-neutral-800 text-xs font-bold transition-colors shadow-2xs truncate"
                  >
                    <Mail className="w-3.5 h-3.5 text-iris-600" />
                    <span>Direct Email</span>
                  </a>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* Modal Bottom Sticky Action Footer */}
        <div className="p-4 sm:p-5 bg-neutral-50 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          
          <div className="text-left w-full sm:w-auto">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">Total Investment</span>
            <span className="text-xl font-extrabold text-neutral-900 font-display">
              {formatPrice(property.price, property.listing_type)}
            </span>
            <span className="text-[11px] text-neutral-500 block">Includes Escrow Guarantee & Verification</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            
            {/* Send Enquiry Button */}
            <button
              onClick={() => {
                onClose();
                onSendEnquiry(property);
              }}
              className="flex-1 sm:flex-initial px-5 py-3 rounded-2xl border border-iris-300 bg-white hover:bg-iris-50 text-iris-700 text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-2xs"
            >
              <Mail className="w-4 h-4" />
              <span>Send Enquiry to Seller</span>
            </button>

            {/* Acquire Property Lock Button */}
            {isAvailable ? (
              <button
                onClick={handleAcquire}
                disabled={buyingProcess}
                className="flex-1 sm:flex-initial px-6 py-3 rounded-2xl bg-iris-600 hover:bg-iris-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              >
                {buyingProcess ? (
                  <span>Securing Property...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{property.listing_type === 'rent' ? 'Lock & Rent Property' : 'Lock & Buy Property'}</span>
                  </>
                )}
              </button>
            ) : (
              <button
                disabled
                className="flex-1 sm:flex-initial px-6 py-3 rounded-2xl bg-neutral-200 text-neutral-500 text-xs font-bold cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Unavailable (Secured)</span>
              </button>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
