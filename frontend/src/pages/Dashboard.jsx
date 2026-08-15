import { useEffect, useState } from "react";

function Dashboard() {
  const [classes, setClasses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOAD DASHBOARD DATA FROM FASTAPI
  // ==========================================

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);

        const [
          classesResponse,
          facultyResponse,
          subjectsResponse,
          roomsResponse,
        ] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/classes"),
          fetch("http://127.0.0.1:8000/api/faculty"),
          fetch("http://127.0.0.1:8000/api/subjects"),
          fetch("http://127.0.0.1:8000/api/rooms"),
        ]);

        if (
          !classesResponse.ok ||
          !facultyResponse.ok ||
          !subjectsResponse.ok ||
          !roomsResponse.ok
        ) {
          throw new Error("Failed to load dashboard data");
        }

        const classesData = await classesResponse.json();
        const facultyData = await facultyResponse.json();
        const subjectsData = await subjectsResponse.json();
        const roomsData = await roomsResponse.json();

        setClasses(classesData);
        setFaculty(facultyData);
        setSubjects(subjectsData);
        setRooms(roomsData);

      } catch (error) {
        console.error(
          "Error loading dashboard data:",
          error
        );

        setClasses([]);
        setFaculty([]);
        setSubjects([]);
        setRooms([]);

      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // ==========================================
  // UI
  // ==========================================

  return (
    <main className="dashboard">

      {/* ======================================
          HEADER
      ====================================== */}

      <h1>
        Dashboard
      </h1>

      <p className="welcome">
        Intelligent Faculty Workload-Based
        Timetable Generation System
      </p>


      {/* ======================================
          STATISTICS
      ====================================== */}

      <div className="stats">

        {/* Classes */}

        <div className="card">

          <h2>
            {loading ? "..." : classes.length}
          </h2>

          <p>
            Classes
          </p>

        </div>


        {/* Faculty */}

        <div className="card">

          <h2>
            {loading ? "..." : faculty.length}
          </h2>

          <p>
            Faculty
          </p>

        </div>


        {/* Subjects */}

        <div className="card">

          <h2>
            {loading ? "..." : subjects.length}
          </h2>

          <p>
            Subjects
          </p>

        </div>


        {/* Rooms */}

        <div className="card">

          <h2>
            {loading ? "..." : rooms.length}
          </h2>

          <p>
            Rooms
          </p>

        </div>

      </div>


      {/* ======================================
          DEPARTMENT
      ====================================== */}

      <div className="department-card">

        <h2>
          Data Science Department
        </h2>

        <p>
          Intelligent Faculty Workload-Based
          Timetable Generation System
        </p>


        {/* Classes */}

        <div className="classes">

          {loading ? (

            <div>
              Loading classes...
            </div>

          ) : classes.length === 0 ? (

            <div>
              No class data available yet.
            </div>

          ) : (

            classes.map((item, index) => (

              <div
                key={item.id || item.year || index}
              >
                {item.year}
              </div>

            ))

          )}

        </div>

      </div>

    </main>
  );
}

export default Dashboard;