import { Check, X } from "lucide-react";

export default function Alert({ type = "error", children }) {
  const isSuccess = type === "success";
  const Icon = isSuccess ? Check : X;

  return (
    <div
      role={isSuccess ? "status" : "alert"}
      className={`flex items-center justify-between gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-brand-ink ${
        isSuccess ? "bg-brand-green" : "bg-brand-pink"
      }`}
    >
      <span>{children}</span>
      <Icon size={16} aria-hidden="true" />
    </div>
  );
}