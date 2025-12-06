"use client";

import CardAnimal from "@/components/Cards/CardAnimal";
import CardPersonalInfos from "@/components/Cards/CardPersonalInfos";
import Filter from "@/components/Filter/Filter";
import { Animal } from "@/types/animal";
import { ArrowRight } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";

export default function ProfilePage() {
  const theme = useTheme();
  const [view, setView] = React.useState<"profile" | "animals" | "interests">(
    "profile"
  );
 const [animals, setAnimals] = React.useState<Animal[]>([]);

 React.useEffect(() => {
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
  
  const handleInterestToggle = (animalId: string, interested: boolean) => {
    setAnimals((prevAnimals) =>
      prevAnimals.map((animal) =>
        animal.id === animalId ? { ...animal, isInterested: interested } : animal
      )
    );
  };

  const handleViewProfile = () => setView("profile");
  const handleViewRegisteredAnimals = () => setView("animals");
  const handleViewInterestList = () => setView("interests");

  const renderCards = () => {
    return animals.map((animal) => (
      <CardAnimal 
        key={animal.id}
        animal={animal}
        variant="default"
        onInterestToggle={handleInterestToggle}
      />
    ));
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
                }}
                startIcon={<ArrowRight />}
              >
                <p className="font-bold">Dados pessoais</p>
              </Button>
              <Button
                variant="text"
                onClick={handleViewRegisteredAnimals}
                sx={{
                  color: theme.palette.secondary.main,
                  justifyContent: "flex-start",
                  gap: 1,
                  textTransform: "none",
                }}
                startIcon={<ArrowRight />}
              >
                <p className="font-bold">Animais cadastrados</p>
              </Button>
              <Button
                variant="text"
                onClick={handleViewInterestList}
                sx={{
                  color: theme.palette.secondary.main,
                  justifyContent: "flex-start",
                  gap: 1,
                  textTransform: "none",
                }}
                startIcon={<ArrowRight />}
              >
                <p className="font-bold">Lista de interesses</p>
              </Button>
            </Stack>
          </Box>
          {/* <Filter /> */}
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
                color: theme.palette.tertiary.main,
                padding: "8px",
                borderRadius: "8px",
              }}
            >
              <p className="font-bold text-center px-6">Animais cadastrados</p>
            </Box>
            <div className="flex flex-wrap gap-3 flex-1 max-h-screen overflow-y-auto">
              {renderCards()}
            </div>
          </div>
        )}

        {view === "interests" && (
          <div className="flex flex-col gap-3 flex-1">
            <Box
              sx={{
                backgroundColor: theme.palette.card.default,
                color: theme.palette.tertiary.main,
                padding: "8px",
                borderRadius: "8px",
              }}
            >
              <p className="font-bold text-center px-6">Lista de interesses</p>
            </Box>
            <div className="flex flex-wrap gap-3 flex-1 max-h-screen overflow-y-auto">
              {renderCards()}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
