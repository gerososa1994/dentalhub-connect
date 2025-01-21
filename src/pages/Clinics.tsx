import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function Clinics() {
  const { toast } = useToast();

  const { data: clinics, isLoading } = useQuery({
    queryKey: ["clinics"],
    queryFn: async () => {
      const { data, error } = await supabase.from("clinics").select("*");
      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar las clínicas",
        });
        throw error;
      }
      return data;
    },
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Clínicas</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nueva Clínica
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clinics?.map((clinic) => (
            <div
              key={clinic.id}
              className="bg-white rounded-lg shadow-md p-6 space-y-4"
            >
              <h3 className="text-xl font-semibold">{clinic.name}</h3>
              <div className="space-y-2 text-gray-600">
                <p>{clinic.address}</p>
                <p>{clinic.phone}</p>
                <p>{clinic.email}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="w-full">
                  Editar
                </Button>
                <Button variant="destructive" className="w-full">
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}