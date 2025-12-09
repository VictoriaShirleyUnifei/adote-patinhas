import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import bcrypt from "bcrypt";
import { jwtVerify } from "jose";

export async function PUT(req: Request) {
  try {
    const formData = await req.formData();
    
    const filePath = path.join(process.cwd(), "src", "db", "users.json");
    const file = await readFile(filePath, "utf8");
    const users = JSON.parse(file);

    // ---- VALIDAR TOKEN ----
    const token = req.headers
      .get("cookie")
      ?.split("; ")
      .find((c) => c.startsWith("session="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.TOKEN);
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.id;

    // Buscar usuário
    const index = users.findIndex((u: any) => u.id === userId);

    if (index === -1) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    // ---- PROCESSAR FOTO ----
    const fileField = formData.get("foto") as File | null;
    let fileName = null;

    if (fileField && fileField.size > 0) {
      // Cria pasta de uploads se não existir
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      try {
        await readFile(uploadDir);
      } catch {
        // Se não existir, cria
        const fs = await import("fs");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
      }

      // Gera nome único para o arquivo
      const fileExtension = fileField.name.split('.').pop();
      fileName = `${Date.now()}-${userId}.${fileExtension}`;
      const destinationPath = path.join(uploadDir, fileName);

      // Salva o arquivo
      const buffer = Buffer.from(await fileField.arrayBuffer());
      const fs = await import("fs");
      fs.writeFileSync(destinationPath, buffer);
    }

    // ---- PROCESSAR DEMAIS CAMPOS ----
    const body: any = {};
    
    // Extrai os campos do formData
    const fields = ["nome", "email", "phone", "cep", "uf", "city", "street", "currentPassword", "newPassword"];
    
    fields.forEach(field => {
      const value = formData.get(field);
      if (value) {
        body[field] = String(value);
      }
    });

    // ---- ATUALIZAR USUÁRIO ----
    const updatedUser = {
      ...users[index],
      nome: body.nome ?? users[index].nome,
      email: body.email ?? users[index].email,
      phone: body.phone ?? users[index].phone,
      cep: body.cep ?? users[index].cep,
      uf: body.uf ?? users[index].uf,
      city: body.city ?? users[index].city,
      street: body.street ?? users[index].street,
      // Atualiza foto apenas se um novo arquivo foi enviado
      foto: fileName ? `/uploads/${fileName}` : users[index].foto,
    };

    // Atualização de senha
    if (body.currentPassword && body.newPassword) {
      const match = await bcrypt.compare(body.currentPassword, users[index].senha);

      if (!match) {
        return NextResponse.json(
          { error: "Senha atual incorreta" },
          { status: 400 }
        );
      }

      updatedUser.senha = await bcrypt.hash(body.newPassword, 10);
    }

    users[index] = updatedUser;

    await writeFile(filePath, JSON.stringify(users, null, 2));

    return NextResponse.json({ 
      success: true, 
      user: updatedUser,
      message: fileName ? "Perfil e foto atualizados!" : "Perfil atualizado!"
    });

  } catch (error) {
    console.error("Erro no PUT /api/profile:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar perfil" },
      { status: 500 }
    );
  }
}