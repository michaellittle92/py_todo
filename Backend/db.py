from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from config import settings

from sqlalchemy.ext.declarative import declarative_base

SLQALCHEMY_DATABASE_URL = settings.CONNECTION_STRING

engine = create_engine(SLQALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()