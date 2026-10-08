import React, { useState } from 'react';
import { Calendar, Clock, Users, User, Phone, Mail, FileText, Send, CheckCircle2, AlertCircle, Database, Sparkles } from 'lucide-react';
import { saveAppointmentBooking } from '../lib/supabaseClient';

interface AppointmentBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultInquiryType?: string;
}

export const AppointmentBookingModal: React.FC<AppointmentBookingModalProps> = ({
  isOpen,
  onClose,
  defaultInquiryType = 'Table Reservation',
}) => {
  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    inquiry_type: defaultInquiryType,
    guests_count: 2,
    booking_date: todayStr,
    booking_time: '19:00',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState<{ table?: string; recordId?: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sqlHelper, setSqlHelper] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSqlHelper(null);

    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!formData.name.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await saveAppointmentBooking({
        name: formData.name.trim(),
        phone: cleanPhone,
        email: formData.email.trim() || undefined,
        inquiry_type: formData.inquiry_type,
        guests_count: Number(formData.guests_count) || 2,
        booking_date: formData.booking_date,
        booking_time: formData.booking_time,
        message: formData.message.trim() || undefined,
      });

      setIsSubmitting(false);

      if (res.success) {
        setSuccessResult({
          table: res.table,
          recordId: res.data && res.data[0]?.id ? String(res.data[0].id) : undefined,
        });
      } else {
        // Table needs creation or permission in user's Supabase dashboard
        console.error('Supabase error:', res.error);
        setErrorMessage(
          res.error?.message ||
            'Could not insert row into Supabase. Make sure the table "appointments" is created in your Supabase database.'
        );
        if (res.helperSql) {
          setSqlHelper(res.helperSql);
        }
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err?.message || 'Unexpected connection error while saving to Supabase.');
    }
  };

  const handleReset = () => {
    setSuccessResult(null);
    setErrorMessage(null);
    setSqlHelper(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      inquiry_type: defaultInquiryType,
      guests_count: 2,
      booking_date: todayStr,
      booking_time: '19:00',
      message: '',
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 text-center flex items-center justify-center p-0">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

        <div className="inline-block w-full max-w-lg my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl relative z-10 border border-stone-200">
          {/* Header */}
          <div className="bg-[#183B2B] text-white p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-300">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg leading-tight">
                  Book Table or Appointment
                </h3>
                <p className="text-xs text-emerald-200 flex items-center gap-1.5 mt-0.5">
                  <Database className="w-3 h-3 text-emerald-400" />
                  <span>Synced directly to Supabase Backend</span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-stone-300 hover:text-white p-1 rounded-lg transition-colors text-lg font-bold"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6">
            {successResult ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-display text-xl font-bold text-stone-900">
                    Booking Saved in Supabase!
                  </h4>
                  <p className="text-xs text-stone-600 max-w-sm mx-auto">
                    Your appointment details have been successfully recorded in your Supabase database table:{' '}
                    <span className="font-mono font-bold text-[#183B2B]">
                      {successResult.table || 'appointments'}
                    </span>
                    .
                  </p>
                </div>

                <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-stone-200 text-xs text-stone-700 max-w-sm mx-auto text-left space-y-1.5 font-mono">
                  <div className="flex justify-between text-stone-500 text-[11px] pb-1 border-b border-stone-200">
                    <span>DATABASE SYNC STATUS</span>
                    <span className="text-emerald-700 font-bold">● ACTIVE</span>
                  </div>
                  <div><span className="text-stone-500">Name:</span> {formData.name}</div>
                  <div><span className="text-stone-500">Phone:</span> {formData.phone}</div>
                  <div><span className="text-stone-500">Date & Time:</span> {formData.booking_date} at {formData.booking_time}</div>
                  <div><span className="text-stone-500">Guests:</span> {formData.guests_count} People</div>
                  <div><span className="text-stone-500">Type:</span> {formData.inquiry_type}</div>
                </div>

                <div className="pt-3 flex gap-2 justify-center">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
                  >
                    Book Another
                  </button>
                  <button
                    onClick={onClose}
                    className="px-5 py-2 text-xs font-semibold text-white bg-[#183B2B] hover:bg-[#122A1E] rounded-lg transition-colors shadow-2xs"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs space-y-2">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-semibold">{errorMessage}</p>
                        <p className="text-[11px] text-amber-800 mt-1">
                          If you haven't created the <code className="bg-amber-100 px-1 rounded font-bold">appointments</code> table in your Supabase SQL Editor yet, run this one-click SQL query below:
                        </p>
                      </div>
                    </div>

                    {sqlHelper && (
                      <div className="mt-2 bg-stone-900 text-stone-100 p-2.5 rounded text-[11px] font-mono overflow-x-auto relative">
                        <pre>{sqlHelper}</pre>
                        <button
                          type="button"
                          onClick={() => navigator.clipboard.writeText(sqlHelper)}
                          className="mt-2 text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded hover:bg-emerald-700"
                        >
                          Copy SQL snippet
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Booking / Appointment Type */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Booking Purpose / Type
                  </label>
                  <select
                    value={formData.inquiry_type}
                    onChange={(e) => setFormData({ ...formData, inquiry_type: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#183B2B]/20"
                  >
                    <option value="Table Reservation">Family Table Reservation</option>
                    <option value="Party / Birthday Hall Booking">Party / Birthday Hall Booking</option>
                    <option value="Highway Breakfast Halt">Highway Tour / Group Breakfast Halt</option>
                    <option value="Catering Consultation">Bulk Catering Consultation</option>
                    <option value="Manager Discussion">Manager / Owner Appointment</option>
                  </select>
                </div>

                {/* Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Gowda"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-stone-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#183B2B]/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        placeholder="10-digit mobile"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-stone-200 bg-white font-mono focus:outline-hidden focus:ring-2 focus:ring-[#183B2B]/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Email & Guests count */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Email Address (Optional)
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        placeholder="yourname@gmail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-stone-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#183B2B]/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Number of Guests
                    </label>
                    <div className="relative">
                      <Users className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={formData.guests_count}
                        onChange={(e) => setFormData({ ...formData, guests_count: Number(e.target.value) })}
                        className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-stone-200 bg-white tabular-nums focus:outline-hidden focus:ring-2 focus:ring-[#183B2B]/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Appointment / Booking Date
                    </label>
                    <input
                      type="date"
                      min={todayStr}
                      value={formData.booking_date}
                      onChange={(e) => setFormData({ ...formData, booking_date: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#183B2B]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Preferred Time Slot
                    </label>
                    <select
                      value={formData.booking_time}
                      onChange={(e) => setFormData({ ...formData, booking_time: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#183B2B]/20"
                    >
                      <option value="08:00 AM">08:00 AM (Breakfast)</option>
                      <option value="09:30 AM">09:30 AM (Breakfast)</option>
                      <option value="12:30 PM">12:30 PM (Lunch)</option>
                      <option value="01:30 PM">01:30 PM (Lunch)</option>
                      <option value="04:30 PM">04:30 PM (Evening Snacks/Tea)</option>
                      <option value="07:30 PM">07:30 PM (Dinner)</option>
                      <option value="08:30 PM">08:30 PM (Dinner)</option>
                      <option value="09:30 PM">09:30 PM (Late Dinner)</option>
                    </select>
                  </div>
                </div>

                {/* Special Requests / Notes */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Special Notes / Dietary Preferences (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. High chair for toddler, jain food options, quiet corner table"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#183B2B]/20"
                  />
                </div>

                {/* Footer buttons */}
                <div className="pt-2 flex items-center justify-between border-t border-stone-100">
                  <span className="text-[11px] text-stone-500 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    Instant confirmation to database
                  </span>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-3.5 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#183B2B] hover:bg-[#122A1E] text-white text-xs font-semibold rounded-lg shadow-sm transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Saving to Supabase...</span>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Confirm & Save</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
