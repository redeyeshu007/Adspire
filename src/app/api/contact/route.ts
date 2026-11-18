import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, company, phone, email, services, requirement } = body;

    // 1. Required Field Validation
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Please provide your name." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // Optional phone validation: if provided, validate format
    if (phone && typeof phone === "string" && phone.trim().length > 0) {
      const digitsOnly = String(phone).replace(/\D/g, "");
      if (
        digitsOnly.length < 7 ||
        digitsOnly.length > 16 ||
        !/^[0-9+\s\-().]+$/.test(phone.trim())
      ) {
        return NextResponse.json(
          { success: false, error: "Please provide a valid phone number." },
          { status: 400 }
        );
      }
    }

    const messageText = requirement || body.message || "";
    if (!messageText || typeof messageText !== "string" || messageText.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Please tell us about your project requirements or message." },
        { status: 400 }
      );
    }

    // 2. Structured enquiry payload
    const enquiry = {
      name: name.trim(),
      company: company ? String(company).trim() : "",
      phone: phone ? phone.trim() : "",
      email: email.trim().toLowerCase(),
      services: Array.isArray(services) ? services : [],
      requirement: messageText.trim(),
      timestamp: new Date().toISOString(),
    };

    // Log structured enquiry to server stdout
    console.log("[Contact Enquiry Received]", JSON.stringify(enquiry, null, 2));

    // Optional email dispatch if environment variables are configured
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      // Production email dispatch ready when RESEND_API_KEY is configured
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            from: "Adspire Web <enquiries@adspire.media>",
            to: [process.env.CONTACT_NOTIFICATION_EMAIL || "contact@adspire.media"],
            subject: `New Project Enquiry: ${enquiry.name} (${enquiry.company || "Individual"})`,
            text: `
Name: ${enquiry.name}
Company: ${enquiry.company || "N/A"}
Phone: ${enquiry.phone}
Email: ${enquiry.email}
Services: ${enquiry.services.join(", ") || "General Inquiry"}
Requirement:
${enquiry.requirement}
            `.trim(),
          }),
        });
      } catch (mailErr) {
        console.warn("[Contact Email Dispatch Warning]", mailErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for reaching out! We have received your project details and will be in touch shortly.",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[Contact API Error]", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong while submitting your enquiry. Please try again." },
      { status: 500 }
    );
  }
}
