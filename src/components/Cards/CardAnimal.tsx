"use client";

import {
  ArrowDropDownOutlined,
  PlaceOutlined,
} from "@mui/icons-material";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";
import Image from "next/image";
import CustomButton from "../Buttons/CustomButton";
import ModalViewAnimal from "../Modals/ModalViewAnimal";

export default function CardAnimal() {
  const theme = useTheme();
  const [openModal, setOpenModal] = React.useState(false);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          paddingX: "16px",
          paddingY: "12px",
          borderRadius: "8px",
          backgroundColor: theme.palette.card.default,
          flexBasis: {
            xs: "100%",   
            sm: "40%",    
            md: "33.33%", 
            lg: "25%",    
          },
          flexGrow: 1,
          flexShrink: 0,
          padding: "12px",
          maxHeight: "fit-content", 
        }}
      >
        <div className="flex justify-between">
          <p
            className="font-semibold"
            style={{ color: theme.palette.text.primary }}
          >
            Frajola
          </p>
          <div className="flex">
            <PlaceOutlined />
            <p
              className="font-semibold"
              style={{ color: theme.palette.text.primary }}
            >
              10km
            </p>
          </div>
        </div>
        <div className="relative w-full h-60">
          <Image
            src="/imagem-exemplo-card.png"
            alt="Foto de um gato"
            fill
            className="rounded-lg object-cover"
          />
        </div>
        <div>
          <div className="flex gap-1">
            <p
              className="font-semibold"
              style={{ color: theme.palette.text.primary }}
            >
              Idade:
            </p>
            <p className="font-semibold" style={{ color: theme.palette.text.secondary }}>
              1 ano e 2 meses
            </p>
          </div>
          <div className="flex justify-between">
            <div className="flex gap-1">
              <p
                className="font-semibold"
                style={{ color: theme.palette.text.primary }}
              >
                Sexo:
              </p>
              <p className="font-semibold" style={{ color: theme.palette.text.secondary }}>Macho</p>
            </div>
            <div className="flex gap-1">
              <p
                className="font-semibold"
                style={{ color: theme.palette.text.primary }}
              >
                Porte:
              </p>
              <p className="font-semibold" style={{ color: theme.palette.text.secondary }}>Pequeno</p>
            </div>
          </div>
        </div>

        <CustomButton
          textButton="Tenho interesse"
          backgroundColor={theme.palette.secondary.main}
          color={theme.palette.text.primary}
          fullWidth
        />

        <div
          className="flex justify-center items-center text-sm font-semibold cursor-pointer"
          style={{ color: theme.palette.text.primary }}
          onClick={() => setOpenModal(true)}
        >
          <p>Ver mais</p>
          <ArrowDropDownOutlined />
        </div>
      </Box>

      <ModalViewAnimal open={openModal} onClose={() => setOpenModal(false)} />
    </>
  );
}
