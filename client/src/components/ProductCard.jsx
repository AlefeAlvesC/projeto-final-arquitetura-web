import { formatPrice } from "../utils/format";

export default function ProductCard({ product }) {
  const outOfStock = product.stock <= 0;

  return (
    <article className="group flex flex-col overflow-hidden bg-brand-gray shadow-sm transition-shadow hover:shadow-md focus-within:ring-2 focus-within:ring-brand-purple">
      <div className="relative aspect-square bg-white">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className={`h-full w-full object-contain p-2 transition-transform group-hover:scale-105 ${
            outOfStock ? "opacity-50" : ""
          }`}
        />
        {outOfStock && (
          <span className="absolute left-2 top-2 rounded-full bg-brand-pink px-3 py-1 text-xs font-semibold">
            Esgotado
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1 p-3 md:p-4">
        <h3 className="line-clamp-2 font-display text-sm font-bold md:text-base">
          {product.name}
        </h3>
        <p className="font-display text-lg font-bold md:text-xl">
          {formatPrice(product.price)}
        </p>
      </div>
    </article>
  );
}