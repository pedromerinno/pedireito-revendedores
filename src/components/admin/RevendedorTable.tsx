import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Edit,
  Loader2,
  MessageCircle,
  MoreHorizontal,
  Search,
  Trash2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Revendedor } from '@/lib/supabase';
import {
  useRevendedores,
  useExportRevendedores,
  useDeleteRevendedor,
  StatusFilter,
} from '@/hooks/useRevendedores';
import RevendedorModal from './RevendedorModal';
import RevendedorDetailModal from './RevendedorDetailModal';
import { toast } from 'sonner';

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

export default function RevendedorTable() {
  const [status, setStatus] = useState<StatusFilter>('todos');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [selectedRevendedor, setSelectedRevendedor] = useState<Revendedor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [revendedorToDelete, setRevendedorToDelete] = useState<Revendedor | null>(null);
  const [revendedorDetail, setRevendedorDetail] = useState<Revendedor | null>(null);

  const pageSize = 10;

  const { data, isLoading, error } = useRevendedores({
    status,
    search,
    page,
    pageSize,
  });

  const exportMutation = useExportRevendedores();
  const deleteMutation = useDeleteRevendedor();

  const handleWhatsApp = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    const waNumber = digits.startsWith('55') ? digits : `55${digits}`;
    window.open(`https://wa.me/${waNumber}`, '_blank', 'noopener,noreferrer');
  };

  const handleDeleteConfirm = async () => {
    if (!revendedorToDelete) return;
    try {
      await deleteMutation.mutateAsync(revendedorToDelete.id);
      toast.success('Revendedor excluído com sucesso');
      setRevendedorToDelete(null);
    } catch {
      toast.error('Erro ao excluir revendedor');
    }
  };

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleStatusChange = (newStatus: StatusFilter) => {
    setStatus(newStatus);
    setPage(1);
  };

  const handleExport = async () => {
    try {
      await exportMutation.mutateAsync({ status, search });
      toast.success('Exportação realizada com sucesso!');
    } catch {
      toast.error('Erro ao exportar dados');
    }
  };

  const handleEdit = (revendedor: Revendedor) => {
    setSelectedRevendedor(revendedor);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRevendedor(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatParesPorMes = (value: string | null | undefined): string => {
    if (!value?.trim()) return '-';
    const num = parseInt(value.replace(/\D/g, ''), 10);
    if (isNaN(num)) return value;
    return `${num.toLocaleString('pt-BR')} und`;
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        Erro ao carregar revendedores. Por favor, tente novamente.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="flex gap-2">
            <Input
              placeholder="Buscar por nome, empresa ou cidade..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full sm:w-64"
            />
            <Button variant="outline" onClick={handleSearch}>
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="aprovado">Aprovado</SelectItem>
              <SelectItem value="rejeitado">Rejeitado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          onClick={handleExport}
          disabled={exportMutation.isPending}
        >
          {exportMutation.isPending ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          Exportar CSV
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead className="hidden md:table-cell">Empresa</TableHead>
                <TableHead className="hidden lg:table-cell">Cidade</TableHead>
                <TableHead className="hidden sm:table-cell">Telefone</TableHead>
                <TableHead className="hidden sm:table-cell">Pares/mês</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-[#2B9402]" />
                  </TableCell>
                </TableRow>
              ) : data?.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    Nenhum revendedor encontrado
                  </TableCell>
                </TableRow>
              ) : (
                data?.data.map((revendedor) => (
                  <TableRow
                    key={revendedor.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setRevendedorDetail(revendedor)}
                  >
                    <TableCell className="font-medium">
                      {revendedor.nome_completo}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {revendedor.empresa_loja || '-'}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {revendedor.cidade_estado}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {revendedor.telefone_whatsapp}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {formatParesPorMes(revendedor.pares_por_mes)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          statusColors[revendedor.status || 'pendente'] ||
                          statusColors.pendente
                        }
                      >
                        {statusLabels[revendedor.status || 'pendente'] ||
                          'Pendente'}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(revendedor.created_at)}
                    </TableCell>
                    <TableCell
                      className="text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Ações</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleWhatsApp(revendedor.telefone_whatsapp)}
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Chamar no WhatsApp
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(revendedor)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setRevendedorToDelete(revendedor)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Mostrando {(page - 1) * pageSize + 1} a{' '}
            {Math.min(page * pageSize, data.count)} de {data.count} revendedores
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Página {page} de {data.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
              disabled={page === data.totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Detail Modal (view all info) */}
      <RevendedorDetailModal
        revendedor={revendedorDetail}
        open={!!revendedorDetail}
        onClose={() => setRevendedorDetail(null)}
        onEdit={(r) => {
          setRevendedorDetail(null);
          setSelectedRevendedor(r);
          setIsModalOpen(true);
        }}
        onWhatsApp={handleWhatsApp}
        onDelete={setRevendedorToDelete}
      />

      {/* Edit Modal */}
      <RevendedorModal
        revendedor={selectedRevendedor}
        open={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Delete confirmation */}
      <AlertDialog
        open={!!revendedorToDelete}
        onOpenChange={(open) => !open && setRevendedorToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir revendedor</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir{' '}
              <strong>{revendedorToDelete?.nome_completo}</strong>? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancelar
            </AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Excluindo...
                </>
              ) : (
                'Excluir'
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
