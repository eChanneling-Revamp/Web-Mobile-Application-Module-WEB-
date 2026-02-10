"use client";
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
    fetchDoctors,
    searchDoctors,
    type SearchFilters,
} from "@/store/search/searchSlice";
import { fetchHospitals } from "@/store/hospitals/hospitalsSlice";
import {
    Search,
    Calendar,
    ChevronLeft,
    ChevronRight,
    AlertCircle,
    Info,
    Stethoscope,
} from "lucide-react";
import { DoctorCard, DoctorCardSkeleton } from "@/components/search/DoctorCard";
import { specializations } from "@/constants/specializations";

// make the specializations array alphabetically
specializations.sort((a, b) => a.localeCompare(b)); 

// Sri Lankan 25 Districts
const DISTRICTS = [
    "Ampara",
    "Anuradhapura",
    "Badulla",
    "Batticaloa",
    "Colombo",
    "Galle",
    "Gampaha",
    "Hambantota",
    "Jaffna",
    "Kalutara",
    "Kandy",
    "Kegalle",
    "Kilinochchi",
    "Kurunegala",
    "Mannar",
    "Matale",
    "Matara",
    "Moneragala",
    "Mullaitivu",
    "Nuwara Eliya",
    "Polonnaruwa",
    "Puttalam",
    "Ratnapura",
    "Trincomalee",
    "Vavuniya",
];

// Hospital Types
const HOSPITAL_TYPES = [
    { label: "Government", value: "GOVERNMENT" },
    { label: "Private", value: "PRIVATE" },
];

export default function SearchPage() {
    const dispatch = useDispatch<AppDispatch>();
    const {
        doctors,
        loading,        
        error,
        count,
        page: currentPage,
        totalPages,
    } = useSelector((state: RootState) => state.search);

    // Get hospitals from Redux store
    const { hospitals } = useSelector((state: RootState) => state.hospitals);

    // Filter states
    const [keyword, setKeyword] = useState("");
    const [specialtyId, setSpecialtyId] = useState("");
    const [hospitalType, setHospitalType] = useState("");
    const [district, setDistrict] = useState("");
    const [hospitalId, setHospitalId] = useState("");
    const [date, setDate] = useState("");
    const [page, setPage] = useState(1);
    const [hasSearched, setHasSearched] = useState(false);
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);

    // Fetch hospitals on component mount
    useEffect(() => {
        dispatch(fetchHospitals());
    }, [dispatch]);

    // Fetch all doctors on initial load
    useEffect(() => {
        if (!hasSearched) {
            dispatch(fetchDoctors());
            setHasSearched(true);
        }
    }, [dispatch, hasSearched]);

    // Track when initial load completes
    useEffect(() => {
        if (!loading && hasSearched && !initialLoadComplete) {
            setInitialLoadComplete(true);
        }
    }, [loading, hasSearched, initialLoadComplete]);

    useEffect(() => {
        // Don't trigger on initial load
        if (!hasSearched) return;

        const debounceTimer = setTimeout(() => {
            const filters: SearchFilters = {
                page: 1,
                limit: 12,
            };

            // If keyword is empty, fetch all doctors
            if (keyword.trim()) {
                filters.keyword = keyword.trim();
            }

            // Include other active filters in the search
            if (specialtyId) filters.specialtyId = specialtyId;
            if (hospitalType) filters.hospitalType = hospitalType;
            if (district) filters.district = district;
            if (hospitalId) filters.hospitalId = hospitalId;
            if (date) filters.date = date;

            setPage(1);

            // If keyword is empty and no other filters, fetch all doctors
            if (
                !keyword.trim() &&
                !specialtyId &&
                !hospitalType &&
                !district &&
                !hospitalId &&
                !date
            ) {
                dispatch(fetchDoctors());
            } else {
                dispatch(searchDoctors(filters));
            }
        }, 300);

        // Cleanup function to clear timeout if user continues typing
        return () => clearTimeout(debounceTimer);
    }, [keyword]);

    // Handle search
    const handleSearch = useCallback(() => {
        const filters: SearchFilters = {
            page: 1,
            limit: 12,
        };

        if (keyword.trim()) filters.keyword = keyword.trim();
        if (specialtyId) filters.specialtyId = specialtyId;
        if (hospitalType) filters.hospitalType = hospitalType;
        if (district) filters.district = district;
        if (hospitalId) filters.hospitalId = hospitalId;
        if (date) filters.date = date;

        setPage(1);
        dispatch(searchDoctors(filters));
    }, [
        keyword,
        specialtyId,
        hospitalType,
        district,
        hospitalId,
        date,
        dispatch,
    ]);

    // Handle pagination
    const handlePageChange = useCallback(
        (newPage: number) => {
            const filters: SearchFilters = {
                page: newPage,
                limit: 12,
            };

            if (keyword.trim()) filters.keyword = keyword.trim();
            if (specialtyId) filters.specialtyId = specialtyId;
            if (hospitalType) filters.hospitalType = hospitalType;
            if (district) filters.district = district;
            if (hospitalId) filters.hospitalId = hospitalId;
            if (date) filters.date = date;

            setPage(newPage);
            dispatch(searchDoctors(filters));
            window.scrollTo({ top: 0, behavior: "smooth" });
        },
        [
            keyword,
            specialtyId,
            hospitalType,
            district,
            hospitalId,
            date,
            dispatch,
        ]
    );

    // Handle reset
    const handleReset = useCallback(() => {
        setKeyword("");
        setSpecialtyId("");
        setHospitalType("");
        setDistrict("");
        setHospitalId("");
        setDate("");
        setPage(1);
        dispatch(fetchDoctors());
    }, [dispatch]);

    // Handle Enter key in search input
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    // UI Style Classes
    const greenBtn =
        "h-10 px-6 rounded-md bg-green-500 hover:bg-green-600 text-white text-sm font-semibold cursor-pointer hover:opacity-95 active:opacity-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]";
    const ghostBtn =
        "h-10 px-4 rounded-md border border-gray-400 text-sm bg-white hover:bg-gray-50 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
    const inputBase =
        "h-11 w-full rounded-md border border-gray-200 px-3 text-[14px] outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100 bg-white";
    const selectBase = inputBase;
    const labelClass =
        "text-[12px] font-medium text-gray-600 mb-1 text-left self-start ml-1";

    return (
        <div className="min-h-screen bg-[#e7e9f0]">
            <section className="mx-auto max-w-[1400px] px-10 sm:px-6 lg:px-10 pt-4 sm:pt-4 lg:pt-4 pb-4">
                <div
                    className="relative rounded-2xl overflow-hidden shadow-sm text-center mb-6 "
                    style={{
                        background:
                            "linear-gradient(135deg,#099d9b 0%,#1b74e8 100%)",
                    }}
                >
                    {/* <h1 className="text-white font-bold tracking-tight text-2xl sm:text-2xl md:text-3xl lg:text-[32px] leading-tight drop-shadow-lg px-4 sm:px-6 pt-3 sm:pt-4">
                        Your Health, Our Priority
                    </h1> */}
                    <p className="text-white text-[14px] sm:text-[18px] md:text-[20px] px-4 sm:px-6 pb-0 mt-2 sm:mt-5 font-semibold">
                        Find the best doctors using advanced filters tailored to
                        your needs.
                    </p>

                    {/* Search box */}
                    <div className="w-full flex justify-center pb-6  pt-4 sm:pt-6">
                        <div className="w-[90%] sm:w-[92%] xl:w-[1100px] bg-white/95 backdrop-blur rounded-xl shadow-md border border-white/70 p-3 sm:p-4">
                            <div className="mb-3 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    className={`${inputBase} pl-10`}
                                    placeholder="Search by doctor, specialty or hospital"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_1fr_auto] gap-3">
                                <div className="flex flex-col items-start">
                                    <label className={labelClass}>
                                        Speciality
                                    </label>
                                    <select
                                        className={selectBase}
                                        value={specialtyId}
                                        onChange={(e) =>
                                            setSpecialtyId(e.target.value)
                                        }
                                    >
                                        <option value="">
                                            All Specialties
                                        </option>
                                        {specializations.map((spec) => (
                                            <option key={spec} value={spec}>
                                                {spec}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-col items-start">
                                    <label className={labelClass}>
                                        Hospital Type
                                    </label>
                                    <select
                                        className={selectBase}
                                        value={hospitalType}
                                        onChange={(e) =>
                                            setHospitalType(e.target.value)
                                        }
                                    >
                                        <option value="">Any</option>
                                        {HOSPITAL_TYPES.map((type) => (
                                            <option
                                                key={type.value}
                                                value={type.value}
                                            >
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-col items-start">
                                    <label className={labelClass}>
                                        District
                                    </label>
                                    <select
                                        className={selectBase}
                                        value={district}
                                        onChange={(e) =>
                                            setDistrict(e.target.value)
                                        }
                                    >
                                        <option value="">Any</option>
                                        {DISTRICTS.map((dist) => (
                                            <option key={dist} value={dist}>
                                                {dist}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-col items-start">
                                    <label className={labelClass}>
                                        Hospital Name
                                    </label>
                                    <select
                                        className={selectBase}
                                        value={hospitalId}
                                        onChange={(e) =>
                                            setHospitalId(e.target.value)
                                        }
                                    >
                                        <option value="">All Hospitals</option>
                                        {hospitals.map((hospital) => (
                                            <option
                                                key={hospital.id}
                                                value={hospital.id}
                                            >
                                                {hospital.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-col items-start">
                                    <label className={labelClass}>Date</label>
                                    <div className="relative w-full">
                                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                                        <input
                                            type="date"
                                            className={`${inputBase} pl-10`}
                                            value={date}
                                            onChange={(e) =>
                                                setDate(e.target.value)
                                            }
                                            min={
                                                new Date()
                                                    .toISOString()
                                                    .split("T")[0]
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-row sm:flex-col lg:flex-row items-end sm:items-stretch lg:items-end gap-3 justify-end mb-0.5">
                                    <button
                                        onClick={handleSearch}
                                        disabled={loading}
                                        className={greenBtn}
                                        type="button"
                                    >
                                        <span className="inline-block min-w-[70px] text-center">
                                            {loading ? "Finding..." : "Find"}
                                        </span>
                                    </button>
                                    <button
                                        onClick={handleReset}
                                        disabled={loading}
                                        className="h-10 px-4 rounded-md border border-gray-400 text-sm text-red-900 bg-white hover:bg-gray-50 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Reset all fields"
                                        type="button"
                                    >
                                        Reset
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl  font-bold text-gray-800 flex items-center gap-2">
                            <Stethoscope className="w-5 h-5 sm:w-6 sm:h-6" />
                            Results
                        </h2>
                        {!loading && doctors.length > 0 && (
                            <p className="text-sm text-gray-600">
                                Showing {doctors.length} of {count} doctors
                            </p>
                        )}
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-red-800 mb-1">
                                    Error
                                </h3>
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    )}

                    {loading && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
                            {[...Array(8)].map((_, i) => (
                                <DoctorCardSkeleton key={i} />
                            ))}
                        </div>
                    )}

                    {/* Empty State - Only show after initial load completes and no results */}
                    {!loading &&
                        !error &&
                        doctors.length === 0 &&
                        initialLoadComplete && (
                            <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 text-center">
                                <Info className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                                    No doctors found
                                </h3>
                                <p className="text-sm sm:text-base text-gray-600 mb-4">
                                    Try adjusting your search filters or search
                                    criteria.
                                </p>
                                <button
                                    onClick={handleReset}
                                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}

                    {/* Results Grid */}
                    {!loading && !error && doctors.length > 0 && (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
                                {doctors.map((doctor) => (
                                    <DoctorCard
                                        key={doctor.id}
                                        doctor={doctor}
                                    />
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <p className="text-sm text-gray-600">
                                        Page {currentPage} of {totalPages} (
                                        {count} total results)
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() =>
                                                handlePageChange(
                                                    currentPage - 1
                                                )
                                            }
                                            disabled={
                                                currentPage === 1 || loading
                                            }
                                            className="p-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <div className="flex items-center gap-1">
                                            {[...Array(totalPages)].map(
                                                (_, i) => {
                                                    const pageNum = i + 1;
                                                    // Show first page, last page, current page, and pages around current
                                                    if (
                                                        pageNum === 1 ||
                                                        pageNum ===
                                                        totalPages ||
                                                        (pageNum >=
                                                            currentPage - 1 &&
                                                            pageNum <=
                                                            currentPage + 1)
                                                    ) {
                                                        return (
                                                            <button
                                                                key={pageNum}
                                                                onClick={() =>
                                                                    handlePageChange(
                                                                        pageNum
                                                                    )
                                                                }
                                                                disabled={
                                                                    loading
                                                                }
                                                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${currentPage ===
                                                                    pageNum
                                                                    ? "bg-green-500 text-white"
                                                                    : "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700"
                                                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                                            >
                                                                {pageNum}
                                                            </button>
                                                        );
                                                    } else if (
                                                        pageNum ===
                                                        currentPage - 2 ||
                                                        pageNum ===
                                                        currentPage + 2
                                                    ) {
                                                        return (
                                                            <span
                                                                key={pageNum}
                                                                className="px-2 text-gray-500"
                                                            >
                                                                ...
                                                            </span>
                                                        );
                                                    }
                                                    return null;
                                                }
                                            )}
                                        </div>
                                        <button
                                            onClick={() =>
                                                handlePageChange(
                                                    currentPage + 1
                                                )
                                            }
                                            disabled={
                                                currentPage === totalPages ||
                                                loading
                                            }
                                            className="p-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}
