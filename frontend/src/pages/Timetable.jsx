import { useEffect, useMemo, useState } from "react";
import mitLogo from "../assets/mit-logo.png";

function Timetable() {
  // ==========================================
  // DAYS
  // ==========================================

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // ==========================================
  // OFFICIAL COLLEGE TIME STRUCTURE
  //
  // Theory  = 55 minutes
  // Lab     = 110 minutes visually
  // Breaks  = fixed columns
  // ==========================================

  const columns = [
    {
      id: "p1",
      label: "8:30 to 9:25",
      start: "08:30",
      end: "09:25",
      type: "period",
    },
    {
      id: "p2",
      label: "9:25 to 10:20",
      start: "09:25",
      end: "10:20",
      type: "period",
    },
    {
      id: "b1",
      label: "10:20 to 10:30",
      start: "10:20",
      end: "10:30",
      type: "break",
      breakType: "SHORT BREAK",
    },
    {
      id: "p3",
      label: "10:30 to 11:25",
      start: "10:30",
      end: "11:25",
      type: "period",
    },
    {
      id: "p4",
      label: "11:25 to 12:20",
      start: "11:25",
      end: "12:20",
      type: "period",
    },
    {
      id: "p5",
      label: "12:20 to 13:15",
      start: "12:20",
      end: "13:15",
      type: "period",
    },
    {
      id: "p6",
      label: "13:15 to 14:10",
      start: "13:15",
      end: "14:10",
      type: "period",
    },
    {
      id: "p7",
      label: "14:10 to 15:05",
      start: "14:10",
      end: "15:05",
      type: "period",
    },
    {
      id: "b2",
      label: "15:05 to 15:10",
      start: "15:05",
      end: "15:10",
      type: "break",
      breakType: "SHORT BREAK",
    },
    {
      id: "p8",
      label: "15:10 to 16:00",
      start: "15:10",
      end: "16:00",
      type: "period",
    },
    {
      id: "p9",
      label: "16:00 to 16:50",
      start: "16:00",
      end: "16:50",
      type: "period",
    },
    {
      id: "b3",
      label: "16:50 to 16:55",
      start: "16:50",
      end: "16:55",
      type: "break",
      breakType: "SHORT BREAK",
    },
    {
      id: "p10",
      label: "16:55 to 17:45",
      start: "16:55",
      end: "17:45",
      type: "period",
    },
    {
      id: "p11",
      label: "17:45 to 18:25",
      start: "17:45",
      end: "18:25",
      type: "period",
    },
  ];

  // ==========================================
  // STATES
  // ==========================================

  const [timetableData, setTimetableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [selectedYear, setSelectedYear] = useState("3rd Year");
  const [selectedClass, setSelectedClass] = useState(
    "TY Data Science A"
  );

  // ==========================================
  // LOAD TIMETABLE
  // ==========================================

  const loadTimetable = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8000/api/timetable"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch timetable");
      }

      const data = await response.json();

      console.log("TIMETABLE DATA:", data);

      setTimetableData(data);
    } catch (error) {
      console.error(
        "Error fetching timetable:",
        error
      );

      setTimetableData([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD ON PAGE OPEN
  // ==========================================

  useEffect(() => {
    loadTimetable();
  }, []);

  // ==========================================
  // GENERATE / REFRESH
  // ==========================================

  const handleGenerate = async () => {
    try {
      setGenerating(true);

      const response = await fetch(
        "http://127.0.0.1:8000/api/generate-timetable",
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Timetable generation failed"
        );
      }

      await loadTimetable();

      alert(
        "TY Data Science A timetable generated successfully."
      );
    } catch (error) {
      console.error(
        "Generation error:",
        error
      );

      alert(
        "Unable to generate timetable. Check the backend terminal."
      );
    } finally {
      setGenerating(false);
    }
  };

  // ==========================================
  // FILTER SELECTED CLASS
  // ==========================================

  const filteredTimetable = useMemo(() => {
    if (!selectedClass) {
      return timetableData;
    }

    return timetableData.filter(
      (item) =>
        item.className === selectedClass
    );
  }, [
    timetableData,
    selectedClass,
  ]);

  // ==========================================
  // CONVERT HH:MM TO MINUTES
  // ==========================================

  const toMinutes = (time) => {
    if (!time) return 0;

    const [hours, minutes] =
      time.split(":").map(Number);

    return hours * 60 + minutes;
  };

  // ==========================================
  // EXTRACT START / END FROM API TIME
  //
  // Example:
  // "08:30 - 10:20"
  // ==========================================

  const getTimeRange = (timeSlot) => {
    if (!timeSlot) {
      return null;
    }

    const parts = timeSlot
      .split("-")
      .map((value) => value.trim());

    if (parts.length !== 2) {
      return null;
    }

    return {
      start: parts[0],
      end: parts[1],
    };
  };

  // ==========================================
  // CHECK WHETHER ENTRY OCCUPIES COLUMN
  // ==========================================

  const entryOverlapsColumn = (
    entry,
    column
  ) => {
    const range = getTimeRange(
      entry.timeSlot
    );

    if (!range) {
      return false;
    }

    const entryStart = toMinutes(
      range.start
    );

    const entryEnd = toMinutes(
      range.end
    );

    const columnStart = toMinutes(
      column.start
    );

    const columnEnd = toMinutes(
      column.end
    );

    return (
      entryStart < columnEnd &&
      entryEnd > columnStart
    );
  };

  // ==========================================
  // FIND ENTRY STARTING AT THIS COLUMN
  // ==========================================

  const getStartingEntry = (
    day,
    column
  ) => {
    return filteredTimetable.find(
      (entry) => {
        if (entry.day !== day) {
          return false;
        }

        const range = getTimeRange(
          entry.timeSlot
        );

        if (!range) {
          return false;
        }

        return (
          toMinutes(range.start) ===
          toMinutes(column.start)
        );
      }
    );
  };

  // ==========================================
  // CHECK IF THIS COLUMN IS INSIDE
  // AN ALREADY RENDERED ENTRY
  // ==========================================

  const isInsidePreviousEntry = (
    day,
    columnIndex
  ) => {
    const column = columns[columnIndex];

    return filteredTimetable.some(
      (entry) => {
        if (entry.day !== day) {
          return false;
        }

        const range = getTimeRange(
          entry.timeSlot
        );

        if (!range) {
          return false;
        }

        const startIndex =
          columns.findIndex(
            (item) =>
              item.type === "period" &&
              toMinutes(item.start) ===
                toMinutes(range.start)
          );

        const endIndex =
          columns.findIndex(
            (item) =>
              item.type === "period" &&
              toMinutes(item.end) ===
                toMinutes(range.end)
          );

        if (
          startIndex === -1 ||
          endIndex === -1
        ) {
          return false;
        }

        return (
          columnIndex > startIndex &&
          columnIndex <= endIndex &&
          entryOverlapsColumn(
            entry,
            column
          )
        );
      }
    );
  };

  // ==========================================
  // CALCULATE COLSPAN
  //
  // 08:30-10:20 => 2 columns
  // 12:20-14:10 => 2 columns
  // 15:10-16:50 => 2 columns
  // Theory       => 1 column
  // ==========================================

  const getColSpan = (entry) => {
    const range = getTimeRange(
      entry.timeSlot
    );

    if (!range) {
      return 1;
    }

    const startMinutes =
      toMinutes(range.start);

    const endMinutes =
      toMinutes(range.end);

    const matchingColumns =
      columns.filter((column) => {
        if (column.type !== "period") {
          return false;
        }

        const columnStart =
          toMinutes(column.start);

        const columnEnd =
          toMinutes(column.end);

        return (
          startMinutes <= columnStart &&
          endMinutes >= columnEnd
        );
      });

    return Math.max(
      matchingColumns.length,
      1
    );
  };

  // ==========================================
  // SHORT FACULTY NAME
  // ==========================================

  const getFacultyShortName = (
    faculty
  ) => {
    if (!faculty) {
      return "";
    }

    const name = faculty
      .replace("Mrs. ", "")
      .replace("Mr. ", "")
      .replace("Dr. ", "");

    const parts = name.split(" ");

    if (parts.length < 2) {
      return name;
    }

    const firstInitial =
      parts[0].charAt(0).toUpperCase();

    const lastName =
      parts[parts.length - 1];

    return `${firstInitial}${lastName}`;
  };

  // ==========================================
  // SUBJECT SHORT NAME
  // ==========================================

  const getSubjectShortName = (
    subject
  ) => {
    if (!subject) {
      return "";
    }

    const shortNames = {
      "Design Analysis of Algorithms Lab":
        "DAA Lab",

      "Design Analysis of Algorithms (DAA)":
        "DAA",

      "Deep Learning Lab":
        "DL Lab",

      "Deep Learning and Large Language Models (DL)":
        "DL",

      "Agentic AI Foundation Lab":
        "AgAI Lab",

      "Agentic AI Foundation (AgAI)":
        "AgAI",

      "AI-Powered Full Stack Development (FD)":
        "AI-FD",

      "AI-First Mobile Application Development (MAD)":
        "AI-MAD",
    };

    return (
      shortNames[subject] ||
      subject
    );
  };

  // ==========================================
  // RENDER ENTRY
  // ==========================================

  const renderEntry = (entry) => {
    const isLab =
      entry.durationMinutes >= 100;

    return (
      <div
        className={
          isLab
            ? "mit-timetable-entry lab-entry"
            : "mit-timetable-entry theory-entry"
        }
      >
        <strong>
          {getSubjectShortName(
            entry.subject
          )}
        </strong>

        <span>
          {entry.batchName === "ALL"
            ? "ALL"
            : entry.batchName}
        </span>

        <span>
          {getFacultyShortName(
            entry.faculty
          )}
        </span>

        <span>
          {entry.room}
        </span>
      </div>
    );
  };

  // ==========================================
  // COURSE SUMMARY
  // ==========================================

  const theorySubjects =
    useMemo(() => {
      const map = new Map();

      filteredTimetable
        .filter(
          (item) =>
            item.batchName === "ALL" &&
            item.durationMinutes < 100
        )
        .forEach((item) => {
          if (!map.has(item.subject)) {
            map.set(item.subject, {
              code: "—",
              name: item.subject,
              teacher: item.faculty,
              room: item.room,
            });
          }
        });

      return Array.from(map.values());
    }, [filteredTimetable]);

  const labSubjects =
    useMemo(() => {
      const map = new Map();

      filteredTimetable
        .filter(
          (item) =>
            item.durationMinutes >= 100
        )
        .forEach((item) => {
          if (!map.has(item.subject)) {
            map.set(item.subject, {
              code: "—",
              name: item.subject,
              teachers: [],
              batches: [],
              rooms: [],
            });
          }

          const subject =
            map.get(item.subject);

          if (
            !subject.teachers.includes(
              item.faculty
            )
          ) {
            subject.teachers.push(
              item.faculty
            );
          }

          if (
            item.batchName !== "ALL" &&
            !subject.batches.includes(
              item.batchName
            )
          ) {
            subject.batches.push(
              item.batchName
            );
          }

          if (
            !subject.rooms.includes(
              item.room
            )
          ) {
            subject.rooms.push(
              item.room
            );
          }
        });

      return Array.from(map.values());
    }, [filteredTimetable]);

  // ==========================================
  // UI
  // ==========================================

  return (
    <main className="page">

      {/* ======================================
          TOP CONTROLS
      ====================================== */}

      <div className="page-header">

        <div>
          <h1>Timetable</h1>

          <p>
            TY Data Science A — Class Wise
            Timetable
          </p>
        </div>

        <button
          className="primary-button"
          onClick={handleGenerate}
          disabled={generating}
        >
          {generating
            ? "Generating..."
            : "Generate Timetable"}
        </button>

      </div>


      {/* ======================================
          FILTERS
      ====================================== */}

      <div className="timetable-controls">

        <select>
          <option>
            Data Science
          </option>
        </select>

        <select
          value={selectedYear}
          onChange={(e) =>
            setSelectedYear(
              e.target.value
            )
          }
        >
          <option value="3rd Year">
            3rd Year
          </option>

          <option value="2nd Year">
            2nd Year
          </option>

          <option value="1st Year">
            1st Year
          </option>
        </select>

        <select
          value={selectedClass}
          onChange={(e) =>
            setSelectedClass(
              e.target.value
            )
          }
        >
          <option value="TY Data Science A">
            TY Data Science A
          </option>

          <option value="">
            All Classes
          </option>
        </select>

      </div>


      {/* ======================================
          OFFICIAL TIMETABLE
      ====================================== */}

      <div className="mit-timetable-wrapper">

        {loading ? (

          <div className="empty-state">
            <h3>
              Loading timetable...
            </h3>

            <p>
              Getting TY timetable from
              backend.
            </p>
          </div>

        ) : filteredTimetable.length === 0 ? (

          <div className="empty-state">
            <h3>
              No timetable found
            </h3>

            <p>
              Generate the TY timetable
              first.
            </p>
          </div>

        ) : (

          <div className="mit-timetable">

            {/* ==================================
                OFFICIAL HEADER
            ================================== */}

            <div className="mit-header">

              {/* LEFT: MIT LOGO / COLLEGE */}
              <div className="mit-college-block">

                <img
                  src={mitLogo}
                  alt="MIT Academy of Engineering"
                  className="mit-logo-image"
                />

                <div className="mit-college-text">
                  <div className="mit-college-name">
                    Academy of Engineering
                  </div>

                  <div className="mit-affiliation">
                    (An Autonomous Institute Affiliated to Savitribai Phule Pune University)
                  </div>
                </div>

                <div className="mit-location">
                  Alandi (D), Pune - 412 105
                </div>

                <div className="mit-department">
                  DEPARTMENT OF COMPUTER SCIENCE &amp; ENGINEERING
                  (DATA SCIENCE)
                </div>

              </div>


              {/* CENTER: TITLE + ACADEMIC DETAILS */}
              <div className="mit-title-block">

                <div className="mit-main-title">
                  CLASS WISE TIME TABLE
                </div>

                <div className="mit-academic-row">
                  <div className="mit-academic-label">
                    ACADEMIC YEAR
                  </div>

                  <div className="mit-colon">:</div>

                  <div className="mit-academic-value">
                    2026-2027
                  </div>
                </div>

                <div className="mit-academic-row">
                  <div className="mit-academic-label">
                    SEMESTER
                  </div>

                  <div className="mit-colon">:</div>

                  <div className="mit-academic-value">
                    V
                  </div>
                </div>

                <div className="mit-academic-row">
                  <div className="mit-academic-label">
                    W.E.F.
                  </div>

                  <div className="mit-colon">:</div>

                  <div className="mit-academic-value">
                    —
                  </div>
                </div>

              </div>


              {/* RIGHT: CLASS INFORMATION */}
              <div className="mit-right-details">

                <div className="mit-info-row">
                  <strong>CLASS</strong>
                  <span>:</span>
                  <span>TY B.Tech (Data Science)</span>
                </div>

                <div className="mit-info-row">
                  <strong>CLASS COORDINATOR</strong>
                  <span>:</span>
                  <span>Mrs. Aparna Kulkarni (ASK)</span>
                </div>

                <div className="mit-info-row">
                  <strong>DIVISION</strong>
                  <span>:</span>
                  <span>A</span>
                </div>

                <div className="mit-info-row">
                  <strong>THEORY</strong>
                  <span>:</span>
                  <span>{theorySubjects.length}</span>
                </div>

                <div className="mit-info-row">
                  <strong>PRACTICAL / TUTORIAL</strong>
                  <span>:</span>
                  <span>{labSubjects.length}</span>
                </div>

                <div className="mit-info-row">
                  <strong>TOTAL</strong>
                  <span>:</span>
                  <span>{filteredTimetable.length}</span>
                </div>

              </div>

            </div>


            {/* ==================================
                TABLE
            ================================== */}

            <div className="mit-table-scroll">

              <table className="mit-class-table">

                <thead>

                  <tr>

                    <th
                      className="day-header"
                      rowSpan="2"
                    >
                      Day
                    </th>

                    <th
                      className="time-main-header"
                      colSpan={columns.length}
                    >
                      Time
                    </th>

                  </tr>

                  <tr>

                    {columns.map(
                      (column, index) => (
                        <th
                          key={column.id}
                          className={
                            column.type === "break"
                              ? "break-header time-column-header"
                              : "time-column-header"
                          }
                        >
                          <div>{column.label}</div>
                          <small>{index + 1}</small>
                        </th>
                      )
                    )}

                  </tr>

                </thead>


                <tbody>

                  {days.map((day) => {

                    let skipColumns =
                      new Set();

                    return (
                      <tr key={day}>

                        <td className="day-cell">
                          {day.substring(
                            0,
                            3
                          ).toUpperCase()}
                        </td>


                        {columns.map(
                          (
                            column,
                            columnIndex
                          ) => {

                            if (
                              skipColumns.has(
                                columnIndex
                              )
                            ) {
                              return null;
                            }

                            // ====================
                            // BREAK COLUMN
                            // ====================

                            if (
                              column.type ===
                              "break"
                            ) {
                              return (
                                <td
                                  key={
                                    column.id
                                  }
                                  className="break-cell"
                                >
                                  <div>
                                    {column.breakType}
                                  </div>
                                </td>
                              );
                            }

                            // ====================
                            // CHECK IF PREVIOUS
                            // ENTRY ALREADY OWNS
                            // THIS COLUMN
                            // ====================

                            if (
                              isInsidePreviousEntry(
                                day,
                                columnIndex
                              )
                            ) {
                              return null;
                            }

                            // ====================
                            // FIND ENTRY
                            // ====================

                            const entry =
                              getStartingEntry(
                                day,
                                column
                              );

                            // ====================
                            // EMPTY CELL
                            // ====================

                            if (!entry) {
                              return (
                                <td
                                  key={
                                    column.id
                                  }
                                  className="free-cell"
                                >
                                  <span>
                                    Free
                                  </span>
                                </td>
                              );
                            }

                            // ====================
                            // COLSPAN
                            // ====================

                            const span =
                              getColSpan(
                                entry
                              );

                            // Mark columns
                            // occupied by
                            // this entry
                            for (
                              let i = 1;
                              i < span;
                              i++
                            ) {
                              skipColumns.add(
                                columnIndex +
                                  i
                              );
                            }

                            return (
                              <td
                                key={
                                  column.id
                                }
                                colSpan={span}
                                className="occupied-cell"
                              >
                                {renderEntry(
                                  entry
                                )}
                              </td>
                            );
                          }
                        )}

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>


            {/* ==================================
                LEGEND
            ================================== */}

            <div className="mit-legend">

              <span>
                <b>ALL</b>
                = Entire Class
              </span>

              <span>
                <b>A1</b>
                = Batch A1
              </span>

              <span>
                <b>A2</b>
                = Batch A2
              </span>

              <span>
                <b>A3</b>
                = Batch A3
              </span>

              <span>
                <b>Lab</b>
                = 2-Hour Practical
              </span>

            </div>


            {/* ==================================
                COURSE INFORMATION
            ================================== */}

            <div className="course-information">

              {/* THEORY COURSES */}
              <div className="course-section theory-section">
                <h3>Theory Courses</h3>

                <table>
                  <thead>
                    <tr>
                      <th>Course Code</th>
                      <th>Course Name</th>
                      <th>Course Teacher</th>
                      <th>Class Room No.</th>
                    </tr>
                  </thead>

                  <tbody>
                    {theorySubjects.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="no-data">
                          No theory courses found.
                        </td>
                      </tr>
                    ) : (
                      theorySubjects.map((subject, index) => (
                        <tr key={index}>
                          <td>{subject.code}</td>
                          <td>{subject.name}</td>
                          <td>{subject.teacher}</td>
                          <td>{subject.room}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* PRACTICAL / LAB COURSES */}
              <div className="course-section lab-section">
                <h3>Practical / Lab Courses</h3>

                <table>
                  <thead>
                    <tr>
                      <th>Lab Course Code</th>
                      <th>Lab Course</th>
                      <th>Lab Course Teacher Name</th>
                      <th>Batch</th>
                      <th>Lab Name</th>
                    </tr>
                  </thead>

                  <tbody>
                    {labSubjects.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="no-data">
                          No practical courses found.
                        </td>
                      </tr>
                    ) : (
                      labSubjects.map((subject, index) => (
                        <tr key={index}>
                          <td>{subject.code}</td>
                          <td>{subject.name}</td>
                          <td>{subject.teachers.join(", ")}</td>
                          <td>{subject.batches.join(", ")}</td>
                          <td>{subject.rooms.join(", ")}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>


            {/* ==================================
                FOOTER
            ================================== */}

            <div className="mit-footer">

              <div>
                <strong>
                  Total Entries:
                </strong>{" "}
                {filteredTimetable.length}
              </div>

              <div>
                <strong>
                  Working Days:
                </strong>{" "}
                Monday - Saturday
              </div>

              <div>
                <strong>
                  Status:
                </strong>{" "}
                Generated & Validated
              </div>

            </div>

          </div>
        )}

      </div>

    </main>
  );
}

export default Timetable;

