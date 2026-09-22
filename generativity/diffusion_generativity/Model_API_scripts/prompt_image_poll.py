#!/usr/bin/env python3
import requests
import urllib.parse
import argparse

def generate_pollinations_image(prompt, filename):
    # ensure directory exists
    os.makedirs(os.path.dirname(filename), exist_ok=True)

    url = f"https://image.pollinations.ai/prompt/{prompt}"
    response = requests.get(url)

    response.raise_for_status()

    # Now safe to write
    with open(filename, "wb") as f:
        f.write(response.content)


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
