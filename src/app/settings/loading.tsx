import { Skeleton } from "@/components/ui/skeleton"

export default function SettingsLoading() {
    return (
        <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
            {/* Header skeleton */}
            <Skeleton className="h-8 w-32" />

            {/* Tabs skeleton */}
            <div className="flex gap-4 border-b pb-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-24" />
                ))}
            </div>

            {/* Settings sections skeleton */}
            <div className="space-y-6 max-w-2xl">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-4 rounded-lg border p-6">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-4 w-full" />
                        <div className="flex items-center justify-between pt-2">
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-6 w-12 rounded-full" />
                        </div>
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-4 w-56" />
                            <Skeleton className="h-6 w-12 rounded-full" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
