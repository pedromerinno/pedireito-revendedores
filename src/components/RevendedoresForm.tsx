import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import pedireitoLogo from "@/assets/pedireito-logo.svg";

const revendedorSchema = z.object({
  nomeCompleto: z.string().min(1, "Campo obrigatório"),
  empresaLoja: z.string().optional(),
  cnpj: z.string().optional(),
  cidadeEstado: z.string().min(1, "Campo obrigatório"),
  telefoneWhatsapp: z.string().min(1, "Campo obrigatório"),
  email: z.union([z.literal(""), z.string().email("E-mail inválido")]).optional(),
  instagramRedes: z.string().optional(),
  tempoMercado: z.string().optional(),
  entendeProposito: z.enum(["sim", "nao"]).optional(),
  vendeCalcadosVestuario: z.enum(["sim", "nao"]).optional(),
  formaVenda: z.enum(["fisica", "online", "marketplace", "porta", "mistos"]).optional(),
  oQueChamouAtencao: z.string().optional(),
  seguePadroesMarca: z.enum(["sim", "nao"]).optional(),
  paresPorMes: z.string().optional(),
});

export type RevendedorFormValues = z.infer<typeof revendedorSchema>;

const defaultValues: RevendedorFormValues = {
  nomeCompleto: "",
  empresaLoja: "",
  cnpj: "",
  cidadeEstado: "",
  telefoneWhatsapp: "",
  email: "",
  instagramRedes: "",
  tempoMercado: "",
  entendeProposito: undefined,
  vendeCalcadosVestuario: undefined,
  formaVenda: undefined,
  oQueChamouAtencao: "",
  seguePadroesMarca: undefined,
  paresPorMes: "",
};

const sectionContainerClass =
  "rounded-xl border border-gray-200 bg-white p-5 sm:p-6 space-y-4 shadow-sm";

const inputClass =
  "h-11 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-foreground placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-colors";

const textareaClass =
  "min-h-[100px] rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-foreground placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-colors resize-y";

const labelClass = "text-sm font-semibold text-gray-700";

function SectionTitle({ number, title }: { number: string; title: string }) {
  return (
    <h3 className="text-base font-semibold text-[#2B9402] mb-4 flex items-center gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-secondary text-sm font-bold">
        {number}
      </span>
      {title}
    </h3>
  );
}

export function RevendedoresForm() {
  const form = useForm<RevendedorFormValues>({
    resolver: zodResolver(revendedorSchema),
    defaultValues,
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function onSubmit(data: RevendedorFormValues) {
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        email: data.email?.trim() || undefined,
      };
      const res = await fetch("/api/submit-revendedor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string; details?: string };
      if (!res.ok) {
        setSubmitError(json.error || "Falha ao enviar. Tente novamente.");
        return;
      }
      setSubmitted(true);
    } catch {
      setSubmitError("Erro de conexão. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <section className="w-full max-w-4xl mx-auto px-4 py-12 sm:py-16" aria-labelledby="obrigado-heading">
        <div className="bg-[#FFF2C9] rounded-2xl p-8 sm:p-10 text-center border border-[#2B9402]/20">
          <h2 id="obrigado-heading" className="text-xl font-semibold text-[#2B9402] mb-4">
            Obrigado por responder ao questionário!
          </h2>
          <p className="text-foreground leading-relaxed">
            Em breve nossa equipe entrará em contato com você. Seguimos juntos com o Pé Direito.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-10 sm:py-12" aria-label="Questionário para revendedores Pé Direito">
      <div className="bg-[#2B9402] rounded-2xl p-5 sm:p-6 shadow-lg space-y-5 sm:space-y-6">
        {/* Header */}
        <div className="rounded-xl bg-secondary py-6 sm:py-8 px-6 shadow-sm">
          <header className="text-center" aria-label="Pé Direito">
            <img src={pedireitoLogo} alt="Pé Direito" className="h-9 sm:h-10 mx-auto" />
          </header>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
              {/* Informações Básicas */}
              <div className={sectionContainerClass}>
                <SectionTitle number="1" title="Informações Básicas" />
                <div className="space-y-4">
          <FormField
            control={form.control}
            name="nomeCompleto"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>Nome completo</FormLabel>
                <FormControl>
                  <Input className={inputClass} placeholder="Seu nome completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="empresaLoja"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>Empresa / Loja</FormLabel>
                <FormControl>
                  <Input className={inputClass} placeholder="Nome da empresa ou loja" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cnpj"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>CNPJ (se houver)</FormLabel>
                <FormControl>
                  <Input className={inputClass} placeholder="00.000.000/0000-00" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cidadeEstado"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>Cidade / Estado</FormLabel>
                <FormControl>
                  <Input className={inputClass} placeholder="Cidade, UF" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="telefoneWhatsapp"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>Telefone / WhatsApp</FormLabel>
                <FormControl>
                  <Input className={inputClass} placeholder="(00) 00000-0000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>E-mail (opcional)</FormLabel>
                <FormControl>
                  <Input type="email" className={inputClass} placeholder="seu@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="instagramRedes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>Instagram / Redes sociais</FormLabel>
                <FormControl>
                  <Input className={inputClass} placeholder="@usuario ou link" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tempoMercado"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>Tempo atuando no mercado</FormLabel>
                <FormControl>
                  <Input className={inputClass} placeholder="Ex: 2 anos" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="entendeProposito"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>
                  Você entende que Pé Direito é mais que um produto — é uma marca com propósito?
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-wrap gap-4"
                  >
                    <label className="flex items-center gap-2 cursor-pointer">
                      <RadioGroupItem value="sim" id="entende-sim" />
                      <span>Sim</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <RadioGroupItem value="nao" id="entende-nao" />
                      <span>Não</span>
                    </label>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
                </div>
              </div>

              {/* Perfil do Revendedor */}
              <div className={sectionContainerClass}>
                <SectionTitle number="2" title="Perfil do Revendedor" />
                <div className="space-y-4">
          <FormField
            control={form.control}
            name="vendeCalcadosVestuario"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>Você já trabalha com venda de calçados ou vestuário?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-wrap gap-4"
                  >
                    <label className="flex items-center gap-2 cursor-pointer">
                      <RadioGroupItem value="sim" id="vende-sim" />
                      <span>Sim</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <RadioGroupItem value="nao" id="vende-nao" />
                      <span>Não</span>
                    </label>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="formaVenda"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>Você vende de forma:</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-col gap-2"
                  >
                    <label className={cn("flex items-center gap-3 cursor-pointer rounded-lg border border-gray-200 bg-white px-4 py-2.5 transition-colors hover:border-gray-300", field.value === "fisica" && "border-primary bg-primary/5")}>
                      <RadioGroupItem value="fisica" id="forma-fisica" />
                      <span>Loja física</span>
                    </label>
                    <label className={cn("flex items-center gap-3 cursor-pointer rounded-lg border border-gray-200 bg-white px-4 py-2.5 transition-colors hover:border-gray-300", field.value === "online" && "border-primary bg-primary/5")}>
                      <RadioGroupItem value="online" id="forma-online" />
                      <span>Loja online</span>
                    </label>
                    <label className={cn("flex items-center gap-3 cursor-pointer rounded-lg border border-gray-200 bg-white px-4 py-2.5 transition-colors hover:border-gray-300", field.value === "marketplace" && "border-primary bg-primary/5")}>
                      <RadioGroupItem value="marketplace" id="forma-marketplace" />
                      <span>Marketplace</span>
                    </label>
                    <label className={cn("flex items-center gap-3 cursor-pointer rounded-lg border border-gray-200 bg-white px-4 py-2.5 transition-colors hover:border-gray-300", field.value === "porta" && "border-primary bg-primary/5")}>
                      <RadioGroupItem value="porta" id="forma-porta" />
                      <span>Porta a porta</span>
                    </label>
                    <label className={cn("flex items-center gap-3 cursor-pointer rounded-lg border border-gray-200 bg-white px-4 py-2.5 transition-colors hover:border-gray-300", field.value === "mistos" && "border-primary bg-primary/5")}>
                      <RadioGroupItem value="mistos" id="forma-mistos" />
                      <span>Mistos</span>
                    </label>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
                </div>
              </div>

              {/* Alinhamento com a Marca */}
              <div className={sectionContainerClass}>
                <SectionTitle number="3" title="Alinhamento com a Marca" />
                <div className="space-y-4">
          <FormField
            control={form.control}
            name="oQueChamouAtencao"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>O que mais chamou sua atenção na marca Pé Direito?</FormLabel>
                <FormControl>
                  <Textarea className={textareaClass} placeholder="Conte um pouco..." {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="seguePadroesMarca"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>
                  Está disposto(a) a seguir padrões de posicionamento e comunicação oficial da marca?
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-wrap gap-4"
                  >
                    <label className="flex items-center gap-2 cursor-pointer">
                      <RadioGroupItem value="sim" id="padroes-sim" />
                      <span>Sim</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <RadioGroupItem value="nao" id="padroes-nao" />
                      <span>Não</span>
                    </label>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
                </div>
              </div>

              {/* Potencial de Mercado */}
              <div className={sectionContainerClass}>
                <SectionTitle number="4" title="Potencial de Mercado" />
                <div className="space-y-4">
          <FormField
            control={form.control}
            name="paresPorMes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>Quantos pares acredita conseguir vender por mês?</FormLabel>
                <FormControl>
                  <Input type="number" min={0} className={inputClass} placeholder="Ex: 20" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
                </div>
              </div>

              {submitError && (
            <p className="text-sm font-medium text-destructive" role="alert">
              {submitError}
            </p>
          )}
          <div className="pt-3 flex justify-center">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full px-8 sm:px-10 py-4 sm:py-5 bg-secondary hover:bg-secondary/90 text-secondary-foreground disabled:opacity-70"
            >
              {isSubmitting ? "Enviando..." : "Enviar questionário"}
            </Button>
          </div>
          </form>
        </Form>
      </div>
    </section>
  );
}
