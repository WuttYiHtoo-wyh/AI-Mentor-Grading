import os
os.chdir(r'D:\AIMentor_Grading\backend')
from app.core.config import settings
print('OPENAI_KEY_SET', settings.openai_api_key is not None)
print('OPENAI_KEY', settings.openai_api_key[:10] if settings.openai_api_key else None)
print('.env exists', os.path.exists('.env'))
print('ENV CONTENT', open('.env').read().strip().splitlines())
