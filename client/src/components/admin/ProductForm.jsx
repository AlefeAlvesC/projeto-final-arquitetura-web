import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Alert from "../ui/Alert";
import Spinner from "../ui/Spinner";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  stock: "0",
  imageUrl: "",
};

const isValidUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

export default function ProductForm({ product, categories, onSubmit, onCancel }) {
  const [form, setForm] = useState(
    product
      ? {
          name: product.name,
          description: product.description,
          price: String(product.price),
          category: product.category,
          stock: String(product.stock),
          imageUrl: product.imageUrl,
        }
      : emptyForm
  );
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validate = () => {
    const errors = {};
    if (form.name.trim().length < 3) errors.name = "Informe o nome do produto.";
    if (!form.description.trim()) errors.description = "Informe uma descrição.";
    if (!(Number(form.price) > 0)) errors.price = "Informe um preço maior que zero.";
    if (!form.category.trim()) errors.category = "Informe a categoria.";
    const stock = Number(form.stock);
    if (!Number.isInteger(stock) || stock < 0)
      errors.stock = "O estoque deve ser um número inteiro (0 ou mais).";
    if (!isValidUrl(form.imageUrl.trim()))
      errors.imageUrl = "Informe uma URL válida (começando com http).";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      await onSubmit({
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        category: form.category.trim(),
        stock: Number(form.stock),
        imageUrl: form.imageUrl.trim(),
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Não foi possível salvar o produto. Tente novamente."
      );
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      {error && <Alert type="error">{error}</Alert>}

      <Input
        id="name"
        name="name"
        label="Nome"
        placeholder="Ex.: Camiseta Capy"
        value={form.name}
        onChange={handleChange}
        error={fieldErrors.name}
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="text-sm font-semibold">
          Descrição
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          placeholder="Descreva o produto"
          value={form.description}
          onChange={handleChange}
          aria-invalid={!!fieldErrors.description}
          className={`w-full resize-none rounded-3xl border-2 bg-white px-5 py-3 text-sm outline-none transition-colors placeholder:text-brand-gray-dark/60 focus:border-brand-pink ${
            fieldErrors.description ? "border-brand-pink" : "border-brand-ink"
          }`}
        />
        {fieldErrors.description && (
          <p className="px-2 text-xs text-brand-purple-dark">{fieldErrors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          id="price"
          name="price"
          type="number"
          min="0"
          step="0.01"
          inputMode="decimal"
          label="Preço (R$)"
          placeholder="28.00"
          value={form.price}
          onChange={handleChange}
          error={fieldErrors.price}
        />
        <Input
          id="stock"
          name="stock"
          type="number"
          min="0"
          step="1"
          inputMode="numeric"
          label="Estoque"
          value={form.stock}
          onChange={handleChange}
          error={fieldErrors.stock}
        />
      </div>

      <Input
        id="category"
        name="category"
        label="Categoria"
        placeholder="Ex.: Canecas"
        list="category-options"
        value={form.category}
        onChange={handleChange}
        error={fieldErrors.category}
      />
      <datalist id="category-options">
        {categories.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>

      <Input
        id="imageUrl"
        name="imageUrl"
        type="url"
        label="URL da imagem"
        placeholder="https://..."
        value={form.imageUrl}
        onChange={handleChange}
        error={fieldErrors.imageUrl}
      />

      {isValidUrl(form.imageUrl.trim()) && (
        <div className="flex h-32 items-center justify-center rounded-2xl bg-brand-gray">
          <img
            src={form.imageUrl}
            alt="Pré-visualização do produto"
            className="h-full object-contain p-2"
          />
        </div>
      )}

      <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? <Spinner /> : product ? "Salvar alterações" : "Cadastrar produto"}
        </Button>
      </div>
    </form>
  );
}