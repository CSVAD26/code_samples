from google import genai
import config
# Initialize client with your API key
API_KEY = config.GEMINI_API_KEY

client = genai.Client(api_key=API_KEY)

models = client.models.list()

print("Available models:")
for m in models:
    # Safely print whatever attributes exist
    print("-" * 40)
    print("name:", getattr(m, "name", None))
    print("display_name:", getattr(m, "display_name", None))
    print("description:", getattr(m, "description", None))
    print("version:", getattr(m, "version", None))
    print("type:", type(m))
    print("methods:", getattr(m, "supported_generation_methods", None))
    print("raw:", m)
