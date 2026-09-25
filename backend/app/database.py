import os
import shutil
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Ensure backend/data directory exists or fallback to /tmp on Vercel
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

if os.getenv("VERCEL"):
    DATA_DIR = "/tmp/bgy_data"
    os.makedirs(DATA_DIR, exist_ok=True)
    DB_PATH = os.path.join(DATA_DIR, "bgy.db")
    seed_db = os.path.join(BASE_DIR, "data", "bgy.db")
    if not os.path.exists(DB_PATH) and os.path.exists(seed_db):
        try:
            shutil.copy2(seed_db, DB_PATH)
        except Exception as e:
            print(f"[Warning] Could not copy seed DB to /tmp: {e}")
else:
    DATA_DIR = os.path.join(BASE_DIR, "data")
    os.makedirs(DATA_DIR, exist_ok=True)
    DB_PATH = os.path.join(DATA_DIR, "bgy.db")

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{DB_PATH}")

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in SQLALCHEMY_DATABASE_URL else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
