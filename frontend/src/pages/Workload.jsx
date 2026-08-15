import { useEffect, useState } from "react";

function Workload() {
  const [workloadData, setWorkloadData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOAD WORKLOAD FROM FASTAPI
  // ==========================================

  const loadWorkload = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8000/api/workload"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch workload data");
      }

      const data = await response.json();

      setWorkloadData(data);
    } catch (error) {
      console.error("Error fetching workload:", error);
      setWorkloadData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkload();
  }, []);

  // ==========================================
  // WORKLOAD STATUS COUNTS
  // ==========================================

  const balancedCount = workloadData.filter(
    (faculty) => faculty.status === "Balanced"
  ).length;

  const underloadedCount = workloadData.filter(
    (faculty) => faculty.status === "Underloaded"
  ).length;

  const overloadedCount = workloadData.filter(
    (faculty) => faculty.status === "Overloaded"
  ).length;

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
          <h1>Faculty Workload</h1>

          <p>
            Analyze and balance teaching workload
            for Data Science faculty.
          </p>
        </div>

      </div>


      {/* ======================================
          SUMMARY
      ====================================== */}

      <div className="workload-summary">

        <div className="summary-card">

          <span>
            Total Faculty
          </span>

          <strong>
            {workloadData.length}
          </strong>

        </div>


        <div className="summary-card">

          <span>
            Balanced
          </span>

          <strong>
            {balancedCount}
          </strong>

        </div>


        <div className="summary-card">

          <span>
            Underloaded
          </span>

          <strong>
            {underloadedCount}
          </strong>

        </div>


        <div className="summary-card">

          <span>
            Overloaded
          </span>

          <strong>
            {overloadedCount}
          </strong>

        </div>

      </div>


      {/* ======================================
          WORKLOAD TABLE
      ====================================== */}

      <div className="faculty-table">

        <div className="table-header workload-header">

          <span>
            Faculty
          </span>

          <span>
            Required Hours
          </span>

          <span>
            Assigned Hours
          </span>

          <span>
            Difference
          </span>

          <span>
            Status
          </span>

        </div>


        {/* Loading */}

        {loading ? (

          <div className="empty-state">

            <h3>
              Loading workload...
            </h3>

            <p>
              Getting workload information from the backend.
            </p>

          </div>

        ) : workloadData.length === 0 ? (

          /* Empty State */

          <div className="empty-state">

            <h3>
              No workload data available
            </h3>

            <p>
              Faculty and timetable information will appear
              here after the official Data Science data is added.
            </p>

          </div>

        ) : (

          /* Workload Rows */

          workloadData.map((faculty, index) => (

            <div
              className="table-row"
              key={faculty.id || index}
            >

              <span>
                {faculty.name}
              </span>

              <span>
                {faculty.required} hrs
              </span>

              <span>
                {faculty.assigned} hrs
              </span>

              <span>
                {faculty.difference} hrs
              </span>

              <span className="status">
                {faculty.status}
              </span>

            </div>

          ))

        )}

      </div>


      {/* ======================================
          WORKLOAD EXPLANATION
      ====================================== */}

      <div className="workload-info">

        <h2>
          How workload is calculated
        </h2>


        <div className="formula">
          Assigned Hours − Required Hours = Workload Difference
        </div>


        <div className="workload-rules">

          <div>

            <strong>
              Underloaded
            </strong>

            <p>
              Assigned hours are below the required workload.
            </p>

          </div>


          <div>

            <strong>
              Balanced
            </strong>

            <p>
              Assigned hours meet the required workload.
            </p>

          </div>


          <div>

            <strong>
              Overloaded
            </strong>

            <p>
              Assigned hours exceed the required workload.
            </p>

          </div>

        </div>

      </div>

    </main>
  );
}

export default Workload;