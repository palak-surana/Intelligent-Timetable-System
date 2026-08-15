from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title="Intelligent Faculty Workload-Based Timetable System",
    version="1.0.0"
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# HOME API
# =========================================================

@app.get("/")
def home():
    return {
        "message": "Intelligent Timetable System Backend is running"
    }


# =========================================================
# HEALTH CHECK API
# =========================================================

@app.get("/api/health")
def health_check():
    return {
        "status": "success",
        "backend": "FastAPI",
        "system": "Timetable Generation System"
    }


# =========================================================
# TEMPORARY DATA STORAGE
# =========================================================
# For now we are using lists.
# Tomorrow, when you get the actual data,
# we can connect these to a proper database.


faculty_data = []

classes_data = []

subjects_data = []

rooms_data = []

timetable_data = []

workload_data = []


# =========================================================
# FACULTY API
# =========================================================

@app.get("/api/faculty")
def get_faculty():
    return faculty_data


@app.post("/api/faculty")
def add_faculty(faculty: dict):

    faculty_data.append(faculty)

    return {
        "message": "Faculty added successfully",
        "faculty": faculty
    }


# =========================================================
# CLASSES API
# =========================================================

@app.get("/api/classes")
def get_classes():
    return classes_data


@app.post("/api/classes")
def add_class(class_data: dict):

    classes_data.append(class_data)

    return {
        "message": "Class added successfully",
        "class": class_data
    }


# =========================================================
# SUBJECTS API
# =========================================================

@app.get("/api/subjects")
def get_subjects():
    return subjects_data


@app.post("/api/subjects")
def add_subject(subject: dict):

    subjects_data.append(subject)

    return {
        "message": "Subject added successfully",
        "subject": subject
    }


# =========================================================
# ROOMS API
# =========================================================

@app.get("/api/rooms")
def get_rooms():
    return rooms_data


@app.post("/api/rooms")
def add_room(room: dict):

    rooms_data.append(room)

    return {
        "message": "Room added successfully",
        "room": room
    }


# =========================================================
# TIMETABLE API
# =========================================================

@app.get("/api/timetable")
def get_timetable():
    return timetable_data


@app.post("/api/timetable")
def add_timetable(timetable: dict):

    timetable_data.append(timetable)

    return {
        "message": "Timetable added successfully",
        "timetable": timetable
    }


# =========================================================
# WORKLOAD API
# =========================================================

@app.get("/api/workload")
def get_workload():
    return workload_data


@app.post("/api/workload")
def add_workload(workload: dict):

    workload_data.append(workload)

    return {
        "message": "Workload added successfully",
        "workload": workload
    }