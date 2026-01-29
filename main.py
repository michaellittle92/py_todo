
from fastapi import FastAPI
import models
from db import engine
from routers import auth, todos, admin, users

app = FastAPI()


#Only runs if todos.db is missing
models.Base.metadata.create_all(bind=engine)

#add router
app.include_router(auth.router)
app.include_router(todos.router)
app.include_router(admin.router)
app.include_router(users.router)