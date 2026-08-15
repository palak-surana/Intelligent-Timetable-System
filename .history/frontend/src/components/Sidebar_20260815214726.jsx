function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>Timetable AI</h2>

      <nav>
        <div className="nav-item active">Dashboard</div>
        <div className="nav-item">Faculty</div>
        <div className="nav-item">Classes</div>
        <div className="nav-item">Subjects</div>
        <div className="nav-item">Timetable</div>
        <div className="nav-item">Workload</div>
        <div className="nav-item">Rooms</div>
      </nav>
    </aside>
  );
}

export default Sidebar;