"use client";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-ed-border/40 ${className}`}
      aria-hidden="true"
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-ed-border bg-ed-card p-5">
      <Skeleton className="mb-3 h-10 w-10 rounded-lg" />
      <Skeleton className="mb-2 h-4 w-24" />
      <Skeleton className="h-8 w-16" />
    </div>
  );
}

export function GamePlaySkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ed-cream">
      <div className="w-full max-w-3xl px-4">
        <Skeleton className="mx-auto mb-6 h-6 w-48" />
        <div className="rounded-xl border border-ed-border bg-ed-card p-8">
          <Skeleton className="mb-4 h-5 w-64" />
          <Skeleton className="mb-3 h-4 w-full" />
          <Skeleton className="mb-3 h-4 w-5/6" />
          <Skeleton className="mb-6 h-4 w-3/4" />
          <div className="flex gap-3">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ResultsSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ed-cream">
      <div className="w-full max-w-3xl px-4">
        <Skeleton className="mx-auto mb-4 h-8 w-64" />
        <Skeleton className="mx-auto mb-8 h-5 w-40" />
        <div className="mb-8 flex justify-center">
          <div className="rounded-xl border border-ed-border bg-ed-card p-8 text-center">
            <Skeleton className="mx-auto mb-2 h-16 w-24" />
            <Skeleton className="mx-auto h-4 w-20" />
          </div>
        </div>
        <div className="mx-auto mb-8 max-w-md rounded-xl border border-ed-border bg-ed-card p-6">
          <Skeleton className="mx-auto mb-4 h-4 w-32" />
          <Skeleton className="mx-auto h-48 w-48 rounded-full" />
        </div>
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-ed-cream">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Skeleton className="mb-8 h-4 w-32" />
        <Skeleton className="mx-auto mb-2 h-10 w-48" />
        <Skeleton className="mx-auto mb-10 h-5 w-64" />
        <div className="mb-8 grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-xl border border-ed-border bg-ed-card p-5 text-center">
              <Skeleton className="mx-auto mb-2 h-8 w-12" />
              <Skeleton className="mx-auto h-3 w-20" />
            </div>
          ))}
        </div>
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        <div className="mx-auto mb-8 max-w-md rounded-xl border border-ed-border bg-ed-card p-6">
          <Skeleton className="mx-auto mb-4 h-4 w-32" />
          <Skeleton className="mx-auto h-48 w-48 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function EscapeRoomSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-ed-cream">
      <div className="mx-auto w-full max-w-5xl px-4 py-6">
        <Skeleton className="mb-4 h-4 w-24" />
        <div className="mb-4 flex items-center justify-between">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-5 w-32" />
        </div>
        <Skeleton className="mb-4 h-3 w-full rounded-full" />
        <Skeleton className="mb-6 aspect-video w-full rounded-xl" />
        <div className="flex gap-3">
          <Skeleton className="h-10 w-32 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
