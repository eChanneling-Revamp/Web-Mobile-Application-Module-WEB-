import prisma from "@/lib/db/prisma";
import { redis } from "@/lib/db/redis";
import { generateOtp } from "@/lib/otp/generateOtp";
import { getOtpEmailHtml } from "@/lib/otp/getOtpEmailHtml";
import { hashOtp } from "@/lib/otp/hashOtp";
import { rateLimit } from "@/lib/utils/rateLimit";
import { sendEmailOtp } from "@/services/notification/sendEmailOtp";
import { sendSmsOtp } from "@/services/notification/sendSmsOtp";
import { NextResponse } from "next/server";

// Send the OTP
export async function POST(req: Request) {
    try {
        const { phone, email } = await req.json();
        console.log("Request body:", { phone, email });

        if (!phone && !email) {
            return NextResponse.json(
                { error: "phone number or email required !" },
                { status: 400 }
            );
        }

        // if (phone) {
        //     if (phone.length < 9 || phone.length > 13 || !/^\d+$/.test(phone)) {
        //     return NextResponse.json(
        //         {
        //         error: "Phone number must be between 9 and 13 digits and contain only numbers",
        //         },
        //         { status: 400 }
        //     );
        //     }
        // }

        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
            if (!emailRegex.test(email)) {
                return NextResponse.json(
                    { error: "Please enter a valid email address" },
                    { status: 400 }
                );
            }
        }

        const identifier = email || phone;

        const allowed = await rateLimit(identifier);

        if (!allowed) {
            return NextResponse.json(
                { error: "Too many attempts" },
                { status: 429 }
            );
        }

        if (email) {
            const existingEmail = await prisma.users.findUnique({
                where: { email: email },
            });
            if (existingEmail) {
                return NextResponse.json(
                    { error: "Email is already registered" },
                    { status: 400 }
                );
            }
        }

        if (phone) {
            const existingPhone = await prisma.users.findFirst({
                where: { contactNumber: phone },
            });
            if (existingPhone) {
                return NextResponse.json(
                    { error: "Phone number is already registered" },
                    { status: 400 }
                );
            }
        }

        const otp = generateOtp(6);
        const otpHash = hashOtp(otp);

        // Store in Redis with expiration 3 mins
        const seconds = 3 * 60;
        await redis.set(`otp:${identifier}`, otpHash, { ex: seconds });

        if (email) {
            const emailHtml = getOtpEmailHtml(otp);
            await sendEmailOtp(identifier, "E-Channeling Verification", emailHtml);
        }

        // if (phone) {
        //     return NextResponse.json(
        //         { message: "OTP Sent", data: { phone: phone, otp: otp } },
        //         { status: 200 }
        //     );
        // }

        if (phone) {
            await sendSmsOtp(identifier, otp);
        }

        return NextResponse.json(
            { message: "OTP sent successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
