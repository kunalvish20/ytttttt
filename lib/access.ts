import crypto from "node:crypto";

export const ACCESS_COOKIE = "gaming_course_access";
export const DEVICE_COOKIE = "gaming_course_device";
export const COURSE_SLUG = "youtube-gaming-blueprint";

export type CourseAccessToken = {
  v: 2;
  course: typeof COURSE_SLUG;
  orderId: string;
  paymentId: string;
  amount: number;
  currency: "INR";
  deviceId: string;
  issuedAt: number;
  expiresAt: number;
};

export function assertAccessConfigured() {
  accessSecret();
}

function accessSecret() {
  const value = process.env.COURSE_ACCESS_SECRET;
  if (!value || value.trim().length < 32) {
    throw new Error("COURSE_ACCESS_SECRET must be configured with at least 32 characters.");
  }
  return value;
}

function sign(payload: string) {
  return crypto.createHmac("sha256", accessSecret()).update(payload).digest("base64url");
}

export function createSignedToken(data: Record<string, unknown>) {
  const payload = Buffer.from(JSON.stringify(data), "utf8").toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function readSignedToken<T extends { expiresAt?: number }>(token?: string | null): T | null {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payload, signature] = parts;
  if (!payload || !signature) return null;

  const expected = sign(payload);
  const actualBuffer = Buffer.from(signature, "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");
  if (actualBuffer.length !== expectedBuffer.length) return null;
  if (!crypto.timingSafeEqual(actualBuffer, expectedBuffer)) return null;

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as T;
    if (typeof parsed.expiresAt === "number" && parsed.expiresAt <= Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function createDeviceId() {
  return crypto.randomBytes(24).toString("base64url");
}

export function createCheckoutStateSignature(input: {
  txnid: string;
  course: string;
  amountPaise: number;
  nonce: string;
  deviceId: string;
}) {
  return crypto
    .createHmac("sha256", accessSecret())
    .update(`${input.txnid}|${input.course}|${input.amountPaise}|${input.nonce}|${input.deviceId}`)
    .digest("hex");
}

export function verifyCheckoutStateSignature(input: {
  txnid: string;
  course: string;
  amountPaise: number;
  nonce: string;
  deviceId: string;
  signature: string;
}) {
  if (!input.signature) return false;
  const expected = createCheckoutStateSignature(input);
  const left = Buffer.from(input.signature.toLowerCase(), "utf8");
  const right = Buffer.from(expected.toLowerCase(), "utf8");
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}
