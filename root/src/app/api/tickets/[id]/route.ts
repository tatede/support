import pool from "@/lib/db";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ticket = await pool.query(`SELECT * FROM support_tickets WHERE id = $1`, [id]);
  const messages = await pool.query(
    `SELECT * FROM support_messages WHERE ticket_id = $1 ORDER BY created_at ASC`, [id]
  );
  return Response.json({ ticket: ticket.rows[0], messages: messages.rows });
}

export async function PATCH(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { status } = await _req.json();
  await pool.query(`UPDATE support_tickets SET status = $1 WHERE id = $2`, [status, id]);
  return Response.json({ ok: true });
}
