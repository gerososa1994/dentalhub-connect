import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type FormData = {
  full_name: string;
  email: string;
  phone: string;
};

export function AddPatientDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      console.log("Creating new patient with data:", data);
      
      // First create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: "temporary-password", // You should implement a proper password handling
        options: {
          data: {
            full_name: data.full_name,
            role: 'patient'
          }
        }
      });

      if (authError) {
        console.error("Auth error:", authError);
        throw authError;
      }
      console.log("Auth user created:", authData);

      if (!authData.user) {
        console.error("No user data returned");
        throw new Error("No user data returned");
      }

      // Wait a moment for the trigger to create the user record
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user was created successfully using maybeSingle()
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .maybeSingle();

      if (userError) {
        console.error("Error fetching user:", userError);
        throw userError;
      }

      if (!userData) {
        console.error("User not found after creation");
        throw new Error("User not found after creation");
      }

      // Update the user's phone number
      const { error: updateError } = await supabase
        .from('users')
        .update({ phone: data.phone })
        .eq('id', authData.user.id);

      if (updateError) {
        console.error("Error updating user phone:", updateError);
        throw updateError;
      }

      toast({
        title: "Éxito",
        description: "Paciente creado correctamente",
      });
      
      setOpen(false);
      form.reset();
      
      // Reload the page to refresh the patient list
      window.location.reload();
    } catch (error) {
      console.error("Error creating patient:", error);
      toast({
        title: "Error",
        description: "No se pudo crear el paciente",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Nuevo Paciente
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Paciente</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Juan Pérez" {...field} />
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="juan@ejemplo.com" {...field} />
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
                    <Input placeholder="+1234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Crear Paciente</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}