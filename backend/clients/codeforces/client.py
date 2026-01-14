import requests
from typing import List, Dict

CODEFORCES_API = "https://codeforces.com/api/problemset.problems"


def search_codeforces(topic: str) -> List[Dict]:
    response = requests.get(
        CODEFORCES_API,
        params={"tags": topic.lower()},
        timeout=15
    )

    data = response.json()
    problems = data["result"]["problems"]

    results = []

    for p in problems:
        results.append({
            "name": p["name"],
            "contestId": p["contestId"],
            "index": p["index"],
            "rating": p.get("rating"),
            "tags": p["tags"]
        })

    return results
