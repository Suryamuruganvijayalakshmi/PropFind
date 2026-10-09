import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle, 
  ShieldCheck, 
  Sparkles,
  Building2,
  Calendar
} from 'lucide-react';

export default function ContactSection({ onShowNotification }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Acquisition Inquiry',
    propertyInterest: 'Residential & Beach Houses',
    preferredDate: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [successDispatched, setSuccessDispatched] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please provide your name, email, and phone number.');
      return;
    }

    setSubmitting(true);
    // Simulate API dispatch and email gateway routing
    setTimeout(() => {
      setSubmitting(false);
      setSuccessDispatched(true);
      if (onShowNotification) {
        onShowNotification({
          title: "Inquiry Dispatched via Mail Gateway",
          message: `Confirmation sent to ${formData.email}. A dedicated PropFind advisor will connect within 2 business hours.`
        });
      }
    }, 700);
  };

  return (
    <section id="contact-section" className="py-20 lg:py-28 bg-ivory-50 relative overflow-hidden border-b border-neutral-200/50">
      
      {/* Ambient Iris Highlights */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-iris-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-iris-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-iris-50 border border-iris-200 text-iris-700 text-xs font-bold uppercase tracking-wider mb-4">
            <Mail className="w-3.5 h-3.5" />
            <span>PropFind Concierge</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 tracking-tight">
            Connect With Our Global Advisory & Escrow Team
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 leading-relaxed font-normal">
            Whether you are inquiring about a specific beachfront estate, commercial acquisition, or listing your architectural property across our 80-location network, our concierge is at your service.
          </p>
        </div>

        {/* Contact Grid: Details on Left, Interactive Form on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Direct Office Contact Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Office HQ Card */}
            <div className="glass-card p-6 sm:p-7 rounded-3xl border border-neutral-200/90 bg-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-iris-50 border border-iris-200 flex items-center justify-center text-iris-600">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900">PropFind Global Headquarters</h3>
                  <span className="text-xs text-neutral-500 font-medium">San Francisco Bay Area</span>
                </div>
              </div>
              <p className="text-sm text-neutral-700 leading-relaxed pl-13">
                742 Iris Boulevard, Suite 1200<br />
                Financial District, San Francisco, CA 94107
              </p>
            </div>

            {/* Direct Telephone Card */}
            <div className="glass-card p-6 sm:p-7 rounded-3xl border border-neutral-200/90 bg-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-iris-50 border border-iris-200 flex items-center justify-center text-iris-600">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900">Direct Telephone & WhatsApp</h3>
                  <span className="text-xs text-neutral-500 font-medium">Toll-Free Client Line</span>
                </div>
              </div>
              <div className="pl-13 space-y-1">
                <a href="tel:+18007767346" className="text-sm font-bold text-iris-600 hover:text-iris-800 block">
                  +1 (800) 776-7346 (PROPFIND)
                </a>
                <p className="text-xs text-neutral-500">
                  Direct Line: +1 (415) 890-4420
                </p>
              </div>
            </div>

            {/* Email Dispatch & Hours Card */}
            <div className="glass-card p-6 sm:p-7 rounded-3xl border border-neutral-200/90 bg-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-iris-50 border border-iris-200 flex items-center justify-center text-iris-600">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900">Concierge Desk Hours</h3>
                  <span className="text-xs text-neutral-500 font-medium">Round the Clock Coordination</span>
                </div>
              </div>
              <div className="pl-13 space-y-1.5 text-xs text-neutral-600">
                <p className="flex justify-between">
                  <span>Mon – Fri:</span>
                  <span className="font-semibold text-neutral-800">07:00 AM – 09:00 PM PST</span>
                </p>
                <p className="flex justify-between">
                  <span>Weekends:</span>
                  <span className="font-semibold text-neutral-800">09:00 AM – 06:00 PM PST</span>
                </p>
                <p className="flex justify-between pt-2 border-t border-neutral-100 text-iris-700 font-semibold">
                  <span>Official Email:</span>
                  <a href="mailto:concierge@propfind.luxury" className="hover:underline">concierge@propfind.luxury</a>
                </p>
              </div>
            </div>

            {/* Trust Assurance Badge */}
            <div className="p-4 rounded-2xl bg-iris-50 border border-iris-100 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <p className="text-xs text-neutral-700 leading-snug">
                All inquiries are processed with bank-grade TLS encryption and shared strictly with the certified property holder.
              </p>
            </div>

          </div>

          {/* Right Column: Interactive Consultation & Enquiry Form */}
          <div className="lg:col-span-7">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xl bg-white">
              
              {successDispatched ? (
                <div className="py-12 text-center space-y-4 animate-in fade-in zoom-in-95">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-neutral-900 font-display">
                    Enquiry Dispatched Successfully!
                  </h3>
                  <p className="text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
                    An automated email confirmation was routed to <strong className="text-neutral-900">{formData.email}</strong>. Our senior property associate and the certified seller have been notified.
                  </p>
                  
                  {/* Simulated Email Envelope Card */}
                  <div className="mt-6 p-4 rounded-2xl bg-ivory-100 border border-neutral-200 text-left max-w-md mx-auto text-xs space-y-1.5 font-mono text-neutral-700">
                    <p><span className="font-bold text-iris-700">From:</span> concierge@propfind.luxury</p>
                    <p><span className="font-bold text-iris-700">To:</span> {formData.email}</p>
                    <p><span className="font-bold text-iris-700">Subject:</span> Inquiry Confirmation • PropFind Global Desk</p>
                    <p><span className="font-bold text-iris-700">Tracking Code:</span> PF-ENQ-88219-OK</p>
                  </div>

                  <button
                    onClick={() => {
                      setSuccessDispatched(false);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        subject: 'General Acquisition Inquiry',
                        propertyInterest: 'Residential & Beach Houses',
                        preferredDate: '',
                        message: ''
                      });
                    }}
                    className="mt-6 px-6 py-2.5 rounded-full bg-iris-600 text-white text-xs font-bold hover:bg-iris-700 transition-colors shadow-sm"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 font-display">
                      Send An Executive Inquiry
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1">
                      Fill out your contact credentials below to dispatch an inquiry to our concierge team.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {/* Customer Name */}
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Sarah Jenkins"
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium focus:border-iris-500 focus:ring-1 focus:ring-iris-500 focus:outline-none bg-neutral-50/50"
                      />
                    </div>

                    {/* Customer Email */}
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. sarah@domain.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium focus:border-iris-500 focus:ring-1 focus:ring-iris-500 focus:outline-none bg-neutral-50/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Customer Phone */}
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. +1 (555) 234-8901"
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium focus:border-iris-500 focus:ring-1 focus:ring-iris-500 focus:outline-none bg-neutral-50/50"
                      />
                    </div>

                    {/* Preferred Date */}
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Preferred Private Viewing Date
                      </label>
                      <input
                        type="date"
                        value={formData.preferredDate}
                        onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium focus:border-iris-500 focus:ring-1 focus:ring-iris-500 focus:outline-none bg-neutral-50/50 text-neutral-700"
                      />
                    </div>
                  </div>

                  {/* Property Category Interest */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Property Category of Interest
                    </label>
                    <select
                      value={formData.propertyInterest}
                      onChange={(e) => setFormData({ ...formData, propertyInterest: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium focus:border-iris-500 focus:ring-1 focus:ring-iris-500 focus:outline-none bg-neutral-50/50 cursor-pointer"
                    >
                      <option value="Beach House & Seafront Villa">Beach House & Seafront Villa (Infinity Pool)</option>
                      <option value="Residential Glass Condominiums & Penthouses">Residential Glass Condos & Penthouses</option>
                      <option value="Commercial High-Rise & Tech Campuses">Commercial High-Rise & Tech Campuses</option>
                      <option value="Farmhouse & Countryside Vineyards">Farmhouse & Countryside Vineyards</option>
                      <option value="Warehouse & Industrial Logistics Hubs">Warehouse & Industrial Logistics Hubs</option>
                      <option value="Custom Portfolio Consultation">Custom Portfolio Consultation (Multiple)</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Inquiry Details / Specific Requirements
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please state any specific locations, timeline, or amenities (e.g., swimming pool, clean glass walls, helipad)..."
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium focus:border-iris-500 focus:ring-1 focus:ring-iris-500 focus:outline-none bg-neutral-50/50 resize-none"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-iris-600 hover:bg-iris-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-iris-600/20 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Routing Mail Gateway...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Dispatch Inquiry to Concierge</span>
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-neutral-400 text-center mt-2">
                      Mailing dispatch is processed immediately and verified on our backend server.
                    </p>
                  </div>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
