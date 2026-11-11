import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import api from "../services/api";
import useProducts from "../hooks/useProducts";
import { formatPrice } from "../utils/format";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import Spinner from "../components/ui/Spinner";
import Modal from "../components/ui/Modal";
import ProductForm from "../components/admin/ProductForm";
import StatCard from "../components/admin/StatCard";
import OrdersPanel from "../components/admin/OrdersPanel";

function RowActions({ product, onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onEdit(product)}
        aria-label={`Editar ${product.name}`}
        className="rounded-full p-2 text-brand-purple hover:bg-brand-gray"
      >
        <Pencil size={18} />
      </button>
      <button
        onClick={() => onDelete(product)}
        aria-label={`Excluir ${product.name}`}
        className="rounded-full p-2 text-brand-purple-dark hover:bg-brand-pink/30"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}

export default function AdminDashboard() {
  const { products, loading, error, retry } = useProducts();

  // modal: null | { type: "form", product: obj|null } | { type: "delete", product: obj }
  const [modal, setModal] = useState(null);
  const [feedback, setFeedback] = useState(null); // { type, message }
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [tab, setTab] = useState("produtos");

  // Esconde a mensagem de sucesso sozinha
  useEffect(() => {
    if (!feedback) return;
    const id = setTimeout(() => setFeedback(null), 4000);
    return () => clearTimeout(id);
  }, [feedback]);

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category).filter(Boolean))],
    [products]
  );

  const stats = useMemo(
    () => ({
      total: products.length,
      outOfStock: products.filter((p) => p.stock <= 0).length,
      units: products.reduce((sum, p) => sum + (Number(p.stock) || 0), 0),
    }),
    [products]
  );

  const closeModal = () => {
    setModal(null);
    setDeleteError("");
  };

  const handleSave = async (payload) => {
    const editing = modal?.product;
    if (editing) {
      await api.put(`/products/${editing._id}`, payload);
    } else {
      await api.post("/products", payload);
    }
    closeModal();
    setFeedback({
      type: "success",
      message: editing ? "Produto atualizado!" : "Produto cadastrado!",
    });
    retry();
  };

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError("");
    try {
      await api.delete(`/products/${modal.product._id}`);
      closeModal();
      setFeedback({ type: "success", message: "Produto excluído!" });
      retry();
    } catch (err) {
      setDeleteError(
        err.response?.data?.message || "Não foi possível excluir. Tente novamente."
      );
    } finally {
      setDeleting(false);
    }
  };

  const openEdit = (product) => setModal({ type: "form", product });
  const openDelete = (product) => setModal({ type: "delete", product });

  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:py-12">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold md:text-3xl">Painel Admin</h1>
          <p className="text-sm text-brand-gray-dark">
            Gerencie os produtos e acompanhe as vendas da loja.
          </p>
        </div>
        {tab === "produtos" && (
          <Button onClick={() => setModal({ type: "form", product: null })}>
            <Plus size={18} /> Novo produto
          </Button>
        )}
      </header>

      <div role="tablist" className="flex gap-2 border-b border-brand-gray">
        {[
          ["produtos", "Produtos"],
          ["pedidos", "Pedidos"],
        ].map(([key, label]) => (
          <button
            key={key}
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={`-mb-px border-b-4 px-4 py-2 font-display text-sm font-bold transition-colors ${
              tab === key
                ? "border-brand-purple text-brand-purple"
                : "border-transparent text-brand-gray-dark hover:text-brand-ink"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "pedidos" && <OrdersPanel />}

      {tab === "produtos" && (
        <>
          {feedback && <Alert type={feedback.type}>{feedback.message}</Alert>}
    
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            <StatCard label="Produtos" value={stats.total} />
            <StatCard label="Esgotados" value={stats.outOfStock} />
            <StatCard label="Unidades em estoque" value={stats.units} />
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
          ) : loading ? (
            <div className="flex flex-col gap-3" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-20 animate-pulse rounded-2xl bg-brand-gray" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <p className="py-10 text-center text-brand-gray-dark">
              Nenhum produto cadastrado. Clique em "Novo produto" para começar.
            </p>
          ) : (
            <>
              {/* Mobile: cards */}
              <ul className="flex flex-col gap-3 md:hidden">
                {products.map((p) => (
                  <li
                    key={p._id}
                    className="flex items-center gap-3 rounded-2xl bg-brand-gray p-3"
                  >
                    <img
                      src={p.imageUrl}
                      alt=""
                      className="h-16 w-16 shrink-0 rounded-xl bg-white object-contain"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-sm font-bold">{p.name}</p>
                      <p className="text-xs text-brand-gray-dark">{p.category}</p>
                      <p className="text-sm font-semibold">
                        {formatPrice(p.price)} ·{" "}
                        <span className={p.stock <= 0 ? "text-brand-purple-dark" : ""}>
                          {p.stock <= 0 ? "Esgotado" : `${p.stock} un.`}
                        </span>
                      </p>
                    </div>
                    <RowActions product={p} onEdit={openEdit} onDelete={openDelete} />
                  </li>
                ))}
              </ul>
    
              {/* Desktop: tabela */}
              <div className="hidden overflow-x-auto rounded-2xl border border-brand-gray md:block">
                <table className="w-full text-left text-sm">
                  <thead className="bg-brand-ink text-white">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Produto</th>
                      <th className="px-4 py-3 font-semibold">Categoria</th>
                      <th className="px-4 py-3 font-semibold">Preço</th>
                      <th className="px-4 py-3 font-semibold">Estoque</th>
                      <th className="px-4 py-3 font-semibold">
                        <span className="sr-only">Ações</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p._id} className="border-t border-brand-gray hover:bg-brand-gray/50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.imageUrl}
                              alt=""
                              className="h-12 w-12 rounded-lg bg-brand-gray object-contain"
                            />
                            <span className="font-semibold">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">{p.category}</td>
                        <td className="px-4 py-3">{formatPrice(p.price)}</td>
                        <td className="px-4 py-3">
                          {p.stock <= 0 ? (
                            <span className="rounded-full bg-brand-pink px-3 py-1 text-xs font-semibold">
                              Esgotado
                            </span>
                          ) : (
                            p.stock
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <RowActions product={p} onEdit={openEdit} onDelete={openDelete} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
    
          {/* Modal: criar / editar */}
          {modal?.type === "form" && (
            <Modal
              title={modal.product ? "Editar produto" : "Novo produto"}
              onClose={closeModal}
            >
              <ProductForm
                product={modal.product}
                categories={categories}
                onSubmit={handleSave}
                onCancel={closeModal}
              />
            </Modal>
          )}
    
          {/* Modal: confirmar exclusão */}
          {modal?.type === "delete" && (
            <Modal title="Excluir produto" onClose={closeModal}>
              <div className="flex flex-col gap-4">
                {deleteError && <Alert type="error">{deleteError}</Alert>}
                <p className="text-sm">
                  Tem certeza que deseja excluir <strong>{modal.product.name}</strong>? Essa
                  ação não pode ser desfeita.
                </p>
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <Button variant="outline" onClick={closeModal} disabled={deleting}>
                    Cancelar
                  </Button>
                  <Button variant="danger" onClick={handleDelete} disabled={deleting}>
                    {deleting ? <Spinner /> : "Excluir"}
                  </Button>
                </div>
              </div>
            </Modal>
          )}
        </>
      )}

    </section>
  );
}