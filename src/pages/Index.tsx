import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { useCountdown } from "@/hooks/useCountdown";
import { CountdownTimer } from "@/components/CountdownTimer";
import { PreparationChecklist } from "@/components/PreparationChecklist";
import { LaunchDateBanner } from "@/components/LaunchDateBanner";
import { UrgencySection } from "@/components/UrgencySection";
import { ProductGallery } from "@/components/ProductGallery";
import { Button } from "@/components/ui/button";
import pedireitoLogo from "@/assets/pedireito-logo.svg";

const Index = () => {
  const { timeLeft, isExpired, targetDate } = useCountdown();

  const handleCtaClick = () => {
    if (isExpired) {
      window.location.href = "https://www.usepedireito.com.br/";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero – fundo amarelo */}
      <header className="bg-secondary py-16 sm:py-20 md:py-24 px-4 sm:px-6">
        <div className="max-w-[768px] mx-auto text-center">
          <img
            src={pedireitoLogo}
            alt="Pé Direito"
            className="h-8 sm:h-10 mx-auto"
          />
        </div>
        {/* Imagem fora do container, maior que o conteúdo */}
        <div className="mt-12 sm:mt-16 w-full flex justify-center">
          <img
            src="/Banner_Chinelo.gif"
            alt="Pé Direito – produto"
            className="w-auto max-h-[800px] sm:max-h-[920px] md:max-h-[1000px] object-contain"
            style={{ maxWidth: "min(1100px, 95vw)" }}
          />
        </div>
        <div className="max-w-[768px] mx-auto text-center mt-12 sm:mt-16">
          <div className="flex justify-center px-2 sm:px-4">
            <CountdownTimer timeLeft={timeLeft} />
          </div>
          <Button
            onClick={handleCtaClick}
            disabled={!isExpired}
            className={`mt-12 sm:mt-16 w-auto px-8 sm:px-10 py-5 sm:py-6 text-base font-semibold rounded-full transition-all inline-flex items-center justify-center gap-2 ${
              isExpired
                ? "bg-black hover:bg-black/90 text-white"
                : "bg-black text-white cursor-not-allowed opacity-90"
            }`}
          >
            {!isExpired && <Lock className="h-5 w-5 shrink-0" aria-hidden />}
            {isExpired ? "Compre agora!" : "A pré venda começa 9h"}
          </Button>
          <p className="mt-5 text-sm text-foreground/90">
            {isExpired
              ? "Corra! As unidades são limitadas."
              : "Este botão ficará ativo no horário de abertura"}
          </p>
        </div>
      </header>

      {/* Banner azul – data */}
      <LaunchDateBanner date={targetDate} />

      {/* O que fazer agora + Urgência + Galeria – fundo bege */}
      <main className="flex-1 bg-[#FCF8ED] pt-4 sm:pt-6 md:pt-8 pb-0">
        <PreparationChecklist />
        <UrgencySection />
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
            Horário de Brasília. Sem prorrogação.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
