from database.database import SessionLocal
from database import models


db = SessionLocal()

rows = db.query(models.Timetable).all()

print("----------------------------------------")
print("TIMETABLE VALIDATION")
print("----------------------------------------")

print("Total entries:", len(rows))
print()


def to_minutes(value):
    hour, minute = map(int, value.split(":"))
    return hour * 60 + minute


def overlap(a_start, a_end, b_start, b_end):
    return (
        to_minutes(a_start) < to_minutes(b_end)
        and
        to_minutes(a_end) > to_minutes(b_start)
    )


# ============================================================
# CONFLICT CHECKS
# ============================================================

faculty_conflicts = []
room_conflicts = []
batch_conflicts = []
all_conflicts = []


for i in range(len(rows)):

    a = rows[i]

    a_start, a_end = a.time_slot.split(" - ")


    for j in range(i + 1, len(rows)):

        b = rows[j]

        if a.day != b.day:
            continue


        b_start, b_end = b.time_slot.split(" - ")


        if not overlap(
            a_start,
            a_end,
            b_start,
            b_end
        ):
            continue


        # ----------------------------------------------------
        # FACULTY
        # ----------------------------------------------------

        if (
            a.faculty_id == b.faculty_id
        ):

            faculty_conflicts.append(
                (a, b)
            )


        # ----------------------------------------------------
        # ROOM
        # ----------------------------------------------------

        if (
            a.room_id == b.room_id
        ):

            room_conflicts.append(
                (a, b)
            )


        # ----------------------------------------------------
        # SAME BATCH
        # ----------------------------------------------------

        if (
            a.class_id == b.class_id
            and
            a.batch_name is not None
            and
            b.batch_name is not None
            and
            a.batch_name == b.batch_name
        ):

            batch_conflicts.append(
                (a, b)
            )


        # ----------------------------------------------------
        # ALL THEORY VS BATCH
        # ----------------------------------------------------

        if (
            a.class_id == b.class_id
            and
            (
                a.batch_name is None
                or
                b.batch_name is None
            )
        ):

            all_conflicts.append(
                (a, b)
            )


# ============================================================
# BREAK CHECK
# ============================================================

break_conflicts = []

for row in rows:

    start, end = row.time_slot.split(" - ")

    start_m = to_minutes(start)
    end_m = to_minutes(end)

    # 10:20 - 10:30
    if start_m < 630 and end_m > 620:

        break_conflicts.append(row)

    # Lunch: 11:25 - 12:20
    if start_m < 740 and end_m > 685:

        break_conflicts.append(row)

    # 15:05 - 15:10
    if start_m < 910 and end_m > 905:

        break_conflicts.append(row)


# ============================================================
# FACULTY WORKLOAD
# ============================================================

faculty_hours = {}

for row in rows:

    faculty_hours.setdefault(
        row.faculty,
        0
    )

    faculty_hours[row.faculty] += (
        row.duration_minutes / 60
    )


workload_conflicts = []

faculty_list = db.query(
    models.Faculty
).all()


for faculty in faculty_list:

    used = faculty_hours.get(
        faculty.name,
        0
    )

    if used > faculty.max_hours:

        workload_conflicts.append(
            (
                faculty.name,
                used,
                faculty.max_hours
            )
        )


# ============================================================
# PRINT RESULTS
# ============================================================

print(
    "Faculty conflicts:",
    len(faculty_conflicts)
)

print(
    "Room conflicts:",
    len(room_conflicts)
)

print(
    "Batch conflicts:",
    len(batch_conflicts)
)

print(
    "ALL-class conflicts:",
    len(all_conflicts)
)

print(
    "Break violations:",
    len(break_conflicts)
)

print(
    "Faculty workload violations:",
    len(workload_conflicts)
)

print()


# ============================================================
# DETAILS
# ============================================================

if faculty_conflicts:

    print("FACULTY CONFLICTS")

    for a, b in faculty_conflicts:

        print(
            a.day,
            a.time_slot,
            "|",
            a.faculty
        )

        print(
            "  ",
            a.subject,
            "|",
            a.batch_name
        )

        print(
            "  ",
            b.subject,
            "|",
            b.batch_name
        )


if room_conflicts:

    print()
    print("ROOM CONFLICTS")

    for a, b in room_conflicts:

        print(
            a.day,
            a.time_slot,
            "|",
            a.room
        )

        print(
            "  ",
            a.subject,
            "|",
            a.batch_name
        )

        print(
            "  ",
            b.subject,
            "|",
            b.batch_name
        )


if batch_conflicts:

    print()
    print("BATCH CONFLICTS")

    for a, b in batch_conflicts:

        print(
            a.day,
            a.time_slot,
            "|",
            a.batch_name
        )

        print(
            "  ",
            a.subject
        )

        print(
            "  ",
            b.subject
        )


if all_conflicts:

    print()
    print("ALL-CLASS CONFLICTS")

    for a, b in all_conflicts:

        print(
            a.day,
            a.time_slot,
            "|",
            a.subject,
            "|",
            a.batch_name or "ALL"
        )

        print(
            "  ",
            b.subject,
            "|",
            b.batch_name or "ALL"
        )


if workload_conflicts:

    print()
    print("WORKLOAD VIOLATIONS")

    for name, used, maximum in workload_conflicts:

        print(
            name,
            "used:",
            used,
            "hours | maximum:",
            maximum
        )


print()
print("----------------------------------------")


total_conflicts = (
    len(faculty_conflicts)
    + len(room_conflicts)
    + len(batch_conflicts)
    + len(all_conflicts)
    + len(break_conflicts)
    + len(workload_conflicts)
)


if total_conflicts == 0:

    print("TIMETABLE VALID")

else:

    print(
        "TIMETABLE HAS",
        total_conflicts,
        "ISSUES"
    )


print("----------------------------------------")


db.close()