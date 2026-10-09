import React, { useState, useEffect } from 'react';
import { 
  X, 
  Building2, 
  Mail, 
  Phone, 
  PlusCircle, 
  CheckCircle2, 
  RotateCcw, 
  ShieldCheck, 
  Calendar, 
  DollarSign, 
  Layers,
  Sparkles,
  Lock
} from 'lucide-react';
import { api } from '../services/api';

export default function SellerDashboardModal({
  isOpen,
  onClose,
  currentUser,
  allProperties,
  onPropertyUpdated,
  onPropertyAdded
}) {
  const [activeTab, setActiveTab] = useState('listings'); // 'listings', 'enquiries', 'add_property'
  const [enquiries, setEnquiries] = useState([]);
  const [loadingEnquiries, setLoadingEnquiries] = useState(false);

  // New property form state
  const [newProp, setNewProp] = useState({
    title: '',
    price: '',
    listing_type: 'buy',
    property_type: 'beach_house',
    location: '',
    address: '',
    lat: 34.0259,
    lng: -118.7798,
    bedrooms: 4,
    bathrooms: 4,
    sqft: 5000,
    image_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85',
    description: '',
    amenities: ['Clean Glass Facade', 'Swimming Pool', 'Smart Home', '24/7 Security']
  });
  const [submittingProp, setSubmittingProp] = useState(false);

  // Properties belonging to this seller
  const sellerProperties = allProperties.filter(p => 
    p.seller_email === currentUser?.email || 
    p.seller_name?.toLowerCase().includes(currentUser?.name?.toLowerCase() || '') ||
    currentUser?.role === 'seller' // show relevant items if matched
  );

  useEffect(() => {
    if (isOpen && currentUser) {
      loadEnquiries();
    }
  }, [isOpen, currentUser]);

  const loadEnquiries = async () => {
    setLoadingEnquiries(true);
    try {
      const data = await api.getEnquiries({ seller_email: currentUser?.email });
      setEnquiries(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingEnquiries(false);
    }
  };

  const handleResetStatus = async (propId) => {
    try {
      const res = await api.resetProperty(propId);
      if (res.success) {
        onPropertyUpdated(res.property);
      }
    } catch (err) {
      alert('Error updating status');
    }
  };

  const handleCreateProperty = async (e) => {
    e.preventDefault();
    if (!newProp.title || !newProp.price || !newProp.location || !newProp.address) {
      alert('Please fill out required property details.');
      return;
    }

    setSubmittingProp(true);
    try {
      const res = await api.createProperty({
        ...newProp,
        price: Number(newProp.price),
        sqft: Number(newProp.sqft),
        bedrooms: Number(newProp.bedrooms),
        bathrooms: Number(newProp.bathrooms),
        seller_id: currentUser?.id || 1,
        seller_name: currentUser?.name || 'Verified Seller',
        seller_agency: currentUser?.agency || 'PropFind Elite',
        seller_email: currentUser?.email || 'seller@propfind.luxury',
        seller_phone: currentUser?.phone || '+1 (555) 789-4321',
        seller_avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
      });

      if (res.success && res.property) {
        onPropertyAdded(res.property);
        alert('Property listed successfully into SQLite database!');
        setActiveTab('listings');
      }
    } catch (err) {
      alert(err.message || 'Error listing property');
    } finally {
      setSubmittingProp(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-6 flex flex-col max-h-[92vh]"
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
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40">
                  Verified Seller Portal
                </span>
              </div>
              <p className="text-xs text-iris-200">{currentUser?.agency || 'PropFind Partner Firm'} • {currentUser?.email}</p>
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
            onClick={() => setActiveTab('listings')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'listings'
                ? 'border-iris-600 text-iris-700 bg-white'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            My Managed Listings ({sellerProperties.length})
          </button>
          <button
            onClick={() => setActiveTab('enquiries')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'enquiries'
                ? 'border-iris-600 text-iris-700 bg-white'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Buyer Enquiries Inbox</span>
            {enquiries.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-iris-600 text-white text-[10px]">
                {enquiries.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('add_property')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'add_property'
                ? 'border-iris-600 text-iris-700 bg-white'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5 text-iris-600" />
            <span>List New Property</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {/* TAB 1: LISTED PROPERTIES */}
          {activeTab === 'listings' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-neutral-800">Your Current Property Portfolio</h4>
                <span className="text-xs text-neutral-500">Real-time availability status synced with SQLite</span>
              </div>

              {sellerProperties.length === 0 ? (
                <div className="p-12 text-center text-neutral-500 bg-neutral-50 rounded-2xl">
                  <Building2 className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
                  <p className="text-xs">No properties listed yet under your profile.</p>
                </div>
              ) : (
                <div className="divide-y divide-neutral-200 border border-neutral-200 rounded-2xl overflow-hidden bg-white">
                  {sellerProperties.map((p) => (
                    <div key={p.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image_url}
                          alt={p.title}
                          className="w-16 h-12 rounded-xl object-cover shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="text-xs font-bold text-neutral-900 truncate max-w-xs">{p.title}</h5>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                              p.status === 'available' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {p.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-500">{p.location} • {p.listing_type.toUpperCase()}</p>
                          <span className="text-xs font-extrabold text-iris-700">
                            ${p.price.toLocaleString()}{p.listing_type === 'rent' ? '/mo' : ''}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {p.status !== 'available' ? (
                          <button
                            onClick={() => handleResetStatus(p.id)}
                            className="px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                            title="Reset to Available status"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reset Availability</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Buyers
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: BUYER ENQUIRIES */}
          {activeTab === 'enquiries' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-neutral-800">Incoming Buyer & Investor Inquiries</h4>
                <button
                  onClick={loadEnquiries}
                  className="text-xs text-iris-600 font-semibold hover:underline"
                >
                  Refresh Inbox
                </button>
              </div>

              {loadingEnquiries ? (
                <div className="py-12 text-center text-xs text-neutral-400">Loading inquiries from database...</div>
              ) : enquiries.length === 0 ? (
                <div className="p-12 text-center text-neutral-500 bg-neutral-50 rounded-2xl">
                  <Mail className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
                  <p className="text-xs">No client inquiries received yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {enquiries.map((enq) => (
                    <div key={enq.id} className="p-4 rounded-2xl border border-neutral-200 bg-ivory-50/50 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200/60 pb-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-iris-600">Property Lead</span>
                          <h5 className="text-xs font-bold text-neutral-900">{enq.property_title}</h5>
                        </div>
                        <span className="text-[11px] text-neutral-400 font-mono">{enq.created_at || 'Recent'}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-neutral-700 bg-white p-3 rounded-xl border border-neutral-100">
                        <div>
                          <span className="text-[10px] text-neutral-400 block font-bold">Client Name</span>
                          <strong>{enq.buyer_name}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-neutral-400 block font-bold">Email Address</span>
                          <a href={`mailto:${enq.buyer_email}`} className="text-iris-600 hover:underline">{enq.buyer_email}</a>
                        </div>
                        <div>
                          <span className="text-[10px] text-neutral-400 block font-bold">Phone Number</span>
                          <a href={`tel:${enq.buyer_phone}`} className="font-semibold text-neutral-900">{enq.buyer_phone}</a>
                        </div>
                      </div>

                      {enq.tour_date && (
                        <p className="text-xs text-neutral-600 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-iris-600" />
                          <span>Requested Tour Date: <strong>{enq.tour_date}</strong></span>
                        </p>
                      )}

                      <div className="p-3 rounded-xl bg-white border border-neutral-100 text-xs text-neutral-600">
                        <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Message</span>
                        "{enq.message}"
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: LIST NEW PROPERTY */}
          {activeTab === 'add_property' && (
            <form onSubmit={handleCreateProperty} className="space-y-4 max-w-3xl mx-auto">
              <div>
                <h4 className="text-sm font-bold text-neutral-900">List an Architectural Asset</h4>
                <p className="text-xs text-neutral-500">Provide property specifications to publish to PropFind's 80-property catalogue.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Property Title *</label>
                  <input
                    type="text"
                    required
                    value={newProp.title}
                    onChange={(e) => setNewProp({ ...newProp, title: e.target.value })}
                    placeholder="e.g. Bel-Air Glass Atrium Villa"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium focus:border-iris-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Price (USD) *</label>
                  <input
                    type="number"
                    required
                    value={newProp.price}
                    onChange={(e) => setNewProp({ ...newProp, price: e.target.value })}
                    placeholder="e.g. 5800000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium focus:border-iris-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Listing Type</label>
                  <select
                    value={newProp.listing_type}
                    onChange={(e) => setNewProp({ ...newProp, listing_type: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium focus:border-iris-500 focus:outline-none"
                  >
                    <option value="buy">For Sale (Buy)</option>
                    <option value="rent">For Rent (Lease)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Property Category</label>
                  <select
                    value={newProp.property_type}
                    onChange={(e) => setNewProp({ ...newProp, property_type: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium focus:border-iris-500 focus:outline-none"
                  >
                    <option value="beach_house">Beach House (Sea View)</option>
                    <option value="residential">Residential Glass Condo</option>
                    <option value="commercial">Commercial Tower</option>
                    <option value="warehouse">Warehouse & Logistics</option>
                    <option value="farmhouse">Farmhouse & Vineyard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Living Area (Sq Ft)</label>
                  <input
                    type="number"
                    value={newProp.sqft}
                    onChange={(e) => setNewProp({ ...newProp, sqft: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium focus:border-iris-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">City & State / Region *</label>
                  <input
                    type="text"
                    required
                    value={newProp.location}
                    onChange={(e) => setNewProp({ ...newProp, location: e.target.value })}
                    placeholder="e.g. Malibu, California"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium focus:border-iris-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Full Street Address *</label>
                  <input
                    type="text"
                    required
                    value={newProp.address}
                    onChange={(e) => setNewProp({ ...newProp, address: e.target.value })}
                    placeholder="e.g. 21804 Pacific Coast Hwy"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium focus:border-iris-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">High-Res Image URL</label>
                <input
                  type="url"
                  value={newProp.image_url}
                  onChange={(e) => setNewProp({ ...newProp, image_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium focus:border-iris-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Property Description</label>
                <textarea
                  rows={3}
                  value={newProp.description}
                  onChange={(e) => setNewProp({ ...newProp, description: e.target.value })}
                  placeholder="Architectural features, finishes, glass facade details..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium focus:border-iris-500 focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submittingProp}
                className="w-full py-3 rounded-2xl bg-iris-600 hover:bg-iris-700 text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all disabled:opacity-50"
              >
                {submittingProp ? 'Publishing to SQLite...' : 'Publish Property Listing'}
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
