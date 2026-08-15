import { useEffect, useState } from "react";

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOAD ROOMS FROM FASTAPI
  // ==========================================

  const loadRooms = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8000/api/rooms"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch rooms");
      }

      const data = await response.json();

      setRooms(data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  return (
    <main className="page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="page-header">

        <div>
          <h1>Rooms & Labs</h1>

          <p>
            Manage classrooms and laboratories used
            for timetable generation.
          </p>
        </div>

        <button className="primary-button">
          + Add Room
        </button>

      </div>


      {/* ======================================
          SUMMARY
      ====================================== */}

      <div className="room-summary">

        <div className="summary-card">

          <span>
            Total Rooms
          </span>

          <strong>
            {rooms.length}
          </strong>

        </div>


        <div className="summary-card">

          <span>
            Classrooms
          </span>

          <strong>
            {
              rooms.filter(
                (room) => room.type === "Classroom"
              ).length
            }
          </strong>

        </div>


        <div className="summary-card">

          <span>
            Laboratories
          </span>

          <strong>
            {
              rooms.filter(
                (room) => room.type === "Laboratory"
              ).length
            }
          </strong>

        </div>


        <div className="summary-card">

          <span>
            Available
          </span>

          <strong>
            {
              rooms.filter(
                (room) => room.status === "Available"
              ).length
            }
          </strong>

        </div>

      </div>


      {/* ======================================
          ROOM GRID
      ====================================== */}

      <div className="room-grid">

        {loading ? (

          <div className="empty-state">

            <h3>
              Loading rooms...
            </h3>

            <p>
              Getting room information from the backend.
            </p>

          </div>

        ) : rooms.length === 0 ? (

          <div className="empty-state">

            <h3>
              No rooms added yet
            </h3>

            <p>
              Room and laboratory information will appear
              here when the official college data is available.
            </p>

          </div>

        ) : (

          rooms.map((room, index) => (

            <div
              className="room-card"
              key={room.id || room.name || index}
            >

              <div className="room-icon">

                {room.type === "Classroom"
                  ? "C"
                  : "L"}

              </div>


              <h2>
                {room.name}
              </h2>


              <p>
                <strong>
                  Type:
                </strong>{" "}
                {room.type}
              </p>


              <p>
                <strong>
                  Capacity:
                </strong>{" "}
                {room.capacity || "Not specified"}
              </p>


              <span className="status">
                {room.status}
              </span>

            </div>

          ))

        )}

      </div>

    </main>
  );
}

export default Rooms;