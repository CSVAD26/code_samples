from google import genai
import config
# Initialize client with your API key
API_KEY = config.GEMINI_API_KEY
client = genai.Client(api_key=API_KEY)

# Set your prompt
prompt = "A futuristic cityscape at sunset in watercolor style"

# Call the image model
result = client.models.generate_images(
    model="gemini-2.0-flash-preview-image-generation",
    prompt=prompt
)

# Extract the first image's bytes
image_bytes = result.images[0].data

# Save to disk
output_path = "generated_image.png"
with open(output_path, "wb") as f:
    f.write(image_bytes)

print(f"Image saved as {output_path}")

