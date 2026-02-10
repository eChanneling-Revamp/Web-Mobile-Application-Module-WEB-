"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";

import { AppDispatch, RootState } from "@/store";
import { fetchDoctorDetails } from "@/store/doctor/doctorSlice";
import {
    Star,
    MapPin,
    Phone,
    Mail,
    Building2,
    CalendarDays,
    Languages,
    BadgeCheck,
    ArrowLeft,
    Briefcase,
    Stethoscope,
    BadgeDollarSign,
} from "lucide-react";
import DoctorLoading from "@/components/doctor/loading";

export default function DoctorProfilePage() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const params = useParams();

    const doctorId = params?.id as string;

    const { selectedDoctor, loading, error } = useSelector(
        (state: RootState) => state.doctor,
    );

    useEffect(() => {
        if (doctorId) dispatch(fetchDoctorDetails(doctorId));
    }, [doctorId, dispatch]);

    if (loading || (!selectedDoctor && !error)) {
        return <DoctorLoading />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#e7e9f0]">
                <section className="mx-auto max-w-[1200px] px-6 lg:px-8 pt-8 pb-10">
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-sm">
                        <p className="text-red-700 font-medium">{error}</p>
                    </div>
                </section>
            </div>
        );
    }

    if (!selectedDoctor) {
        return (
            <div className="min-h-screen bg-[#e7e9f0]">
                <section className="mx-auto max-w-[1200px] px-6 lg:px-8 pt-8 pb-10">
                    <div className="bg-white rounded-2xl shadow-md p-8">
                        <p className="text-gray-700">No doctor data found.</p>
                    </div>
                </section>
            </div>
        );
    }

    const fee = Number(selectedDoctor?.consultationFee || 0).toLocaleString();
    const rating = selectedDoctor?.rating;
    const hospitals = selectedDoctor?.hospitals || [];
    const days = selectedDoctor?.availableDays || [];
    const langs = selectedDoctor?.languages || [];

    return (
        <div className="min-h-screen bg-[#e7e9f0]">
            <section className="mx-auto max-w-[1200px] px-6 lg:px-8 pt-8 pb-10">
                {/* Top banner */}
                <div
                    className="rounded-2xl overflow-hidden shadow-sm"
                    style={{
                        background:
                            "linear-gradient(135deg,#099d9b 0%,#1b74e8 100%)",
                    }}
                >
                    <div className="p-4 sm:p-6">
                        <button
                            onClick={() => router.back()}
                            type="button"
                            className="inline-flex items-center gap-2 rounded-md bg-white/25 hover:bg-white/30 text-white px-3 py-1.5 text-xs font-semibold transition"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            BACK
                        </button>

                        <div className="mt-4 flex items-center gap-4">
                            {/* avatar (bigger + more visible) */}
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-white/30 border border-white/35 shadow-lg flex items-center justify-center shrink-0">
                                {selectedDoctor?.profileImage ? (
                                    <img
                                        src={selectedDoctor.profileImage}
                                        alt={selectedDoctor.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-[11px] text-white/90">
                                        No Image
                                    </div>
                                )}
                            </div>

                            {/* name + meta */}
                            <div className="flex-1 min-w-0">
                                <h1 className="text-white font-bold text-lg sm:text-2xl truncate">
                                    {selectedDoctor?.name}
                                </h1>
                                <p className="text-white/90 text-xs sm:text-sm mt-0">
                                    {selectedDoctor?.specialization}
                                </p>
                                <p className="text-white/85 text-[10px] sm:text-xs mt-0.5">
                                    {selectedDoctor?.qualification}
                                </p>

                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-[11px] text-white">
                                        <Star className="w-3.5 h-3.5" />
                                        Rating {rating}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main panel */}
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left big card */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6 sm:p-7">
                        {/* Stats row (NO BORDER, 3 light colors + icons) */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="rounded-xl bg-teal-50 p-4">
                                <div className="flex items-center gap-2">
                                    <Briefcase className="w-4 h-4 text-teal-700" />
                                    <p className="text-[11px] text-teal-800 font-semibold">
                                        Experience
                                    </p>
                                </div>
                                <p className="text-sm font-semibold text-gray-900 mt-1">
                                    {selectedDoctor?.experience} years
                                </p>
                            </div>

                            <div className="rounded-xl bg-blue-50 p-4">
                                <div className="flex items-center gap-2">
                                    <Stethoscope className="w-4 h-4 text-blue-700" />
                                    <p className="text-[11px] text-blue-800 font-semibold">
                                        Speciality
                                    </p>
                                </div>
                                <p className="text-sm font-semibold text-gray-900 mt-1">
                                    {selectedDoctor?.specialization}
                                </p>
                            </div>

                            <div className="rounded-xl bg-green-50 p-4">
                                <div className="flex items-center gap-2">
                                    <BadgeDollarSign className="w-4 h-4 text-green-700" />
                                    <p className="text-[11px] text-green-800 font-semibold">
                                        Consultation Fee
                                    </p>
                                </div>
                                <p className="text-sm font-semibold text-gray-900 mt-1">
                                    LKR {fee}
                                </p>
                            </div>
                        </div>

                        {/* About */}
                        <div className="mt-6">
                            <h2 className="text-sm font-bold text-gray-800 mb-2">
                                About Doctor
                            </h2>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {selectedDoctor?.description ||
                                    "No description added."}
                            </p>
                        </div>

                        {/* Working Days */}
                        <div className="mt-6">
                            <div className="flex items-center gap-2 mb-2">
                                <CalendarDays className="w-4 h-4 text-gray-700" />
                                <h3 className="text-sm font-bold text-gray-800">
                                    Working Days
                                </h3>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {days.length === 0 ? (
                                    <p className="text-sm text-gray-500">
                                        No available days
                                    </p>
                                ) : (
                                    days.map((d) => (
                                        <span
                                            key={d}
                                            className="inline-flex items-center rounded-full bg-green-50 text-green-700 border border-green-200 px-3 py-1 text-xs"
                                        >
                                            {d}
                                        </span>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Working Hospitals */}
                        <div className="mt-6">
                            <div className="flex items-center gap-2 mb-3">
                                <Building2 className="w-4 h-4 text-gray-700" />
                                <h3 className="text-sm font-bold text-gray-800">
                                    Working Hospitals
                                </h3>
                            </div>

                            {hospitals.length === 0 ? (
                                <p className="text-sm text-gray-500">
                                    No hospitals assigned
                                </p>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {hospitals.map((h, idx) => (
                                        <div
                                            key={idx}
                                            className="rounded-xl border border-gray-200 bg-white p-3"
                                        >
                                            <p className="text-sm font-semibold text-gray-900">
                                                {h.name}
                                            </p>
                                            <p className="text-xs text-gray-600 flex items-center gap-1.5 mt-1">
                                                <MapPin className="w-3.5 h-3.5 text-gray-500" />
                                                {h.city}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Languages */}
                        <div className="mt-6">
                            <div className="flex items-center gap-2 mb-2">
                                <Languages className="w-4 h-4 text-gray-700" />
                                <h3 className="text-sm font-bold text-gray-800">
                                    Languages
                                </h3>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {langs.length === 0 ? (
                                    <p className="text-sm text-gray-500">
                                        No languages added
                                    </p>
                                ) : (
                                    langs.map((l) => (
                                        <span
                                            key={l}
                                            className="inline-flex items-center rounded-full bg-gray-100 text-gray-800 border border-gray-200 px-3 py-1 text-xs"
                                        >
                                            {l}
                                        </span>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right booking card */}
                    <div className="bg-white rounded-2xl shadow-md p-6 sm:p-7 lg:sticky lg:top-6 h-fit">
                        <h2 className="text-sm font-bold text-gray-800 mb-4">
                            Book Appointment
                        </h2>

                        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                            <p className="text-[11px] text-gray-500">Doctor</p>
                            <p className="text-sm font-semibold text-gray-900 mt-0.5">
                                {selectedDoctor?.name}
                            </p>

                            <p className="text-[11px] text-gray-500 mt-3">
                                Fee
                            </p>
                            <p className="text-sm font-bold text-gray-900 mt-0.5">
                                LKR {fee}
                            </p>
                        </div>

                        <div className="mt-4">
                            <h3 className="text-xs font-bold text-gray-700 mb-2">
                                Contact Information
                            </h3>

                            <div className="space-y-2 text-xs text-gray-700">
                                <p className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-gray-500" />
                                    {selectedDoctor?.phonenumber || "N/A"}
                                </p>
                                <p className="flex items-center gap-2 break-all">
                                    <Mail className="w-4 h-4 text-gray-500" />
                                    {selectedDoctor?.email || "N/A"}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() =>
                                router.push(`/booking/${selectedDoctor?.id}`)
                            }
                            className="mt-5 h-11 w-full rounded-md bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-colors cursor-pointer"
                            type="button"
                        >
                            Book Now
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
