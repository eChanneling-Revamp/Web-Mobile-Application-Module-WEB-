import React from "react";

export const AppointmentSkeleton = () => {
    return (
        <div className="min-h-screen bg-gray-150 py-10 px-4 animate-pulse">
            {/* Outer Wrapper: Matches max-w-7xl and shadow-2xl */}
            <div className="max-w-7xl mx-auto rounded-3xl shadow-2xl">
                {/* Inner Card: Matches bg-white and p-6 */}
                <div className="bg-white rounded-3xl p-6">
                    {/* Header Placeholder */}
                    <div className="h-9 bg-gray-200 rounded-md w-64 mx-auto mb-6"></div>

                    {/* Main Content Grid: Matches grid-cols-[300px_1fr] and gap-8 */}
                    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
                        {/* Sidebar Placeholder: Matches bg-gray-50 and p-5 */}
                        <aside className="rounded-2xl bg-gray-50 shadow-md p-5 h-fit">
                            <div className="flex flex-row sm:flex-col gap-3 mb-0.5 items-center sm:items-start">
                                {/* Circular Image Placeholder */}
                                <div className="p-4 flex justify-center w-full">
                                    <div className="w-20 h-20 rounded-full bg-gray-300"></div>
                                </div>
                                {/* Text Lines */}
                                <div className="space-y-3 flex-1 w-full">
                                    <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                </div>
                            </div>
                        </aside>

                        {/* Step Content Area */}
                        <div>
                            {/* Step Indicator Placeholder: Matches mb-8 gap-0 */}
                            <div className="mb-1">
                                <div className="flex items-center justify-center gap-0 w-full px-2 mb-8 mt-3">
                                    {[1, 2, 3, 4, 5].map((item, i) => (
                                        <React.Fragment key={i}>
                                            <div className="flex flex-col items-center min-w-[38px] px-1">
                                                <div className="h-8 w-8 rounded-full bg-gray-200 border border-gray-300"></div>
                                                <div className="h-2 bg-gray-100 rounded w-10 mt-2"></div>
                                            </div>
                                            {i !== 4 && (
                                                <div className="flex items-center">
                                                    <div className="h-0.5 w-5 bg-gray-200"></div>
                                                </div>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>

                            {/* Actual Step Form Placeholder: Matches shadow-lg p-3 */}
                            <div className="bg-white rounded-xl shadow-lg p-6 space-y-6 border border-gray-50">
                                {/* Appointment Type Section Placeholder */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="h-20 bg-gray-50 rounded-2xl border border-gray-100"></div>
                                    <div className="h-20 bg-gray-50 rounded-2xl border border-gray-100"></div>
                                </div>

                                {/* Sessions Section Placeholder */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[1, 2, 3, 4].map((n) => (
                                        <div
                                            key={n}
                                            className="h-24 bg-gray-50 rounded-2xl border border-gray-100"
                                        ></div>
                                    ))}
                                </div>

                                {/* Navigation Button Placeholder */}
                                <div className="flex justify-end pt-4">
                                    <div className="h-12 bg-gray-200 rounded-2xl w-32"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

