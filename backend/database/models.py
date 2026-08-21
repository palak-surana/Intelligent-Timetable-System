from sqlalchemy import Column, Integer, String, Float, Boolean
from .database import Base


# ==========================================
# FACULTY TABLE
# ==========================================

class Faculty(Base):
    __tablename__ = "faculty"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    faculty_id = Column(String, unique=True, nullable=False)

    email = Column(String, nullable=True)

    designation = Column(String, nullable=True)

    max_hours = Column(Float, nullable=False)

    department = Column(
        String,
        default="Data Science"
    )


# ==========================================
# CLASSES TABLE
# ==========================================

class Class(Base):
    __tablename__ = "classes"

    id = Column(Integer, primary_key=True, index=True)

    year = Column(String, nullable=False)

    division = Column(String, nullable=False)

    department = Column(
        String,
        default="Data Science"
    )

    semester = Column(String, nullable=True)

    status = Column(
        String,
        default="Active"
    )


# ==========================================
# BATCHES TABLE
# ==========================================

class Batch(Base):
    __tablename__ = "batches"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    class_name = Column(String, nullable=False)

    status = Column(
        String,
        default="Active"
    )


# ==========================================
# SUBJECTS TABLE
# ==========================================

class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)

    code = Column(String, unique=True, nullable=False)

    name = Column(String, nullable=False)

    subject_type = Column(String, nullable=False)
    # Theory / Practical

    weekly_sessions = Column(
        Integer,
        nullable=False
    )

    duration_minutes = Column(
        Integer,
        nullable=False
    )

    department = Column(
        String,
        default="Data Science"
    )


# ==========================================
# SUBJECT ASSIGNMENTS TABLE
# ==========================================

class SubjectAssignment(Base):
    __tablename__ = "subject_assignments"

    id = Column(Integer, primary_key=True, index=True)

    subject_id = Column(
        Integer,
        nullable=False
    )

    class_id = Column(
        Integer,
        nullable=False
    )

    batch_name = Column(
        String,
        nullable=True
    )

    faculty_id = Column(
        Integer,
        nullable=False
    )

    room_id = Column(
        Integer,
        nullable=False
    )


# ==========================================
# ROOMS TABLE
# ==========================================

class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, unique=True, nullable=False)

    room_type = Column(String, nullable=False)
    # Classroom / Laboratory

    capacity = Column(
        Integer,
        nullable=True
    )

    status = Column(
        String,
        default="Available"
    )


# ==========================================
# TIME SLOTS TABLE
# ==========================================

class TimeSlot(Base):
    __tablename__ = "time_slots"

    id = Column(Integer, primary_key=True, index=True)

    slot_number = Column(
        Integer,
        nullable=False
    )

    start_time = Column(
        String,
        nullable=False
    )

    end_time = Column(
        String,
        nullable=False
    )

    duration_minutes = Column(
        Integer,
        nullable=False
    )

    is_break = Column(
        Boolean,
        default=False
    )

    break_type = Column(
        String,
        nullable=True
    )


# ==========================================
# WORKING DAYS TABLE
# ==========================================

class WorkingDay(Base):
    __tablename__ = "working_days"

    id = Column(Integer, primary_key=True, index=True)

    day = Column(
        String,
        unique=True,
        nullable=False
    )

    is_working = Column(
        Boolean,
        default=True
    )


# ==========================================
# TIMETABLE TABLE
# ==========================================

class Timetable(Base):
    __tablename__ = "timetable"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    day = Column(
        String,
        nullable=False
    )

    time_slot = Column(
        String,
        nullable=False
    )

    # --------------------------------------
    # CLASS
    # --------------------------------------

    class_id = Column(
        Integer,
        nullable=False
    )

    class_name = Column(
        String,
        nullable=False
    )

    # --------------------------------------
    # BATCH
    # --------------------------------------

    batch_name = Column(
        String,
        nullable=True
    )

    # --------------------------------------
    # SUBJECT
    # --------------------------------------

    subject_id = Column(
        Integer,
        nullable=False
    )

    subject = Column(
        String,
        nullable=False
    )

    # --------------------------------------
    # FACULTY
    # --------------------------------------

    faculty_id = Column(
        Integer,
        nullable=False
    )

    faculty = Column(
        String,
        nullable=False
    )

    # --------------------------------------
    # ROOM
    # --------------------------------------

    room_id = Column(
        Integer,
        nullable=False
    )

    room = Column(
        String,
        nullable=False
    )

    # --------------------------------------
    # DURATION
    # --------------------------------------

    duration_minutes = Column(
        Integer,
        nullable=False
    )