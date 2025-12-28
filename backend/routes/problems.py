from fastapi import APIRouter
router=APIRouter()
from clients.leetcode.client import Query
@router.post("/{topic}")
def problem(topic:str):

    result = Query()
    ans = result.search_problems(topic)
    return {
        "problems":ans
    }


