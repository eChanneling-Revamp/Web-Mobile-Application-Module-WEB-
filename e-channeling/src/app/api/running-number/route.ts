import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/utils/rateLimit";
import { runningNumberQuerySchema } from "@/validations/running-number/running-number.schema";
import { getRunningNumbersByPhone } from "@/services/running-number/running-number.service";

export async function GET(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const allowed = await rateLimit(`getRunningNumbersByPhone:${ip}`, 10);
    if (!allowed) {
      return NextResponse.json(
        { success: false, message: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone") || "";

    const parsed = runningNumberQuerySchema.safeParse({ phone });
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: parsed.error.issues[0]?.message || "Invalid phone number",
        },
        { status: 400 }
      );
    }

    const data = await getRunningNumbersByPhone(parsed.data.phone);

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
