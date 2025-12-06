import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nome, email, senha } = body;

    if (!nome || !email || !senha) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios." },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), "src", "db", "users.json");
    const file = await readFile(filePath, "utf8");
    const users = JSON.parse(file);

    const userExists = users.some((u: any) => u.email === email);

    if (userExists) {
      return NextResponse.json(
        { error: "Usuário já existe." },
        { status: 400 }
      );
    }

    // Criptografar senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    const newUser = {
      id: crypto.randomUUID(),
      nome: nome,
      email,
      senha: hashedPassword,
    };

    users.push(newUser);

    await writeFile(filePath, JSON.stringify(users, null, 2));

    return NextResponse.json({ success: true, user: newUser });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro interno ao registrar." },
      { status: 500 }
    );
  }
}
