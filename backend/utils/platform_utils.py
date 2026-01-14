from clients.leetcode.client import Query
from clients.codeforces.client import search_codeforces


result = Query()
# print(ans)

def get_all_tags_from_codeforces():
    codeforces_problem = search_codeforces("")
    codeforces_tags=set()

    for p in codeforces_problem:
        codeforces_tags.update(p["tags"])
    return  codeforces_tags

codeforces_tag = get_all_tags_from_codeforces()
# print(codeforces_tag)
def get_all_tags_from_leetcode():
    ans = result.search_all_problems()
    all_tags= set()
    for q in ans:
        all_tags.update(q.tags)
    return all_tags

tags= get_all_tags_from_leetcode()
# print(tags)