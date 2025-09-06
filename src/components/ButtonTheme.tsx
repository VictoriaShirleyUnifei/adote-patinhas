"use client";
import { Button } from "@mui/material";
import { useThemeMode } from "@/context/ThemeContext";
import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";
import { useTheme } from "@mui/material/styles";

export default function ThemeToggleButton() {
  const { mode, toggleMode } = useThemeMode();
  const theme = useTheme();

  return (
    <Button
      onClick={toggleMode}
      variant="contained"
      sx={{
        width: 40,
        height: 40,
        borderRadius: 20,
        minWidth: 0,
        backgroundColor: theme.palette.card.default,
        color: theme.palette.secondary.main,
        "&:hover": {
          backgroundColor: theme.palette.background.paper,
        },
      }}
    >
      {mode === "light" ? <DarkModeOutlined /> : <LightModeOutlined />}
    </Button>
  );
}
