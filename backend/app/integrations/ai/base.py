from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class MatchResult:
    candidate_id: int
    score: float  # 0-100
    reason: str


class AIMatchProvider(ABC):
    """Ranks a list of candidates (mentors or opportunities) against a
    learner's profile. Implementations receive plain dicts (not ORM models)
    so they stay decoupled from the database layer — see
    routers/mentors.py::recommended_mentors and
    routers/opportunities.py::recommended_opportunities for how the dicts
    are built."""

    @abstractmethod
    def rank(self, learner_profile: dict, candidates: list[dict]) -> list[MatchResult]: ...
