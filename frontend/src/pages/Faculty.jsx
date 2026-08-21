import { useEffect, useState } from "react";

function Faculty() {
  const [showForm, setShowForm] = useState(false);

  const [facultyList, setFacultyList] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    facultyId: "",
    email: "",
    designation: "",
    maxHours: "",
    department: "Data Science",
  });

  // ==========================================
  // LOAD FACULTY FROM FASTAPI
  // ==========================================

  const loadFaculty = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8000/api/faculty"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch faculty data");
      }

      const data = await response.json();

      setFacultyList(data);
    } catch (error) {
      console.error("Error fetching faculty:", error);

      setFacultyList([]);
    } finally {
      setLoading(false);
    }
  };

  // Load faculty when page opens
  useEffect(() => {
    loadFaculty();
  }, []);

  // ==========================================
  // FORM INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setFormData({
      name: "",
      facultyId: "",
      email: "",
      designation: "",
      maxHours: "",
      department: "Data Science",
    });
  };

  // ==========================================
  // SAVE FACULTY TO FASTAPI
  // ==========================================

  const handleSave = async (e) => {
    e.preventDefault();

    // Validate form
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

    const facultyData = {
      name: formData.name,
      facultyId: formData.facultyId,
      email: formData.email,
      designation: formData.designation,
      maxHours: Number(formData.maxHours),
      department: formData.department,
    };

    try {
      setSaving(true);

      const response = await fetch(
        "http://127.0.0.1:8000/api/faculty",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(facultyData),
        }
      );

      const result = await response.json();

      // Backend error
      if (!response.ok) {
        throw new Error(
          result.detail || "Failed to save faculty"
        );
      }

      console.log(
        "Faculty saved successfully:",
        result
      );

      // Reload from database
      await loadFaculty();

      // Reset form
      resetForm();

      // Close form
      setShowForm(false);

      alert("Faculty added successfully!");

    } catch (error) {
      console.error(
        "Error saving faculty:",
        error
      );

      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE FACULTY FROM FASTAPI
  // ==========================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this faculty?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingId(id);

      const response = await fetch(
        `http://127.0.0.1:8000/api/faculty/${id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.detail || "Failed to delete faculty"
        );
      }

      console.log(
        "Faculty deleted:",
        result
      );

      // Reload from database
      await loadFaculty();

      alert("Faculty deleted successfully!");

    } catch (error) {
      console.error(
        "Error deleting faculty:",
        error
      );

      alert(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // WORKLOAD STATUS
  // ==========================================

  const getUnderloadedCount = () => {
    return facultyList.filter(
      (faculty) =>
        Number(faculty.maxHours) < 10
    ).length;
  };

  const getOverloadedCount = () => {
    return facultyList.filter(
      (faculty) =>
        Number(faculty.maxHours) > 20
    ).length;
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <main className="page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="page-header">

        <div>
          <h1>Faculty Management</h1>

          <p>
            Manage Data Science faculty and
            their teaching workload.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() =>
            setShowForm(!showForm)
          }
        >
          {showForm
            ? "Close Form"
            : "+ Add Faculty"}
        </button>

      </div>


      {/* ======================================
          ADD FACULTY FORM
      ====================================== */}

      {showForm && (
        <form
          className="faculty-form"
          onSubmit={handleSave}
        >

          <h2>Add Faculty</h2>

          <div className="form-grid">

            {/* Faculty Name */}

            <input
              type="text"
              name="name"
              placeholder="Faculty Name"
              value={formData.name}
              onChange={handleChange}
            />


            {/* Faculty ID */}

            <input
              type="text"
              name="facultyId"
              placeholder="Faculty ID"
              value={formData.facultyId}
              onChange={handleChange}
            />


            {/* Email */}

            <input
              type="email"
              name="email"
              placeholder="Faculty Email"
              value={formData.email}
              onChange={handleChange}
            />


            {/* Designation */}

            <select
              name="designation"
              value={formData.designation}
              onChange={handleChange}
            >

              <option value="">
                Select Designation
              </option>

              <option value="Professor">
                Professor
              </option>

              <option value="Associate Professor">
                Associate Professor
              </option>

              <option value="Assistant Professor">
                Assistant Professor
              </option>

            </select>


            {/* Maximum Weekly Hours */}

            <input
              type="number"
              name="maxHours"
              placeholder="Maximum Weekly Hours"
              value={formData.maxHours}
              onChange={handleChange}
              min="1"
              max="60"
            />


            {/* Department */}

            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
            >

              <option value="Data Science">
                Data Science
              </option>

            </select>

          </div>


          {/* Save Button */}

          <button
            type="submit"
            className="save-button"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Faculty"}
          </button>

        </form>
      )}


      {/* ======================================
          SUMMARY CARDS
      ====================================== */}

      <div className="faculty-summary">

        <div className="summary-card">
          <span>Total Faculty</span>

          <strong>
            {facultyList.length}
          </strong>
        </div>


        <div className="summary-card">
          <span>Available</span>

          <strong>
            {facultyList.length}
          </strong>
        </div>


        <div className="summary-card">
          <span>Underloaded</span>

          <strong>
            {getUnderloadedCount()}
          </strong>
        </div>


        <div className="summary-card">
          <span>Overloaded</span>

          <strong>
            {getOverloadedCount()}
          </strong>
        </div>

      </div>


      {/* ======================================
          FACULTY TABLE
      ====================================== */}

      <div className="faculty-table">

        {/* Table Header */}

        <div className="table-header">

          <span>
            Faculty ID
          </span>

          <span>
            Name
          </span>

          <span>
            Designation
          </span>

          <span>
            Max Hours
          </span>

          <span>
            Action
          </span>

        </div>


        {/* Loading State */}

        {loading ? (

          <div className="empty-state">

            <h3>
              Loading faculty...
            </h3>

            <p>
              Getting faculty information
              from the database.
            </p>

          </div>

        ) : facultyList.length === 0 ? (

          /* Empty State */

          <div className="empty-state">

            <h3>
              No faculty added yet
            </h3>

            <p>
              Add your Data Science faculty
              to start building the workload
              system.
            </p>

          </div>

        ) : (

          /* Faculty Rows */

          facultyList.map((faculty) => (

            <div
              className="table-row"
              key={faculty.id}
            >

              {/* Faculty ID */}

              <span>
                {faculty.facultyId}
              </span>


              {/* Name + Email */}

              <span>

                <strong>
                  {faculty.name}
                </strong>

                <small>
                  {faculty.email}
                </small>

              </span>


              {/* Designation */}

              <span>
                {faculty.designation}
              </span>


              {/* Maximum Hours */}

              <span>
                {faculty.maxHours} hrs/week
              </span>


              {/* Delete */}

              <button
                className="delete-button"
                onClick={() =>
                  handleDelete(faculty.id)
                }
                disabled={
                  deletingId === faculty.id
                }
              >
                {deletingId === faculty.id
                  ? "Deleting..."
                  : "Delete"}
              </button>

            </div>

          ))

        )}

      </div>

    </main>
  );
}

export default Faculty;