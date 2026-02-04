import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { Revendedor } from '@/lib/supabase';
import { useUpdateRevendedor } from '@/hooks/useRevendedores';
import { toast } from 'sonner';

const editSchema = z.object({
  nome_completo: z.string().min(1, 'Nome é obrigatório'),
  empresa_loja: z.string().optional(),
  cnpj: z.string().optional(),
  cidade_estado: z.string().min(1, 'Cidade/Estado é obrigatório'),
  telefone_whatsapp: z.string().min(1, 'Telefone é obrigatório'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  instagram_redes: z.string().optional(),
  tempo_mercado: z.string().optional(),
  entende_proposito: z.string().optional(),
  vende_calcados_vestuario: z.string().optional(),
  forma_venda: z.string().optional(),
  o_que_chamou_atencao: z.string().optional(),
  segue_padroes_marca: z.string().optional(),
  pares_por_mes: z.string().optional(),
  status: z.enum(['pendente', 'aprovado', 'rejeitado']),
});

type EditFormData = z.infer<typeof editSchema>;

interface RevendedorModalProps {
  revendedor: Revendedor | null;
  open: boolean;
  onClose: () => void;
}

export default function RevendedorModal({ revendedor, open, onClose }: RevendedorModalProps) {
  const updateMutation = useUpdateRevendedor();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EditFormData>({
    resolver: zodResolver(editSchema),
  });

  const statusValue = watch('status');

  useEffect(() => {
    if (revendedor) {
      reset({
        nome_completo: revendedor.nome_completo || '',
        empresa_loja: revendedor.empresa_loja || '',
        cnpj: revendedor.cnpj || '',
        cidade_estado: revendedor.cidade_estado || '',
        telefone_whatsapp: revendedor.telefone_whatsapp || '',
        email: revendedor.email || '',
        instagram_redes: revendedor.instagram_redes || '',
        tempo_mercado: revendedor.tempo_mercado || '',
        entende_proposito: revendedor.entende_proposito || '',
        vende_calcados_vestuario: revendedor.vende_calcados_vestuario || '',
        forma_venda: revendedor.forma_venda || '',
        o_que_chamou_atencao: revendedor.o_que_chamou_atencao || '',
        segue_padroes_marca: revendedor.segue_padroes_marca || '',
        pares_por_mes: revendedor.pares_por_mes || '',
        status: revendedor.status || 'pendente',
      });
    }
  }, [revendedor, reset]);

  const onSubmit = async (data: EditFormData) => {
    if (!revendedor) return;

    try {
      await updateMutation.mutateAsync({
        id: revendedor.id,
        data: {
          ...data,
          email: data.email || null,
        },
      });
      toast.success('Revendedor atualizado com sucesso!');
      onClose();
    } catch {
      toast.error('Erro ao atualizar revendedor');
    }
  };

  if (!revendedor) return null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Revendedor</DialogTitle>
          <DialogDescription>
            Edite as informações do revendedor e atualize o status
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome_completo">Nome Completo *</Label>
              <Input id="nome_completo" {...register('nome_completo')} />
              {errors.nome_completo && (
                <p className="text-sm text-red-500">{errors.nome_completo.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="empresa_loja">Empresa/Loja</Label>
              <Input id="empresa_loja" {...register('empresa_loja')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input id="cnpj" {...register('cnpj')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cidade_estado">Cidade/Estado *</Label>
              <Input id="cidade_estado" {...register('cidade_estado')} />
              {errors.cidade_estado && (
                <p className="text-sm text-red-500">{errors.cidade_estado.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone_whatsapp">Telefone/WhatsApp *</Label>
              <Input id="telefone_whatsapp" {...register('telefone_whatsapp')} />
              {errors.telefone_whatsapp && (
                <p className="text-sm text-red-500">{errors.telefone_whatsapp.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register('email')} />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram_redes">Instagram/Redes</Label>
              <Input id="instagram_redes" {...register('instagram_redes')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tempo_mercado">Tempo de Mercado</Label>
              <Input id="tempo_mercado" {...register('tempo_mercado')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="entende_proposito">Entende Propósito</Label>
              <Select
                value={watch('entende_proposito') || ''}
                onValueChange={(value) => setValue('entende_proposito', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sim">Sim</SelectItem>
                  <SelectItem value="nao">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vende_calcados_vestuario">Vende Calçados/Vestuário</Label>
              <Select
                value={watch('vende_calcados_vestuario') || ''}
                onValueChange={(value) => setValue('vende_calcados_vestuario', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sim">Sim</SelectItem>
                  <SelectItem value="nao">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="forma_venda">Forma de Venda</Label>
              <Select
                value={watch('forma_venda') || ''}
                onValueChange={(value) => setValue('forma_venda', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fisica">Loja Física</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="marketplace">Marketplace</SelectItem>
                  <SelectItem value="porta">Porta a Porta</SelectItem>
                  <SelectItem value="mistos">Misto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="segue_padroes_marca">Segue Padrões da Marca</Label>
              <Select
                value={watch('segue_padroes_marca') || ''}
                onValueChange={(value) => setValue('segue_padroes_marca', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sim">Sim</SelectItem>
                  <SelectItem value="nao">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pares_por_mes">Pares por Mês</Label>
              <Input id="pares_por_mes" {...register('pares_por_mes')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={statusValue}
                onValueChange={(value: 'pendente' | 'aprovado' | 'rejeitado') =>
                  setValue('status', value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="aprovado">Aprovado</SelectItem>
                  <SelectItem value="rejeitado">Rejeitado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="o_que_chamou_atencao">O que chamou atenção</Label>
            <Textarea
              id="o_que_chamou_atencao"
              {...register('o_que_chamou_atencao')}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-[#2B9402] hover:bg-[#238003]"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar Alterações'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
