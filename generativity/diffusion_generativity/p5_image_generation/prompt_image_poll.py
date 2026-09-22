#!/usr/bin/env python3
import requests
import urllib.parse
import argparse
import os

def generate_pollinations_image(prompt: str, filename: str = "pollinations.png"):
    # --- Convert filename to absolute path ---
    filename = os.path.abspath(filename)

    # --- Ensure the output directory exists ---
    output_dir = os.path.dirname(filename)
    if output_dir:
        os.makedirs(output_dir, exist_ok=True)

    encoded_prompt = urllib.parse.quote(prompt)
    url = f"https://image.pollinations.ai/prompt/{encoded_prompt}"

    print(f"\n🔮 Generating image from prompt:\n  {prompt}\n")
    print("Requesting:", url)

    response = requests.get(url, timeout=60)

    if response.status_code != 200:
        print("❌ Error:", response.status_code, response.text)
        return

    # --- Write file safely ---
    with open(filename, "wb") as f:
        f.write(response.content)

    print(f"\n✅ Image saved as: {filename}\n")


def main():
    parser = argparse.ArgumentParser(
        description="Generate an image from Pollinations.ai using a text prompt."
    )

    parser.add_argument(
        "prompt",
        type=str,
        help="The text prompt describing the desired image."
    )

    parser.add_argument(
        "filename",
        type=str,
        nargs="?",
        default="pollinations.png",
        help="Output filename (default: pollinations.png)"
    )

    args = parser.parse_args()

    generate_pollinations_image(args.prompt, args.filename)


if __name__ == "__main__":
    main()
