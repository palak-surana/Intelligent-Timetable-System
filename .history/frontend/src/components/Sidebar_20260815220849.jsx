import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>Timetable AI</h2>

      <nav>
        <NavLink to="/" className="nav-item">
          Dashboard
        </NavLink>

        <NavLink to="/faculty" className="nav-item">
          Faculty
        </NavLink>

        <NavLink to="/classes" className="nav-item">
          Classes
        </NavLink>

        <NavLink to="/subjects" className="nav-item">
          Subjects
        </NavLink>

        <NavLink to="/timetable" className="nav-item">
          Timetable
        </NavLink>

        <NavLink to="/workload" className="nav-item">
          Workload
        </NavLink>

        <NavLink to="/rooms" className="nav-item">
          Rooms
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;