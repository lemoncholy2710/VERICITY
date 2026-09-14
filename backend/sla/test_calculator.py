from backend.sla.calculator import (
    calculate_resolution_score,
    calculate_sla_score
)


def test_resolution_within_sla():
    assert calculate_resolution_score(24, 48) == 100.0


def test_resolution_at_sla_limit():
    assert calculate_resolution_score(48, 48) == 100.0


def test_resolution_after_sla():
    assert calculate_resolution_score(72, 48) == 66.67


def test_perfect_sla_score():
    assert calculate_sla_score(100, 100, 100, 100) == 100.0


def test_combined_sla_score():
    assert calculate_sla_score(80, 90, 85, 100) == 87.75