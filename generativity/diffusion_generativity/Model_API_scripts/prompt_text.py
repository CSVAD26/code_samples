import requests
import json
import config

API_KEY = config.GEMINI_API_KEY
MODEL = "gemini-2.5-flash"

def query_gemini(prompt):
    """
    Send a prompt to the Gemini API and return the model's text response.
    """
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={API_KEY}"

    headers = {
        "Content-Type": "application/json"
    }

    data = {
        "contents": [
            {"parts": [{"text": prompt}]}
        ]
    }

    response = requests.post(url, headers=headers, data=json.dumps(data))

    if response.status_code != 200:
        raise Exception(f"API Error: {response.status_code} - {response.text}")

    result = response.json()
    return result["candidates"][0]["content"]["parts"][0]["text"]


if __name__ == "__main__":
    user_prompt = "provide svg code for a butterfly. Do not provide any other instructions or text. Just provide the raw svg code."
    reply = query_gemini(user_prompt)
    print("Gemini response:\n")
    print(reply)
