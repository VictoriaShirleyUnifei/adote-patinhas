"use client";

import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { Avatar, Box, Button, Stack } from "@mui/material";
import { AccountCircleOutlined, HomeOutlined, LogoutOutlined } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useUserData } from "@/hooks/useUserData";

export default function HeaderMenu() {
  const theme = useTheme();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { userData, loading } = useUserData();

  const toggleMenu = () => setOpen(!open);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "GET",
        credentials: "include",
      });
      router.push("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      router.push("/login");
    }
  };

  // Avatar com imagem do usuário ou fallback
  const renderAvatar = () => {
    // Usando Avatar do MUI com imagem
    if (userData?.foto && !loading) {
      return (
        <Avatar
          src={userData.foto}
          alt={`Foto de ${userData.nome || 'perfil'}`}
          onClick={toggleMenu}
          sx={{ 
            width: 60, 
            height: 60, 
            cursor: "pointer",
          }}
        />
      );
    }

    // Avatar com fallback (inicial ou ícone)
    return (
      <Avatar
        onClick={toggleMenu}
        sx={{ 
          width: 60, 
          height: 60, 
          cursor: "pointer",
          color: "#fff",
          backgroundColor: theme.palette.secondary.main,
          fontSize: '1.5rem',
          fontWeight: 'bold',
        }}
      >
        {loading ? (
          <AccountCircleOutlined />
        ) : userData?.nome ? (
          userData.nome.charAt(0).toUpperCase()
        ) : (
          <AccountCircleOutlined />
        )}
      </Avatar>
    );
  };

  return (
    <Box className="relative">
      {/* Avatar clicável */}
      {renderAvatar()}

      {open && (
        <Box
          className="fixed right-20 mt-2 p-2 shadow-lg rounded-md z-50"
          sx={{
            backgroundColor: theme.palette.background.paper,
            minWidth: 180,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Stack spacing={1}>
            <Button
              variant="text"
              onClick={() => router.push("/home")}
              sx={{
                color: theme.palette.secondary.main,
                justifyContent: "flex-start",
                gap: 1,
                textTransform: "none",
              }}
              startIcon={<HomeOutlined />}
            >
              <p className="font-medium">Início</p>
            </Button>

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
              <p className="font-medium">Perfil</p>
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
              <p className="font-medium">Sair</p>
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  );
}