import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";

export async function POST(req: Request) {
  try {
    const { email, senha } = await req.json();

    const filePath = path.join(process.cwd(), "src", "db", "users.json");
    const users = JSON.parse(await readFile(filePath, "utf8"));

    const user = users.find((u: any) => u.email === email);

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
    }

    if (!(await bcrypt.compare(senha, user.senha))) {
      return NextResponse.json({ error: "Senha incorreta." }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.TOKEN);

    const token = await new SignJWT({
      id: user.id,
      email: user.email,
      nome: user.nome,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(secret);

    const response = NextResponse.json({ success: true });

    response.cookies.set("session", token, {
      httpOnly: true,
      path: "/",
      maxAge: 3600,
    });

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro interno." },
      { status: 500 }
    );
  }
}
