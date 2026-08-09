import os
from typing import List

import openai
from openai.error import OpenAIError
from app.core.config import settings


def get_openai_api_key() -> str:
    api_key = settings.openai_api_key or os.getenv('OPENAI_API_KEY')
    if not api_key:
        raise ValueError('Missing OPENAI_API_KEY environment variable')
    return api_key


class EmbeddingService:
    def __init__(self, api_key: str = None):
        self.api_key = api_key or get_openai_api_key()
        openai.api_key = self.api_key

    def create_embeddings(self, texts: List[str]) -> List[List[float]]:
        try:
            response = openai.Embedding.create(
                input=texts,
                model='text-embedding-3-small',
            )
            return [item.embedding for item in response.data]
        except OpenAIError as exc:
            raise RuntimeError(f'OpenAI embedding error: {exc}')
        except Exception as exc:
            raise RuntimeError(f'Embedding request failed: {exc}')
