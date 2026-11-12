import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";
import { useCart } from "../context/CartContext";

function CartLink({ count }) {
  return (
    <Link
      to="/cart"
      aria-label={`Carrinho, ${count} ${count === 1 ? "item" : "itens"}`}
      className="relative hover:text-brand-purple"
    >
      <ShoppingCart size={22} />
      {count > 0 && (
        <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-pink px-1 text-[10px] font-bold text-brand-ink">
          {count}
        </span>
      )}
    </Link>
  );
}

function SearchBar({ className = "", onSearch }) {
  const [term, setTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(term.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className={`flex items-center rounded-full bg-brand-gray px-5 py-2.5 focus-within:ring-2 focus-within:ring-brand-pink ${className}`}
    >
      <input
        type="search"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="O que você procura?"
        aria-label="Buscar produtos"
        className="w-full bg-transparent text-sm outline-none placeholder:text-brand-gray-dark"
      />
      <button type="submit" aria-label="Buscar" className="text-brand-ink">
        <Search size={18} />
      </button>
    </form>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleSearch = (term) => {
    closeMenu();
    navigate(term ? `/?search=${encodeURIComponent(term)}` : "/");
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/");
  };

  const linkClass =
    "flex items-center gap-2 text-sm font-semibold hover:text-brand-purple transition-colors";

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 md:flex-nowrap md:gap-6">
        <Logo />

        {/* Desktop: links + busca */}
        {/* 
        <Link to="/sobre" className={`${linkClass} hidden md:flex`}>
          Sobre nós
        </Link>
        */}
        <SearchBar onSearch={handleSearch} className="hidden flex-1 md:flex" />

        {/* Desktop: ações */}
        <nav className="hidden items-center gap-5 md:flex" aria-label="Principal">
          {user ? (
            <>
              {user.role === "admin" && (
                <Link to="/admin" className={linkClass}>
                  <LayoutDashboard size={18} /> Painel Admin
                </Link>
              )}
              <Link to="/meus-pedidos" className={linkClass}>
                <Package size={18} /> Meus pedidos
              </Link>
              <span className="flex items-center gap-2 text-sm">
                <User size={20} />
                {user.name?.split(" ")[0]}
              </span>
              <button onClick={handleLogout} className={linkClass}>
                <LogOut size={18} /> Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={linkClass}>
                Login
              </Link>
              <Link to="/register" className={linkClass}>
                <User size={20} /> Cadastrar
              </Link>
            </>
          )}
          <CartLink count={count} />
        </nav>

        {/* Mobile: carrinho + hambúrguer */}
        <div className="flex items-center gap-4 md:hidden">
          <CartLink count={count} />
          <button
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile: busca sempre visível */}
        <SearchBar onSearch={handleSearch} className="w-full md:hidden" />
      </div>

      {/* Mobile: menu expansível */}
      {menuOpen && (
        <nav
          className="flex flex-col gap-4 border-t border-brand-gray bg-white px-4 py-4 md:hidden"
          aria-label="Menu mobile"
        >
          {/*
          <Link to="/sobre" onClick={closeMenu} className={linkClass}>
            Sobre nós
          </Link>
          */}
          {user ? (
            <>
              <span className="flex items-center gap-2 text-sm text-brand-gray-dark">
                <User size={18} /> Olá, {user.name?.split(" ")[0]}
              </span>
              {user.role === "admin" && (
                <Link to="/admin" onClick={closeMenu} className={linkClass}>
                  <LayoutDashboard size={18} /> Painel Admin
                </Link>
              )}
              <Link to="/meus-pedidos" onClick={closeMenu} className={linkClass}>
                <Package size={18} /> Meus pedidos
              </Link>
              <button onClick={handleLogout} className={linkClass}>
                <LogOut size={18} /> Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu} className={linkClass}>
                Login
              </Link>
              <Link to="/register" onClick={closeMenu} className={linkClass}>
                Cadastrar
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}