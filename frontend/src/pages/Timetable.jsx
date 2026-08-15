import { useEffect, useState } from "react";

function Timetable() {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ];

  const timeSlots = [
    "08:00 - 09:00",
    "09:00 - 10:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "12:00 - 01:00",
    "02:00 - 03:00",
    "03:00 - 04:00",
    "04:00 - 05:00",
  ];

  const [timetableData, setTimetableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [selectedYear, setSelectedYear] = useState("3rd Year");
  const [selectedClass, setSelectedClass] = useState("");

  // ==========================================
  // LOAD TIMETABLE FROM FASTAPI
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

      setTimetableData(data);
    } catch (error) {
      console.error("Error fetching timetable:", error);
      setTimetableData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTimetable();
  }, []);

  // ==========================================
  // GENERATE TIMETABLE
  // ==========================================

  const handleGenerate = async () => {
    try {
      setGenerating(true);

      /*
       * For now this is only a placeholder.
       *
       * The actual intelligent timetable algorithm
       * will be connected after we receive:
       *
       * Faculty
       * Classes
       * Subjects
       * Rooms
       * Faculty workload
       * College time constraints
       */

      alert(
        "Timetable generation will be activated after the official college data is added."
      );

    } catch (error) {
      console.error("Error generating timetable:", error);
    } finally {
      setGenerating(false);
    }
  };

  // ==========================================
  // FIND TIMETABLE ENTRY
  // ==========================================

  const getSlotData = (day, time) => {
    return timetableData.find(
      (item) =>
        item.day === day &&
        item.time === time
    );
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <main className="page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="page-header">

        <div>

          <h1>
            Timetable
          </h1>

          <p>
            Data Science department timetable management.
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
          CONTROLS
      ====================================== */}

      <div className="timetable-controls">

        {/* Department */}

        <select>
          <option>
            Data Science
          </option>
        </select>


        {/* Year */}

        <select
          value={selectedYear}
          onChange={(e) =>
            setSelectedYear(e.target.value)
          }
        >

          <option>
            3rd Year
          </option>

          <option>
            2nd Year
          </option>

          <option>
            1st Year
          </option>

        </select>


        {/* Class */}

        <select
          value={selectedClass}
          onChange={(e) =>
            setSelectedClass(e.target.value)
          }
        >

          <option value="">
            Select Class
          </option>

          <option value="Data Science - 1st Year">
            Data Science - 1st Year
          </option>

          <option value="Data Science - 2nd Year">
            Data Science - 2nd Year
          </option>

          <option value="Data Science - 3rd Year">
            Data Science - 3rd Year
          </option>

        </select>

      </div>


      {/* ======================================
          TIMETABLE
      ====================================== */}

      <div className="timetable-container">

        {loading ? (

          <div className="empty-state">

            <h3>
              Loading timetable...
            </h3>

            <p>
              Getting timetable information from the backend.
            </p>

          </div>

        ) : (

          <table className="timetable">

            <thead>

              <tr>

                <th>
                  Time
                </th>

                {days.map((day) => (

                  <th key={day}>
                    {day}
                  </th>

                ))}

              </tr>

            </thead>


            <tbody>

              {timeSlots.map((time) => (

                <tr key={time}>

                  <td className="time-cell">
                    {time}
                  </td>


                  {days.map((day) => {

                    const slot = getSlotData(
                      day,
                      time
                    );

                    return (

                      <td key={day}>

                        {slot ? (

                          <div className="timetable-slot">

                            <strong>
                              {slot.subject}
                            </strong>

                            <small>
                              {slot.faculty}
                            </small>

                            <small>
                              {slot.room}
                            </small>

                          </div>

                        ) : (

                          <div className="empty-slot">
                            Free
                          </div>

                        )}

                      </td>

                    );

                  })}

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>


      {/* ======================================
          INFORMATION
      ====================================== */}

      {timetableData.length === 0 && !loading && (

        <div className="workload-info">

          <h2>
            Intelligent Timetable Generation
          </h2>

          <p>
            The timetable will be generated using
            faculty workload, subjects, classes,
            rooms, available time slots and
            timetable constraints.
          </p>

        </div>

      )}

    </main>
  );
}

export default Timetable;