// App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "react-big-schedule/dist/css/style.css";
import HomePage from './components/HomePage';
import Employees from './components/Employees';
import EmployeeDetails from './components/EmployeeDetails';
import Navigation from './components/Navigation';
import Schedule from './components/Schedule';

function App() {
  return (
    <Router>
      <div className="app-container">
        <h1 className="app-title">Raq&Staff</h1>
        <Navigation />
        <main className="app-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/employees/:id" element={<EmployeeDetails />} />
            <Route path="/schedules" element={<Schedule />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
