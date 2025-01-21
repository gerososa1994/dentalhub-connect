import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserData {
  role: string;
  assignedClinicId?: string;
}

export default function Clinics() {
  const { toast } = useToast();
  const [selectedClinic, setSelectedClinic] = useState<string | null>(null);

  // Fetch user role and assigned clinics
  const { data: userData } = useQuery<UserData>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      console.log("Fetching current user data...");
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data: userDetails, error: userError } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (userError) throw userError;

      // If user is staff, get their assigned clinic
      if (userDetails.role !== 'admin') {
        const { data: staffData, error: staffError } = await supabase
          .from("staff")
          .select("clinic_id")
          .eq("user_id", user.id)
          .single();

        if (staffError) throw staffError;
        return { 
          ...userDetails, 
          assignedClinicId: staffData?.clinic_id 
        };
      }

      return userDetails;
    },
  });

  // Fetch available clinics based on user role
  const { data: clinics, isLoading } = useQuery({
    queryKey: ["clinics", userData?.role],
    queryFn: async () => {
      console.log("Fetching clinics data...");
      const query = supabase.from("clinics").select("*");
      
      // If user is not admin, only fetch their assigned clinic
      if (userData?.role !== 'admin' && userData?.assignedClinicId) {
        query.eq('id', userData.assignedClinicId);
      }

      const { data, error } = await query;
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
    enabled: !!userData,
  });

  // Set initial selected clinic
  useEffect(() => {
    if (clinics?.length === 1) {
      setSelectedClinic(clinics[0].id);
    }
  }, [clinics]);

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
          {userData?.role === 'admin' && (
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Nueva Clínica
            </Button>
          )}
        </div>

        {userData?.role === 'admin' && clinics?.length > 0 && (
          <div className="w-full max-w-xs">
            <Select
              value={selectedClinic || ""}
              onValueChange={(value) => setSelectedClinic(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar clínica" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas las clínicas</SelectItem>
                {clinics.map((clinic) => (
                  <SelectItem key={clinic.id} value={clinic.id}>
                    {clinic.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClinics?.map((clinic) => (
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
              {userData?.role === 'admin' && (
                <div className="flex gap-2">
                  <Button variant="outline" className="w-full">
                    Editar
                  </Button>
                  <Button variant="destructive" className="w-full">
                    Eliminar
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}