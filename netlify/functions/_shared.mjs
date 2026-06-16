// Shared helpers for the PayChangu Netlify Functions.
// Files prefixed with "_" are not deployed as standalone functions.

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Signature",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export function getEnv(name) {
  return globalThis.Netlify?.env?.get(name) || process.env[name] || "";
}

export function json(data, status = 200) {
  return Response.json(data, { status, headers: CORS });
}

// Append/upsert a booking row in Google Sheets via an Apps Script web app.
// No-ops (returns {skipped:true}) until SHEETS_WEBHOOK_URL is configured.
export async function logBooking(fields) {
  const url = getEnv("SHEETS_WEBHOOK_URL");
  if (!url) return { skipped: true };
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: getEnv("SHEETS_TOKEN"), ...fields }),
    });
    return { ok: res.ok };
  } catch (err) {
    console.error("logBooking failed:", err);
    return { ok: false, error: String(err) };
  }
}

// Send an email through Resend. No-ops until RESEND_API_KEY + MAIL_FROM are set.
export async function sendEmail({ to, subject, html, replyTo }) {
  const key = getEnv("RESEND_API_KEY");
  const from = getEnv("MAIL_FROM");
  if (!key || !from || !to) return { skipped: true };
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, html, reply_to: replyTo }),
    });
    return { ok: res.ok };
  } catch (err) {
    console.error("sendEmail failed:", err);
    return { ok: false, error: String(err) };
  }
}

// Send a WhatsApp alert to the lab via CallMeBot (free, unofficial).
// No-ops until CALLMEBOT_PHONE + CALLMEBOT_APIKEY are set.
export async function sendLabWhatsApp(text) {
  const phone = getEnv("CALLMEBOT_PHONE");
  const apikey = getEnv("CALLMEBOT_APIKEY");
  if (!phone || !apikey) return { skipped: true };
  try {
    const url =
      "https://api.callmebot.com/whatsapp.php" +
      `?phone=${encodeURIComponent(phone)}` +
      `&text=${encodeURIComponent(text)}` +
      `&apikey=${encodeURIComponent(apikey)}`;
    const res = await fetch(url);
    return { ok: res.ok };
  } catch (err) {
    console.error("sendLabWhatsApp failed:", err);
    return { ok: false, error: String(err) };
  }
}

// Money/labels helpers
export function formatMoney(amount, currency = "MWK") {
  const n = Number(amount);
  return `${currency} ${Number.isFinite(n) ? n.toLocaleString("en-US") : amount}`;
}

export function escapeHtml(str) {
  return String(str || "").replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}
