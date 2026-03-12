#!/usr/bin/env python3
"""Web Research - Search, research, reasoning, and page scraping.

Sonar models routed via OpenRouter (default) or direct Perplexity, controlled by
SONAR_PROVIDER env var. Scraping uses Firecrawl.

Modes:
  --ask QUERY          Quick AI answer (sonar)
  --search QUERY       Web search via sonar with grounded results
  --research QUERY     AI-synthesized research (sonar-pro)
  --reason QUERY       Chain-of-thought reasoning (sonar-reasoning-pro)
  --deep QUERY         Expert-level exhaustive research (sonar-deep-research)
  --scrape URL         Scrape a URL to markdown/html/text (firecrawl)

Config:
  SONAR_PROVIDER=openrouter|perplexity  (default: openrouter)

Required API keys:
  OPENROUTER_API_KEY=sk-or-xxxx  (when SONAR_PROVIDER=openrouter)
  PERPLEXITY_API_KEY=pplx-xxxx   (when SONAR_PROVIDER=perplexity)
  FIRECRAWL_API_KEY=fc-xxxx      (for --scrape mode)
"""

import argparse
import asyncio
import os
import sys
from pathlib import Path

CLAUDE_DIR = Path.home() / ".claude"
ENV_FILE = CLAUDE_DIR / ".env"
PYPROJECT_FILE = CLAUDE_DIR / "pyproject.toml"


def check_prerequisites():
    """Verify ~/.claude/.env and ~/.claude/pyproject.toml exist."""
    errors = []
    if not PYPROJECT_FILE.exists():
        errors.append(
            f"Missing: {PYPROJECT_FILE}\n"
            f"  This script runs via `uv run --directory ~/.claude` which needs a pyproject.toml.\n"
            f"  Create one with at minimum:\n"
            f"    [project]\n"
            f"    name = \"claude-scripts\"\n"
            f"    version = \"0.1.0\"\n"
            f"    requires-python = \">=3.11\"\n"
            f"    dependencies = [\"aiohttp>=3.9.0\"]"
        )
    if not ENV_FILE.exists():
        errors.append(
            f"Missing: {ENV_FILE}\n"
            f"  Create it with your API keys:\n"
            f"    OPENROUTER_API_KEY=sk-or-your-key-here\n"
            f"    FIRECRAWL_API_KEY=fc-your-key-here"
        )
    if errors:
        print("ERROR: web_research.py prerequisites not met.\n", file=sys.stderr)
        for e in errors:
            print(e, file=sys.stderr)
            print(file=sys.stderr)
        sys.exit(1)


# Provider config
PROVIDERS = {
    "openrouter": {
        "url": "https://openrouter.ai/api/v1/chat/completions",
        "key_env": "OPENROUTER_API_KEY",
        "model_prefix": "perplexity/",
    },
    "perplexity": {
        "url": "https://api.perplexity.ai/chat/completions",
        "key_env": "PERPLEXITY_API_KEY",
        "model_prefix": "",
    },
}
FIRECRAWL_SCRAPE_URL = "https://api.firecrawl.dev/v1/scrape"

MODELS = {
    "sonar": "sonar",
    "sonar-pro": "sonar-pro",
    "sonar-reasoning-pro": "sonar-reasoning-pro",
    "sonar-deep-research": "sonar-deep-research",
}


def load_api_key(key_name: str) -> str:
    """Load API key from environment or ~/.claude/.env."""
    api_key = os.environ.get(key_name, "")
    if not api_key:
        if ENV_FILE.exists():
            with open(ENV_FILE) as f:
                for line in f:
                    line = line.strip()
                    if line.startswith(f"{key_name}="):
                        api_key = line.split("=", 1)[1].strip().strip('"').strip("'")
                        break
    return api_key


def resolve_sonar_provider(model: str) -> tuple[str, str, str]:
    """Return (api_key, base_url, model_id) based on SONAR_PROVIDER config.

    SONAR_PROVIDER=openrouter (default) or perplexity.
    """
    provider_name = os.environ.get("SONAR_PROVIDER", load_api_key("SONAR_PROVIDER") or "openrouter").lower()
    provider = PROVIDERS.get(provider_name)
    if not provider:
        valid = ", ".join(PROVIDERS)
        raise ValueError(f"Invalid SONAR_PROVIDER={provider_name!r}. Must be one of: {valid}")

    api_key = load_api_key(provider["key_env"])
    base_url = provider["url"]
    model_id = f"{provider['model_prefix']}{model}"
    return api_key, base_url, model_id


def parse_args():
    parser = argparse.ArgumentParser(
        description="Web research: search, reason, and scrape",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Sonar models:
  sonar                Lightweight search with grounding
  sonar-pro            Advanced search for complex queries
  sonar-reasoning-pro  Chain of thought reasoning
  sonar-deep-research  Expert-level comprehensive research

Examples:
  %(prog)s --ask "What is MCP?"
  %(prog)s --search "SQLite recursive CTE examples" --recency week
  %(prog)s --research "best practices for AI agent logging 2025"
  %(prog)s --reason "Neo4j vs SQLite for small graph under 10k nodes"
  %(prog)s --deep "comprehensive guide to OpenTelemetry for AI agents"
  %(prog)s --scrape "https://docs.python.org/3/library/asyncio.html"
        """
    )

    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--ask", metavar="QUERY", help="Quick AI answer (sonar)")
    group.add_argument("--search", metavar="QUERY", help="Web search with grounded results (sonar)")
    group.add_argument("--research", metavar="QUERY", help="AI-synthesized research (sonar-pro)")
    group.add_argument("--reason", metavar="QUERY", help="Chain-of-thought reasoning (sonar-reasoning-pro)")
    group.add_argument("--deep", metavar="QUERY", help="Deep comprehensive research (sonar-deep-research)")
    group.add_argument("--scrape", metavar="URL", help="Scrape a URL via Firecrawl")

    # Search options
    parser.add_argument("--max-results", type=int, default=10, help="Max results for --search (1-20, default: 10)")
    parser.add_argument("--recency", choices=["day", "week", "month", "year"], help="Recency filter for --search")
    parser.add_argument("--domains", nargs="+", help="Limit to specific domains for --search")

    # Scrape options
    parser.add_argument("--format", choices=["markdown", "html", "text"], default="markdown",
                        help="Output format for --scrape (default: markdown)")
    parser.add_argument("--full-page", action="store_true", help="Include sidebars/nav (default: main content only)")

    # Model override
    parser.add_argument("--model", choices=list(MODELS.keys()), help="Override Sonar model")

    args_to_parse = [arg for arg in sys.argv[1:] if not arg.endswith(".py")]
    return parser.parse_args(args_to_parse)


# --- Sonar ---

async def sonar_chat(query: str, model: str = "sonar") -> dict:
    import aiohttp

    api_key, base_url, model_id = resolve_sonar_provider(model)
    if not api_key:
        provider_name = os.environ.get("SONAR_PROVIDER", "openrouter").lower()
        key_env = PROVIDERS.get(provider_name, PROVIDERS["openrouter"])["key_env"]
        return {"error": f"{key_env} not found (SONAR_PROVIDER={provider_name})"}

    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    payload = {"model": model_id, "messages": [{"role": "user", "content": query}]}

    # Deep research models can take several minutes to synthesize
    ttl = 600 if "deep" in model else 120

    async with aiohttp.ClientSession() as session:
        async with session.post(base_url, headers=headers, json=payload,
                                timeout=aiohttp.ClientTimeout(total=ttl)) as response:
            if response.status != 200:
                return {"error": f"API error {response.status}: {await response.text()}"}

            result = await response.json()
            answer = ""
            citations = []

            if "choices" in result and result["choices"]:
                choice = result["choices"][0]
                if "message" in choice:
                    answer = choice["message"].get("content", "")

            if "citations" in result:
                citations = result["citations"]

            return {
                "answer": answer,
                "citations": citations,
                "model": result.get("model", model),
                "usage": result.get("usage", {}),
            }


# --- Firecrawl ---

async def firecrawl_scrape(url: str, formats: list[str], main_only: bool = True) -> dict:
    import aiohttp

    api_key = load_api_key("FIRECRAWL_API_KEY")
    if not api_key:
        return {"error": "FIRECRAWL_API_KEY not found in environment or ~/.claude/.env"}

    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    payload = {"url": url, "formats": formats, "onlyMainContent": main_only}

    async with aiohttp.ClientSession() as session:
        async with session.post(FIRECRAWL_SCRAPE_URL, headers=headers, json=payload,
                                timeout=aiohttp.ClientTimeout(total=60)) as response:
            if response.status != 200:
                return {"error": f"API error {response.status}: {await response.text()}"}

            result = await response.json()
            if result.get("success") and result.get("data"):
                data = result["data"]
                return {
                    "success": True,
                    "markdown": data.get("markdown", ""),
                    "html": data.get("html", ""),
                    "metadata": data.get("metadata", {}),
                    "links": data.get("links", []),
                }
            return {"error": result.get("error", "Unknown error")}


# --- Output helpers ---

def print_error(msg: str):
    print(f"\nError: {msg}", file=sys.stderr)
    sys.exit(1)


def print_chat_result(result: dict, mode: str, model: str):
    print(f"\n{mode} complete (model: {result.get('model', model)})\n")

    if result.get("answer"):
        print(result["answer"])

    if result.get("citations"):
        print("\nSources:")
        for i, cite in enumerate(result["citations"][:10], 1):
            if isinstance(cite, dict):
                url = cite.get("url", cite.get("title", str(cite)))
                print(f"  {i}. {url}")
            else:
                print(f"  {i}. {cite}")

    if result.get("usage"):
        tokens = result["usage"].get("total_tokens", 0)
        if tokens:
            print(f"\nTokens: {tokens}")


def print_scrape_result(result: dict, fmt: str):
    if fmt == "html" and result.get("html"):
        print(result["html"])
    elif result.get("markdown"):
        print(result["markdown"])

    meta = result.get("metadata", {})
    if meta.get("title"):
        print(f"\nTitle: {meta['title']}")
    if meta.get("description"):
        print(f"Description: {meta['description'][:200]}...")


# --- Main ---

async def main():
    check_prerequisites()
    args = parse_args()

    # Scrape mode (firecrawl)
    if args.scrape:
        print(f"Scraping: {args.scrape}")
        result = await firecrawl_scrape(
            url=args.scrape,
            formats=[args.format],
            main_only=not args.full_page,
        )
        if result.get("error"):
            print_error(result["error"])
        print_scrape_result(result, args.format)
        return

    # Search mode — uses sonar chat (grounded web results with citations)
    if args.search:
        query = args.search
        model = args.model or "sonar"
        mode = "Search"
        # Build a search-oriented prompt
        search_prompt = f"Provide a comprehensive web search summary for: {query}"
        if args.recency:
            search_prompt += f" (focus on results from the last {args.recency})"
        if args.domains:
            search_prompt += f" (prefer sources from: {', '.join(args.domains)})"

        print(f"Searching ({model}): {query}")
        result = await sonar_chat(search_prompt, model)
        if result.get("error"):
            print_error(result["error"])
        print_chat_result(result, mode, model)
        return

    # Chat/AI modes
    if args.ask:
        query, model, mode = args.ask, args.model or "sonar", "Ask"
    elif args.research:
        query, model, mode = args.research, args.model or "sonar-pro", "Research"
    elif args.reason:
        query, model, mode = args.reason, args.model or "sonar-reasoning-pro", "Reason"
    elif args.deep:
        query, model, mode = args.deep, args.model or "sonar-deep-research", "Deep Research"
        print("  (This may take a minute...)")

    print(f"{mode} ({model}): {query}")
    result = await sonar_chat(query, model)
    if result.get("error"):
        print_error(result["error"])
    print_chat_result(result, mode, model)


if __name__ == "__main__":
    asyncio.run(main())
