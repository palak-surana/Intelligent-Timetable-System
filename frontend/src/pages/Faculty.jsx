import { useState } from "react";

function Faculty() {
  const [showForm, setShowForm] = useState(false);

  const [facultyList, setFacultyList] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    facultyId: "",
    email: "",
    designation: "",
    maxHours: "",
    department: "Data Science",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.facultyId ||
      !formData.email ||
      !formData.designation ||
      !formData.maxHours
    ) {
      alert("Please fill all fields.");
      return;
    }

    const newFaculty = {
      ...formData,
      id: Date.now(),
    };

    setFacultyList([...facultyList, newFaculty]);

    setFormData({
      name: "",
      facultyId: "",
      email: "",
      designation: "",
      maxHours: "",
      department: "Data Science",
    });

    setShowForm(false);
  };

  const handleDelete = (id) => {
    setFacultyList(
      facultyList.filter((faculty) => faculty.id !== id)
    );
  };

  return (
    <main className="page">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Faculty Management</h1>
          <p>
            Manage Data Science faculty and their teaching workload.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Close Form" : "+ Add Faculty"}
        </button>
      </div>

      {/* Add Faculty Form */}
      {showForm && (
        <form className="faculty-form" onSubmit={handleSave}>
          <h2>Add Faculty</h2>

          <div className="form-grid">

            <input
              type="text"
              name="name"
              placeholder="Faculty Name"
              value={formData.name}
              onChange={handleChange}
            />

            <input
              type="text"
              name="facultyId"
              placeholder="Faculty ID"
              value={formData.facultyId}
              onChange={handleChange}
            />

            <input
              type="email"
              name="email"
              placeholder="Faculty Email"
              value={formData.email}
              onChange={handleChange}
            />

            <select
              name="designation"
              value={formData.designation}
              onChange={handleChange}
            >
              <option value="">Select Designation</option>
              <option value="Professor">Professor</option>
              <option value="Associate Professor">
                Associate Professor
              </option>
              <option value="Assistant Professor">
                Assistant Professor
              </option>
            </select>

            <input
              type="number"
              name="maxHours"
              placeholder="Maximum Weekly Hours"
              value={formData.maxHours}
              onChange={handleChange}
            />

            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
            >
              <option value="Data Science">Data Science</option>
            </select>

          </div>

          <button type="submit" className="save-button">
            Save Faculty
          </button>
        </form>
      )}

      {/* Summary Cards */}
      <div className="faculty-summary">

        <div className="summary-card">
          <span>Total Faculty</span>
          <strong>{facultyList.length}</strong>
        </div>

        <div className="summary-card">
          <span>Available</span>
          <strong>{facultyList.length}</strong>
        </div>

        <div className="summary-card">
          <span>Underloaded</span>
          <strong>0</strong>
        </div>

        <div className="summary-card">
          <span>Overloaded</span>
          <strong>0</strong>
        </div>

      </div>

      {/* Faculty Table */}
      <div className="faculty-table">

        <div className="table-header">
          <span>Faculty ID</span>
          <span>Name</span>
          <span>Designation</span>
          <span>Max Hours</span>
          <span>Action</span>
        </div>

        {facultyList.length === 0 ? (

          <div className="empty-state">
            <h3>No faculty added yet</h3>
            <p>
              Add your Data Science faculty to start building
              the workload system.
            </p>
          </div>

        ) : (

          facultyList.map((faculty) => (
            <div className="table-row" key={faculty.id}>

              <span>{faculty.facultyId}</span>

              <span>
                <strong>{faculty.name}</strong>
                <small>{faculty.email}</small>
              </span>

              <span>{faculty.designation}</span>

              <span>{faculty.maxHours} hrs/week</span>

              <button
                className="delete-button"
                onClick={() => handleDelete(faculty.id)}
              >
                Delete
              </button>

            </div>
          ))

        )}

      </div>

    </main>
  );
}

export default Faculty;