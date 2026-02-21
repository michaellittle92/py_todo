from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
from db import engine
from routers import auth, todos, admin, users

app = FastAPI()

# CORS 
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5501",
    "http://127.0.0.1:5501",
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
],        # will need to add S3 URL / CloudFront domain here later when i know it

    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#Only runs if todos.db is missing
@app.on_event("startup")
def on_startup():
    models.Base.metadata.create_all(bind=engine)

@app.get("/healthy")
async def health_check():
    return {"status": "healthy"}

#add router
app.include_router(auth.router)
app.include_router(todos.router)
app.include_router(admin.router)
app.include_router(users.router)