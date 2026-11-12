export default function StatusBadge({ status }) {
  const pending = status === "Pendente";
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
        pending ? "bg-brand-gray text-brand-gray-dark" : "bg-brand-green text-brand-ink"
      }`}
    >
      {status}
    </span>
  );
}