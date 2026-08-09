from typing import List, Optional
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "AI Mentor Backend"
    cors_allowed_origins: str = "http://localhost:5173,http://127.0.0.1:5173"
    openai_api_key: Optional[str] = None

    @property
    def allowed_origins(self) -> List[str]:
        return [
            origin.strip()
            for origin in self.cors_allowed_origins.split(",")
            if origin.strip()
        ]

    class Config:
        env_file = ".env"


settings = Settings()
