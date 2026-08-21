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

    faculty = db.query(models.Faculty).all()

    return [
        {
            "id": item.id,
            "name": item.name,
            "facultyId": item.facultyId,
            "email": item.email,
            "designation": item.designation,
            "maxHours": item.maxHours,
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

    # Check if Faculty ID already exists
    existing_faculty = (
        db.query(models.Faculty)
        .filter(
            models.Faculty.facultyId
            == faculty_data["facultyId"]
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
        facultyId=faculty_data["facultyId"],
        email=faculty_data["email"],
        designation=faculty_data["designation"],
        maxHours=int(faculty_data["maxHours"]),
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
            "facultyId": new_faculty.facultyId,
            "email": new_faculty.email,
            "designation": new_faculty.designation,
            "maxHours": new_faculty.maxHours,
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
def get_classes():
    return []


# ==========================================
# SUBJECTS API
# ==========================================

@app.get("/api/subjects")
def get_subjects():
    return []


# ==========================================
# ROOMS API
# ==========================================

@app.get("/api/rooms")
def get_rooms():
    return []


# ==========================================
# TIMETABLE API
# ==========================================

@app.get("/api/timetable")
def get_timetable():
    return []


# ==========================================
# WORKLOAD API
# ==========================================

@app.get("/api/workload")
def get_workload():
    return []