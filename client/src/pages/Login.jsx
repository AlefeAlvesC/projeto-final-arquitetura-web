import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import Spinner from "../components/ui/Spinner";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", form);
      login(data.user, data.token); // <- ajuste se seu AuthContext for diferente
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Não foi possível entrar. Verifique seus dados e tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto flex max-w-md flex-col gap-6 px-4 py-10 md:py-16">
      <header className="text-center">
        <h1 className="font-display text-3xl font-bold">Login</h1>
        <p className="mt-2 text-sm text-brand-gray-dark">
          Entre para continuar sua jornada geek.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        {error && <Alert type="error">{error}</Alert>}

        <Input
          id="email"
          name="email"
          type="email"
          label="E-mail"
          placeholder="Digite seu melhor endereço de email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <Input
          id="password"
          name="password"
          type="password"
          label="Senha"
          placeholder="Digite sua senha"
          autoComplete="current-password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <Button type="submit" disabled={loading} className="mt-2">
          {loading ? <Spinner /> : "Entrar"}
        </Button>
      </form>

      <p className="text-center text-sm">
        Ainda não tem conta?{" "}
        <Link to="/register" className="font-semibold text-brand-purple underline">
          Cadastre-se
        </Link>
      </p>
    </section>
  );
}