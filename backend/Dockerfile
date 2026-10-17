FROM ghcr.io/astral-sh/uv:python3.14-bookworm-slim

WORKDIR /app

ENV UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy

COPY pyproject.toml uv.lock .python-version ./
RUN uv sync --frozen --no-install-project

COPY . .

EXPOSE 8000

# `uv run --exact` syncs the .venv volume with uv.lock on start (adding and
# removing packages), so `docker compose up --build` is enough after a dependency change.
CMD ["uv", "run", "--exact", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
