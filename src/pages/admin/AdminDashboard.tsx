import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Clock, CheckCircle, XCircle, Package } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import RevendedorTable from '@/components/admin/RevendedorTable';
import { useRevendedorStats } from '@/hooks/useRevendedores';

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useRevendedorStats();

  const statCards = [
    {
      title: 'Total',
      value: stats?.total || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Pendentes',
      value: stats?.pendente || 0,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Aprovados',
      value: stats?.aprovado || 0,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Rejeitados',
      value: stats?.rejeitado || 0,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: 'Total de Pares',
      value:
        stats?.totalPares != null
          ? `${stats.totalPares.toLocaleString('pt-BR')} und`
          : '0 und',
      icon: Package,
      color: 'text-violet-600',
      bgColor: 'bg-violet-100',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
          {statCards.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {statsLoading ? (
                    <div className="h-8 w-12 bg-gray-200 animate-pulse rounded" />
                  ) : (
                    stat.value
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Revendedores Table */}
        <Card>
          <CardHeader>
            <CardTitle>Revendedores Cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            <RevendedorTable />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
