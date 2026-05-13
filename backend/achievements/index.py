"""
Достижения: получение полного списка и разблокированных достижений пользователя
"""
import json
import os
import psycopg2

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Session-Token',
}

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    conn = get_conn()
    cur = conn.cursor()

    headers = event.get('headers', {}) or {}
    token = headers.get('X-Session-Token') or headers.get('x-session-token', '')

    cur.execute("SELECT id, code, name, description, icon, category, color FROM achievements ORDER BY id")
    all_achs = [
        {'id': r[0], 'code': r[1], 'name': r[2], 'description': r[3],
         'icon': r[4], 'category': r[5], 'color': r[6]}
        for r in cur.fetchall()
    ]

    unlocked_codes = set()
    if token:
        cur.execute("SELECT id FROM users WHERE session_token = %s", (token,))
        user_row = cur.fetchone()
        if user_row:
            user_id = user_row[0]
            cur.execute(
                "SELECT a.code FROM user_achievements ua JOIN achievements a ON a.id = ua.achievement_id WHERE ua.user_id = %s",
                (user_id,)
            )
            unlocked_codes = {r[0] for r in cur.fetchall()}

    cur.close()
    conn.close()

    for ach in all_achs:
        ach['unlocked'] = ach['code'] in unlocked_codes

    return {
        'statusCode': 200,
        'headers': CORS,
        'body': json.dumps({'achievements': all_achs})
    }
