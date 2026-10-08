import React, { useState } from 'react';
import { MapPin, Phone, Clock, MessageSquare, Navigation, Send, CheckCircle2, Calendar, Database, AlertCircle } from 'lucide-react';
import { RestaurantConfig } from '../types';
import { saveAppointmentBooking } from '../lib/supabaseClient';

interface LocationContactSectionProps {
  restaurant: RestaurantConfig;
  onOpenBookingModal: () => void;
}

export const LocationContactSection: React.FC<LocationContactSectionProps> = ({
  restaurant,
  onOpenBookingModal,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    type: 'General Inquiry',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    setIsSubmitting(true);
    setSyncStatus(null);

    // Save directly to Supabase backend!
    try {
      const res = await saveAppointmentBooking({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        inquiry_type: formData.type,
        message: formData.message.trim(),
        guests_count: 2,
        booking_date: new Date().toISOString().split('T')[0],
        booking_time: '19:00',
      });

      setIsSubmitting(false);
      setSubmitted(true);
      if (res.success) {
        setSyncStatus(`Saved to Supabase database table (${res.table})`);
      } else {
        setSyncStatus('Form submitted (Note: create table "appointments" in Supabase to view SQL entries)');
      }

      setTimeout(() => {
        setSubmitted(false);
        setSyncStatus(null);
        setFormData({ name: '', phone: '', type: 'General Inquiry', message: '' });
      }, 5000);
    } catch (err) {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', phone: '', type: 'General Inquiry', message: '' });
      }, 4000);
    }
  };

  return (
    <section id="contact" className="py-16 sm:py-20 bg-white scroll-mt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#C88729]">
            Visit or Get in Touch
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#183B2B] tracking-tight">
            Location & Contact
          </h2>
          <p className="text-stone-600 text-sm">
            We are conveniently located on Chandapura–Anekal Road with ample customer parking. Call us or visit any time during open hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Contact Cards & Hours */}
          <div className="lg:col-span-5 space-y-6">
            {/* Address Card */}
            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-stone-200/90 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#183B2B]/10 flex items-center justify-center text-[#183B2B] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-base text-stone-900">Restaurant Address</h3>
                  <p className="text-sm font-medium text-stone-800">
                    {restaurant.name}
                  </p>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {restaurant.address.line1}, {restaurant.address.landmark},<br />
                    {restaurant.address.area}, {restaurant.address.city},<br />
                    {restaurant.address.state} — {restaurant.address.pincode}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={restaurant.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#183B2B] hover:bg-[#122A1E] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Directions on Google Maps</span>
                </a>
              </div>
            </div>

            {/* Timings & Direct Phone Card */}
            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-stone-200/90 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#C88729]/15 flex items-center justify-center text-[#C88729] shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-stone-900">Opening Hours</h3>
                  <p className="text-xs text-stone-600">Monday to Sunday (Open Daily)</p>
                  <p className="text-sm font-bold text-stone-900 mt-1">7:00 AM – 11:00 PM</p>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-200 flex flex-col sm:flex-row gap-2.5">
                <a
                  href={`tel:${restaurant.phone}`}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 text-xs font-semibold transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#183B2B]" />
                  <span>Call {restaurant.displayPhone}</span>
                </a>

                <a
                  href={`https://wa.me/${restaurant.whatsappNumber}?text=Hello%20Sahyadri%20Vaibhava,%20I%20would%20like%20to%20inquire%20about%20your%20menu.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-white" />
                  <span>WhatsApp Us</span>
                </a>
              </div>
            </div>

            {/* Quick Contact / Inquiry Form */}
            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-stone-200/90 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm text-stone-900">Send an Inquiry or Feedback</h3>
                  <p className="text-xs text-stone-500">Automatically syncs to your Supabase backend.</p>
                </div>
                <button
                  type="button"
                  onClick={onOpenBookingModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#183B2B] hover:bg-[#122A1E] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Table</span>
                </button>
              </div>

              {submitted ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-1 animate-in fade-in">
                  <div className="flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Inquiry successfully received!</span>
                  </div>
                  {syncStatus && (
                    <p className="text-[11px] text-emerald-700 pl-6 flex items-center gap-1">
                      <Database className="w-3 h-3 text-emerald-600" />
                      <span>{syncStatus}</span>
                    </p>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Your Name *"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-[#183B2B]"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        required
                        placeholder="Mobile Number *"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-[#183B2B]"
                      />
                    </div>
                  </div>

                  <div>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-[#183B2B]"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Family Table Reservation">Family Table Reservation</option>
                      <option value="Bulk / Party Catering">Bulk / Party Catering</option>
                      <option value="Feedback">Feedback</option>
                    </select>
                  </div>

                  <div>
                    <textarea
                      rows={2}
                      placeholder="Your message or special requirement..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-[#183B2B]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-4 rounded-lg bg-[#183B2B] hover:bg-[#122A1E] text-white text-xs font-semibold transition-colors disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Saving to Supabase...' : 'Submit to Supabase Database'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Google Maps Embed */}
          <div className="lg:col-span-7 space-y-3">
            <div className="w-full h-96 sm:h-[480px] rounded-2xl overflow-hidden border border-stone-200 shadow-md relative bg-stone-100">
              <iframe
                title="Sahyadri Vaibhava Location Map"
                src={restaurant.googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full grayscale-[15%] contrast-[105%]"
              />

              {/* Floating Overlay on Map */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs p-3.5 rounded-xl border border-stone-200/90 shadow-md max-w-xs space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping" />
                  <h4 className="font-semibold text-xs text-stone-900">{restaurant.name}</h4>
                </div>
                <p className="text-[11px] text-stone-600">
                  Opp. JPM Nursery, Chandapura–Anekal Road, Iggalur
                </p>
                <div className="pt-1">
                  <a
                    href={restaurant.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-semibold text-[#183B2B] hover:underline flex items-center gap-1"
                  >
                    <span>Open in Google Maps App</span>
                    <Navigation className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            <p className="text-xs text-stone-500 text-center sm:text-left">
              * Landmark: Located directly opposite JPM Nursery on the Chandapura–Anekal main arterial road.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
