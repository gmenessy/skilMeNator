from pydantic_settings import BaseSettings
from typing import Optional, Dict

class Settings(BaseSettings):
    app_name: str = "ChatOrchestrator Backend"

    # Provider 1 (e.g., OpenAI, or an OpenAI-compatible endpoint)
    provider1_url: str = "https://api.openai.com/v1"
    provider1_key: str = ""
    provider1_model: str = "gpt-4-turbo-preview"

    # Provider 2 (e.g., Another OpenAI-compatible endpoint, like LocalAI, vLLM, etc.)
    provider2_url: str = "http://localhost:8000/v1"
    provider2_key: str = "sk-mock-key"
    provider2_model: str = "llama-3-70b-instruct"

    # HTTP Proxy settings
    http_proxy: Optional[str] = None
    https_proxy: Optional[str] = None

    class Config:
        env_file = ".env"

settings = Settings()
