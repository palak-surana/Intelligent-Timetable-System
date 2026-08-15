import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>Timetable AI</h2>

      <nav>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/faculty"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Faculty
        </NavLink>

        <NavLink
          to="/classes"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Classes
        </NavLink>

        <NavLink
          to="/subjects"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Subjects
        </NavLink>

        <NavLink
          to="/timetable"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Timetable
        </NavLink>

        <NavLink
          to="/workload"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Workload
        </NavLink>

        <NavLink
          to="/rooms"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Rooms
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;