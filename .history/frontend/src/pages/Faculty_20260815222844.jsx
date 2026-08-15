import { useState } from "react";

function Faculty() {
  const [showForm, setShowForm] = useState(false);

  return (
    <main className="page">
      <div className="page-header">
        <div>
          <h1>Faculty Management</h1>
          <p>Manage Data Science faculty and their teaching workload.</p>
        </div>

        <button
          className="primary-button"
          onClick={() => setShowForm(!showForm)}
        >
          + Add Faculty
        </button>
      </div>

      {showForm && (
        <div className="faculty-form">
          <h2>Add Faculty</h2>

          <div className="form-grid">
            <input type="text" placeholder="Faculty Name" />
            <input type="text" placeholder="Faculty ID" />
            <input type="email" placeholder="Email" />

            <select>
              <option value="">Select Designation</option>
              <option>Professor</option>
              <option>Associate Professor</option>
              <option>Assistant Professor</option>
            </select>

            <input
              type="number"
              placeholder="Maximum Weekly Hours"
            />

            <select>
              <option value="">Select Department</option>
              <option>Data Science</option>
            </select>
          </div>

          <button className="save-button">
            Save Faculty
          </button>
        </div>
      )}

      <div className="faculty-summary">
        <div className="summary-card">
          <span>Total Faculty</span>
          <strong>0</strong>
        </div>

        <div className="summary-card">
          <span>Available</span>
          <strong>0</strong>
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

      <div className="faculty-table">
        <div className="table-header">
          <span>Faculty ID</span>
          <span>Name</span>
          <span>Designation</span>
          <span>Max Hours</span>
          <span>Status</span>
        </div>

        <div className="empty-state">
          <h3>No faculty added yet</h3>
          <p>
            Add your Data Science faculty to start building the
            workload system.
          </p>
        </div>
      </div>
    </main>
  );
}

export default Faculty;