import requests
from typing import List, Dict

CODEFORCES_API = "https://codeforces.com/api/problemset.problems"

def search_codeforces(tags: list[str]=None) -> List[Dict]:
    try:
        response = requests.get(
            CODEFORCES_API,
            timeout=15
        )
        if response.status_code != 200:
            return []
            
        data = response.json()
        if data.get("status") != "OK":
            return []
            
        problems = data.get("result", {}).get("problems", [])
        results = []

        for p in problems:
            contest_id = p.get("contestId")
            index = p.get("index")
            if not contest_id or not index:
                continue
            p_tags = p.get("tags", [])
            if tags is None or len(tags) == 0:
                results.append({
                    "name": p.get("name", ""),
                    "contestId": contest_id,
                    "index": index,
                    "rating": p.get("rating"),
                    "tags": p_tags
                })
            else:
                for tag in tags:
                    if tag in p_tags:
                        results.append({
                            "name": p.get("name", ""),
                            "contestId": contest_id,
                            "index": index,
                            "rating": p.get("rating"),
                            "tags": p_tags
                        })
                        break

        return results
    except Exception as e:
        print("Error fetching Codeforces problems:", str(e))
        return []
