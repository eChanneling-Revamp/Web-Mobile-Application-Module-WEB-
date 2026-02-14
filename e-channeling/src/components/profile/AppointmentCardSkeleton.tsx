export const AppointmentCardSkeleton = () => (
    <div className="relative bg-white border border-gray-200 rounded-xl md:rounded-2xl shadow-md overflow-hidden animate-pulse">
        {/* Header Section Skeleton */}
        <div className="px-4 py-3 md:px-6 md:py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-4 h-4 md:w-5 md:h-5 bg-gray-300 rounded" />
                    <div>
                        <div className="h-3 bg-gray-300 rounded w-24 mb-1" />
                        <div className="h-4 bg-gray-300 rounded w-32" />
                    </div>
                </div>
                <div className="w-20 h-6 bg-gray-300 rounded-full" />
            </div>
        </div>

        {/* Doctor & Hospital Section Skeleton */}
        <div className="px-4 py-4 md:px-6 md:py-5 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row items-start gap-3 md:gap-4">
                <div className="w-14 h-14 bg-gray-300 rounded-xl" />
                <div className="flex-1 w-full sm:w-auto">
                    <div className="flex flex-col gap-3 md:gap-0 md:flex-row md:items-start md:justify-between">
                        {/* Doctor Info Skeleton */}
                        <div className="flex-1 md:pr-4">
                            <div className="h-5 md:h-6 bg-gray-300 rounded w-48 mb-2" />
                            <div className="h-4 bg-gray-300 rounded w-36" />
                        </div>

                        {/* Hospital Info Skeleton */}
                        <div className="flex-1 md:px-4 md:border-l md:border-gray-200">
                            <div className="h-3 bg-gray-300 rounded w-16 mb-2" />
                            <div className="flex items-center gap-1.5 md:gap-2">
                                <div className="w-3.5 h-3.5 md:w-4 md:h-4 bg-gray-300 rounded" />
                                <div className="h-4 bg-gray-300 rounded w-40" />
                            </div>
                        </div>

                        {/* Appointment Type Skeleton */}
                        <div className="flex items-start md:pl-4">
                            <div className="w-20 h-7 bg-gray-300 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Appointment Details Section Skeleton */}
        <div className="px-4 py-4 md:px-6 md:py-5 border-t border-gray-200">
            <div className="h-3 bg-gray-300 rounded w-32 mb-3" />
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-start gap-2 md:gap-3">
                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gray-300" />
                        <div>
                            <div className="h-3 bg-gray-300 rounded w-12 mb-1" />
                            <div className="h-4 bg-gray-300 rounded w-20" />
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Patient Information Section Skeleton */}
        <div className="px-4 py-4 md:px-6 md:py-5 border-t border-gray-200">
            <div className="h-3 bg-gray-300 rounded w-36 mb-3" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2 md:gap-3">
                        <div className="w-4 h-4 md:w-5 md:h-5 bg-gray-300 rounded" />
                        <div className="flex-1">
                            <div className="h-3 bg-gray-300 rounded w-12 mb-1" />
                            <div className="h-4 bg-gray-300 rounded w-24" />
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Payment Section Skeleton */}
        <div className="px-4 py-3 md:px-6 md:py-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 md:w-5 md:h-5 bg-gray-300 rounded" />
                    <div className="h-4 bg-gray-300 rounded w-28" />
                </div>
                <div className="w-24 h-6 bg-gray-300 rounded-full" />
            </div>
        </div>
    </div>
);
