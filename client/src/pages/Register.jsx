import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import Spinner from "../components/ui/Spinner";

const initialForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};


export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Validação de UX (o backend continua sendo a validação oficial)
  const validate = () => {
    const errors = {};
    if (form.name.trim().length < 3) errors.name = "Informe seu nome completo.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = "E-mail inválido.";
    if (form.password.length < 6) errors.password = "Mínimo de 6 caracteres.";
    if (form.password !== form.confirmPassword)
      errors.confirmPassword = "As senhas não coincidem.";
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
      const { confirmPassword, ...payload } = form;
      const { data } = await api.post("/auth/register", payload);
      login(data.user, data.token); // <- ajuste se seu AuthContext for diferente
      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Não foi possível concluir o cadastro. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto flex max-w-md flex-col gap-6 px-4 py-10 md:py-16">
      <header className="text-center">
        <h1 className="font-display text-3xl font-bold">Criar conta</h1>
        <p className="mt-2 text-sm text-brand-gray-dark">
          Junte-se ao GeekVerse e ganhe descontos exclusivos.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        {error && <Alert type="error">{error}</Alert>}

        <Input
          id="name"
          name="name"
          label="Nome completo"
          placeholder="Digite seu nome"
          autoComplete="name"
          value={form.name}
          onChange={handleChange}
          error={fieldErrors.name}
        />
        <Input
          id="email"
          name="email"
          type="email"
          label="E-mail"
          placeholder="Digite seu melhor endereço de email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          error={fieldErrors.email}
        />
        <Input
          id="password"
          name="password"
          type="password"
          label="Senha"
          placeholder="Mínimo de 6 caracteres"
          autoComplete="new-password"
          value={form.password}
          onChange={handleChange}
          error={fieldErrors.password}
        />
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirmar senha"
          placeholder="Repita a senha"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={handleChange}
          error={fieldErrors.confirmPassword}
        />

        <Button type="submit" disabled={loading} className="mt-2">
          {loading ? <Spinner /> : "Criar conta"}
        </Button>
      </form>

      <p className="text-center text-sm">
        Já tem conta?{" "}
        <Link to="/login" className="font-semibold text-brand-purple underline">
          Faça login
        </Link>
      </p>
    </section>
  );
}