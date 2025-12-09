"use client";

import { Modal, Box, Avatar, capitalize } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import CustomButton from "../Buttons/CustomButton";
import { Close, LocationOnOutlined } from "@mui/icons-material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Animal } from "../../types/animal";
import { formatAgeFromDate } from "@/utils/formatAge";
import { formatRelativeDate } from "@/utils/formatDate";

interface ModalViewAnimalProps {
  open: boolean;
  onClose: () => void;
  animal: Animal;
  variant?: "default" | "interested" | "myPets";
  onInterestToggle?: (animalId: string, interested: boolean) => void;
  onAdopt?: (animalId: string) => void;
}

interface UserInfo {
  id?: string;
  nome?: string;
  telefone?: string;
  phone?: string;
  email?: string;
  foto?: string;
  avatar?: string;
}

export default function ModalViewAnimal({
  open,
  onClose,
  animal,
  variant = "default",
  onInterestToggle,
  onAdopt
}: ModalViewAnimalProps) {
  const theme = useTheme();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  // Extrai informações do usuário do animal
  useEffect(() => {
    if (animal) {
      const userData: UserInfo = {
        id: animal.id,
        nome: animal.nome,
        telefone: animal.userPhone,
        phone: animal.userPhone,
        email: animal.userEmail,
        foto: animal.userFoto,
        avatar: animal.userFoto || "/default-avatar.png"
      };
      setUserInfo(userData);
    }
  }, [animal]);

  const handleInterestClick = () => {
    if (onInterestToggle) {
      const newInterestState = !animal.isInterested;
      onInterestToggle(animal.id, newInterestState);
      
      if (newInterestState && variant === "default") {
        router.push("/perfil?tab=interesses");
      }
    }
  };

  const handleAdoptClick = () => {
    if (onAdopt) {
      onAdopt(animal.id);
      onClose();
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

  // Status do animal (vacinado, castrado, etc.)
  const animalStatus = [
    animal.saude?.vacinado && "Vacinado",
    animal.saude?.castrado && "Castrado",
    animal.saude?.vermifugado && "Vermifugado"
  ].filter(Boolean).join(" | ");

  // Características comportamentais
  const behavioralTraits = [
    animal.convivencia?.outrosAnimais && "Se dá bem com outros animais",
    animal.convivencia?.criancas && "Se dá bem com crianças",
    animal.condicoes?.cuidadosEspeciais && "Necessita cuidados especiais",
    animal.condicoes?.idoso && "Animal idoso",
    animal.condicoes?.deficiencia && "Animal com deficiência"
  ].filter(Boolean);

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
        {/* Conteúdo do modal */}
        <section className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4">
          <div>
            <div className="flex justify-end cursor-pointer md:hidden" onClick={onClose}>
              <Close />
            </div>

            <div className="hidden md:flex md:justify-between">
              <p className="font-semibold">{animal.nome}</p>
              {animal.distance && (
                <div className="flex items-center gap-1">
                  <LocationOnOutlined />
                  <p className="font-semibold">{animal.distance}</p>
                </div>
              )}
            </div>
            
            <div className="relative w-full h-64">
              <Image
                src={`/uploads/${animal.foto}`}
                alt={`Foto de ${animal.nome}`}
                fill
                className="rounded-lg object-cover"
                onError={(e) => {
                  // Fallback se a imagem não carregar
                  e.currentTarget.src = "/default-pet.jpg";
                }}
              />
            </div>

            <div className="flex justify-between mt-4 md:hidden">
              <p className="font-semibold">{animal.nome}</p>
              {animal.distance && (
                <div className="flex items-center gap-1">
                  <LocationOnOutlined />
                  <p className="font-semibold">{animal.distance}</p>
                </div>
              )}
            </div>
          </div>

          <div className="font-semibold">
            <div className="hidden md:flex md:justify-end md:cursor-pointer" onClick={onClose}>
              <Close />
            </div>
            <p>Descrição:</p>
            <p style={{ color: theme.palette.text.secondary }}>
              {animal.descricao || "Descrição não disponível."}
            </p>
            {animalStatus && (
              <p className="block font-semibold mt-3 md:hidden">{animalStatus}</p>
            )}
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 mt-4 font-semibold">
          <div>
            <div className="flex gap-2">
              <p>Idade:</p>
              <p style={{ color: theme.palette.text.secondary }}>
                {formatAgeFromDate(animal.dataNascimento)}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-y-2">
              <div className="flex gap-2">
                <p>Sexo:</p>
                <p style={{ color: theme.palette.text.secondary }}>{capitalize(animal.sexo)}</p>
              </div>
              <div className="flex gap-2">
                <p>Porte:</p>
                <p style={{ color: theme.palette.text.secondary }}>{capitalize(animal.porte)}</p>
              </div>
              <div className="flex gap-2">
                <p>Espécie:</p>
                <p style={{ color: theme.palette.text.secondary }}>
                  {animal.especie || "Não informado"}
                </p>
              </div>
              <div className="flex gap-2">
                <p>Raça:</p>
                <p style={{ color: theme.palette.text.secondary }}>
                  {animal.raca || "Não informado"}
                </p>
              </div>
            </div>
          </div>

          <div>
            {animalStatus && (
              <p className="hidden md:block">{animalStatus}</p>
            )}
            {behavioralTraits.length > 0 && (
              <div className="flex flex-col text-center md:grid md:grid-cols-2 md:gap-y-2 md:text-start mt-2 md:mt-0">
                <div>
                  {behavioralTraits.slice(0, Math.ceil(behavioralTraits.length / 2)).map((trait, index) => (
                    <p key={index} style={{ color: theme.palette.text.secondary }}>{trait}</p>
                  ))}
                </div>
                <div>
                  {behavioralTraits.slice(Math.ceil(behavioralTraits.length / 2)).map((trait, index) => (
                    <p key={index} style={{ color: theme.palette.text.secondary }}>{trait}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="flex flex-col md:flex-row justify-between items-center pt-4 font-semibold text-sm gap-4">
            <div className="flex gap-4 items-center">
              <Avatar
                src={animal.userFoto || "/default-avatar.png"}
                alt={`Foto de ${animal.userName}`}
                sx={{ 
                  width: 60, 
                  height: 60, 
                  color: "#fff",
                  backgroundColor: theme.palette.tertiary.main,
                }}
              >
                {!animal.userFoto && animal.userName ? animal.userName.charAt(0).toUpperCase() : null}
              </Avatar>
              <div>
                <p>{animal.userName}</p>
                <p style={{ color: theme.palette.text.secondary }}>
                  {animal.userPhone}
                </p>
                <div className="flex text-[10px] gap-1" style={{ color: theme.palette.secondary.main }}>
                  <p>Data da publicação:</p>
                  <p>{formatRelativeDate(animal.cadastroData)}</p>
                </div>
              </div>
            </div>

          <CustomButton
            textButton={buttonConfig.text}
            backgroundColor={buttonConfig.backgroundColor}
            fullWidth={false}
            onClick={buttonConfig.onClick}
            sx={{ width: { xs: "100%", md: 320 }, height: 40 }}
          />
        </section>
      </Box>
    </Modal>
  );
}
