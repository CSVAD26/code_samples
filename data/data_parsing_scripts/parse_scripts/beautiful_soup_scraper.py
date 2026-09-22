import requests
from bs4 import BeautifulSoup

def get_letterboxd_films(username):
    films = []
    page = 1

    while True:
        url = f"https://letterboxd.com/{username}/films/page/{page}/"
        print("Fetching", url)

        r = requests.get(url)
        if r.status_code != 200:
            print("Error:", r.status_code)
            break

        soup = BeautifulSoup(r.text, "html.parser")

        # Film posters live in ul[class="poster-list"]
        poster_list = soup.find("ul", class_="poster-list")
        if not poster_list:
            print("No poster list found; stopping.")
            break

        posters = poster_list.find_all("li")
        if not posters:
            print("No more films on page", page)
            break

        for li in posters:
            film_link = li.find("a", class_="frame")
            if film_link:
                film_slug = film_link.get("data-film-slug")
                if film_slug:
                    films.append(film_slug)

        page += 1

    return films


if __name__ == "__main__":
    username = "punkcowgrl"
    films = get_letterboxd_films(username)
    print(f"\nFound {len(films)} films:")
    for f in films:
        print(f"- {f}")
