"use client";

import CustomButton from "@/components/Buttons/CustomButton";
import CustomInput from "@/components/Inputs/CustomInput";
import { RegisterData, registerSchema } from "@/schemas/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { useToast } from "@/context/ToastContext";

export default function RegisterPage() {
  const theme = useTheme();
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterData) => {
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
       showError(result.error || "Erro ao cadastrar");
        return;
      }

      showSuccess("Cadastro realizado com sucesso!");
      router.push("/login");
    } catch (err) {
      showError("Erro inesperado no servidor!");
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-center items-center">
        <Image
          src="/logo-branca.svg"
          alt="Logo Adote Patinhas"
          width={300}
          height={150}
        />
        <p className="text-white text-2xl font-bold my-3">Faça seu cadastro!</p>
      </div>
      <div className="flex flex-col gap-3 my-8">
        <CustomInput
          label="Nome"
          placeholder="Seu nome completo"
          backgroundColor="#F1F3F6"
          borderColor="#F1F3F6"
          {...register("nome")}
        />
        {errors.nome && (
          <p className="text-red-500 text-sm">{errors.nome.message}</p>
        )}
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
        <CustomInput
          label="Confirmar senha"
          placeholder="******"
          type="password"
          backgroundColor="#F1F3F6"
          borderColor="#F1F3F6"
          {...register("confirmaSenha")}
        />
        {errors.confirmaSenha && (
          <p className="text-red-500 text-sm">
            {errors.confirmaSenha.message}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-4 my-6">
        <CustomButton
          textButton="Cadastrar"
          onClick={handleSubmit(onSubmit)}
          backgroundColor={theme.palette.tertiary.main}
        />
        <p className="text-white text-center">
          Já possui uma conta?{" "}
          <a
            className="underline cursor-pointer"
            onClick={() => router.push("/login")}
          >
            Faça login
          </a>
        </p>
      </div>
    </div>
  );
}
