"use client";

import CustomButton from "@/components/Buttons/CustomButton";
import CardAnimal from "@/components/Cards/CardAnimal";
import Filter, { FilterValues } from "@/components/Filter/Filter";
import { PetsOutlined } from "@mui/icons-material";
import { Card, CircularProgress, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useCallback, useEffect, useState } from "react";
import { Animal } from "@/types/animal";
import ModalAnimal from "@/components/Modals/ModalAnimal";

export default function HomePage() {
  const theme = useTheme();
  const [openModal, setOpenModal] = useState(false);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterValues>({
    species: "",
    size: "",
    breed: "",
  });
  const [appliedFilters, setAppliedFilters] = useState<FilterValues>({
    species: "",
    size: "",
    breed: "",
  });

  const loadAnimals = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/pets");
      const data = await res.json();
      setAnimals(data);
    } catch (error) {
      console.error("Erro ao carregar animais:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnimals();
  }, [loadAnimals]);

  const handleInterestToggle = (animalId: string, interested: boolean) => {
    setAnimals((prevAnimals) =>
      prevAnimals.map((animal) =>
        animal.id === animalId
          ? { ...animal, isInterested: interested }
          : animal
      )
    );
  };

  const filteredAnimals = React.useMemo(() => {
    return animals.filter((animal) => {
      const matchSpecies =
        !appliedFilters.species || animal.especie === appliedFilters.species;

      const matchSize =
        !appliedFilters.size || animal.porte === appliedFilters.size;

      const matchBreed =
        !appliedFilters.breed ||
        animal.raca?.toLowerCase().includes(appliedFilters.breed.toLowerCase());

      return matchSpecies && matchSize && matchBreed;
    });
  }, [animals, appliedFilters]); 

  const renderCards = () => {
    if (loading) {
      return (
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          width="100%" 
          height="300px"
        >
          <CircularProgress 
            size={60} 
            sx={{ 
              color: theme.palette.primary.main 
            }} 
          />
        </Box>
      );
    }

    if (filteredAnimals.length === 0) {
      return (
        <Box 
          display="flex" 
          flexDirection="column" 
          justifyContent="center" 
          alignItems="center" 
          width="100%" 
          height="300px"
          color="text.secondary"
        >
          <PetsOutlined sx={{ fontSize: 60, mb: 2, opacity: 0.5 }} />
          <p className="text-lg font-medium">
            {animals.length === 0 
              ? "Nenhum animal cadastrado" 
              : "Nenhum animal encontrado com os filtros aplicados"}
          </p>
        </Box>
      );
    }

    return filteredAnimals.map((animal) => (
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
          <Card
            sx={{
              backgroundColor: theme.palette.tertiary.main,
              color: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: theme.shadows[3],
            }}
          >
            <p className="font-bold text-center px-8 pb-4">
              Tem um animal precisando de um lar?
            </p>
            <CustomButton
              textButton="Cadastrar pet"
              backgroundColor="white"
              color={theme.palette.secondary.main}
              sx={{ fontWeight: "bold" }}
              icon={<PetsOutlined />}
              onClick={() => setOpenModal(true)}
            />
          </Card>
          <Filter
            onFilterChange={(values) => setFilters(values)}
            onApplyFilters={() => setAppliedFilters(filters)}
            onClearFilters={() => {
              const empty = { species: "", size: "", breed: "", location: "" };
              setFilters(empty);
              setAppliedFilters(empty);
            }}
          />
        </div>
        <div className="flex flex-wrap gap-3 flex-1 max-h-screen overflow-y-auto">
          {renderCards()}
        </div>
      </div>

      <ModalAnimal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={loadAnimals}
      />
    </>
  );
}