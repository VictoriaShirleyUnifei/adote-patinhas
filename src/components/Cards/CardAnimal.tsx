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
import { capitalize } from "@/utils/capitalize";
import ModalAnimal from "../Modals/ModalAnimal";

interface CardAnimalProps {
  animal: Animal;
  variant?: "default" | "interested" | "myPets";
  onInterestToggle?: (animalId: string, interested: boolean) => void;
  onAdopt?: (animalId: string) => void;
  onEdit?: (animalId: string) => void;
  onDelete?: (animalId: string) => void;
  showInterestButton?: boolean;
}

export default function CardAnimal({ 
  animal, 
  variant = "default",
  onInterestToggle,
  onAdopt,
  onEdit,
  onDelete,
  showInterestButton = true
}: CardAnimalProps) {
  const theme = useTheme();
  const [openViewModal, setOpenViewModal] = React.useState(false);
  const [openEditModal, setOpenEditModal] = React.useState(false);

  // Cria handlers que não recebem parâmetros
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

  const handleEditClick = () => {
    if (onEdit) {
      onEdit(animal.id);
    }
    setOpenEditModal(true);
  };

  const handleDeleteClick = () => {
    if (onDelete && confirm("Tem certeza que deseja excluir este pet?")) {
      onDelete(animal.id);
    }
  };

  // Cria handlers que recebem evento para parar propagação
  const handleInterestClickWithStopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleInterestClick();
  };

  const handleAdoptClickWithStopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleAdoptClick();
  };

  const handleEditClickWithStopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleEditClick();
  };

  const handleDeleteClickWithStopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleDeleteClick();
  };

  // Para o botão no CardAnimal que usa onClick direto no elemento
  const handleCardClick = () => {
    if (variant === "myPets") {
      setOpenEditModal(true);
    } else {
      setOpenViewModal(true);
    }
  };

  const handleVerMaisClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleCardClick();
  };

  const getButtonConfig = () => {
    switch (variant) {
      case "interested":
        return {
          text: "Remover interesse",
          backgroundColor: theme.palette.error.main,
          onClick: handleInterestClick,
          onClickWithEvent: handleInterestClickWithStopPropagation
        };
      case "myPets":
        return {
          text: "Marcar como adotado",
          backgroundColor: theme.palette.success.main,
          onClick: handleAdoptClick,
          onClickWithEvent: handleAdoptClickWithStopPropagation
        };
      default:
        return {
          text: animal.isInterested ? "Remover interesse" : "Tenho interesse",
          backgroundColor: animal.isInterested 
            ? theme.palette.error.main 
            : theme.palette.secondary.main,
          onClick: handleInterestClick,
          onClickWithEvent: handleInterestClickWithStopPropagation
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
          cursor: "pointer",
          '&:hover': {
            boxShadow: 2,
            transform: 'translateY(-2px)',
            transition: 'all 0.2s ease-in-out'
          }
        }}
        onClick={handleCardClick}
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

        {showInterestButton && variant !== "myPets" && (
          <div onClick={(e) => e.stopPropagation()}>
            <CustomButton
              textButton={buttonConfig.text}
              backgroundColor={buttonConfig.backgroundColor}
              color={theme.palette.text.primary}
              fullWidth
              onClick={buttonConfig.onClick}
            />
          </div>
        )}

        <div
          className="flex justify-center items-center text-sm font-semibold cursor-pointer"
          style={{ color: theme.palette.text.primary }}
          onClick={handleVerMaisClick}
        >
          <p>{variant === "myPets" ? "Editar" : "Ver mais"}</p>
          <ArrowDropDownOutlined />
        </div>
      </Box>

      {/* Modal de visualização (para outros usuários) */}
      <ModalViewAnimal 
        open={openViewModal} 
        onClose={() => setOpenViewModal(false)}
        animal={animal}
        variant={variant}
        onInterestToggle={onInterestToggle}
        onAdopt={onAdopt}
      />

      {/* Modal de edição (para meus pets) */}
      {variant === "myPets" && (
        <ModalAnimal 
          open={openEditModal} 
          onClose={() => setOpenEditModal(false)}
          animal={animal}
          mode="edit"
          onSuccess={() => {
            setOpenEditModal(false);
            // Atualize a lista de animais se necessário
          }}
        />
      )}
    </>
  );
}