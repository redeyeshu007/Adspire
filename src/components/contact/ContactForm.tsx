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
          <div className="mt-10 sm:mt-14 pt-8 border-t border-white/[0.10] flex flex-col space-y-4 text-sm text-white/60">
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