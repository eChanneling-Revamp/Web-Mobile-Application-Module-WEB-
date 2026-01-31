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
                { status: 429 }
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
                    doctor_hospitals: {
                        some: {
                            hospitals: {
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
            whereClause.specialization = {
                contains: specialtyId,
                mode: "insensitive",
            };
        }

        if (hospitalId) {
            whereClause.hospitalIds = {
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

            whereClause.doctor_hospitals = {
                some: {
                    isActive: true,
                    hospitals: hospitalFilter,
                },
            };
        }

        // Calculate date range once if date filter is provided
        let startOfDay, endOfDay;
        if (date) {
            const searchDate = new Date(date);
            startOfDay = new Date(searchDate.setHours(0, 0, 0, 0));
            endOfDay = new Date(searchDate.setHours(23, 59, 59, 999));

            whereClause.sessions = {
                some: {
                    scheduledAt: {
                        gte: startOfDay,
                        lte: endOfDay,
                    },
                    status: "scheduled",
                },
            };
        }

        // get the total count of the doctors matching the criteria
        const totalCount = await prisma.doctors.count({
            where: whereClause,
        });

        const skip = (page - 1) * limit;
        const totalPages = Math.ceil(totalCount / limit);

        const doctors = await prisma.doctors.findMany({
            where: whereClause,
            include: {
                doctor_hospitals: {
                    where: { isActive: true },
                    include: {
                        hospitals: true,
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
            { status: 200 }
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
            { status: 500 }
        );
    }
}
