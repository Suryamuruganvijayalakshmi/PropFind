import React, { useState, useEffect } from 'react';
import { 
  X, 
  Heart, 
  Mail, 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  Phone, 
  Eye, 
  Building2,
  Trash2
} from 'lucide-react';
import { api } from '../services/api';

export default function BuyerDashboardModal({
  isOpen,
  onClose,
  currentUser,
  favorites,
  onToggleFavorite,
  allProperties,
  onViewDetails
}) {
  const [activeTab, setActiveTab] = useState('favorites'); // 'favorites', 'enquiries', 'purchased'
  const [enquiries, setEnquiries] = useState([]);
  const [loadingEnquiries, setLoadingEnquiries] = useState(false);

  // Purchased by this buyer
  const acquiredProperties = allProperties.filter(p => 
    p.buyer_name === currentUser?.name || p.buyer_id === currentUser?.id
  );

  useEffect(() => {
    if (isOpen && currentUser) {
      loadBuyerEnquiries();
    }
  }, [isOpen, currentUser]);

  const loadBuyerEnquiries = async () => {
    setLoadingEnquiries(true);
    try {
      const data = await api.getEnquiries({ buyer_email: currentUser?.email });
      setEnquiries(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingEnquiries(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-6 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-iris-950 via-iris-900 to-indigo-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-11 h-11 rounded-2xl object-cover border-2 border-iris-400"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold font-display">{currentUser?.name}</h3>
                <span className="px-2 py-0.5 rounded-full bg-iris-500/30 text-iris-200 text-[10px] font-bold border border-iris-400/40">
                  Private Client & Investor
                </span>
              </div>
              <p className="text-xs text-iris-200">{currentUser?.email} • {currentUser?.phone}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-200 bg-neutral-50 px-6 gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('favorites')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'favorites'
                ? 'border-iris-600 text-iris-700 bg-white'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            <span>Saved Favorites ({favorites.length})</span>
          </button>
          
          <button
            onClick={() => setActiveTab('enquiries')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'enquiries'
                ? 'border-iris-600 text-iris-700 bg-white'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-iris-600" />
            <span>Dispatched Inquiries ({enquiries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('purchased')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'purchased'
                ? 'border-iris-600 text-iris-700 bg-white'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Acquired Properties ({acquiredProperties.length})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {/* TAB 1: FAVORITES */}
          {activeTab === 'favorites' && (
            <div>
              {favorites.length === 0 ? (
                <div className="py-16 text-center text-neutral-500 bg-neutral-50 rounded-2xl">
                  <Heart className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-neutral-800">No saved favorites yet</h4>
                  <p className="text-xs text-neutral-500 mt-1">
                    Click the heart icon on any listing to bookmark properties for private review.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favorites.map((prop) => (
                    <div key={prop.id} className="p-3 rounded-2xl border border-neutral-200 bg-white hover:border-iris-300 transition-all shadow-2xs flex flex-col justify-between">
                      <div>
                        <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-2.5">
                          <img src={prop.image_url} alt={prop.title} className="w-full h-full object-cover" />
                          <button
                            onClick={() => onToggleFavorite(prop.id)}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-rose-500 hover:bg-white shadow-xs"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <h5 className="text-xs font-bold text-neutral-900 truncate">{prop.title}</h5>
                        <p className="text-[11px] text-neutral-500 truncate">{prop.location}</p>
                        <p className="text-xs font-extrabold text-iris-700 mt-1">
                          ${prop.price.toLocaleString()}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-neutral-100">
                        <button
                          onClick={() => { onClose(); onViewDetails(prop); }}
                          className="w-full py-1.5 rounded-xl bg-iris-50 hover:bg-iris-100 text-iris-700 text-xs font-bold transition-colors flex items-center justify-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect Property</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DISPATCHED INQUIRIES */}
          {activeTab === 'enquiries' && (
            <div className="space-y-3">
              {loadingEnquiries ? (
                <div className="py-12 text-center text-xs text-neutral-400">Loading your inquiries...</div>
              ) : enquiries.length === 0 ? (
                <div className="py-16 text-center text-neutral-500 bg-neutral-50 rounded-2xl">
                  <Mail className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-neutral-800">No sent enquiries</h4>
                  <p className="text-xs text-neutral-500 mt-1">
                    When you contact sellers, your inquiries and mailing logs will show here.
                  </p>
                </div>
              ) : (
                enquiries.map((enq) => (
                  <div key={enq.id} className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50/70 space-y-2">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-neutral-900">{enq.property_title}</h5>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Dispatched
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600">
                      Forwarded to seller: <span className="font-semibold">{enq.seller_email}</span>
                    </p>
                    <div className="p-2.5 rounded-xl bg-white border border-neutral-100 text-xs text-neutral-500 italic">
                      "{enq.message}"
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: ACQUIRED PROPERTIES */}
          {activeTab === 'purchased' && (
            <div>
              {acquiredProperties.length === 0 ? (
                <div className="py-16 text-center text-neutral-500 bg-neutral-50 rounded-2xl">
                  <Sparkles className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-neutral-800">No acquisitions recorded yet</h4>
                  <p className="text-xs text-neutral-500 mt-1">
                    When you purchase or lease a property via PropFind, it will be locked and listed here exclusively under your name.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {acquiredProperties.map((prop) => (
                    <div key={prop.id} className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img src={prop.image_url} alt={prop.title} className="w-16 h-14 rounded-xl object-cover shrink-0" />
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="text-xs font-bold text-neutral-900">{prop.title}</h5>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-bold uppercase">
                              Acquired & Locked
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-500">{prop.location} • Value: ${prop.price.toLocaleString()}</p>
                          <span className="text-[10px] text-emerald-800 font-semibold block mt-0.5">
                            Status: Secured exclusively by {currentUser?.name}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => { onClose(); onViewDetails(prop); }}
                        className="px-4 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-800 text-xs font-bold hover:bg-emerald-50"
                      >
                        Inspect Deed
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
