import { useEffect, useState } from "react";
import api from "../services/api";

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    api
      .get("/products", { signal: controller.signal })
      .then(({ data }) => {
        // Aceita tanto [ ... ] quanto { products: [ ... ] }
        setProducts(Array.isArray(data) ? data : data.products ?? []);
      })
      .catch((err) => {
        if (err.code === "ERR_CANCELED") return;
        setError(
          err.response?.data?.message ||
            "Não foi possível carregar os produtos. Tente novamente."
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [attempt]);

  const retry = () => {
    setError("");
    setLoading(true);
    setAttempt((n) => n + 1);
  };

  return { products, loading, error, retry };
}