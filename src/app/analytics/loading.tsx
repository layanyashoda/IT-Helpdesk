import { Skeleton } from "@/components/ui/skeleton"

export default function AnalyticsLoading() {
    return (
        <div className="space-y-6">
            {/* Header skeleton */}
            <div>
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-4 w-64 mt-2" />
            </div>

            {/* Summary cards skeleton */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-28 rounded-xl" />
                ))}
            </div>

            {/* Charts skeleton */}
            <div className="grid gap-6 lg:grid-cols-2">
                <Skeleton className="lg:col-span-2 h-[380px] rounded-xl" />
                <Skeleton className="h-[320px] rounded-xl" />
                <Skeleton className="h-[320px] rounded-xl" />
                <Skeleton className="lg:col-span-2 h-[320px] rounded-xl" />
            </div>
        </div>
    )
}
