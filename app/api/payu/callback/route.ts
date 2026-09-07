import { NextRequest, NextResponse } from "next/server";

import {
  ACCESS_COOKIE,
  COURSE_SLUG,
  DEVICE_COOKIE,
  createSignedToken,
  type CourseAccessToken,
} from "@/lib/access";
import {
  getSiteUrl,
  payUPaymentIsActiveSuccess,
  payUPaymentMatchesCourse,
  verifyPayUCheckoutState,
  verifyPayUPayment,
  verifyPayUResponseHash,
  type PayUResponseParams,
} from "@/lib/payu";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ACCESS_DAYS = 395;

type VerifiedPayment = Awaited<ReturnType<typeof verifyPayUPayment>>;

async function readFormParams(request: NextRequest) {
  const form = await request.formData();
  const params: PayUResponseParams = {};
  form.forEach((value, key) => {
    params[key] = String(value);
  });
  return params;
}

function redirectTo(path: string) {
  return NextResponse.redirect(new URL(path, getSiteUrl()), { status: 303 });
}

async function verifySuccessfulPaymentWithRetry(txnid: string, amountPaise: number) {
  let lastError: unknown = null;
  let lastPayment: VerifiedPayment | null = null;

  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const payment = await verifyPayUPayment(txnid);
      lastPayment = payment;
      if (payUPaymentMatchesCourse(payment, { txnid, amount: amountPaise }) && payUPaymentIsActiveSuccess(payment)) {
        return payment;
      }
    } catch (error) {
      lastError = error;
    }

    if (attempt < 3) {
      await new Promise((resolve) => setTimeout(resolve, 700 * (attempt + 1)));
    }
  }

  if (lastPayment) return lastPayment;
  throw lastError instanceof Error ? lastError : new Error("PayU payment verification did not complete.");
}

function clearAccess(response: NextResponse) {
  response.cookies.set(ACCESS_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  response.cookies.set(DEVICE_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}

export async function POST(request: NextRequest) {
  let txnid = "";
  try {
    const params = await readFormParams(request);
    txnid = String(params.txnid || "");
    console.info("PAYU_CALLBACK_RECEIVED", { txnid, status: params.status, amount: params.amount });

    if (!verifyPayUResponseHash(params)) {
      console.warn("PAYU_INVALID_HASH", { txnid });
      return clearAccess(redirectTo("/buy?payment=tampered"));
    }

    const state = verifyPayUCheckoutState(params);
    if (!state) {
      console.warn("PAYU_INVALID_CHECKOUT_STATE", { txnid });
      return clearAccess(redirectTo("/buy?payment=failed"));
    }

    if (String(params.status || "").toLowerCase() !== "success") {
      console.warn("PAYU_PAYMENT_NOT_SUCCESS", { txnid, status: params.status });
      return clearAccess(redirectTo("/buy?payment=failed"));
    }

    const payment = await verifySuccessfulPaymentWithRetry(txnid, state.amountPaise);
    if (!payUPaymentMatchesCourse(payment, { txnid, amount: state.amountPaise })) {
      console.warn("PAYU_PAYMENT_MISMATCH", { txnid, status: payment.status, amount: payment.amount });
      return clearAccess(redirectTo("/buy?payment=unverified"));
    }

    if (!payUPaymentIsActiveSuccess(payment)) {
      console.warn("PAYU_VERIFY_FAILED", { txnid, status: payment.status, unmappedstatus: payment.unmappedstatus });
      return clearAccess(redirectTo("/buy?payment=unverified"));
    }

    const now = Date.now();
    const access: CourseAccessToken = {
      v: 2,
      course: COURSE_SLUG,
      orderId: txnid,
      paymentId: payment.mihpayid || txnid,
      amount: state.amountPaise,
      currency: "INR",
      deviceId: state.deviceId,
      issuedAt: now,
      expiresAt: now + ACCESS_DAYS * 24 * 60 * 60 * 1000,
    };

    const response = redirectTo("/opencourse?payment=success");
    response.cookies.set(ACCESS_COOKIE, createSignedToken(access), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: ACCESS_DAYS * 24 * 60 * 60,
    });
    response.cookies.set(DEVICE_COOKIE, state.deviceId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: ACCESS_DAYS * 24 * 60 * 60,
    });
    response.headers.set("Cache-Control", "no-store");
    console.info("PAYU_ACCESS_GRANTED", { txnid, status: payment.status, amount: payment.amount });
    return response;
  } catch (error) {
    console.error("PAYU_CALLBACK_FAILED", { txnid, error: error instanceof Error ? error.message : "unknown" });
    return clearAccess(redirectTo("/buy?payment=error"));
  }
}

export async function GET() {
  return redirectTo("/buy");
}
