import { Skeleton } from "@/components/ui/skeleton"

export default function CreateLoading() {
    return (
        <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
            {/* Header skeleton */}
            <Skeleton className="h-8 w-40" />

            {/* Form skeleton */}
            <div className="max-w-2xl space-y-6">
                {/* Title field */}
                <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                </div>

                {/* Description field */}
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-32 w-full" />
                </div>

                {/* Priority and Category row */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>

                {/* Submit button */}
                <Skeleton className="h-10 w-32" />
            </div>
        </div>
    )
}
