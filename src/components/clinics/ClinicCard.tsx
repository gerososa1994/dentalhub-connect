import React from "react";
import { Button } from "@/components/ui/button";

interface ClinicCardProps {
  id: string;
  name: string;
  address: string;
  phone: string;
  email?: string;
  isAdmin: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ClinicCard = ({
  id,
  name,
  address,
  phone,
  email,
  isAdmin,
  onEdit,
  onDelete,
}: ClinicCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <h3 className="text-xl font-semibold">{name}</h3>
      <div className="space-y-2 text-gray-600">
        <p>{address}</p>
        <p>{phone}</p>
        {email && <p>{email}</p>}
      </div>
      {isAdmin && (
        <div className="flex gap-2">
          <Button variant="outline" className="w-full" onClick={() => onEdit(id)}>
            Editar
          </Button>
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => onDelete(id)}
          >
            Eliminar
          </Button>
        </div>
      )}
    </div>
  );
};