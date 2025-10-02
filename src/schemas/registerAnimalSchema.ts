import { z } from "zod";
import dayjs from "dayjs";

export const registerAnimalSchema = z.object({
  foto: z
    .any()
    .refine((file) => file instanceof File, "É necessário enviar uma foto"),
  nome: z.string().min(1, "O nome é obrigatório"),
  especie: z
    .string()
    .nonempty("Selecione uma espécie")
    .refine((val) => ["cachorro", "gato", "outro"].includes(val), {
      message: "Espécie inválida",
    }),
  descricao: z.string().min(1, "A descrição é obrigatória"),
  dataNascimento: z
  .string()
  .min(1, "A data de nascimento é obrigatória")
  .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Formato inválido, use DD/MM/AAAA")
  .refine((val) => {
    const date = dayjs(val, "DD/MM/YYYY", true); // strict parsing
    const now = dayjs();
    const minDate = dayjs("1900-01-01");
    return date.isValid() && date.isBefore(now) && date.isAfter(minDate);
  }, "Data de nascimento inválida")
  .transform((val) => {
    // Garantir que o dayjs interprete no formato DD/MM/YYYY
    const [day, month, year] = val.split('/');
    return `${year}-${month}-${day}`;
  }),
  sexo: z
    .string()
    .nonempty("Selecione o sexo")
    .refine((val) => ["macho", "femea"].includes(val), {
      message: "Sexo inválido",
    }),
  porte: z
    .string()
    .nonempty("Selecione o porte")
    .refine((val) => ["pequeno", "medio", "grande"].includes(val), {
      message: "Porte inválido",
    }),
  raca: z.string().min(2, "A raça é obrigatória"),
  saude: z.object({
    vacinado: z.boolean(),
    vermifugado: z.boolean(),
    castrado: z.boolean(),
  }),
  convivencia: z.object({
    outrosAnimais: z.boolean(),
    criancas: z.boolean(),
  }),
  condicoes: z.object({
    cuidadosEspeciais: z.boolean(),
    idoso: z.boolean(),
    deficiencia: z.boolean(),
  }),
});

export type RegisterAnimalFormData = z.infer<typeof registerAnimalSchema>;
