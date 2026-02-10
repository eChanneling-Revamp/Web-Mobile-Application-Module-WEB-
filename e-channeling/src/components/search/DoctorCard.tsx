"use client";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { type Doctor } from "@/store/search/searchSlice";

// Doctor Card Skeleton Component
export const DoctorCardSkeleton = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
        <div className="w-full h-40 bg-gray-300" />
        <div className="p-4 space-y-3">
            <div className="h-5 bg-gray-300 rounded w-3/4" />
            <div className="h-4 bg-gray-300 rounded w-1/2" />
            <div className="h-4 bg-gray-300 rounded w-2/3" />
            <div className="h-4 bg-gray-300 rounded w-1/3" />
            <div className="flex gap-2 mt-4">
                <div className="h-9 bg-gray-300 rounded flex-1" />
                <div className="h-9 bg-gray-300 rounded flex-1" />
            </div>
        </div>
    </div>
);

export const DoctorCard = ({ doctor }: { doctor: Doctor }) => {
    const router = useRouter();

    const hospitalNames = useMemo(() => {
        if (doctor.doctor_hospitals && Array.isArray(doctor.doctor_hospitals)) {
            return doctor.doctor_hospitals
                .map((dh) => dh?.hospitals?.name)
                .filter(Boolean) as string[];
        }
        return [];
    }, [doctor]);

    // const hospital = hospitalNames[0] || "";
    // const params = new URLSearchParams({
    //     doctorId: doctor.id,
    //     doctorName: doctor.name || "",
    //     specialization: doctor.specialization || "",
    //     hospitals: JSON.stringify(hospitalNames),
    //     fee: doctor.consultationFee || "0",
    // });

    const handleBook = () => {
        router.push(`/booking/${doctor.id}`);
    };

    const handleInfo = () => {
        router.push(`/doctor/${doctor.id}`);
    };

    const imageUrl = doctor.profileImage || "/sample-doctor.png";

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div className="relative w-full h-40 bg-gray-100">
                <Image
                    src={imageUrl}
                    alt={doctor.name || "/doctor.jpg"}
                    fill
                    className="object-cover object-top"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/sample-doctor.png";
                    }}
                />
            </div>
            <div className="p-4">
                <h3 className="font-semibold text-[16px]    text-gray-800 mb-1 line-clamp-1">
                    {doctor.name}
                </h3>
                <p className="text-sm  text-emerald-700 font-medium mb-2">
                    {doctor.specialization}
                </p>
                <p className="text-[13px]   text-gray-600 mb-2 line-clamp-1">
                    {hospitalNames.length > 0
                        ? hospitalNames.join(", ")
                        : "No hospitals"}
                </p>
                <p className="text-sm font-semibold text-green-600 mb-4">
                    LKR{" "}
                    {parseInt(doctor.consultationFee || "0").toLocaleString()}
                </p>
                <div className="flex gap-2">
                    <button
                        onClick={handleBook}
                        className="flex-1 h-9 px-4 rounded-md bg-green-500 hover:bg-green-600 text-white text-sm font-semibold cursor-pointer transition-colors"
                    >
                        Book
                    </button>
                    <button
                        onClick={handleInfo}
                        className="flex-1 h-9 px-4 rounded-md border border-gray-400 text-sm bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                        Info
                    </button>
                </div>
            </div>
        </div>
    );
};
