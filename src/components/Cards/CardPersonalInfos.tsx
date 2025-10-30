import { Box } from "@mui/material";
import React from "react";
import CustomButton from "../Buttons/CustomButton";
import { useTheme } from "@mui/material/styles";
import PhotoUpload from "../Inputs/PhotoUpload";
import CustomInput from "../Inputs/CustomInput";

export default function CardPersonalInfos() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "10px",
        paddingX: { xs: "12px", sm: "16px" },
        paddingY: { xs: "8px", sm: "12px" },
        borderRadius: "8px",
        backgroundColor: theme.palette.card.default,
        height: "100%",
        minHeight: "100vh",
      }}
    >
      <div className="flex-1">
        <p
          className="text-lg font-semibold"
          style={{ color: theme.palette.secondary.main }}
        >
          Dados pessoais
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 mb-4">
          <section className="space-y-4">
            <div className="flex flex-col items-center md:items-start">
              <PhotoUpload />
            </div>
            <CustomInput
              label="Nome"
              color="black"
              labelColor={theme.palette.text.primary}
              backgroundColor="#D9D9D9"
              borderColor="#D9D9D9"
            />
            <CustomInput
              label="E-mail"
              color="black"
              labelColor={theme.palette.text.primary}
              backgroundColor="#D9D9D9"
              borderColor="#D9D9D9"
            />
            <CustomInput
              label="Telefone"
              color="black"
              labelColor={theme.palette.text.primary}
              backgroundColor="#D9D9D9"
              borderColor="#D9D9D9"
            />
          </section>

          <section className="space-y-4">
            <p
              className="text-lg font-semibold"
              style={{ color: theme.palette.secondary.main }}
            >
              Endereço
            </p>
            <CustomInput
              label="CEP"
              color="black"
              labelColor={theme.palette.text.primary}
              backgroundColor="#D9D9D9"
              borderColor="#D9D9D9"
            />

            <div className="flex flex-col md:flex-row w-full gap-4">
              <CustomInput
                label="UF"
                color="black"
                labelColor={theme.palette.text.primary}
                backgroundColor="#D9D9D9"
                borderColor="#D9D9D9"
                width={20}
              />
              <CustomInput
                label="Município"
                color="black"
                labelColor={theme.palette.text.primary}
                backgroundColor="#D9D9D9"
                borderColor="#D9D9D9"
              />
            </div>

            <CustomInput
              label="Logradouro"
              color="black"
              labelColor={theme.palette.text.primary}
              backgroundColor="#D9D9D9"
              borderColor="#D9D9D9"
            />

            <p
              className="text-lg font-semibold mt-6"
              style={{ color: theme.palette.secondary.main }}
            >
              Redefinição de senha
            </p>
            <CustomInput
              label="Senha atual"
              color="black"
              labelColor={theme.palette.text.primary}
              backgroundColor="#D9D9D9"
              borderColor="#D9D9D9"
            />
            <CustomInput
              label="Confirmar senha"
              color="black"
              labelColor={theme.palette.text.primary}
              backgroundColor="#D9D9D9"
              borderColor="#D9D9D9"
            />
          </section>
        </div>
      </div>

      {/* Botões responsivos */}
      <section className="flex flex-col items-center md:justify-end md:items-end gap-3 mt-6">
        <CustomButton
          textButton="Editar perfil"
          backgroundColor={theme.palette.secondary.main}
          color="white"
          sx={{ 
            width: { xs: "100%", sm: "100%", lg: "280px", xl: "320px" },
            maxWidth: "100%"
          }}
        />
        <CustomButton
          textButton="Excluir conta"
          backgroundColor={theme.palette.tertiary.main}
          color="white"
          sx={{ 
            width: { xs: "100%", sm: "200px", lg: "280px", xl: "320px" },
            maxWidth: "100%"
          }}
        />
      </section>
    </Box>
  );
}