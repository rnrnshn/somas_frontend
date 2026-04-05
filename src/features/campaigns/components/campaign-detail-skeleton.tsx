import { Skeleton } from '@/app/components/ui/skeleton'

export function CampaignDetailSkeleton() {
  return (
    <div className="space-y-6 p-8">
      <div className="space-y-4">
        <Skeleton className="h-9 w-40" />
        <div className="flex items-start justify-between gap-6">
          <div className="space-y-3">
            <Skeleton className="h-12 w-96" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-11 w-28" />
            <Skeleton className="h-11 w-48" />
          </div>
        </div>
      </div>
      <Skeleton className="h-12 w-96" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton className="h-32" key={index} />
        ))}
      </div>
      <Skeleton className="h-48" />
      <Skeleton className="h-80" />
    </div>
  )
}
