"use client";

import React, { useState } from "react";

const SERVICE_OPTIONS = [
  "Digital Marketing",
  "Google & Meta Ads",
  "Social Media",
  "Branding",
  "Website Development",
  "SEO",
  "AI & Automation",
  "Other",
];

function MapPinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function MailIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function PhoneIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    service: "",
    requirement: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error" | null;
    text: string;
  }>({ type: null, text: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Client-side validations
    if (!formData.name.trim()) {
      setStatusMessage({ type: "error", text: "Please enter your name." });
      return;
    }

    if (!formData.phone.trim()) {
      setStatusMessage({ type: "error", text: "Please enter your phone number." });
      return;
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setStatusMessage({ type: "error", text: "Please enter a valid email address." });
      return;
    }

    if (!formData.requirement.trim()) {
      setStatusMessage({
        type: "error",
        text: "Please tell us about your project requirements.",
      });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage({ type: null, text: "" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          services: formData.service ? [formData.service] : [],
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatusMessage({
          type: "success",
          text:
            data.message ||
            "Thank you! Your project details have been received. We will be in touch shortly.",
        });
        setFormData({
          name: "",
          company: "",
          phone: "",
          email: "",
          service: "",
          requirement: "",
        });
      } else {
        setStatusMessage({
          type: "error",
          text: data.error || "Something went wrong. Please check your inputs and try again.",
        });
      }
    } catch {
      setStatusMessage({
        type: "error",
        text: "Network error occurred. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="contact-form"
      className="w-full pt-10 sm:pt-14 pb-16 sm:pb-24 border-t border-white/[0.12] scroll-mt-[120px]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* LEFT COLUMN: Narrative & Invitation */}
        <div className="lg:col-span-5 flex flex-col will-change-transform">
          <span className="text-xs uppercase font-mono tracking-[0.24em] text-[#EE4530] font-semibold mb-3">
            START A CONVERSATION
          </span>

          <h3 className="text-white font-bold text-[30px] sm:text-[38px] lg:text-[44px] tracking-[-0.035em] leading-[1.05]">
            Tell us what you&apos;re building.
          </h3>

          <p className="mt-5 text-white/70 font-normal leading-[1.65] text-[16px] sm:text-[17px] max-w-[480px]">
            Every great project starts with a conversation. Share a little about
            your business, your goals and what you have in mind. We&apos;ll take
            it from there.
          </p>

          {/* Location & Collaboration Details */}
          <div className="mt-8 sm:mt-10 pt-6 border-t border-white/[0.10] flex flex-col space-y-3.5 text-sm text-white/60">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EE4530]" aria-hidden="true" />
              <span>Headquartered in Dindigul, Tamil Nadu</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EE4530]" aria-hidden="true" />
              <span>Partnering with growing brands worldwide</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EE4530]" aria-hidden="true" />
              <span>Response within 24 business hours</span>
            </div>
          </div>

          {/* Direct Contact Details: Address, Email & Mobile Number */}
          <div className="mt-8 pt-8 border-t border-white/[0.10] flex flex-col space-y-4">
            <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-[#EE4530] font-semibold">
              DIRECT REACH
            </span>

            <div className="flex flex-col space-y-3.5">
              {/* Address Card */}
              <div className="p-4 sm:p-5 rounded-sm bg-white/[0.02] border border-white/[0.08] hover:border-white/20 transition-colors">
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-[#EE4530]/10 border border-[#EE4530]/30 flex items-center justify-center text-[#EE4530] shrink-0 mt-0.5">
                    <MapPinIcon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-white/50 mb-1">
                      Office Address
                    </span>
                    <p className="text-sm text-white/90 leading-relaxed font-normal">
                      <strong className="text-white font-medium block">Adspire Media</strong>
                      No. 12/4, Commercial Tech Park, Palani Road,<br />
                      Dindigul – 624 001, Tamil Nadu, India
                    </p>
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <div className="p-4 sm:p-5 rounded-sm bg-white/[0.02] border border-white/[0.08] hover:border-white/20 transition-colors">
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-[#EE4530]/10 border border-[#EE4530]/30 flex items-center justify-center text-[#EE4530] shrink-0">
                    <MailIcon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-white/50 mb-0.5">
                      Email Address
                    </span>
                    <a
                      href="mailto:contact@adspiremedia.com"
                      className="text-sm text-white/95 hover:text-[#EE4530] transition-colors font-medium focus:outline-none focus-visible:underline"
                    >
                      contact@adspiremedia.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Mobile / Phone Card */}
              <div className="p-4 sm:p-5 rounded-sm bg-white/[0.02] border border-white/[0.08] hover:border-white/20 transition-colors">
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-[#EE4530]/10 border border-[#EE4530]/30 flex items-center justify-center text-[#EE4530] shrink-0">
                    <PhoneIcon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-white/50 mb-0.5">
                      Mobile Number
                    </span>
                    <a
                      href="tel:+919876543210"
                      className="text-sm text-white/95 hover:text-[#EE4530] transition-colors font-medium font-mono focus:outline-none focus-visible:underline"
                    >
                      +91 98765 43210
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Form */}
        <div className="lg:col-span-7 flex flex-col will-change-transform">
          <div className="w-full bg-[#0a0a0a] border border-white/[0.10] p-7 sm:p-10 lg:p-12 rounded-sm shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
            <h4 className="text-white font-bold text-[22px] sm:text-[26px] tracking-[-0.025em] mb-7 sm:mb-8">
              Tell Us About Your Project
            </h4>

            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* Field 01 — Name */}
              <div className="flex flex-col space-y-2">
                <label
                  htmlFor="contact-name"
                  className="text-xs font-mono uppercase tracking-[0.16em] text-white/60"
                >
                  Your Name <span className="text-[#EE4530]">*</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                  className="w-full bg-[#121212] border border-white/[0.14] rounded-none px-4 py-3.5 text-white placeholder-white/35 text-[15px] focus:outline-none focus:border-[#EE4530] focus:ring-1 focus:ring-[#EE4530] transition-colors"
                />
              </div>

              {/* Field 02 — Company Name (Optional) */}
              <div className="flex flex-col space-y-2">
                <label
                  htmlFor="contact-company"
                  className="text-xs font-mono uppercase tracking-[0.16em] text-white/60"
                >
                  Company Name <span className="text-white/30 text-[11px] font-sans normal-case">(Optional)</span>
                </label>
                <input
                  id="contact-company"
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Your Company Name"
                  className="w-full bg-[#121212] border border-white/[0.14] rounded-none px-4 py-3.5 text-white placeholder-white/35 text-[15px] focus:outline-none focus:border-[#EE4530] focus:ring-1 focus:ring-[#EE4530] transition-colors"
                />
              </div>

              {/* Field 03 — Phone Number */}
              <div className="flex flex-col space-y-2">
                <label
                  htmlFor="contact-phone"
                  className="text-xs font-mono uppercase tracking-[0.16em] text-white/60"
                >
                  Phone Number <span className="text-[#EE4530]">*</span>
                </label>
                <input
                  id="contact-phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Your Phone Number"
                  required
                  className="w-full bg-[#121212] border border-white/[0.14] rounded-none px-4 py-3.5 text-white placeholder-white/35 text-[15px] focus:outline-none focus:border-[#EE4530] focus:ring-1 focus:ring-[#EE4530] transition-colors"
                />
              </div>

              {/* Field 04 — Email Address */}
              <div className="flex flex-col space-y-2">
                <label
                  htmlFor="contact-email"
                  className="text-xs font-mono uppercase tracking-[0.16em] text-white/60"
                >
                  Email Address <span className="text-[#EE4530]">*</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email Address"
                  required
                  className="w-full bg-[#121212] border border-white/[0.14] rounded-none px-4 py-3.5 text-white placeholder-white/35 text-[15px] focus:outline-none focus:border-[#EE4530] focus:ring-1 focus:ring-[#EE4530] transition-colors"
                />
              </div>

              {/* Field 05 — What Can We Help With? (Select Field) */}
              <div className="flex flex-col space-y-2 pt-2">
                <label
                  htmlFor="contact-service"
                  className="text-xs font-mono uppercase tracking-[0.16em] text-white/60"
                >
                  What Can We Help With?
                </label>
                <div className="relative">
                  <select
                    id="contact-service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full bg-[#121212] border border-white/[0.14] rounded-none px-4 py-3.5 text-white placeholder-white/35 text-[15px] focus:outline-none focus:border-[#EE4530] focus:ring-1 focus:ring-[#EE4530] transition-colors appearance-none cursor-pointer pr-10"
                  >
                    <option value="" className="bg-[#121212] text-white/40">
                      Select a service...
                    </option>
                    {SERVICE_OPTIONS.map((service) => (
                      <option
                        key={service}
                        value={service}
                        className="bg-[#181818] text-white py-2"
                      >
                        {service}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white/50">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Field 06 — Project Requirement */}
              <div className="flex flex-col space-y-2 pt-2">
                <label
                  htmlFor="contact-requirement"
                  className="text-xs font-mono uppercase tracking-[0.16em] text-white/60"
                >
                  Project Requirement <span className="text-[#EE4530]">*</span>
                </label>
                <textarea
                  id="contact-requirement"
                  name="requirement"
                  value={formData.requirement}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell us about your project, goals and requirements..."
                  required
                  className="w-full bg-[#121212] border border-white/[0.14] rounded-none px-4 py-3.5 text-white placeholder-white/35 text-[15px] focus:outline-none focus:border-[#EE4530] focus:ring-1 focus:ring-[#EE4530] transition-colors resize-y"
                />
              </div>

              {/* Feedback Status Notice */}
              {statusMessage.text && (
                <div
                  className={`p-4 text-sm font-medium border ${
                    statusMessage.type === "success"
                      ? "bg-[#EE4530]/10 border-[#EE4530] text-white"
                      : "bg-red-950/40 border-red-500/60 text-red-200"
                  }`}
                  role="alert"
                >
                  {statusMessage.text}
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#EE4530] text-white font-semibold text-[15px] tracking-wide uppercase transition-all duration-300 hover:bg-[#d63d29] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EE4530] focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed select-none"
                >
                  <span>{isSubmitting ? "SENDING..." : "SEND ENQUIRY"}</span>
                  <span className="transform transition-transform duration-300 group-hover:translate-x-1 font-bold">
                    →
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactForm;