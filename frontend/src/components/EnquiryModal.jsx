import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  Calendar, 
  User, 
  Building2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';

export default function EnquiryModal({
  property,
  onClose,
  currentUser,
  onSuccessNotification
}) {
  const [formData, setFormData] = useState({
    buyer_name: currentUser?.name || '',
    buyer_email: currentUser?.email || '',
    buyer_phone: currentUser?.phone || '',
    tour_date: '',
    message: `Hello ${property?.seller_name || 'Seller'}, I am interested in acquiring/touring "${property?.title}". Please provide complete documentation and available private viewing times.`
  });

  const [submitting, setSubmitting] = useState(false);
  const [dispatchResult, setDispatchResult] = useState(null);

  if (!property) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.buyer_name || !formData.buyer_email || !formData.buyer_phone) {
      alert('Please fill out your Name, Email, and Phone Number.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.submitEnquiry({
        property_id: property.id,
        buyer_name: formData.buyer_name,
        buyer_email: formData.buyer_email,
        buyer_phone: formData.buyer_phone,
        tour_date: formData.tour_date,
        message: formData.message
      });

      setDispatchResult(response.email_dispatch);
      if (onSuccessNotification) {
        onSuccessNotification({
          title: "Enquiry Sent & Email Dispatched",
          message: `Forwarded to ${property.seller_name} (${property.seller_email}). Confirmation dispatched to your inbox.`
        });
      }
    } catch (err) {
      alert(err.message || 'Error sending enquiry');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-6 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-iris-900 to-indigo-950 text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-iris-300 block">
              Official Property Inquiry
            </span>
            <h3 className="text-lg sm:text-xl font-bold font-display mt-0.5">
              Connect With Property Holder
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          
          {/* STEP 1: SELLER'S DETAILS SHOWN PROMINENTLY FIRST */}
          <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-ivory-100 border border-iris-200/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-iris-600 block mb-2">
              Step 1: Certified Seller & Holder Credentials
            </span>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={property.seller_avatar}
                  alt={property.seller_name}
                  className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-sm"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-neutral-900">{property.seller_name}</h4>
                    {property.seller_verified && (
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" title="Verified Holder" />
                    )}
                  </div>
                  <p className="text-xs text-neutral-600 font-medium">{property.seller_agency}</p>
                  <p className="text-[11px] text-iris-600 font-semibold mt-0.5">
                    Listed Property: {property.title} (${property.price.toLocaleString()})
                  </p>
                </div>
              </div>

              {/* Direct Seller Contact Badges */}
              <div className="space-y-1 text-xs sm:text-right text-neutral-600">
                <div className="flex sm:justify-end items-center gap-1.5 font-semibold text-neutral-800">
                  <Phone className="w-3.5 h-3.5 text-iris-600" />
                  <span>{property.seller_phone}</span>
                </div>
                <div className="flex sm:justify-end items-center gap-1.5 text-neutral-500">
                  <Mail className="w-3.5 h-3.5 text-iris-600" />
                  <span>{property.seller_email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* STEP 2: MAILING DISPATCH RECEIPT OR ENQUIRY FORM */}
          {dispatchResult ? (
            <div className="py-6 text-center space-y-4 animate-in fade-in zoom-in-95">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-neutral-900 font-display">
                Enquiry Dispatched For Mailing!
              </h4>
              <p className="text-xs text-neutral-600 max-w-md mx-auto leading-relaxed">
                Your message was recorded into the PropFind database and dispatched through our secure email gateway to both the seller and your personal inbox.
              </p>

              {/* Email Receipt Card */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-left text-xs font-mono space-y-2 text-neutral-800 max-w-md mx-auto shadow-inner">
                <div className="flex justify-between border-b border-neutral-200 pb-1.5 text-[11px] text-neutral-500">
                  <span>DISPATCH RECEIPT</span>
                  <span className="text-emerald-700 font-bold">SENT (TLS 1.3)</span>
                </div>
                <p><strong>To Seller:</strong> {dispatchResult.to_seller.email} ({dispatchResult.to_seller.seller_name})</p>
                <p><strong>To Client:</strong> {dispatchResult.to_buyer.email}</p>
                <p><strong>Subject:</strong> {dispatchResult.to_seller.subject}</p>
                <p><strong>Tracking ID:</strong> {dispatchResult.dispatch_id}</p>
              </div>

              <div className="pt-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full bg-iris-600 text-white text-xs font-bold hover:bg-iris-700 transition-colors shadow-sm"
                >
                  Close & Continue Browsing
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-iris-600 block mb-1">
                  Step 2: Enter Your Credentials & Message
                </span>
                <p className="text-xs text-neutral-500">
                  The seller will receive this inquiry immediately along with your contact phone and email.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.buyer_name}
                    onChange={(e) => setFormData({ ...formData, buyer_name: e.target.value })}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium focus:border-iris-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Your Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.buyer_email}
                    onChange={(e) => setFormData({ ...formData, buyer_email: e.target.value })}
                    placeholder="e.g. sarah@domain.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium focus:border-iris-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Your Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.buyer_phone}
                    onChange={(e) => setFormData({ ...formData, buyer_phone: e.target.value })}
                    placeholder="e.g. +1 (555) 234-8901"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium focus:border-iris-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Requested Viewing / Tour Date
                  </label>
                  <input
                    type="date"
                    value={formData.tour_date}
                    onChange={(e) => setFormData({ ...formData, tour_date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium focus:border-iris-500 focus:outline-none text-neutral-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Inquiry Message / Special Inquiries
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium focus:border-iris-500 focus:outline-none resize-none"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-6 rounded-2xl bg-iris-600 hover:bg-iris-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Dispatching Email to Seller...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Enquiry for Mailing Purpose</span>
                    </>
                  )}
                </button>
                <p className="text-[11px] text-neutral-400 text-center mt-2">
                  A real-time notification receipt will be generated upon dispatch.
                </p>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
