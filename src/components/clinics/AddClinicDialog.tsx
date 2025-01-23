import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  address: z.string().min(1, "La dirección es requerida"),
  phone: z.string().min(1, "El teléfono es requerido"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
});

interface AddClinicDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clinicId?: string | null;
}

export const AddClinicDialog = ({ open, onOpenChange, clinicId }: AddClinicDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      email: "",
    },
  });

  useEffect(() => {
    const loadClinicData = async () => {
      if (clinicId) {
        const { data, error } = await supabase
          .from("clinics")
          .select("*")
          .eq("id", clinicId)
          .single();

        if (error) {
          console.error("Error loading clinic:", error);
          return;
        }

        if (data) {
          form.reset({
            name: data.name,
            address: data.address,
            phone: data.phone,
            email: data.email || "",
          });
        }
      } else {
        form.reset({
          name: "",
          address: "",
          phone: "",
          email: "",
        });
      }
    };

    loadClinicData();
  }, [clinicId, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const clinicData = {
        name: values.name,
        address: values.address,
        phone: values.phone,
        email: values.email || null,
      };

      let error;
      if (clinicId) {
        // Update existing clinic
        ({ error } = await supabase
          .from("clinics")
          .update(clinicData)
          .eq("id", clinicId));
      } else {
        // Create new clinic
        ({ error } = await supabase
          .from("clinics")
          .insert(clinicData));
      }

      if (error) throw error;

      toast({
        title: clinicId ? "Clínica actualizada" : "Clínica agregada",
        description: clinicId 
          ? "La clínica ha sido actualizada exitosamente"
          : "La clínica ha sido agregada exitosamente",
      });
      queryClient.invalidateQueries({ queryKey: ["clinics"] });
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Error saving clinic:", error);
      toast({
        title: "Error",
        description: clinicId 
          ? "No se pudo actualizar la clínica"
          : "No se pudo agregar la clínica",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {clinicId ? "Editar clínica" : "Agregar clínica"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (opcional)</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              {clinicId ? "Actualizar clínica" : "Agregar clínica"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};