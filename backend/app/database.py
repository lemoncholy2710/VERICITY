from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from .models import Base


# Store the SQLite database inside the project's database folder.
DATABASE_DIR = Path("database")
DATABASE_DIR.mkdir(exist_ok=True)

DATABASE_URL = "sqlite:///./database/vericity.db"


engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)

SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
)


def init_db():
    Base.metadata.create_all(bind=engine)