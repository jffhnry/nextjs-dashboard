import postgres from 'postgres';

if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL is not defined');
}

const sql = postgres(process.env.POSTGRES_URL, { ssl: 'require' });

async function listInvoices(amount: number = 666) {
  const data = await sql`
    SELECT invoices.amount, customers.name
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE invoices.amount = ${amount};
  `;
  return data;
}

export async function GET() {
  try {
    const invoices = await listInvoices();
    return Response.json(invoices);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
