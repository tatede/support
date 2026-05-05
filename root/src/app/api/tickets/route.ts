import pool from "@/lib/db";

export async function GET() {
  const result = await pool.query(
    `SELECT 
      t.*,
      (SELECT COUNT(*) FROM support_messages WHERE ticket_id = t.id) as message_count,
      (SELECT created_at FROM support_messages WHERE ticket_id = t.id ORDER BY created_at DESC LIMIT 1) as last_message_at,
      -- Student info
      s.username      AS student_username,
      s.display_name  AS student_display_name,
      s.coins         AS student_coins,
      s.lesson_progress AS student_lesson_progress,
      s.grade         AS student_grade,
      s.is_premium    AS student_is_premium,
      s.created_at    AS student_created_at,
      -- Class info
      c.name          AS class_name,
      -- Teacher info (from class)
      tc.name         AS teacher_name,
      tc.email        AS teacher_email_from_class,
      -- Teacher info (direct, for teacher-submitted tickets)
      tr.name         AS teacher_direct_name
    FROM support_tickets t
    LEFT JOIN students s ON s.id::text = t.student_id
    LEFT JOIN classes c ON c.id = s.class_id
    LEFT JOIN teachers tc ON tc.id = c.teacher_id
    LEFT JOIN teachers tr ON tr.email = t.teacher_email
    ORDER BY t.created_at DESC`
  );
  return Response.json(result.rows);
}
