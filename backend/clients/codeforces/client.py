import requests
from typing import List, Dict

CODEFORCES_API = "https://codeforces.com/api/problemset.problems"

def search_codeforces(tags: list[str]=None) -> List[Dict]:
    # print(semi_sep_tags)
    response = requests.get(
        CODEFORCES_API,
        # params={"tags": tags},
        timeout=15
    )
    # print(response)

    data = response.json()
    problems = data["result"]["problems"]

    results = []

    for p in problems:
        if tags==None:
            results.append({
                "name": p["name"],
                "contestId": p["contestId"],
                "index": p["index"],
                "rating": p.get("rating"),
                "tags": p["tags"]
            })
        else:
            for tag in tags:
                if tag in p["tags"]:
                    results.append({
                        "name": p["name"],
                        "contestId": p["contestId"],
                        "index": p["index"],
                        "rating": p.get("rating"),
                        "tags": p["tags"]
                    })


    return results
