import { NextResponse } from "next/server";

const template = `transaction_date,type,amount,currency,description,category_slug\n2026-03-01,expense,49.90,EUR,Hosting invoice,infrastructure\n2026-03-02,income,1500.00,EUR,Retainer payment,services\n`;

export async function GET() {
  return new NextResponse(template, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="transactions_template.csv"',
    },
  });
}
