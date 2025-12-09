// /api/pets/my-pets/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const filePath = path.join(process.cwd(), "src", "db", "animals.json");

function readAnimals() {
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data || "[]");
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;
    
    if (!sessionCookie) {
      return NextResponse.json(
        { error: "Usuário não autenticado." },
        { status: 401 }
      );
    }

    // Decodifica o JWT
    let decoded;
    try {
      decoded = await jwtVerify(
        sessionCookie,
        new TextEncoder().encode(process.env.TOKEN || "secret_key")
      );
    } catch (err) {
      console.error("Erro ao verificar JWT:", err);
      return NextResponse.json(
        { error: "Sessão inválida." },
        { status: 401 }
      );
    }

    const userId = decoded.payload.id as string;
    
    const animals = readAnimals();
    
    // Filtra animais pelo userId
    const userAnimals = animals.filter((animal: any) => 
      animal.userId === userId
    );
    
    return NextResponse.json(userAnimals);
    
  } catch (error) {
    console.error("Erro ao buscar pets do usuário:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}