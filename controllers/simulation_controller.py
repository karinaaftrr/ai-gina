from flask import render_template, request, jsonify
from models.symptom_model import get_all_symptoms
from models.fuzzy_model import calculate_fuzzy_risk


def simulasi():
    symptoms = get_all_symptoms()

    return render_template(
        "simulasi.html",
        symptoms=symptoms
    )


def hasil():
    if request.method == "POST":
        data = request.get_json(silent=True) or {}
        answers = data.get("answers", [])

        if not isinstance(answers, list) or len(answers) != 5:
            return jsonify({
                "success": False,
                "message": "Data jawaban simulasi tidak lengkap."
            }), 400

        try:
            scores = [float(value) for value in answers]
        except (TypeError, ValueError):
            return jsonify({
                "success": False,
                "message": "Data jawaban simulasi tidak valid."
            }), 400

        if any(score < 5 or score > 35 for score in scores):
            return jsonify({
                "success": False,
                "message": "Nilai jawaban berada di luar rentang."
            }), 400

        total_raw = sum(scores)

        normalized_score = round(
            ((total_raw - 25) / 145) * 100
        )

        normalized_score = max(
            0,
            min(100, normalized_score)
        )

        result = calculate_fuzzy_risk(
            normalized_score
        )

        return jsonify({
            "success": True,
            "redirect": "/hasil?skor={}&kategori={}".format(
                result["score"],
                result["category"]
            )
        })

    score = request.args.get(
        "skor",
        default=0,
        type=float
    )

    result = calculate_fuzzy_risk(score)

    return render_template(
        "hasil.html",
        score=result["score"],
        category=result["category"],
        memberships=result["memberships"]
    )