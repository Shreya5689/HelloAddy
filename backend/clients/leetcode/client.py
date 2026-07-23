
import requests
import os
from typing import List
import strawberry
import asyncio
import httpx


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
query favoriteQuestionList(
  $limit: Int!
  $skip: Int!
  $favoriteSlug: String!
) {
  favoriteQuestionList(
    limit: $limit
    skip: $skip
    favoriteSlug:$favoriteSlug 
  ) {
    questions {
      title
      titleSlug
      difficulty
      acRate
      paidOnly
      topicTags {
        slug
      }
    }
  }
}

"""
LEETCODE_QUERY_ALL_QUESTIONS="""
query problemsetQuestionList($limit: Int!, $skip: Int!) {
  problemsetQuestionListV2(limit: $limit, skip: $skip) {
    totalLength
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
    tags:list[str]
    paid_only: bool



@strawberry.type
class Query:

    @strawberry.field
    async def search_all_problems(self, tags: List[str] = None) -> List[Problem]:
        limit = 500
        results: List[Problem] = []
        pages = []

        try:
            async with httpx.AsyncClient(headers=HEADERS, timeout=15) as client:
                first_resp = await client.post(
                    LEETCODE_URL,
                    json={
                        "query": LEETCODE_QUERY_ALL_QUESTIONS,
                        "variables": {"limit": limit, "skip": 0},
                    },
                )

                if first_resp.status_code == 200:
                    first_json = first_resp.json()
                    first_data = (first_json.get("data") or {}).get("problemsetQuestionListV2")
                    if first_data:
                        total = first_data.get("totalLength", 0)
                        pages.append(first_data.get("questions", []))

                        skips = list(range(limit, min(total, 2500), limit))
                        for i in range(0, len(skips), 3):
                            batch_skips = skips[i:i+3]
                            tasks = [
                                client.post(
                                    LEETCODE_URL,
                                    json={
                                        "query": LEETCODE_QUERY_ALL_QUESTIONS,
                                        "variables": {"limit": limit, "skip": s},
                                    },
                                )
                                for s in batch_skips
                            ]
                            responses = await asyncio.gather(*tasks, return_exceptions=True)
                            for resp in responses:
                                if isinstance(resp, Exception) or resp.status_code != 200:
                                    continue
                                try:
                                    res_json = resp.json()
                                    q_data = (res_json.get("data") or {}).get("problemsetQuestionListV2")
                                    if q_data and "questions" in q_data:
                                        pages.append(q_data["questions"])
                                except Exception:
                                    continue
        except Exception as e:
            print("Error fetching LeetCode problems:", str(e))

        seen_slugs = set()
        for questions in pages:
            for q in questions:
                title_slug = q.get("titleSlug")
                if not title_slug or title_slug in seen_slugs:
                    continue
                topic_tags = q.get("topicTags") or []
                tag_slugs = [t.get("slug") for t in topic_tags if t.get("slug")]

                if tags is None or len(tags) == 0 or any(tag in tag_slugs for tag in tags):
                    seen_slugs.add(title_slug)
                    results.append(
                        Problem(
                            title=q.get("title", ""),
                            title_slug=title_slug,
                            difficulty=q.get("difficulty", "Medium"),
                            ac_rate=float(q.get("acRate") or 0),
                            tags=tag_slugs,
                            paid_only=q.get("paidOnly", False),
                        )
                    )

        return results





    @strawberry.field
    def search_problems(self, keyword: str) -> List[Problem]:
        topic=keyword.lower()
        results: List[Problem] = []

        skip=0
        limit=1000

        response = requests.post(
          LEETCODE_URL,
          headers=HEADERS,
          json={
              "query": LEETCODE_QUERY,
              "variables": {
                  "limit": limit,
                  "skip": skip,
                  "favoriteSlug": topic
              }
            },
          timeout=15,
        )


        # if response.status_code != 200:
          # raise RuntimeError(f"LeetCode error: {response.text}")

        payload = response.json()
        # if "errors" in payload:
        #   raise RuntimeError(payload["errors"])

        questions = payload["data"]["favoriteQuestionList"]["questions"]
        for q in questions:
          tag_slugs = [tag["slug"] for tag in q["topicTags"]]

          results.append(
            Problem(
                title=q["title"],
                title_slug=q["titleSlug"],
                difficulty=q["difficulty"],
                ac_rate=float(q["acRate"] or 0),
                tags=tag_slugs,
                paid_only=q["paidOnly"],
               )
          )
        skip += limit
        return results



# app.add_route("/graphql", graphql_app, methods=["GET", "POST"])
