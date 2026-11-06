import { Link } from "react-router-dom";

export default function Logo({ light = false }) {
  return (
    <Link
      to="/"
      className={`font-display text-xl font-black leading-none ${
        light ? "text-brand-green" : "text-brand-ink"
      }`}
      aria-label="GeekVerse Store - Página inicial"
    >
      Geek<span className={light ? "text-white" : "text-brand-purple"}>Verse</span>
      <span className="block text-[10px] font-medium tracking-[0.3em]">STORE</span>
    </Link>
  );
}