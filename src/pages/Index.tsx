import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { LaunchDateBanner } from "@/components/LaunchDateBanner";
import { RevendedoresForm } from "@/components/RevendedoresForm";
import { RevendedorStickyBar } from "@/components/RevendedorStickyBar";
import { ProductGallery } from "@/components/ProductGallery";
import { Button } from "@/components/ui/button";
import pedireitoLogo from "@/assets/pedireito-logo.svg";

const Index = () => {
  const faixaAzulRef = useRef<HTMLDivElement>(null);
  const [stickyBarVisible, setStickyBarVisible] = useState(false);

  const scrollToForm = () => {
    document.getElementById("questionario-revendedores")?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      const el = faixaAzulRef.current;
      if (!el) return;
      setStickyBarVisible(el.getBoundingClientRect().bottom < 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <RevendedorStickyBar onFillForm={scrollToForm} visible={stickyBarVisible} />
      {/* Hero – fundo amarelo */}
      <header className="bg-secondary py-16 sm:py-20 md:py-24 px-4 sm:px-6">
        <div className="max-w-[768px] mx-auto text-center">
          <img
            src={pedireitoLogo}
            alt="Pé Direito"
            className="h-8 sm:h-10 mx-auto"
          />
        </div>
        <div className="mt-12 sm:mt-16 w-full flex justify-center">
          <img
            src="/Banner_Chinelo.gif"
            alt="Pé Direito – produto"
            className="w-auto max-h-[800px] sm:max-h-[920px] md:max-h-[1000px] object-contain"
            style={{ maxWidth: "min(1100px, 95vw)" }}
          />
        </div>
        <div className="max-w-[768px] mx-auto text-center mt-0 sm:mt-2">
          <Button
            onClick={scrollToForm}
            className="mt-12 sm:mt-16 w-auto px-8 sm:px-10 py-5 sm:py-6 text-base font-semibold rounded-full bg-black hover:bg-black/90 text-white transition-all"
          >
            Quero ser revendedor
          </Button>
          <p className="mt-5 text-sm text-foreground/90">
            Preencha o questionário e nossa equipe entrará em contato.
          </p>
        </div>
      </header>

      {/* Faixa azul – Seja um Revendedor */}
      <div ref={faixaAzulRef}>
        <LaunchDateBanner text="Seja um Revendedor" />
      </div>

      {/* Formulário + Galeria – fundo bege */}
      <main className="flex-1 bg-[#FCF8ED] pt-4 sm:pt-6 md:pt-8 pb-0">
        <div id="questionario-revendedores">
          <RevendedoresForm />
        </div>
        <ProductGallery />
      </main>

      {/* Footer – verde escuro */}
      <footer className="bg-[#2B9402] py-10 px-6 sm:py-12 sm:px-8 -mt-1">
        <div className="max-w-[600px] mx-auto text-center space-y-4">
          <div className="flex justify-center gap-6 text-sm font-medium">
            <Link to="/" className="text-secondary hover:text-secondary/90 transition-colors uppercase tracking-wide">
              Home
            </Link>
            <Link to="/faq" className="text-secondary hover:text-secondary/90 transition-colors uppercase tracking-wide">
              FAQ
            </Link>
            <Link to="/faq#suporte" className="text-secondary hover:text-secondary/90 transition-colors uppercase tracking-wide">
              Suporte
            </Link>
          </div>
          <p className="text-xs text-secondary/80">
            Em breve nossa equipe entrará em contato com você.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
