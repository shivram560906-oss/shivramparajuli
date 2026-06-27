from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
import datetime
from .connection import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    records = relationship("KundaliRecord", back_populates="user", cascade="all, delete-orphan")
    settings = relationship("Settings", back_populates="user", uselist=False, cascade="all, delete-orphan")

class KundaliRecord(Base):
    __tablename__ = "kundali_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    name = Column(String, nullable=False)
    birth_date = Column(String, nullable=False)  # YYYY-MM-DD
    birth_time = Column(String, nullable=False)  # HH:MM:SS
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    timezone = Column(Float, nullable=False)     # e.g., 5.75 for Nepal
    gender = Column(String, nullable=True)
    notes = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="records")

class Settings(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=True)
    ayanamsha_type = Column(String, default="LAHIRI") # LAHIRI, RAMAN, KP, TROPICAL
    chart_style = Column(String, default="NORTH_INDIAN") # NORTH_INDIAN, SOUTH_INDIAN
    language = Column(String, default="en") # en, ne

    # Relationships
    user = relationship("User", back_populates="settings")
