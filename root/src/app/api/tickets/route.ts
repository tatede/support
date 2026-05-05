import pool from "@/lib/db";

export async function GET() {
  const result = await pool.query(
    `SELECT t.*, 
     (SELECT COUNT(*) FROM support_messages WHERE ticket_id = t.id) as message_count,
     (SELECT created_at FROM support_messages WHERE ticket_id = t.id ORDER BY created_at DESC LIMIT 1) as last_message_at
     FROM support_tickets t ORDER BY t.created_at DESC`
  );
  return Response.json(result.rows);
}
