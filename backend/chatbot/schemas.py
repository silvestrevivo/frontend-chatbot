from pydantic import BaseModel, ConfigDict, Field


class ChatRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    message: str = Field(min_length=1)
    previous_response_id: str | None = None


class Usage(BaseModel):
    input_tokens: int
    cached_tokens: int
    output_tokens: int
    cost: float


class ChatResponse(BaseModel):
    answer: str
    response_id: str
    usage: Usage
