from database.database import SessionLocal
from database import models


db = SessionLocal()


# ==========================================
# TY DATA SCIENCE - DIVISION A
# ==========================================

existing_class = (
    db.query(models.Class)
    .filter(
        models.Class.year == "TY",
        models.Class.division == "A",
        models.Class.department == "Data Science"
    )
    .first()
)

if existing_class:
    ty_class = existing_class
    print("TY Data Science A already exists.")
else:
    ty_class = models.Class(
        year="TY",
        division="A",
        department="Data Science",
        semester="V",
        status="Active"
    )

    db.add(ty_class)
    db.commit()
    db.refresh(ty_class)

    print("TY Data Science A added.")


# ==========================================
# BATCHES
# ==========================================

batch_names = ["A1", "A2", "A3"]

for batch_name in batch_names:

    existing_batch = (
        db.query(models.Batch)
        .filter(
            models.Batch.name == batch_name,
            models.Batch.class_name == "TY Data Science A"
        )
        .first()
    )

    if not existing_batch:

        new_batch = models.Batch(
            name=batch_name,
            class_name="TY Data Science A",
            status="Active"
        )

        db.add(new_batch)

        print(f"Batch {batch_name} added.")

    else:
        print(f"Batch {batch_name} already exists.")


# SAVE BATCHES
db.commit()


# ==========================================
# FACULTY
# ==========================================

faculty_data = [
    {
        "faculty_id": "RD",
        "name": "Mrs. Ritu Dudhmal",
        "email": None,
        "designation": None,
        "max_hours": 12,
    },
    {
        "faculty_id": "LK",
        "name": "Mrs. Laxmi Kale",
        "email": None,
        "designation": None,
        "max_hours": 12,
    },
    {
        "faculty_id": "VW",
        "name": "Dr. Vaishali Wangikar",
        "email": None,
        "designation": None,
        "max_hours": 10,
    },
    {
        "faculty_id": "PV",
        "name": "Mr. Pankaj Vishwakarma",
        "email": None,
        "designation": None,
        "max_hours": 12,
    },
    {
        "faculty_id": "AK",
        "name": "Mrs. Aparna Kulkarni",
        "email": None,
        "designation": None,
        "max_hours": 12,
    },
    {
        "faculty_id": "JD",
        "name": "Mr. Jayant Devare",
        "email": None,
        "designation": None,
        "max_hours": 12,
    },
]


for faculty in faculty_data:

    existing_faculty = (
        db.query(models.Faculty)
        .filter(
            models.Faculty.faculty_id == faculty["faculty_id"]
        )
        .first()
    )

    if existing_faculty:
        print(
            f"Faculty {faculty['faculty_id']} already exists."
        )
        continue

    new_faculty = models.Faculty(
        faculty_id=faculty["faculty_id"],
        name=faculty["name"],
        email=faculty["email"],
        designation=faculty["designation"],
        max_hours=faculty["max_hours"],
        department="Data Science",
    )

    db.add(new_faculty)

    print(
        f"Faculty {faculty['faculty_id']} added."
    )


# IMPORTANT: SAVE FACULTY
db.commit()


# ==========================================
# SUBJECTS
# ==========================================

subject_data = [
    {
        "code": "2312311T",
        "name": "Design Analysis of Algorithms (DAA)",
        "subject_type": "Theory",
        "weekly_sessions": 3,
        "duration_minutes": 60,
    },
    {
        "code": "2312311L",
        "name": "Design Analysis of Algorithms Lab",
        "subject_type": "Practical",
        "weekly_sessions": 1,
        "duration_minutes": 120,
    },
    {
        "code": "2312312T",
        "name": "Deep Learning and Large Language Models (DL)",
        "subject_type": "Theory",
        "weekly_sessions": 3,
        "duration_minutes": 60,
    },
    {
        "code": "2312312L",
        "name": "Deep Learning Lab",
        "subject_type": "Practical",
        "weekly_sessions": 1,
        "duration_minutes": 120,
    },
    {
        "code": "2312323T",
        "name": "Agentic AI Foundation (AgAI)",
        "subject_type": "Theory",
        "weekly_sessions": 3,
        "duration_minutes": 60,
    },
    {
        "code": "2312323L",
        "name": "Agentic AI Foundation Lab",
        "subject_type": "Practical",
        "weekly_sessions": 1,
        "duration_minutes": 120,
    },
    {
        "code": "2312362L",
        "name": "AI-Powered Full Stack Development (FD)",
        "subject_type": "Practical",
        "weekly_sessions": 1,
        "duration_minutes": 120,
    },
    {
        "code": "2312363L",
        "name": "AI-First Mobile Application Development (MAD)",
        "subject_type": "Practical",
        "weekly_sessions": 1,
        "duration_minutes": 120,
    },
]


for subject in subject_data:

    existing_subject = (
        db.query(models.Subject)
        .filter(
            models.Subject.code == subject["code"]
        )
        .first()
    )

    if existing_subject:
        print(
            f"Subject {subject['code']} already exists."
        )
        continue

    new_subject = models.Subject(
        code=subject["code"],
        name=subject["name"],
        subject_type=subject["subject_type"],
        weekly_sessions=subject["weekly_sessions"],
        duration_minutes=subject["duration_minutes"],
        department="Data Science",
    )

    db.add(new_subject)

    print(
        f"Subject {subject['code']} added."
    )


# IMPORTANT: SAVE SUBJECTS
db.commit()


# ==========================================
# ROOMS
# ==========================================

room_data = [
    {
        "name": "E225",
        "room_type": "Classroom",
        "capacity": None,
        "status": "Available",
    },
    {
        "name": "E325",
        "room_type": "Laboratory",
        "capacity": None,
        "status": "Available",
    },
    {
        "name": "E322",
        "room_type": "Laboratory",
        "capacity": None,
        "status": "Available",
    },
    {
        "name": "E324",
        "room_type": "Laboratory",
        "capacity": None,
        "status": "Available",
    },
]


for room in room_data:

    existing_room = (
        db.query(models.Room)
        .filter(
            models.Room.name == room["name"]
        )
        .first()
    )

    if existing_room:
        print(
            f"Room {room['name']} already exists."
        )
        continue

    new_room = models.Room(
        name=room["name"],
        room_type=room["room_type"],
        capacity=room["capacity"],
        status=room["status"],
    )

    db.add(new_room)

    print(
        f"Room {room['name']} added."
    )


# IMPORTANT: SAVE ROOMS
db.commit()


# ==========================================
# TIME SLOTS
# ==========================================

time_slot_data = [
    {
        "slot_number": 1,
        "start_time": "08:30",
        "end_time": "09:25",
        "duration_minutes": 55,
        "is_break": False,
        "break_type": None,
    },
    {
        "slot_number": 2,
        "start_time": "09:25",
        "end_time": "10:20",
        "duration_minutes": 55,
        "is_break": False,
        "break_type": None,
    },
    {
        "slot_number": 3,
        "start_time": "10:20",
        "end_time": "10:30",
        "duration_minutes": 10,
        "is_break": True,
        "break_type": "Short Break",
    },
    {
        "slot_number": 4,
        "start_time": "10:30",
        "end_time": "11:25",
        "duration_minutes": 55,
        "is_break": False,
        "break_type": None,
    },
    {
        "slot_number": 5,
        "start_time": "11:25",
        "end_time": "12:20",
        "duration_minutes": 55,
        "is_break": True,
        "break_type": "Lunch Break",
    },
    {
        "slot_number": 6,
        "start_time": "12:20",
        "end_time": "13:15",
        "duration_minutes": 55,
        "is_break": False,
        "break_type": None,
    },
    {
        "slot_number": 7,
        "start_time": "13:15",
        "end_time": "14:10",
        "duration_minutes": 55,
        "is_break": False,
        "break_type": None,
    },
    {
        "slot_number": 8,
        "start_time": "14:10",
        "end_time": "15:05",
        "duration_minutes": 55,
        "is_break": False,
        "break_type": None,
    },
    {
        "slot_number": 9,
        "start_time": "15:05",
        "end_time": "15:10",
        "duration_minutes": 5,
        "is_break": True,
        "break_type": "Short Break",
    },
    {
        "slot_number": 10,
        "start_time": "15:10",
        "end_time": "16:00",
        "duration_minutes": 50,
        "is_break": False,
        "break_type": None,
    },
    {
        "slot_number": 11,
        "start_time": "16:00",
        "end_time": "16:50",
        "duration_minutes": 50,
        "is_break": False,
        "break_type": None,
    },
]


for slot in time_slot_data:

    existing_slot = (
        db.query(models.TimeSlot)
        .filter(
            models.TimeSlot.slot_number == slot["slot_number"]
        )
        .first()
    )

    if existing_slot:
        print(
            f"Time slot {slot['slot_number']} already exists."
        )
        continue

    new_slot = models.TimeSlot(
        slot_number=slot["slot_number"],
        start_time=slot["start_time"],
        end_time=slot["end_time"],
        duration_minutes=slot["duration_minutes"],
        is_break=slot["is_break"],
        break_type=slot["break_type"],
    )

    db.add(new_slot)

    print(
        f"Time slot {slot['slot_number']} added."
    )


# SAVE TIME SLOTS
db.commit()


# ==========================================
# WORKING DAYS
# ==========================================

working_days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
]


for day in working_days:

    existing_day = (
        db.query(models.WorkingDay)
        .filter(
            models.WorkingDay.day == day
        )
        .first()
    )

    if existing_day:
        print(
            f"{day} already exists."
        )
        continue

    new_day = models.WorkingDay(
        day=day,
        is_working=True
    )

    db.add(new_day)

    print(
        f"{day} added as working day."
    )


# SAVE WORKING DAYS
db.commit()


# ==========================================
# SUBJECT ASSIGNMENTS
# ==========================================

assignment_data = [

    # --------------------------------------
    # DAA THEORY
    # --------------------------------------

    {
        "subject_code": "2312311T",
        "faculty_id": "RD",
        "batch_name": None,
        "room_name": "E225",
    },

    # DAA LAB - A1
    {
        "subject_code": "2312311L",
        "faculty_id": "RD",
        "batch_name": "A1",
        "room_name": "E325",
    },

    # DAA LAB - A2
    {
        "subject_code": "2312311L",
        "faculty_id": "RD",
        "batch_name": "A2",
        "room_name": "E325",
    },

    # DAA LAB - A3
    {
        "subject_code": "2312311L",
        "faculty_id": "RD",
        "batch_name": "A3",
        "room_name": "E325",
    },


    # --------------------------------------
    # DL THEORY
    # --------------------------------------

    {
        "subject_code": "2312312T",
        "faculty_id": "LK",
        "batch_name": None,
        "room_name": "E225",
    },

    # DL LAB - A1
    {
        "subject_code": "2312312L",
        "faculty_id": "LK",
        "batch_name": "A1",
        "room_name": "E322",
    },

    # DL LAB - A2
    {
        "subject_code": "2312312L",
        "faculty_id": "LK",
        "batch_name": "A2",
        "room_name": "E322",
    },

    # DL LAB - A3
    {
        "subject_code": "2312312L",
        "faculty_id": "VW",
        "batch_name": "A3",
        "room_name": "E322",
    },


    # --------------------------------------
    # AgAI THEORY
    # --------------------------------------

    {
        "subject_code": "2312323T",
        "faculty_id": "PV",
        "batch_name": None,
        "room_name": "E225",
    },

    # AgAI LAB - A1
    {
        "subject_code": "2312323L",
        "faculty_id": "PV",
        "batch_name": "A1",
        "room_name": "E325",
    },

    # AgAI LAB - A2
    {
        "subject_code": "2312323L",
        "faculty_id": "PV",
        "batch_name": "A2",
        "room_name": "E325",
    },

    # AgAI LAB - A3
    {
        "subject_code": "2312323L",
        "faculty_id": "PV",
        "batch_name": "A3",
        "room_name": "E325",
    },


    # --------------------------------------
    # FULL STACK LAB
    # --------------------------------------

    {
        "subject_code": "2312362L",
        "faculty_id": "AK",
        "batch_name": "A1",
        "room_name": "E322",
    },

    # Full Stack - A2
    {
        "subject_code": "2312362L",
        "faculty_id": "AK",
        "batch_name": "A2",
        "room_name": "E322",
    },


    # --------------------------------------
    # MOBILE APP LAB
    # --------------------------------------

    {
        "subject_code": "2312363L",
        "faculty_id": "JD",
        "batch_name": "A3",
        "room_name": "E325",
    },
]


for assignment in assignment_data:

    subject = (
        db.query(models.Subject)
        .filter(
            models.Subject.code == assignment["subject_code"]
        )
        .first()
    )

    faculty = (
        db.query(models.Faculty)
        .filter(
            models.Faculty.faculty_id == assignment["faculty_id"]
        )
        .first()
    )

    room = (
        db.query(models.Room)
        .filter(
            models.Room.name == assignment["room_name"]
        )
        .first()
    )

    if not subject:
        print(
            f"Subject {assignment['subject_code']} not found."
        )
        continue

    if not faculty:
        print(
            f"Faculty {assignment['faculty_id']} not found."
        )
        continue

    if not room:
        print(
            f"Room {assignment['room_name']} not found."
        )
        continue

    existing_assignment = (
        db.query(models.SubjectAssignment)
        .filter(
            models.SubjectAssignment.subject_id == subject.id,
            models.SubjectAssignment.class_id == ty_class.id,
            models.SubjectAssignment.batch_name == assignment["batch_name"],
            models.SubjectAssignment.faculty_id == faculty.id,
            models.SubjectAssignment.room_id == room.id,
        )
        .first()
    )

    if existing_assignment:
        print(
            f"Assignment already exists: "
            f"{assignment['subject_code']} - "
            f"{assignment['batch_name']}"
        )
        continue

    new_assignment = models.SubjectAssignment(
        subject_id=subject.id,
        class_id=ty_class.id,
        batch_name=assignment["batch_name"],
        faculty_id=faculty.id,
        room_id=room.id,
    )

    db.add(new_assignment)

    print(
        f"Assignment added: "
        f"{assignment['subject_code']} | "
        f"{assignment['faculty_id']} | "
        f"{assignment['batch_name']} | "
        f"{assignment['room_name']}"
    )


# ==========================================
# FINAL SAVE
# ==========================================

db.commit()
db.close()


print("--------------------------------")
print("TY Data Science A setup complete")
print("Class: TY Data Science A")
print("Batches: A1, A2, A3")
print("Faculty: 6")
print("Subjects: 8")
print("Rooms: 4")
print("Time Slots: 11")
print("Working Days: Monday-Saturday")
print("Assignments: 15")
print("--------------------------------")