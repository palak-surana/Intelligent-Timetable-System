import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Faculty from "./pages/Faculty";
import Classes from "./pages/Classes";
import Subjects from "./pages/Subjects";
import Timetable from "./pages/Timetable";
import Workload from "./pages/Workload";
import Rooms from "./pages/Rooms";

function App() {
  const [backendStatus, setBackendStatus] = useState("Checking...");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/health")
      .then((response) => response.json())
      .then((data) => {
        setBackendStatus(data.status);
      })
      .catch(() => {
        setBackendStatus("Backend not connected");
      });
  }, []);

  return (
    <BrowserRouter>
      <div className="app">
        <Sidebar />

        <div className="main">
          <Navbar />

          <div className="backend-status">
            Backend: {backendStatus}
          </div>

          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/faculty" element={<Faculty />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/timetable" element={<Timetable />} />
            <Route path="/workload" element={<Workload />} />
            <Route path="/rooms" element={<Rooms />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;