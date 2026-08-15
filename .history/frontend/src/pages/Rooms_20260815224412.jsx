function Rooms() {
  const rooms = [
    {
      name: "Data Science Classroom",
      type: "Classroom",
      capacity: "Not specified",
      status: "Available",
    },
  ];

  return (
    <main className="page">

      <div className="page-header">
        <div>
          <h1>Rooms & Labs</h1>
          <p>
            Manage classrooms and laboratories used for timetable generation.
          </p>
        </div>

        <button className="primary-button">
          + Add Room
        </button>
      </div>

      <div className="room-summary">

        <div className="summary-card">
          <span>Total Rooms</span>
          <strong>{rooms.length}</strong>
        </div>

        <div className="summary-card">
          <span>Classrooms</span>
          <strong>
            {rooms.filter((room) => room.type === "Classroom").length}
          </strong>
        </div>

        <div className="summary-card">
          <span>Laboratories</span>
          <strong>
            {rooms.filter((room) => room.type === "Laboratory").length}
          </strong>
        </div>

        <div className="summary-card">
          <span>Available</span>
          <strong>
            {rooms.filter((room) => room.status === "Available").length}
          </strong>
        </div>

      </div>

      <div className="room-grid">

        {rooms.map((room) => (
          <div className="room-card" key={room.name}>

            <div className="room-icon">
              {room.type === "Classroom" ? "C" : "L"}
            </div>

            <h2>{room.name}</h2>

            <p>
              <strong>Type:</strong> {room.type}
            </p>

            <p>
              <strong>Capacity:</strong> {room.capacity}
            </p>

            <span className="status">
              {room.status}
            </span>

          </div>
        ))}

      </div>

    </main>
  );
}

export default Rooms;