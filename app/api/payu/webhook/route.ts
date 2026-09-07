import { NextRequest, NextResponse } from "next/server";

import {
  getConfiguredCourseAmountPaise,
  payUPaymentIsActiveSuccess,
  payUPaymentMatchesCourse,
  verifyPayUPayment,
  verifyPayUResponseHash,
  type PayUResponseParams,
} from "@/lib/payu";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function readWebhookParams(request: NextRequest) {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const body = await request.json().catch(() => ({}));
    return Object.fromEntries(Object.entries(body).map(([key, value]) => [key, String(value ?? "")])) as PayUResponseParams;
  }

  const form = await request.formData();
  const params: PayUResponseParams = {};
  form.forEach((value, key) => {
    params[key] = String(value);
  });
  return params;
}

export async function POST(request: NextRequest) {
  try {
    const params = await readWebhookParams(request);
    const txnid = String(params.txnid || "");

    // Same PayU merchant may also be used by Shopify. Never process those here.
    if (!txnid.startsWith("YTC_")) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    if (!params.hash || !verifyPayUResponseHash(params)) {
      console.warn("PAYU_WEBHOOK_INVALID_HASH", { txnid });
      return NextResponse.json({ ok: true });
    }

    const payment = await verifyPayUPayment(txnid);
    const coursePayment = payUPaymentMatchesCourse(payment, {
      txnid,
      amount: getConfiguredCourseAmountPaise(),
    });
    const active = payUPaymentIsActiveSuccess(payment);

    console.info("PAYU_WEBHOOK_VERIFIED", {
      txnid,
      coursePayment,
      active,
      status: payment.status,
      unmappedstatus: payment.unmappedstatus,
    });

    // This no-database build does not grant access from a webhook because a webhook
    // has no browser to receive the device-specific HttpOnly cookie. Immediate access
    // is granted only by the verified browser callback.
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("PAYU_WEBHOOK_FAILED", error instanceof Error ? error.message : error);
    // Always acknowledge PayU to avoid repeated delivery storms. Access is never
    // granted on webhook errors.
    return NextResponse.json({ ok: true });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, service: "payu-course-webhook" });
}
