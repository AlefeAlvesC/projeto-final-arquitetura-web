export default function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl bg-brand-gray p-4">
      <p className="text-xs text-brand-gray-dark md:text-sm">{label}</p>
      <p className="break-words font-display text-xl font-bold md:text-2xl">{value}</p>
    </div>
  );
}