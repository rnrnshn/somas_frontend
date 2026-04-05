import { Skeleton } from '@/app/components/ui/skeleton'

export function CreateCampaignSkeleton() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 p-8">
      <div className="space-y-3">
        <Skeleton className="h-9 w-44" />
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-2 w-full" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div className="space-y-2 text-center" key={index}>
              <Skeleton className="mx-auto h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
      <Skeleton className="h-[28rem] w-full" />
    </div>
  )
}
