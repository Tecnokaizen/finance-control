export function parseCsvText(text: string): { headers: string[]; rows: string[][] } {
  const lines = text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

  const split = (line: string) => line.split(",").map((cell) => cell.trim());

  const headers = split(lines[0]);
  const rows = lines.slice(1).map(split);

  return { headers, rows };
}

export function inferMapping(headers: string[]) {
  const lower = headers.map((header) => header.toLowerCase());

  const find = (...candidates: string[]) => {
    const index = lower.findIndex((item) => candidates.includes(item));
    return index >= 0 ? headers[index] : "";
  };

  return {
    transactionDate: find("transaction_date", "date", "fecha"),
    type: find("type", "transaction_type", "tipo"),
    amount: find("amount", "importe"),
    currency: find("currency", "moneda"),
    description: find("description", "concept", "concepto"),
    categorySlug: find("category_slug", "category", "categoria", "slug"),
  };
}
