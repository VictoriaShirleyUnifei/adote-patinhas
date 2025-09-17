"use client";

import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";
import CustomButton from "../Buttons/CustomButton";
import CustomInput from "../Inputs/CustomInput";
import CustomSelect from "../Inputs/CustomSelect";

export default function Filter() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        padding: "16px",
        borderRadius: "8px",
        backgroundColor: theme.palette.card.default,
        width: "30%",
        height: "auto",
      }}
    >
      <p
        className="font-bold mb-3 text-1xl"
        style={{ color: theme.palette.secondary.main }}
      >
        Filtros de busca:
      </p>

      <CustomSelect 
        label="Espécie"
        options={[
          { value: "todas", label: "Todas as espécies" },
          { value: "cachorro", label: "Cachorro" },
          { value: "gato", label: "Gato" },
          { value: "outro", label: "Outro" },
        ]}
        labelColor={theme.palette.text.primary}
        backgroundColor={theme.palette.card.default}
        borderColor={theme.palette.text.primary}
      />

      <CustomSelect 
        label="Porte"
        options={[
          { value: "todos", label: "Todos os portes" },
          { value: "pequeno", label: "Pequeno" },
          { value: "medio", label: "Médio" },
          { value: "grande", label: "Grande" },
        ]}
        labelColor={theme.palette.text.primary}
        backgroundColor={theme.palette.card.default}
        borderColor={theme.palette.text.primary}
      />

      <CustomInput
        label="Raça"
        placeholder="Digite a raça..."
        labelColor={theme.palette.text.primary}
        backgroundColor={theme.palette.card.default}
        color={theme.palette.text.primary}
        borderColor={theme.palette.text.primary}
      />

      <CustomInput
        label="Localização"
        placeholder="Digite a localização..."
        labelColor={theme.palette.text.primary}
        backgroundColor={theme.palette.card.default}
        color={theme.palette.text.primary}
        borderColor={theme.palette.text.primary}
      />

      <div className="flex gap-20 mt-4">
        <CustomButton
          variant="outlined"
          textButton="Limpar"
          color={theme.palette.secondary.main}
          borderColor={theme.palette.secondary.main}
          onClick={() => console.log("Limpar clicked")}
        />
        <CustomButton
          textButton="Buscar"
          backgroundColor={theme.palette.secondary.main}
          onClick={() => console.log("Buscar clicked")}
        />
      </div>
    </Box>
  );
}
