import { Skeleton } from "@/shared/components/ui/Skeleton";

export default function DashboardSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <Skeleton className="h-10 w-64 mb-8" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                        <Skeleton className="h-6 w-3/4 mb-4" />
                        <div className="space-y-3 mb-6">
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-4 w-1/3" />
                        </div>
                        <Skeleton className="h-12 w-full rounded-lg" />
                    </div>
                ))}
            </div>
        </div>
    );
}
