import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import CustomButton from "../Buttons/CustomButton";
import { useTheme } from "@mui/material/styles";
import PhotoUpload from "../Inputs/PhotoUpload";
import CustomInput from "../Inputs/CustomInput";
import { useToast } from "@/context/ToastContext";

export default function CardPersonalInfos() {
  const theme = useTheme();
  const [form, setForm] = useState({
    nome: "",
    email: "",
    phone: "",
    cep: "",
    uf: "",
    city: "",
    street: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentFoto, setCurrentFoto] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
  async function loadUser() {
    try {
      const res = await fetch("/api/profile", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        showError("Erro ao carregar perfil");
        return;
      }

      const user = await res.json();

      setForm((prev) => ({
        ...prev,
        nome: user.nome ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
        cep: user.cep ?? "",
        uf: user.uf ?? "",
        city: user.city ?? "",
        street: user.street ?? "",
      }));

      // Carrega a foto atual do perfil
      if (user.foto) {
        // Adiciona o domínio completo se for um caminho relativo
        const fullFotoUrl = user.foto.startsWith('http') 
          ? user.foto 
          : `${process.env.NEXT_PUBLIC_API_URL || ''}${user.foto}`;
        setCurrentFoto(fullFotoUrl);
      } else {
        setCurrentFoto(""); // Limpa se não tiver foto
      }
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
      showError("Erro de conexão");
    }
  }

  loadUser();
}, []);

  // Atualiza state genericamente
  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Manipular foto selecionada
  const handlePhotoUpload = (file: File | null) => {
    setSelectedFile(file);
    
    // Se o usuário removeu a foto, limpa o preview
    if (file === null) {
      setCurrentFoto("");
    }
  };

  // Busca endereço pelo CEP
  const handleSearchCep = async (cep: string) => {
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();

      if (data.erro) {
        showError("CEP não encontrado");
        return;
      }

      setForm((prev) => ({
        ...prev,
        uf: data.uf,
        city: data.localidade,
        street: data.logradouro,
      }));
    } catch (error) {
      showError("Erro ao buscar o CEP");
    }
  };

  const handleSaveProfile = async () => {
    // Validação de senha
    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      showError("As senhas não coincidem");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      // Adiciona foto se foi selecionada
      if (selectedFile) {
        formData.append("foto", selectedFile);
      }

      // Adiciona os outros campos
      Object.entries(form).forEach(([key, value]) => {
        if (key !== "confirmPassword") {
          formData.append(key, value || "");
        }
      });

      console.log("Enviando atualização..."); // DEBUG

      // IMPORTANTE: Verifique se sua rota é /api/profile ou /api/profile/update
      const res = await fetch("/api/profile", {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      console.log("Resposta do servidor:", data); // DEBUG

      setLoading(false);

      if (!res.ok) {
        showError(data.error || "Erro ao atualizar");
        return;
      }

      showSuccess("Perfil atualizado com sucesso!");
      
      // Limpa senhas após sucesso
      setForm(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
      
      // Limpa arquivo selecionado
      setSelectedFile(null);
      
      // Atualiza a foto com a URL retornada pelo backend
      if (data.user?.foto) {
        const fullFotoUrl = data.user.foto.startsWith('http') 
          ? data.user.foto 
          : `${process.env.NEXT_PUBLIC_API_URL || ''}${data.user.foto}`;
        setCurrentFoto(fullFotoUrl);
      } else {
        setCurrentFoto(""); // Limpa se o backend não retornou foto
      }

    } catch (error) {
      setLoading(false);
      console.error("Erro ao salvar perfil:", error);
      showError("Erro de conexão ao atualizar perfil");
    }
  };

  // Formatação de telefone
  const formatPhone = (value: string) => {
    const clean = value.replace(/\D/g, "");
    if (clean.length <= 10) {
      return clean.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    }
    return clean.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  };

  // Formatação de CEP
  const formatCep = (value: string) => {
    const clean = value.replace(/\D/g, "");
    if (clean.length > 5) {
      return clean.replace(/^(\d{5})(\d{0,3})/, "$1-$2");
    }
    return clean;
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "10px",
        paddingX: { xs: "12px", sm: "16px" },
        paddingY: { xs: "8px", sm: "12px" },
        borderRadius: "8px",
        backgroundColor: theme.palette.card.default,
        height: "100%",
        minHeight: "100vh",
      }}
    >
      <div className="flex-1">
        <p
          className="text-lg font-semibold"
          style={{ color: theme.palette.secondary.main }}
        >
          Dados pessoais
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 mb-4">
          <section className="space-y-4">
            <div className="flex flex-col items-center md:items-start">
              <PhotoUpload
                value={currentFoto}
                onChange={handlePhotoUpload}
              />
            </div>
            <CustomInput
              label="Nome"
              value={form.nome}
              onChange={(e) => updateField("nome", e.target.value)}
              color="black"
              labelColor={theme.palette.text.primary}
              backgroundColor="#D9D9D9"
              borderColor="#D9D9D9"
            />
            <CustomInput
              label="E-mail"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              color="black"
              labelColor={theme.palette.text.primary}
              backgroundColor="#D9D9D9"
              borderColor="#D9D9D9"
            />
            <CustomInput
              label="Telefone"
              value={form.phone}
              onChange={(e) => {
                const formatted = formatPhone(e.target.value);
                updateField("phone", formatted);
              }}
              color="black"
              labelColor={theme.palette.text.primary}
              backgroundColor="#D9D9D9"
              borderColor="#D9D9D9"
            />
          </section>

          <section className="space-y-4">
            <p
              className="text-lg font-semibold"
              style={{ color: theme.palette.secondary.main }}
            >
              Endereço
            </p>
            <CustomInput
              label="CEP"
              value={form.cep}
              onChange={(e) => {
                const formatted = formatCep(e.target.value);
                updateField("cep", formatted);

                // Busca CEP quando estiver completo
                const cleanCep = e.target.value.replace(/\D/g, "");
                if (cleanCep.length === 8) {
                  handleSearchCep(cleanCep);
                }
              }}
              color="black"
              labelColor={theme.palette.text.primary}
              backgroundColor="#D9D9D9"
              borderColor="#D9D9D9"
            />
            <div className="flex flex-col md:flex-row w-full gap-4">
              <CustomInput
                label="UF"
                value={form.uf}
                onChange={(e) => updateField("uf", e.target.value)}
                color="black"
                labelColor={theme.palette.text.primary}
                backgroundColor="#D9D9D9"
                borderColor="#D9D9D9"
              />
              <CustomInput
                label="Município"
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
                color="black"
                labelColor={theme.palette.text.primary}
                backgroundColor="#D9D9D9"
                borderColor="#D9D9D9"
              />
            </div>

            <CustomInput
              label="Logradouro"
              value={form.street}
              onChange={(e) => updateField("street", e.target.value)}
              color="black"
              labelColor={theme.palette.text.primary}
              backgroundColor="#D9D9D9"
              borderColor="#D9D9D9"
            />

            <p
              className="text-lg font-semibold mt-6"
              style={{ color: theme.palette.secondary.main }}
            >
              Redefinição de senha
            </p>
            <CustomInput
              label="Senha atual"
              type="password"
              value={form.currentPassword}
              onChange={(e) => updateField("currentPassword", e.target.value)}
              color="black"
              labelColor={theme.palette.text.primary}
              backgroundColor="#D9D9D9"
              borderColor="#D9D9D9"
            />
            <CustomInput
              label="Nova senha"
              type="password"
              value={form.newPassword}
              onChange={(e) => updateField("newPassword", e.target.value)}
              color="black"
              labelColor={theme.palette.text.primary}
              backgroundColor="#D9D9D9"
              borderColor="#D9D9D9"
            />
            <CustomInput
              label="Confirmar senha"
              type="password"
              value={form.confirmPassword}
              onChange={(e) => updateField("confirmPassword", e.target.value)}
              color="black"
              labelColor={theme.palette.text.primary}
              backgroundColor="#D9D9D9"
              borderColor="#D9D9D9"
            />
          </section>
        </div>
      </div>

      {/* Botões responsivos */}
      <section className="flex flex-col items-center md:justify-end md:items-end gap-3 mt-6">
        <CustomButton
          textButton={loading ? "Salvando..." : "Salvar perfil"}
          backgroundColor={theme.palette.secondary.main}
          color="white"
          onClick={handleSaveProfile}
          sx={{
            width: { xs: "100%", sm: "100%", lg: "280px", xl: "320px" },
            maxWidth: "100%",
          }}
        />
        {/* <CustomButton
          textButton="Excluir conta"
          backgroundColor={theme.palette.tertiary.main}
          color="white"
          sx={{
            width: { xs: "100%", sm: "200px", lg: "280px", xl: "320px" },
            maxWidth: "100%",
          }}
        /> */}
      </section>
    </Box>
  );
}