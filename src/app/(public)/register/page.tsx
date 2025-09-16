"use client";

import CustomButton from "@/components/Buttons/CustomButton";
import CustomInput from "@/components/Inputs/CustomInput";
import { RegisterData, registerSchema } from "@/schemas/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";

export default function RegisterPage() {
  const theme = useTheme();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterData) => {
    console.log("Register:", data);

    const registerOk = true;

    if (registerOk) {
      router.push("/login");
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-center items-center">
        <img
          className="w-1/2"
          src="./logo-branca.svg"
          alt="Logo Adote Patinhas"
        />
        <p className="text-white text-2xl font-bold my-3">Faça seu cadastro!</p>
      </div>
      <div className="flex flex-col gap-3 my-8">
        <CustomInput
          label="Nome"
          placeholder="Seu nome completo"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
        <CustomInput
          label="E-mail"
          placeholder="nome@gmail.com"
          type="email"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
        <CustomInput
          label="Senha"
          placeholder="******"
          type="password"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
        <CustomInput
          label="Confirmar senha"
          placeholder="******"
          type="password"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
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
