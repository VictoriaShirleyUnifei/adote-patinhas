// src/app/not-found.tsx
"use client";

import { useRouter } from "next/navigation";
import React from "react";
import Image from "next/image";
import CustomButton from "@/components/Buttons/CustomButton";

interface NotFoundProps {
  isLoggedIn?: boolean;
}

const NotFound: React.FC<NotFoundProps> = ({ isLoggedIn }) => {
  const router = useRouter();

  const handleRedirect = () => {
    if (isLoggedIn) {
      router.push("/private/home");
    } else {
      router.push("/");
    }
  };

  return (
    <div
      className="flex flex-col md:flex-row items-center justify-center"
      style={{ height: "100vh" }}
    >
      <Image
        src="/imagem-not-found.svg"
        alt="Página não encontrada"
        width={300}
        height={300}
      />
      <div className="flex flex-col items-center md:items-start md:ml-8">
        <h1 className="text-3xl md:text-5xl font-bold mt-4">
          Oops!!!
        </h1>
        <h2 className="text-xl md:text-2xl font-bold my-4">Página não encontrada.</h2>
        <CustomButton
          textButton="Voltar para o início"
          onClick={handleRedirect}
        />
      </div>
    </div>
  );
};

export default NotFound;
