from fastapi import FastAPI
import models
from db import engine
from routers import auth, todos, admin, users

app = FastAPI()

# CORS 
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://localhost:5500",
        "http://localhost:5173",
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