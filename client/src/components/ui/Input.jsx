export default function Input({ label, id, error, className = "", ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={!!error}
        className={`w-full rounded-full border-2 bg-white px-5 py-3 text-sm outline-none transition-colors placeholder:text-brand-gray-dark/60 focus:border-brand-pink ${
          error ? "border-brand-pink" : "border-brand-ink"
        } ${className}`}
        {...props}
      />
      {error && <p className="px-2 text-xs text-brand-purple-dark">{error}</p>}
    </div>
  );
}