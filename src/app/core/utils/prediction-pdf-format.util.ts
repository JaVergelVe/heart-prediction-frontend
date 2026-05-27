type LabeledOption = { readonly value: string; readonly label: string };

/** Devuelve la etiqueta en español de un valor literal del API, o el valor tal cual. */
export function labelForSurveyOption(
  options: readonly LabeledOption[],
  value: string | null | undefined
): string {
  if (value == null || String(value).trim() === '') {
    return '';
  }
  const text = String(value);
  const match = options.find((o) => o.value === text);
  return match?.label ?? text;
}

export function formatPdfBoolean(value: boolean | null | undefined, yes: string, no: string, empty: string): string {
  if (value == null) {
    return empty;
  }
  return value ? yes : no;
}

export function formatPdfNumber(value: number | null | undefined, empty: string, decimals = 2): string {
  if (value == null || Number.isNaN(Number(value))) {
    return empty;
  }
  return Number(value).toLocaleString('es-ES', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals
  });
}

export function formatPdfTimestamp(iso: string | null | undefined, empty: string): string {
  if (!iso || String(iso).trim() === '') {
    return empty;
  }
  const parsed = Date.parse(iso);
  if (!Number.isFinite(parsed)) {
    return String(iso);
  }
  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'medium',
    timeStyle: 'medium'
  }).format(parsed);
}
