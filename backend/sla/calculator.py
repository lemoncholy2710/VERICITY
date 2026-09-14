def calculate_resolution_score(actual_hours, sla_hours):
    """
    Calculate the resolution-time component of the SLA score.

    Returns a score between 0 and 100.
    """

    if actual_hours < 0:
        raise ValueError("actual_hours cannot be negative")

    if sla_hours <= 0:
        raise ValueError("sla_hours must be greater than 0")

    if actual_hours <= sla_hours:
        return 100.0

    score = (sla_hours / actual_hours) * 100

    return round(max(0.0, score), 2)


def calculate_sla_score(
    resolution_score,
    evidence_quality_score,
    verification_score,
    citizen_confirmation_score
):
    """
    Calculate the overall VERICITY SLA score.

    Weights:
    - Resolution time: 30%
    - Evidence quality: 25%
    - AI verification: 25%
    - Citizen confirmation: 20%
    """

    scores = [
        resolution_score,
        evidence_quality_score,
        verification_score,
        citizen_confirmation_score
    ]

    for score in scores:
        if not 0 <= score <= 100:
            raise ValueError("All scores must be between 0 and 100")

    final_score = (
        resolution_score * 0.30
        + evidence_quality_score * 0.25
        + verification_score * 0.25
        + citizen_confirmation_score * 0.20
    )

    return round(final_score, 2)
