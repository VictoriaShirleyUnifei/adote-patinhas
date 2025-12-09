import { jwtVerify } from "jose";

export async function getUserIdFromRequest(req: Request): Promise<string | null> {
  try {
    // Pega o cookie session
    const cookieHeader = req.headers.get("cookie") ?? "";
    const session = cookieHeader
      .split("; ")
      .find((c) => c.startsWith("session="))
      ?.replace("session=", "");

    if (!session) {
      return null;
    }

    // Decodifica o JWT
    const decoded = await jwtVerify(
      session,
      new TextEncoder().encode(process.env.TOKEN || "secret_key")
    );

    return decoded.payload.id as string;
  } catch (error) {
    console.error("Erro ao decodificar JWT:", error);
    return null;
  }
}

export async function getUserFromRequest(req: Request) {
  try {
    const filePath = require('path').join(process.cwd(), "src", "db", "users.json");
    const fs = require('fs');
    const users = JSON.parse(fs.readFileSync(filePath, "utf8"));
    
    const userId = await getUserIdFromRequest(req);
    
    if (!userId) {
      return null;
    }
    
    const user = users.find((u: any) => u.id === userId);
    
    if (!user) {
      return null;
    }
    
    const { senha, ...safeUser } = user;
    return safeUser;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return null;
  }
}