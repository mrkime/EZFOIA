import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Dashboard Summary Cards Skeleton
export const DashboardSummarySkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
    {[...Array(5)].map((_, i) => (
      <Card key={i} className={cn("bg-card-gradient border-border", i === 0 && "sm:col-span-2 lg:col-span-1")}>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-24" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-9 w-20 mb-2" />
          <Skeleton className="h-3 w-28" />
        </CardContent>
      </Card>
    ))}
  </div>
);

// Table Row Skeleton
export const TableRowSkeleton = ({ columns = 6 }: { columns?: number }) => (
  <div className="flex items-center gap-4 p-4 border-b border-border animate-pulse">
    {[...Array(columns)].map((_, i) => (
      <div key={i} className={cn("flex-1", i === 0 && "flex-[2]")}>
        <Skeleton className={cn("h-4", i === 0 ? "w-32" : "w-20")} />
        {i === 0 && <Skeleton className="h-3 w-20 mt-1" />}
      </div>
    ))}
  </div>
);

// Request History Table Skeleton
export const RequestTableSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <Card className="bg-card-gradient border-border">
    <CardHeader className="flex flex-row items-center justify-between">
      <Skeleton className="h-6 w-36" />
      <Skeleton className="h-9 w-28 rounded-lg" />
    </CardHeader>
    <CardContent>
      {/* Filters skeleton */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Skeleton className="h-10 flex-1 max-w-sm rounded-lg" />
        <Skeleton className="h-10 w-32 rounded-lg" />
        <Skeleton className="h-10 w-24 rounded-lg" />
      </div>
      
      {/* Table header */}
      <div className="flex items-center gap-4 p-4 border-b border-border bg-muted/30 rounded-t-lg">
        <Skeleton className="h-4 w-24 flex-[2]" />
        <Skeleton className="h-4 w-20 flex-1" />
        <Skeleton className="h-4 w-20 flex-1" />
        <Skeleton className="h-4 w-20 flex-1" />
        <Skeleton className="h-4 w-16 flex-1" />
        <Skeleton className="h-4 w-16 flex-1" />
      </div>
      
      {/* Table rows */}
      {[...Array(rows)].map((_, i) => (
        <TableRowSkeleton key={i} />
      ))}
    </CardContent>
  </Card>
);

// Activity Log Skeleton
export const ActivityLogSkeleton = ({ items = 5 }: { items?: number }) => (
  <Card className="bg-card-gradient border-border">
    <CardHeader>
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-5 rounded" />
        <Skeleton className="h-6 w-28" />
      </div>
      <Skeleton className="h-4 w-64 mt-1" />
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {[...Array(items)].map((_, i) => (
          <div key={i} className="flex items-start gap-4 p-3 rounded-lg">
            <Skeleton className="h-5 w-5 rounded mt-1" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-3 w-48 mt-2" />
              <Skeleton className="h-3 w-32 mt-1" />
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

// Blog Post Card Skeleton
export const BlogCardSkeleton = () => (
  <Card className="bg-card border-border h-full">
    <CardHeader>
      <Skeleton className="h-5 w-20 rounded-full mb-2" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-3/4" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6 mb-4" />
      <div className="flex items-center gap-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
    </CardContent>
  </Card>
);

// Featured Blog Post Skeleton
export const FeaturedBlogSkeleton = () => (
  <Card className="bg-card border-border overflow-hidden">
    <div className="grid md:grid-cols-2">
      <Skeleton className="aspect-video md:aspect-auto md:h-80" />
      <div className="p-8 flex flex-col justify-center">
        <Skeleton className="h-5 w-24 rounded-full mb-4" />
        <Skeleton className="h-8 w-full mb-2" />
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-6" />
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-10 w-36 rounded-lg" />
      </div>
    </div>
  </Card>
);

// Blog Page Skeleton
export const BlogPageSkeleton = () => (
  <div className="space-y-8">
    <FeaturedBlogSkeleton />
    <div>
      <Skeleton className="h-7 w-36 mb-8" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <BlogCardSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
);

// Help Center Category Card Skeleton
export const HelpCategoryCardSkeleton = () => (
  <Card className="bg-card border-border h-full">
    <CardHeader>
      <Skeleton className="w-12 h-12 rounded-lg mb-4" />
      <Skeleton className="h-6 w-32" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-4 w-24" />
    </CardContent>
  </Card>
);

// Help Center Page Skeleton
export const HelpCenterSkeleton = () => (
  <div className="space-y-16">
    <div>
      <Skeleton className="h-7 w-44 mb-8" />
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <HelpCategoryCardSkeleton key={i} />
        ))}
      </div>
    </div>
    
    <div>
      <Skeleton className="h-7 w-36 mb-8" />
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 border-b border-border last:border-0">
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-4 w-4" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </div>
);

// Article List Skeleton
export const ArticleListSkeleton = ({ count = 8 }: { count?: number }) => (
  <Card className="bg-card border-border">
    <CardContent className="p-0">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="flex items-center justify-between p-4 border-b border-border last:border-0">
          <div className="flex-1">
            <Skeleton className="h-4 w-3/4 mb-1" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-5 w-5" />
        </div>
      ))}
    </CardContent>
  </Card>
);

// Profile/Account Settings Skeleton
export const AccountSettingsSkeleton = () => (
  <Card className="bg-card-gradient border-border">
    <CardHeader>
      <Skeleton className="h-6 w-36" />
      <Skeleton className="h-4 w-64 mt-1" />
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
      <Skeleton className="h-10 w-32 rounded-lg" />
    </CardContent>
  </Card>
);

// Inline Shimmer Effect (for text placeholders)
export const TextShimmer = ({ className }: { className?: string }) => (
  <div className={cn("relative overflow-hidden", className)}>
    <Skeleton className="h-full w-full" />
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
  </div>
);

// Stats Card Skeleton
export const StatsCardSkeleton = () => (
  <div className="text-center p-4">
    <Skeleton className="h-12 w-20 mx-auto mb-2" />
    <Skeleton className="h-4 w-24 mx-auto" />
  </div>
);

// Pricing Card Skeleton
export const PricingCardSkeleton = () => (
  <Card className="bg-card/50 border-border p-8">
    <Skeleton className="w-12 h-12 rounded-xl mb-6" />
    <Skeleton className="h-6 w-32 mb-2" />
    <Skeleton className="h-4 w-48 mb-6" />
    <Skeleton className="h-10 w-24 mb-2" />
    <Skeleton className="h-4 w-20 mb-8" />
    <div className="space-y-4 mb-8">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-4 flex-1" />
        </div>
      ))}
    </div>
    <Skeleton className="h-12 w-full rounded-lg" />
  </Card>
);

// Request Details Skeleton
export const RequestDetailsSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-40" />
      </div>
      <Skeleton className="h-6 w-24 rounded-full" />
    </div>
    
    <Card className="bg-card-gradient border-border">
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-5 w-40" />
          </div>
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-5 w-32" />
          </div>
        </div>
        <div>
          <Skeleton className="h-4 w-28 mb-2" />
          <Skeleton className="h-20 w-full rounded-lg" />
        </div>
      </CardContent>
    </Card>
    
    <Card className="bg-card-gradient border-border">
      <CardHeader>
        <Skeleton className="h-6 w-28" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);
