import requests
from bs4 import BeautifulSoup
from datetime import datetime
import psycopg2

DB_CONFIG = {
    "host": "127.0.0.1",
    "port": 5432,
    "database": "ai_gina",
    "user": "Administrator",
    "password": ""
}

SOURCES = [
    {
        "sumber": "Kementerian Kesehatan RI",
        "url": "https://ayosehat.kemkes.go.id/topik-penyakit/kesehatan-lainnya/gagal-ginjal-pada-anak"
    },
    {
        "sumber": "Kementerian Kesehatan RI",
        "url": "https://ayosehat.kemkes.go.id/topik-penyakit/diabetes-penyakit-ginjal/penyakit-ginjal"
    },
    {
        "sumber": "WHO",
        "url": "https://www.who.int/publications/i/item/WPR-2016-DNH-008"
    },
    {
        "sumber": "IDAI",
        "url": "https://www.idai.or.id/artikel/seputar-kesehatan-anak/infeksi-saluran-kemih-pada-anak-2"
    }
]

HEADERS = {
    "User-Agent": "AI-GINA Educational Research Bot/1.0"
}


def get_connection():
    return psycopg2.connect(**DB_CONFIG)


def clean_text(text):
    return " ".join(text.split())


def scrape_page(source):
    try:
        response = requests.get(
            source["url"],
            headers=HEADERS,
            timeout=15
        )

        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")

        title = ""

        if soup.find("meta", property="og:title"):
            title = soup.find(
                "meta",
                property="og:title"
            ).get("content", "").strip()

        if not title and soup.title:
            title = soup.title.get_text(strip=True)

        description = ""

        meta_description = soup.find(
            "meta",
            attrs={"name": "description"}
        )

        if meta_description:
            description = meta_description.get("content", "").strip()

        if not description:
            paragraphs = soup.find_all("p")
            texts = []

            for paragraph in paragraphs:
                text = clean_text(paragraph.get_text(" ", strip=True))

                if len(text) > 80:
                    texts.append(text)

                if len(" ".join(texts)) > 500:
                    break

            description = " ".join(texts)[:500]

        publication_date = None

        meta_date = (
            soup.find("meta", property="article:published_time")
            or soup.find("meta", attrs={"name": "date"})
            or soup.find("meta", attrs={"name": "publishdate"})
        )

        if meta_date:
            date_value = meta_date.get("content")

            if date_value:
                try:
                    publication_date = datetime.fromisoformat(
                        date_value.replace("Z", "+00:00")
                    ).date()
                except ValueError:
                    publication_date = None

        return {
            "judul": title,
            "sumber": source["sumber"],
            "ringkasan": description,
            "url": source["url"],
            "tanggal_publikasi": publication_date
        }

    except requests.RequestException as error:
        print(f"Gagal mengambil {source['url']}")
        print(error)
        return None


def save_source(data):
    connection = get_connection()

    try:
        cursor = connection.cursor()

        query = """
            INSERT INTO sources (
                judul,
                sumber,
                ringkasan,
                url,
                tanggal_publikasi
            )
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT (url)
            DO UPDATE SET
                judul = EXCLUDED.judul,
                sumber = EXCLUDED.sumber,
                ringkasan = EXCLUDED.ringkasan,
                tanggal_publikasi = EXCLUDED.tanggal_publikasi,
                tanggal_diambil = CURRENT_TIMESTAMP
        """

        cursor.execute(
            query,
            (
                data["judul"],
                data["sumber"],
                data["ringkasan"],
                data["url"],
                data["tanggal_publikasi"]
            )
        )

        connection.commit()

        print(f"Berhasil disimpan: {data['judul']}")

    finally:
        cursor.close()
        connection.close()


def main():
    print("Memulai proses scraping sumber resmi AI GINA...")
    print()

    for source in SOURCES:
        print(f"Mengambil data: {source['url']}")

        data = scrape_page(source)

        if data:
            save_source(data)

        print()

    print("Proses scraping selesai.")


if __name__ == "__main__":
    main()