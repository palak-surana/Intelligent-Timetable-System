function Classes() {
  const classes = [
    {
      year: "1st Year",
      department: "Data Science",
      status: "Active",
    },
    {
      year: "2nd Year",
      department: "Data Science",
      status: "Active",
    },
    {
      year: "3rd Year",
      department: "Data Science",
      status: "Active",
    },
  ];

  return (
    <main className="page">

      <div className="page-header">
        <div>
          <h1>Classes</h1>
          <p>
            Manage Data Science classes and academic divisions.
          </p>
        </div>
      </div>

      <div className="class-summary">
        <div className="summary-card">
          <span>Total Classes</span>
          <strong>{classes.length}</strong>
        </div>

        <div className="summary-card">
          <span>Department</span>
          <strong>Data Science</strong>
        </div>

        <div className="summary-card">
          <span>Active Classes</span>
          <strong>{classes.length}</strong>
        </div>
      </div>

      <div className="class-grid">

        {classes.map((item) => (
          <div className="class-card" key={item.year}>

            <div className="class-icon">
              DS
            </div>

            <div>
              <h2>{item.year}</h2>
              <p>{item.department}</p>
            </div>

            <span className="status">
              {item.status}
            </span>

          </div>
        ))}

      </div>

    </main>
  );
}

export default Classes;