from services.database import get_db_connection


def get_all_sources():
    connection = get_db_connection()

    try:
        cursor = connection.cursor()

        cursor.execute("""
            SELECT
                id,
                judul,
                sumber,
                ringkasan,
                url,
                tanggal_publikasi,
                tanggal_diambil
            FROM sources
            ORDER BY id ASC
        """)

        rows = cursor.fetchall()

        sources = []

        for row in rows:
            sources.append({
                "id": row[0],
                "judul": row[1],
                "sumber": row[2],
                "ringkasan": row[3],
                "url": row[4],
                "tanggal_publikasi": row[5],
                "tanggal_diambil": row[6]
            })

        return sources

    finally:
        cursor.close()
        connection.close()