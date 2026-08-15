function Workload() {
  const workloadData = [];

  return (
    <main className="page">

      <div className="page-header">
        <div>
          <h1>Faculty Workload</h1>
          <p>
            Analyze and balance teaching workload for Data Science faculty.
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="workload-summary">

        <div className="summary-card">
          <span>Total Faculty</span>
          <strong>{workloadData.length}</strong>
        </div>

        <div className="summary-card">
          <span>Balanced</span>
          <strong>0</strong>
        </div>

        <div className="summary-card">
          <span>Underloaded</span>
          <strong>0</strong>
        </div>

        <div className="summary-card">
          <span>Overloaded</span>
          <strong>0</strong>
        </div>

      </div>

      {/* Workload Table */}
      <div className="faculty-table">

        <div className="table-header workload-header">
          <span>Faculty</span>
          <span>Required Hours</span>
          <span>Assigned Hours</span>
          <span>Difference</span>
          <span>Status</span>
        </div>

        {workloadData.length === 0 ? (

          <div className="empty-state">
            <h3>No workload data available</h3>
            <p>
              Faculty and timetable information will appear here
              after the official Data Science data is added.
            </p>
          </div>

        ) : (

          workloadData.map((faculty) => (
            <div className="table-row" key={faculty.id}>
              <span>{faculty.name}</span>
              <span>{faculty.required} hrs</span>
              <span>{faculty.assigned} hrs</span>
              <span>{faculty.difference} hrs</span>
              <span>{faculty.status}</span>
            </div>
          ))

        )}

      </div>

      {/* Explanation */}
      <div className="workload-info">

        <h2>How workload is calculated</h2>

        <div className="formula">
          Assigned Hours − Required Hours = Workload Difference
        </div>

        <div className="workload-rules">

          <div>
            <strong>Underloaded</strong>
            <p>Assigned hours are below the required workload.</p>
          </div>

          <div>
            <strong>Balanced</strong>
            <p>Assigned hours meet the required workload.</p>
          </div>

          <div>
            <strong>Overloaded</strong>
            <p>Assigned hours exceed the required workload.</p>
          </div>

        </div>

      </div>

    </main>
  );
}

export default Workload;