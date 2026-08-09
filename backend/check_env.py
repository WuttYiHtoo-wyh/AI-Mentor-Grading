from pathlib import Path

from app.core.config import settings


backend_dir = Path(__file__).resolve().parent

print('OPENAI_KEY_SET', settings.openai_api_key is not None)
print('CORS_ALLOWED_ORIGINS_SET', bool(settings.allowed_origins))
print('BACKEND_DIR', backend_dir)
