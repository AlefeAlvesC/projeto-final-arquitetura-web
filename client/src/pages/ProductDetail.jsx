import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import useProducts from "../hooks/useProducts";
import { useAuth } from "../context/AuthContext";
import { toCartItem, useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import QuantitySelector from "../components/ui/QuantitySelector";

export default function ProductDetail() {
  const { id } = useParams();
  const { products, loading, error, retry } = useProducts();
  const { user } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const product = products.find((p) => p._id === id);

  // Sem login, manda para o /login e volta para esta página depois
  const requireLogin = () => {
    if (user) return true;
    navigate("/login", { state: { from: location } });
    return false;
  };

  const handleAdd = () => {
    if (!requireLogin()) return;
    addItem(product, quantity);
    setAdded(true);
  };

  const handleBuyNow = () => {
    if (!requireLogin()) return;
    navigate("/checkout", { state: { items: [toCartItem(product, quantity)] } });
  };

  const handleQuantity = (value) => {
    setQuantity(value);
    setAdded(false);
  };

  const backLink = (
    <Link
      to="/"
      className="inline-flex items-center gap-2 text-sm font-semibold text-brand-purple hover:underline"
    >
      <ArrowLeft size={16} /> Voltar aos produtos
    </Link>
  );

  if (loading) {
    return (
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 md:grid-cols-2 md:py-12" aria-hidden="true">
        <div className="aspect-square animate-pulse bg-brand-gray" />
        <div className="flex flex-col gap-4">
          <div className="h-8 w-3/4 animate-pulse rounded bg-brand-gray" />
          <div className="h-10 w-1/3 animate-pulse rounded bg-brand-gray" />
          <div className="h-24 animate-pulse rounded bg-brand-gray" />
        </div>
      </div>
    );
  }

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

  if (!product) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-16 text-center">
        <p>Produto não encontrado.</p>
        {backLink}
      </div>
    );
  }

  const outOfStock = product.stock <= 0;

  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:py-12">
      {backLink}

      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        <div className="relative aspect-square bg-brand-gray">
          <img
            src={product.imageUrl}
            alt={product.name}
            className={`h-full w-full object-contain p-4 ${outOfStock ? "opacity-50" : ""}`}
          />
          {outOfStock && (
            <span className="absolute left-3 top-3 rounded-full bg-brand-pink px-3 py-1 text-xs font-semibold">
              Esgotado
            </span>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <p className="text-sm font-semibold text-brand-purple">{product.category}</p>
            <h1 className="mt-1 font-display text-2xl font-bold md:text-4xl">
              {product.name}
            </h1>
          </div>

          <p className="font-display text-3xl font-bold">{formatPrice(product.price)}</p>

          <p className="text-sm leading-relaxed text-brand-gray-dark md:text-base">
            {product.description}
          </p>

          <p className="text-sm">
            {outOfStock ? (
              <span className="font-semibold text-brand-purple-dark">Produto esgotado</span>
            ) : product.stock <= 5 ? (
              <span className="font-semibold text-brand-purple-dark">
                Restam apenas {product.stock} unidades!
              </span>
            ) : (
              <span className="text-brand-gray-dark">{product.stock} unidades disponíveis</span>
            )}
          </p>

          {!outOfStock && (
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold">Quantidade</span>
              <QuantitySelector
                value={quantity}
                onChange={handleQuantity}
                max={product.stock}
              />
            </div>
          )}

          {added && (
            <Alert type="success">
              Produto adicionado ao carrinho!{" "}
              <Link to="/cart" className="underline">
                Ver carrinho
              </Link>
            </Alert>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={handleAdd} disabled={outOfStock} className="sm:flex-1">
              <ShoppingCart size={18} /> Adicionar ao carrinho
            </Button>
            <Button
              variant="outline"
              onClick={handleBuyNow}
              disabled={outOfStock}
              className="sm:flex-1"
            >
              Comprar agora
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}