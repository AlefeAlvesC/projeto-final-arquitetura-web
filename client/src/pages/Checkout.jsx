import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import Spinner from "../components/ui/Spinner";

// Atenção: o model Order ainda não guarda a forma de pagamento,
// então ela é apenas visual por enquanto.
const paymentOptions = ["Pix", "Cartão de crédito", "Boleto"];

export default function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { removeItems } = useCart();

  const items = state?.items;
  const fromCart = Boolean(state?.fromCart);

  const [payment, setPayment] = useState(paymentOptions[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [paidTotal, setPaidTotal] = useState(0);

  // Abriu /checkout direto, sem itens
  if (!items?.length && !done) return <Navigate to="/cart" replace />;

  const total = (items ?? []).reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleConfirm = async () => {
    setLoading(true);
    setError("");
    try {
      await api.post("/orders", {
        items: items.map(({ productId, quantity }) => ({
          product: productId,
          quantity,
        })),
        totalAmount: total,
      });

      // Só limpa o carrinho se a compra veio dele ("Comprar agora" não mexe no carrinho)
      if (fromCart) removeItems(items.map((i) => i.productId));
      setPaidTotal(total);
      setDone(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Não foi possível concluir a compra. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <section className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-green">
          <Check size={32} aria-hidden="true" />
        </div>
        <h1 className="font-display text-2xl font-bold">Pedido realizado!</h1>
        <p className="text-sm text-brand-gray-dark">
          Seu pedido no valor de <strong>{formatPrice(paidTotal)}</strong> foi
          registrado. Obrigado por comprar na GeekVerse Store.
        </p>
        <Link to="/">
          <Button>Continuar comprando</Button>
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 md:py-12">
      <h1 className="font-display text-2xl font-bold md:text-3xl">Finalizar compra</h1>

      <ul className="flex flex-col gap-3">
        {items.map((item) => (
          <li
            key={item.productId}
            className="flex items-center gap-3 rounded-2xl bg-brand-gray p-3"
          >
            <img
              src={item.imageUrl}
              alt=""
              className="h-16 w-16 shrink-0 rounded-xl bg-white object-contain"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-sm font-bold">{item.name}</p>
              <p className="text-xs text-brand-gray-dark">
                {item.quantity} × {formatPrice(item.price)}
              </p>
            </div>
            <p className="font-display font-bold">
              {formatPrice(item.price * item.quantity)}
            </p>
          </li>
        ))}
      </ul>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-sm font-semibold">Forma de pagamento</legend>
        {paymentOptions.map((option) => (
          <label key={option} className="flex cursor-pointer items-center gap-3 text-sm">
            <input
              type="radio"
              name="payment"
              value={option}
              checked={payment === option}
              onChange={() => setPayment(option)}
              className="h-4 w-4 accent-brand-purple"
            />
            {option}
          </label>
        ))}
      </fieldset>

      <div className="flex items-center justify-between border-t border-brand-gray pt-4 font-display text-xl font-bold">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          variant="outline"
          onClick={() => navigate(fromCart ? "/cart" : -1)}
          disabled={loading}
        >
          Voltar
        </Button>
        <Button onClick={handleConfirm} disabled={loading}>
          {loading ? <Spinner /> : "Confirmar compra"}
        </Button>
      </div>
    </section>
  );
}