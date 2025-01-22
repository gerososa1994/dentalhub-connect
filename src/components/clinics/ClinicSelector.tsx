import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Clinic {
  id: string;
  name: string;
}

interface ClinicSelectorProps {
  clinics: Clinic[];
  selectedClinic: string | null;
  onSelect: (value: string) => void;
}

export const ClinicSelector = ({
  clinics,
  selectedClinic,
  onSelect,
}: ClinicSelectorProps) => {
  return (
    <div className="w-full max-w-xs">
      <Select value={selectedClinic || ""} onValueChange={onSelect}>
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
  );
};