import {z} from "zod";  

export const registerSchema = z.object({
    nome: z.string().min(2, { message: "Nome deve ter no mínimo 2 caracteres" }),
    email: z.email({ message: "E-mail inválido" }),
    senha: z.string().min(6, { message: "Senha deve ter no mínimo 6 caracteres" }),
    confirmaSenha: z.string().min(6, { message: "Confirmação de senha deve ter no mínimo 6 caracteres" }),
}).refine((data) => data.senha === data.confirmaSenha, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
});

export type RegisterData = z.infer<typeof registerSchema>;