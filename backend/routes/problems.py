from fastapi import APIRouter,Depends
router=APIRouter()
from clients.leetcode.client import Query
from clients.codeforces.client import search_codeforces
from utils import auth
from utils.search import get_tags

@router.post("/{topic}")
def problem(topic:str,user_payload: dict = Depends(auth.get_current_user)):
    tags = get_tags(topic)
    # print(type(tags))
    # print("Logged-in user:", user_payload["sub"])

    leetcode_tags=tags.get("leetcode_tags")
    codeforces_tags=tags.get("codeforces_tags")
    # print(leetcode_tags)
    # print(codeforces_tags)
    result = Query()
    # ans = result.search_problems(topic)
    # codeforces_problem = search_codeforces(topic)
    ans = result.search_all_problems(leetcode_tags)
    codeforces_problem = search_codeforces(codeforces_tags)
    # print (ans)
    # print("\n")
    # print(codeforces_problem)
    return {
        "problems":ans,
        "codeforces-problems": codeforces_problem
    }


