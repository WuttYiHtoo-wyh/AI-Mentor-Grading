import json
import urllib.request
import urllib.error

url = 'http://127.0.0.1:8000/api/chat'
data = json.dumps({
    'message': 'What is the course about?',
    'course_id': 'fdad-fed',
    'conversation_id': None,
}).encode('utf-8')
req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})

try:
    with urllib.request.urlopen(req, timeout=60) as resp:
        body = resp.read().decode('utf-8')
        print('STATUS', resp.status)
        print(body)
except urllib.error.HTTPError as e:
    print('HTTP ERROR', e.code)
    print(e.read().decode('utf-8'))
except Exception as e:
    print('EXCEPTION', e)
