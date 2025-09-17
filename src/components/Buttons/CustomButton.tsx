import React from "react";
import { Button } from "@mui/material";
import { SxProps } from "@mui/system";

type CustomButtonProps = {
  variant?: "text" | "outlined" | "contained";
  textButton: string;
  backgroundColor?: string;
  color?: string;
  borderColor?: string;
  onClick?: () => void;
  icon?: React.ReactNode; 
  fullWidth?: boolean;    
  sx?: SxProps;           
};

export default function CustomButton({
  variant = "contained",
  textButton,
  backgroundColor,
  color,
  borderColor,  
  onClick,
  icon,
  fullWidth = true,
  sx,
}: CustomButtonProps) {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      startIcon={icon} 
      fullWidth={fullWidth}
      sx={{
        backgroundColor: backgroundColor,
        color: color,
        borderColor: borderColor,
        textTransform: "none",
        ...sx, // permite sobrescrever estilos
      }}
    >
      {textButton}
    </Button>
  );
}
