import { departmentData } from "../data/departmentData";

function Classes() {
  const classes = departmentData.classes;

  return (
    <main className="page">
      <div className="page-header">
        <div>
          <h1>Classes</h1>
          <p>Manage Data Science academic classes.</p>
        </div>
      </div>

      <div className="class-summary">
        <div className="summary-card">
          <span>Total Classes</span>
          <strong>{classes.length}</strong>
        </div>

        <div className="summary-card">
          <span>Department</span>
          <strong>{departmentData.department}</strong>
        </div>

        <div className="summary-card">
          <span>College</span>
          <strong>{departmentData.shortName}</strong>
        </div>
      </div>

      <div className="class-grid">
        {classes.map((item) => (
          <div className="class-card" key={item.id}>
            <div className="class-icon">DS</div>

            <h2>{item.year}</h2>

            <p>{item.name}</p>

            <span className="status">Active</span>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Classes;