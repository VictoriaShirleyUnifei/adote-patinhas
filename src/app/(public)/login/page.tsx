// LoginPage.tsx
"use client";

import CustomButton from "@/components/Buttons/CustomButton";
import CustomInput from "@/components/Inputs/CustomInput";
import { LoginData, loginSchema } from "@/schemas/loginSchema";
import { useTheme } from "@mui/material/styles";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useToast } from "@/context/ToastContext";

export default function LoginPage() {
  const theme = useTheme();
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginData) => {
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        showError(result.error || "Email ou senha incorretos!");
        return;
      }

      showSuccess("Login realizado com sucesso!");
      router.push("/home");
    } catch (err) {
      showError("Erro inesperado no servidor!");
    }
  };

  return (
    <>
      <div>
        <div className="flex flex-col justify-center items-center">
          <Image
            src="/logo-branca.svg"
            alt="Logo Adote Patinhas"
            width={350}
            height={200}
          />
          <p className="text-white text-2xl font-bold my-3">Faça seu login!</p>
        </div>
        <div className="flex flex-col gap-3 my-8">
          <CustomInput
            label="E-mail"
            placeholder="nome@gmail.com"
            type="email"
            backgroundColor="#F1F3F6"
            borderColor="#F1F3F6"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
          <CustomInput
            label="Senha"
            placeholder="******"
            type="password"
            backgroundColor="#F1F3F6"
            borderColor="#F1F3F6"
            {...register("senha")}
          />
          {errors.senha && (
            <p className="text-red-500 text-sm">{errors.senha.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-4 my-6">
          <CustomButton
            textButton="Entrar"
            onClick={handleSubmit(onSubmit)}
            backgroundColor={theme.palette.tertiary.main}
          />
          <CustomButton
            textButton="Cadastrar"
            onClick={() => router.push("/register")}
            backgroundColor={theme.palette.secondary.main}
          />
        </div>
      </div>
    </>
  );
}
