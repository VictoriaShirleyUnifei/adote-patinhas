import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const filePath = path.join(process.cwd(), "src", "db", "animals.json");
const usersFilePath = path.join(process.cwd(), "src", "db", "users.json");

function readAnimals() {
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data || "[]");
}

function readUsers() {
  try {
    const data = fs.readFileSync(usersFilePath, "utf-8");
    return JSON.parse(data || "[]");
  } catch (error) {
    console.error("Erro ao ler usuários:", error);
    return [];
  }
}

function findUserById(userId: string) {
  const users = readUsers();
  return users.find((user: any) => user.id === userId);
}

function saveAnimals(data: any) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// GET: Busca animais
export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  
  if (id) {
    // Busca um animal específico
    const animals = readAnimals();
    const animal = animals.find((a: any) => a.id === id);
    
    if (!animal) {
      return NextResponse.json({ error: "Animal não encontrado" }, { status: 404 });
    }
    
    return NextResponse.json(animal);
  }
  
  // Retorna todos os animais
  const animals = readAnimals();
  return NextResponse.json(animals);
}

// POST: Cria ou atualiza animal
export async function POST(req: Request) {
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
    const user = findUserById(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado." },
        { status: 404 }
      );
    }

    const formData = await req.formData();
    const id = formData.get("id") as string; // Para edição

    let fileName = null;
    const file = formData.get("foto") as File | null;

    if (file) {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

      fileName = `${Date.now()}-${file.name}`;
      const uploadPath = path.join(uploadDir, fileName);

      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(uploadPath, buffer);
    }

    const body: any = {};
    formData.forEach((value, key) => {
      if (key === "foto" || key === "id") return;
      try {
        body[key] = JSON.parse(String(value));
      } catch {
        body[key] = value;
      }
    });

    const animals = readAnimals();

    if (id) {
      // MODE EDIT: Atualiza animal existente
      const animalIndex = animals.findIndex((a: any) => a.id === id);
      
      if (animalIndex === -1) {
        return NextResponse.json(
          { error: "Animal não encontrado." },
          { status: 404 }
        );
      }

      // Verifica se o usuário é o dono do animal
      if (animals[animalIndex].userId !== userId) {
        return NextResponse.json(
          { error: "Você não tem permissão para editar este animal." },
          { status: 403 }
        );
      }

      // Atualiza o animal
      animals[animalIndex] = {
        ...animals[animalIndex],
        ...body,
        foto: fileName || animals[animalIndex].foto, // Mantém foto antiga se não enviar nova
        updatedAt: new Date().toISOString()
      };

      saveAnimals(animals);
      return NextResponse.json(animals[animalIndex]);
    } else {
      // MODE CREATE: Cria novo animal
      const animal = {
        id: crypto.randomUUID(),
        foto: fileName,
        userId: userId,
        userName: user.nome || "Usuário",
        userPhone: user.phone || user.telefone || "",
        userEmail: user.email || "",
        userFoto: user.foto || "",
        cadastroData: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        isInterested: false,
        ...body,
      };

      animals.push(animal);
      saveAnimals(animals);

      return NextResponse.json(animal, { status: 201 });
    }
  } catch (error) {
    console.error("Erro no POST /api/pets:", error);
    return NextResponse.json(
      { error: "Erro ao salvar pet." },
      { status: 500 }
    );
  }
}

// PUT: Atualiza animal
export async function PUT(req: Request) {
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
    const user = findUserById(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado." },
        { status: 404 }
      );
    }

    const formData = await req.formData();
    const id = formData.get("id") as string;

    if (!id) {
      return NextResponse.json(
        { error: "ID do animal não fornecido." },
        { status: 400 }
      );
    }

    let fileName = null;
    const file = formData.get("foto") as File | null;

    if (file) {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

      fileName = `${Date.now()}-${file.name}`;
      const uploadPath = path.join(uploadDir, fileName);

      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(uploadPath, buffer);
    }

    const body: any = {};
    formData.forEach((value, key) => {
      if (key === "foto" || key === "id") return;
      try {
        body[key] = JSON.parse(String(value));
      } catch {
        body[key] = value;
      }
    });

    const animals = readAnimals();
    const animalIndex = animals.findIndex((a: any) => a.id === id);
    
    if (animalIndex === -1) {
      return NextResponse.json(
        { error: "Animal não encontrado." },
        { status: 404 }
      );
    }

    // Verifica se o usuário é o dono do animal
    if (animals[animalIndex].userId !== userId) {
      return NextResponse.json(
        { error: "Você não tem permissão para editar este animal." },
        { status: 403 }
      );
    }

    // Atualiza o animal
    animals[animalIndex] = {
      ...animals[animalIndex],
      ...body,
      foto: fileName || animals[animalIndex].foto,
      updatedAt: new Date().toISOString()
    };

    saveAnimals(animals);
    return NextResponse.json(animals[animalIndex]);

  } catch (error) {
    console.error("Erro no PUT /api/pets:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar pet." },
      { status: 500 }
    );
  }
}

// DELETE: Remove animal
export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { error: "ID do animal não fornecido." },
        { status: 400 }
      );
    }

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
    
    const animalIndex = animals.findIndex((a: any) => a.id === id);
    
    if (animalIndex === -1) {
      return NextResponse.json(
        { error: "Animal não encontrado." },
        { status: 404 }
      );
    }

    // Verifica se o usuário é o dono do animal
    if (animals[animalIndex].userId !== userId) {
      return NextResponse.json(
        { error: "Você não tem permissão para excluir este animal." },
        { status: 403 }
      );
    }

    // Remove a foto do sistema de arquivos (opcional)
    const foto = animals[animalIndex].foto;
    if (foto) {
      const fotoPath = path.join(process.cwd(), "public", "uploads", foto);
      if (fs.existsSync(fotoPath)) {
        fs.unlinkSync(fotoPath);
      }
    }

    // Remove o animal do array
    animals.splice(animalIndex, 1);
    saveAnimals(animals);

    return NextResponse.json({ 
      message: "Animal excluído com sucesso.",
      success: true 
    });
  } catch (error) {
    console.error("Erro no DELETE /api/pets:", error);
    return NextResponse.json(
      { error: "Erro ao excluir pet." },
      { status: 500 }
    );
  }
}