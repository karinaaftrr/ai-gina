from services.database import get_db_connection

def get_all_missions():
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT
            id,
            number,
            title,
            tagline,
            badge_id,
            badge_name,
            badge_icon,
            badge_desc,
            focus,
            briefing,
            activity_type,
            fun_fact,
            next_mission
        FROM missions
        ORDER BY id
    """)

    rows = cur.fetchall()

    missions = {}

    for row in rows:
        missions[row[0]] = {
            "id": row[0],
            "number": row[1],
            "title": row[2],
            "tagline": row[3],
            "badge_id": row[4],
            "badge_name": row[5],
            "badge_icon": row[6],
            "badge_desc": row[7],
            "focus": row[8],
            "briefing": row[9],
            "activity_type": row[10],
            "fun_fact": row[11],
            "next_mission": row[12],
            "targets": [],
            "materials": [],
            "summary": [],
            "challenge": None
        }

    cur.execute("""
        SELECT mission_id, target
        FROM mission_targets
        ORDER BY mission_id, urutan
    """)

    for mission_id, target in cur.fetchall():
        if mission_id in missions:
            missions[mission_id]["targets"].append(target)

    cur.execute("""
        SELECT mission_id, title, description
        FROM mission_materials
        ORDER BY mission_id, urutan
    """)

    for mission_id, title, description in cur.fetchall():
        if mission_id in missions:
            missions[mission_id]["materials"].append({
                "title": title,
                "desc": description
            })

    cur.execute("""
        SELECT mission_id, summary
        FROM mission_summaries
        ORDER BY mission_id, urutan
    """)

    for mission_id, summary in cur.fetchall():
        if mission_id in missions:
            missions[mission_id]["summary"].append(summary)

    cur.execute("""
        SELECT id, mission_id, question, explanation
        FROM mission_challenges
        ORDER BY mission_id
    """)

    for challenge_id, mission_id, question, explanation in cur.fetchall():
        if mission_id in missions:
            missions[mission_id]["challenge"] = {
                "question": question,
                "options": [],
                "correct": None,
                "explanation": explanation
            }

            cur.execute("""
                SELECT urutan, option_text, is_correct
                FROM challenge_options
                WHERE challenge_id = %s
                ORDER BY urutan
            """, (challenge_id,))

            for urutan, option_text, is_correct in cur.fetchall():
                missions[mission_id]["challenge"]["options"].append(option_text)

                if is_correct:
                    missions[mission_id]["challenge"]["correct"] = urutan - 1

    cur.close()
    conn.close()

    return missions


def get_mission_by_id(mission_id):
    missions = get_all_missions()
    return missions.get(mission_id)