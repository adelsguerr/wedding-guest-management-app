"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Baby, Table2, MapPin, MessageSquare, TrendingUp, CheckCircle2, XCircle, Clock } from "lucide-react";
import { useDashboard } from "@/lib/hooks/use-dashboard";
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveBar } from '@nivo/bar';
import { WeddingLoader } from "@/components/wedding-loader";

export default function DashboardPage() {
  const { data: stats, isLoading, error } = useDashboard();

  if (isLoading) {
    return <WeddingLoader message="Cargando estadísticas..." />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Error al cargar datos</h3>
              <p className="text-gray-600">Por favor, recarga la página</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Preparar datos para gráficos
  const confirmationChartData = stats?.confirmationStats?.map(stat => ({
    id: stat.confirmationStatus === 'PENDING' ? 'Pendiente' :
        stat.confirmationStatus === 'CONFIRMED' ? 'Confirmado' :
        stat.confirmationStatus === 'DECLINED' ? 'Declinado' : 'Sin respuesta',
    label: stat.confirmationStatus === 'PENDING' ? 'Pendiente' :
            stat.confirmationStatus === 'CONFIRMED' ? 'Confirmado' :
            stat.confirmationStatus === 'DECLINED' ? 'Declinado' : 'Sin respuesta',
    value: stat._count,
    color: stat.confirmationStatus === 'PENDING' ? '#f59e0b' :
           stat.confirmationStatus === 'CONFIRMED' ? '#10b981' :
           stat.confirmationStatus === 'DECLINED' ? '#ef4444' : '#6b7280',
  })) || [];

  const tableTypeChartData = stats?.tableStats?.map(stat => ({
    type: stat.tableType.replace(/_/g, ' '),
    cantidad: stat._count,
  })) || [];

  const guestTypeData = [
    {
      id: 'Adultos',
      label: 'Adultos',
      value: stats?.totals.adults || 0,
      color: '#9333ea',
    },
    {
      id: 'Niños',
      label: 'Niños',
      value: stats?.totals.children || 0,
      color: '#ec4899',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
            Vista general de tu evento · Actualización automática cada minuto
          </p>
        </div>

        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Familias
              </CardTitle>
              <Users className="h-5 w-5 text-pink-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.totals.families || 0}</div>
              <div className="flex items-center gap-2 mt-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <p className="text-xs text-gray-600">
                  {stats?.totals.confirmedFamilies || 0} confirmadas
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Invitados
              </CardTitle>
              <UserCheck className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.totals.guests || 0}</div>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3 text-purple-600" />
                  <p className="text-xs text-gray-600">{stats?.totals.adults || 0} adultos</p>
                </div>
                <div className="flex items-center gap-1">
                  <Baby className="h-3 w-3 text-pink-600" />
                  <p className="text-xs text-gray-600">{stats?.totals.children || 0} niños</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Mesas
              </CardTitle>
              <Table2 className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.totals.tables || 0}</div>
              <div className="flex items-center gap-2 mt-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <p className="text-xs text-gray-600">
                  {stats?.totals.totalSeats || 0} asientos totales
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Asientos
              </CardTitle>
              <MapPin className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.totals.occupiedSeats || 0}</div>
              <div className="flex items-center gap-2 mt-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <p className="text-xs text-gray-600">
                  {stats?.totals.availableSeats || 0} disponibles
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos interactivos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Gráfico de confirmaciones */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Estado de Confirmaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              {confirmationChartData.length > 0 ? (
                <div className="h-[300px]">
                  <ResponsivePie
                    data={confirmationChartData}
                    margin={{ top: 20, right: 20, bottom: 80, left: 20 }}
                    innerRadius={0.5}
                    padAngle={0.7}
                    cornerRadius={3}
                    activeOuterRadiusOffset={8}
                    colors={{ datum: 'data.color' }}
                    borderWidth={1}
                    borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                    arcLinkLabelsSkipAngle={10}
                    arcLinkLabelsTextColor="#333333"
                    arcLinkLabelsThickness={2}
                    arcLinkLabelsColor={{ from: 'color' }}
                    arcLabelsSkipAngle={10}
                    arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                    legends={[
                      {
                        anchor: 'bottom',
                        direction: 'row',
                        justify: false,
                        translateX: 0,
                        translateY: 56,
                        itemsSpacing: 0,
                        itemWidth: 100,
                        itemHeight: 18,
                        itemTextColor: '#999',
                        itemDirection: 'left-to-right',
                        itemOpacity: 1,
                        symbolSize: 18,
                        symbolShape: 'circle',
                      }
                    ]}
                  />
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-gray-500">No hay datos de confirmaciones</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Gráfico de tipos de invitados */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                Distribución Adultos/Niños
              </CardTitle>
            </CardHeader>
            <CardContent>
              {guestTypeData.some(d => d.value > 0) ? (
                <div className="h-[300px]">
                  <ResponsivePie
                    data={guestTypeData}
                    margin={{ top: 20, right: 20, bottom: 80, left: 20 }}
                    innerRadius={0.5}
                    padAngle={0.7}
                    cornerRadius={3}
                    activeOuterRadiusOffset={8}
                    colors={{ datum: 'data.color' }}
                    borderWidth={1}
                    borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                    arcLinkLabelsSkipAngle={10}
                    arcLinkLabelsTextColor="#333333"
                    arcLinkLabelsThickness={2}
                    arcLinkLabelsColor={{ from: 'color' }}
                    arcLabelsSkipAngle={10}
                    arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                    legends={[
                      {
                        anchor: 'bottom',
                        direction: 'row',
                        justify: false,
                        translateX: 0,
                        translateY: 56,
                        itemsSpacing: 0,
                        itemWidth: 100,
                        itemHeight: 18,
                        itemTextColor: '#999',
                        itemDirection: 'left-to-right',
                        itemOpacity: 1,
                        symbolSize: 18,
                        symbolShape: 'circle',
                      }
                    ]}
                  />
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-gray-500">No hay invitados registrados</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de barras y notificaciones */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tipos de mesa */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Table2 className="h-5 w-5 text-blue-600" />
                Tipos de Mesas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tableTypeChartData.length > 0 ? (
                <div className="h-[300px]">
                  <ResponsiveBar
                    data={tableTypeChartData}
                    keys={['cantidad']}
                    indexBy="type"
                    margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
                    padding={0.3}
                    valueScale={{ type: 'linear' }}
                    indexScale={{ type: 'band', round: true }}
                    colors={['#3b82f6']}
                    borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: -45,
                      legend: 'Tipo de Mesa',
                      legendPosition: 'middle',
                      legendOffset: 50
                    }}
                    axisLeft={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: 'Cantidad',
                      legendPosition: 'middle',
                      legendOffset: -50
                    }}
                    labelSkipWidth={12}
                    labelSkipHeight={12}
                    labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                    animate={true}
                  />
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-gray-500">No hay mesas creadas aún</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notificaciones recientes */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-indigo-600" />
                Notificaciones Recientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {stats?.recentNotifications && stats.recentNotifications.length > 0 ? (
                  stats.recentNotifications.map((notif) => (
                    <div key={notif.id} className="flex items-start gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:shadow-md transition-shadow">
                      <div className={`w-2 h-2 mt-2 rounded-full ${
                        notif.status === 'SENT' ? 'bg-green-500' :
                        notif.status === 'FAILED' ? 'bg-red-500' :
                        'bg-yellow-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-semibold">
                          {notif.familyHead.firstName} {notif.familyHead.lastName}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {notif.notificationType.replace(/_/g, ' ')}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(notif.createdAt).toLocaleString('es-ES')}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        notif.status === 'SENT' ? 'bg-green-100 text-green-700' :
                        notif.status === 'FAILED' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {notif.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="h-[260px] flex flex-col items-center justify-center">
                    <MessageSquare className="h-12 w-12 text-gray-300 mb-3" />
                    <p className="text-sm text-gray-500 text-center">
                      No hay notificaciones aún
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  );
}
