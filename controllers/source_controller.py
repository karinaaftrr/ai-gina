from flask import render_template
from models.source_model import get_all_sources


def sumber():
    sources = get_all_sources()
    return render_template("sumber.html", sources=sources)