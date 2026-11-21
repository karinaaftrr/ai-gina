import psycopg2

DB_CONFIG = {
    "host": "127.0.0.1",
    "port": 5432,
    "database": "ai_gina",
    "user": "Administrator",
    "password": ""
}


def get_db_connection():
    return psycopg2.connect(**DB_CONFIG)