import { Clock, Mail, Phone } from "lucide-react";
import Logo from "./Logo";

const payments = ["Visa", "Mastercard", "Elo", "Pix", "Boleto"];
const socials = [
  { label: "WhatsApp", href: "https://wa.me/" },
  { label: "Instagram", href: "https://instagram.com/" },
  { label: "TikTok", href: "https://tiktok.com/" },
];

function Column({ title, children }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-display text-sm font-bold text-white">{title}</h3>
      {children}
    </div>
  );
}

const listClass = "flex flex-col gap-2 text-sm text-white/80";

export default function Footer() {
  return (
    <footer>

      <div className="bg-brand-ink px-4 pb-6 pt-10 text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-3">
              <Logo light />
              <p className="text-sm text-brand-green">Hora de abraçar seu lado geek!</p>
            </div>

            <Column title="Funcionamento">
              <ul className={listClass}>
                <li className="flex items-center gap-2">
                  <Clock size={16} aria-hidden="true" /> Segunda a Sexta - 8h às 18h
                </li>
                <li className="flex items-center gap-2">
                  <Mail size={16} aria-hidden="true" />
                  <a href="mailto:sac@geekverse.com.br" className="hover:text-brand-green">
                    sac@geekverse.com.br
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone size={16} aria-hidden="true" /> 0800 541 320
                </li>
              </ul>
            </Column>

            <Column title="Institucional">
              <ul className={listClass}>
                <li>Sobre nós</li>
                <li>Contato</li>
                <li>Política de Privacidade</li>
                <li>LGPD - Lei de proteção de dados</li>
              </ul>
            </Column>

            <Column title="Informações">
              <ul className={listClass}>
                <li>Entregas</li>
                <li>Garantia</li>
                <li>Trocas e devoluções</li>
              </ul>
            </Column>
          </div>

          <div className="flex flex-col gap-6 border-t border-white/20 pt-6 md:flex-row md:justify-between">
            <Column title="Formas de pagamento">
              <ul className="flex flex-wrap gap-2" aria-label="Formas de pagamento aceitas">
                {payments.map((p) => (
                  <li
                    key={p}
                    className="rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-brand-ink"
                  >
                    {p}
                  </li>
                ))}
              </ul>
            </Column>

            <Column title="Siga nossas redes:">
              <ul className="flex flex-wrap gap-3">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-brand-pink px-3 py-1 text-xs font-semibold text-brand-pink transition-colors hover:bg-brand-pink hover:text-brand-ink"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </Column>
          </div>
        </div>
      </div>

      <div className="bg-brand-gray px-4 py-3 text-center text-xs text-brand-gray-dark">
        © {new Date().getFullYear()} GeekVerse Store. Projeto acadêmico fictício, sem fins comerciais.
      </div>
    </footer>
  );
}