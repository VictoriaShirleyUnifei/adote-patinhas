import { Close } from "@mui/icons-material";
import { Box, Checkbox, Modal } from "@mui/material";
import React from "react";
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

type ModalRegisterAnimalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function ModalRegisterAnimal({
  open,
  onClose,
  onSuccess,
}: ModalRegisterAnimalProps) {
  const theme = useTheme();
  const { showSuccess, showError } = useToast();

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

  const onSubmit = async (data: RegisterAnimalFormData) => {
    try {
      const formData = new FormData();

      // Foto
      if (data.foto) {
        formData.append("foto", data.foto);
      }

      // Converte os outros campos (exceto foto)
      Object.entries(data).forEach(([key, value]) => {
        if (key === "foto") return;

        if (typeof value === "object") {
          // Para objetos: saude, convivencia, condicoes
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });

      const response = await fetch("/api/pets", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        showError(result.error || "Erro ao salvar pet!");
        return;
      }

      showSuccess("Pet salvo com sucesso!");
      onSuccess?.();  
      reset();
      onClose();
    } catch (err) {
      console.error(err);
      showError("Erro inesperado ao cadastrar o pet.");
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

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
        {/* --- Conteúdo principal --- */}
        <section>
          <div>
            {/* --- Close responsivo --- */}
            <div
              className="flex flex-row justify-between cursor-pointer mb-2"
              onClick={handleClose}>
              <h2
                style={{
                  color: theme.palette.secondary.main,
                  fontWeight: "bold",
                }}
              >
                Cadastrar Pet
              </h2>
              <Close />
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

        <section className="flex justify-center md:justify-end mt-4">
          <CustomButton
            textButton="Cadastrar"
            backgroundColor={theme.palette.secondary.main}
            sx={{ width: 320 }}
            onClick={handleSubmit(onSubmit)}
          />
        </section>
      </Box>
    </Modal>
  );
}
