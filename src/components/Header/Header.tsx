"use client";

import { useTheme } from "@mui/material/styles";
import ButtonTheme from "../ButtonTheme";
import HeaderMenu from "./HeaderMenu";

export default function Header() {
  const theme = useTheme();

  const logo =
    theme.palette.mode === "light"
      ? "/logo-marrom.svg" // logo para modo claro
      : "/logo-branca.svg"; // logo para modo escuro

  return (
    <header
      className="w-full px-4 py-2 flex justify-between items-center shadow"
      style={{
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <div className="flex items-center gap-2">
        <img src={logo} alt="Logo" className="h-16" />
      </div>

      <div className="flex gap-6 justify-center items-center">
        <div className="ml-auto text-right hidden md:flex md:flex-col">
          <p
            className="font-bold" 
            style={{ color: theme.palette.secondary.main}}
            >Victória Silva</p>
          <p className="font-bold">victoriasilva@gmail.com</p>
        </div>

        <div>
          <HeaderMenu />
        </div>
        <ButtonTheme />
      </div>
    </header>
  );
}
