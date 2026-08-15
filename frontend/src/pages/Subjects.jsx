import { useEffect, useState } from "react";

function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const subjectTypes = [
    {
      type: "Theory",
      description: "Regular classroom-based subjects",
    },
    {
      type: "Practical",
      description: "Laboratory and practical sessions",
    },
  ];

  // ==========================================
  // LOAD SUBJECTS FROM FASTAPI
  // ==========================================

  const loadSubjects = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8000/api/subjects"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch subjects");
      }

      const data = await response.json();

      setSubjects(data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  // ==========================================
  // UI
  // ==========================================

  return (
    <main className="page">

      {/* Header */}

      <div className="page-header">

        <div>
          <h1>Subjects</h1>

          <p>
            Manage subjects, teaching hours and subject types.
          </p>
        </div>

        <button className="primary-button">
          + Add Subject
        </button>

      </div>


      {/* Summary */}

      <div className="subject-summary">

        <div className="summary-card">
          <span>Total Subjects</span>

          <strong>
            {subjects.length}
          </strong>
        </div>


        <div className="summary-card">
          <span>Theory</span>

          <strong>
            {
              subjects.filter(
                (subject) =>
                  subject.type === "Theory"
              ).length
            }
          </strong>
        </div>


        <div className="summary-card">
          <span>Practical</span>

          <strong>
            {
              subjects.filter(
                (subject) =>
                  subject.type === "Practical"
              ).length
            }
          </strong>
        </div>


        <div className="summary-card">
          <span>Department</span>

          <strong>
            Data Science
          </strong>
        </div>

      </div>


      {/* Subject Types */}

      <div className="subject-types">

        {subjectTypes.map((item) => (

          <div
            className="subject-type-card"
            key={item.type}
          >

            <div className="subject-icon">
              {item.type === "Theory" ? "T" : "P"}
            </div>

            <div>
              <h2>
                {item.type}
              </h2>

              <p>
                {item.description}
              </p>
            </div>

          </div>

        ))}

      </div>


      {/* Subject Table */}

      <div className="faculty-table">

        <div className="table-header subject-header">

          <span>
            Subject Code
          </span>

          <span>
            Subject Name
          </span>

          <span>
            Type
          </span>

          <span>
            Weekly Hours
          </span>

          <span>
            Faculty
          </span>

        </div>


        {/* Loading */}

        {loading ? (

          <div className="empty-state">

            <h3>
              Loading subjects...
            </h3>

            <p>
              Getting subject information from the backend.
            </p>

          </div>

        ) : subjects.length === 0 ? (

          /* Empty State */

          <div className="empty-state">

            <h3>
              No subjects added yet
            </h3>

            <p>
              Add your Data Science subjects when the
              official subject information is available.
            </p>

          </div>

        ) : (

          /* Subject Rows */

          subjects.map((subject, index) => (

            <div
              className="table-row"
              key={subject.id || index}
            >

              <span>
                {subject.code}
              </span>

              <span>
                <strong>
                  {subject.name}
                </strong>
              </span>

              <span>
                {subject.type}
              </span>

              <span>
                {subject.weeklyHours} hrs/week
              </span>

              <span>
                {subject.faculty || "Not assigned"}
              </span>

            </div>

          ))

        )}

      </div>

    </main>
  );
}

export default Subjects;