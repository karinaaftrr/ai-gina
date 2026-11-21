from flask import render_template, redirect, url_for
from models.mission_model import get_all_missions, get_mission_by_id

def belajar():
    missions = get_all_missions()

    return render_template(
        "belajar.html",
        missions=missions
    )


def misi(misi_id):
    mission = get_mission_by_id(misi_id)

    if not mission:
        return redirect(url_for("belajar"))

    missions = get_all_missions()

    return render_template(
        "misi.html",
        mission=mission,
        total_missions=len(missions)
    )