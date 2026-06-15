const PAYCHANGU_PAYMENT_URL = "https://api.paychangu.com/payment";

function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
    },
  });
}

function getEnv(name) {
  return globalThis.Netlify?.env?.get(name) || "";
}

function getBaseUrl(req) {
  const configuredUrl = getEnv("SITE_URL");
  if (configuredUrl) return configuredUrl.replace(/\/$/, "");

  const origin = req.headers.get("origin");
  if (origin) return origin.replace(/\/$/, "");

  const host = req.headers.get("host");
  return host ? `https://${host}` : "";
}

export default async (req) => {
  if (req.method === "OPTIONS") {
    return json({});
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const secretKey = getEnv("PAYCHANGU_SECRET_KEY");
  if (!secretKey) {
    return json({ error: "PayChangu is not configured yet." }, 500);
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid payment request." }, 400);
  }

  const amount = Number(body.amount);
  const email = String(body.email || "").trim();
  const firstName = String(body.first_name || "").trim();
  const lastName = String(body.last_name || "").trim();
  const service = String(body.service || "Future-Life Diagnostics service").trim();

  if (!Number.isFinite(amount) || amount < 100) {
    return json({ error: "Enter a valid amount of at least MWK 100." }, 400);
  }

  if (!email || !firstName) {
    return json({ error: "First name and email are required." }, 400);
  }

  const baseUrl = getBaseUrl(req);
  const txRef = `FLDX-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const payload = {
    amount,
    currency: getEnv("PAYCHANGU_CURRENCY") || "MWK",
    email,
    first_name: firstName,
    last_name: lastName,
    callback_url: `${baseUrl}/pay-success.html`,
    return_url: `${baseUrl}/pay-failed.html`,
    tx_ref: txRef,
    customization: {
      title: "Future-Life Diagnostics",
      description: service,
    },
    meta: {
      service,
      source: "website",
    },
  };

  const paychanguResponse = await fetch(PAYCHANGU_PAYMENT_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${secretKey}`,
    },
    body: JSON.stringify(payload),
  });

  const result = await paychanguResponse.json().catch(() => ({}));
  if (!paychanguResponse.ok || result.status !== "success") {
    return json(
      { error: result.message || "PayChangu could not create the checkout session." },
      502,
    );
  }

  return json({
    checkout_url: result.data?.checkout_url,
    tx_ref: result.data?.data?.tx_ref || txRef,
  });
};

export const config = {
  path: "/api/paychangu/create-payment",
};
