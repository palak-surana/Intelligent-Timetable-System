from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database.database import engine, Base, get_db
from database import models


# ==========================================
# CREATE DATABASE TABLES
# ==========================================

Base.metadata.create_all(bind=engine)


# ==========================================
# FASTAPI APPLICATION
# ==========================================

app = FastAPI(
    title="Intelligent Faculty Workload-Based Timetable System",
    version="1.0.0"
)


# ==========================================
# CORS
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# HOME
# ==========================================

@app.get("/")
def home():
    return {
        "message": "Intelligent Timetable System Backend is running"
    }


# ==========================================
# HEALTH CHECK
# ==========================================

@app.get("/api/health")
def health_check():
    return {
        "status": "success",
        "backend": "FastAPI",
        "system": "Timetable Generation System"
    }


# ==========================================
# FACULTY API
# ==========================================

@app.get("/api/faculty")
def get_faculty(db: Session = Depends(get_db)):

    faculty = (
        db.query(models.Faculty)
        .order_by(models.Faculty.name)
        .all()
    )

    return [
        {
            "id": item.id,
            "name": item.name,
            "facultyId": item.faculty_id,
            "email": item.email,
            "designation": item.designation,
            "maxHours": item.max_hours,
            "department": item.department,
        }
        for item in faculty
    ]


# ==========================================
# ADD FACULTY
# ==========================================

@app.post("/api/faculty")
def add_faculty(
    faculty_data: dict,
    db: Session = Depends(get_db)
):

    faculty_id = faculty_data.get("facultyId")

    if not faculty_id:
        raise HTTPException(
            status_code=400,
            detail="Faculty ID is required"
        )

    existing_faculty = (
        db.query(models.Faculty)
        .filter(
            models.Faculty.faculty_id == faculty_id
        )
        .first()
    )

    if existing_faculty:
        raise HTTPException(
            status_code=400,
            detail="Faculty ID already exists"
        )

    new_faculty = models.Faculty(
        name=faculty_data["name"],
        faculty_id=faculty_id,
        email=faculty_data.get("email"),
        designation=faculty_data.get("designation"),
        max_hours=float(
            faculty_data.get("maxHours", 0)
        ),
        department=faculty_data.get(
            "department",
            "Data Science"
        ),
    )

    db.add(new_faculty)
    db.commit()
    db.refresh(new_faculty)

    return {
        "message": "Faculty added successfully",
        "faculty": {
            "id": new_faculty.id,
            "name": new_faculty.name,
            "facultyId": new_faculty.faculty_id,
            "email": new_faculty.email,
            "designation": new_faculty.designation,
            "maxHours": new_faculty.max_hours,
            "department": new_faculty.department,
        }
    }


# ==========================================
# DELETE FACULTY
# ==========================================

@app.delete("/api/faculty/{faculty_id}")
def delete_faculty(
    faculty_id: int,
    db: Session = Depends(get_db)
):

    faculty = (
        db.query(models.Faculty)
        .filter(
            models.Faculty.id == faculty_id
        )
        .first()
    )

    if not faculty:
        raise HTTPException(
            status_code=404,
            detail="Faculty not found"
        )

    db.delete(faculty)
    db.commit()

    return {
        "message": "Faculty deleted successfully"
    }


# ==========================================
# CLASSES API
# ==========================================

@app.get("/api/classes")
def get_classes(
    db: Session = Depends(get_db)
):

    classes = (
        db.query(models.Class)
        .order_by(
            models.Class.year,
            models.Class.division
        )
        .all()
    )

    return [
        {
            "id": item.id,
            "year": item.year,
            "division": item.division,
            "department": item.department,
            "semester": item.semester,
            "status": item.status,

            # Convenient display name
            "className": (
                f"{item.year} "
                f"{item.department} "
                f"{item.division}"
            ),
        }
        for item in classes
    ]


# ==========================================
# BATCHES API
# ==========================================

@app.get("/api/batches")
def get_batches(
    db: Session = Depends(get_db)
):

    batches = (
        db.query(models.Batch)
        .order_by(models.Batch.name)
        .all()
    )

    return [
        {
            "id": item.id,
            "name": item.name,
            "className": item.class_name,
            "status": item.status,
        }
        for item in batches
    ]


# ==========================================
# SUBJECTS API
# ==========================================

@app.get("/api/subjects")
def get_subjects(
    db: Session = Depends(get_db)
):

    subjects = (
        db.query(models.Subject)
        .order_by(models.Subject.code)
        .all()
    )

    return [
        {
            "id": item.id,
            "code": item.code,
            "name": item.name,
            "subjectType": item.subject_type,
            "weeklySessions": item.weekly_sessions,
            "durationMinutes": item.duration_minutes,
            "department": item.department,

            # Useful for timetable UI
            "isLab": (
                item.subject_type.lower()
                in ["practical", "lab"]
            ),
        }
        for item in subjects
    ]


# ==========================================
# ROOMS API
# ==========================================

@app.get("/api/rooms")
def get_rooms(
    db: Session = Depends(get_db)
):

    rooms = (
        db.query(models.Room)
        .order_by(models.Room.name)
        .all()
    )

    return [
        {
            "id": item.id,
            "name": item.name,
            "roomType": item.room_type,
            "capacity": item.capacity,
            "status": item.status,
        }
        for item in rooms
    ]


# ==========================================
# WORKING DAYS API
# ==========================================

@app.get("/api/working-days")
def get_working_days(
    db: Session = Depends(get_db)
):

    days = (
        db.query(models.WorkingDay)
        .all()
    )

    return [
        {
            "id": item.id,
            "day": item.day,
            "isWorking": item.is_working,
        }
        for item in days
    ]


# ==========================================
# TIME SLOTS API
# ==========================================

@app.get("/api/time-slots")
def get_time_slots(
    db: Session = Depends(get_db)
):

    slots = (
        db.query(models.TimeSlot)
        .order_by(models.TimeSlot.slot_number)
        .all()
    )

    return [
        {
            "id": item.id,
            "slotNumber": item.slot_number,
            "startTime": item.start_time,
            "endTime": item.end_time,
            "durationMinutes": item.duration_minutes,
            "isBreak": item.is_break,
            "breakType": item.break_type,
        }
        for item in slots
    ]


# ==========================================
# TIMETABLE API
# ==========================================

@app.get("/api/timetable")
def get_timetable(
    db: Session = Depends(get_db)
):

    timetable = (
        db.query(models.Timetable)
        .all()
    )

    # Proper day order
    day_order = {
        "Monday": 1,
        "Tuesday": 2,
        "Wednesday": 3,
        "Thursday": 4,
        "Friday": 5,
        "Saturday": 6,
    }

    timetable.sort(
        key=lambda x: (
            day_order.get(x.day, 99),
            x.time_slot
        )
    )

    return [
        {
            "id": item.id,

            "day": item.day,

            # Main field
            "timeSlot": item.time_slot,

            # Compatibility with existing React code
            "time": item.time_slot,

            "className": item.class_name,

            "batchName": (
                item.batch_name
                if item.batch_name
                else "ALL"
            ),

            "subject": item.subject,

            "faculty": item.faculty,

            "room": item.room,

            "durationMinutes": item.duration_minutes,

            # Useful for UI
            "isLab": item.duration_minutes >= 100,
        }
        for item in timetable
    ]


# ==========================================
# TIMETABLE BY CLASS
# ==========================================

@app.get("/api/timetable/{class_name}")
def get_class_timetable(
    class_name: str,
    db: Session = Depends(get_db)
):

    timetable = (
        db.query(models.Timetable)
        .filter(
            models.Timetable.class_name
            == class_name
        )
        .all()
    )

    if not timetable:
        return []

    day_order = {
        "Monday": 1,
        "Tuesday": 2,
        "Wednesday": 3,
        "Thursday": 4,
        "Friday": 5,
        "Saturday": 6,
    }

    timetable.sort(
        key=lambda x: (
            day_order.get(x.day, 99),
            x.time_slot
        )
    )

    return [
        {
            "id": item.id,
            "day": item.day,
            "timeSlot": item.time_slot,
            "time": item.time_slot,
            "className": item.class_name,
            "batchName": (
                item.batch_name
                if item.batch_name
                else "ALL"
            ),
            "subject": item.subject,
            "faculty": item.faculty,
            "room": item.room,
            "durationMinutes": item.duration_minutes,
            "isLab": item.duration_minutes >= 100,
        }
        for item in timetable
    ]


# ==========================================
# WORKLOAD API
# ==========================================

@app.get("/api/workload")
def get_workload(
    db: Session = Depends(get_db)
):

    faculty = (
        db.query(models.Faculty)
        .order_by(models.Faculty.name)
        .all()
    )

    result = []

    for item in faculty:

        entries = (
            db.query(models.Timetable)
            .filter(
                models.Timetable.faculty
                == item.name
            )
            .all()
        )

        total_minutes = sum(
            entry.duration_minutes
            for entry in entries
        )

        used_hours = round(
            total_minutes / 60,
            2
        )

        max_hours = item.max_hours

        result.append(
            {
                "id": item.id,
                "facultyId": item.faculty_id,
                "name": item.name,
                "maxHours": max_hours,
                "usedHours": used_hours,
                "remainingHours": round(
                    max_hours - used_hours,
                    2
                ),
                "utilizationPercent": (
                    round(
                        (used_hours / max_hours) * 100,
                        1
                    )
                    if max_hours > 0
                    else 0
                ),
            }
        )

    return result


# ==========================================
# GENERATE TIMETABLE
# ==========================================

@app.post("/api/generate-timetable")
def generate_timetable():

    try:

        # Import here so the generator is loaded
        # only when this API is called.
        from timetable_generator import (
            generate_ty_timetable
        )

        result = generate_ty_timetable()

        return {
            "status": "success",
            "message": "TY Data Science A timetable generated successfully",
            "result": result,
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


# ==========================================
# VALIDATE TIMETABLE
# ==========================================

@app.get("/api/validate-timetable")
def validate_timetable():

    try:

        from validate_timetable import (
            validate_timetable
        )

        result = validate_timetable()

        return {
            "status": "success",
            "message": "Timetable validation completed",
            "result": result,
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )