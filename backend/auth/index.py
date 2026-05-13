"""
Аутентификация: регистрация и вход игроков сервера ЛЕСНЫЕ
"""
import json
import os
import hashlib
import secrets
import string
import psycopg2

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Session-Token',
}

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def hash_password(pwd: str) -> str:
    return hashlib.sha256(pwd.encode()).hexdigest()

def gen_token() -> str:
    return secrets.token_hex(32)

def gen_referral() -> str:
    chars = string.ascii_uppercase + string.digits
    return ''.join(secrets.choice(chars) for _ in range(8))

def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    path = event.get('path', '/')
    body = json.loads(event.get('body') or '{}')

    if path.endswith('/register'):
        username = body.get('username', '').strip()
        email = body.get('email', '').strip().lower()
        password = body.get('password', '')
        referral_by_code = body.get('referral_code', '').strip().upper()

        if not username or not email or not password:
            return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Заполни все поля'})}
        if len(username) < 3 or len(username) > 32:
            return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Никнейм: 3-32 символа'})}
        if len(password) < 6:
            return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Пароль минимум 6 символов'})}

        conn = get_conn()
        cur = conn.cursor()

        cur.execute("SELECT id FROM users WHERE username = %s OR email = %s", (username, email))
        if cur.fetchone():
            cur.close(); conn.close()
            return {'statusCode': 409, 'headers': CORS, 'body': json.dumps({'error': 'Никнейм или почта уже заняты'})}

        referral_code = gen_referral()
        while True:
            cur.execute("SELECT id FROM users WHERE referral_code = %s", (referral_code,))
            if not cur.fetchone():
                break
            referral_code = gen_referral()

        referred_by = None
        if referral_by_code:
            cur.execute("SELECT id FROM users WHERE referral_code = %s", (referral_by_code,))
            row = cur.fetchone()
            if row:
                referred_by = row[0]

        token = gen_token()
        pwd_hash = hash_password(password)

        cur.execute(
            """INSERT INTO users (username, email, password_hash, referral_code, referred_by, session_token)
               VALUES (%s, %s, %s, %s, %s, %s) RETURNING id""",
            (username, email, pwd_hash, referral_code, referred_by, token)
        )
        user_id = cur.fetchone()[0]

        if referred_by:
            cur.execute("UPDATE users SET friends_invited = friends_invited + 1 WHERE id = %s", (referred_by,))

        cur.execute(
            "SELECT id FROM achievements WHERE code IN ('register', 'register_2')"
        )
        ach_ids = [r[0] for r in cur.fetchall()]
        for aid in ach_ids:
            cur.execute(
                "INSERT INTO user_achievements (user_id, achievement_id) VALUES (%s, %s) ON CONFLICT DO NOTHING",
                (user_id, aid)
            )

        conn.commit()
        cur.close(); conn.close()

        return {
            'statusCode': 200,
            'headers': CORS,
            'body': json.dumps({
                'token': token,
                'user': {
                    'id': user_id,
                    'username': username,
                    'email': email,
                    'rank': 'Новобранец',
                    'score': 0,
                    'referral_code': referral_code,
                }
            })
        }

    if path.endswith('/login'):
        login = body.get('login', '').strip()
        password = body.get('password', '')

        if not login or not password:
            return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'Заполни все поля'})}

        conn = get_conn()
        cur = conn.cursor()

        pwd_hash = hash_password(password)
        cur.execute(
            "SELECT id, username, email, rank, score, referral_code FROM users WHERE (username = %s OR email = %s) AND password_hash = %s",
            (login, login.lower(), pwd_hash)
        )
        row = cur.fetchone()
        if not row:
            cur.close(); conn.close()
            return {'statusCode': 401, 'headers': CORS, 'body': json.dumps({'error': 'Неверный логин или пароль'})}

        user_id, username, email, rank, score, referral_code = row
        token = gen_token()
        cur.execute("UPDATE users SET session_token = %s WHERE id = %s", (token, user_id))
        conn.commit()
        cur.close(); conn.close()

        return {
            'statusCode': 200,
            'headers': CORS,
            'body': json.dumps({
                'token': token,
                'user': {
                    'id': user_id,
                    'username': username,
                    'email': email,
                    'rank': rank,
                    'score': score,
                    'referral_code': referral_code,
                }
            })
        }

    return {'statusCode': 404, 'headers': CORS, 'body': json.dumps({'error': 'Not found'})}
