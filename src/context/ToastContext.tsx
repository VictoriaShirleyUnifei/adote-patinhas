"use client";

import { createContext, useContext, useState } from "react";
import { Snackbar, Alert } from "@mui/material";

type ToastContextType = {
  showSuccess: (msg: string) => void;
  showError: (msg: string) => void;
  showWarning: (msg: string) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] =
    useState<"success" | "error" | "warning">("success");

  const showToast = (msg: string, sev: "success" | "error" | "warning") => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

  return (
    <>
      <ToastContext.Provider
        value={{
          showSuccess: (msg) => showToast(msg, "success"),
          showError: (msg) => showToast(msg, "error"),
          showWarning: (msg) => showToast(msg, "warning"),
        }}
      >
        {children}

        <Snackbar
          open={open}
          autoHideDuration={3500}
          onClose={() => setOpen(false)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert severity={severity} variant="filled">
            {message}
          </Alert>
        </Snackbar>
      </ToastContext.Provider>
    </>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx)
    throw new Error(
      "useToast deve ser usado dentro de <ToastProvider> no layout."
    );
  return ctx;
};
