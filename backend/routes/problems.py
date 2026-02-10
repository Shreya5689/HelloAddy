from fastapi import APIRouter,Depends,HTTPException
from clients.leetcode.client import Query
from clients.codeforces.client import search_codeforces
from utils import auth
from utils.search import get_tags
from schemas.problems import SaveSheetRequest,CheckboxRequest
from sqlalchemy.orm import Session
from database import get_db
from models.problems import UserSheet, UserProblemSheet
from models.auth.user import Users # Assuming you have this
from CRUD.problems import create_user_sheet



router=APIRouter()

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
async def checkbox_problem(tags:CheckboxRequest,user_payload: dict = Depends(auth.get_current_user)):
    leetcode_tags=tags.leetcode_tags
    codeforces_tags=tags.codeforces_tags
    result = Query()
    # ans = result.search_problems(topic)
    # codeforces_problem = search_codeforces(topic)
    ans = await result.search_all_problems(leetcode_tags)
    codeforces_problem = search_codeforces(codeforces_tags)
    print (ans)
    # print("\n")
    # print(codeforces_problem)
    return {
        "problems":ans,
        "codeforces-problems": codeforces_problem
    }

    

@router.post("/{topic}")
async def problem(topic:str,user_payload: dict = Depends(auth.get_current_user)):
    tags = get_tags(topic)
    # print(type(tags))
    # print("Logged-in user:", user_payload["sub"])

    leetcode_tags=tags.get("leetcode_tags")
    codeforces_tags=tags.get("codeforces_tags")
    print(leetcode_tags)
    print(codeforces_tags)
    result = Query()
    # ans = result.search_problems(topic)
    # codeforces_problem = search_codeforces(topic)
    ans = await result.search_all_problems(leetcode_tags)
    codeforces_problem = search_codeforces(codeforces_tags)
    print (ans)
    # print("\n")
    # print(codeforces_problem)
    return {
        "problems":ans,
        "codeforces-problems": codeforces_problem
    }

    


