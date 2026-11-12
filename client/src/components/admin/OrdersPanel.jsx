import { useMemo } from "react";
import useOrders from "../../hooks/useOrders";
import { formatDate, formatPrice } from "../../utils/format";
import Button from "../ui/Button";
import Alert from "../ui/Alert";
import StatCard from "./StatCard";
import StatusBadge from "../ui/StatusBadge";

// Produto apagado depois da compra chega como null no populate
const productName = (item) => item.product?.name ?? "Produto removido";

function ItemsList({ items }) {
  return (
    <ul className="flex flex-col gap-0.5">
      {items.map((item, i) => (
        <li key={i} className="text-xs">
          {item.quantity}× {productName(item)}
        </li>
      ))}
    </ul>
  );
}

export default function OrdersPanel() {
  const { orders, loading, error, retry } = useOrders();

  // Mais recentes primeiro
  const sorted = useMemo(
    () => [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [orders]
  );

  const stats = useMemo(() => {
    const revenue = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
    const units = orders.reduce(
      (sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0),
      0
    );
    return {
      revenue,
      count: orders.length,
      average: orders.length ? revenue / orders.length : 0,
      units,
    };
  }, [orders]);

  // Top 3 produtos por unidades vendidas
  const topProducts = useMemo(() => {
    const map = new Map();
    orders.forEach((o) =>
      o.items.forEach((item) => {
        const key = item.product?._id ?? "removido";
        const current = map.get(key) ?? { name: productName(item), units: 0 };
        current.units += item.quantity;
        map.set(key, current);
      })
    );
    return [...map.values()].sort((a, b) => b.units - a.units).slice(0, 3);
  }, [orders]);

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 py-10">
        <div className="w-full max-w-md">
          <Alert type="error">{error}</Alert>
        </div>
        <Button variant="outline" onClick={retry}>
          Tentar novamente
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-4" aria-hidden="true">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-brand-gray" />
          ))}
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-2xl bg-brand-gray" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        <StatCard label="Total de vendas" value={formatPrice(stats.revenue)} />
        <StatCard label="Pedidos" value={stats.count} />
        <StatCard label="Ticket médio" value={formatPrice(stats.average)} />
        <StatCard label="Unidades vendidas" value={stats.units} />
      </div>

      {orders.length === 0 ? (
        <p className="py-10 text-center text-brand-gray-dark">
          Nenhum pedido realizado ainda.
        </p>
      ) : (
        <>
          {topProducts.length > 0 && (
            <section aria-labelledby="top-titulo" className="rounded-2xl bg-brand-ink p-5 text-white">
              <h2 id="top-titulo" className="mb-3 font-display text-lg font-bold">
                Mais vendidos
              </h2>
              <ol className="flex flex-col gap-2 text-sm">
                {topProducts.map((p, i) => (
                  <li key={p.name} className="flex items-center justify-between gap-3">
                    <span className="truncate">
                      <span className="mr-2 font-display text-brand-green">{i + 1}º</span>
                      {p.name}
                    </span>
                    <span className="shrink-0 font-semibold">{p.units} un.</span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          <h2 className="font-display text-xl font-bold">Pedidos recentes</h2>

          {/* Mobile: cards */}
          <ul className="flex flex-col gap-3 md:hidden">
            {sorted.map((o) => (
              <li key={o._id} className="flex flex-col gap-2 rounded-2xl bg-brand-gray p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-display text-sm font-bold">
                      {o.user?.name ?? "Usuário removido"}
                    </p>
                    <p className="text-xs text-brand-gray-dark">{formatDate(o.createdAt)}</p>
                  </div>
                  <StatusBadge status={o.status} />
                </div>
                <ItemsList items={o.items} />
                <p className="font-display font-bold">{formatPrice(o.totalAmount)}</p>
              </li>
            ))}
          </ul>

          {/* Desktop: tabela */}
          <div className="hidden overflow-x-auto rounded-2xl border border-brand-gray md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-ink text-white">
                <tr>
                  <th className="px-4 py-3 font-semibold">Pedido</th>
                  <th className="px-4 py-3 font-semibold">Cliente</th>
                  <th className="px-4 py-3 font-semibold">Data</th>
                  <th className="px-4 py-3 font-semibold">Itens</th>
                  <th className="px-4 py-3 font-semibold">Total</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((o) => (
                  <tr
                    key={o._id}
                    className="border-t border-brand-gray align-top hover:bg-brand-gray/50"
                  >
                    <td className="px-4 py-3 font-mono text-xs">#{o._id.slice(-6)}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold">{o.user?.name ?? "Usuário removido"}</p>
                      <p className="text-xs text-brand-gray-dark">{o.user?.email}</p>
                    </td>
                    <td className="px-4 py-3">{formatDate(o.createdAt)}</td>
                    <td className="px-4 py-3">
                      <ItemsList items={o.items} />
                    </td>
                    <td className="px-4 py-3 font-semibold">{formatPrice(o.totalAmount)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={o.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}