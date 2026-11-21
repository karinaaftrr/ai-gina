from flask import render_template
from models.source_model import get_all_sources


def rekomendasi():
    sources = get_all_sources()
    return render_template(
        "rekomendasi.html",
        sources=sources
    )