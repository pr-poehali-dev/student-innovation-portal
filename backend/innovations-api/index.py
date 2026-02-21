"""
API для управления контентом портала инноваций: конкурсы, гранты, мероприятия.
Параметры: ?entity=competitions|grants|events&id=N
"""

import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
    'Content-Type': 'application/json',
}

ADMIN_TOKEN = os.environ.get('ADMIN_TOKEN', 'admin123')

TABLE_MAP = {
    'competitions': 'competitions',
    'grants': 'grants',
    'events': 'events',
}

ALLOWED_FIELDS = {
    'competitions': ['title', 'description', 'deadline', 'prize', 'organizer', 'url', 'status'],
    'grants': ['title', 'description', 'amount', 'deadline', 'organizer', 'url', 'status'],
    'events': ['title', 'description', 'event_date', 'event_time', 'location', 'type', 'url', 'status'],
}


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def ok(data, status=200):
    return {'statusCode': status, 'headers': CORS_HEADERS, 'body': json.dumps(data, default=str)}


def err(msg, status=400):
    return {'statusCode': status, 'headers': CORS_HEADERS, 'body': json.dumps({'error': msg})}


def check_admin(event):
    token = event.get('headers', {}).get('X-Admin-Token', '')
    return token == ADMIN_TOKEN


def safe(val):
    return str(val).replace("'", "''")


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters') or {}
    entity = params.get('entity')
    item_id = params.get('id')

    if not entity:
        return ok({'status': 'ok', 'entities': list(TABLE_MAP.keys())})

    if entity not in TABLE_MAP:
        return err('Unknown entity. Use: competitions, grants, events', 404)

    table = TABLE_MAP[entity]

    conn = get_conn()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    if method == 'GET':
        if item_id:
            cur.execute(f'SELECT * FROM {table} WHERE id = {int(item_id)}')
            row = cur.fetchone()
            conn.close()
            if not row:
                return err('Not found', 404)
            return ok(dict(row))
        else:
            status_filter = params.get('status', 'active')
            if status_filter == 'all':
                cur.execute(f'SELECT * FROM {table} ORDER BY created_at DESC')
            else:
                cur.execute(f"SELECT * FROM {table} WHERE status = '{safe(status_filter)}' ORDER BY created_at DESC")
            rows = [dict(r) for r in cur.fetchall()]
            conn.close()
            return ok(rows)

    if not check_admin(event):
        conn.close()
        return err('Unauthorized', 401)

    body = {}
    if event.get('body'):
        body = json.loads(event['body'])

    if method == 'POST':
        allowed = ALLOWED_FIELDS[entity]
        fields = {k: v for k, v in body.items() if k in allowed}
        if not fields.get('title'):
            conn.close()
            return err('title is required')
        cols = ', '.join(fields.keys())
        vals = ', '.join([f"'{safe(v)}'" for v in fields.values()])
        cur.execute(f'INSERT INTO {table} ({cols}) VALUES ({vals}) RETURNING *')
        row = dict(cur.fetchone())
        conn.commit()
        conn.close()
        return ok(row, 201)

    if method == 'PUT':
        if not item_id:
            conn.close()
            return err('?id= required')
        allowed = ALLOWED_FIELDS[entity]
        fields = {k: v for k, v in body.items() if k in allowed}
        if not fields:
            conn.close()
            return err('No valid fields to update')
        set_clause = ', '.join([f"{k} = '{safe(v)}'" for k, v in fields.items()])
        cur.execute(f'UPDATE {table} SET {set_clause} WHERE id = {int(item_id)} RETURNING *')
        row = cur.fetchone()
        conn.commit()
        conn.close()
        if not row:
            return err('Not found', 404)
        return ok(dict(row))

    if method == 'DELETE':
        if not item_id:
            conn.close()
            return err('?id= required')
        cur.execute(f"UPDATE {table} SET status = 'deleted' WHERE id = {int(item_id)} RETURNING id")
        row = cur.fetchone()
        conn.commit()
        conn.close()
        if not row:
            return err('Not found', 404)
        return ok({'deleted': int(item_id)})

    conn.close()
    return err('Method not allowed', 405)
