"use client";

import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useState } from "react";
import CustomButton from "../Buttons/CustomButton";
import CustomInput from "../Inputs/CustomInput";
import CustomSelect from "../Inputs/CustomSelect";

interface FilterProps {
  onFilterChange: (filters: FilterValues) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

export interface FilterValues {
  species: string;
  size: string;
  breed: string;
}

export default function Filter({
  onFilterChange,
  onApplyFilters,
  onClearFilters,
}: FilterProps) {
  const theme = useTheme();

  const [filters, setFilters] = useState<FilterValues>({
    species: "",
    size: "",
    breed: "",
  });

  const updateFilter = (field: keyof FilterValues, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const reset = { species: "", size: "", breed: ""};
    setFilters(reset);
    onClearFilters();
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        padding: "16px",
        borderRadius: "8px",
        backgroundColor: theme.palette.card.default,
      }}
    >
      <p
        className="font-bold text-1xl"
        style={{ color: theme.palette.secondary.main }}
      >
        Filtros de busca:
      </p>

      <CustomSelect
        label="Espécie"
        options={[
          { value: "", label: "Todas as espécies" },
          { value: "cachorro", label: "Cachorro" },
          { value: "gato", label: "Gato" },
          { value: "outro", label: "Outro" },
        ]}
        value={filters.species}
        onChange={(e) => updateFilter("species", e.target.value)}
      />

      <CustomSelect
        label="Porte"
        options={[
          { value: "", label: "Todos os portes" },
          { value: "pequeno", label: "Pequeno" },
          { value: "medio", label: "Médio" },
          { value: "grande", label: "Grande" },
        ]}
        value={filters.size}
        onChange={(e) => updateFilter("size", e.target.value)}
        labelColor={theme.palette.text.primary}
        backgroundColor={theme.palette.card.default}
        borderColor={theme.palette.text.primary}
      />

      <CustomInput
        label="Raça"
        placeholder="Digite a raça..."
        value={filters.breed}
        onChange={(e: any) => updateFilter("breed", e.target.value)}
        labelColor={theme.palette.text.primary}
        backgroundColor={theme.palette.card.default}
        color={theme.palette.text.primary}
        borderColor={theme.palette.text.primary}
      />

      {/* <CustomInput
        label="Localização"
        placeholder="Digite a localização..."
        value={filters.location}
        onChange={(e: any) => updateFilter("location", e.target.value)}
        labelColor={theme.palette.text.primary}
        backgroundColor={theme.palette.card.default}
        color={theme.palette.text.primary}
        borderColor={theme.palette.text.primary}
      /> */}

      <div className="flex gap-20 mt-4">
        <CustomButton
          variant="outlined"
          textButton="Limpar"
          color={theme.palette.secondary.main}
          borderColor={theme.palette.secondary.main}
          onClick={clearFilters}
        />
        <CustomButton
          textButton="Buscar"
          backgroundColor={theme.palette.secondary.main}
          onClick={onApplyFilters}
        />
      </div>
    </Box>
  );
}
