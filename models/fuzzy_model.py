import numpy as np
import skfuzzy as fuzz
from skfuzzy import control as ctrl


def calculate_fuzzy_risk(score):
    score = float(max(0, min(100, score)))

    input_score = ctrl.Antecedent(
        np.arange(0, 101, 1),
        "score"
    )

    output_risk = ctrl.Consequent(
        np.arange(0, 101, 1),
        "risk"
    )

    input_score["rendah"] = fuzz.trapmf(
        input_score.universe,
        [0, 0, 30, 45]
    )

    input_score["sedang"] = fuzz.trimf(
        input_score.universe,
        [35, 50, 65]
    )

    input_score["tinggi"] = fuzz.trapmf(
        input_score.universe,
        [55, 70, 100, 100]
    )

    output_risk["rendah"] = fuzz.trapmf(
        output_risk.universe,
        [0, 0, 30, 45]
    )

    output_risk["sedang"] = fuzz.trimf(
        output_risk.universe,
        [35, 50, 65]
    )

    output_risk["tinggi"] = fuzz.trapmf(
        output_risk.universe,
        [55, 70, 100, 100]
    )

    rules = [
        ctrl.Rule(
            input_score["rendah"],
            output_risk["rendah"]
        ),
        ctrl.Rule(
            input_score["sedang"],
            output_risk["sedang"]
        ),
        ctrl.Rule(
            input_score["tinggi"],
            output_risk["tinggi"]
        )
    ]

    system = ctrl.ControlSystem(rules)

    simulation = ctrl.ControlSystemSimulation(system)

    simulation.input["score"] = score

    simulation.compute()

    fuzzy_score = round(
        float(simulation.output["risk"]),
        2
    )

    memberships = {
        "rendah": round(
            fuzz.interp_membership(
                input_score.universe,
                input_score["rendah"].mf,
                score
            ),
            3
        ),
        "sedang": round(
            fuzz.interp_membership(
                input_score.universe,
                input_score["sedang"].mf,
                score
            ),
            3
        ),
        "tinggi": round(
            fuzz.interp_membership(
                input_score.universe,
                input_score["tinggi"].mf,
                score
            ),
            3
        )
    }

    if fuzzy_score < 40:
        category = "Rendah"
    elif fuzzy_score < 60:
        category = "Sedang"
    else:
        category = "Tinggi"

    return {
        "score": fuzzy_score,
        "category": category,
        "memberships": memberships
    }