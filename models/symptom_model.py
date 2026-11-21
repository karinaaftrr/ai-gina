from services.database import get_db_connection

def get_all_symptoms():
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT
            id,
            kode,
            pertanyaan,
            sumber,
            url_sumber
        FROM symptoms
        ORDER BY id
    """)

    rows = cur.fetchall()

    symptoms = []

    for row in rows:
        symptom = {
            "id": row[0],
            "kode": row[1],
            "pertanyaan": row[2],
            "sumber": row[3],
            "url_sumber": row[4],
            "options": []
        }

        cur.execute("""
            SELECT
                id,
                pilihan,
                teks,
                skor
            FROM symptom_options
            WHERE symptom_id = %s
            ORDER BY pilihan
        """, (row[0],))

        for option in cur.fetchall():
            symptom["options"].append({
                "id": option[0],
                "pilihan": option[1],
                "teks": option[2],
                "skor": option[3]
            })

        symptoms.append(symptom)

    cur.close()
    conn.close()

    return symptoms


def get_symptom_by_id(symptom_id):
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT
            id,
            kode,
            pertanyaan,
            sumber,
            url_sumber
        FROM symptoms
        WHERE id = %s
    """, (symptom_id,))

    row = cur.fetchone()

    if not row:
        cur.close()
        conn.close()
        return None

    symptom = {
        "id": row[0],
        "kode": row[1],
        "pertanyaan": row[2],
        "sumber": row[3],
        "url_sumber": row[4],
        "options": []
    }

    cur.execute("""
        SELECT
            id,
            pilihan,
            teks,
            skor
        FROM symptom_options
        WHERE symptom_id = %s
        ORDER BY pilihan
    """, (symptom_id,))

    for option in cur.fetchall():
        symptom["options"].append({
            "id": option[0],
            "pilihan": option[1],
            "teks": option[2],
            "skor": option[3]
        })

    cur.close()
    conn.close()

    return symptom


def get_symptom_by_code(kode):
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT
            id,
            kode,
            pertanyaan,
            sumber,
            url_sumber
        FROM symptoms
        WHERE kode = %s
    """, (kode,))

    row = cur.fetchone()

    if not row:
        cur.close()
        conn.close()
        return None

    symptom = {
        "id": row[0],
        "kode": row[1],
        "pertanyaan": row[2],
        "sumber": row[3],
        "url_sumber": row[4],
        "options": []
    }

    cur.execute("""
        SELECT
            id,
            pilihan,
            teks,
            skor
        FROM symptom_options
        WHERE symptom_id = %s
        ORDER BY pilihan
    """, (row[0],))

    for option in cur.fetchall():
        symptom["options"].append({
            "id": option[0],
            "pilihan": option[1],
            "teks": option[2],
            "skor": option[3]
        })

    cur.close()
    conn.close()

    return symptom