"use client";

import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { Avatar, Box, Button, Stack } from "@mui/material";
import { AccountCircleOutlined, LogoutOutlined } from "@mui/icons-material";
import { useRouter } from "next/navigation";

export default function HeaderMenu() {
  const theme = useTheme();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen(!open);

  return (
    <Box className="relative">
      {/* Avatar clicável */}
      <Avatar
        src="/imagem-exemplo-foto-de-perfil.jpg"
        alt="Foto de perfil"
        onClick={toggleMenu}
        sx={{ width: 60, height: 60, cursor: "pointer" }}
      />

      {open && (
        <Box
          className="absolute right-0 mt-2 p-2 shadow-lg rounded-md"
          sx={{
            backgroundColor: theme.palette.background.paper,
            minWidth: 180,
          }}
        >
          <Stack spacing={1}>
            <Button
              variant="text"
              onClick={() => console.log("Perfil")}
              sx={{
                color: theme.palette.secondary.main,
                justifyContent: "flex-start",
                gap: 1,
                textTransform: "none",
              }}
              startIcon={<AccountCircleOutlined />}
            >
              <p className="font-bold">Perfil</p>
            </Button>

            <Button
              variant="text"
              onClick={() => console.log("Sair")}
              sx={{
                color: theme.palette.secondary.main,
                justifyContent: "flex-start",
                gap: 1,
                textTransform: "none",
              }}
              startIcon={<LogoutOutlined />}
            >
              <p 
              onClick={() => router.push("/login")}
              className="font-bold">Sair</p>
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  );
}
