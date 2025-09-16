"use client";

import Image from "next/image";
import { useTheme, alpha } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();

  return (
    <div className="flex min-h-screen">
      {/* Imagem */}
      <div className="relative w-1/2 hidden md:block h-screen">
        <Image
          src="/imagem-telas-externas.png"
          alt="Imagem de fundo"
          fill
          style={{ objectFit: "cover" }}
          priority
        />

        {/* Card transparente sobre a imagem */}
        <Box className="absolute inset-0 flex justify-center items-center">
          <Box
            className="w-full max-w-md sm:max-w-lg md:max-w-2xl p-6 sm:p-10 md:p-20 rounded-lg flex flex-col items-center text-center gap-4 sm:gap-7"
            sx={{
              backgroundColor: alpha(theme.palette.common.black, 0.5),
              color: "white",
            }}
          >
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{
                textTransform: "uppercase",
                fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
              }}
            >
              Adoção é um ato de amor!
            </Typography>
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{
                textTransform: "uppercase",
                fontSize: { xs: "1.2rem", sm: "1.5rem", md: "2rem" },
              }}
            >
              Não compre, adote!
            </Typography>
          </Box>
        </Box>
      </div>

      {/* Conteúdo */}
      <div
        className="flex-1 flex justify-center items-center px-20 overflow-auto"
        style={{ backgroundColor: theme.palette.primary.main }}
      >
        <div className="w-full max-w-2xl">{children}</div>
      </div>
    </div>
  );
}
