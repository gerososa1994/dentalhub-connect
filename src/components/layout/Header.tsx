import { Bell, User, LogOut, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { ChangePasswordDialog } from "@/components/auth/ChangePasswordDialog";

export const Header = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  // Fetch current user data
  const { data: userData } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();
      
      return data;
    },
  });

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/auth");
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cerrar la sesión",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-primary">DentSystem</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <User className="h-5 w-5" />
                {userData?.full_name && (
                  <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-xs">
                    {userData.full_name}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowPasswordDialog(true)}>
                <Lock className="mr-2 h-4 w-4" />
                Cambiar contraseña
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ChangePasswordDialog 
        open={showPasswordDialog} 
        onOpenChange={setShowPasswordDialog} 
      />
    </header>
  );
};