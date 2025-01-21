import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Calendar, Users, Clock, Activity } from "lucide-react";

const stats = [
  {
    label: "Pacientes Totales",
    value: "1,234",
    icon: Users,
    trend: "+12%",
  },
  {
    label: "Citas Hoy",
    value: "12",
    icon: Calendar,
    trend: "+5%",
  },
  {
    label: "Tiempo Promedio",
    value: "45min",
    icon: Clock,
    trend: "-8%",
  },
  {
    label: "Tratamientos",
    value: "89",
    icon: Activity,
    trend: "+23%",
  },
];

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fadeIn">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-500 mt-2">
            Bienvenido al Sistema de Gestión Odontológica
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-sm text-green-500 mt-1">{stat.trend}</p>
                </div>
                <div className="bg-primary-50 p-3 rounded-full">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Próximas Citas</h3>
            {/* Appointment list will go here */}
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Actividad Reciente</h3>
            {/* Activity feed will go here */}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;