import { Skeleton } from "@/components/ui/skeleton"

export default function HelpLoading() {
    return (
        <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
            {/* Header skeleton */}
            <div className="text-center space-y-2">
                <Skeleton className="h-8 w-48 mx-auto" />
                <Skeleton className="h-4 w-64 mx-auto" />
            </div>

            {/* Search skeleton */}
            <Skeleton className="h-12 w-full max-w-xl mx-auto" />

            {/* Help cards grid skeleton */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="rounded-lg border p-6 space-y-3">
                        <Skeleton className="h-10 w-10 rounded-lg" />
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                ))}
            </div>
        </div>
    )
}
