import { Package, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const urgencyItems = [
  {
    icon: Package,
    text: "São apenas 10 mil pares no primeiro lote",
  },
  {
    icon: Users,
    text: "Mais de 50.000 pessoas aguardando",
  },
];

export function UrgencySection() {
  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-10 sm:py-12" aria-labelledby="urgency-heading">
      <div className="text-center">
        <h2
          id="urgency-heading"
          className="inline-block text-lg font-semibold text-[#2B9402] px-4 py-2 rounded-2xl bg-[#FFF2C9] w-fit mb-10 sm:mb-12"
        >
          Por que a urgência é real
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
        {urgencyItems.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-start justify-between bg-primary rounded-2xl p-5 sm:p-10 min-h-[180px] sm:min-h-[280px] text-left"
          >
            <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 bg-secondary/20 rounded-full flex items-center justify-center">
              <item.icon className="w-6 h-6 sm:w-8 sm:h-8 text-secondary" />
            </div>
            <span className="text-base sm:text-lg text-white leading-snug font-medium max-w-[220px] sm:max-w-[280px]">{item.text}</span>
          </div>
        ))}
      </div>
      <div className="mt-10 sm:mt-14 text-center">
        <Button
          asChild
          className="w-auto px-12 sm:px-16 py-6 sm:py-7 text-base font-semibold rounded-full bg-black hover:bg-black/90 text-white uppercase tracking-wide"
        >
          <a href="https://www.usepedireito.com.br/" target="_blank" rel="noopener noreferrer">
            Entrar na lista de espera
          </a>
        </Button>
      </div>
    </section>
  );
}
