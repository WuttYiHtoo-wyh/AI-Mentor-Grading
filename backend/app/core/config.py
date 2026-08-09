from typing import Optional
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "AI Mentor Backend"
    frontend_url: str = "http://localhost:5173"
    openai_api_key: Optional[str] = None

    class Config:
        env_file = ".env"


settings = Settings()
