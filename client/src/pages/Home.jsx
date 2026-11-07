import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import useProducts from "../hooks/useProducts";
import { normalize } from "../utils/format";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import CategoryGrid from "../components/CategoryGrid";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";

export default function Home() {
  const { products, loading, error, retry } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? "";
  const activeCategory = normalize(category);

  // Atualiza um parâmetro da URL preservando os outros
  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  // Categorias derivadas dos produtos (agrupa "Canecas" e "canecas")
  const categories = useMemo(() => {
    const map = new Map();
    products.forEach((p) => {
      const key = normalize(p.category);
      if (!key) return;
      if (!map.has(key)) map.set(key, { key, name: p.category, image: p.imageUrl });
    });
    return [...map.values()];
  }, [products]);

  const filtered = useMemo(() => {
    const term = normalize(search);
    return products.filter((p) => {
      const matchCategory = !activeCategory || normalize(p.category) === activeCategory;
      const matchSearch =
        !term || normalize(`${p.name} ${p.description}`).includes(term);
      return matchCategory && matchSearch;
    });
  }, [products, search, activeCategory]);

  const hasFilters = Boolean(search || category);

  const clearFilters = () => setSearchParams({});

  return (
    <>
      {/* Banner */}
      <section
        className="bg-brand-ink px-4 py-14 md:py-24"
        style={{
          backgroundImage:
            "linear-gradient(rgba(143,255,36,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(143,255,36,.07) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      >
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6">
          <h1 className="font-display text-4xl font-black leading-tight text-brand-pink md:text-6xl">
            Hora de abraçar seu{" "}
            <span className="text-brand-green">lado geek!</span>
          </h1>
          <a href="#produtos">
            <Button>Ver as novidades!</Button>
          </a>
        </div>
      </section>

      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-10 md:py-16">
        {/* Categorias */}
        <section aria-labelledby="categorias-titulo">
          <h2
            id="categorias-titulo"
            className="text-center font-display text-2xl font-bold md:text-3xl"
          >
            Categorias
          </h2>
          <p className="mx-auto mb-6 mt-2 max-w-2xl text-center text-sm text-brand-gray-dark md:text-base">
            De roupas a gadgets tecnológicos, temos tudo para atender suas
            paixões e hobbies com estilo e autenticidade.
          </p>
          <CategoryGrid
            categories={categories}
            loading={loading}
            active={activeCategory}
            onSelect={(name) => updateParam("category", name)}
          />
        </section>

        {/* Produtos */}
        <section id="produtos" aria-labelledby="produtos-titulo" className="scroll-mt-28">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h2 id="produtos-titulo" className="font-display text-2xl font-bold md:text-3xl">
              {search ? `Resultados para "${search}"` : category || "Todos os produtos"}
            </h2>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="text-sm font-semibold text-brand-purple underline"
              >
                Limpar filtros
              </button>
            )}
          </div>

          {error ? (
            <div className="flex flex-col items-center gap-4 py-10">
              <div className="w-full max-w-md">
                <Alert type="error">{error}</Alert>
              </div>
              <Button variant="outline" onClick={retry}>
                Tentar novamente
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
              {loading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))
                : filtered.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <p className="py-10 text-center text-brand-gray-dark">
              {hasFilters
                ? "Nenhum produto encontrado para esses filtros."
                : "Ainda não há produtos cadastrados."}
            </p>
          )}
        </section>
      </div>
    </>
  );
}