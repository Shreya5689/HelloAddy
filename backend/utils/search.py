from google import genai
import os
import json
from dotenv import load_dotenv
from typing import List
from pydantic import BaseModel

codeforces = [
    'expression parsing', 'string suffix structures', '2-sat', 'hashing',
    'schedules', 'dfs and similar', 'strings', 'graphs', '*special',
    'greedy', 'two pointers', 'geometry', 'implementation', 'brute force',
    'trees', 'meet-in-the-middle', 'flows', 'constructive algorithms',
    'matrices', 'dsu', 'combinatorics', 'fft', 'graph matchings', 'math',
    'bitmasks', 'data structures', 'chinese remainder theorem',
    'divide and conquer', 'probabilities', 'sortings', 'binary search',
    'games', 'dp', 'ternary search', 'shortest paths', 'number theory',
    'interactive'
]

leetcode = [
    'monotonic-stack', 'math', 'combinatorics', 'data-stream', 'iterator',
    'radix-sort', 'breadth-first-search', 'dynamic-programming',
    'line-sweep', 'merge-sort', 'topological-sort', 'enumeration',
    'counting-sort', 'bit-manipulation', 'bucket-sort', 'recursion',
    'backtracking', 'binary-indexed-tree', 'stack', 'queue',
    'heap-priority-queue', 'prefix-sum', 'sliding-window', 'trie',
    'segment-tree', 'union-find', 'binary-tree', 'linked-list'
]

load_dotenv()

class Tags(BaseModel):
    codeforces_tags: List[str]
    leetcode_tags: List[str]


def get_tags(topic: str):
    prompt = f"""
    User has given you the query as input.
    You are provided with lists of tags from LeetCode and Codeforces.

    Task:
    Find tags related to the user input topic: "{topic}"

    LeetCode tags:
    {", ".join(leetcode)}

    Codeforces tags:
    {", ".join(codeforces)}
    """

    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_json_schema": Tags.model_json_schema(),
        },
    )

    try:
        result = json.loads(response.text)
    except Exception:
        result = {"leetcode_tags": [], "codeforces_tags": []}

    return result
