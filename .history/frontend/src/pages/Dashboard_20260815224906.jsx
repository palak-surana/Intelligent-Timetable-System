import { departmentData } from "../data/departmentData";

function Dashboard() {
  const data = departmentData;

  return (
    <main className="dashboard">

      <h1>Dashboard</h1>

      <p className="welcome">
        Intelligent Faculty Workload-Based Timetable Generation System
      </p>

      <div className="stats">

        <div className="card">
          <h2>{data.classes.length}</h2>
          <p>Classes</p>
        </div>

        <div className="card">
          <h2>{data.faculty.length}</h2>
          <p>Faculty</p>
        </div>

        <div className="card">
          <h2>{data.subjects.length}</h2>
          <p>Subjects</p>
        </div>

        <div className="card">
          <h2>{data.rooms.length}</h2>
          <p>Rooms</p>
        </div>

      </div>

      <div className="department-card">

        <h2>{data.department} Department</h2>

        <p>{data.college}</p>

        <div className="classes">

          {data.classes.map((item) => (
            <div key={item.id}>
              {item.year}
            </div>
          ))}

        </div>

      </div>

    </main>
  );
}

export default Dashboard;