import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Edit, Trash2 } from 'lucide-react';
import { Revendedor } from '@/lib/supabase';

const statusLabels: Record<string, string> = {
  pendente: 'Pendente',
  aprovado: 'Aprovado',
  rejeitado: 'Rejeitado',
};

const statusColors: Record<string, string> = {
  pendente: 'bg-yellow-100 text-yellow-800',
  aprovado: 'bg-green-100 text-green-800',
  rejeitado: 'bg-red-100 text-red-800',
};

const formaVendaLabels: Record<string, string> = {
  fisica: 'Loja Física',
  online: 'Loja Online',
  marketplace: 'Marketplace',
  porta: 'Porta a Porta',
  mistos: 'Mistos',
};

interface RevendedorDetailModalProps {
  revendedor: Revendedor | null;
  open: boolean;
  onClose: () => void;
  onEdit: (revendedor: Revendedor) => void;
  onWhatsApp: (phone: string) => void;
  onDelete: (revendedor: Revendedor) => void;
}

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
  const display = value?.trim() || '-';
  return (
    <div className="space-y-1">
      <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</dt>
      <dd className="text-sm text-foreground">{display}</dd>
    </div>
  );
}

export default function RevendedorDetailModal({
  revendedor,
  open,
  onClose,
  onEdit,
  onWhatsApp,
  onDelete,
}: RevendedorDetailModalProps) {
  if (!revendedor) return null;

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

  const formatParesPorMes = (value: string | null | undefined): string => {
    if (!value?.trim()) return '-';
    const num = parseInt(value.replace(/\D/g, ''), 10);
    if (isNaN(num)) return value;
    return `${num.toLocaleString('pt-BR')} und`;
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between gap-4">
            <DialogTitle className="pr-4">{revendedor.nome_completo}</DialogTitle>
            <Badge
              className={
                statusColors[revendedor.status || 'pendente'] || statusColors.pendente
              }
            >
              {statusLabels[revendedor.status || 'pendente'] || 'Pendente'}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <section>
            <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
              Informações Básicas
            </h4>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow label="Empresa / Loja" value={revendedor.empresa_loja} />
              <InfoRow label="CNPJ" value={revendedor.cnpj} />
              <InfoRow label="Cidade / Estado" value={revendedor.cidade_estado} />
              <InfoRow label="Telefone / WhatsApp" value={revendedor.telefone_whatsapp} />
              <InfoRow label="E-mail" value={revendedor.email} />
              <InfoRow label="Instagram / Redes" value={revendedor.instagram_redes} />
              <InfoRow label="Tempo de Mercado" value={revendedor.tempo_mercado} />
              <InfoRow label="Data de Cadastro" value={formatDate(revendedor.created_at)} />
            </dl>
          </section>

          <section>
            <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
              Perfil do Revendedor
            </h4>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow
                label="Entende Propósito"
                value={
                  revendedor.entende_proposito
                    ? revendedor.entende_proposito === 'sim'
                      ? 'Sim'
                      : 'Não'
                    : null
                }
              />
              <InfoRow
                label="Vende Calçados/Vestuário"
                value={
                  revendedor.vende_calcados_vestuario
                    ? revendedor.vende_calcados_vestuario === 'sim'
                      ? 'Sim'
                      : 'Não'
                    : null
                }
              />
              <InfoRow
                label="Forma de Venda"
                value={
                  revendedor.forma_venda
                    ? formaVendaLabels[revendedor.forma_venda] || revendedor.forma_venda
                    : null
                }
              />
              <InfoRow
                label="Segue Padrões da Marca"
                value={
                  revendedor.segue_padroes_marca
                    ? revendedor.segue_padroes_marca === 'sim'
                      ? 'Sim'
                      : 'Não'
                    : null
                }
              />
              <InfoRow
                label="Pares por Mês"
                value={formatParesPorMes(revendedor.pares_por_mes)}
              />
            </dl>
          </section>

          {revendedor.o_que_chamou_atencao && (
            <section>
              <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                O que chamou atenção
              </h4>
              <p className="text-sm text-foreground leading-relaxed bg-muted/50 rounded-lg p-4">
                {revendedor.o_que_chamou_atencao}
              </p>
            </section>
          )}
        </div>

        <div className="flex flex-wrap gap-2 pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onClose();
              onWhatsApp(revendedor.telefone_whatsapp);
            }}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Chamar no WhatsApp
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onClose();
              onEdit(revendedor);
            }}
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => {
              onClose();
              onDelete(revendedor);
            }}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
