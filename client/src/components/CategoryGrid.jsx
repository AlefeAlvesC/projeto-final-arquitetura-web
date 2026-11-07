export default function CategoryGrid({ categories, loading, active, onSelect }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4" aria-hidden="true">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="aspect-square animate-pulse bg-brand-gray" />
        ))}
      </div>
    );
  }

  if (categories.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
      {categories.map((cat) => {
        const isActive = active === cat.key;
        return (
          <button
            key={cat.key}
            onClick={() => onSelect(isActive ? "" : cat.name)}
            aria-pressed={isActive}
            className={`overflow-hidden bg-white text-left shadow-sm transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-brand-pink ${
              isActive ? "ring-4 ring-brand-purple" : ""
            }`}
          >
            <div className="aspect-square bg-brand-ink">
              <img
                src={cat.image}
                alt=""
                loading="lazy"
                className="h-full w-full object-contain p-3"
              />
            </div>
            <p className="py-3 text-center font-display text-sm font-bold md:text-lg">
              {cat.name}
            </p>
          </button>
        );
      })}
    </div>
  );
}