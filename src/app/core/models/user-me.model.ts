import { RegisterMedicalIn, RegisterProfileIn } from './register-request.model';

/** Datos del usuario autenticado expuestos por `GET /v1/users/me` (perfil + médico). */
export interface CurrentUserMe {
  email?: string;
  profile: RegisterProfileIn;
  medical_conditions: RegisterMedicalIn;
}

/**
 * Extrae `profile` y `medical_conditions` del JSON del API.
 * Soporta `{ data: { ... } }` o cuerpo plano con las mismas claves.
 */
export function extractCurrentUserMe(body: unknown): CurrentUserMe | null {
  if (!body || typeof body !== 'object') {
    return null;
  }
  const root = body as Record<string, unknown>;
  const data = root['data'];
  const container =
    data && typeof data === 'object' && !Array.isArray(data)
      ? (data as Record<string, unknown>)
      : root;
  const profile = container['profile'];
  const medical = container['medical_conditions'];
  if (!profile || typeof profile !== 'object' || !medical || typeof medical !== 'object') {
    return null;
  }
  const emailRaw = container['email'];
  return {
    email: typeof emailRaw === 'string' ? emailRaw : undefined,
    profile: profile as RegisterProfileIn,
    medical_conditions: medical as RegisterMedicalIn
  };
}
