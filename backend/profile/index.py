"""
Профиль игрока: получение, обновление данных, создание тикетов
"""
import json
import os
import psycopg2

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Session-Token',
}

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def get_user_by_token(cur, token: str):
    cur.execute(
        """SELECT id, username, email, avatar_url, bio, rank, score, kills, hours_played,
                  referral_code, discord_linked, vk_linked, telegram_linked, youtube_linked,
                  rutube_linked, email_verified, infected_killed, bots_killed, flags_placed,
                  trader_purchases, black_trader_purchases, fish_caught, friends_invited, created_at
           FROM users WHERE session_token = %s""",
        (token,)
    )
    return cur.fetchone()

def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    path = event.get('path', '/')
    method = event.get('httpMethod', 'GET')
    headers = event.get('headers', {}) or {}
    token = headers.get('X-Session-Token') or headers.get('x-session-token', '')

    conn = get_conn()
    cur = conn.cursor()

    if path.endswith('/me'):
        if not token:
            cur.close(); conn.close()
            return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Не авторизован'})}

        row = get_user_by_token(cur, token)
        if not row:
            cur.close(); conn.close()
            return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Сессия истекла'})}

        (id_, username, email, avatar_url, bio, rank, score, kills, hours_played,
         referral_code, discord_linked, vk_linked, telegram_linked, youtube_linked,
         rutube_linked, email_verified, infected_killed, bots_killed, flags_placed,
         trader_purchases, black_trader_purchases, fish_caught, friends_invited, created_at) = row

        cur.execute(
            """SELECT a.code, a.name, a.description, a.icon, a.category, a.color, ua.unlocked_at
               FROM user_achievements ua JOIN achievements a ON a.id = ua.achievement_id
               WHERE ua.user_id = %s ORDER BY ua.unlocked_at DESC""",
            (id_,)
        )
        achs = [
            {'code': r[0], 'name': r[1], 'description': r[2], 'icon': r[3],
             'category': r[4], 'color': r[5], 'unlocked_at': str(r[6])}
            for r in cur.fetchall()
        ]

        cur.close(); conn.close()
        return {
            'statusCode': 200,
            'headers': CORS,
            'body': json.dumps({
                'id': id_, 'username': username, 'email': email,
                'avatar_url': avatar_url, 'bio': bio, 'rank': rank,
                'score': score, 'kills': kills, 'hours_played': hours_played,
                'referral_code': referral_code,
                'discord_linked': discord_linked, 'vk_linked': vk_linked,
                'telegram_linked': telegram_linked, 'youtube_linked': youtube_linked,
                'rutube_linked': rutube_linked, 'email_verified': email_verified,
                'infected_killed': infected_killed, 'bots_killed': bots_killed,
                'flags_placed': flags_placed, 'trader_purchases': trader_purchases,
                'black_trader_purchases': black_trader_purchases,
                'fish_caught': fish_caught, 'friends_invited': friends_invited,
                'created_at': str(created_at),
                'achievements': achs,
            })
        }

    if path.endswith('/update') and method == 'PUT':
        if not token:
            cur.close(); conn.close()
            return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Не авторизован'})}

        row = get_user_by_token(cur, token)
        if not row:
            cur.close(); conn.close()
            return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Сессия истекла'})}

        user_id = row[0]
        body = json.loads(event.get('body') or '{}')
        bio = body.get('bio', '')[:300]
        avatar_url = body.get('avatar_url', '')

        cur.execute(
            "UPDATE users SET bio = %s, avatar_url = %s WHERE id = %s",
            (bio, avatar_url or None, user_id)
        )
        conn.commit()
        cur.close(); conn.close()
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True})}

    if path.endswith('/link') and method == 'POST':
        if not token:
            cur.close(); conn.close()
            return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Не авторизован'})}

        row = get_user_by_token(cur, token)
        if not row:
            cur.close(); conn.close()
            return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Сессия истекла'})}

        user_id = row[0]
        body = json.loads(event.get('body') or '{}')
        service = body.get('service', '')

        field_map = {
            'discord': 'discord_linked',
            'vk': 'vk_linked',
            'telegram': 'telegram_linked',
            'youtube': 'youtube_linked',
            'rutube': 'rutube_linked',
            'email': 'email_verified',
        }
        ach_map = {
            'discord': 'discord_link',
            'vk': 'vk_link',
            'telegram': 'telegram_link',
            'youtube': 'youtube_link',
            'rutube': 'rutube_link',
            'email': 'email_link',
        }

        if service not in field_map:
            cur.close(); conn.close()
            return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Неизвестный сервис'})}

        field = field_map[service]
        cur.execute(f"UPDATE users SET {field} = TRUE WHERE id = %s", (user_id,))

        ach_code = ach_map[service]
        cur.execute("SELECT id FROM achievements WHERE code = %s", (ach_code,))
        ach_row = cur.fetchone()
        if ach_row:
            cur.execute(
                "INSERT INTO user_achievements (user_id, achievement_id) VALUES (%s, %s) ON CONFLICT DO NOTHING",
                (user_id, ach_row[0])
            )

        conn.commit()
        cur.close(); conn.close()
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True, 'service': service})}

    if path.endswith('/ticket') and method == 'POST':
        if not token:
            cur.close(); conn.close()
            return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Не авторизован'})}

        row = get_user_by_token(cur, token)
        if not row:
            cur.close(); conn.close()
            return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Сессия истекла'})}

        user_id = row[0]
        body = json.loads(event.get('body') or '{}')
        category = body.get('category', 'Другое')
        message = body.get('message', '').strip()

        if not message:
            cur.close(); conn.close()
            return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Пустое сообщение'})}

        cur.execute(
            "INSERT INTO tickets (user_id, category, message) VALUES (%s, %s, %s) RETURNING id",
            (user_id, category, message)
        )
        ticket_id = cur.fetchone()[0]
        conn.commit()
        cur.close(); conn.close()
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True, 'ticket_id': ticket_id})}

    if path.endswith('/tickets') and method == 'GET':
        if not token:
            cur.close(); conn.close()
            return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Не авторизован'})}

        row = get_user_by_token(cur, token)
        if not row:
            cur.close(); conn.close()
            return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Сессия истекла'})}

        user_id = row[0]
        cur.execute(
            "SELECT id, category, message, status, created_at FROM tickets WHERE user_id = %s ORDER BY created_at DESC LIMIT 20",
            (user_id,)
        )
        tickets = [
            {'id': r[0], 'category': r[1], 'message': r[2], 'status': r[3], 'created_at': str(r[4])}
            for r in cur.fetchall()
        ]
        cur.close(); conn.close()
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'tickets': tickets})}

    cur.close(); conn.close()
    return {'statusCode': 404, 'headers': CORS, 'body': json.dumps({'error': 'Not found'})}
