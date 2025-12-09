"use client";

import { useState, useEffect, useCallback } from "react";
import CardAnimal from "@/components/Cards/CardAnimal";
import CardPersonalInfos from "@/components/Cards/CardPersonalInfos";
import { Animal } from "@/types/animal";
import { ArrowRight, Add } from "@mui/icons-material";
import {
  Box,
  Button,
  Stack,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ModalAnimal from "@/components/Modals/ModalAnimal";

export default function ProfilePage() {
  const theme = useTheme();
  const [view, setView] = useState<"profile" | "animals" | "interests">(
    "profile"
  );
  const [animals, setAnimals] = useState<Animal[]>([]); // Todos animais
  const [myAnimals, setMyAnimals] = useState<Animal[]>([]); // Animais do usuário
  const [loading, setLoading] = useState(true);
  const [loadingMyAnimals, setLoadingMyAnimals] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | undefined>();

  const fetchMyAnimals = useCallback(async () => {
    console.log("🔄 fetchMyAnimals chamado");
    setLoadingMyAnimals(true);
    try {
      const response = await fetch("/api/pets/my-pets", {
        cache: "no-store",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Falha ao buscar animais");
      const data = await response.json();
      console.log("✅ fetchMyAnimals: dados recebidos", data.length, "itens");
      setMyAnimals(data);
    } catch (error) {
      console.error("❌ fetchMyAnimals erro:", error);
    } finally {
      setLoadingMyAnimals(false);
    }
  }, []);

  // Busca todos os animais (para a aba de interesses)
  useEffect(() => {
    async function fetchAnimals() {
      try {
        const response = await fetch("/api/animals", { cache: "no-store" });
        const data = await response.json();
        setAnimals(data);
      } catch (error) {
        console.error("Erro ao carregar animais", error);
      }
    }
    fetchAnimals();
  }, []);

  // Busca animais do usuário quando a view muda para "animals"
  useEffect(() => {
    fetchMyAnimals();
  }, [fetchMyAnimals]);

  const handleInterestToggle = (animalId: string, interested: boolean) => {
    setAnimals((prevAnimals) =>
      prevAnimals.map((animal) =>
        animal.id === animalId
          ? { ...animal, isInterested: interested }
          : animal
      )
    );
  };

  const handleEditAnimal = (animalId: string) => {
    const animal = myAnimals.find((a) => a.id === animalId);
    setSelectedAnimal(animal);
    setModalMode("edit");
    setOpenModal(true);
  };

  const handleDeleteAnimal = async (animalId: string) => {
    try {
      const response = await fetch(`/api/pets?id=${animalId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        // Remove o animal da lista local IMEDIATAMENTE
        setMyAnimals((prev) => prev.filter((animal) => animal.id !== animalId));

        // Recarrega os animais para garantir sincronização
        fetchMyAnimals();

        console.log("Animal excluído com sucesso!");
      } else {
        console.error("Erro ao excluir animal:", await response.text());
      }
    } catch (error) {
      console.error("Erro ao excluir animal:", error);
    }
  };

  const handleAddNewAnimal = () => {
    setSelectedAnimal(undefined);
    setModalMode("create");
    setOpenModal(true);
  };

  const handleAdoptAnimal = (animalId: string) => {
    console.log("Marcar como adotado:", animalId);
  };

  // Função chamada após sucesso no modal
  const handleModalSuccess = useCallback(() => {
    console.log("✅ handleModalSuccess chamado - recarregando animais");
    fetchMyAnimals();
    setOpenModal(false);
    setSelectedAnimal(undefined);
  }, [fetchMyAnimals]);
    const handleViewProfile = () => setView("profile");
    const handleViewRegisteredAnimals = () => setView("animals");

  const renderMyAnimals = () => {
    if (loadingMyAnimals) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress sx={{ color: theme.palette.secondary.main }} />
        </Box>
      );
    }

    if (myAnimals.length === 0) {
      return (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h6" color="text.tertiary">
            Você ainda não cadastrou nenhum pet
          </Typography>
          <Typography
            variant="body2"
            color="text.tertiary"
            sx={{ mt: 1, mb: 3 }}
          >
            Cadastre seu primeiro pet para encontrar um lar amoroso!
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddNewAnimal}
            sx={{
              bgcolor: theme.palette.secondary.main,
              "&:hover": { bgcolor: theme.palette.secondary.dark },
            }}
          >
            Cadastrar primeiro pet
          </Button>
        </Box>
      );
    }

    return (
      <>
        <div className="flex flex-wrap gap-3">
          {myAnimals.map((animal) => (
            <CardAnimal
              key={animal.id}
              animal={animal}
              variant="myPets"
              onInterestToggle={handleInterestToggle}
              onAdopt={handleAdoptAnimal}
              onEdit={handleEditAnimal}
              onDelete={handleDeleteAnimal}
              showInterestButton={false}
            />
          ))}
        </div>
      </>
    );
  };

  return (
    <>
      <div className="flex gap-4 min-h-screen flex-wrap">
        <div className="flex flex-col gap-3 w-full md:w-1/4">
          <Box
            sx={{
              backgroundColor: theme.palette.card.default,
              color: theme.palette.secondary.main,
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <Typography variant="h6" fontStyle={"semibold"}>
              Perfil
            </Typography>
            <Stack spacing={1}>
              <Button
                variant="text"
                onClick={handleViewProfile}
                sx={{
                  color: theme.palette.secondary.main,
                  justifyContent: "flex-start",
                  gap: 1,
                  textTransform: "none",
                  fontWeight: view === "profile" ? "bold" : "normal",
                }}
                startIcon={<ArrowRight />}
              >
                Dados pessoais
              </Button>
              <Button
                variant="text"
                onClick={handleViewRegisteredAnimals}
                sx={{
                  color: theme.palette.secondary.main,
                  justifyContent: "flex-start",
                  gap: 1,
                  textTransform: "none",
                  fontWeight: view === "animals" ? "bold" : "normal",
                }}
                startIcon={<ArrowRight />}
              >
                Meus animais
              </Button>
              {/* <Button
                variant="text"
                onClick={handleViewInterestList}
                sx={{
                  color: theme.palette.secondary.main,
                  justifyContent: "flex-start",
                  gap: 1,
                  textTransform: "none",
                  fontWeight: view === "interests" ? "bold" : "normal",
                }}
                startIcon={<ArrowRight />}
              >
                Interesses
              </Button> */}
            </Stack>
          </Box>
        </div>

        {view === "profile" && (
          <div className="flex flex-col gap-3 flex-1">
            <CardPersonalInfos />
          </div>
        )}

        {view === "animals" && (
          <div className="flex flex-col gap-3 flex-1">
            <Box
              sx={{
                backgroundColor: theme.palette.card.default,
                color: theme.palette.secondary.main,
                padding: "8px",
                borderRadius: "8px",
              }}
            >
              <p className="font-bold text-center px-6">Animais cadastrados</p>
            </Box>
            <div className="flex-1 max-h-screen overflow-y-auto p-2">
              {renderMyAnimals()}
            </div>
          </div>
        )}
      </div>

      {/* Modal unificado para criar/editar */}
      <ModalAnimal
        open={openModal}
        onClose={() => setOpenModal(false)}
        mode={modalMode}
        animal={selectedAnimal}
        onSuccess={handleModalSuccess}
      />
    </>
  );
}
