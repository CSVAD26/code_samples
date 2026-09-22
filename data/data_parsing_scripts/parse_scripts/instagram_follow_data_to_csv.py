import csv
from bs4 import BeautifulSoup

def parse_instagram_html(html_path):
    """
    Parse an Instagram HTML file (followers or following) to extract usernames and URLs.
    Returns a dict {username: profile_url or ''}.
    """
    with open(html_path, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f, 'html.parser')

    accounts = {}
    # Instagram export HTML files often contain <a href="https://www.instagram.com/username/">
    for link in soup.find_all('a', href=True):
        href = link['href']
        username = href.strip('/').split('/')[-1]
        if username and not username.startswith('accounts'):
            accounts[username] = href

    return accounts


def compare_follow_data(followers_html, following_html, output_csv):
    """
    Compare Instagram followers and following lists and export a CSV.
    Columns: username, in_followers, in_following, profile_url
    """
    followers = parse_instagram_html(followers_html)
    following = parse_instagram_html(following_html)

    all_usernames = sorted(set(followers.keys()) | set(following.keys()))

    with open(output_csv, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=['username', 'in_followers', 'in_following', 'profile_url'])
        writer.writeheader()

        for username in all_usernames:
            writer.writerow({
                'username': username,
                'in_followers': username in followers,
                'in_following': username in following,
                'profile_url': followers.get(username) or following.get(username) or ''
            })

    print(f"✅ CSV saved to: {output_csv}")
    print(f"Followers: {len(followers)} | Following: {len(following)} | Total unique: {len(all_usernames)}")


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Parse Instagram followers and following HTML files into a CSV.")
    parser.add_argument("followers_html", help="Path to Instagram followers.html file")
    parser.add_argument("following_html", help="Path to Instagram following.html file")
    parser.add_argument("output_csv", help="Path to save the output CSV file")

    args = parser.parse_args()

    compare_follow_data(args.followers_html, args.following_html, args.output_csv)
