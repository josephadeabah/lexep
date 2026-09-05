import json

import httpx

from app.integrations.ai.base import AIMatchProvider, MatchResult
from app.integrations.ai.heuristic import HeuristicMatchProvider

PROMPT_TEMPLATE = """You are a matching engine for Lexep, a platform connecting African youth with mentors and internships.

Learner profile:
{learner}

Candidates (JSON array, each with an "id"):
{candidates}

Rank the candidates by fit for this learner. Respond with ONLY a JSON array,
no prose, no markdown fences, in this exact shape:
[{{"id": <candidate id>, "score": <0-100 number>, "reason": "<one short sentence>"}}, ...]
Include every candidate id exactly once, best match first."""


class OpenAICompatibleMatchProvider(AIMatchProvider):
    """Works against any OpenAI-compatible chat completions endpoint —
    used for both `AI_PROVIDER=openai` (api.openai.com) and
    `AI_PROVIDER=deepinfra` (DeepInfra's OpenAI-compatible endpoint,
    serving free/cheap open models like Qwen and DeepSeek)."""

    def __init__(self, base_url: str, api_key: str, model: str):
        self.base_url = base_url.rstrip("/")
        self.api_key = api_key
        self.model = model

    def rank(self, learner_profile: dict, candidates: list[dict]) -> list[MatchResult]:
        if not self.api_key or not candidates:
            return HeuristicMatchProvider().rank(learner_profile, candidates)

        prompt = PROMPT_TEMPLATE.format(
            learner=json.dumps(learner_profile), candidates=json.dumps(candidates)
        )
        try:
            with httpx.Client(timeout=20) as client:
                res = client.post(
                    f"{self.base_url}/chat/completions",
                    headers={"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"},
                    json={
                        "model": self.model,
                        "messages": [{"role": "user", "content": prompt}],
                        "temperature": 0.2,
                        "max_tokens": 1000,
                    },
                )
                res.raise_for_status()
                content = res.json()["choices"][0]["message"]["content"]
            parsed = _parse_json_array(content)
            return [
                MatchResult(candidate_id=int(item["id"]), score=float(item["score"]), reason=str(item.get("reason", "")))
                for item in parsed
            ]
        except Exception:
            # Any failure (network, bad key, parse error) — fall back rather
            # than break the page. This is the safety net for every LLM
            # provider, not just this one.
            return HeuristicMatchProvider().rank(learner_profile, candidates)


def _parse_json_array(content: str) -> list[dict]:
    content = content.strip()
    if content.startswith("```"):
        content = content.strip("`")
        if content.startswith("json"):
            content = content[4:]
    return json.loads(content)
