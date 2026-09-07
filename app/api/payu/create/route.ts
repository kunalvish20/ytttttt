import { NextResponse } from "next/server";

import { assertAccessConfigured } from "@/lib/access";
import { createPayUCheckoutFields, getPayUEndpoints } from "@/lib/payu";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function cleanName(value: unknown) {
  return String(value ?? "").trim().replace(/[|\r\n\t]+/g, " ").replace(/\s+/g, " ").slice(0, 60);
}

function cleanEmail(value: unknown) {
  return String(value ?? "").trim().toLowerCase().slice(0, 120);
}

function cleanPhone(value: unknown) {
  return String(value ?? "").replace(/\D/g, "").slice(0, 15);
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");
    if (origin && host && new URL(origin).host !== host) {
      return NextResponse.json({ error: "Cross-site payment request blocked." }, { status: 403 });
    }

    assertAccessConfigured();

    const body = await request.json().catch(() => ({}));
    const firstname = cleanName(body.firstname);
    const email = cleanEmail(body.email);
    const phone = cleanPhone(body.phone);

    if (firstname.length < 2) {
      return NextResponse.json({ error: "Enter your full name." }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }
    if (phone.length < 10) {
      return NextResponse.json({ error: "Enter a valid phone number." }, { status: 400 });
    }

    const { fields } = createPayUCheckoutFields({ firstname, email, phone });

    const response = NextResponse.json({
      action: getPayUEndpoints().checkout,
      method: "POST",
      fields,
    });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error) {
    console.error("PAYU_CREATE_FAILED", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to start PayU checkout." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
