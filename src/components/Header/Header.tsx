// Header.tsx
"use client";

import { useTheme } from "@mui/material/styles";
import ButtonTheme from "../Buttons/ButtonTheme";
import HeaderMenu from "./HeaderMenu";
import Image from "next/image";
import { useUserData } from "@/hooks/useUserData";

export default function Header() {
  const theme = useTheme();
  const { userData, loading } = useUserData();

  const routeToHome = () => {
    window.location.href = "/home";
  }

  const logo =
    theme.palette.mode === "light"
      ? "/logo-marrom.svg"
      : "/logo-branca.svg";

  return (
    <header
      className="w-full px-4 py-2 flex justify-between items-center shadow"
      style={{
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <div className="flex items-center gap-2 cursor-pointer" onClick={routeToHome}>
        <Image src={logo} alt="Logo Adote Patinhas" width={140} height={50} />
      </div>

      <div className="flex gap-6 justify-center items-center">
        <div className="ml-auto text-right hidden md:flex md:flex-col">
          {loading ? (
            <div className="space-y-2">
              <div className="h-5 w-32 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ) : (
            <>
              <p
                className="font-bold truncate max-w-[200px]" 
                style={{ color: theme.palette.secondary.main }}
              >
                {userData?.nome || "Usuário"}
              </p>
              <p className="font-bold truncate max-w-[200px]">
                {userData?.email}
              </p>
            </>
          )}
        </div>

        <div>
          <HeaderMenu />
        </div>
        <ButtonTheme />
      </div>
    </header>
  );
}