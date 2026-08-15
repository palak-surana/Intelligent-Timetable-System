function Timetable() {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const timeSlots = [
    "08:00 - 09:00",
    "09:00 - 10:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "12:00 - 01:00",
    "02:00 - 03:00",
    "03:00 - 04:00",
    "04:00 - 05:00",
  ];

  return (
    <main className="page">

      <div className="page-header">
        <div>
          <h1>Timetable</h1>
          <p>
            Data Science department timetable management.
          </p>
        </div>

        <button className="primary-button">
          Generate Timetable
        </button>
      </div>

      <div className="timetable-controls">

        <select>
          <option>Data Science</option>
        </select>

        <select>
          <option>3rd Year</option>
          <option>2nd Year</option>
          <option>1st Year</option>
        </select>

        <select>
          <option>Select Class</option>
          <option>Data Science - 1st Year</option>
          <option>Data Science - 2nd Year</option>
          <option>Data Science - 3rd Year</option>
        </select>

      </div>

      <div className="timetable-container">

        <table className="timetable">

          <thead>
            <tr>
              <th>Time</th>

              {days.map((day) => (
                <th key={day}>{day}</th>
              ))}

            </tr>
          </thead>

          <tbody>

            {timeSlots.map((time) => (
              <tr key={time}>

                <td className="time-cell">
                  {time}
                </td>

                {days.map((day) => (
                  <td key={day}>
                    <div className="empty-slot">
                      Free
                    </div>
                  </td>
                ))}

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </main>
  );
}

export default Timetable;