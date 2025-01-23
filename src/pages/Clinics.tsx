import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ClinicSelector } from "@/components/clinics/ClinicSelector";
import { ClinicCard } from "@/components/clinics/ClinicCard";
import { useClinicData } from "@/hooks/useClinicData";
import { AddClinicDialog } from "@/components/clinics/AddClinicDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";

export default function Clinics() {
  const { toast } = useToast();
  const [selectedClinic, setSelectedClinic] = useState<string | null>(null);
  const { clinics, isLoading, isAdmin } = useClinicData();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [clinicToDelete, setClinicToDelete] = useState<string | null>(null);
  const [editingClinic, setEditingClinic] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    setEditingClinic(id);
    setShowAddDialog(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("clinics")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Clínica eliminada",
        description: "La clínica ha sido eliminada exitosamente",
      });
      setShowDeleteDialog(false);
      setClinicToDelete(null);
    } catch (error) {
      console.error("Error deleting clinic:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la clínica",
        variant: "destructive",
      });
    }
  };

  const confirmDelete = (id: string) => {
    setClinicToDelete(id);
    setShowDeleteDialog(true);
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
            <Button onClick={() => {
              setEditingClinic(null);
              setShowAddDialog(true);
            }}>
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
              onDelete={confirmDelete}
            />
          ))}
        </div>
      </div>

      <AddClinicDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
        clinicId={editingClinic}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la clínica
              y todos sus datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => clinicToDelete && handleDelete(clinicToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}