from fastapi import APIRouter,Depends
router=APIRouter()
from clients.leetcode.client import Query
from clients.codeforces.client import search_codeforces
from utils import auth


@router.post("/{topic}")
def problem(topic:str,user_payload: dict = Depends(auth.get_current_user)):

    
    print("Logged-in user:", user_payload["sub"])

    result = Query()
    ans = result.search_problems(topic)
    codeforces_problem = search_codeforces(topic)
    return {
        "problems":ans,
        "codeforces-problems": codeforces_problem
    }


