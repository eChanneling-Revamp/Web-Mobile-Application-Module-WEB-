import prisma from "@/lib/db/prisma";
import { rateLimit } from "@/lib/utils/rateLimit";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        // rate limiting
        const forwarded = request.headers.get("x-forwarded-for");
        const ip = forwarded ? forwarded.split(",")[0] : "unknown";

        const isAllowed = await rateLimit(`getDoctorById:${ip}`, 30);
        if (!isAllowed) {
            return NextResponse.json(
                { error: "Too many attempts. Please try again later." },
                { status: 429 }
            );
        }

        const hospitals = await prisma.hospitals.findMany({
            orderBy: {
                name: 'asc',
            },
        });

        const sanitizedHospitals = hospitals.map((hospital) => {
            return {
                id: hospital.id,
                name: hospital.name
            }
        })

        return NextResponse.json({
            success: true,
            data: sanitizedHospitals,
        });

    } catch (error: any) {
        console.log(error);
        return NextResponse.json(
            { message: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
