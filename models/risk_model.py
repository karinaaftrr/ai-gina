from services.database import get_db_connection


def get_all_risk_categories():
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT
            id,
            nama,
            skor_min,
            skor_max,
            keterangan
        FROM risk_categories
        ORDER BY skor_min
    """)

    rows = cur.fetchall()

    categories = []

    for row in rows:
        categories.append({
            "id": row[0],
            "nama": row[1],
            "skor_min": row[2],
            "skor_max": row[3],
            "keterangan": row[4]
        })

    cur.close()
    conn.close()

    return categories


def get_risk_category(score):
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT
            id,
            nama,
            skor_min,
            skor_max,
            keterangan
        FROM risk_categories
        WHERE %s BETWEEN skor_min AND skor_max
        LIMIT 1
    """, (score,))

    row = cur.fetchone()

    cur.close()
    conn.close()

    if not row:
        return None

    return {
        "id": row[0],
        "nama": row[1],
        "skor_min": row[2],
        "skor_max": row[3],
        "keterangan": row[4]
    }