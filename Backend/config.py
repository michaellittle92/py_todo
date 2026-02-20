from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SECRET_KEY: str
    CONNECTION_STRING: str

    class Config:
        env_file = ".env"

settings = Settings()
