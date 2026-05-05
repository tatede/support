import pool from "@/lib/db";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const ticket = await pool.query(
    `SELECT 
      t.*,
      -- Student info
      s.username       AS student_username,
      s.display_name   AS student_display_name,
      s.coins          AS student_coins,
      s.lesson_progress AS student_lesson_progress,
      s.grade          AS student_grade,
      s.is_premium     AS student_is_premium,
      s.created_at     AS student_created_at,
      -- Class info
      c.name           AS class_name,
      -- Teacher (via class)
      tc.name          AS teacher_name,
      tc.email         AS teacher_email_from_class,
      -- Teacher (direct ticket submitter)
      tr.name          AS teacher_direct_name
    FROM support_tickets t
    LEFT JOIN students s ON s.id::text = t.student_id
    LEFT JOIN classes c ON c.id = s.class_id
    LEFT JOIN teachers tc ON tc.id = c.teacher_id
    LEFT JOIN teachers tr ON tr.email = t.teacher_email
    WHERE t.id = $1`,
    [id]
  );

  const messages = await pool.query(
    `SELECT * FROM support_messages WHERE ticket_id = $1 ORDER BY created_at ASC`,
    [id]
  );

  return Response.json({ ticket: ticket.rows[0], messages: messages.rows });
}

export async function PATCH(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { status } = await _req.json();
  await pool.query(`UPDATE support_tickets SET status = $1 WHERE id = $2`, [status, id]);
  return Response.json({ ok: true });
}
