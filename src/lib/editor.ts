// Helpers shared by the admin section editors.

export type EditorAction = {
  kind: 'save' | 'publish' | 'add' | 'delete' | 'up' | 'down';
  index?: number;
};

/** Parse an `action` form value like "save", "publish", "delete:2", "up:3". */
export function parseAction(value: FormDataEntryValue | null): EditorAction {
  const raw = typeof value === 'string' ? value : 'save';
  const [kind, idx] = raw.split(':');
  const known = ['save', 'publish', 'add', 'delete', 'up', 'down'];
  return {
    kind: (known.includes(kind) ? kind : 'save') as EditorAction['kind'],
    index: idx !== undefined ? Number(idx) : undefined,
  };
}

/** Split a textarea into trimmed, non-empty lines. */
export function lines(value: FormDataEntryValue | null): string[] {
  return String(value ?? '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
}

/** Parse "label | value" lines into pairs (value keeps any extra pipes). */
export function pipePairs(value: FormDataEntryValue | null): { a: string; b: string }[] {
  return lines(value).map((line) => {
    const [a, ...rest] = line.split('|');
    return { a: a.trim(), b: rest.join('|').trim() };
  });
}

export function str(form: FormData, key: string): string {
  return String(form.get(key) ?? '').trim();
}

export function num(form: FormData, key: string, fallback = 0): number {
  const n = Number(form.get(key));
  return Number.isFinite(n) ? n : fallback;
}

/** A non-negative integer item count from a form, capped to guard malformed input. */
export function itemCount(form: FormData, max = 200): number {
  const n = Number(form.get('count'));
  if (!Number.isInteger(n) || n < 0) return 0;
  return Math.min(n, max);
}

export function swap<T>(arr: T[], i: number, j: number): void {
  if (i < 0 || j < 0 || i >= arr.length || j >= arr.length) return;
  [arr[i], arr[j]] = [arr[j], arr[i]];
}

export function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 48) || `item-${Date.now().toString(36)}`
  );
}
