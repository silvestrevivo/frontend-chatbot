from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import APIError

from chatbot.client import ask, create_client
from chatbot.schemas import ChatRequest, ChatResponse, Usage
from chatbot.usage import TokenUsage

app = FastAPI(title="Chatbot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = create_client()


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/chat")
def chat(request: ChatRequest) -> ChatResponse:
    try:
        response = ask(client, request.message, request.previous_response_id)
    except APIError as error:
        raise HTTPException(status_code=502, detail=f"OpenAI error: {error.message}")

    usage = TokenUsage.from_response(response)
    return ChatResponse(
        answer=response.output_text,
        response_id=response.id,
        usage=Usage(
            input_tokens=usage.input_tokens,
            cached_tokens=usage.cached_tokens,
            output_tokens=usage.output_tokens,
            cost=usage.cost,
        ),
    )
