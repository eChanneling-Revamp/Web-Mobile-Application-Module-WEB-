// Health Record Card Skeleton Component
export const HealthRecordCardSkeleton = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm animate-pulse">
        {/* Appointment Info Skeleton */}
        <div className="mb-3 pb-3 border-b border-gray-200">
            <div className="grid grid-cols-3 gap-2">
                <div>
                    <div className="h-3 bg-gray-200 rounded w-20 mb-1" />
                    <div className="h-4 bg-gray-200 rounded w-28" />
                </div>
                <div>
                    <div className="h-3 bg-gray-200 rounded w-12 mb-1" />
                    <div className="h-4 bg-gray-200 rounded w-20" />
                </div>
                <div>
                    <div className="h-3 bg-gray-200 rounded w-12 mb-1" />
                    <div className="h-4 bg-gray-200 rounded w-16" />
                </div>
            </div>
        </div>

        {/* Doctor Info Skeleton */}
        <div className="mb-3 pb-3 border-b border-gray-200">
            <div className="h-4 bg-gray-200 rounded w-40 mb-1" />
            <div className="h-3 bg-gray-200 rounded w-32" />
        </div>

        {/* Patient Info Skeleton */}
        <div className="mb-3 pb-3 border-b border-gray-200">
            <div className="h-3 bg-gray-200 rounded w-20 mb-1" />
            <div className="h-4 bg-gray-200 rounded w-24" />
        </div>

        {/* Prescription Count Skeleton */}
        <div className="mb-3 flex items-center">
            <div className="w-4 h-4 bg-gray-200 rounded mr-1.5" />
            <div className="h-4 bg-gray-200 rounded w-28" />
        </div>

        {/* Action Buttons Skeleton */}
        <div className="flex gap-2 justify-center">
            <div className="w-44 h-10 bg-gray-200 rounded-lg" />
            <div className="w-44 h-10 bg-gray-200 rounded-lg" />
        </div>
    </div>
);
