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
import { Animal } from "@/types/animal";
import { formatAgeFromDate } from "@/utils/formatAge";
import { capitalize } from "@/utils/captalize";
interface CardAnimalProps {
  animal: Animal;
  variant?: "default" | "interested" | "myPets";
  onInterestToggle?: (animalId: string, interested: boolean) => void;
  onAdopt?: (animalId: string) => void;
  showInterestButton?: boolean;
}

export default function CardAnimal({ 
  animal, 
  variant = "default",
  onInterestToggle,
  onAdopt,
  showInterestButton = true 
}: CardAnimalProps) {
  const theme = useTheme();
  const [openModal, setOpenModal] = React.useState(false);

  const handleInterestClick = () => {
    if (onInterestToggle) {
      onInterestToggle(animal.id, !animal.isInterested);
    }
  };

  const handleAdoptClick = () => {
    if (onAdopt) {
      onAdopt(animal.id);
    }
  };

  const getButtonConfig = () => {
    switch (variant) {
      case "interested":
        return {
          text: "Remover interesse",
          backgroundColor: theme.palette.error.main,
          onClick: handleInterestClick
        };
      case "myPets":
        return {
          text: "Marcar como adotado",
          backgroundColor: theme.palette.success.main,
          onClick: handleAdoptClick
        };
      default:
        return {
          text: animal.isInterested ? "Remover interesse" : "Tenho interesse",
          backgroundColor: animal.isInterested 
            ? theme.palette.error.main 
            : theme.palette.secondary.main,
          onClick: handleInterestClick
        };
    }
  };

  const buttonConfig = getButtonConfig();

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
          <p className="font-semibold" style={{ color: theme.palette.text.primary }}>
            {animal.nome}
          </p>
          {animal.distance && (
            <div className="flex">
              <PlaceOutlined />
              <p className="font-semibold" style={{ color: theme.palette.text.primary }}>
                {animal.distance}
              </p>
            </div>
          )}
        </div>
        
        <div className="relative w-full h-60">
          <Image
            src={`/uploads/${animal.foto}`}
            alt={`Foto de ${animal.nome}`}
            fill
            className="rounded-lg object-cover"
          />
        </div>
        
        <div>
          <div className="flex gap-1">
            <p className="font-semibold" style={{ color: theme.palette.text.primary }}>
              Idade:
            </p>
            <p className="font-semibold" style={{ color: theme.palette.text.secondary }}>
              {formatAgeFromDate(animal.dataNascimento)}
            </p>
          </div>
          <div className="flex justify-between">
            <div className="flex gap-1">
              <p className="font-semibold" style={{ color: theme.palette.text.primary }}>
                Sexo:
              </p>
              <p className="font-semibold" style={{ color: theme.palette.text.secondary }}>
                {capitalize(animal.sexo)}
              </p>
            </div>
            <div className="flex gap-1">
              <p className="font-semibold" style={{ color: theme.palette.text.primary }}>
                Porte:
              </p>
              <p className="font-semibold" style={{ color: theme.palette.text.secondary }}>
                {capitalize(animal.porte)}
              </p>
            </div>
          </div>
        </div>

        {showInterestButton && (
          <CustomButton
            textButton={buttonConfig.text}
            backgroundColor={buttonConfig.backgroundColor}
            color={theme.palette.text.primary}
            fullWidth
            onClick={buttonConfig.onClick}
          />
        )}

        <div
          className="flex justify-center items-center text-sm font-semibold cursor-pointer"
          style={{ color: theme.palette.text.primary }}
          onClick={() => setOpenModal(true)}
        >
          <p>Ver mais</p>
          <ArrowDropDownOutlined />
        </div>
      </Box>

      <ModalViewAnimal 
        open={openModal} 
        onClose={() => setOpenModal(false)}
        animal={animal}
        variant={variant}
        onInterestToggle={onInterestToggle}
        onAdopt={onAdopt}
      />
    </>
  );
}