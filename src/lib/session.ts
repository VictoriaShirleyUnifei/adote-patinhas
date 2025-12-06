'use server';

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

async function openSessionToken(token: string){
    const encodedKey = new TextEncoder().encode(process.env.TOKEN);

    try{
        const {payload} = await jwtVerify(token, encodedKey, {
            algorithms: ["HS256"],
        });
        return payload;
    }catch(e){
        console.log('Erro ao verificar session token', e);
        return null;
    }
}

export async function createSessionToken(userId: string, userEmail: string){
    const encodedKey = new TextEncoder().encode(process.env.TOKEN); 
    const expiresAt = Date.now() + 3600;

    const session = await new SignJWT({userId, userEmail})
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1h')
      .sign(encodedKey);

    const cookieStore = await cookies();
    
    cookieStore.set('session', session, {
        expires: expiresAt * 1000,
        path: '/',
        httpOnly: true
    });
}

export async function isSessionValid(){
    const sessionCookie = (await cookies()).get('session');

    if(sessionCookie){
        const session = await openSessionToken(sessionCookie.value);
        return session;
    }

    return false;
}

export async function deleteSessionCookie(){
    const cookieStore = await cookies();
    cookieStore.delete('session');
}
