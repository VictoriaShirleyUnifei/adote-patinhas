import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "src", "db", "animals.json");

// Lê o arquivo
function readAnimals() {
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data || "[]");
}

// Salva no arquivo
function saveAnimals(data: any) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export async function GET() {
  const animals = readAnimals();
  return NextResponse.json(animals);
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // foto (arquivo)
    const file = formData.get("foto") as File | null;

    let fileName = null;

    if (file) {
      // cria pasta public/uploads se não existir
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

      fileName = `${Date.now()}-${file.name}`;
      const filePath = path.join(uploadDir, fileName);

      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(filePath, buffer);
    }

    const body: any = {};

    formData.forEach((value, key) => {
      if (key === "foto") return; 

      try {
        // tenta converter JSON dos objetos
        body[key] = JSON.parse(String(value));
      } catch {
        // se não for JSON, salva como string normal
        body[key] = value;
      }
    });

    const animals = readAnimals();

    const animal = {
      id: crypto.randomUUID(),
      foto: fileName, // salva nome do arquivo
      isInterested: false,
      ...body,
    };

    animals.push(animal);
    saveAnimals(animals);

    return NextResponse.json(animal, { status: 201 });
  } catch (error) {
    console.error("Erro no POST /api/pets:", error);
    return NextResponse.json(
      { error: "Erro ao salvar pet." },
      { status: 500 }
    );
  }
}
