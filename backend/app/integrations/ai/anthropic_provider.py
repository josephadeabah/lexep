import json

import httpx

from app.integrations.ai.base import AIMatchProvider, MatchResult
from app.integrations.ai.heuristic import HeuristicMatchProvider
from app.integrations.ai.openai_compatible import PROMPT_TEMPLATE, _parse_json_array

ANTHROPIC_BASE_URL = "https://api.anthropic.com/v1/messages"


class AnthropicMatchProvider(AIMatchProvider):
    """Optional fallback/alternative LLM provider using Anthropic's Messages API."""

    def __init__(self, api_key: str, model: str):
        self.api_key = api_key
        self.model = model

    def rank(self, learner_profile: dict, candidates: list[dict]) -> list[MatchResult]:
        if not self.api_key or not candidates:
            return HeuristicMatchProvider().rank(learner_profile, candidates)

        prompt = PROMPT_TEMPLATE.format(learner=json.dumps(learner_profile), candidates=json.dumps(candidates))
        try:
            with httpx.Client(timeout=20) as client:
                res = client.post(
                    ANTHROPIC_BASE_URL,
                    headers={
                        "x-api-key": self.api_key,
                        "anthropic-version": "2023-06-01",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": self.model,
                        "max_tokens": 1000,
                        "messages": [{"role": "user", "content": prompt}],
                    },
                )
                res.raise_for_status()
                content = res.json()["content"][0]["text"]
            parsed = _parse_json_array(content)
            return [
                MatchResult(candidate_id=int(item["id"]), score=float(item["score"]), reason=str(item.get("reason", "")))
                for item in parsed
            ]
        except Exception:
            return HeuristicMatchProvider().rank(learner_profile, candidates)
