from app.services.llm_service import LLMService

service = LLMService()
print('API key loaded:', bool(service.api_key))
try:
    resp = service.generate_chat_response('What is the course about?', conversation_id=None)
    print(resp)
except Exception as e:
    print(type(e).__name__, str(e))
    import traceback
    traceback.print_exc()
