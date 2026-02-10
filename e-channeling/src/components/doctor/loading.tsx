export default function DoctorLoading() {
    return (
        <div className="min-h-screen bg-[#e7e9f0]">
            <section className="mx-auto max-w-[1200px] px-6 lg:px-8 pt-8 pb-10">
                {/* Top banner skeleton */}
                <div
                    className="rounded-2xl overflow-hidden shadow-sm animate-pulse"
                    style={{
                        background:
                            "linear-gradient(135deg,#099d9b 0%,#1b74e8 100%)",
                    }}
                >
                    <div className="p-4 sm:p-6">
                        {/* Back button skeleton */}
                        <div className="inline-flex items-center gap-2 rounded-md bg-white/25 px-3 py-1.5">
                            <div className="w-4 h-4 bg-white/30 rounded"></div>
                            <div className="w-10 h-3 bg-white/30 rounded"></div>
                        </div>

                        <div className="mt-4 flex items-center gap-4">
                            {/* Avatar skeleton */}
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-white/30 border border-white/35 shadow-lg shrink-0"></div>

                            {/* Name and meta skeleton */}
                            <div className="flex-1 min-w-0 space-y-2">
                                <div className="h-6 sm:h-7 bg-white/30 rounded w-2/3"></div>
                                <div className="h-4 bg-white/25 rounded w-1/2"></div>
                                <div className="h-3 bg-white/20 rounded w-3/5"></div>

                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                    <div className="h-6 w-20 bg-white/20 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main panel */}
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left big card skeleton */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6 sm:p-7">
                        {/* Stats row skeleton */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 animate-pulse">
                            <div className="rounded-xl bg-teal-50 p-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-teal-200 rounded"></div>
                                    <div className="h-3 w-16 bg-teal-200 rounded"></div>
                                </div>
                                <div className="h-4 w-20 bg-teal-300 rounded mt-1"></div>
                            </div>

                            <div className="rounded-xl bg-blue-50 p-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-blue-200 rounded"></div>
                                    <div className="h-3 w-16 bg-blue-200 rounded"></div>
                                </div>
                                <div className="h-4 w-24 bg-blue-300 rounded mt-1"></div>
                            </div>

                            <div className="rounded-xl bg-green-50 p-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-green-200 rounded"></div>
                                    <div className="h-3 w-24 bg-green-200 rounded"></div>
                                </div>
                                <div className="h-4 w-20 bg-green-300 rounded mt-1"></div>
                            </div>
                        </div>

                        {/* About skeleton */}
                        <div className="mt-6 animate-pulse">
                            <div className="h-4 w-28 bg-gray-300 rounded mb-2"></div>
                            <div className="space-y-2">
                                <div className="h-3 bg-gray-200 rounded w-full"></div>
                                <div className="h-3 bg-gray-200 rounded w-full"></div>
                                <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                            </div>
                        </div>

                        {/* Working Days skeleton */}
                        <div className="mt-6 animate-pulse">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-4 h-4 bg-gray-300 rounded"></div>
                                <div className="h-4 w-28 bg-gray-300 rounded"></div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div
                                        key={i}
                                        className="h-6 w-16 bg-green-100 rounded-full"
                                    ></div>
                                ))}
                            </div>
                        </div>

                        {/* Working Hospitals skeleton */}
                        <div className="mt-6 animate-pulse">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-4 h-4 bg-gray-300 rounded"></div>
                                <div className="h-4 w-32 bg-gray-300 rounded"></div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {[1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className="rounded-xl border border-gray-200 bg-white p-3"
                                    >
                                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Languages skeleton */}
                        <div className="mt-6 animate-pulse">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-4 h-4 bg-gray-300 rounded"></div>
                                <div className="h-4 w-24 bg-gray-300 rounded"></div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {[1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className="h-6 w-16 bg-gray-200 rounded-full"
                                    ></div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right booking card skeleton */}
                    <div className="bg-white rounded-2xl shadow-md p-6 sm:p-7 lg:sticky lg:top-6 h-fit">
                        <div className="animate-pulse">
                            <div className="h-4 w-32 bg-gray-300 rounded mb-4"></div>

                            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                                <div className="h-3 w-12 bg-gray-200 rounded"></div>
                                <div className="h-4 w-3/4 bg-gray-300 rounded mt-1"></div>

                                <div className="h-3 w-8 bg-gray-200 rounded mt-3"></div>
                                <div className="h-4 w-24 bg-gray-300 rounded mt-1"></div>
                            </div>

                            <div className="mt-4">
                                <div className="h-3 w-32 bg-gray-300 rounded mb-2"></div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-gray-200 rounded"></div>
                                        <div className="h-3 w-28 bg-gray-200 rounded"></div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-gray-200 rounded"></div>
                                        <div className="h-3 w-36 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 h-11 w-full rounded-md bg-gray-200"></div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
