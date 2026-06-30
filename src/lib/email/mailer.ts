import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "SmartTour <onboarding@resend.dev>";

export async function sendBookingConfirmation({
  to,
  fullName,
  propertyName,
  unitNumber,
  scheduledAt,
  publicToken,
}: {
  to: string;
  fullName: string;
  propertyName: string;
  unitNumber: string;
  scheduledAt: Date;
  publicToken: string;
}) {
  const scheduledStr = new Date(scheduledAt).toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "short",
  });
  const confirmationUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/tours/confirmation/${publicToken}`;

  await resend.emails.send({
    from: FROM,
    to,
    subject: "Your SmartTour request is received",
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#1e293b">
        <div style="margin-bottom:24px">
          <span style="background:#4f46e5;color:#fff;font-size:13px;font-weight:700;padding:6px 12px;border-radius:8px">SmartTour</span>
        </div>
        <h1 style="font-size:22px;font-weight:700;margin:0 0 8px">Booking received, ${fullName.split(" ")[0]}!</h1>
        <p style="color:#64748b;margin:0 0 24px">Your tour request is pending manager approval. We'll send you another email once it's confirmed.</p>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:24px">
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="color:#64748b;padding:6px 0">Property</td><td style="text-align:right;font-weight:600">${propertyName}</td></tr>
            <tr><td style="color:#64748b;padding:6px 0">Unit</td><td style="text-align:right;font-weight:600">Unit ${unitNumber}</td></tr>
            <tr><td style="color:#64748b;padding:6px 0">Scheduled</td><td style="text-align:right;font-weight:600">${scheduledStr}</td></tr>
          </table>
        </div>
        <a href="${confirmationUrl}" style="display:inline-block;background:#4f46e5;color:#fff;font-weight:600;font-size:14px;padding:12px 24px;border-radius:8px;text-decoration:none">Check booking status</a>
        <p style="color:#94a3b8;font-size:12px;margin-top:32px">SmartTour — Self-Guided Apartment Tours</p>
      </div>
    `,
  });
}

export async function sendApprovalConfirmation({
  to,
  fullName,
  propertyName,
  unitNumber,
  scheduledAt,
  accessCode,
  publicToken,
}: {
  to: string;
  fullName: string;
  propertyName: string;
  unitNumber: string;
  scheduledAt: Date;
  accessCode: string;
  publicToken: string;
}) {
  const scheduledStr = new Date(scheduledAt).toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "short",
  });
  const confirmationUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/tours/confirmation/${publicToken}`;

  await resend.emails.send({
    from: FROM,
    to,
    subject: "Your SmartTour is approved — here's your access code",
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;color:#1e293b">
        <div style="margin-bottom:24px">
          <span style="background:#4f46e5;color:#fff;font-size:13px;font-weight:700;padding:6px 12px;border-radius:8px">SmartTour</span>
        </div>
        <h1 style="font-size:22px;font-weight:700;margin:0 0 8px">Tour approved, ${fullName.split(" ")[0]}! 🎉</h1>
        <p style="color:#64748b;margin:0 0 24px">Your self-guided tour has been approved. Use the access code below to enter the property at your scheduled time.</p>
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px">
          <p style="color:#15803d;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 8px">Your Access Code</p>
          <p style="font-family:monospace;font-size:36px;font-weight:700;letter-spacing:0.2em;color:#14532d;margin:0">${accessCode}</p>
        </div>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:24px">
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="color:#64748b;padding:6px 0">Property</td><td style="text-align:right;font-weight:600">${propertyName}</td></tr>
            <tr><td style="color:#64748b;padding:6px 0">Unit</td><td style="text-align:right;font-weight:600">Unit ${unitNumber}</td></tr>
            <tr><td style="color:#64748b;padding:6px 0">Scheduled</td><td style="text-align:right;font-weight:600">${scheduledStr}</td></tr>
          </table>
        </div>
        <a href="${confirmationUrl}" style="display:inline-block;background:#4f46e5;color:#fff;font-weight:600;font-size:14px;padding:12px 24px;border-radius:8px;text-decoration:none">View confirmation page</a>
        <p style="color:#94a3b8;font-size:12px;margin-top:32px">SmartTour — Self-Guided Apartment Tours</p>
      </div>
    `,
  });
}
