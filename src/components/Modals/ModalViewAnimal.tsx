"use client";

import { Modal, Box, Avatar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";
import CustomButton from "../Buttons/CustomButton";
import { Close, LocationOnOutlined } from "@mui/icons-material";
import Image from "next/image";

type ModalViewAnimalProps = {
  open: boolean;
  onClose: () => void;
};

export default function ModalViewAnimal({
  open,
  onClose,
}: ModalViewAnimalProps) {
  const theme = useTheme();

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: theme.palette.card.default,
          borderRadius: 2,
          boxShadow: 24,
          width: {
            xs: "90%",
            sm: "80%",
            md: "70%",
            lg: "60%",
          },
          maxHeight: "90vh", 
          overflowY: "auto",
          cursor: "default",
          p: 2
        }}
      >
        {/* --- Conteúdo principal --- */}
        <section className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4">
          <div>
            {/* --- Close responsivo --- */}
            <div className="flex justify-end cursor-pointer md:hidden" onClick={onClose}>
              <Close />
            </div>

            {/* --- Imagem e nome --- */}
            <div className="hidden md:flex md:justify-between">
              <p className="font-semibold">Frajola</p>
              <div className="flex items-center gap-1">
                <LocationOnOutlined />
                <p className="font-semibold">10km</p>
              </div>
            </div>
            <div className="relative w-full h-64">
              <Image
                src="/imagem-exemplo-card.png"
                alt="Foto de Gatinho"
                fill
                className="object-cover rounded-lg mt-2"
              />
            </div>

            {/* --- Imagem e nome responsivo --- */}
            <div className="flex justify-between mt-4 md:hidden">
              <p className="font-semibold">Frajola</p>
              <div className="flex items-center gap-1">
                <LocationOnOutlined />
                <p className="font-semibold">10km</p>
              </div>
            </div>
          </div>

          <div className="font-semibold">
            <div className="hidden md:flex md:justify-end md:cursor-pointer" onClick={onClose}>
              <Close />
            </div>
            <p>Descrição:</p>
            <p style={{ color: theme.palette.text.secondary }}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati
              vitae eligendi quo voluptates, similique, quis ratione earum,
              numquam tempora atque consequatur corporis fuga at itaque!
              Temporibus autem amet voluptatem id.
            </p>
            <p className="block font-semibold mt-3 md:hidden">Vacinado | Castrado | Vermifugado</p>
          </div>
        </section>

        {/* --- Informações adicionais --- */}
        <section className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 mt-4 font-semibold">
          <div>
            <div className="flex gap-2">
              <p>Idade:</p>
              <p style={{ color: theme.palette.text.secondary }}>
                1 ano e 2 meses
              </p>
            </div>
            <div className="grid grid-cols-2 gap-y-2">
              <div className="flex gap-2">
                <p>Sexo:</p>
                <p style={{ color: theme.palette.text.secondary }}>Macho</p>
              </div>
              <div className="flex gap-2">
                <p>Porte:</p>
                <p style={{ color: theme.palette.text.secondary }}>Médio</p>
              </div>
              <div className="flex gap-2">
                <p>Espécie:</p>
                <p style={{ color: theme.palette.text.secondary }}>Felina</p>
              </div>
              <div className="flex gap-2">
                <p>Raça:</p>
                <p style={{ color: theme.palette.text.secondary }}>SRD</p>
              </div>
            </div>
          </div>

          <div>
            <p className="hidden md:block">Vacinado | Castrado | Vermifugado</p>
            <div className="flex flex-col text-center md:grid md:grid-cols-2 md:gap-y-2 md:text-start">
              <div>
                <p>Se dá bem com outros animais</p>
                <p>Se dá bem com crianças</p>
              </div>
              <div>
                <p>Necessita cuidados especiais</p>
                <p>Animal idoso</p>
                <p>Animal com deficiência</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- Tutor e botão --- */}
        <section className="flex flex-col md:flex-row justify-between items-center pt-4 font-semibold text-sm gap-4">
          <div className="flex gap-4 items-center">
            <Avatar
              src="/imagem-exemplo-foto-de-perfil.jpg"
              alt="Foto de perfil"
              sx={{ width: 60, height: 60, cursor: "pointer" }}
            />
            <div>
              <p>Maria Rita de Lima</p>
              <p style={{ color: theme.palette.text.secondary }}>
                (35) 99999-9999
              </p>
              <div
                className="flex text-[10px] gap-1"
                style={{ color: theme.palette.secondary.main }}
              >
                <p>Data da publicação:</p>
                <p>12/04/2024</p>
              </div>
            </div>
          </div>

          <CustomButton
            textButton="Tenho interesse"
            backgroundColor={theme.palette.secondary.main}
            fullWidth={false}
            sx={{ width: { xs: "100%", md: 300 }, height: 40 }}
          />
        </section>
      </Box>
    </Modal>
  );
}
