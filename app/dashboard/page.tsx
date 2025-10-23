"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Baby, Table2, MapPin, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Vista general de tu evento
          </p>
        </div>

        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Familias
              </CardTitle>
              <Users className="h-4 w-4 text-pink-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.totals.families || 0}</div>
              <p className="text-xs text-gray-500 mt-1">
                {stats?.totals.confirmedFamilies || 0} confirmadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Invitados
              </CardTitle>
              <UserCheck className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.totals.guests || 0}</div>
              <p className="text-xs text-gray-500 mt-1">
                {stats?.totals.adults || 0} adultos, {stats?.totals.children || 0} niños
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Mesas
              </CardTitle>
              <Table2 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.totals.tables || 0}</div>
              <p className="text-xs text-gray-500 mt-1">
                {stats?.totals.totalSeats || 0} asientos totales
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Asientos
              </CardTitle>
              <MapPin className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.totals.occupiedSeats || 0}</div>
              <p className="text-xs text-gray-500 mt-1">
                {stats?.totals.availableSeats || 0} disponibles
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos y detalles */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Estado de confirmaciones */}
          <Card>
            <CardHeader>
              <CardTitle>Estado de Confirmaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.confirmationStats?.map((stat: any) => (
                  <div key={stat.confirmationStatus} className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">
                      {stat.confirmationStatus === 'PENDING' && '⏳ Pendiente'}
                      {stat.confirmationStatus === 'CONFIRMED' && '✅ Confirmado'}
                      {stat.confirmationStatus === 'DECLINED' && '❌ Declinado'}
                      {stat.confirmationStatus === 'NO_RESPONSE' && '🔇 Sin respuesta'}
                    </span>
                    <span className="text-2xl font-bold">{stat._count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tipos de mesa */}
          <Card>
            <CardHeader>
              <CardTitle>Distribución de Mesas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.tableStats?.map((stat: any) => (
                  <div key={stat.tableType} className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {stat.tableType.replace(/_/g, ' ')}
                    </span>
                    <span className="text-2xl font-bold">{stat._count}</span>
                  </div>
                ))}
                {stats?.tableStats?.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No hay mesas creadas aún
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notificaciones recientes */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Notificaciones Recientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats?.recentNotifications?.map((notif: any) => (
                  <div key={notif.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-2 h-2 mt-2 rounded-full ${
                      notif.status === 'SENT' ? 'bg-green-500' :
                      notif.status === 'FAILED' ? 'bg-red-500' :
                      'bg-yellow-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {notif.familyHead.firstName} {notif.familyHead.lastName}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {notif.notificationType.replace(/_/g, ' ')}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notif.createdAt).toLocaleString('es-ES')}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      notif.status === 'SENT' ? 'bg-green-100 text-green-700' :
                      notif.status === 'FAILED' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {notif.status}
                    </span>
                  </div>
                ))}
                {stats?.recentNotifications?.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No hay notificaciones aún
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
