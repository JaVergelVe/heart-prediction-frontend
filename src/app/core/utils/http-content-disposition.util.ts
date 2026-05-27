/** Extrae el nombre de archivo del encabezado `Content-Disposition` (attachment). */
export function parseFilenameFromContentDisposition(header: string | null | undefined): string | null {
  if (!header || typeof header !== 'string') {
    return null;
  }
  const star = /filename\*=(?:UTF-8'')?([^;\n]+)/i.exec(header);
  if (star?.[1]) {
    const raw = star[1].trim().replace(/^["']|["']$/g, '');
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  }
  const quoted = /filename="([^"]+)"/i.exec(header);
  if (quoted?.[1]) {
    return quoted[1];
  }
  const plain = /filename=([^;\n]+)/i.exec(header);
  if (plain?.[1]) {
    return plain[1].trim().replace(/^["']|["']$/g, '');
  }
  return null;
}
