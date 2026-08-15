function Dashboard() {
  return (
    <main className="dashboard">
      <h1>Dashboard</h1>

      <p className="welcome">
        Intelligent Faculty Workload-Based Timetable Generation System
      </p>

      <div className="stats">
        <div className="card">
          <h2>3</h2>
          <p>Classes</p>
        </div>

        <div className="card">
          <h2>0</h2>
          <p>Faculty</p>
        </div>

        <div className="card">
          <h2>0</h2>
          <p>Subjects</p>
        </div>

        <div className="card">
          <h2>1</h2>
          <p>Classroom</p>
        </div>
      </div>

      <div className="department-card">
        <h2>Data Science Department</h2>

        <div className="classes">
          <div>1st Year</div>
          <div>2nd Year</div>
          <div>3rd Year</div>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;