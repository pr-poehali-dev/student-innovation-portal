"""
API для управления конкурсами, грантами и мероприятиями портала инноваций.
Поддерживает GET (список), POST (создать), PUT (обновить), DELETE (удалить).
POST /auth — авторизация администратора.
"""
import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

SCHEMA = "t_p59349399_student_innovation_p"

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Admin-Token",
    "Content-Type": "application/json",
}

ALLOWED_TYPES = {"competitions", "grants", "events"}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"], cursor_factory=RealDictCursor)


def resp(data, status=200):
    return {"statusCode": status, "headers": CORS_HEADERS, "body": json.dumps(data, default=str)}


def check_admin(event):
    token = event.get("headers", {}).get("X-Admin-Token", "")
    return token == os.environ.get("ADMIN_PASSWORD", "")


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}
    path = event.get("path", "/")

    # Auth endpoint
    if path.endswith("/auth") or params.get("action") == "auth":
        body = json.loads(event.get("body") or "{}")
        pwd = body.get("password", "")
        admin_pwd = os.environ.get("ADMIN_PASSWORD", "")
        if not admin_pwd:
            return resp({"error": "Server misconfigured"}, 500)
        if pwd == admin_pwd:
            return resp({"token": admin_pwd, "ok": True})
        return resp({"error": "Неверный пароль"}, 401)

    item_type = params.get("type", "")
    item_id = params.get("id", "")

    if item_type not in ALLOWED_TYPES:
        return resp({"error": "Invalid type. Use: competitions, grants, events"}, 400)

    conn = get_conn()
    cur = conn.cursor()

    try:
        if method == "GET":
            show_all = params.get("all") == "1"
            if show_all and check_admin(event):
                cur.execute(f"SELECT * FROM {SCHEMA}.{item_type} ORDER BY created_at DESC")
            else:
                cur.execute(f"SELECT * FROM {SCHEMA}.{item_type} WHERE status != 'deleted' ORDER BY created_at DESC")
            rows = [dict(r) for r in cur.fetchall()]
            for r in rows:
                for k, v in r.items():
                    if hasattr(v, "isoformat"):
                        r[k] = v.isoformat()
            return resp(rows)

        if not check_admin(event):
            return resp({"error": "Unauthorized"}, 401)

        body = json.loads(event.get("body") or "{}")

        if method == "POST":
            if item_type == "competitions":
                cur.execute(
                    f"INSERT INTO {SCHEMA}.competitions (title, description, deadline, prize, organizer, url, status) VALUES (%s,%s,%s,%s,%s,%s,%s) RETURNING *",
                    (body.get("title"), body.get("description"), body.get("deadline") or None,
                     body.get("prize"), body.get("organizer"), body.get("url"), body.get("status", "active"))
                )
            elif item_type == "grants":
                cur.execute(
                    f"INSERT INTO {SCHEMA}.grants (title, description, deadline, amount, organizer, url, status) VALUES (%s,%s,%s,%s,%s,%s,%s) RETURNING *",
                    (body.get("title"), body.get("description"), body.get("deadline") or None,
                     body.get("amount"), body.get("organizer"), body.get("url"), body.get("status", "active"))
                )
            else:
                cur.execute(
                    f"INSERT INTO {SCHEMA}.events (title, description, event_date, event_time, location, type, url, status) VALUES (%s,%s,%s,%s,%s,%s,%s,%s) RETURNING *",
                    (body.get("title"), body.get("description"), body.get("event_date") or None,
                     body.get("event_time"), body.get("location"), body.get("type", "event"),
                     body.get("url"), body.get("status", "active"))
                )
            row = dict(cur.fetchone())
            for k, v in row.items():
                if hasattr(v, "isoformat"):
                    row[k] = v.isoformat()
            conn.commit()
            return resp(row, 201)

        if method == "PUT":
            if not item_id:
                return resp({"error": "id required"}, 400)
            if item_type == "competitions":
                cur.execute(
                    f"UPDATE {SCHEMA}.competitions SET title=%s, description=%s, deadline=%s, prize=%s, organizer=%s, url=%s, status=%s WHERE id=%s RETURNING *",
                    (body.get("title"), body.get("description"), body.get("deadline") or None,
                     body.get("prize"), body.get("organizer"), body.get("url"), body.get("status", "active"), int(item_id))
                )
            elif item_type == "grants":
                cur.execute(
                    f"UPDATE {SCHEMA}.grants SET title=%s, description=%s, deadline=%s, amount=%s, organizer=%s, url=%s, status=%s WHERE id=%s RETURNING *",
                    (body.get("title"), body.get("description"), body.get("deadline") or None,
                     body.get("amount"), body.get("organizer"), body.get("url"), body.get("status", "active"), int(item_id))
                )
            else:
                cur.execute(
                    f"UPDATE {SCHEMA}.events SET title=%s, description=%s, event_date=%s, event_time=%s, location=%s, type=%s, url=%s, status=%s WHERE id=%s RETURNING *",
                    (body.get("title"), body.get("description"), body.get("event_date") or None,
                     body.get("event_time"), body.get("location"), body.get("type", "event"),
                     body.get("url"), body.get("status", "active"), int(item_id))
                )
            row = dict(cur.fetchone())
            for k, v in row.items():
                if hasattr(v, "isoformat"):
                    row[k] = v.isoformat()
            conn.commit()
            return resp(row)

        if method == "DELETE":
            if not item_id:
                return resp({"error": "id required"}, 400)
            cur.execute(f"UPDATE {SCHEMA}.{item_type} SET status='deleted' WHERE id=%s", (int(item_id),))
            conn.commit()
            return resp({"ok": True})

    finally:
        cur.close()
        conn.close()

    return resp({"error": "Method not allowed"}, 405)
