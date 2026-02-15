from fastapi import APIRouter,Depends,HTTPException
from clients.leetcode.client import Query
from clients.codeforces.client import search_codeforces
from utils import auth
from utils.search import get_tags
from schemas.problems import SaveSheetRequest,CheckboxRequest
from sqlalchemy.orm import Session
from database import get_db
from models.problems import UserSheet, UserProblemSheet
from models.auth.user import Users, UserProfile # Assuming you have this
from CRUD.problems import create_user_sheet
import random


router=APIRouter()


def get_difficulty_value(p, platform):

    if platform == "leetcode":
        d = p.difficulty.lower()
        if d == 'easy': return 1
        if d == 'medium': return 2
        if d == 'hard': return 3
    else:  # codeforces
        return p.get("rating", 9999)
    return 99
    
async def get_balanced_problems(lc_tags, cf_tags, user_ranking):
    """Common logic for filtering, shuffling, and even distribution."""
    result = Query()
    lc_all = await result.search_all_problems(lc_tags)
    cf_all = search_codeforces(cf_tags)
    # 1. Apply Ranking Filter (Beginner only)
    if user_ranking == "beginner":
        lc_all = [p for p in lc_all if p.difficulty.lower() == "easy"]
        cf_all = [p for p in cf_all if p.get("rating") and p.get("rating") <= 1000]
    elif user_ranking == "medium":
        # 1100-1600 rating for CF and a mix of Easy/Medium for LC
        lc_all = [p for p in lc_all if p.difficulty.lower() in ["easy", "medium"]]
        cf_all = [p for p in cf_all if p.get("rating") and 1100 <= p.get("rating") <= 1600]
    elif user_ranking == "hard":
        # 1600+ rating for CF and a mix of Medium/Hard for LC
        lc_all = [p for p in lc_all if p.difficulty.lower() in ["medium", "hard"]]
        cf_all = [p for p in cf_all if p.get("rating") and p.get("rating") >= 1600]
    # 2. Shuffle independently for variety
    random.shuffle(lc_all)
    random.shuffle(cf_all)
    # 3. Even Distribution (Target 13 problems total)
    total_target = 13
    half = (total_target // 2) + 1  # 7
    other_half = total_target - half # 6
    if len(lc_all) >= half and len(cf_all) >= other_half:
        lc_final = lc_all[:half]
        cf_final = cf_all[:other_half]
    elif len(lc_all) < half:
        lc_final = lc_all
        cf_final = cf_all[:total_target - len(lc_final)]
    else:
        cf_final = cf_all
        lc_final = lc_all[:total_target - len(cf_final)]
    # 4. Final Rank-based Sorting
    lc_final.sort(key=lambda x: get_difficulty_value(x, "leetcode"))
    cf_final.sort(key=lambda x: get_difficulty_value(x, "codeforces"))
    return lc_final, cf_final


@router.post("/save_sheet")
def save_sheet(
    payload: SaveSheetRequest, 
    user_payload: dict = Depends(auth.get_current_user), 
    db: Session = Depends(get_db)
):
    # Retrieve user from DB using the token's 'sub' (username)
    user = db.query(Users).filter(Users.username == user_payload["sub"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Save the sheet and its problems
    new_sheet = create_user_sheet(db=db, user_id=user.id, payload=payload)
    
    return {"message": "Sheet saved successfully", "sheet_id": new_sheet.id}


@router.get("/sheets")
def get_sheets(
    user_payload: dict = Depends(auth.get_current_user), 
    db: Session = Depends(get_db)
):
    user = db.query(Users).filter(Users.username == user_payload["sub"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # Fetches all sheets owned by this user, newest first
    sheets = db.query(UserSheet).filter(UserSheet.user_id == user.id).order_by(UserSheet.created_at.desc()).all()
    return sheets


@router.get("/sheets/{sheet_id}")
def get_sheet_details(
    sheet_id: int, 
    user_payload: dict = Depends(auth.get_current_user), 
    db: Session = Depends(get_db)
):
    # Verify existence
    sheet = db.query(UserSheet).filter(UserSheet.id == sheet_id).first()
    if not sheet:
        raise HTTPException(status_code=404, detail="Sheet not found")
        
    problems = db.query(UserProblemSheet).filter(UserProblemSheet.sheet_id == sheet_id).all()
    return {"sheet": sheet, "problems": problems}

@router.delete("/sheet/{sheet_id}")
def delete_sheet(
    sheet_id: int, 
    user_payload: dict = Depends(auth.get_current_user), 
    db: Session = Depends(get_db)
):
    # Get user
    user = db.query(Users).filter(Users.username == user_payload["sub"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # Find the sheet (ensure it belongs to the logged-in user)
    sheet = db.query(UserSheet).filter(UserSheet.id == sheet_id, UserSheet.user_id == user.id).first()
    if not sheet:
        raise HTTPException(status_code=404, detail="Sheet not found")
        
    # Delete associated problems first
    db.query(UserProblemSheet).filter(UserProblemSheet.sheet_id == sheet_id).delete()
    
    # Delete the sheet itself
    db.delete(sheet)
    db.commit()
    
    return {"message": "Sheet deleted successfully"}


@router.post("/checkbox")
async def checkbox_problem(
    tags: CheckboxRequest, 
    user_payload: dict = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    user_ranking=db.query(UserProfile).filter(UserProfile.username==user_payload["sub"]).first().ranking
    # Get related tags from Gemini
    tags = get_tags(tags)
    lc_tags = tags.get("leetcode_tags", [])
    cf_tags = tags.get("codeforces_tags", [])
    lc_final, cf_final = await get_balanced_problems(lc_tags, cf_tags, user_ranking)
    return {
        "problems": lc_final,
        "codeforces-problems": cf_final
    }

@router.post("/{topic}")
async def problem(
    topic: str, 
    user_payload: dict = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    user_ranking=db.query(UserProfile).filter(UserProfile.username==user_payload["sub"]).first().ranking
    # Get related tags from Gemini
    tags = get_tags(topic)
    lc_tags = tags.get("leetcode_tags", [])
    cf_tags = tags.get("codeforces_tags", [])
    lc_final, cf_final = await get_balanced_problems(lc_tags, cf_tags, user_ranking)
    return {
        "problems": lc_final,
        "codeforces-problems": cf_final
    }

    

# @router.post("/{topic}")
# async def problem(topic:str,user_payload: dict = Depends(auth.get_current_user)):
#     tags = get_tags(topic)
#     # print(type(tags))
#     # print("Logged-in user:", user_payload["sub"])

#     leetcode_tags=tags.get("leetcode_tags")
#     codeforces_tags=tags.get("codeforces_tags")
#     print(leetcode_tags)
#     print(codeforces_tags)
#     result = Query()
#     # ans = result.search_problems(topic)
#     # codeforces_problem = search_codeforces(topic)
#     ans = await result.search_all_problems(leetcode_tags)
#     codeforces_problem = search_codeforces(codeforces_tags)
#     print (ans)
#     # print("\n")
#     # print(codeforces_problem)
#     return {
#         "problems":ans,
#         "codeforces-problems": codeforces_problem
#     }

    


