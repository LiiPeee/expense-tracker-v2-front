// pt-BR spreadsheets default to ';' as the column separator, which also avoids
// clashing with the decimal comma used in monetary values.
const DEFAULT_DELIMITER = ";";

// Prevent CSV/formula injection: a cell starting with =, +, -, @ (or tab) is
// interpreted as a formula by spreadsheet apps. Prefixing with ' forces literal text.
function neutralizeFormula(value: string): string {
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
}

function escapeCsvCell(value: string, delimiter: string): string {
  const safe = neutralizeFormula(value);
  if (safe.includes(delimiter) || safe.includes('"') || safe.includes("\n") || safe.includes("\r")) {
    return `"${safe.replace(/"/g, '""')}"`;
  }
  return safe;
}

export function toCsv(headers: string[], rows: string[][], delimiter = DEFAULT_DELIMITER): string {
  return [headers, ...rows].map((cells) => cells.map((cell) => escapeCsvCell(cell, delimiter)).join(delimiter)).join("\r\n");
}

/** Triggers a client-side download of CSV content. The BOM makes Excel detect UTF-8. */
export function downloadCsv(filename: string, content: string): void {
  const blob = new Blob(["﻿" + content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
