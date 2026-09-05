from app.integrations.ai.base import AIMatchProvider, MatchResult


def _tokenize(*values: str | list[str] | None) -> set[str]:
    tokens: set[str] = set()
    for v in values:
        if not v:
            continue
        items = v if isinstance(v, list) else [v]
        for item in items:
            tokens |= {w.strip().lower() for w in str(item).replace("/", " ").split() if len(w.strip()) > 2}
    return tokens


class HeuristicMatchProvider(AIMatchProvider):
    """Keyword/skill-overlap scoring. No API key required — this is the
    default provider (AI_PROVIDER=heuristic) and the automatic fallback if
    an LLM-backed provider errors out. Not a trained ML model; a
    transparent, zero-dependency starting point that a real model can
    later replace behind the same AIMatchProvider interface."""

    def rank(self, learner_profile: dict, candidates: list[dict]) -> list[MatchResult]:
        learner_tokens = _tokenize(
            learner_profile.get("career_interests"),
            learner_profile.get("goals"),
            learner_profile.get("field_of_study"),
        )

        results = []
        for c in candidates:
            candidate_tokens = _tokenize(c.get("skills"), c.get("category"), c.get("title"), c.get("required_skills"))
            overlap = learner_tokens & candidate_tokens
            union = learner_tokens | candidate_tokens
            score = round((len(overlap) / len(union)) * 100, 1) if union else 0.0
            # Small baseline so results still order sensibly with zero overlap.
            score = max(score, 5.0)
            reason = (
                f"Shares {len(overlap)} interest area(s): {', '.join(sorted(overlap)[:3])}"
                if overlap
                else "General match based on your profile."
            )
            results.append(MatchResult(candidate_id=c["id"], score=score, reason=reason))

        return sorted(results, key=lambda r: r.score, reverse=True)
