import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search, User, Calendar, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Patients = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const { data: patients, isLoading, error } = useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      console.log("Fetching patients data...");
      const { data, error } = await supabase
        .from("patients")
        .select(`
          *,
          user:users(
            full_name,
            email,
            phone
          )
        `);

      if (error) {
        console.error("Error fetching patients:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los pacientes",
          variant: "destructive",
        });
        throw error;
      }

      console.log("Patients data received:", data);
      return data;
    },
  });

  const filteredPatients = patients?.filter((patient) => {
    const searchTerm = searchQuery.toLowerCase();
    const userName = patient.user?.full_name?.toLowerCase() || "";
    const userEmail = patient.user?.email?.toLowerCase() || "";
    return userName.includes(searchTerm) || userEmail.includes(searchTerm);
  });

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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline">Filtros</Button>
          </div>

          <div className="rounded-lg border">
            <div className="grid grid-cols-6 gap-4 p-4 bg-muted font-medium text-sm">
              <div className="col-span-2">Nombre</div>
              <div>Email</div>
              <div>Teléfono</div>
              <div>Última Visita</div>
              <div>Acciones</div>
            </div>
            <div className="divide-y">
              {isLoading ? (
                <div className="p-4 text-center text-gray-500">
                  Cargando pacientes...
                </div>
              ) : error ? (
                <div className="p-4 text-center text-red-500">
                  Error al cargar los pacientes
                </div>
              ) : filteredPatients?.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No se encontraron pacientes
                </div>
              ) : (
                filteredPatients?.map((patient) => (
                  <div
                    key={patient.id}
                    className="grid grid-cols-6 gap-4 p-4 items-center hover:bg-gray-50 transition-colors"
                  >
                    <div className="col-span-2 flex items-center gap-3">
                      <div className="bg-primary-100 p-2 rounded-full">
                        <User className="h-5 w-5 text-primary-500" />
                      </div>
                      <span className="font-medium">
                        {patient.user?.full_name || "N/A"}
                      </span>
                    </div>
                    <div className="text-gray-600">{patient.user?.email}</div>
                    <div className="text-gray-600">
                      {patient.user?.phone || "N/A"}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Sin visitas</span>
                    </div>
                    <div>
                      <Button variant="ghost" size="sm">
                        Ver detalles
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Patients;