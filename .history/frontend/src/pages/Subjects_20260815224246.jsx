function Subjects() {
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

  return (
    <main className="page">

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

      <div className="subject-summary">

        <div className="summary-card">
          <span>Total Subjects</span>
          <strong>0</strong>
        </div>

        <div className="summary-card">
          <span>Theory</span>
          <strong>0</strong>
        </div>

        <div className="summary-card">
          <span>Practical</span>
          <strong>0</strong>
        </div>

        <div className="summary-card">
          <span>Department</span>
          <strong>Data Science</strong>
        </div>

      </div>

      <div className="subject-types">

        {subjectTypes.map((item) => (
          <div className="subject-type-card" key={item.type}>
            <div className="subject-icon">
              {item.type === "Theory" ? "T" : "P"}
            </div>

            <div>
              <h2>{item.type}</h2>
              <p>{item.description}</p>
            </div>
          </div>
        ))}

      </div>

      <div className="faculty-table">

        <div className="table-header subject-header">
          <span>Subject Code</span>
          <span>Subject Name</span>
          <span>Type</span>
          <span>Weekly Hours</span>
          <span>Faculty</span>
        </div>

        <div className="empty-state">
          <h3>No subjects added yet</h3>
          <p>
            Add your Data Science subjects when the official
            subject information is available.
          </p>
        </div>

      </div>

    </main>
  );
}

export default Subjects;