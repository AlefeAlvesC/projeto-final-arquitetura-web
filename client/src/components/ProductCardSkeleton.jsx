export default function ProductCardSkeleton() {
  return (
    <div className="animate-pulse bg-brand-gray" aria-hidden="true">
      <div className="aspect-square bg-brand-gray-dark/10" />
      <div className="flex flex-col gap-2 p-3 md:p-4">
        <div className="h-4 w-3/4 rounded bg-brand-gray-dark/10" />
        <div className="h-6 w-1/3 rounded bg-brand-gray-dark/10" />
      </div>
    </div>
  );
}