import crypto from "node:crypto";
import {
  getEnv,
  json,
  logBooking,
  sendEmail,
  sendLabWhatsApp,
  formatMoney,
  escapeHtml,
} from "./_shared.mjs";

const PAYCHANGU_VERIFY_URL = "https://api.paychangu.com/verify-payment";

// Verify the webhook is genuinely from PayChangu: HMAC-SHA256 of the raw body
// with your webhook secret must equal the "Signature" header.
function verifySignature(rawBody, signatureHeader, secret) {
  if (!secret) return { ok: true, skipped: true }; // not configured yet
  if (!signatureHeader) return { ok: false };
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(String(signatureHeader));
  return { ok: a.length === b.length && crypto.timingSafeEqual(a, b) };
}

export default async (req) => {
  if (req.method === "OPTIONS") return json({});
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const rawBody = await req.text();

  const sig = verifySignature(
    rawBody,
    req.headers.get("signature") || req.headers.get("Signature"),
    getEnv("PAYCHANGU_WEBHOOK_SECRET"),
  );
  if (!sig.ok) return json({ error: "Invalid signature" }, 401);

  let body;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return json({ error: "Invalid payload" }, 400);
  }

  const txRef =
    body.tx_ref || body.data?.tx_ref || body.reference || body.data?.reference;
  if (!txRef) return json({ error: "Missing tx_ref" }, 400);

  // Never trust the webhook body alone — re-query PayChangu for the truth.
  const secretKey = getEnv("PAYCHANGU_SECRET_KEY");
  let verified = {};
  try {
    const res = await fetch(`${PAYCHANGU_VERIFY_URL}/${encodeURIComponent(txRef)}`, {
      headers: { Accept: "application/json", Authorization: `Bearer ${secretKey}` },
    });
    verified = await res.json().catch(() => ({}));
  } catch (err) {
    console.error("verify-payment failed:", err);
  }

  const d = verified.data || {};
  const paid = (d.status || "").toLowerCase() === "success";

  // Acknowledge non-success events so PayChangu stops retrying.
  if (!paid) {
    console.log(`Webhook for ${txRef}: status=${d.status || "unknown"} (no action)`);
    return json({ received: true });
  }

  const customer = d.customer || {};
  const meta = d.meta || body.meta || body.data?.meta || {};
  const booking = {
    tx_ref: txRef,
    amount: d.amount,
    currency: d.currency || "MWK",
    first_name: customer.first_name || "",
    last_name: customer.last_name || "",
    email: customer.email || "",
    phone: meta.phone || "",
    service: meta.service || "Future-Life Diagnostics service",
    appointment: meta.appointment || "",
  };
  const fullName = `${booking.first_name} ${booking.last_name}`.trim() || "Customer";
  const money = formatMoney(booking.amount, booking.currency);

  // 1) Mark the booking Paid in Google Sheets (upsert by tx_ref).
  await logBooking({
    ...booking,
    status: "Paid",
    paid_at: new Date().toISOString(),
  });

  // 2) Email the lab.
  await sendEmail({
    to: getEnv("LAB_NOTIFY_EMAIL"),
    replyTo: booking.email || undefined,
    subject: `New paid booking — ${booking.service} (${money})`,
    html: `
      <h2>New paid booking</h2>
      <table cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">
        <tr><td><b>Reference</b></td><td>${escapeHtml(txRef)}</td></tr>
        <tr><td><b>Name</b></td><td>${escapeHtml(fullName)}</td></tr>
        <tr><td><b>Service</b></td><td>${escapeHtml(booking.service)}</td></tr>
        <tr><td><b>Preferred appointment</b></td><td>${escapeHtml(booking.appointment || "—")}</td></tr>
        <tr><td><b>Amount</b></td><td>${escapeHtml(money)}</td></tr>
        <tr><td><b>Phone / WhatsApp</b></td><td>${escapeHtml(booking.phone || "—")}</td></tr>
        <tr><td><b>Email</b></td><td>${escapeHtml(booking.email || "—")}</td></tr>
      </table>
      <p style="font-family:Arial,sans-serif;font-size:13px;color:#555">Full records are in your Bookings sheet.</p>`,
  });

  // 3) Email the customer a confirmation/receipt.
  if (booking.email) {
    await sendEmail({
      to: booking.email,
      subject: `Booking confirmed — Future-Life Diagnostics (${txRef})`,
      html: `
        <h2 style="color:#243C6C;font-family:Arial,sans-serif">Thank you, ${escapeHtml(booking.first_name || "")}!</h2>
        <p style="font-family:Arial,sans-serif;font-size:14px">Your payment was received and your booking is confirmed.</p>
        <table cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">
          <tr><td><b>Reference</b></td><td>${escapeHtml(txRef)}</td></tr>
          <tr><td><b>Service</b></td><td>${escapeHtml(booking.service)}</td></tr>
          <tr><td><b>Preferred appointment</b></td><td>${escapeHtml(booking.appointment || "—")}</td></tr>
          <tr><td><b>Amount paid</b></td><td>${escapeHtml(money)}</td></tr>
        </table>
        <p style="font-family:Arial,sans-serif;font-size:14px">Our team will contact you to confirm your appointment time. Questions? WhatsApp us on +265 980 855 554.</p>
        <p style="font-family:Arial,sans-serif;font-size:13px;color:#60B43C;font-style:italic">"A Healthy Life Brings Happiness"</p>`,
    });
  }

  // 4) WhatsApp alert to the lab.
  await sendLabWhatsApp(
    `🟢 New PAID booking\n` +
    `Ref: ${txRef}\n` +
    `Name: ${fullName}\n` +
    `Service: ${booking.service}\n` +
    `Appt: ${booking.appointment || "—"}\n` +
    `Phone: ${booking.phone || "—"}\n` +
    `Amount: ${money}`,
  );

  return json({ received: true });
};

export const config = {
  path: "/api/paychangu/webhook",
};
