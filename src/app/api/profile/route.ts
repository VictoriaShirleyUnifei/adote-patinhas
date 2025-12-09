import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { getUserFromRequest } from "@/lib/jwt-utils";

export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    
    if (!user) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    return NextResponse.json(user);

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao carregar perfil" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    
    if (!user) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const filePath = path.join(process.cwd(), "src", "db", "users.json");
    const users = JSON.parse(await readFile(filePath, "utf8"));

    // Encontra o usuário atual
    const userIndex = users.findIndex((u: any) => u.id === user.id);
    
    if (userIndex === -1) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Atualiza campos do formulário
    const updatedUser = { ...users[userIndex] };
    
    // Campos de texto
    const textFields = ["nome", "email", "phone", "cep", "uf", "city", "street"];
    textFields.forEach(field => {
      const value = formData.get(field);
      if (value !== null && typeof value === "string") {
        updatedUser[field] = value;
      }
    });

    // Senha (se fornecida)
    const currentPassword = formData.get("currentPassword");
    const newPassword = formData.get("newPassword");
    
    if (currentPassword && newPassword) {
      // falta verificar a senha atual
      // usando bcrypt.compare
      // updatedUser.senha = await bcrypt.hash(newPassword, 10);
    }

    // Foto (arquivo)
    const fotoFile = formData.get("foto") as File | null;
    
    if (fotoFile) {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      if (!require('fs').existsSync(uploadDir)) {
        require('fs').mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = `${Date.now()}-${fotoFile.name}`;
      const fotoPath = path.join(uploadDir, fileName);

      const buffer = Buffer.from(await fotoFile.arrayBuffer());
      require('fs').writeFileSync(fotoPath, buffer);
      
      updatedUser.foto = fileName;
    }

    // Salva alterações
    users[userIndex] = updatedUser;
    await require('fs').promises.writeFile(
      filePath, 
      JSON.stringify(users, null, 2)
    );

    const { senha, ...safeUser } = updatedUser;
    return NextResponse.json({ 
      message: "Perfil atualizado com sucesso!",
      user: safeUser 
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao atualizar perfil" },
      { status: 500 }
    );
  }
}