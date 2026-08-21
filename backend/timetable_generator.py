from database.database import SessionLocal
from database import models


# ============================================================
# CONFIGURATION
# ============================================================

WORKING_DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
]


# ============================================================
# ACTUAL COLLEGE PERIODS
# ============================================================
#
# These are the REAL periods from your college timetable.
#
# Theory:
#   Uses 1 period
#
# Lab:
#   Uses 2 consecutive periods
#
# Breaks are NOT included as teaching periods.
# ============================================================

PERIODS = [
    ("08:30", "09:25"),
    ("09:25", "10:20"),

    # 10:20 - 10:30 SHORT BREAK

    ("10:30", "11:25"),

    # 11:25 - 12:20 LUNCH

    ("12:20", "13:15"),
    ("13:15", "14:10"),
    ("14:10", "15:05"),

    # 15:05 - 15:10 SHORT BREAK

    ("15:10", "16:00"),
    ("16:00", "16:50"),
]


# ============================================================
# TIME HELPERS
# ============================================================

def time_to_minutes(value):

    hour, minute = map(
        int,
        value.split(":")
    )

    return hour * 60 + minute


def overlaps(
    start1,
    end1,
    start2,
    end2
):

    return (
        time_to_minutes(start1)
        < time_to_minutes(end2)
        and
        time_to_minutes(end1)
        > time_to_minutes(start2)
    )


# ============================================================
# POSSIBLE SLOTS
# ============================================================

def get_possible_slots(duration):

    slots = []

    # --------------------------------------------------------
    # THEORY
    # --------------------------------------------------------
    #
    # Database requirement = 60 minutes
    #
    # Actual college period = 55 minutes
    #
    # Therefore display the actual college period.
    # --------------------------------------------------------

    if duration == 60:

        for i, period in enumerate(PERIODS):

            slots.append({

                "start": period[0],

                "end": period[1],

                "period_indexes": [i]

            })


    # --------------------------------------------------------
    # LAB
    # --------------------------------------------------------
    #
    # Database requirement = 120 minutes
    #
    # Actual college block = 2 consecutive periods.
    #
    # We therefore use two consecutive periods.
    # --------------------------------------------------------

    elif duration == 120:

        for i in range(
            len(PERIODS) - 1
        ):

            first = PERIODS[i]

            second = PERIODS[i + 1]


            # Two periods must be directly consecutive.
            if first[1] != second[0]:

                continue


            slots.append({

                "start": first[0],

                "end": second[1],

                "period_indexes": [
                    i,
                    i + 1
                ]

            })


    return slots


# ============================================================
# CONFLICT CHECK
# ============================================================

def has_conflict(
    db,
    day,
    start,
    end,
    faculty_id,
    room_id,
    class_id,
    batch_name
):

    entries = (
        db.query(models.Timetable)
        .filter(
            models.Timetable.day == day
        )
        .all()
    )


    for entry in entries:

        old_start, old_end = (
            entry.time_slot.split(" - ")
        )


        # ----------------------------------------------------
        # TIME OVERLAP
        # ----------------------------------------------------

        if not overlaps(
            start,
            end,
            old_start,
            old_end
        ):

            continue


        # ----------------------------------------------------
        # FACULTY CONFLICT
        # ----------------------------------------------------

        if entry.faculty_id == faculty_id:

            return True


        # ----------------------------------------------------
        # ROOM CONFLICT
        # ----------------------------------------------------

        if entry.room_id == room_id:

            return True


        # ----------------------------------------------------
        # CLASS / BATCH CONFLICT
        # ----------------------------------------------------

        if entry.class_id != class_id:

            continue


        # Existing entry is ALL
        if entry.batch_name is None:

            return True


        # New entry is ALL
        if batch_name is None:

            return True


        # Same batch
        if entry.batch_name == batch_name:

            return True


    return False


# ============================================================
# FACULTY WORKLOAD
# ============================================================

def faculty_hours_used(
    db,
    faculty_id
):

    entries = (
        db.query(models.Timetable)
        .filter(
            models.Timetable.faculty_id
            == faculty_id
        )
        .all()
    )


    total_minutes = 0


    for entry in entries:

        total_minutes += (
            entry.duration_minutes
        )


    return total_minutes / 60


# ============================================================
# FIND VALID SLOT
# ============================================================

def find_slot(
    db,
    assignment,
    subject,
    faculty,
    room,
    class_id
):

    possible_slots = get_possible_slots(
        subject.duration_minutes
    )


    required_hours = (
        subject.duration_minutes / 60
    )


    for day in WORKING_DAYS:

        for slot in possible_slots:

            start = slot["start"]

            end = slot["end"]


            # ------------------------------------------------
            # FACULTY WORKLOAD CHECK
            # ------------------------------------------------

            used_hours = faculty_hours_used(
                db,
                faculty.id
            )


            if (
                used_hours
                + required_hours
                > faculty.max_hours
            ):

                continue


            # ------------------------------------------------
            # CONFLICT CHECK
            # ------------------------------------------------

            if has_conflict(
                db,
                day,
                start,
                end,
                faculty.id,
                room.id,
                class_id,
                assignment.batch_name
            ):

                continue


            return (
                day,
                start,
                end
            )


    return None


# ============================================================
# GENERATE TIMETABLE
# ============================================================

def generate_ty_timetable():

    db = SessionLocal()


    try:

        print(
            "----------------------------------------"
        )

        print(
            "TY DATA SCIENCE A TIMETABLE GENERATOR"
        )

        print(
            "----------------------------------------"
        )


        # ====================================================
        # GET TY CLASS
        # ====================================================

        ty_class = (
            db.query(models.Class)
            .filter(
                models.Class.year == "TY",
                models.Class.division == "A",
                models.Class.department
                == "Data Science"
            )
            .first()
        )


        if not ty_class:

            print(
                "TY Data Science A not found."
            )

            return


        # ====================================================
        # CLEAR PREVIOUS TIMETABLE
        # ====================================================

        db.query(
            models.Timetable
        ).delete()

        db.commit()


        # ====================================================
        # GET ASSIGNMENTS
        # ====================================================

        assignments = (
            db.query(
                models.SubjectAssignment
            )
            .filter(
                models.SubjectAssignment.class_id
                == ty_class.id
            )
            .all()
        )


        if not assignments:

            print(
                "No subject assignments found."
            )

            return


        # ====================================================
        # LOAD SUBJECTS
        # ====================================================

        subject_map = {}

        for assignment in assignments:

            subject = (
                db.query(models.Subject)
                .filter(
                    models.Subject.id
                    == assignment.subject_id
                )
                .first()
            )

            subject_map[
                assignment.subject_id
            ] = subject


        # ====================================================
        # LABS FIRST
        # ====================================================
        #
        # Labs need 2 consecutive periods.
        # Theory has more flexibility.
        # ====================================================

        assignments.sort(

            key=lambda assignment:
                subject_map[
                    assignment.subject_id
                ].duration_minutes,

            reverse=True
        )


        generated = 0

        failed = 0


        # ====================================================
        # GENERATE EACH ASSIGNMENT
        # ====================================================

        for assignment in assignments:


            subject = subject_map[
                assignment.subject_id
            ]


            faculty = (
                db.query(models.Faculty)
                .filter(
                    models.Faculty.id
                    == assignment.faculty_id
                )
                .first()
            )


            room = (
                db.query(models.Room)
                .filter(
                    models.Room.id
                    == assignment.room_id
                )
                .first()
            )


            # ------------------------------------------------
            # VALIDATION
            # ------------------------------------------------

            if (
                not subject
                or not faculty
                or not room
            ):

                print(
                    f"Skipping assignment "
                    f"{assignment.id}"
                )

                failed += 1

                continue


            # ------------------------------------------------
            # FIND SLOT
            # ------------------------------------------------

            result = find_slot(

                db,

                assignment,

                subject,

                faculty,

                room,

                ty_class.id
            )


            # ------------------------------------------------
            # NO SLOT
            # ------------------------------------------------

            if result is None:

                print(
                    f"NO SLOT: "
                    f"{subject.code} "
                    f"{assignment.batch_name or 'ALL'}"
                )

                failed += 1

                continue


            day, start, end = result


            # =================================================
            # CREATE TIMETABLE ENTRY
            # =================================================

            new_entry = models.Timetable(

                day=day,

                time_slot=(
                    f"{start} - {end}"
                ),

                class_id=ty_class.id,

                class_name=(
                    "TY Data Science A"
                ),

                batch_name=(
                    assignment.batch_name
                ),

                subject_id=subject.id,

                subject=subject.name,

                faculty_id=faculty.id,

                faculty=faculty.name,

                room_id=room.id,

                room=room.name,

                duration_minutes=(
                    subject.duration_minutes
                ),
            )


            db.add(new_entry)

            db.commit()


            generated += 1


            print(

                f"✓ {day} | "
                f"{start}-{end} | "
                f"{subject.name} | "
                f"{assignment.batch_name or 'ALL'} | "
                f"{faculty.name} | "
                f"{room.name}"

            )


        # ====================================================
        # FINAL RESULT
        # ====================================================

        print(
            "----------------------------------------"
        )

        print(
            "GENERATION COMPLETE"
        )

        print(
            "Generated:",
            generated
        )

        print(
            "Failed:",
            failed
        )

        print(
            "----------------------------------------"
        )


    finally:

        db.close()


# ============================================================
# RUN
# ============================================================

if __name__ == "__main__":

    generate_ty_timetable()