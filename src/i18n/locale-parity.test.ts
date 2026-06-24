import en from "./locales/en.json";
import es from "./locales/es.json";
import ptBR from "./locales/pt-BR.json";

function flattenKeys(value: unknown, prefix = ""): string[] {
  if (!value || typeof value !== "object") return [prefix];
  return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
    flattenKeys(child, prefix ? `${prefix}.${key}` : key),
  );
}

describe("locale key parity", () => {
  const base = flattenKeys(ptBR).sort();

  it.each([
    ["en", en],
    ["es", es],
  ])("%s has exactly the same keys as pt-BR", (_name, locale) => {
    expect(flattenKeys(locale).sort()).toEqual(base);
  });
});
