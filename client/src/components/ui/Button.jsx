const variants = {
  primary:
    "bg-brand-purple text-white hover:bg-brand-purple-dark focus-visible:outline-brand-pink",
  outline:
    "border-2 border-brand-purple-dark text-brand-purple-dark hover:bg-brand-purple-dark hover:text-white",
};

export default function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}