import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import useOrders from "../hooks/useOrders";
import { useAuth } from "../context/AuthContext";
import { formatDate, formatPrice } from "../utils/format";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import StatusBadge from "../components/ui/StatusBadge";

function OrderItem({ item }) {
  const product = item.product; // null se o produto foi apagado depois da compra

  const content = (
    <>
      {product?.imageUrl ? (
        <img
          src={product.imageUrl}
          alt=""
          className="h-14 w-14 shrink-0 rounded-xl bg-white object-contain"
        />
      ) : (
        <div className="h-14 w-14 shrink-0 rounded-xl bg-white" aria-hidden="true" />
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-sm font-bold">
          {product?.name ?? "Produto removido"}
        </p>
        <p className="text-xs text-brand-gray-dark">Quantidade: {item.quantity}</p>
      </div>
    </>
  );

  return (
    <li>
      {product?._id ? (
        <Link
          to={`/produtos/${product._id}`}
          className="flex items-center gap-3 hover:text-brand-purple"
        >
          {content}
        </Link>
      ) : (
        <div className="flex items-center gap-3">{content}</div>
      )}
    </li>
  );
}

export default function MyOrders() {
  const { user } = useAuth();
  const { orders, loading, error, retry } = useOrders();

  // O admin recebe TODOS os pedidos do backend, então filtramos pelo id
  // do usuário logado. Para usuário comum o filtro não muda nada.
  const mine = useMemo(() => {
    const userId = String(user?._id ?? user?.id);
    return orders
      .filter((o) => String(o.user?._id ?? o.user) === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [orders, user]);

  if (error) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-16">
        <Alert type="error">{error}</Alert>
        <Button variant="outline" onClick={retry}>
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <section className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 md:py-12">
      <header>
        <h1 className="font-display text-2xl font-bold md:text-3xl">Meus pedidos</h1>
        {!loading && mine.length > 0 && (
          <p className="text-sm text-brand-gray-dark">
            {mine.length} {mine.length === 1 ? "pedido realizado" : "pedidos realizados"}
          </p>
        )}
      </header>

      {loading ? (
        <div className="flex flex-col gap-4" aria-hidden="true">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl bg-brand-gray" />
          ))}
        </div>
      ) : mine.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <Package size={48} className="text-brand-gray-dark" aria-hidden="true" />
          <h2 className="font-display text-xl font-bold">Você ainda não fez pedidos</h2>
          <p className="text-sm text-brand-gray-dark">
            Quando comprar algo, o pedido aparece aqui.
          </p>
          <Link to="/">
            <Button>Ver produtos</Button>
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {mine.map((o) => (
            <li key={o._id} className="flex flex-col gap-4 rounded-2xl bg-brand-gray p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-sm font-bold">
                    Pedido #{o._id.slice(-6)}
                  </p>
                  <p className="text-xs text-brand-gray-dark">{formatDate(o.createdAt)}</p>
                </div>
                <StatusBadge status={o.status} />
              </div>

              <ul className="flex flex-col gap-3 border-t border-white pt-4">
                {o.items.map((item, i) => (
                  <OrderItem key={i} item={item} />
                ))}
              </ul>

              <div className="flex items-center justify-between border-t border-white pt-4 font-display font-bold">
                <span>Total</span>
                <span className="text-lg">{formatPrice(o.totalAmount)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}