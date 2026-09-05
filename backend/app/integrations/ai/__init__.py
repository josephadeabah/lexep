from functools import lru_cache

from app.core.config import settings
from app.integrations.ai.base import AIMatchProvider
from app.integrations.ai.heuristic import HeuristicMatchProvider
from app.integrations.ai.openai_compatible import OpenAICompatibleMatchProvider
from app.integrations.ai.anthropic_provider import AnthropicMatchProvider


@lru_cache
def get_ai_match_provider() -> AIMatchProvider:
    """Selects the AI matching provider from AI_PROVIDER. Every LLM-backed
    provider already falls back to the heuristic provider internally on any
    error, so this always returns *something* that works even with no keys
    configured — AI_PROVIDER=heuristic (the default) needs zero setup."""
    provider = settings.AI_PROVIDER

    if provider == "deepinfra" and settings.DEEPINFRA_API_KEY:
        return OpenAICompatibleMatchProvider(
            base_url=settings.DEEPINFRA_BASE_URL, api_key=settings.DEEPINFRA_API_KEY, model=settings.DEEPINFRA_MODEL
        )
    if provider == "openai" and settings.OPENAI_API_KEY:
        return OpenAICompatibleMatchProvider(
            base_url="https://api.openai.com/v1", api_key=settings.OPENAI_API_KEY, model=settings.OPENAI_MODEL
        )
    if provider == "anthropic" and settings.ANTHROPIC_API_KEY:
        return AnthropicMatchProvider(api_key=settings.ANTHROPIC_API_KEY, model=settings.ANTHROPIC_MODEL)

    return HeuristicMatchProvider()
