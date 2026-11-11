import { useEffect, useState } from "react";
import api from "../services/api";

export default function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    api
      .get("/orders", { signal: controller.signal })
      .then(({ data }) => {
        setOrders(Array.isArray(data) ? data : data.orders ?? []);
      })
      .catch((err) => {
        if (err.code === "ERR_CANCELED") return;
        setError(
          err.response?.data?.message ||
            "Não foi possível carregar os pedidos. Tente novamente."
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

  return { orders, loading, error, retry };
}