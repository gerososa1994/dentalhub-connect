import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UserData {
  role: string;
  assignedClinicId?: string;
}

export const useClinicData = () => {
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
      if (error) throw error;
      return data;
    },
    enabled: !!userData,
  });

  return {
    userData,
    clinics,
    isLoading,
    isAdmin: userData?.role === 'admin'
  };
};