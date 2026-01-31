import { Link } from "react-router-dom";
import pedireitoLogo from "@/assets/pedireito-logo.svg";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
  <div className="min-h-screen flex flex-col">
    <header className="bg-primary py-8 px-6 sm:px-8">
      <div className="max-w-[600px] mx-auto text-center">
        <Link to="/" className="inline-block" aria-label="Pé Direito - início">
          <img
            src={pedireitoLogo}
            alt="Pé Direito"
            className="h-8 sm:h-9 mx-auto brightness-0 invert"
          />
        </Link>
        <p className="text-xs sm:text-sm text-primary-foreground/70 mt-3 tracking-wide">
          Ditado Popular. Identidade Brasileira. Liberdade de Escolha.
        </p>
      </div>
    </header>

    <main className="flex-1 bg-muted">{children}</main>

    <footer className="bg-[#2B9402] py-10 px-6 sm:py-12 sm:px-8 -mt-px">
      <div className="max-w-[600px] mx-auto text-center space-y-4">
        <div className="flex justify-center gap-6 text-sm font-medium">
          <Link
            to="/"
            className="text-secondary hover:text-secondary/90 transition-colors uppercase tracking-wide"
          >
            Home
          </Link>
          <Link
            to="/faq"
            className="text-secondary hover:text-secondary/90 transition-colors uppercase tracking-wide"
          >
            FAQ
          </Link>
          <Link
            to="/faq#suporte"
            className="text-secondary hover:text-secondary/90 transition-colors uppercase tracking-wide"
          >
            Suporte
          </Link>
        </div>
        <p className="text-xs text-secondary/80">
          Horário de Brasília. Sem prorrogação.
        </p>
      </div>
    </footer>
  </div>
);

export { Layout };
