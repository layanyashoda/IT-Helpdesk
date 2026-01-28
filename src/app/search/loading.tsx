import { Skeleton } from "@/components/ui/skeleton"

export default function SearchLoading() {
    return (
        <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
            {/* Header skeleton */}
            <Skeleton className="h-8 w-32" />

            {/* Search input skeleton */}
            <Skeleton className="h-12 w-full max-w-2xl" />

            {/* Filter chips skeleton */}
            <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-20 rounded-full" />
                ))}
            </div>

            {/* Results skeleton */}
            <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="rounded-lg border p-4 space-y-2">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-5 w-16 rounded" />
                            <Skeleton className="h-5 w-48" />
                        </div>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                ))}
            </div>
        </div>
    )
}
