import React from "react";
import { Button } from "@mui/material";
import { SxProps } from "@mui/system";

type CustomButtonProps = {
  textButton: string;
  backgroundColor?: string;
  color?: string;
  onClick?: () => void;
  icon?: React.ReactNode; 
  fullWidth?: boolean;    
  sx?: SxProps;           
};

export default function CustomButton({
  textButton,
  backgroundColor,
  color,
  onClick,
  icon,
  fullWidth = true,
  sx,
}: CustomButtonProps) {
  return (
    <Button
      variant="contained"
      onClick={onClick}
      startIcon={icon} 
      fullWidth={fullWidth}
      sx={{
        backgroundColor: backgroundColor,
        color: color,
        textTransform: "none",
        ...sx, // permite sobrescrever estilos
      }}
    >
      {textButton}
    </Button>
  );
}
