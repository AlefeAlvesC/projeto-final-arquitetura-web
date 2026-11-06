import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "./ui/Spinner";

export default function ProtectedAdminRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="h-8 w-8 text-brand-purple" />
      </div>
    );
  }

  // Não logado: manda para o login e guarda de onde veio
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  // Logado, mas sem permissão
  if (user.role !== "admin") return <Navigate to="/" replace />;

  return children;
}