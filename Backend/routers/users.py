from typing import Annotated
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, Path, status
from models import Users
from db import SessionLocal
from .auth import get_current_user
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from config import settings


from fastapi import APIRouter

router = APIRouter(
        prefix='/users',
    tags=['users']
)
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = 'HS256'

bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated=['auto'])
oauth2_bearer = OAuth2PasswordBearer(tokenUrl='auth/token')

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependancy = Annotated[Session, Depends(get_db)]
user_dependancy = Annotated[dict, Depends(get_current_user)]

class ChangePasswordRequest(BaseModel):
    current_password:str
    new_password:str = Field(min_length=6)
    confirm_new_password: str

class ChangePhoneNumberRequest(BaseModel):
    new_phone_number:str = Field(min_length=10, max_length=12)

@router.get("/", status_code=status.HTTP_200_OK)
async def read_user(user: user_dependancy, db: db_dependancy):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Authentication failed")
    return db.query(Users).filter(Users.id == user.get("id")).first()


@router.get("/users", status_code=status.HTTP_200_OK)
async def read_all(user: user_dependancy, db:db_dependancy):
    if user is None or user.get('user_role') != 'admin':
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication failed")
    return db.query(Users).all()

@router.put("/change_phone_number", status_code= status.HTTP_204_NO_CONTENT)
async def change_phone_number(user: user_dependancy, db:db_dependancy, change_phone_number_requeset: ChangePhoneNumberRequest):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication Failed")
    #update phone number in db
    user_model = db.query(Users).filter(Users.id == user.get('id')).first()
    user_model.phone_number = change_phone_number_requeset.new_phone_number

    db.add(user_model)
    db.commit()

@router.put("/change_password/",status_code=status.HTTP_204_NO_CONTENT)
async def change_password(user: user_dependancy, db:db_dependancy, change_password_request: ChangePasswordRequest):
    
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication Failed")
    #check new password matches
    if change_password_request.new_password != change_password_request.confirm_new_password:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="New password does not match")

    # update password in db
    user_model = db.query(Users).filter(Users.id == user.get('id')).first()
    if not bcrypt_context.verify(change_password_request.current_password, user_model.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Error on password change")
    
    user_model.hashed_password = bcrypt_context.hash(change_password_request.new_password)

    db.add(user_model)
    db.commit()