from flask import Flask
from controllers.home_controller import index
from controllers.learning_controller import belajar, misi
from controllers.simulation_controller import simulasi, hasil
from controllers.recommendation_controller import rekomendasi
from controllers.teacher_controller import guru
from controllers.source_controller import sumber

app = Flask(__name__)

app.add_url_rule("/", "index", index)
app.add_url_rule("/belajar", "belajar", belajar)
app.add_url_rule("/petualangan", "belajar", belajar)
app.add_url_rule("/misi/<int:misi_id>", "misi", misi)
app.add_url_rule("/simulasi", "simulasi", simulasi)
app.add_url_rule("/hasil", "hasil", hasil, methods=["GET", "POST"])
app.add_url_rule("/rekomendasi", "rekomendasi", rekomendasi)
app.add_url_rule("/guru", "guru", guru)
app.add_url_rule("/sumber", "sumber", sumber)

if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )