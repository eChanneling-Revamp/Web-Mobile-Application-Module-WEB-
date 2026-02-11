import prisma from "@/lib/db/prisma";
import { rateLimit } from "@/lib/utils/rateLimit";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        // rate limiting
        const forwarded = request.headers.get("x-forwarded-for");
        const ip = forwarded ? forwarded.split(",")[0] : "unknown";

        const isAllowed = await rateLimit(`search:${ip}`, 100);
        if (!isAllowed) {
            return NextResponse.json(
                {
                    error: "Too many search attempts. Please try again later.",
                },
                { status: 429 },
            );
        }

        const { searchParams } = new URL(request.url);

        const keyword = searchParams.get("keyword") || undefined;
        const specialtyId = searchParams.get("specialtyId") || undefined;
        const hospitalId = searchParams.get("hospitalId") || undefined;
        const district = searchParams.get("district") || undefined;
        const hospitalType = searchParams.get("hospitalType") || undefined;
        const date = searchParams.get("date") || undefined;
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "12");

        // Build where clause dynamically
        const whereClause: any = {
            isActive: true,
            status: "APPROVED",
        };

        if (keyword) {
            whereClause.OR = [
                {
                    name: { contains: keyword, mode: "insensitive" },
                },
                {
                    specialization: { contains: keyword, mode: "insensitive" },
                },
                {
                    hospitals: {
                        some: {
                            hospital: {
                                name: {
                                    contains: keyword,
                                    mode: "insensitive",
                                },
                            },
                        },
                    },
                },
            ];
        }

        if (specialtyId) {
            const specialtySearch = specialtyId.split(" ")[0];
            whereClause.specialization = {
                contains: specialtySearch,
                mode: "insensitive",
            };
        }

        if (hospitalId) {
            whereClause.hospitalId = {
                has: hospitalId,
            };
        }

        if (district || hospitalType) {
            const hospitalFilter: any = {
                isActive: true,
                status: "APPROVED",
            };

            if (district) {
                hospitalFilter.district = {
                    equals: district,
                    mode: "insensitive",
                };
            }

            if (hospitalType) {
                hospitalFilter.hospitalType = {
                    equals: hospitalType,
                    mode: "insensitive",
                };
            }

            whereClause.hospitals = {
                some: {
                    isActive: true,
                    hospital: hospitalFilter,
                },
            };
        }

        // Calculate date range once if date filter is provided
        // Use UTC to avoid timezone offset issues
        let startOfDay, endOfDay;
        if (date) {
            // Append UTC time to ensure correct date interpretation
            startOfDay = new Date(date + "T00:00:00.000Z");
            endOfDay = new Date(date + "T23:59:59.999Z");

            whereClause.sessions = {
                some: {
                    scheduledAt: {
                        gte: startOfDay,
                        lte: endOfDay,
                    },
                    status: "SCHEDULED",
                },
            };
        }

        // get the total count of the doctors matching the criteria
        const totalCount = await prisma.doctor.count({
            where: whereClause,
        });

        const skip = (page - 1) * limit;
        const totalPages = Math.ceil(totalCount / limit);

        // ----- if getting errors in search doctors endpoint check this query -----
        // i change "include doctor_hospitals" to hospitals
        const doctors = await prisma.doctor.findMany({
            where: whereClause,
            include: {
                hospitals: {
                    where: { isActive: true },
                    include: {
                        hospital: true,
                    },
                },
                sessions: date // if date is provided return only the session for that date
                    ? {
                          where: {
                              scheduledAt: {
                                  gte: startOfDay,
                                  lte: endOfDay,
                              },
                              status: "SCHEDULED",
                          },
                          include: {
                              hospitals: true,
                          },
                      }
                    : false,
            },
            skip: skip,
            take: limit,
        });

        return NextResponse.json(
            {
                success: true,
                data: doctors,
                count: totalCount,
                page: page,
                totalPages: totalPages,
            },
            { status: 200 },
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {
                success: false,
                message: "Internal Server Error",
                error:
                    error instanceof Error
                        ? error.message
                        : "Unknown error occurred",
            },
            { status: 500 },
        );
    }
}
