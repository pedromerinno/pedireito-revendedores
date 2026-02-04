import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, Revendedor } from '@/lib/supabase';

export type StatusFilter = 'todos' | 'pendente' | 'aprovado' | 'rejeitado';

interface UseRevendedoresParams {
  status?: StatusFilter;
  search?: string;
  page?: number;
  pageSize?: number;
}

interface RevendedoresResult {
  data: Revendedor[];
  count: number;
  totalPages: number;
}

export function useRevendedores({
  status = 'todos',
  search = '',
  page = 1,
  pageSize = 10,
}: UseRevendedoresParams = {}) {
  return useQuery<RevendedoresResult>({
    queryKey: ['revendedores', status, search, page, pageSize],
    queryFn: async () => {
      if (!supabase) {
        throw new Error('Supabase não configurado');
      }

      let query = supabase
        .from('revendedores')
        .select('*', { count: 'exact' });

      if (status !== 'todos') {
        query = query.eq('status', status);
      }

      if (search) {
        query = query.or(
          `nome_completo.ilike.%${search}%,empresa_loja.ilike.%${search}%,cidade_estado.ilike.%${search}%`
        );
      }

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await query
        .order('pares_por_mes_num', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      return {
        data: data || [],
        count: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
      };
    },
  });
}

export function useRevendedorStats() {
  return useQuery({
    queryKey: ['revendedores-stats'],
    queryFn: async () => {
      if (!supabase) {
        throw new Error('Supabase não configurado');
      }

      const { data, error } = await supabase
        .from('revendedores')
        .select('status');

      if (error) throw error;

      const stats = {
        total: data?.length || 0,
        pendente: data?.filter((r) => r.status === 'pendente' || !r.status).length || 0,
        aprovado: data?.filter((r) => r.status === 'aprovado').length || 0,
        rejeitado: data?.filter((r) => r.status === 'rejeitado').length || 0,
      };

      return stats;
    },
  });
}

export function useUpdateRevendedor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<Omit<Revendedor, 'id' | 'created_at'>>;
    }) => {
      if (!supabase) {
        throw new Error('Supabase não configurado');
      }

      const { error } = await supabase
        .from('revendedores')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['revendedores'] });
      queryClient.invalidateQueries({ queryKey: ['revendedores-stats'] });
    },
  });
}

export function useDeleteRevendedor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      if (!supabase) {
        throw new Error('Supabase não configurado');
      }

      const { error } = await supabase
        .from('revendedores')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['revendedores'] });
      queryClient.invalidateQueries({ queryKey: ['revendedores-stats'] });
    },
  });
}

export function useExportRevendedores() {
  return useMutation({
    mutationFn: async ({ status, search }: { status?: StatusFilter; search?: string }) => {
      if (!supabase) {
        throw new Error('Supabase não configurado');
      }

      let query = supabase.from('revendedores').select('*');

      if (status && status !== 'todos') {
        query = query.eq('status', status);
      }

      if (search) {
        query = query.or(
          `nome_completo.ilike.%${search}%,empresa_loja.ilike.%${search}%,cidade_estado.ilike.%${search}%`
        );
      }

      const { data, error } = await query
        .order('pares_por_mes_num', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Convert to CSV
      const headers = [
        'ID',
        'Nome Completo',
        'Empresa/Loja',
        'CNPJ',
        'Cidade/Estado',
        'Telefone',
        'Email',
        'Instagram/Redes',
        'Tempo de Mercado',
        'Entende Propósito',
        'Vende Calçados/Vestuário',
        'Forma de Venda',
        'O que chamou atenção',
        'Segue Padrões da Marca',
        'Pares por Mês',
        'Status',
        'Data de Cadastro',
      ];

      const rows = (data || []).map((r) => [
        r.id,
        r.nome_completo || '',
        r.empresa_loja || '',
        r.cnpj || '',
        r.cidade_estado || '',
        r.telefone_whatsapp || '',
        r.email || '',
        r.instagram_redes || '',
        r.tempo_mercado || '',
        r.entende_proposito || '',
        r.vende_calcados_vestuario || '',
        r.forma_venda || '',
        r.o_que_chamou_atencao || '',
        r.segue_padroes_marca || '',
        r.pares_por_mes || '',
        r.status || 'pendente',
        r.created_at ? new Date(r.created_at).toLocaleDateString('pt-BR') : '',
      ]);

      const csvContent = [
        headers.join(';'),
        ...rows.map((row) =>
          row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(';')
        ),
      ].join('\n');

      // Download file
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `revendedores_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(link.href);
    },
  });
}
