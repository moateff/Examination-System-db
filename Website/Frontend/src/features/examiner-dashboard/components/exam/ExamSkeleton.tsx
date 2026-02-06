import { Skeleton } from "@/shared/components/ui/Skeleton";

export default function ExamSkeleton() {
    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header Skeleton */}
                <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-10 w-32 rounded-lg" />
                </div>

                {/* Question Card Skeleton */}
                <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm relative overflow-hidden">
                    {/* Top Bar Decoration */}


                    <div className="mb-8 space-y-4">
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-3/4" />
                    </div>

                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="h-16 w-full rounded-xl" />
                        ))}
                    </div>
                </div>

                {/* Footer Skeleton */}
                <div className="flex justify-between items-center">
                    <Skeleton className="h-12 w-32 rounded-lg" />
                    <Skeleton className="h-12 w-40 rounded-lg" />
                </div>
            </div>
        </div>
    );
}
