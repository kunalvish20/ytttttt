import crypto from "node:crypto";

import {
  COURSE_SLUG,
  createCheckoutStateSignature,
  createDeviceId,
  verifyCheckoutStateSignature,
} from "@/lib/access";

export const PAYU_PRODUCT_INFO = COURSE_SLUG;

type PayUEnv = "test" | "live";

export type PayUCustomer = {
  firstname: string;
  email: string;
  phone: string;
};

export type PayUFormFields = {
  key: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  phone: string;
  surl: string;
  furl: string;
  udf1: string;
  udf2: string;
  udf3: string;
  udf4: string;
  udf5: string;
  hash: string;
};

export type PayUResponseParams = Record<string, string>;

export type PayUVerifiedPayment = {
  txnid: string;
  mihpayid: string;
  amount: string;
  amountPaise: number;
  productinfo: string;
  firstname: string;
  email: string;
  phone: string;
  status: string;
  unmappedstatus: string;
  error: string;
  errorMessage: string;
  raw: Record<string, unknown>;
};

function sha512(value: string) {
  return crypto.createHash("sha512").update(value).digest("hex");
}

function timingSafeEqualText(a: string, b: string) {
  const left = Buffer.from(a, "utf8");
  const right = Buffer.from(b, "utf8");
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

export function getPayUCredentials() {
  const key = process.env.PAYU_KEY?.trim();
  const salt = process.env.PAYU_SALT?.trim();
  if (!key || !salt) throw new Error("PAYU_KEY and PAYU_SALT must be configured.");
  return { key, salt };
}

function getPayUEnv(): PayUEnv {
  return process.env.PAYU_ENV?.toLowerCase() === "live" ? "live" : "test";
}

export function getPayUEndpoints() {
  return getPayUEnv() === "live"
    ? {
        checkout: "https://secure.payu.in/_payment",
        verify: "https://info.payu.in/merchant/postservice.php?form=2",
      }
    : {
        checkout: "https://test.payu.in/_payment",
        verify: "https://test.payu.in/merchant/postservice.php?form=2",
      };
}

export function getSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://ytcourse-henna.vercel.app";
  const parsed = new URL(raw);
  return parsed.origin;
}

export function getPayUCallbackUrl() {
  return `${getSiteUrl()}/api/payu/callback`;
}

export function getPayUWebhookUrl() {
  return `${getSiteUrl()}/api/payu/webhook`;
}

export function getConfiguredCourseAmountPaise() {
  const price = Number(process.env.COURSE_PRICE_INR || "1");
  if (!Number.isFinite(price) || price <= 0) throw new Error("COURSE_PRICE_INR must be a positive number.");
  return Math.round(price * 100);
}

export function getConfiguredCourseAmountRupees() {
  return (getConfiguredCourseAmountPaise() / 100).toFixed(2);
}

export function createPayUTxnId() {
  return `YTC_${Date.now()}_${crypto.randomBytes(6).toString("hex").toUpperCase()}`;
}

export function createPayURequestHash(fields: Omit<PayUFormFields, "hash">) {
  const { salt } = getPayUCredentials();
  return sha512([
    fields.key,
    fields.txnid,
    fields.amount,
    fields.productinfo,
    fields.firstname,
    fields.email,
    fields.udf1,
    fields.udf2,
    fields.udf3,
    fields.udf4,
    fields.udf5,
    "",
    "",
    "",
    "",
    "",
    salt,
  ].join("|"));
}

export function createPayUCheckoutFields(customer: PayUCustomer) {
  const { key } = getPayUCredentials();
  const txnid = createPayUTxnId();
  const amountPaise = getConfiguredCourseAmountPaise();
  const nonce = crypto.randomBytes(12).toString("hex");
  const deviceId = createDeviceId();
  const stateSignature = createCheckoutStateSignature({
    txnid,
    course: COURSE_SLUG,
    amountPaise,
    nonce,
    deviceId,
  });

  const fields: Omit<PayUFormFields, "hash"> = {
    key,
    txnid,
    amount: getConfiguredCourseAmountRupees(),
    productinfo: PAYU_PRODUCT_INFO,
    firstname: customer.firstname,
    email: customer.email,
    phone: customer.phone,
    surl: getPayUCallbackUrl(),
    furl: getPayUCallbackUrl(),
    udf1: COURSE_SLUG,
    udf2: String(amountPaise),
    udf3: nonce,
    udf4: stateSignature,
    udf5: deviceId,
  };

  return {
    fields: { ...fields, hash: createPayURequestHash(fields) },
    deviceId,
  };
}

export function verifyPayUResponseHash(params: PayUResponseParams) {
  const { key, salt } = getPayUCredentials();
  const received = params.hash || "";
  if (!received || params.key !== key) return false;

  const values = [
    salt,
    params.status || "",
    "",
    "",
    "",
    "",
    "",
    params.udf5 || "",
    params.udf4 || "",
    params.udf3 || "",
    params.udf2 || "",
    params.udf1 || "",
    params.email || "",
    params.firstname || "",
    params.productinfo || "",
    params.amount || "",
    params.txnid || "",
    params.key || "",
  ];

  const genericHash = sha512(values.join("|"));
  const additionalCharges = params.additional_charges || params.additionalCharges || "";
  const chargedHash = additionalCharges ? sha512([additionalCharges, ...values].join("|")) : "";

  return timingSafeEqualText(genericHash, received) || (!!chargedHash && timingSafeEqualText(chargedHash, received));
}

export function verifyPayUCheckoutState(params: PayUResponseParams) {
  const txnid = String(params.txnid || "");
  const course = String(params.udf1 || "");
  const amountPaise = Number.parseInt(String(params.udf2 || ""), 10);
  const nonce = String(params.udf3 || "");
  const signature = String(params.udf4 || "");
  const deviceId = String(params.udf5 || "");

  if (!txnid.startsWith("YTC_") || course !== COURSE_SLUG) return null;
  if (!Number.isInteger(amountPaise) || amountPaise !== getConfiguredCourseAmountPaise()) return null;
  if (!nonce || nonce.length < 16 || !deviceId || deviceId.length < 20) return null;

  const valid = verifyCheckoutStateSignature({
    txnid,
    course,
    amountPaise,
    nonce,
    deviceId,
    signature,
  });

  return valid ? { txnid, amountPaise, deviceId } : null;
}

function parseAmountPaise(value: unknown) {
  const amount = Number(String(value ?? "0"));
  if (!Number.isFinite(amount)) return 0;
  return Math.round(amount * 100);
}

function normalizePayUPayment(txnid: string, raw: Record<string, unknown>): PayUVerifiedPayment {
  const amount = String(raw.amt ?? raw.amount ?? raw.transaction_amount ?? "0");
  return {
    txnid: String(raw.txnid ?? txnid),
    mihpayid: String(raw.mihpayid ?? raw.payuid ?? ""),
    amount,
    amountPaise: parseAmountPaise(amount),
    productinfo: String(raw.productinfo ?? ""),
    firstname: String(raw.firstname ?? ""),
    email: String(raw.email ?? ""),
    phone: String(raw.phone ?? raw.contact ?? ""),
    status: String(raw.status ?? "").toLowerCase(),
    unmappedstatus: String(raw.unmappedstatus ?? "").toLowerCase(),
    error: String(raw.error ?? raw.error_code ?? "").toLowerCase(),
    errorMessage: String(raw.error_Message ?? raw.error_message ?? ""),
    raw,
  };
}

export async function verifyPayUPayment(txnid: string): Promise<PayUVerifiedPayment> {
  if (!txnid.startsWith("YTC_")) throw new Error("Invalid PayU course transaction ID.");

  const { key, salt } = getPayUCredentials();
  const command = "verify_payment";
  const hash = sha512([key, command, txnid, salt].join("|"));
  const body = new URLSearchParams({ key, command, var1: txnid, hash });
  const response = await fetch(getPayUEndpoints().verify, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });

  const text = await response.text();
  let data: Record<string, unknown> = {};
  try {
    data = JSON.parse(text) as Record<string, unknown>;
  } catch {
    throw new Error("PayU verification returned an invalid response.");
  }

  if (!response.ok) throw new Error("Could not verify payment with PayU.");

  const transactionDetails = data.transaction_details as Record<string, unknown> | undefined;
  const details = transactionDetails?.[txnid] as Record<string, unknown> | undefined;
  if (!details || String(details.status ?? "").toLowerCase() === "not found") {
    throw new Error("PayU transaction was not found.");
  }

  return normalizePayUPayment(txnid, details);
}

export function payUPaymentMatchesCourse(payment: PayUVerifiedPayment, expected: { txnid: string; amount: number }) {
  return (
    payment.txnid === expected.txnid &&
    payment.amountPaise === expected.amount &&
    payment.productinfo === PAYU_PRODUCT_INFO
  );
}

export function payUPaymentIsActiveSuccess(payment: PayUVerifiedPayment) {
  const status = payment.status.toLowerCase();
  const unmappedstatus = payment.unmappedstatus.toLowerCase();
  const error = payment.error.toLowerCase();
  const inactiveStatuses = ["refund", "refunded", "failed", "failure", "dispute", "chargeback", "bounced", "cancelled"];

  if (status !== "success") return false;
  if (inactiveStatuses.some((value) => status.includes(value) || unmappedstatus.includes(value))) return false;
  if (unmappedstatus && !["captured", "success"].includes(unmappedstatus)) return false;
  if (error && !["e000", "0"].includes(error)) return false;
  return true;
}
