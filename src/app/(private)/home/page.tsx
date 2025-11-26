"use client";

import CustomButton from "@/components/Buttons/CustomButton";
import CardAnimal from "@/components/Cards/CardAnimal";
import Filter from "@/components/Filter/Filter";
import ModalRegisterAnimal from "@/components/Modals/ModalRegisterAnimal";
import { mockAnimals } from "@/mocks/animal";
import { PetsOutlined } from "@mui/icons-material";
import { Card } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";

export default function HomePage() {
  const theme = useTheme();
  const [openModal, setOpenModal] = React.useState(false);
  const [animals, setAnimals] = React.useState(mockAnimals);

  const handleInterestToggle = (animalId: string, interested: boolean) => {
    setAnimals((prevAnimals) =>
      prevAnimals.map((animal) =>
        animal.id === animalId ? { ...animal, isInterested: interested } : animal
      )
    );
  };

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
          <Filter />
        </div>
        <div className="flex flex-wrap gap-3 flex-1 max-h-screen overflow-y-auto">
          {renderCards()}
        </div>
      </div>

      <ModalRegisterAnimal open={openModal} onClose={() => setOpenModal(false)} />
    </>
  );
}
