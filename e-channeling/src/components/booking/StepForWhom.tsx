"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { setForWhom } from "@/store/booking/bookingSlice";
import type { ForWhomType } from "./types";

interface StepForWhomProps {
    onPrev: () => void;
    onNext: () => void;
}

export const StepForWhom: React.FC<StepForWhomProps> = ({ onPrev, onNext }) => {
    const dispatch = useDispatch<AppDispatch>();

    // Get current selection from Redux
    const { forWhom } = useSelector((state: RootState) => state.booking);

    // Handle selection
    const handleSelection = (selection: ForWhomType) => {
        dispatch(setForWhom(selection));
    };

    // Check if form is valid
    const isFormValid = forWhom !== null;

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">
                Who is this appointment for?
            </h2>

            {/* Selection Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mx-5">
                {/* For You Card */}
                <button
                    type="button"
                    onClick={() => handleSelection("myself")}
                    className={`rounded-3xl border-2 p-6 text-center transition-all duration-200 cursor-pointer ${
                        forWhom === "myself"
                            ? "border-green-500 bg-green-50 shadow-md"
                            : "border-gray-300 bg-white hover:border-green-300 hover:shadow-sm"
                    }`}
                >
                    <div className="flex flex-col items-center gap-4">
                        <div className="text-5xl">👤</div>
                        <h3 className="text-xl font-bold text-gray-900">
                            For You
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Book this appointment for yourself. We&apos;ll
                            auto-fill your details.
                        </p>
                    </div>
                </button>

                {/* For Someone Else Card */}
                <button
                    type="button"
                    onClick={() => handleSelection("someone_else")}
                    className={`rounded-3xl border-2 p-6 text-center transition-all duration-200 cursor-pointer ${
                        forWhom === "someone_else"
                            ? "border-green-500 bg-green-50 shadow-md"
                            : "border-gray-300 bg-white hover:border-green-300 hover:shadow-sm"
                    }`}
                >
                    <div className="flex flex-col items-center gap-4">
                        <div className="text-5xl">👥</div>
                        <h3 className="text-xl font-bold text-gray-900">
                            For Someone Else
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Book on behalf of a family member or friend.
                            You&apos;ll enter their details manually.
                        </p>
                    </div>
                </button>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6">
                <button
                    type="button"
                    onClick={onPrev}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                    ← Previous
                </button>

                <button
                    type="button"
                    onClick={onNext}
                    disabled={!isFormValid}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition ease-in-out duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                    Next →
                </button>
            </div>
        </div>
    );
};
