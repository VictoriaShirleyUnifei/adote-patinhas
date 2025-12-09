"use client";

import { Close, Delete } from "@mui/icons-material";
import { Box, Checkbox, Modal, IconButton } from "@mui/material";
import React, { useEffect } from "react";
import PhotoUpload from "../Inputs/PhotoUpload";
import CustomInput from "../Inputs/CustomInput";
import CustomButton from "../Buttons/CustomButton";
import CustomSelect from "../Inputs/CustomSelect";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RegisterAnimalFormData,
  registerAnimalSchema,
} from "@/schemas/registerAnimalSchema";
import { useTheme } from "@mui/material/styles";
import { useToast } from "@/context/ToastContext";
import { Animal } from "@/types/animal";

type ModalAnimalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  mode?: "create" | "edit"; 
  animal?: Animal; 
};

export default function ModalAnimal({
  open,
  onClose,
  onSuccess,
  mode = "create",
  animal,
}: ModalAnimalProps) {
  const theme = useTheme();
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterAnimalFormData>({
    resolver: zodResolver(registerAnimalSchema),
    defaultValues: {
      foto: null,
      nome: "",
      especie: "",
      descricao: "",
      dataNascimento: "",
      sexo: "",
      porte: "",
      raca: "",
      saude: { vacinado: false, vermifugado: false, castrado: false },
      convivencia: { outrosAnimais: false, criancas: false },
      condicoes: { cuidadosEspeciais: false, idoso: false, deficiencia: false },
    },
  });

  // Preenche o formulário com os dados do animal quando estiver em modo edição
  useEffect(() => {
    if (mode === "edit" && animal && open) {
      // Se a foto é uma string (caminho), converte para valor exibível
      const fotoValue = animal.foto ? animal.foto : null;

      reset({
        foto: fotoValue,
        nome: animal.nome || "",
        especie: animal.especie || "",
        descricao: animal.descricao || "",
        dataNascimento: animal.dataNascimento || "",
        sexo: animal.sexo || "",
        porte: animal.porte || "",
        raca: animal.raca || "",
        saude: animal.saude || {
          vacinado: false,
          vermifugado: false,
          castrado: false,
        },
        convivencia: animal.convivencia || {
          outrosAnimais: false,
          criancas: false,
        },
        condicoes: animal.condicoes || {
          cuidadosEspeciais: false,
          idoso: false,
          deficiencia: false,
        },
      });
    } else if (mode === "create" && open) {
      // Limpa o formulário para cadastro
      reset({
        foto: null,
        nome: "",
        especie: "",
        descricao: "",
        dataNascimento: "",
        sexo: "",
        porte: "",
        raca: "",
        saude: { vacinado: false, vermifugado: false, castrado: false },
        convivencia: { outrosAnimais: false, criancas: false },
        condicoes: {
          cuidadosEspeciais: false,
          idoso: false,
          deficiencia: false,
        },
      });
    }
  }, [mode, animal, open, reset]);

  const onSubmit = async (data: RegisterAnimalFormData) => {
    setLoading(true);
    try {
      const formData = new FormData();

      // Foto - se for File, adiciona
      if (data.foto instanceof File) {
        formData.append("foto", data.foto);
      } else if (mode === "edit" && animal?.foto && !data.foto) {
        // Se estiver editando e removeu a foto, precisa enviar algo?
        // Você pode querer enviar um campo indicando para remover a foto
      }

      // Se estiver editando, adiciona o ID
      if (mode === "edit" && animal) {
        formData.append("id", animal.id);
      }

      // Converte os outros campos (exceto foto)
      Object.entries(data).forEach(([key, value]) => {
        if (key === "foto") return;

        if (typeof value === "object") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });

      // Usa método diferente para criar ou editar
      const method = mode === "edit" ? "PUT" : "POST";
      const successMessage =
        mode === "edit"
          ? "Pet atualizado com sucesso!"
          : "Pet cadastrado com sucesso!";

      const response = await fetch("/api/pets", {
        method,
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        showError(
          result.error ||
            `Erro ao ${mode === "edit" ? "atualizar" : "salvar"} pet!`
        );
        return;
      }

      showSuccess(successMessage);
      onSuccess?.();
      reset();
      onClose();
    } catch (err) {
      console.error(err);
      showError(
        `Erro inesperado ao ${
          mode === "edit" ? "atualizar" : "cadastrar"
        } o pet.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!animal || mode !== "edit") return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/pets?id=${animal.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        showError(result.error || "Erro ao excluir pet!");
        return;
      }

      showSuccess("Pet excluído com sucesso!");
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
      showError("Erro inesperado ao excluir o pet.");
    } finally {
      setDeleting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const title = mode === "edit" ? "Editar Pet" : "Cadastrar Pet";
  const submitButtonText = loading
    ? mode === "edit"
      ? "Salvando..."
      : "Cadastrando..."
    : mode === "edit"
    ? "Salvar alterações"
    : "Cadastrar";

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: theme.palette.card.default,
          borderRadius: 2,
          boxShadow: 24,
          width: {
            xs: "90%",
            sm: "90%",
            md: "90%",
            lg: "70%",
          },
          maxHeight: "90vh",
          overflowY: "auto",
          cursor: "default",
          p: 2,
        }}
      >
        {/* --- Cabeçalho --- */}
        <section>
          <div className="flex flex-row justify-between items-center mb-2">
            <h2
              style={{
                color: theme.palette.secondary.main,
                fontWeight: "bold",
              }}
            >
              {title}
            </h2>
            <div className="flex gap-2">
              <div className="cursor-pointer" onClick={handleClose}>
                <Close />
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-wrap gap-6">
          <section className="flex-1">
            {/* Foto + nome + espécie */}
            <div className="flex flex-col">
              <div className="flex flex-col justify-center">
                <Controller
                  name="foto"
                  control={control}
                  render={({ field }) => (
                    <PhotoUpload
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.foto && (
                  <p className="text-red-500 text-sm">
                    {String(errors.foto.message)}
                  </p>
                )}
              </div>
              <Controller
                name="nome"
                control={control}
                render={({ field }) => (
                  <CustomInput
                    {...field}
                    label="Nome"
                    labelColor="primary"
                    backgroundColor="#D9D9D9"
                    borderColor="#D9D9D9"
                  />
                )}
              />
              {errors.nome && (
                <p className="text-red-500 text-sm">{errors.nome.message}</p>
              )}

              <Controller
                name="especie"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    {...field}
                    label="Espécie"
                    options={[
                      { value: "", label: "Selecione" },
                      { value: "cachorro", label: "Cachorro" },
                      { value: "gato", label: "Gato" },
                      { value: "outro", label: "Outro" },
                    ]}
                    color="black"
                    labelColor={theme.palette.text.primary}
                    backgroundColor="#D9D9D9"
                    borderColor="#D9D9D9"
                  />
                )}
              />
              {errors.especie && (
                <p className="text-red-500 text-sm">{errors.especie.message}</p>
              )}
            </div>
          </section>
          <section className="flex-1 min-w-[250px]">
            <Controller
              name="descricao"
              control={control}
              render={({ field }) => (
                <CustomInput
                  {...field}
                  label="Descrição"
                  labelColor="primary"
                  backgroundColor="#D9D9D9"
                  borderColor="#D9D9D9"
                  multiline
                  style={{ height: 125 }}
                />
              )}
            />
            {errors.descricao && (
              <p className="text-red-500 text-sm">{errors.descricao.message}</p>
            )}

            <Controller
              name="dataNascimento"
              control={control}
              render={({ field }) => (
                <CustomInput
                  {...field}
                  label="Data de Nascimento"
                  labelColor="primary"
                  placeholder="DD/MM/AAAA"
                  backgroundColor="#D9D9D9"
                  borderColor="#D9D9D9"
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, "");
                    if (value.length > 2)
                      value = value.slice(0, 2) + "/" + value.slice(2);
                    if (value.length > 5)
                      value = value.slice(0, 5) + "/" + value.slice(5, 9);
                    field.onChange(value);
                  }}
                />
              )}
            />
            {errors.dataNascimento && (
              <p className="text-red-500 text-sm">
                {errors.dataNascimento.message}
              </p>
            )}

            <div className="flex w-full gap-4">
              <div className="flex flex-col flex-1">
                <Controller
                  name="sexo"
                  control={control}
                  render={({ field }) => (
                    <CustomSelect
                      {...field}
                      label="Sexo"
                      options={[
                        { value: "", label: "Selecione" },
                        { value: "macho", label: "Macho" },
                        { value: "femea", label: "Fêmea" },
                      ]}
                      color="black"
                      labelColor={theme.palette.text.primary}
                      backgroundColor="#D9D9D9"
                      borderColor="#D9D9D9"
                      className="flex-1"
                    />
                  )}
                />
                {errors.sexo && (
                  <p className="text-red-500 text-sm">{errors.sexo.message}</p>
                )}
              </div>
              <div className="flex flex-col flex-1">
                <Controller
                  name="porte"
                  control={control}
                  render={({ field }) => (
                    <CustomSelect
                      {...field}
                      label="Porte"
                      options={[
                        { value: "", label: "Selecione" },
                        { value: "pequeno", label: "Pequeno" },
                        { value: "medio", label: "Médio" },
                        { value: "grande", label: "Grande" },
                      ]}
                      color="black"
                      labelColor={theme.palette.text.primary}
                      backgroundColor="#D9D9D9"
                      borderColor="#D9D9D9"
                      className="flex-1"
                    />
                  )}
                />
                {errors.porte && (
                  <p className="text-red-500 text-sm">{errors.porte.message}</p>
                )}
              </div>
            </div>
            <Controller
              name="raca"
              control={control}
              render={({ field }) => (
                <CustomInput
                  {...field}
                  label="Raça"
                  labelColor="primary"
                  backgroundColor="#D9D9D9"
                  borderColor="#D9D9D9"
                />
              )}
            />
            {errors.raca && (
              <p className="text-red-500 text-sm">{errors.raca.message}</p>
            )}
          </section>

          <section className="flex-1 min-w-[250px]">
            <div className="flex flex-col gap-4">
              <h2 className="font-medium">Saúde:</h2>
              <div className="flex flex-col">
                <div className="flex gap-2 items-center">
                  <Controller
                    name="saude.vacinado"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        {...field}
                        checked={field.value}
                        sx={{
                          color: theme.palette.tertiary.main,
                          "&.Mui-checked": {
                            color: theme.palette.tertiary.main,
                          },
                          p: 0.5,
                        }}
                      />
                    )}
                  />
                  Vacinado
                </div>
                <div className="flex gap-2 items-center">
                  <Controller
                    name="saude.vermifugado"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        {...field}
                        checked={field.value}
                        sx={{
                          color: theme.palette.tertiary.main,
                          "&.Mui-checked": {
                            color: theme.palette.tertiary.main,
                          },
                          p: 0.5,
                        }}
                      />
                    )}
                  />
                  Vermifugado
                </div>
                <div className="flex gap-2 items-center">
                  <Controller
                    name="saude.castrado"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        {...field}
                        checked={field.value}
                        sx={{
                          color: theme.palette.tertiary.main,
                          "&.Mui-checked": {
                            color: theme.palette.tertiary.main,
                          },
                          p: 0.5,
                        }}
                      />
                    )}
                  />
                  Castrado
                </div>
              </div>
              <div className="flex-1">
                <h2 className="font-medium">Convivência:</h2>
                <div className="flex flex-col">
                  <div className="flex gap-2 items-center">
                    <Controller
                      name="convivencia.outrosAnimais"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          {...field}
                          checked={field.value}
                          sx={{
                            color: theme.palette.tertiary.main,
                            "&.Mui-checked": {
                              color: theme.palette.tertiary.main,
                            },
                            p: 0.5,
                          }}
                        />
                      )}
                    />
                    Se dá bem com outros animais
                  </div>
                  <div className="flex gap-2 items-center">
                    <Controller
                      name="convivencia.criancas"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          {...field}
                          checked={field.value}
                          sx={{
                            color: theme.palette.tertiary.main,
                            "&.Mui-checked": {
                              color: theme.palette.tertiary.main,
                            },
                            p: 0.5,
                          }}
                        />
                      )}
                    />
                    Se dá bem com crianças
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="font-medium">Condições especiais:</h2>
                <div className="flex flex-col">
                  <div className="flex gap-2 items-center">
                    <Controller
                      name="condicoes.cuidadosEspeciais"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          {...field}
                          checked={field.value}
                          sx={{
                            color: theme.palette.tertiary.main,
                            "&.Mui-checked": {
                              color: theme.palette.tertiary.main,
                            },
                            p: 0.5,
                          }}
                        />
                      )}
                    />
                    Necessita de cuidados especiais
                  </div>
                  <div className="flex gap-2 items-center">
                    <Controller
                      name="condicoes.idoso"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          {...field}
                          checked={field.value}
                          sx={{
                            color: theme.palette.tertiary.main,
                            "&.Mui-checked": {
                              color: theme.palette.tertiary.main,
                            },
                            p: 0.5,
                          }}
                        />
                      )}
                    />
                    Animal idoso
                  </div>
                  <div className="flex gap-2 items-center">
                    <Controller
                      name="condicoes.deficiencia"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          {...field}
                          checked={field.value}
                          sx={{
                            color: theme.palette.tertiary.main,
                            "&.Mui-checked": {
                              color: theme.palette.tertiary.main,
                            },
                            p: 0.5,
                          }}
                        />
                      )}
                    />
                    Animal com deficiência
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="flex justify-between mt-4">
          {mode === "edit" && (
            <CustomButton
              textButton="Excluir"
              backgroundColor={theme.palette.error.main}
              color="white"
              sx={{ width: 200 }}
              onClick={handleDelete}
            />
          )}
          <CustomButton
            textButton={submitButtonText}
            backgroundColor={theme.palette.secondary.main}
            sx={{ width: 200 }}
            onClick={handleSubmit(onSubmit)}
          />
        </section>
      </Box>
    </Modal>
  );
}
