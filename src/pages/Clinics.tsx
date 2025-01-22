import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ClinicSelector } from "@/components/clinics/ClinicSelector";
import { ClinicCard } from "@/components/clinics/ClinicCard";
import { useClinicData } from "@/hooks/useClinicData";

export default function Clinics() {
  const { toast } = useToast();
  const [selectedClinic, setSelectedClinic] = useState<string | null>(null);
  const { clinics, isLoading, isAdmin } = useClinicData();

  const handleEdit = (id: string) => {
    // TODO: Implementar edición de clínica
    console.log("Editar clínica:", id);
  };

  const handleDelete = (id: string) => {
    // TODO: Implementar eliminación de clínica
    console.log("Eliminar clínica:", id);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  const filteredClinics = selectedClinic
    ? clinics?.filter((clinic) => clinic.id === selectedClinic)
    : clinics;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Clínicas</h1>
            <p className="text-gray-500 mt-2">
              Gestiona la información de las clínicas
            </p>
          </div>
          {isAdmin && (
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Nueva Clínica
            </Button>
          )}
        </div>

        {isAdmin && clinics?.length > 0 && (
          <ClinicSelector
            clinics={clinics}
            selectedClinic={selectedClinic}
            onSelect={setSelectedClinic}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClinics?.map((clinic) => (
            <ClinicCard
              key={clinic.id}
              {...clinic}
              isAdmin={isAdmin}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}