"use client";

import { FormEvent, useState } from "react";

type PayUCreateResponse = {
  action?: string;
  method?: "POST";
  fields?: Record<string, string>;
  error?: string;
};

function submitPayUForm(action: string, fields: Record<string, string>) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = action;
  form.style.display = "none";

  Object.entries(fields).forEach(([name, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
}

export default function CheckoutButton({ courseName, priceLabel }: { courseName: string; priceLabel: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function startCheckout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      firstname: String(formData.get("firstname") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
    };

    try {
      const response = await fetch("/api/payu/create", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      });
      const data = await response.json().catch(() => ({})) as PayUCreateResponse;
      if (!response.ok || !data.action || !data.fields) {
        throw new Error(data.error || "Could not create the PayU checkout request.");
      }

      submitPayUForm(data.action, data.fields);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong while opening checkout.");
      setLoading(false);
    }
  }

  return (
    <form className="checkoutCustomerForm" onSubmit={startCheckout}>
      <label>
        <span>Full name</span>
        <input name="firstname" type="text" placeholder="Your name" autoComplete="name" minLength={2} maxLength={60} required />
      </label>
      <label>
        <span>Email address</span>
        <input name="email" type="email" placeholder="you@example.com" autoComplete="email" maxLength={120} required />
      </label>
      <label>
        <span>Phone number</span>
        <input name="phone" type="tel" inputMode="tel" placeholder="98765 43210" autoComplete="tel" minLength={10} maxLength={18} required />
      </label>
      <button className="checkoutButton" disabled={loading} type="submit" aria-label={`Pay ${priceLabel} securely for ${courseName}`}>
        {loading ? "OPENING SECURE CHECKOUT..." : `PAY ${priceLabel} SECURELY →`}
      </button>
      {error ? <p className="checkoutError" role="alert">{error}</p> : null}
    </form>
  );
}
