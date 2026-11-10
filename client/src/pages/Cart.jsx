import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";
import Button from "../components/ui/Button";
import QuantitySelector from "../components/ui/QuantitySelector";

export default function Cart() {
  const { items, count, total, setQuantity, removeItems } = useCart();
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);

  // Ignora ids de itens que já saíram do carrinho
  const selectedIds = selected.filter((id) => items.some((i) => i.productId === id));
  const allSelected = items.length > 0 && selectedIds.length === items.length;

  const toggle = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const toggleAll = () =>
    setSelected(allSelected ? [] : items.map((i) => i.productId));

  const handleRemove = () => {
    removeItems(selectedIds);
    setSelected([]);
  };

  const handleCheckout = () =>
    navigate("/checkout", { state: { items, fromCart: true } });

  if (items.length === 0) {
    return (
      <section className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-20 text-center">
        <ShoppingCart size={48} className="text-brand-gray-dark" aria-hidden="true" />
        <h1 className="font-display text-2xl font-bold">Seu carrinho está vazio</h1>
        <p className="text-sm text-brand-gray-dark">
          Que tal dar uma olhada nas novidades geek?
        </p>
        <Link to="/">
          <Button>Ver produtos</Button>
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:py-12">
      <h1 className="font-display text-2xl font-bold md:text-3xl">Meu carrinho</h1>

      <div className="grid gap-6 md:grid-cols-[1fr_320px] md:items-start">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                className="h-5 w-5 accent-brand-purple"
              />
              Selecionar todos
            </label>
            <Button
              variant="outline"
              onClick={handleRemove}
              disabled={selectedIds.length === 0}
              className="px-4 py-2"
            >
              <Trash2 size={16} /> Remover selecionados
              {selectedIds.length > 0 && ` (${selectedIds.length})`}
            </Button>
          </div>

          <ul className="flex flex-col gap-3">
            {items.map((item) => (
              <li
                key={item.productId}
                className="flex items-center gap-3 rounded-2xl bg-brand-gray p-3"
              >
                <input
                  type="checkbox"
                  checked={selectedIds.includes(item.productId)}
                  onChange={() => toggle(item.productId)}
                  aria-label={`Selecionar ${item.name}`}
                  className="h-5 w-5 shrink-0 accent-brand-purple"
                />
                <Link to={`/produtos/${item.productId}`} className="shrink-0">
                  <img
                    src={item.imageUrl}
                    alt=""
                    className="h-20 w-20 rounded-xl bg-white object-contain"
                  />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <Link
                    to={`/produtos/${item.productId}`}
                    className="truncate font-display text-sm font-bold hover:text-brand-purple"
                  >
                    {item.name}
                  </Link>
                  <p className="text-xs text-brand-gray-dark">
                    {formatPrice(item.price)} cada
                  </p>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <QuantitySelector
                      value={item.quantity}
                      max={item.stock}
                      onChange={(q) => setQuantity(item.productId, q)}
                    />
                    <p className="font-display font-bold">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <aside className="flex flex-col gap-4 rounded-2xl bg-brand-ink p-5 text-white">
          <h2 className="font-display text-lg font-bold">Resumo</h2>
          <div className="flex justify-between text-sm">
            <span>Itens ({count})</span>
            <span>{formatPrice(total)}</span>
          </div>
          <div className="flex justify-between border-t border-white/20 pt-4 font-display text-xl font-bold">
            <span>Total</span>
            <span className="text-brand-green">{formatPrice(total)}</span>
          </div>
          <Button onClick={handleCheckout}>Finalizar compra</Button>
        </aside>
      </div>
    </section>
  );
}