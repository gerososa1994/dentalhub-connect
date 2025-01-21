import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

const Patients = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fadeIn">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Pacientes</h2>
            <p className="text-gray-500 mt-2">
              Gestiona la información de tus pacientes
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Nuevo Paciente
          </Button>
        </div>

        <Card className="p-6">
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Buscar pacientes..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">Filtros</Button>
          </div>

          <div className="rounded-lg border">
            <div className="grid grid-cols-6 gap-4 p-4 bg-muted font-medium">
              <div className="col-span-2">Nombre</div>
              <div>Teléfono</div>
              <div>Última Visita</div>
              <div>Estado</div>
              <div>Acciones</div>
            </div>
            <div className="divide-y">
              {/* Patient list will go here */}
              <div className="p-4 text-gray-500">
                No hay pacientes registrados
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Patients;