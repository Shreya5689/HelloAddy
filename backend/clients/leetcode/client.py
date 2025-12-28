
import requests
import os
from typing import List
import strawberry


CSRFTOKEN = os.getenv("LEETCODE_CSRFTOKEN")
SESSION = os.getenv("LEETCODE_SESSION")

# if not CSRFTOKEN or not SESSION:
#     raise RuntimeError("LeetCode cookies not set")

 
LEETCODE_URL = "https://leetcode.com/graphql/"

HEADERS = {
    "Content-Type": "application/json",
    "Referer": "https://leetcode.com",
    "Origin": "https://leetcode.com",
    "User-Agent": "Mozilla/5.0",
    "X-CSRFToken": CSRFTOKEN,
    "Cookie": f"csrftoken={CSRFTOKEN}; LEETCODE_SESSION={SESSION}",
}

LEETCODE_QUERY = """
query problemsetQuestionList($limit: Int!, $skip: Int!) {
  problemsetQuestionListV2(limit: $limit, skip: $skip) {
    questions {
      title
      titleSlug
      difficulty
      acRate
      paidOnly
      topicTags{
        name
        slug
      }
    }
  }
}
"""


@strawberry.type
class Problem:
    title: str
    title_slug: str
    difficulty: str
    ac_rate: float
    paid_only: bool



@strawberry.type
class Query:
    @strawberry.field
    def search_problems(self, keyword: str) -> List[Problem]:
        topic=keyword.lower()
        results: List[Problem] = []

        skip=0
        limit=1000

        while True:
          response = requests.post(
            LEETCODE_URL,
            headers=HEADERS,
            json={
                "query": LEETCODE_QUERY,
                "variables": {"limit": limit, "skip": skip},
            },
            timeout=15,
          )

          if response.status_code != 200:
            raise RuntimeError(f"LeetCode error: {response.text}")

          payload = response.json()

          if "errors" in payload:
            raise RuntimeError(payload["errors"])

          questions = payload["data"]["problemsetQuestionListV2"]["questions"]

          if not questions:
            break
        
          for q in questions:
            tag_slugs={tag["slug"] for tag in q["topicTags"]}
  
            if topic in tag_slugs:
                results.append(
                    Problem(
                        title=q["title"],
                        title_slug=q["titleSlug"],
                        difficulty=q["difficulty"],
                        ac_rate=float(q["acRate"] or 0),
                        paid_only=q["paidOnly"],
                    )
                )
          skip += limit
        return results



# app.add_route("/graphql", graphql_app, methods=["GET", "POST"])
