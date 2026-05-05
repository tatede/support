import pool from "@/lib/db";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { message } = await req.json();
  await pool.query(
    `INSERT INTO support_messages (ticket_id, sender, message) VALUES ($1, $2, $3)`,
    [id, "agent", message]
  );
  return Response.json({ ok: true });
}
