from sqlalchemy.orm import Session
from models.problems import UserSheet, UserProblemSheet
from schemas.problems import SaveSheetRequest

def create_user_sheet(db: Session, user_id: int, payload: SaveSheetRequest):
    # Create Sheet
    new_sheet = UserSheet(user_id=user_id, name=payload.name)
    db.add(new_sheet)
    db.commit()
    db.refresh(new_sheet)

    # Add Problems
    for p in payload.problems:
        db_problem = UserProblemSheet(
            sheet_id=new_sheet.id,
            topic=p.topic,
            title=p.title,
            difficulty=p.difficulty,
            url=p.url,
            platform=p.platform,
            paid_only=p.paid_only
        )
        db.add(db_problem)
    
    db.commit()
    return new_sheet