import { useEffect, useState } from "react";

function Classes() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOAD CLASSES FROM FASTAPI
  // ==========================================

  const loadClasses = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8000/api/classes"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch classes");
      }

      const data = await response.json();

      setClasses(data);
    } catch (error) {
      console.error("Error fetching classes:", error);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  // ==========================================
  // UI
  // ==========================================

  return (
    <main className="page">

      {/* Header */}

      <div className="page-header">

        <div>

          <h1>Classes</h1>

          <p>
            Manage Data Science classes and academic divisions.
          </p>

        </div>

      </div>


      {/* Summary */}

      <div className="class-summary">

        <div className="summary-card">

          <span>
            Total Classes
          </span>

          <strong>
            {classes.length}
          </strong>

        </div>


        <div className="summary-card">

          <span>
            Department
          </span>

          <strong>
            Data Science
          </strong>

        </div>


        <div className="summary-card">

          <span>
            Active Classes
          </span>

          <strong>
            {
              classes.filter(
                (item) => item.status === "Active"
              ).length
            }
          </strong>

        </div>

      </div>


      {/* Class Grid */}

      <div className="class-grid">

        {loading ? (

          <div className="empty-state">

            <h3>
              Loading classes...
            </h3>

            <p>
              Getting class information from the backend.
            </p>

          </div>

        ) : classes.length === 0 ? (

          <div className="empty-state">

            <h3>
              No classes available
            </h3>

            <p>
              Class information will appear here when
              the college data is added.
            </p>

          </div>

        ) : (

          classes.map((item, index) => (

            <div
              className="class-card"
              key={item.id || item.year || index}
            >

              <div className="class-icon">
                DS
              </div>


              <div>

                <h2>
                  {item.year}
                </h2>

                <p>
                  {item.department}
                </p>

              </div>


              <span className="status">
                {item.status}
              </span>

            </div>

          ))

        )}

      </div>

    </main>
  );
}

export default Classes;