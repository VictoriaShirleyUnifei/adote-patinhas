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

  const handleLogout = async () => {
    await fetch("/api/logout", {
      method: "GET",
    });

    router.push("/login");
  };

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
          className="fixed right-20 mt-2 p-2 shadow-lg rounded-md z-50"
          sx={{
            backgroundColor: theme.palette.background.paper,
            minWidth: 180,
          }}
        >
          <Stack spacing={1}>
            <Button
              variant="text"
              onClick={() => router.push("/profile")}
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
              onClick={handleLogout}
              sx={{
                color: theme.palette.secondary.main,
                justifyContent: "flex-start",
                gap: 1,
                textTransform: "none",
              }}
              startIcon={<LogoutOutlined />}
            >
              <p 
              className="font-bold">Sair</p>
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  );
}
